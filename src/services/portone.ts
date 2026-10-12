/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as PortOne from '@portone/browser-sdk/v2';

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
  orderName: string;
  amount: number;
  payMethod: KgInicisPayMethod;
  customer: CustomerInfo;
  customData?: Record<string, unknown>;
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
}

export interface PaymentFailureResult {
  success: false;
  code?: string;
  message: string;
}

export type PaymentExecutionResult = PaymentSuccessResult | PaymentFailureResult;

// 포트원 환경변수 또는 브라우저 로컬스토리지 저장 키 로드
const STORAGE_STORE_ID_KEY = 'simple_kras_portone_store_id';
const STORAGE_CHANNEL_KEY = 'simple_kras_portone_channel_key';

export function getPortOneConfig(): { storeId: string; channelKey: string } {
  const envStoreId = (import.meta.env.VITE_PORTONE_STORE_ID || '').trim();
  const envChannelKey = (import.meta.env.VITE_PORTONE_CHANNEL_KEY || '').trim();

  const localStoreId = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_STORE_ID_KEY) || '' : '').trim();
  const localChannelKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_CHANNEL_KEY) || '' : '').trim();

  return {
    storeId: localStoreId || envStoreId,
    channelKey: localChannelKey || envChannelKey,
  };
}

export function savePortOneConfig(storeId: string, channelKey: string) {
  if (typeof window !== 'undefined') {
    if (storeId) localStorage.setItem(STORAGE_STORE_ID_KEY, storeId.trim());
    if (channelKey) localStorage.setItem(STORAGE_CHANNEL_KEY, channelKey.trim());
  }
}

export function isPortOneConfigured(): boolean {
  const { storeId } = getPortOneConfig();
  return Boolean(storeId && storeId !== 'store-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
}

/**
 * KG이니시스 결제창 호출 함수
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
    const paymentPayload: any = {
      storeId,
      paymentId: uniquePaymentId,
      orderName: params.orderName,
      totalAmount: params.amount,
      currency: 'CURRENCY_KRW',
      payMethod: params.payMethod,
      customer: {
        fullName: params.customer.fullName || '고객',
        phoneNumber: params.customer.phoneNumber || '010-0000-0000',
        email: params.customer.email || 'customer@example.com',
      },
      redirectUrl: `${window.location.origin}/payment/complete`,
    };

    // KG이니시스 채널 키가 지정되어 있는 경우 전달
    if (channelKey) {
      paymentPayload.channelKey = channelKey;
    }

    if (params.customData) {
      paymentPayload.customData = JSON.stringify(params.customData);
    }

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

    return {
      success: true,
      paymentId: uniquePaymentId,
      txId: (response as any)?.txId || (response as any)?.paymentId || uniquePaymentId,
      orderName: params.orderName,
      amount: params.amount,
      method: params.payMethod,
      paidAt: new Date().toISOString(),
      receiptUrl: (response as any)?.receiptUrl
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
