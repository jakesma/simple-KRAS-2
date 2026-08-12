import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">개인정보 처리 방침</h2>
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
              오토보연구소(이하 "회사" 또는 "당사")는 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 준수하며, 개인정보 처리에 있어 이용자의 기본적 인권을 보호합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">1. 수집하는 개인정보의 항목</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">① 필수 정보</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>이메일 주소</li>
                  <li>휴대폰 번호</li>
                  <li>회사명 (사업장명)</li>
                  <li>사업자등록번호</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">② 선택 정보</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>담당자 이름</li>
                  <li>사업장 주소</li>
                  <li>업무 분야</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">③ 서비스 이용 과정에서 자동으로 수집되는 정보</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>IP 주소</li>
                  <li>쿠키</li>
                  <li>서비스 이용 기록</li>
                  <li>접속 시간 및 이용 행태</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">2. 개인정보의 수집 및 이용목적</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>회원가입 및 계정 관리</li>
              <li>위험성평가 서비스 제공 및 개선</li>
              <li>사용자 맞춤형 서비스 제공</li>
              <li>결제 처리 및 요금 청구</li>
              <li>서비스 관련 공지 및 고객 지원</li>
              <li>법적 의무 이행 (세금계산서 발행 등)</li>
              <li>부정행위 방지 및 보안</li>
              <li>마케팅 및 이벤트 정보 제공 (동의 시)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">3. 개인정보의 보유 및 이용기간</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">일반 원칙</p>
                <p className="text-gray-600">
                  개인정보는 수집 및 이용 목적이 달성된 후에는 지체 없이 파기합니다. 단, 관련 법령에 따라 보존할 필요가 있는 경우는 예외입니다.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">법령 보존 기간</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>계약 또는 청약 철회 관련 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>대금결제 및 재화 등의 공급 관련 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>세금계산서: 5년 (국세청 기준)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h3>
            <p className="text-gray-600 mb-3 ml-4">
              당사는 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외입니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>이용자의 명시적 동의가 있는 경우</li>
              <li>법령에 의거 제공이 필요한 경우</li>
              <li>서비스 제공에 필수적인 제3자 (결제 대행사, 배송 회사 등)</li>
              <li>통계 작성, 학술 연구 등을 위해 필요한 경우 (가명 또는 익명 처리 후)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">5. 개인정보의 안전성 확보 조치</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><span className="font-semibold">기술적 조치:</span> SSL/TLS 암호화, 접근 제어, 침입탐지 시스템</li>
              <li><span className="font-semibold">관리적 조치:</span> 개인정보 최소화, 직원 교육, 접근권한 관리</li>
              <li><span className="font-semibold">물리적 조치:</span> 출입통제, CCTV 등의 보안 시설</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">6. 개인정보 주체의 권리</h3>
            <p className="text-gray-600 mb-3 ml-4">
              이용자는 다음의 권리를 가집니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><span className="font-semibold">열람 요청:</span> 당사가 보유하고 있는 개인정보의 내용 확인</li>
              <li><span className="font-semibold">수정 요청:</span> 오류가 있는 개인정보의 수정</li>
              <li><span className="font-semibold">삭제 요청:</span> 개인정보의 삭제 (「개인정보보호법」 제18조 규정에 해당하는 경우)</li>
              <li><span className="font-semibold">처리 중단 요청:</span> 처리 중단을 요청할 수 있습니다.</li>
            </ul>
            <p className="text-gray-600 mt-3 ml-4">
              위의 권리를 행사하시려면 개인정보 처리 담당자에게 서면, 전자우편 등으로 연락하시기 바랍니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">7. 개인정보 처리 담당자 및 담당부서</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 ml-4 text-gray-600">
              <div><span className="font-semibold">회사명:</span> 오토보연구소</div>
              <div><span className="font-semibold">대표자:</span> 김계환</div>
              <div><span className="font-semibold">개인정보 보호책임자:</span> 김계환</div>
              <div><span className="font-semibold">연락처:</span> 031-650-0229</div>
              <div><span className="font-semibold">이메일:</span> contact@automosafety.co.kr</div>
              <div><span className="font-semibold">사업장 주소:</span> 경기도 평택시 소사고로 8, 108동 804호</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">8. 개인정보 분쟁 해결</h3>
            <p className="text-gray-600 ml-4 mb-3">
              이용자는 개인정보 처리와 관련하여 불만이 있는 경우 다음의 기관에 분쟁 해결을 요청할 수 있습니다:
            </p>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold mb-1">개인정보분쟁조정위원회</p>
                <p className="text-gray-600">
                  전화: (국번없이) 1833-6958<br />
                  홈페이지: www.kopico.go.kr
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">개인정보보호 종합상담 (개인정보보호위원회)</p>
                <p className="text-gray-600">
                  전화: (국번없이) 1388<br />
                  홈페이지: www.pipc.go.kr
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">9. 정책 변경</h3>
            <p className="text-gray-600 ml-4">
              본 개인정보 처리 방침은 법률 변경 또는 회사의 정책 변경에 따라 변경될 수 있습니다. 변경 시 홈페이지에 공지합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">10. 추가 정보</h3>
            <div className="space-y-2 ml-4">
              <p className="text-gray-600">
                <span className="font-semibold">Firebase 데이터 보호:</span> 본 서비스는 Google Firebase를 사용하며, 데이터는 Google의 안전한 서버에 저장됩니다.
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">쿠키 사용:</span> 서비스 이용 편의를 위해 쿠키를 사용할 수 있습니다. 쿠키 관련 상세 내용은 브라우저 설정에서 제어할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-xs text-gray-600">
              본 개인정보 처리 방침은 2026년 8월 12일부터 시행됩니다.
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
