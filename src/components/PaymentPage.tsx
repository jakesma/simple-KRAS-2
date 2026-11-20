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
  Lock,
  Zap,
  Building2,
  Receipt
} from 'lucide-react';
import { getCurrentUser } from '../config/auth';
import { PAID_PLANS, PaidPlanKey } from '../config/plans';
import { 
  requestKgInicisPayment, 
  verifyRedirectedPayment,
  KgInicisPayMethod,
  PaymentSuccessResult,
  PaymentFailureResult 
} from '../services/portone';

interface PaymentPageProps {
  amount?: number;
  description?: string;
  planKey?: PaidPlanKey; // 지정 시 플랜 전용 결제 화면(금액/주문명/기능/테마)
  onSuccess?: (result: PaymentSuccessResult) => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

export default function PaymentPage({ 
  amount: amountProp, 
  description: descriptionProp,
  planKey,
  onSuccess,
  onCancel,
  onComplete 
}: PaymentPageProps) {
  const plan = planKey ? PAID_PLANS[planKey] : null;
  const amount = plan?.amount ?? amountProp ?? 0;
  const description = plan?.orderName ?? descriptionProp ?? 'SIMPLE KRAS 위험성평가 플랫폼 구독';
  const [selectedMethod, setSelectedMethod] = useState<KgInicisPayMethod>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedPayment, setCompletedPayment] = useState<PaymentSuccessResult | null>(null);

  // 주문자 정보
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [agreedPolicy, setAgreedPolicy] = useState(false);

  // 초기 사용자 정보 로드 및 모바일 리디렉션 결제 검증
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.displayName) setCustomerName(user.displayName);
      if (user.email) setCustomerEmail(user.email);
    }
    const redirectedPaymentId = new URLSearchParams(window.location.search).get('paymentId');
    if (redirectedPaymentId && planKey) {
      setIsProcessing(true);
      void verifyRedirectedPayment(redirectedPaymentId, planKey).then((result) => {
        if (result.success) {
          setCompletedPayment(result);
          onSuccess?.(result);
          window.history.replaceState({}, '', window.location.pathname);
        } else if ('message' in result) {
          setErrorMessage(result.message);
        }
      }).catch((error: Error) => {
        setErrorMessage(error.message || '리디렉션 결제 확인 중 오류가 발생했습니다.');
      }).finally(() => {
        setIsProcessing(false);
      });
    }
  }, [planKey]);

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
      sub: '국내 모든 카드사, 앱카드 (비씨카드 할부 최대 3개월 / 외 카드사 최대 6개월)',
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

  const handleExecutePayment = async () => {
    const effectiveName = customerName.trim() || '비회원 구매자';
    const effectivePhone = customerPhone.trim() || '010-0000-0000';
    const effectiveEmail = customerEmail.trim() || 'guest@simplekrascon.xyz';
    if (!customerName.trim()) setCustomerName(effectiveName);
    if (!customerPhone.trim()) setCustomerPhone(effectivePhone);
    if (!customerEmail.trim()) setCustomerEmail(effectiveEmail);
    if (plan && !agreedPolicy) setAgreedPolicy(true);

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const customerInfo = {
        fullName: customerName.trim(),
        phoneNumber: customerPhone.trim(),
        email: customerEmail.trim() || undefined,
      };

      const result = await requestKgInicisPayment({
        plan: planKey || 'Plus',
        orderName: description,
        amount,
        payMethod: selectedMethod,
        customer: {
          fullName: effectiveName,
          phoneNumber: effectivePhone,
          email: effectiveEmail,
        },
        offerPeriodInterval: plan?.offerPeriodInterval,
        customData: {
          service: 'SIMPLE-KRAS-CONSTRUCTION',
          plan: planKey || 'Plus',
          isGuest: !getCurrentUser(),
        }
      });

      if (result.success) {
        setCompletedPayment(result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const failure = result as PaymentFailureResult;
        setErrorMessage(failure.message || '결제가 완료되지 않았습니다.');
        // 영구 연동 적용됨
      }
    } catch (err: any) {
      setErrorMessage(err.message || '결제 통신 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGuestAutoFill = () => {
    if (!customerName.trim()) setCustomerName('비회원 구매자');
    if (!customerPhone.trim()) setCustomerPhone('010-0000-0000');
    if (!customerEmail.trim()) setCustomerEmail('guest@simplekrascon.xyz');
    setAgreedPolicy(true);
    setErrorMessage(null);
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
              <span className="text-slate-500">구매자 구분</span>
              <span className="font-semibold text-slate-900">
                {customerName || '고객'} ({getCurrentUser() ? '회원' : '비회원 주문'})
              </span>
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

          {!getCurrentUser() && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left mb-6 flex items-start gap-2.5">
              <span className="text-base">🎉</span>
              <div>
                <p className="font-bold text-emerald-900">비회원 구매 권한 활성화 완료</p>
                <p className="mt-0.5 text-emerald-700 leading-relaxed">
                  회원가입 없이도 위험성평가 플랫폼의 모든 유료 기능을 즉시 사용하실 수 있습니다. 아래 버튼을 눌러 플랫폼으로 바로 이동하세요.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (onComplete) onComplete();
                else if (onCancel) onCancel();
                else window.location.href = '/';
              }}
              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              {getCurrentUser() ? '대시보드로 돌아가기' : '플랫폼 바로 시작하기'}
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
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>KG이니시스 안전결제 연동됨</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5"></span>
          </div>
        </div>

        <div className="p-4 rounded-xl border mb-6 flex items-start gap-3 bg-emerald-50/80 border-emerald-200 text-emerald-900">
          <div className="mt-0.5">
            <ShieldCheck className="text-emerald-600" size={20} />
          </div>
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-sm mb-0.5">KG이니시스 PG 서버 검증 결제 활성화</p>
            <p className="text-emerald-700">결제 완료 후 PortOne 서버 API에서 결제 상태와 금액을 다시 확인한 경우에만 이용권이 활성화됩니다.</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className={`bg-white rounded-2xl shadow-sm border p-6 mb-6 ${plan ? plan.theme.card : 'border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border mb-2 ${plan ? plan.theme.badge : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                {plan ? `${plan.label} 플랜 · ${plan.period}` : 'KG INICIS PG 안전결제'}
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
          {plan && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-3">{plan.tagline}</p>
              <p className="text-xs text-slate-700 mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">서비스 제공기간 </span>
                {plan.servicePeriod}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={14} className={plan.theme.check} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Customer Information Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-slate-600" />
              주문자 / 현장 정보
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={13} />
              {getCurrentUser() ? '회원 연동 결제' : '비회원 간편 구매 지원'}
            </span>
          </div>

          {!getCurrentUser() && (
            <div className="mb-4 p-4 bg-emerald-50/90 rounded-xl border-2 border-emerald-400 text-xs text-emerald-950 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <p className="font-bold text-sm text-emerald-950">비회원 로그인 적용됨 · 회원가입 없이 즉시 결제 가능</p>
                </div>
                <button
                  type="button"
                  onClick={handleGuestAutoFill}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                >
                  비회원 주문정보 간편 자동입력
                </button>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                별도의 회원 로그인 없이 아래 주문자 성명과 휴대폰 번호만 입력(또는 우측 상단 <strong>비회원 주문정보 간편 자동입력</strong> 클릭)하시면 바로 결제를 진행하실 수 있으며, 결제 완료 즉시 플랫폼 이용 권한이 부여됩니다.
              </p>
            </div>
          )}

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

        {/* 환불규정 / 서비스 제공기간 동의 (일반결제·정기결제 별도 규정) */}
        {plan && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Receipt size={18} className="text-slate-600" />
              일반결제 환불규정
            </h2>
            <p className="text-[11px] text-slate-500 mb-3">
              1회 결제 후 서비스 제공기간 동안 이용하는 상품이며, 자동 갱신(정기결제)되지 않습니다.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4 mb-3">
              {plan.refundPolicy.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 mb-4 space-y-1">
              <p className="font-bold text-slate-800">카드사 할부 및 정기결제 환불규정 안내</p>
              <p>• 비실물 장기 서비스 제공 기준에 따라 신용카드 할부는 <strong>비씨카드 최대 3개월 / 그 외 카드사 최대 6개월</strong>까지 이용 가능합니다.</p>
              <p>• 현재 판매 상품은 모두 1회성 일반결제 상품(자동결제 없음)입니다. (정기결제 상품 운영 시: 신용카드 전용, 결제 후 7일 이내 미사용 시 100% 환불, 중도 해지 시 차기 결제일부터 자동결제 즉시 중단 및 당월 잔여기간 이용 보장)</p>
            </div>
            <label className="flex items-start gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                서비스 제공기간 및 환불규정을 확인하였으며 이에 동의합니다. <span className="text-rose-500">(필수)</span>
              </span>
            </label>
          </div>
        )}

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
            className={`w-full py-4 px-6 bg-gradient-to-r ${plan ? plan.theme.button : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'} active:scale-[0.99] text-white rounded-xl font-bold text-base transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
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
    </div>
  );
}
