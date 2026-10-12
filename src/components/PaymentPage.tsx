/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Landmark, 
  Smartphone, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Settings,
  ExternalLink,
  Lock,
  Zap,
  Building2,
  Receipt
} from 'lucide-react';
import { getCurrentUser } from '../config/auth';
import { 
  requestKgInicisPayment, 
  getPortOneConfig, 
  savePortOneConfig, 
  isPortOneConfigured,
  KgInicisPayMethod,
  PaymentSuccessResult 
} from '../services/portone';

interface PaymentPageProps {
  amount: number;
  description?: string;
  onSuccess?: (result: PaymentSuccessResult) => void;
  onCancel?: () => void;
}

export default function PaymentPage({ 
  amount, 
  description = 'SIMPLE KRAS 위험성평가 플랫폼 구독',
  onSuccess,
  onCancel 
}: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<KgInicisPayMethod>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedPayment, setCompletedPayment] = useState<PaymentSuccessResult | null>(null);

  // 주문자 정보
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  // 포트원 연동 설정 모달
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [storeIdInput, setStoreIdInput] = useState('');
  const [channelKeyInput, setChannelKeyInput] = useState('');
  const [configured, setConfigured] = useState(false);

  // 초기 사용자 정보 및 포트원 설정 로드
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.displayName) setCustomerName(user.displayName);
      if (user.email) setCustomerEmail(user.email);
    }
    
    const config = getPortOneConfig();
    setStoreIdInput(config.storeId);
    setChannelKeyInput(config.channelKey);
    setConfigured(isPortOneConfigured());
  }, []);

  const paymentMethods: {
    id: KgInicisPayMethod;
    name: string;
    sub: string;
    icon: typeof CreditCard;
    badge?: string;
  }[] = [
    {
      id: 'CARD',
      name: '신용 / 체크카드',
      sub: '국내 모든 카드사, 앱카드, 무이자 할부',
      icon: CreditCard,
      badge: '가장 많이 이용'
    },
    {
      id: 'EASY_PAY',
      name: '간편결제',
      sub: '카카오페이 / 네이버페이 / 토스페이 / PAYCO',
      icon: Zap,
      badge: '원클릭 결제'
    },
    {
      id: 'TRANSFER',
      name: '실시간 계좌이체',
      sub: '주요 은행 실시간 즉시 이체',
      icon: Landmark,
    },
    {
      id: 'VIRTUAL_ACCOUNT',
      name: '가상계좌 (무통장)',
      sub: '발급된 전용 가상계좌로 이체',
      icon: Receipt,
    },
    {
      id: 'MOBILE',
      name: '휴대폰 소액결제',
      sub: '통신사 요금 합산 청구',
      icon: Smartphone,
    },
  ];

  const handleSaveConfig = () => {
    savePortOneConfig(storeIdInput, channelKeyInput);
    setConfigured(isPortOneConfigured());
    setShowConfigModal(false);
  };

  const handleExecutePayment = async () => {
    if (!customerName.trim()) {
      setErrorMessage('주문자 성명/담당자명을 입력해 주세요.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('연락처(휴대폰 번호)를 입력해 주세요.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await requestKgInicisPayment({
        orderName: description,
        amount,
        payMethod: selectedMethod,
        customer: {
          fullName: customerName.trim(),
          phoneNumber: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
        },
        customData: {
          companyName: companyName.trim() || undefined,
          service: 'SIMPLE-KRAS-CONSTRUCTION',
        }
      });

      if (result.success) {
        setCompletedPayment(result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        setErrorMessage(result.message || '결제가 완료되지 않았습니다.');
        // 포트원 미연동 상태일 때 모달 유도
        if (result.code === 'CONFIG_MISSING') {
          setShowConfigModal(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || '결제 통신 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 결제 완료 화면
  if (completedPayment) {
    return (
      <div className="bg-slate-50 min-h-screen py-10 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            결제가 정상 완료되었습니다
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            KG이니시스를 통한 안전 결제가 정상 처리되었습니다.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-sm space-y-3 mb-6">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">주문 상품</span>
              <span className="font-semibold text-slate-900">{completedPayment.orderName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">결제 금액</span>
              <span className="font-bold text-blue-600 text-base">₩{completedPayment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">주문 번호</span>
              <span className="font-mono text-xs text-slate-700">{completedPayment.paymentId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">거래 고유 ID</span>
              <span className="font-mono text-xs text-slate-700">{completedPayment.txId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">결제 일시</span>
              <span className="text-slate-700">{new Date(completedPayment.paidAt).toLocaleString('ko-KR')}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.href = '/';
              }}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-sm"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={18} />
            이전으로
          </button>
          
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm"
            title="포트원 PG 연동 설정"
          >
            <Settings size={14} />
            <span>포트원 PG 연동 정보</span>
            {configured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1"></span>
            )}
          </button>
        </div>

        {/* 연동 준비 상태 안내 배너 */}
        <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
          configured 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50/90 border-amber-200 text-amber-900'
        }`}>
          <div className="mt-0.5">
            {configured ? (
              <ShieldCheck className="text-emerald-600" size={20} />
            ) : (
              <AlertCircle className="text-amber-600" size={20} />
            )}
          </div>
          <div className="flex-1 text-xs leading-relaxed">
            {configured ? (
              <div>
                <p className="font-bold text-sm mb-0.5">KG이니시스 PG 실시간 결제 연동 활성화</p>
                <p className="text-emerald-700">포트원(PortOne) 공식 SDK를 통해 KG이니시스 결제창이 안전하게 실행됩니다.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm mb-0.5">포트원(PortOne) KG이니시스 연동 대기 중</p>
                  <button 
                    onClick={() => setShowConfigModal(true)}
                    className="underline font-bold text-amber-800 hover:text-amber-900"
                  >
                    연동 키 입력하기 →
                  </button>
                </div>
                <p className="text-amber-700">
                  <a href="https://admin.portone.io" target="_blank" rel="noopener noreferrer" className="underline font-medium">PortOne 관리자 콘솔</a>에서 발급받은 <strong>Store ID</strong>와 <strong>Channel Key</strong>를 설정하시면 실제 결제창이 연동됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
                KG INICIS PG 안전결제
              </span>
              <h1 className="text-xl font-black text-slate-900">
                {description}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-1">결제 예정 금액</span>
              <span className="text-3xl font-black text-slate-900">
                ₩{amount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">(VAT 포함)</span>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-slate-600" />
            주문자 / 현장 정보
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                주문자 성명 / 담당자 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                휴대폰 번호 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                이메일 주소 (전자세금계산서/영수증 수신)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="user@company.co.kr"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                회사명 / 현장명 (선택)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="예: (주)한국안전건설 평택현장"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard size={18} className="text-slate-600" />
              결제 수단 선택
            </span>
            <span className="text-xs font-normal text-slate-500">KG이니시스 통합 결제창 제공</span>
          </h2>

          <div className="space-y-2.5">
            {paymentMethods.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{m.name}</span>
                        {m.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">{m.sub}</span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-6 flex items-start gap-3 text-rose-800 text-xs leading-relaxed">
            <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">결제 오류 안내: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Security & Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock size={14} className="text-slate-400" />
            <span>256-bit SSL 암호화 통신 및 KG이니시스 결제 보안 규정 준수</span>
          </div>

          <button
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white rounded-xl font-bold text-base transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>KG이니시스 결제창을 불러오는 중...</span>
              </>
            ) : (
              <>
                <span>₩{amount.toLocaleString()} KG이니시스 결제하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 포트원 연동 정보 설정 모달 */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">포트원 (PortOne) 연동 설정</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              <a 
                href="https://admin.portone.io/application/list" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                PortOne 관리자 콘솔 <ExternalLink size={12} />
              </a>
              에서 발급받으신 식별코드를 등록하시면 실제 KG이니시스 결제가 바로 작동합니다.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store ID (가맹점 / 고객사 식별코드)
                </label>
                <input
                  type="text"
                  placeholder="예: store-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={storeIdInput}
                  onChange={(e) => setStoreIdInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">포트원 콘솔 &gt; 결제 연동 &gt; 식별·인증정보에서 확인 가능</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Channel Key (KG이니시스 채널 키)
                </label>
                <input
                  type="text"
                  placeholder="예: channel-key-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={channelKeyInput}
                  onChange={(e) => setChannelKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">포트원 콘솔 &gt; 결제 연동 &gt; 채널 관리 (KG이니시스)에서 확인</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                설정 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
