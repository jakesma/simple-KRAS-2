import { X } from 'lucide-react';

interface RefundPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RefundPolicy({ isOpen, onClose }: RefundPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">환불정책 및 취소규정 (일반결제 · 정기결제)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 mb-4">
              시행일: 2026년 8월 12일
            </p>
            <p className="font-semibold mb-2">
              본 정책은 오토모 연구소(이하 "회사")의 SIMPLE-KRAS 위험성평가 서비스 이용에 따른 상품별 서비스 제공기간, 일반결제 환불규정 및 정기결제 환불규정을 규정합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">1. 상품별 서비스 제공기간 및 결제 방식</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① <span className="font-semibold text-gray-900">PLUS 플랜 (₩35,000, VAT 포함):</span> 서비스 제공기간은 <span className="font-semibold text-emerald-700">결제일로부터 1개월(30일)</span>이며, 1회성 단건 일반결제로 제공됩니다. (자동 연장·자동 결제 없음)</p>
              <p>② <span className="font-semibold text-gray-900">PRO 플랜 (₩380,000, VAT 포함):</span> 서비스 제공기간은 <span className="font-semibold text-emerald-700">결제일로부터 12개월(1년)</span>이며, 1회성 단건 일반결제로 제공됩니다. (자동 연장·자동 결제 없음)</p>
              <p>③ <span className="font-semibold text-gray-900">카드 할부 이용 안내:</span> 비실물 장기 서비스 기준에 따라 신용카드 할부 결제 시 <span className="font-semibold">비씨카드는 최대 3개월, 그 외 카드사는 최대 6개월</span>까지 이용 가능합니다.</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">2. 일반결제(단건 이용권) 환불 규정</h3>
            <div className="space-y-4 ml-2">
              <div>
                <p className="font-semibold text-gray-900 mb-1">2.1 PLUS 플랜 (1개월 이용권 · ₩35,000 · 일반결제)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><span className="font-semibold">결제일로부터 7일 이내 & 미사용 시:</span> 위험성평가 생성·출력·다운로드 등 서비스 이용 내역이 없는 경우 결제금액 <span className="font-semibold">100% 전액 환불</span>합니다.</li>
                  <li><span className="font-semibold">서비스 이용 개시 후 또는 결제 후 7일 경과 시:</span> 전자상거래법 제17조 제2항에 따른 디지털 콘텐츠 제공 개시 및 1개월 단기 이용권 특성상 잔여 기간에 대한 부분 환불이 제한됩니다. (단, 회사 귀책사유 및 서비스 장애 시 일할 계산 환불)</li>
                  <li>제공기간(1개월) 만료 시 자동 종료되며, 추가 요금이 자동 결제되지 않습니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">2.2 PRO 플랜 (12개월 이용권 · ₩380,000 · 일반결제)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><span className="font-semibold">결제일로부터 7일 이내 & 미사용 시:</span> 위험성평가 생성·출력·다운로드 등 서비스 이용 내역이 없는 경우 결제금액 <span className="font-semibold">100% 전액 환불</span>합니다.</li>
                  <li><span className="font-semibold">이용 내역이 있거나 결제일로부터 7일 경과 시:</span> 결제금액(380,000원)에서 <span className="font-semibold">기 이용 개월 수(1개월 미만 사용분은 1개월로 산정) × 월 정상가(35,000원) 및 위약금(잔여 결제대금의 10%)을 공제한 잔액</span>을 환불합니다. (공제 합계액이 결제금액 이상인 경우 환불 불가)</li>
                  <li>제공기간(12개월) 만료 시 자동 종료되며, 추가 요금이 자동 결제되지 않습니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">2.3 FREE 플랜 (무료)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>FREE 플랜은 무료로 제공되며 결제 및 환불 대상이 아닙니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">3. 정기결제(자동결제) 환불 및 해지 규정</h3>
            <p className="text-xs text-slate-600 mb-2">
              ※ 현재 당사 사이트에서 판매하는 PLUS·PRO 상품은 모두 1회성 일반결제 상품으로 운영되며, 추후 정기결제(자동결제) 상품을 운영하는 경우 아래 규정이 적용됩니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
              <li><span className="font-semibold">정기결제 수단:</span> 정기결제는 신용카드로만 이용 가능합니다.</li>
              <li><span className="font-semibold">결제일로부터 7일 이내 & 미사용 시:</span> 해당 회차 결제금액 100% 전액 환불(카드 승인 취소) 처리됩니다.</li>
              <li><span className="font-semibold">중도 해지(자동결제 해지):</span> 이용자는 언제든지 정기결제 해지를 신청할 수 있으며, 해지 신청 시 다음 결제 주기부터 자동 결제가 즉시 중단됩니다.</li>
              <li><span className="font-semibold">당월 이용분 처리:</span> 이미 결제된 회차에서 서비스 이용 내역이 있는 경우 당월 이용기간 종료일까지 서비스를 이용할 수 있으며, 차기 회차부터 과금되지 않습니다.</li>
              <li><span className="font-semibold">과오납 및 중복 결제:</span> 시스템 오류 등으로 중복 결제된 금액은 확인 즉시 100% 전액 취소·환불합니다.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">4. 환불 신청 절차 및 처리 기간</h3>
            <div className="space-y-3 ml-4">
              <p className="font-semibold">Step 1: 환불 신청</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>고객 지원팀 전화(010-6491-6210) 또는 이메일(jake3082kk@gmail.com)로 주문번호 및 환불 사유 접수</li>
              </ul>

              <p className="font-semibold mt-3">Step 2: 환불 심사</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>회사는 신청 접수 후 1~2 영업일 내 이용 내역 및 서비스 제공기간 경과 여부를 확인하여 안내합니다.</li>
              </ul>

              <p className="font-semibold mt-3">Step 3: 환불 처리</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>신용카드/체크카드: 원 결제 카드 승인 취소(또는 부분 취소)로 처리되며 카드사 사정에 따라 영업일 기준 3~5일 소요됩니다.</li>
                <li>계좌이체/가상계좌(무통장): 환불 승인 후 영업일 기준 3일 이내 신청하신 본인 명의 환불 계좌로 입금됩니다.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">5. 회사의 귀책사유에 따른 환불 특례</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사의 귀책사유에 따른 서비스 장애로 인해 정상적인 서비스 이용이 불가능한 경우, 이용 제한 기간에 해당하는 금액을 전액 환불하거나 서비스 제공기간을 연장합니다.</p>
              <p>② 본 정책에 명시되지 않은 사항은 「전자상거래 등에서의 소비자보호에 관한 법률」 및 소비자분쟁해결기준을 우선 적용합니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">6. 고객 지원</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 ml-4 text-gray-600">
              <div><span className="font-semibold">상호명:</span> 오토모 연구소</div>
              <div><span className="font-semibold">대표자:</span> 김계환</div>
              <div><span className="font-semibold">전화:</span> 010-6491-6210</div>
              <div><span className="font-semibold">이메일:</span> jake3082kk@gmail.com</div>
              <div><span className="font-semibold">사업장 주소:</span> 경기도 평택시 소사7로 8, 108동 804호</div>
              <div><span className="font-semibold">운영시간:</span> 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-xs text-gray-600">
              본 환불정책 및 취소규정은 2026년 8월 12일부터 시행됩니다. 관련 법령에 따라 본 정책보다 이용자에게 유리한 규정이 적용될 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
