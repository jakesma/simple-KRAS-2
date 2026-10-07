/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  CreditCard, 
  Landmark, 
  Smartphone, 
  DollarSign,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'phone-payment' | 'deposit';

interface PaymentPageProps {
  amount: number;
  description?: string;
  onSuccess?: (result: PaymentResult) => void;
  onCancel?: () => void;
}

interface PaymentResult {
  method: PaymentMethod;
  amount: number;
  timestamp: string;
  transactionId: string;
}

export default function PaymentPage({ 
  amount, 
  description = 'SIMPLE KRAS 위험성평가 플랫폼 결제',
  onSuccess,
  onCancel 
}: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'input' | 'confirm' | 'complete'>('select');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardholderName: '',
    bankCode: '',
    accountNumber: '',
    accountHolder: '',
    phoneNumber: '',
    phoneOperator: '',
    depositAmount: amount.toString(),
    depositorName: '',
  });
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'credit-card' as const,
      label: '신용카드',
      icon: CreditCard,
      description: '국내/해외 신용카드로 결제',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bank-transfer' as const,
      label: '계좌이체',
      icon: Landmark,
      description: '은행 계좌에서 직접 이체',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'phone-payment' as const,
      label: '휴대폰결제',
      icon: Smartphone,
      description: '휴대폰 요금에 자동 청구',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'deposit' as const,
      label: '무통장입금',
      icon: DollarSign,
      description: 'ATM/인터넷뱅킹 이용',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const banks = [
    { code: '004', name: '국민은행' },
    { code: '020', name: '우리은행' },
    { code: '088', name: '신한은행' },
    { code: '105', name: '하나은행' },
    { code: '103', name: '농협중앙회' },
  ];

  const phoneOperators = [
    { id: 'SKT', name: 'SKT' },
    { id: 'KT', name: 'KT' },
    { id: 'LG', name: 'LG U+' },
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentStep('input');
    setError(null);
  };

  const validateCreditCard = () => {
    const cardNum = formData.cardNumber.replace(/\s/g, '');
    if (cardNum.length !== 16) {
      setError('카드번호는 16자리이어야 합니다');
      return false;
    }
    if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      setError('유효기간은 MM/YY 형식이어야 합니다');
      return false;
    }
    if (formData.cardCvc.length !== 3) {
      setError('CVC는 3자리이어야 합니다');
      return false;
    }
    if (!formData.cardholderName) {
      setError('카드소유자명을 입력해주세요');
      return false;
    }
    return true;
  };

  const validateBankTransfer = () => {
    if (!formData.bankCode) {
      setError('은행을 선택해주세요');
      return false;
    }
    if (!formData.accountNumber) {
      setError('계좌번호를 입력해주세요');
      return false;
    }
    if (!formData.accountHolder) {
      setError('예금주명을 입력해주세요');
      return false;
    }
    return true;
  };

  const validatePhonePayment = () => {
    if (!formData.phoneOperator) {
      setError('이동통신사를 선택해주세요');
      return false;
    }
    if (!formData.phoneNumber.replace(/\D/g, '').match(/^01\d{7,8}$/)) {
      setError('올바른 휴대폰번호를 입력해주세요');
      return false;
    }
    return true;
  };

  const validateDeposit = () => {
    if (!formData.depositorName) {
      setError('입금자명을 입력해주세요');
      return false;
    }
    return true;
  };

  const handleValidation = () => {
    switch (selectedMethod) {
      case 'credit-card':
        return validateCreditCard();
      case 'bank-transfer':
        return validateBankTransfer();
      case 'phone-payment':
        return validatePhonePayment();
      case 'deposit':
        return validateDeposit();
      default:
        return false;
    }
  };

  const handlePaymentConfirm = async () => {
    if (!handleValidation()) {
      return;
    }

    setPaymentStep('confirm');
  };

  const handlePaymentExecute = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 실제 환경에서는 이니시스 API 호출
      // await window.KG_INICIS.pay({...})
      
      // 데모: 2초 후 결제 완료
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = `INICIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const result: PaymentResult = {
        method: selectedMethod!,
        amount,
        timestamp: new Date().toISOString(),
        transactionId
      };

      setPaymentStep('complete');
      onSuccess?.(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (paymentStep === 'input') {
      setSelectedMethod(null);
      setPaymentStep('select');
    } else if (paymentStep === 'confirm') {
      setPaymentStep('input');
    }
    setError(null);
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    setPaymentStep('select');
    setFormData({
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardholderName: '',
      bankCode: '',
      accountNumber: '',
      accountHolder: '',
      phoneNumber: '',
      phoneOperator: '',
      depositAmount: amount.toString(),
      depositorName: '',
    });
    onCancel?.();
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            결제 시스템
          </h1>
          <p className="text-sm text-slate-600">
            KG이니시스 안전결제
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-600">결제 금액</span>
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
              {description}
            </span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2">
            ₩{amount.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Payment Methods Selection */}
        {paymentStep === 'select' && (
          <div className="space-y-3 mb-8">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-900 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`bg-gradient-to-br ${method.color} p-3 rounded-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{method.label}</div>
                        <div className="text-xs text-slate-600">{method.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Payment Input Form */}
        {paymentStep === 'input' && selectedMethod && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8 space-y-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {paymentMethods.find(m => m.id === selectedMethod)?.label}
              </h2>
              <button
                onClick={handleBack}
                className="text-sm text-slate-600 hover:text-slate-900 font-semibold"
              >
                이전
              </button>
            </div>

            {/* Credit Card Form */}
            {selectedMethod === 'credit-card' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
                  <div className="text-sm opacity-75 mb-8">Card Number</div>
                  <div className="text-xl font-mono tracking-widest mb-8">
                    {formData.cardNumber.padEnd(16, '•')}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75">Card Holder</div>
                      <div className="font-semibold">{formData.cardholderName || 'YOUR NAME'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-75">Expires</div>
                      <div className="font-semibold">{formData.cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    카드 번호
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
                      setFormData(prev => ({ ...prev, cardNumber: formatted }));
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      유효기간
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) {
                          val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        }
                        setFormData(prev => ({ ...prev, cardExpiry: val }));
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      CVC
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setFormData(prev => ({ ...prev, cardCvc: val }));
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    카드소유자명
                  </label>
                  <input
                    type="text"
                    placeholder="HONG GILDONG"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Form */}
            {selectedMethod === 'bank-transfer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    은행 선택
                  </label>
                  <select
                    value={formData.bankCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  >
                    <option value="">은행을 선택하세요</option>
                    {banks.map(bank => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    계좌번호
                  </label>
                  <input
                    type="text"
                    placeholder="계좌번호 입력 (숫자만)"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, accountNumber: val }));
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    예금주명
                  </label>
                  <input
                    type="text"
                    placeholder="예금주 이름"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Phone Payment Form */}
            {selectedMethod === 'phone-payment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    이동통신사
                  </label>
                  <select
                    value={formData.phoneOperator}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneOperator: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  >
                    <option value="">이동통신사 선택</option>
                    {phoneOperators.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    휴대폰번호
                  </label>
                  <input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      let formatted = val;
                      if (val.length > 3) {
                        formatted = val.slice(0, 3) + '-' + val.slice(3);
                      }
                      if (val.length > 7) {
                        formatted = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
                      }
                      setFormData(prev => ({ ...prev, phoneNumber: formatted }));
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-xs text-purple-700">
                    💡 휴대폰 요금에 ₩{amount.toLocaleString()}가 자동으로 청구됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* Deposit Form */}
            {selectedMethod === 'deposit' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="text-sm font-bold text-amber-900 mb-2">입금 계좌</div>
                  <div className="text-lg font-mono font-bold text-amber-900">
                    국민은행 123-456-789012 (SIMPLE KRAS)
                  </div>
                  <div className="text-xs text-amber-700 mt-2">
                    위의 계좌로 ₩{amount.toLocaleString()}를 입금해주세요.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    입금자명
                  </label>
                  <input
                    type="text"
                    placeholder="입금자 이름"
                    value={formData.depositorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, depositorName: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-700 flex gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>입금이 확인되면 결제가 완료됩니다. (보통 1시간 이내)</span>
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                이전
              </button>
              <button
                onClick={handlePaymentConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Payment Confirmation */}
        {paymentStep === 'confirm' && selectedMethod && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                결제 확인
              </h2>
              <p className="text-sm text-slate-600">
                결제 정보를 확인하고 진행해주세요.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">결제 수단</span>
                <span className="font-semibold text-slate-900">
                  {paymentMethods.find(m => m.id === selectedMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">상품명</span>
                <span className="font-semibold text-slate-900">{description}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-slate-900">결제 금액</span>
                <span className="text-xl font-black text-blue-600">
                  ₩{amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                결제를 진행함으로써 서비스 약관 및 개인정보 처리방침에 동의합니다.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPaymentStep('input')}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-50"
              >
                이전
              </button>
              <button
                onClick={handlePaymentExecute}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    결제 진행 중...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    결제 완료
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment Complete */}
        {paymentStep === 'complete' && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8 text-center space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Check size={32} className="text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                결제가 완료되었습니다!
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                거래번호: <span className="font-mono font-bold text-slate-900">
                  {/* Transaction ID will be shown from payment result */}
                </span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex justify-between mb-3">
                <span className="text-slate-700">결제 수단</span>
                <span className="font-semibold text-slate-900">
                  {paymentMethods.find(m => m.id === selectedMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between mb-3 pb-3 border-b border-green-200">
                <span className="text-slate-700">결제 금액</span>
                <span className="font-bold text-green-600 text-lg">
                  ₩{amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">결제 일시</span>
                <span className="font-mono text-sm text-slate-600">
                  {new Date().toLocaleString('ko-KR')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.href = '/';
              }}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}

        {/* Cancel Button */}
        {paymentStep !== 'complete' && (
          <div className="text-center">
            <button
              onClick={handleCancel}
              className="text-sm text-slate-600 hover:text-slate-900 font-semibold"
            >
              결제 취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
