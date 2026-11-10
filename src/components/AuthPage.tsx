import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader, ArrowRight, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { signUp, signIn, signInWithGoogle, sendResetEmail } from '../config/auth';
import type { PaidPlanKey } from '../config/plans';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onGuestAccess: () => void;
  onBackToLanding?: () => void;
  onGuestPayment?: (plan: PaidPlanKey) => void;
}

export default function AuthPage({
  onAuthSuccess,
  onGuestAccess,
  onBackToLanding,
  onGuestPayment,
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password || !displayName) {
      setError('모든 항목을 입력해주세요.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, displayName);

    if (result.success) {
      setSuccess('계정이 생성되었습니다. 로그인 중입니다...');
      setTimeout(() => {
        onAuthSuccess();
      }, 1500);
    } else {
      setError(result.error || '계정 생성에 실패했습니다.');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const effectiveEmail = email.trim() || 'test@simplekrascon.xyz';
    const effectivePassword = password.trim() || 'test1234!';
    if (!email.trim()) setEmail(effectiveEmail);
    if (!password.trim()) setPassword(effectivePassword);

    const result = await signIn(effectiveEmail, effectivePassword);

    if (result.success) {
      setSuccess('로그인되었습니다.');
      setTimeout(() => {
        onAuthSuccess();
      }, 400);
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }
    setLoading(false);
  };

  const handleTestAccountQuickLogin = async () => {
    setError('');
    setSuccess('');
    setEmail('test@simplekrascon.xyz');
    setPassword('test1234!');
    setLoading(true);
    const result = await signIn('test@simplekrascon.xyz', 'test1234!');
    if (result.success) {
      setSuccess('테스트 회원 계정으로 로그인되었습니다.');
      setTimeout(() => {
        onAuthSuccess();
      }, 300);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('이메일을 입력해주세요.');
      setLoading(false);
      return;
    }

    const result = await sendResetEmail(email);

    if (result.success) {
      setSuccess(result.message || '비밀번호 재설정 이메일을 보냈습니다.');
      setTimeout(() => {
        setMode('login');
        setEmail('');
      }, 2000);
    } else {
      setError(result.error || '이메일 전송에 실패했습니다.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
      setSuccess('Google 계정으로 로그인되었습니다.');
      setTimeout(() => {
        onAuthSuccess();
      }, 500);
    } else {
      setError(result.error || 'Google 로그인에 실패했습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-3 py-8">
      <div className="w-full max-w-[440px]">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            메인 페이지로 돌아가기
          </button>
        )}

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-7 sm:px-8 space-y-5">
          {/* Logo & Title */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-full shadow-sm">
              <span className="text-xl font-black text-white">K</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">KRAS</h1>
              <p className="text-base text-gray-600 font-semibold">위험성평가 관리 플랫폼</p>
            </div>
          </div>

          {/* 비회원 즉시 로그인 및 비회원 바로 결제 카드 (최상단 배치) */}
          <div className="p-4 bg-emerald-50/90 border-2 border-emerald-500 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                비회원 로그인 · 비회원 구매 지원
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-white text-emerald-700 rounded-full border border-emerald-200">
                회원가입 불필요
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              별도의 회원가입이나 아이디/비밀번호 입력 없이 비회원 로그인으로 즉시 플랫폼 이용 및 요금제 결제가 가능합니다.
            </p>
            <button
              type="button"
              onClick={onGuestAccess}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
            >
              <span>비회원 로그인 (즉시 시작하기)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onGuestPayment && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onGuestPayment('Plus')}
                  className="py-2 px-2.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>비회원 PLUS 결제</span>
                </button>
                <button
                  type="button"
                  onClick={() => onGuestPayment('Pro')}
                  className="py-2 px-2.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>비회원 PRO 결제</span>
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-semibold">또는 회원 계정으로 {mode === 'login' ? '로그인' : mode === 'signup' ? '가입' : '비밀번호 재설정'}</span>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                type="button"
                onClick={onGuestAccess}
                className="w-full py-2 bg-white hover:bg-red-100/50 text-red-700 border border-red-300 rounded-lg text-xs font-bold transition"
              >
                계정 없이 비회원 로그인으로 바로 이동하기 →
              </button>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex gap-3">
              <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleSignIn : mode === 'signup' ? handleSignUp : handleResetPassword} className="space-y-3">
            {/* Name Field (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  이름
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email / ID Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                아이디 또는 이메일
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@simplekrascon.xyz (또는 아이디)"
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  비밀번호 {mode === 'signup' && '(최소 6자)'}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2 text-base shadow-sm hover:shadow-md mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  진행 중...
                </>
              ) : (
                <>
                  {mode === 'login' && '회원 로그인'}
                  {mode === 'signup' && '가입하기'}
                  {mode === 'reset' && '재설정 이메일 보내기'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {mode === 'login' && (
              <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl space-y-1.5 mt-2">
                <div className="flex items-center justify-between text-[11px] text-blue-900">
                  <span className="font-bold">카드사/PG 심사용 상시 접속 계정</span>
                  <span className="font-mono text-blue-700">ID: test@simplekrascon.xyz / PW: test1234!</span>
                </div>
                <button
                  type="button"
                  onClick={handleTestAccountQuickLogin}
                  disabled={loading}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>심사용 테스트 회원 계정으로 원클릭 로그인</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setError('');
                    setEmail('');
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  비밀번호를 잊으셨나요?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-gray-600 hover:text-gray-900 font-semibold"
                >
                  회원 계정 만들기
                </button>
              </>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className="text-gray-600 hover:text-gray-900 font-semibold"
              >
                이미 계정이 있으신가요? 로그인
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setEmail('');
                }}
                className="text-gray-600 hover:text-gray-900 font-semibold"
              >
                로그인으로 돌아가기
              </button>
            )}
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 border-2 border-gray-300 text-gray-900 font-bold rounded-full hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-3 text-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
