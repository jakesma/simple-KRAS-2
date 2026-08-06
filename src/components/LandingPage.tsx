import { ArrowRight, CheckCircle2, Zap, BarChart3, FileText, Settings, Download, Users, ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onStartClick: () => void;
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500">B2B Safety Platform</div>
              <div className="text-sm font-bold text-gray-900">KRAS 위험성평가</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">기능</a>
            <a href="#how" className="text-sm text-gray-600 hover:text-gray-900">사용법</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
            <button
              onClick={onStartClick}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
            >
              무료로 시작하기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full">
                AI 기반 위험성평가 자동화
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              위험성평가,
              <br />
              <span className="text-emerald-600">10초</span>면
              <br />
              끝납니다
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              공정을 입력하거나 현장 사진 한 장만 올리면<br />
              AI가 위험성평가표와 TBM 회의록을 즉시 만듭니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onStartClick}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                신규 위험성평가 생성
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onStartClick}
                className="px-8 py-3 border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:border-gray-300 transition"
              >
                사용 방법 보기
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-emerald-600">10–20초</div>
                <div className="text-sm text-gray-600 mt-1">위험성평가 생성 시간</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">무료로 시작 가능</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">산안법</div>
                <div className="text-sm text-gray-600 mt-1">법규 기준 자동 반영</div>
              </div>
            </div>
          </div>

          {/* Right side mockup */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-auto text-xs text-gray-300">KRAS 위험성평가 생성기</div>
              </div>
              <div className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
                    <div className="text-sm font-semibold text-emerald-900">AI 생성 완료</div>
                    <div className="text-sm text-gray-700 mt-2">금속 부품 프레스 성형 공정</div>
                    <div className="text-xs text-gray-500 mt-1">(주)우성정밀공업 · 2026-08-04 · 공정 2개</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100">
                          <span className="text-xs font-bold text-red-700">상</span>
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">끼임 (Entrapment)</div>
                        <div className="text-xs text-gray-500">파워 프레스 작업</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-100">
                          <span className="text-xs font-bold text-yellow-700">중</span>
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">감전 (Electric Shock)</div>
                        <div className="text-xs text-gray-500">아크 용접 작업</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full">
              Problem
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">안전관리자의 현실</h2>
            <p className="text-lg text-gray-600 mt-4">
              위험성평가 한 건 작성에 2~3시간. 법규는 복잡하고, 작업은 매일 바뀝니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: '01', title: '시간 과다 소요', desc: '공정마다 위험요소를 직접 찾고 작성하는 데 수 시간이 걸립니다' },
              { num: '02', title: '표준화 부족', desc: '담당자마다 양식이 달라 품질이 일정하지 않습니다' },
              { num: '03', title: '법규 반영 어려움', desc: '산안법·건설기술진흥법 기준을 모두 파악하기 어렵습니다' },
              { num: '04', title: '반복 작업 과다', desc: '비슷한 공종도 매번 처음부터 다시 작성해야 합니다' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-emerald-600 mb-3">{item.num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">3단계로 끝나는 위험성평가</h2>
            <p className="text-lg text-gray-600 mt-4">
              복잡한 과정 없이, 입력 → AI 생성 → 출력. 단 세 단계입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: '정보 입력', desc: '사업장명, 업무명, 작업 공정 순서를 입력하거나 현장 사진을 업로드합니다' },
              { num: '02', title: 'AI 자동 생성', desc: '산업안전보건법 기준에 따라 위험요소, 위험 수준, 감소대책을 자동 작성합니다' },
              { num: '03', title: '출력 및 저장', desc: '위험성평가표와 TBM 회의록을 PDF로 출력하거나 클라우드에 저장합니다' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                  <span className="text-2xl font-bold text-emerald-600">{item.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full">
              Features
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">안전관리에 필요한 모든 것</h2>
            <p className="text-lg text-gray-600 mt-4">
              위험성평가부터 TBM까지, 현장에서 필요한 문서를 한 곳에서 관리하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: '01',
                title: 'AI 위험성평가 자동 생성',
                desc: '공정 입력 즉시 위험요소·감소대책·위험 수준이 자동 생성됩니다. 산업안전보건법 기준을 반영해 법적 요건을 충족합니다.',
                tags: ['공정 입력', '법규 자동반영', '10초 생성'],
                icon: Zap
              },
              {
                num: '02',
                title: '현장 사진 AI 분석',
                desc: '스마트폰으로 현장을 촬영하면 AI가 사진 속 위험요소를 자동으로 파악합니다.',
                tags: ['사진 업로드'],
                icon: ShieldAlert
              },
              {
                num: '03',
                title: 'TBM 회의록 자동 연동',
                desc: '생성된 위험성평가 데이터가 TBM 회의록에 자동으로 연동됩니다. A4 인쇄와 PDF 출력을 지원합니다.',
                tags: ['자동 연동', 'A4 인쇄'],
                icon: FileText
              },
              {
                num: '04',
                title: '템플릿 라이브러리',
                desc: '터파기·고소·크레인·콘크리트·철골 등 건설 공종별 기본 템플릿을 제공합니다.',
                tags: ['기본 5종'],
                icon: Settings
              },
              {
                num: '05',
                title: '프로젝트별 관리',
                desc: '현장별·프로젝트별로 위험성평가를 분류하고 검색·필터링으로 빠르게 찾을 수 있습니다.',
                tags: ['현장별 분류'],
                icon: BarChart3
              },
              {
                num: '06',
                title: 'PDF · Excel 출력',
                desc: '전문 서식의 위험성평가표를 즉시 출력하고, 인쇄 미리보기로 확인할 수 있습니다.',
                tags: ['PDF', 'Excel'],
                icon: Download
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
                        <span className="text-lg font-bold text-emerald-600">{feature.num}</span>
                      </div>
                    </div>
                    <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag, j) => (
                      <span key={j} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full">
              Pricing
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">합리적인 요금제</h2>
            <p className="text-lg text-gray-600 mt-4">
              무료로 시작하고, 필요할 때 업그레이드하세요. 언제든 취소 가능합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'FREE',
                price: '₩0',
                period: '/월',
                subtext: '',
                cta: '무료로 시작하기',
                features: [
                  { text: '위험성평가 월 5회', included: true },
                  { text: '기본 템플릿 제공', included: true },
                  { text: 'PDF 출력', included: true },
                  { text: 'TBM 회의록', included: true },
                  { text: '무제한 생성', included: false },
                  { text: 'Excel 다운로드', included: false }
                ]
              },
              {
                name: 'PRO',
                price: '₩35,000',
                period: '/월',
                subtext: '연 결제 시 ₩28,000/월',
                cta: 'Pro 시작하기',
                highlight: true,
                features: [
                  { text: '위험성평가 무제한', included: true },
                  { text: 'TBM 무제한', included: true },
                  { text: 'PDF + Excel 출력', included: true },
                  { text: '템플릿 저장 (20개)', included: true },
                  { text: '프로젝트 관리', included: true },
                  { text: '팀 공유', included: false }
                ]
              },
              {
                name: 'TEAM',
                price: '₩75,000',
                period: '/월',
                subtext: '팀원 5명 포함',
                cta: 'Team 시작하기',
                features: [
                  { text: 'Pro 모든 기능', included: true },
                  { text: '팀원 공유', included: true },
                  { text: '회사 템플릿 관리', included: true },
                  { text: '다수 현장 관리', included: true },
                  { text: '관리자 대시보드', included: true },
                  { text: '우선 고객 지원', included: true }
                ]
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-lg overflow-hidden transition ${plan.highlight ? 'ring-2 ring-emerald-500 scale-105 shadow-xl' : 'border border-gray-200'} ${plan.highlight ? 'bg-white' : 'bg-white'}`}>
                {plan.highlight && (
                  <div className="bg-emerald-600 text-white px-6 py-2 text-center text-sm font-semibold">
                    가장 인기
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {plan.subtext && (
                    <p className="text-sm text-gray-600 mt-2">{plan.subtext}</p>
                  )}
                  <button
                    onClick={onStartClick}
                    className={`w-full mt-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {feature.included ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <div className="w-5 h-5 text-gray-300 flex items-center justify-center">−</div>
                          )}
                        </div>
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg p-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">기업 / 대형 건설사</h3>
                <p className="text-gray-600 mt-2">
                  다수 현장, 맞춤 기능, 전담 지원이 필요하신가요? Enterprise 플랜으로 맞춤 계약을 제공합니다.
                </p>
              </div>
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2 whitespace-nowrap">
                문의하기 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            지금 바로 <span className="text-emerald-600">무료</span>로 시작하세요
          </h2>
          <p className="text-lg text-gray-600 mt-6">
            신용카드 불필요 · 가입 즉시 사용 가능
          </p>
          <button
            onClick={onStartClick}
            className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 mx-auto text-lg"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-600 mt-4">
            매월 5회 무료 제공 · 언제든 업그레이드 가능
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">B2B Safety Platform</div>
                  <div className="text-sm font-bold">KRAS</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                제조업 위험성평가 자동화 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">기능</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">위험성평가 자동생성</a></li>
                <li><a href="#features" className="hover:text-white">TBM 회의록</a></li>
                <li><a href="#features" className="hover:text-white">템플릿 라이브러리</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">요금제</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#pricing" className="hover:text-white">무료 플랜</a></li>
                <li><a href="#pricing" className="hover:text-white">Pro 플랜</a></li>
                <li><a href="#pricing" className="hover:text-white">Team 플랜</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">공식 홈페이지</a></li>
                <li><a href="#" className="hover:text-white">블로그</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 KRAS Generator Inc. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              산업안전보건법 기반 · 건설기술진흥법 준수
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
