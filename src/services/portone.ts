/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as PortOne from '@portone/browser-sdk/v2';
import type { PaidPlanKey } from '../config/plans';

export type KgInicisPayMethod = 
  | 'CARD'            // 신용/체크카드 (앱카드, ISP, 일반)
  | 'TRANSFER'        // 실시간 계좌이체
  | 'VIRTUAL_ACCOUNT' // 가상계좌(무통장입금)
  | 'MOBILE'          // 휴대폰 소액결제
  | 'EASY_PAY';       // 간편결제 (카카오페이, 네이버페이, 토스 등)

export interface CustomerInfo {
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

export interface PaymentRequestParams {
  plan: PaidPlanKey;
  orderName: string;
  amount: number;
  payMethod: KgInicisPayMethod;
  customer: CustomerInfo;
  customData?: Record<string, unknown>;
  /** 서비스 제공기간(예: '1m', '1y') — KG이니시스 장기 서비스 필수 표기 */
  offerPeriodInterval?: string;
}

export interface PaymentSuccessResult {
  success: true;
  paymentId: string;
  txId?: string;
  orderName: string;
  amount: number;
  method: KgInicisPayMethod;
  paidAt: string;
  receiptUrl?: string;
  expiresAt?: string;
}

export interface PaymentFailureResult {
  success: false;
  code?: string;
  message: string;
}

export type PaymentExecutionResult = PaymentSuccessResult | PaymentFailureResult;

export interface VerifiedEntitlement {
  paymentId: string;
  transactionId: string;
  orderName: string;
  amount: number;
  paidAt: string;
  receiptUrl?: string;
  plan: PaidPlanKey;
  expiresAt: string;
}

export interface EntitlementResult {
  active: boolean;
  entitlement: VerifiedEntitlement | null;
}

// 고정된 포트원 Store ID 및 KG이니시스 Channel Key (영구 적용)
export const DEFAULT_PORTONE_STORE_ID = 'store-6926905d-7ea7-4062-8309-61df1411c29b';
export const DEFAULT_PORTONE_CHANNEL_KEY = 'channel-key-882e0ba4-06a2-4129-bf5e-4e4c106c607c';

export function getPortOneConfig(): { storeId: string; channelKey: string } {
  const envStoreId = (import.meta.env?.VITE_PORTONE_STORE_ID || '').trim();
  const envChannelKey = (import.meta.env?.VITE_PORTONE_CHANNEL_KEY || '').trim();

  const validEnvStore = envStoreId && !envStoreId.includes('xxxxxxxx') ? envStoreId : '';
  const validEnvChannel = envChannelKey && !envChannelKey.includes('xxxxxxxx') ? envChannelKey : '';

  return {
    storeId: validEnvStore || DEFAULT_PORTONE_STORE_ID,
    channelKey: validEnvChannel || DEFAULT_PORTONE_CHANNEL_KEY,
  };
}

export function savePortOneConfig(_storeId: string, _channelKey: string) {
  // 영구 키가 코드에 내장되어 별도 저장이 필요하지 않습니다.
}

export function isPortOneConfigured(): boolean {
  return true;
}

const API_BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null) as {
    message?: string;
    code?: string;
  } | null;
  if (!response.ok) {
    const error = new Error(body?.message || '결제 서버 요청에 실패했습니다.');
    (error as Error & { code?: string }).code = body?.code;
    throw error;
  }
  return body as T;
}

async function createPaymentSession(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/payments/session`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await parseApiResponse<{ success: true; customerId: string }>(response);
  if (!result || typeof result.customerId !== 'string' || !result.customerId) {
    throw new Error('결제 서버가 올바른 세션 정보를 반환하지 않았습니다.');
  }
  return result.customerId;
}

async function verifyPaymentOnServer(
  paymentId: string,
  transactionId: string | undefined,
  plan: PaidPlanKey,
): Promise<VerifiedEntitlement> {
  const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, transactionId, plan }),
  });
  const result = await parseApiResponse<{
    success: true;
    entitlement: VerifiedEntitlement;
  }>(response);
  if (!result?.entitlement || result.entitlement.paymentId !== paymentId) {
    throw new Error('결제 서버의 검증 응답이 올바르지 않습니다.');
  }
  return result.entitlement;
}

export async function getVerifiedEntitlement(): Promise<EntitlementResult> {
  const response = await fetch(`${API_BASE_URL}/api/payments/entitlement`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  const result = await parseApiResponse<{
    success: true;
    active: boolean;
    entitlement: VerifiedEntitlement | null;
  }>(response);
  if (!result || typeof result.active !== 'boolean') {
    throw new Error('이용권 서버 응답이 올바르지 않습니다.');
  }
  return {
    active: result.active,
    entitlement: result.entitlement,
  };
}

export async function verifyRedirectedPayment(
  paymentId: string,
  plan: PaidPlanKey,
): Promise<PaymentExecutionResult> {
  try {
    const verified = await verifyPaymentOnServer(paymentId, undefined, plan);
    return {
      success: true,
      paymentId: verified.paymentId,
      txId: verified.transactionId,
      orderName: verified.orderName,
      amount: verified.amount,
      method: 'CARD',
      paidAt: verified.paidAt,
      receiptUrl: verified.receiptUrl,
      expiresAt: verified.expiresAt,
    };
  } catch (error) {
    const typedError = error as Error & { code?: string };
    return {
      success: false,
      code: typedError.code || 'VERIFICATION_FAILED',
      message: typedError.message,
    };
  }
}

/**
 * KG이니시스 일반결제창 호출 함수
 */
export async function requestKgInicisPayment(
  params: PaymentRequestParams
): Promise<PaymentExecutionResult> {
  const { storeId, channelKey } = getPortOneConfig();

  if (!storeId) {
    return {
      success: false,
      code: 'CONFIG_MISSING',
      message: 'PortOne Store ID(고객사 식별코드)가 설정되지 않았습니다. 관리자 콘솔(admin.portone.io) 정보를 등록해주세요.'
    };
  }

  // 결제 고유 식별자 생성 (주문 식별용: 영문/숫자/하이픈)
  const uniquePaymentId = `kras-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  try {
    const customerId = await createPaymentSession();
    const rawPhone = (params.customer.phoneNumber || '').replace(/[^0-9-]/g, '');
    const safePhone = /[0-9]{8,}/.test(rawPhone.replace(/-/g, '')) ? rawPhone : '010-0000-0000';
    const rawEmail = (params.customer.email || '').trim();
    const safeEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(rawEmail)
      ? rawEmail
      : 'guest@simplekrascon.xyz';
    const safeName = (params.customer.fullName || '고객').replace(/[<>'"&%;]/g, '').trim() || '고객';

    // KG이니시스 표준결제창(INIStdPay)은 CARD(신용/체크카드) 창 내에 카카오페이·네이버페이·토스페이·페이코 등
    // 간편결제가 기본 통합 제공됩니다. PortOne V2에서 EASY_PAY 단독 호출 시 easyPayProvider 필수 에러가 발생하므로
    // EASY_PAY 선택 시에도 KG이니시스 통합 카드/간편결제창(CARD)이 호출되도록 매핑합니다.
    const effectivePayMethod = params.payMethod === 'EASY_PAY' ? 'CARD' : params.payMethod;

    const paymentPayload: any = {
      storeId,
      paymentId: uniquePaymentId,
      orderName: params.orderName,
      totalAmount: params.amount,
      currency: 'KRW',
      payMethod: effectivePayMethod,
      // 비실물(디지털) 장기 서비스
      productType: 'DIGITAL',
      customer: {
        customerId,
        fullName: safeName,
        phoneNumber: safePhone,
        email: safeEmail,
      },
      redirectUrl: `${window.location.origin}/?view=payment-${params.plan.toLowerCase()}&paymentId=${encodeURIComponent(uniquePaymentId)}`,
    };

    // 서비스 제공기간 (KG이니시스 장기 서비스 필수)
    if (params.offerPeriodInterval) {
      paymentPayload.offerPeriod = { interval: params.offerPeriodInterval };
    }

    // KG이니시스 심사 조건: 비실물 장기 서비스는 BC카드 할부 최대 3개월 / 타 카드사 최대 6개월.
    // 카드사별 개월 수를 나눌 수 없으므로 두 조건을 모두 만족하는 최대 3개월로 제한합니다.
    if (effectivePayMethod === 'CARD') {
      paymentPayload.card = {
        installment: { monthOption: { availableMonthList: [2, 3] } },
      };
    }

    // KG이니시스 채널 키가 지정되어 있는 경우 전달
    if (channelKey) {
      paymentPayload.channelKey = channelKey;
    }

    if (params.payMethod === 'VIRTUAL_ACCOUNT') {
      paymentPayload.virtualAccount = {
        accountExpiry: { validHours: 24 },
      };
    }

    // 주의: KG이니시스 V2는 customData(merchantData)에 한글이 포함되면
    // "[V023] 파라미터의 데이터 설정이 잘못되었습니다. [merchantData 한글 사용 불가]" 오류가 발생하므로
    // customData는 전달하지 않거나 영문/숫자(ASCII)만 허용합니다.

    const response = await PortOne.requestPayment(paymentPayload);

    // 에러 발생 여부 검사 (V2 SDK에서는 실패 시 code 필드가 반환됨)
    if (response && (response as any).code != null) {
      const err = response as any;
      return {
        success: false,
        code: err.code,
        message: err.message || '결제가 취소되었거나 승인되지 않았습니다.'
      };
    }

    const verified = await verifyPaymentOnServer(
      uniquePaymentId,
      (response as any)?.txId || (response as any)?.paymentId,
      params.plan,
    );

    return {
      success: true,
      paymentId: verified.paymentId,
      txId: verified.transactionId,
      orderName: verified.orderName,
      amount: verified.amount,
      method: params.payMethod,
      paidAt: verified.paidAt,
      receiptUrl: verified.receiptUrl,
      expiresAt: verified.expiresAt,
    };
  } catch (error: any) {
    console.error('KG이니시스 PortOne 결제 처리 에러:', error);
    return {
      success: false,
      code: 'REQUEST_FAILED',
      message: error?.message || '결제 진행 중 오류가 발생했습니다.'
    };
  }
}

