/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PaidPlanKey = 'Plus' | 'Pro';

export interface PaidPlanInfo {
  key: PaidPlanKey;
  /** 화면 표기용 이름 */
  label: string;
  /** 결제 금액 (VAT 포함, 원) */
  amount: number;
  /** 결제 주기 표기 */
  period: string;
  /** 서비스 제공기간 (결제창 및 요금제 카드 표기 필수) */
  servicePeriod: string;
  /** 포트원 offerPeriod.interval 값 (예: '1m', '1y') */
  offerPeriodInterval: string;
  /** 환불규정 (일반결제 기준, RefundPolicy 모달과 동일) */
  refundPolicy: string[];
  /** 결제창 설명(주문명) */
  orderName: string;
  tagline: string;
  features: string[];
  /** Tailwind 테마 클래스 */
  theme: {
    badge: string;
    price: string;
    button: string;
    check: string;
    card: string;
  };
}

export const PAID_PLANS: Record<PaidPlanKey, PaidPlanInfo> = {
  Plus: {
    key: 'Plus',
    label: 'PLUS',
    amount: 35000,
    period: '1개월 이용권 (일반결제)',
    servicePeriod: '결제일로부터 1개월(30일) 제공 · 자동 연장/정기결제 없음 (만료 후 필요 시 재결제)',
    offerPeriodInterval: '1m',
    refundPolicy: [
      '[일반결제 - 1개월 이용권] 결제일로부터 7일 이내이며 위험성평가 생성·출력·다운로드 등 서비스 이용 내역이 없는 경우 결제금액 100% 전액 환불합니다.',
      '서비스 이용 내역이 있거나 결제 후 7일이 경과한 경우, 전자상거래법 제17조 제2항에 따른 디지털 콘텐츠 제공 개시 및 단기(1개월) 이용권 특성상 잔여 기간에 대한 부분 환불이 제한됩니다. (단, 회사 귀책사유 및 서비스 장애 시 일할 계산 환불)',
      '본 상품은 1회성 단건 일반결제 상품으로 매월 자동 결제(정기결제)되지 않으며, 별도의 해지 신청 없이 제공기간(1개월) 만료 시 자동 종료됩니다.',
      '카드 결제 환불은 원 결제 카드 승인 취소로 처리되며(영업일 기준 3~5일 소요), 가상계좌·계좌이체 환불은 신청하신 본인 명의 계좌로 환급됩니다.',
    ],
    orderName: 'SIMPLE KRAS PLUS 1개월 이용권 (일반결제)',
    tagline: '개인·소규모 현장을 위한 1개월 무제한 위험성평가 이용권',
    features: [
      '위험성평가 무제한',
      'TBM 무제한',
      'PDF + Excel 출력',
      '템플릿 저장 (20개)',
      '프로젝트 관리',
    ],
    theme: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      price: 'text-emerald-700',
      button:
        'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20',
      check: 'text-emerald-600',
      card: 'border-emerald-200',
    },
  },
  Pro: {
    key: 'Pro',
    label: 'PRO',
    amount: 380000,
    period: '12개월 이용권 (일반결제 · 약 10% 할인)',
    servicePeriod: '결제일로부터 12개월(1년) 제공 · 자동 연장/정기결제 없음 (만료 후 필요 시 재결제)',
    offerPeriodInterval: '1y',
    refundPolicy: [
      '[일반결제 - 12개월 이용권] 결제일로부터 7일 이내이며 위험성평가 생성·출력·다운로드 등 서비스 이용 내역이 없는 경우 결제금액 100% 전액 환불합니다.',
      '이용 내역이 있거나 결제일로부터 7일이 경과한 경우, 결제금액(380,000원)에서 기 이용 개월 수(1개월 미만 사용분은 1개월로 산정) × 월 정상가(35,000원) 및 위약금(잔여 결제대금의 10%)을 공제한 잔액을 환불합니다. (공제 합계액이 결제금액 이상인 경우 환불 불가)',
      '본 상품은 1회성 단건 일반결제 상품으로 자동 갱신(정기결제)되지 않으며, 서비스 제공기간(12개월) 만료 시 자동 종료됩니다.',
      '카드 결제 환불은 원 결제 카드 승인 취소(또는 부분 취소)로 처리되며(영업일 기준 3~5일 소요), 가상계좌·계좌이체 환불은 신청하신 본인 명의 계좌로 환급됩니다.',
    ],
    orderName: 'SIMPLE KRAS PRO 12개월 이용권 (일반결제)',
    tagline: '다수 현장·팀 단위 관리를 위한 12개월 업무용 이용권',
    features: [
      'PLUS 모든 기능',
      '팀원 공유 (최대 5명)',
      '회사 템플릿 관리',
      '다수 현장 관리',
      '관리자 대시보드',
      '우선 고객 지원',
    ],
    theme: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      price: 'text-amber-700',
      button:
        'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20',
      check: 'text-amber-600',
      card: 'border-amber-200',
    },
  },
};
