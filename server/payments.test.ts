import assert from 'node:assert/strict';
import test from 'node:test';
import { paymentValidation, type PaymentSnapshot } from './payments';

const validPayment: PaymentSnapshot = {
  status: 'PAID',
  id: 'kras-1795053473373-abc123',
  transactionId: 'transaction-1',
  storeId: 'store-6926905d-7ea7-4062-8309-61df1411c29b',
  customerId: 'kras-customer-test',
  currency: 'KRW',
  orderName: 'SIMPLE KRAS PLUS 1개월 이용권 (일반결제)',
  amount: {
    total: 35_000,
    paid: 35_000,
    cancelled: 0,
  },
  paidAt: new Date().toISOString(),
  receiptUrl: 'https://example.com/receipt',
};

test('accepts an exact paid PLUS payment', () => {
  const rule = paymentValidation.validatePaymentIdentity(
    validPayment,
    validPayment.id,
    validPayment.transactionId,
    validPayment.customerId!,
    'Plus',
  );
  const result = paymentValidation.validatePaidPayment(validPayment, rule, 'Plus');

  assert.equal(result.amount, 35_000);
  assert.equal(result.plan, 'Plus');
  assert.equal(result.paymentId, validPayment.id);
});

test('rejects a payment amount that does not match the selected plan', () => {
  const tamperedPayment: PaymentSnapshot = {
    ...validPayment,
    amount: { ...validPayment.amount, total: 1_000, paid: 1_000 },
  };

  assert.throws(
    () => paymentValidation.validatePaymentIdentity(
      tamperedPayment,
      tamperedPayment.id,
      tamperedPayment.transactionId,
      tamperedPayment.customerId!,
      'Plus',
    ),
    /상품 또는 결제 금액이 일치하지 않습니다/,
  );
});

test('rejects payments created by another browser session', () => {
  assert.throws(
    () => paymentValidation.validatePaymentIdentity(
      validPayment,
      validPayment.id,
      validPayment.transactionId,
      'kras-customer-other',
      'Plus',
    ),
    /현재 브라우저에서 요청한 결제가 아닙니다/,
  );
});

test('rejects partially or fully cancelled payments', () => {
  const cancelledPayment: PaymentSnapshot = {
    ...validPayment,
    amount: { ...validPayment.amount, paid: 30_000, cancelled: 5_000 },
  };
  const rule = paymentValidation.validatePaymentIdentity(
    cancelledPayment,
    cancelledPayment.id,
    cancelledPayment.transactionId,
    cancelledPayment.customerId!,
    'Plus',
  );

  assert.throws(
    () => paymentValidation.validatePaidPayment(cancelledPayment, rule, 'Plus'),
    /결제 금액이 취소 또는 변경/,
  );
});

test('rejects expired entitlements', () => {
  const expiredPayment: PaymentSnapshot = {
    ...validPayment,
    paidAt: '2020-01-01T00:00:00.000Z',
  };
  const rule = paymentValidation.validatePaymentIdentity(
    expiredPayment,
    expiredPayment.id,
    expiredPayment.transactionId,
    expiredPayment.customerId!,
    'Plus',
  );

  assert.throws(
    () => paymentValidation.validatePaidPayment(expiredPayment, rule, 'Plus'),
    /이용권 사용 기간이 만료/,
  );
});
