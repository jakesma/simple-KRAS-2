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
          <h2 className="text-2xl font-bold text-gray-900">환불정책 및 취소규정</h2>
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
              본 정책은 오토모 연구소(이하 "회사")의 SIMPLE-KRAS 위험성평가 서비스 이용에 따른 환불, 취소, 반품에 관한 규정입니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">1. 구독 취소 및 환불 기본 규칙</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">1.1 구독 취소</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>이용자는 언제든지 마이페이지에서 구독을 취소할 수 있습니다.</li>
                  <li>취소 신청은 즉시 처리되며, 다음 결제일에 자동으로 해지됩니다.</li>
                  <li>취소 후에도 현재 결제 기간이 종료될 때까지 서비스 이용이 가능합니다.</li>
                  <li>결제 기간 만료 후 서비스 접근이 제한됩니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">1.2 환불 정책 - 월간 플랜 (PLUS: ₩35,000/월)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><span className="font-semibold">구독 후 7일 이내:</span> 100% 전액 환불</li>
                  <li><span className="font-semibold">구독 후 8~14일:</span> 50% 환불 (사용 기간 기준)</li>
                  <li><span className="font-semibold">구독 후 15일 이상:</span> 환불 불가</li>
                  <li>월간 플랜 환불은 해당 결제 수단으로 진행됩니다.</li>
                  <li>환불 처리는 신청 후 3~5 영업일 소요됩니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">1.3 환불 정책 - 연간 플랜 (PRO: ₩380,000/년)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><span className="font-semibold">구독 후 30일 이내:</span> 100% 전액 환불</li>
                  <li><span className="font-semibold">구독 후 31~90일:</span> 70% 환불</li>
                  <li><span className="font-semibold">구독 후 91~180일:</span> 50% 환불</li>
                  <li><span className="font-semibold">구독 후 180일 이상:</span> 환불 불가</li>
                  <li>연간 플랜 환불은 해당 결제 수단으로 진행됩니다.</li>
                  <li>환불 처리는 신청 후 3~5 영업일 소요됩니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">1.4 FREE 플랜 (무료)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>FREE 플랜은 항상 무료이며 환불 대상이 아닙니다.</li>
                  <li>이용자는 언제든지 무료 플랜 사용을 중단할 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">2. 환불 신청 절차</h3>
            <div className="space-y-3 ml-4">
              <p className="font-semibold">Step 1: 환불 신청</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>마이페이지의 "구독 관리" 또는 "결제 내역"에서 환불 신청 버튼 클릭</li>
                <li>또는 고객 지원팀(01064916210)에 이메일로 문의</li>
              </ul>

              <p className="font-semibold mt-3">Step 2: 환불 심사</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>회사는 신청 후 1~2 영업일 내 환불 여부를 검토합니다.</li>
                <li>환불 가능 여부를 이메일로 안내합니다.</li>
              </ul>

              <p className="font-semibold mt-3">Step 3: 환불 처리</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>환불 승인 후 1~3 영업일 내 결제 수단으로 환불됩니다.</li>
                <li>신용카드의 경우 카드사 정산 주기에 따라 3~5일 소요될 수 있습니다.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">3. 환불 불가 사유</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>다음의 경우 환불이 불가능합니다:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>환불 기한을 초과한 경우</li>
                <li>이용자의 귀책사유로 서비스 이용에 제약이 생긴 경우</li>
                <li>부정한 수단으로 구독한 경우</li>
                <li>위험성평가 데이터를 대량으로 다운로드/추출한 후 취소하는 경우</li>
                <li>서비스를 정상적으로 이용한 후 환불을 신청하는 경우 (영업 이유)</li>
                <li>신용카드 분실, 기한 만료 등 결제 수단의 문제로 인한 경우</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">4. 결제 수단별 환불 규정</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">신용카드 / 체크카드</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>환불은 원래 결제 카드로만 처리됩니다.</li>
                  <li>환불액은 카드사 정산 주기에 따라 3~5일 소요됩니다.</li>
                  <li>카드사가 환불을 거절한 경우 회사는 책임지지 않습니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">계좌이체 / 무통장입금</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>환불은 이용자가 지정한 계좌로 진행됩니다.</li>
                  <li>환불 신청 시 정확한 계좌번호를 제공해야 합니다.</li>
                  <li>잘못된 계좌로 입금된 경우 회사는 책임지지 않습니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">기타 결제 수단</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>간편결제(카카오페이, 네이버페이 등)는 해당 플랫폼의 환불 정책을 따릅니다.</li>
                  <li>상세한 환불 일정은 해당 플랫폼의 고객지원팀에 문의하시기 바랍니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">5. 구독 변경 및 다운그레이드</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">5.1 플랜 업그레이드</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>FREE → PLUS 또는 PRO 업그레이드: 즉시 적용되며 차액은 일할 계산됩니다.</li>
                  <li>PLUS → PRO 업그레이드: 차액을 선택한 결제 수단으로 청구합니다.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">5.2 플랜 다운그레이드</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>PLUS → FREE 또는 PRO → PLUS 변경 가능합니다.</li>
                  <li>다운그레이드는 다음 결제 주기부터 적용됩니다.</li>
                  <li>현재 결제 기간 동안 이미 지불한 금액에 대한 환불은 없습니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">6. 자동 갱신 및 해지</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 월간 플랜과 연간 플랜은 자동 갱신됩니다.</p>
              <p>② 이용자는 마이페이지에서 언제든지 자동 갱신을 해제할 수 있습니다.</p>
              <p>③ 자동 갱신 해제 후 현재 결제 기간 종료 시 서비스 접근이 불가능합니다.</p>
              <p>④ 갱신 예정일 3일 전에 이메일로 갱신 안내를 드립니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">7. 데이터 보관 정책</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 구독 취소 후에도 이용자의 데이터(위험성평가, TBM 등)는 30일간 보관됩니다.</p>
              <p>② 30일 경과 후 자동으로 삭제되며, 복구할 수 없습니다.</p>
              <p>③ 이용자는 취소 전에 필요한 데이터를 다운로드하시기 바랍니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">8. 환불 거절 및 분쟁</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사가 환불을 거절한 경우 이유를 상세히 설명합니다.</p>
              <p>② 환불 거절 판정에 이의가 있는 경우 고객 지원팀에 재검토를 요청할 수 있습니다.</p>
              <p>③ 분쟁으로 인한 손해는 이용자가 입은 실제 피해에 한하여 보상됩니다.</p>
              <p>④ 본 정책에 따라 환불이 거절되었으나 소비자 기본법 또는 전자상거래법에 따라 환불해야 하는 경우 해당 법령을 우선 적용합니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">9. 회사의 환불 특례</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 서비스 장애로 인해 7일 이상 서비스를 이용할 수 없었을 경우 해당 기간의 요금을 환불합니다.</p>
              <p>② 회사의 귀책사유로 인한 데이터 손실 시 1년분 요금 환불 또는 무료 이용권을 제공합니다.</p>
              <p>③ 회사는 이용자의 정당한 요청에 대해 특례 환불을 검토할 수 있습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">10. 고객 지원</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 ml-4 text-gray-600">
              <div><span className="font-semibold">전화:</span> 01064916210</div>
              <div><span className="font-semibold">이메일:</span> contact@automosafety.co.kr</div>
              <div><span className="font-semibold">운영시간:</span> 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</div>
              <div><span className="font-semibold">법인명:</span> 오토모 연구소</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">11. 약관 개정</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 본 정책은 법률 변경이나 회사의 사업 정책 변경에 따라 변경될 수 있습니다.</p>
              <p>② 변경 시 최소 7일 전에 홈페이지에 공지합니다.</p>
              <p>③ 공지 기한 내 반대하지 않으면 동의한 것으로 간주합니다.</p>
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
