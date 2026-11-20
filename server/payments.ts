import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { PaymentClient } from '@portone/server-sdk';
import type { Unrecognized } from '@portone/server-sdk';
import {
  isUnrecognizedPayment,
  type Payment,
} from '@portone/server-sdk/payment';

type PaidPlanKey = 'Plus' | 'Pro';

interface PlanRule {
  amount: number;
  orderName: string;
  durationMs: number;
}

interface PaymentSession {
  version: 1;
  customerId: string;
  expiresAt: number;
}

interface Entitlement {
  version: 1;
  customerId: string;
  paymentId: string;
  plan: PaidPlanKey;
  expiresAt: number;
}

interface PaymentVerificationInput {
  paymentId?: unknown;
  transactionId?: unknown;
  plan?: unknown;
}

interface VerifiedPayment {
  paymentId: string;
  transactionId: string;
  orderName: string;
  amount: number;
  paidAt: string;
  receiptUrl?: string;
  plan: PaidPlanKey;
  expiresAt: string;
}

type RecognizedPayment = Exclude<Payment, { readonly status: Unrecognized }>;

export interface PaymentSnapshot {
  status: RecognizedPayment['status'];
  id: string;
  transactionId: string;
  storeId: string;
  customerId?: string;
  currency: string;
  orderName: string;
  amount: {
    total: number;
    paid: number;
    cancelled: number;
  };
  paidAt?: string;
  receiptUrl?: string;
}

const SESSION_COOKIE = 'kras_payment_session';
const ENTITLEMENT_COOKIE = 'kras_payment_entitlement';
const DEFAULT_STORE_ID = 'store-6926905d-7ea7-4062-8309-61df1411c29b';
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 400;

const PLAN_RULES: Record<PaidPlanKey, PlanRule> = {
  Plus: {
    amount: 35_000,
    orderName: 'SIMPLE KRAS PLUS 1개월 이용권 (일반결제)',
    durationMs: 30 * 24 * 60 * 60 * 1000,
  },
  Pro: {
    amount: 380_000,
    orderName: 'SIMPLE KRAS PRO 12개월 이용권 (일반결제)',
    durationMs: 365 * 24 * 60 * 60 * 1000,
  },
};

class PaymentValidationError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
  ) {
    super(message);
  }
}

function getRequiredSecret(name: 'PORTONE_API_SECRET' | 'PAYMENT_SESSION_SECRET'): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new PaymentValidationError(
      `${name} 환경 변수가 설정되지 않았습니다.`,
      503,
      'PAYMENT_SERVER_NOT_CONFIGURED',
    );
  }
  return value;
}

function getStoreId(): string {
  return process.env.PORTONE_STORE_ID?.trim() || DEFAULT_STORE_ID;
}

function getCookieHeader(req: Request): string {
  return req.headers.cookie || '';
}

function getCookie(req: Request, name: string): string | null {
  const prefix = `${name}=`;
  for (const item of getCookieHeader(req).split(';')) {
    const value = item.trim();
    if (value.startsWith(prefix)) {
      return decodeURIComponent(value.slice(prefix.length));
    }
  }
  return null;
}

function signPayload(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createHmac('sha256', getRequiredSecret('PAYMENT_SESSION_SECRET'))
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function readSignedPayload<T>(token: string | null): T | null {
  if (!token) return null;
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const receivedSignature = token.slice(separator + 1);
  const expectedSignature = createHmac('sha256', getRequiredSecret('PAYMENT_SESSION_SECRET'))
    .update(encoded)
    .digest('base64url');
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function serializeCookie(name: string, value: string, maxAgeSeconds: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

function clearCookie(name: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

function isPaymentSession(value: PaymentSession | null): value is PaymentSession {
  return Boolean(
    value
      && value.version === 1
      && typeof value.customerId === 'string'
      && value.customerId.startsWith('kras-customer-')
      && Number.isFinite(value.expiresAt)
      && value.expiresAt > Date.now(),
  );
}

function isEntitlement(value: Entitlement | null): value is Entitlement {
  return Boolean(
    value
      && value.version === 1
      && typeof value.customerId === 'string'
      && typeof value.paymentId === 'string'
      && (value.plan === 'Plus' || value.plan === 'Pro')
      && Number.isFinite(value.expiresAt),
  );
}

function requireSession(req: Request): PaymentSession {
  const session = readSignedPayload<PaymentSession>(getCookie(req, SESSION_COOKIE));
  if (!isPaymentSession(session)) {
    throw new PaymentValidationError(
      '결제 세션이 만료되었습니다. 결제 페이지를 새로고침한 뒤 다시 시도해주세요.',
      401,
      'PAYMENT_SESSION_INVALID',
    );
  }
  return session;
}

function parseVerificationInput(body: unknown): {
  paymentId: string;
  transactionId?: string;
  plan: PaidPlanKey;
} {
  const input = (body || {}) as PaymentVerificationInput;
  const paymentId = typeof input.paymentId === 'string' ? input.paymentId.trim() : '';
  const transactionId = typeof input.transactionId === 'string' ? input.transactionId.trim() : '';
  const plan = input.plan;

  if (!/^kras-[0-9]+-[a-z0-9]{6}$/.test(paymentId)) {
    throw new PaymentValidationError('유효하지 않은 결제 번호입니다.', 400, 'INVALID_PAYMENT_ID');
  }
  if (plan !== 'Plus' && plan !== 'Pro') {
    throw new PaymentValidationError('유효하지 않은 이용권입니다.', 400, 'INVALID_PLAN');
  }

  return {
    paymentId,
    transactionId: transactionId || undefined,
    plan,
  };
}

function getRecognizedPayment(payment: Payment): RecognizedPayment {
  if (isUnrecognizedPayment(payment)) {
    throw new PaymentValidationError(
      '지원하지 않는 결제 상태입니다.',
      409,
      'UNRECOGNIZED_PAYMENT_STATUS',
    );
  }
  return payment;
}

function toPaymentSnapshot(payment: RecognizedPayment): PaymentSnapshot {
  return {
    status: payment.status,
    id: payment.id,
    transactionId: payment.transactionId,
    storeId: payment.storeId,
    customerId: payment.customer.id,
    currency: payment.currency,
    orderName: payment.orderName,
    amount: {
      total: payment.amount.total,
      paid: payment.amount.paid,
      cancelled: payment.amount.cancelled,
    },
    paidAt: 'paidAt' in payment ? payment.paidAt : undefined,
    receiptUrl: 'receiptUrl' in payment ? payment.receiptUrl : undefined,
  };
}

function validatePaymentIdentity(
  payment: PaymentSnapshot,
  paymentId: string,
  transactionId: string | undefined,
  customerId: string,
  plan: PaidPlanKey,
): PlanRule {
  const rule = PLAN_RULES[plan];

  if (payment.id !== paymentId) {
    throw new PaymentValidationError('결제 번호가 일치하지 않습니다.', 409, 'PAYMENT_ID_MISMATCH');
  }
  if (transactionId && payment.transactionId !== transactionId) {
    throw new PaymentValidationError('거래 번호가 일치하지 않습니다.', 409, 'TRANSACTION_ID_MISMATCH');
  }
  if (payment.storeId !== getStoreId()) {
    throw new PaymentValidationError('등록된 상점의 결제가 아닙니다.', 409, 'STORE_ID_MISMATCH');
  }
  if (payment.customerId !== customerId) {
    throw new PaymentValidationError('현재 브라우저에서 요청한 결제가 아닙니다.', 403, 'CUSTOMER_MISMATCH');
  }
  if (payment.currency !== 'KRW') {
    throw new PaymentValidationError('결제 통화가 일치하지 않습니다.', 409, 'CURRENCY_MISMATCH');
  }
  if (payment.orderName !== rule.orderName || payment.amount.total !== rule.amount) {
    throw new PaymentValidationError('상품 또는 결제 금액이 일치하지 않습니다.', 409, 'ORDER_MISMATCH');
  }

  return rule;
}

function validatePaidPayment(
  payment: PaymentSnapshot,
  rule: PlanRule,
  plan: PaidPlanKey,
): VerifiedPayment {
  if (payment.status !== 'PAID') {
    throw new PaymentValidationError(
      payment.status === 'VIRTUAL_ACCOUNT_ISSUED' || payment.status === 'PAY_PENDING'
        ? '입금 확인 대기 중입니다. 입금 완료 후 다시 접속하면 이용권이 활성화됩니다.'
        : '결제가 완료된 상태가 아닙니다.',
      409,
      payment.status === 'VIRTUAL_ACCOUNT_ISSUED' || payment.status === 'PAY_PENDING'
        ? 'PAYMENT_PENDING'
        : 'PAYMENT_NOT_PAID',
    );
  }
  if (payment.amount.paid !== rule.amount || payment.amount.cancelled !== 0) {
    throw new PaymentValidationError(
      '결제 금액이 취소 또는 변경되어 이용권을 활성화할 수 없습니다.',
      409,
      'PAYMENT_AMOUNT_INVALID',
    );
  }

  const paidAt = Date.parse(payment.paidAt || '');
  if (!Number.isFinite(paidAt)) {
    throw new PaymentValidationError('결제 일시를 확인할 수 없습니다.', 409, 'PAID_AT_INVALID');
  }
  const expiresAt = paidAt + rule.durationMs;
  if (expiresAt <= Date.now()) {
    throw new PaymentValidationError('이용권 사용 기간이 만료되었습니다.', 403, 'ENTITLEMENT_EXPIRED');
  }

  return {
    paymentId: payment.id,
    transactionId: payment.transactionId,
    orderName: payment.orderName,
    amount: payment.amount.paid,
    paidAt: payment.paidAt || '',
    receiptUrl: payment.receiptUrl,
    plan,
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

async function fetchAndValidatePayment(
  paymentId: string,
  transactionId: string | undefined,
  customerId: string,
  plan: PaidPlanKey,
): Promise<VerifiedPayment> {
  const client = PaymentClient({ secret: getRequiredSecret('PORTONE_API_SECRET') });
  const payment = toPaymentSnapshot(getRecognizedPayment(await client.getPayment({
    paymentId,
    storeId: getStoreId(),
  })));
  const rule = validatePaymentIdentity(payment, paymentId, transactionId, customerId, plan);
  return validatePaidPayment(payment, rule, plan);
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof PaymentValidationError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });
    return;
  }

  console.error('Payment verification failed:', error);
  res.status(502).json({
    success: false,
    code: 'PAYMENT_PROVIDER_ERROR',
    message: '결제사 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  });
}

export function handlePaymentSession(req: Request, res: Response): void {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: '허용되지 않은 요청입니다.' });
    return;
  }

  try {
    const existing = readSignedPayload<PaymentSession>(getCookie(req, SESSION_COOKIE));
    const session = isPaymentSession(existing)
      ? existing
      : {
          version: 1 as const,
          customerId: `kras-customer-${randomUUID()}`,
          expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000,
        };

    res.setHeader(
      'Set-Cookie',
      serializeCookie(SESSION_COOKIE, signPayload(session), SESSION_LIFETIME_SECONDS),
    );
    res.status(200).json({ success: true, customerId: session.customerId });
  } catch (error) {
    sendError(res, error);
  }
}

export async function handlePaymentVerification(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: '허용되지 않은 요청입니다.' });
    return;
  }

  try {
    const session = requireSession(req);
    const input = parseVerificationInput(req.body);
    const verified = await fetchAndValidatePayment(
      input.paymentId,
      input.transactionId,
      session.customerId,
      input.plan,
    );
    const expiresAt = Date.parse(verified.expiresAt);
    const entitlement: Entitlement = {
      version: 1,
      customerId: session.customerId,
      paymentId: verified.paymentId,
      plan: verified.plan,
      expiresAt,
    };

    res.setHeader(
      'Set-Cookie',
      serializeCookie(
        ENTITLEMENT_COOKIE,
        signPayload(entitlement),
        Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
      ),
    );
    res.status(200).json({ success: true, entitlement: verified });
  } catch (error) {
    sendError(res, error);
  }
}

export async function handlePaymentEntitlement(req: Request, res: Response): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: '허용되지 않은 요청입니다.' });
    return;
  }

  try {
    const session = requireSession(req);
    const entitlement = readSignedPayload<Entitlement>(getCookie(req, ENTITLEMENT_COOKIE));

    if (
      !isEntitlement(entitlement)
      || entitlement.customerId !== session.customerId
      || entitlement.expiresAt <= Date.now()
    ) {
      res.setHeader('Set-Cookie', clearCookie(ENTITLEMENT_COOKIE));
      res.status(200).json({ success: true, active: false, entitlement: null });
      return;
    }

    const verified = await fetchAndValidatePayment(
      entitlement.paymentId,
      undefined,
      session.customerId,
      entitlement.plan,
    );
    res.status(200).json({ success: true, active: true, entitlement: verified });
  } catch (error) {
    if (error instanceof PaymentValidationError && error.code !== 'PAYMENT_SERVER_NOT_CONFIGURED') {
      res.setHeader('Set-Cookie', clearCookie(ENTITLEMENT_COOKIE));
      res.status(200).json({ success: true, active: false, entitlement: null });
      return;
    }
    sendError(res, error);
  }
}

export const paymentValidation = {
  PLAN_RULES,
  validatePaymentIdentity,
  validatePaidPayment,
};
