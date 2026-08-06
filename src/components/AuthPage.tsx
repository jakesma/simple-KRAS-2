import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { signUp, signIn, sendResetEmail } from '../config/auth';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
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

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    const result = await signIn(email, password);

    if (result.success) {
      setSuccess('로그인되었습니다.');
      setTimeout(() => {
        onAuthSuccess();
      }, 1000);
    } else {
      setError(result.error || '로그인에 실패했습니다.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        
        {/* Main Container */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Form */}
          <div className="space-y-6">
            
            {/* Logo & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-full shadow-lg hover:shadow-xl transition">
                <span className="text-2xl font-black text-white">K</span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">KRAS</h1>
                <p className="text-lg text-gray-600 font-semibold">위험성평가 관리 플랫폼</p>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' && '로그인'}
                {mode === 'signup' && '계정 만들기'}
                {mode === 'reset' && '비밀번호 재설정'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {mode === 'login' && '안전하게 로그인하세요'}
                {mode === 'signup' && '새로운 계정을 만들어 시작하세요'}
                {mode === 'reset' && '가입한 이메일을 입력하세요'}
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex gap-3">
                <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'login' ? handleSignIn : mode === 'signup' ? handleSignUp : handleResetPassword} className="space-y-4">
              
              {/* Name Field (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    이름
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@company.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    비밀번호 {mode === 'signup' && '(최소 6자)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-gray-50 hover:bg-white"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
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
                className="w-full py-3.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl mt-6"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    진행 중...
                  </>
                ) : (
                  <>
                    {mode === 'login' && '로그인'}
                    {mode === 'signup' && '가입하기'}
                    {mode === 'reset' && '재설정 이메일 보내기'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="flex items-center justify-between text-sm pt-2">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setError('');
                      setEmail('');
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold"
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
                    계정 만들기
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

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-semibold">또는</span>
              </div>
            </div>

            {/* Social Login */}
            <button className="w-full py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-full hover:bg-gray-50 transition flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 계속하기
            </button>
          </div>

          {/* Right Side - Illustration & QR Code */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-8">
            
            {/* Decorative Elements */}
            <div className="relative w-80 h-96">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl transform rotate-3"></div>
              
              {/* Card 1 */}
              <div className="absolute top-0 left-4 bg-white rounded-2xl shadow-xl p-6 w-56 transform -rotate-6 hover:rotate-0 transition duration-300 hover:shadow-2xl">
                <div className="w-full h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-lg mb-3"></div>
                <h3 className="font-bold text-gray-900 text-sm">위험성평가</h3>
                <p className="text-xs text-gray-600 mt-1">자동 생성 및 관리</p>
              </div>

              {/* Card 2 */}
              <div className="absolute top-24 right-2 bg-white rounded-2xl shadow-xl p-6 w-56 transform rotate-6 hover:rotate-0 transition duration-300 hover:shadow-2xl">
                <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg mb-3"></div>
                <h3 className="font-bold text-gray-900 text-sm">안전관리</h3>
                <p className="text-xs text-gray-600 mt-1">통합 대시보드</p>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 w-56">
                <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3"></div>
                <h3 className="font-bold text-gray-900 text-sm">실시간 동기화</h3>
                <p className="text-xs text-gray-600 mt-1">클라우드 기반</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition">
              <p className="text-center text-gray-600 text-sm font-semibold mb-4">
                모바일 앱 다운로드
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 w-32 h-32 mx-auto flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-xs text-gray-500 mt-2">QR코드</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                QR 코드로 앱에 접속하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
