import { X } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">이용약관</h2>
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
              본 약관은 오토모 연구소(이하 "회사")가 제공하는 SIMPLE-KRAS 위험성평가 플랫폼 서비스(이하 "서비스")의 이용에 관한 기본적인 사항을 규정합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제1조 용어의 정의</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① "회사"는 위험성평가 서비스를 제공하는 오토모 연구소를 말합니다.</p>
              <p>② "이용자"는 본 약관에 동의하고 서비스를 이용하는 자연인 또는 법인을 말합니다.</p>
              <p>③ "계정"은 회원가입 후 부여되는 고유의 사용자 계정을 말합니다.</p>
              <p>④ "서비스"는 SIMPLE-KRAS 위험성평가, TBM 회의록, 템플릿 등 회사가 제공하는 모든 기능을 포함합니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제2조 약관의 효력 및 변경</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 본 약관은 회사의 서비스 이용 페이지에 게시함으로써 효력이 발생합니다.</p>
              <p>② 회사는 필요시 사전 공지 후 본 약관을 변경할 수 있습니다. 변경된 약관은 공지 후 7일 이후에 효력이 발생합니다.</p>
              <p>③ 이용자가 변경된 약관에 동의하지 않으면 서비스 이용을 중단할 수 있습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제3조 서비스 이용의 신청 및 승인</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 이용자는 회사의 회원가입 절차를 거쳐 계정을 개설할 수 있습니다.</p>
              <p>② 이용자는 정확한 정보를 제공해야 하며, 거짓이나 부정확한 정보로 인한 책임은 이용자가 집니다.</p>
              <p>③ 회사는 다음의 경우 서비스 이용을 거절할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
                <li>이용자의 정보가 부정확하거나 불완전한 경우</li>
                <li>부정한 목적으로 서비스를 이용할 우려가 있는 경우</li>
                <li>법령이나 본 약관에 위반되는 행동을 한 경우</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제4조 이용자의 의무</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>이용자는 서비스 이용 시 다음의 행동을 해서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
                <li>법령이나 공중도덕에 위반되는 행동</li>
                <li>서비스의 정상적인 운영을 방해하는 행동</li>
                <li>타인의 개인정보를 도용하거나 이용하는 행동</li>
                <li>타인에 대한 명예훼손, 모욕, 협박, 스팸</li>
                <li>저작권 및 지적재산권 침해 행동</li>
                <li>해킹, 바이러스 유포 등 부정한 접근 시도</li>
                <li>계정을 제3자에게 양도하거나 담보로 제공하는 행동</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제5조 서비스 제공 및 제한</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사는 연중무휴 24시간 서비스를 제공하기 위해 노력합니다.</p>
              <p>② 회사는 다음의 경우 서비스를 일시적으로 중단할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
                <li>시스템 점검 및 유지보수</li>
                <li>네트워크 장애 또는 기술적 문제</li>
                <li>회사가 통제할 수 없는 재해, 재난 등</li>
              </ul>
              <p className="mt-2">③ 긴급 유지보수는 사전 공지 없이 진행될 수 있습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제6조 이용 요금</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① FREE 플랜(월 5회): 무료</p>
              <p>② PLUS 플랜(무제한): ₩35,000/월</p>
              <p>③ PRO 플랜(무제한): ₩250,000/년</p>
              <p>④ 요금은 선택한 결제 수단으로 자동 청구됩니다.</p>
              <p>⑤ 결제 일시는 선택한 결제 수단에 따라 달라질 수 있습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제7조 환불 및 취소</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 환불 및 취소는 별도의 "환불정책"을 따릅니다.</p>
              <p>② 구독 취소는 마이페이지에서 언제든지 가능합니다.</p>
              <p>③ 취소 후 다음 청구일에 구독이 해지됩니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제8조 서비스 내용의 무보증</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사가 제공하는 서비스는 현재 상태 그대로이며, 특정 목적의 적합성, 상품성, 안전성에 대해 명시적 또는 묵시적 보증을 하지 않습니다.</p>
              <p>② 이용자는 서비스 이용 결과에 대한 책임을 집니다.</p>
              <p>③ 회사는 생성된 위험성평가 내용의 정확성, 합법성에 대해 책임지지 않습니다. 최종 검토 및 서명은 이용자의 책임입니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제9조 손해배상</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사의 귀책사유로 인한 손해배상은 이용자가 결제한 해당 월(또는 년)의 요금을 한도로 합니다.</p>
              <p>② 회사는 제8조의 무보증 규정에 따라 발생하는 손해에 대해 배상하지 않습니다.</p>
              <p>③ 이용자의 귀책사유로 인한 손해는 이용자가 배상합니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제10조 계정 보안</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 이용자는 계정의 아이디(이메일)와 비밀번호를 안전하게 관리해야 합니다.</p>
              <p>② 계정으로 인한 모든 활동에 대해 이용자가 책임집니다.</p>
              <p>③ 계정 도용 또는 비정상 접근을 발견한 경우 즉시 회사에 알려야 합니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제11조 지적재산권</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 서비스에 포함된 모든 저작권, 특허권, 상표권 등은 회사 또는 라이센스 제공자에게 귀속됩니다.</p>
              <p>② 이용자는 개인 목적의 이용 범위 내에서만 서비스를 이용할 수 있습니다.</p>
              <p>③ 서비스의 내용을 무단 복제, 배포, 전송, 전개 등은 할 수 없습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제12조 서비스 이용의 중단</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 회사는 이용자가 본 약관을 위반한 경우 서비스 이용을 제한하거나 중단할 수 있습니다.</p>
              <p>② 서비스 중단 시 사전 통지를 할 수 있습니다.</p>
              <p>③ 이용자는 마이페이지에서 서비스 이용을 중단할 수 있습니다.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">제13조 분쟁 해결</h3>
            <div className="space-y-2 ml-4 text-gray-600">
              <p>① 서비스 이용과 관련하여 분쟁이 발생한 경우 협의를 통해 해결합니다.</p>
              <p>② 협의로 해결되지 않는 경우 관할 법원은 회사의 주소지 관할 법원입니다.</p>
              <p>③ 본 약관은 대한민국 법률을 적용받습니다.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-xs text-gray-600">
              본 이용약관은 2026년 8월 12일부터 시행됩니다.
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
