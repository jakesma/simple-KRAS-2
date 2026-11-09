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
}

export interface PaymentFailureResult {
  success: false;
  code?: string;
  message: string;
}

export type PaymentExecutionResult = PaymentSuccessResult | PaymentFailureResult;

// 고정된 포트원 Store ID 및 KG이니시스 Channel Key (영구 적용)
export const DEFAULT_PORTONE_STORE_ID = 'store-6926905d-7ea7-4062-8309-61df1411c29b';
export const DEFAULT_PORTONE_CHANNEL_KEY = 'channel-key-c65d82b3-22cc-4db4-9bce-3a8266440159';

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
        fullName: safeName,
        phoneNumber: safePhone,
        email: safeEmail,
      },
      redirectUrl: `${window.location.origin}/`,
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

