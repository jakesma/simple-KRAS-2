/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { RiskAssessment, CompanyProfile, ManufacturingProcess, HazardItem } from './types';
import AssessmentList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
import DocumentViewer from './components/DocumentViewer';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { EXPERT_PROCESS_TEMPLATES } from './data/expertDatabase';
import { ShieldCheck, Layers, Info, LogOut } from 'lucide-react';
import { onAuthStateChanged, getCurrentUser, logOut, AuthUser } from './config/auth';
import { getUserAssessments, saveAssessment, deleteAssessment, migrateLocalStorageToFirestore } from './config/firestore';

// Default corporate profile
const DEFAULT_PROFILE: CompanyProfile = {
  companyName: '(주)우성정밀공업',
  ceoName: '김우성',
  address: '경기도 시흥시 시화벤처로 234 반월국가산업단지',
  employeeCount: 45,
  businessRegNo: '124-81-99882',
  siteManager: '이주형 부장',
  department: '안전관리부'
};

// Seed realistic assessment data if localstorage is empty
const INITIAL_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'assess_sample_1',
    title: '2026년 상반기 정기 제조업 금속 가공공정 위험성평가',
    assessmentType: 'regular',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-15',
    version: 1,
    status: 'completed',
    companyProfile: DEFAULT_PROFILE,
    processes: [
      {
        id: 'proc_sample_1',
        processName: '금속 부품 프레스 성형 공정',
        detailedWorkContent: '파워 프레스 기계에 철판 금형을 장착하고 철판 원자재를 수동 투입하여 압축 가공하는 공정 활동.',
        supervisor: '박현우 조장',
        workerNames: ['김민수', '이재성', '최동환'],
        equipmentUsed: ['파워 프레스 (Power Press)', '천장 크레인 / 호이스트 (Overhead Crane)'],
        chemicalsUsed: ['방청유', '기계 그리스'],
        hazards: [
          {
            id: 'haz_sample_1_1',
            hazardCategory: 'Mechanical',
            machineryRelated: '파워 프레스 (Power Press)',
            accidentType: '끼임 (Entrapment)',
            hazardSituation: '프레스 작동 구역에 안전 방호울이 없는 상태에서 원자재를 조절하려다 오조작식 페달이 눌려 손가락이 금형 사이에 끼여 절단됨',
            legalBasis: '산업안전보건기준에 관한 규칙 제103조 (프레스 등의 방호장치)',
            currentSafetyMeasures: '안전 장갑 의무 착용(면장갑 오착용 상태)',
            likelihood: 4,
            severity: 4,
            riskScore: 16,
            riskLevel: 'High',
            isAcceptable: false,
            reductionMeasures: '양손 동조 조작식 제어 스위치 장착 및 광전자식 안전 인터락 센서 연동 설치',
            plannedDate: '2026-03-12',
            completionDate: '2026-03-14',
            responsiblePerson: '박현우 조장',
            postLikelihood: 1,
            postSeverity: 4,
            postRiskScore: 4,
            postRiskLevel: 'Low'
          },
          {
            id: 'haz_sample_1_2',
            hazardCategory: 'Mechanical',
            machineryRelated: '천장 크레인 / 호이스트 (Overhead Crane)',
            accidentType: '맞음 (Struck by)',
            hazardSituation: '크레인을 이용해 고중량 금형을 양중하여 이송하는 과정에서 와이어로프 마모로 인양물이 추락하여 근로자를 타격함',
            legalBasis: '산업안전보건기준에 관한 규칙 제147조 (와이어로프 등의 사용 한계)',
            currentSafetyMeasures: '작업자 안전모 착용 상태',
            likelihood: 3,
            severity: 5,
            riskScore: 15,
            riskLevel: 'High',
            isAcceptable: false,
            reductionMeasures: '와이어로프 검사 주기 단축 및 폐기 규칙 정립, 크레인 가동 반경 내 도보 근로자 출입방지 안전 가드 레일 설치',
            plannedDate: '2026-03-13',
            completionDate: '2026-03-15',
            responsiblePerson: '이주형 부장',
            postLikelihood: 1,
            postSeverity: 5,
            postRiskScore: 5,
            postRiskLevel: 'Low'
          }
        ]
      }
    ]
  },
  {
    id: 'assess_sample_2',
    title: '아크 용접 공정 전용 수시 위험성평가 (신규 도입 장비)',
    assessmentType: 'occasional',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-12',
    version: 1,
    status: 'draft',
    companyProfile: DEFAULT_PROFILE,
    processes: [
      {
        id: 'proc_sample_2',
        processName: '부품 아크 용접 공정',
        detailedWorkContent: '강판 프레임을 조립 지그에 결합하고 휴대용 교류아크용접기를 이용하여 수동 고온 가열 가접합을 수행하는 작업.',
        supervisor: '최상원 반장',
        workerNames: ['이준혁', '강동우'],
        equipmentUsed: ['아크 용접기 (Arc Welder)'],
        chemicalsUsed: ['용접 가스 (Ar, CO2)'],
        hazards: [
          {
            id: 'haz_sample_2_1',
            hazardCategory: 'Electrical',
            machineryRelated: '아크 용접기 (Arc Welder)',
            accidentType: '감전 (Electric Shock)',
            hazardSituation: '습한 여름철 용접봉 교체 시 전격방지기 성능 불량 상태에서 무부하 전압 2차 전류에 근로자의 젖은 신체가 접촉하여 감전됨',
            legalBasis: '산업안전보건기준에 관한 규칙 제306조 (교류아크용접기 등의 자동전격방지기)',
            currentSafetyMeasures: '일반 장갑 착용',
            likelihood: 4,
            severity: 3,
            riskScore: 12,
            riskLevel: 'Medium',
            isAcceptable: false,
            reductionMeasures: '외함 내장형 고속 교류아크용접용 전격방지기 정밀 절연 검사 및 고무 절연 슬리브 장착',
            plannedDate: '2026-07-20',
            completionDate: '',
            responsiblePerson: '최상원 반장',
            postLikelihood: 2,
            postSeverity: 3,
            postRiskScore: 6,
            postRiskLevel: 'Low'
          }
        ]
      }
    ]
  }
];

export default function App() {
  const [showLanding, setShowLanding] = useState(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('kras_dashboard_visited');
    return !hasVisited;
  });
  
  // Firebase Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [migratingData, setMigratingData] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'assessments'>('assessments');
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [viewingAssessmentId, setViewingAssessmentId] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setAuthUser(user);
      
      if (user) {
        // User is logged in - load data from Firestore
        setMigratingData(true);
        
        // Try to load from Firestore
        const firestoreResult = await getUserAssessments(user.uid);
        
        if (firestoreResult.success && firestoreResult.assessments) {
          setAssessments(firestoreResult.assessments);
          // Don't need to use localStorage for logged-in users
        } else {
          // If Firestore is empty, try to migrate from localStorage
          const localData = localStorage.getItem('kras_manufacturing_assessments');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData) as RiskAssessment[];
              const migrationResult = await migrateLocalStorageToFirestore(user.uid, parsedData);
              
              if (migrationResult.success) {
                console.log(`✅ Migrated ${migrationResult.count} assessments to Firestore`);
                // Reload from Firestore after migration
                const updatedResult = await getUserAssessments(user.uid);
                if (updatedResult.success && updatedResult.assessments) {
                  setAssessments(updatedResult.assessments);
                }
              }
            } catch (err) {
              console.error('Migration error:', err);
              // Still use localStorage if migration fails
              setAssessments(INITIAL_ASSESSMENTS);
            }
          } else {
            // No local data, start with empty or sample data
            setAssessments(INITIAL_ASSESSMENTS);
          }
        }
        
        setMigratingData(false);
      } else {
        // User is logged out - load from localStorage
        const localData = localStorage.getItem('kras_manufacturing_assessments');
        if (localData) {
          try {
            const parsedData = JSON.parse(localData) as RiskAssessment[];
            setAssessments(parsedData);
          } catch (err) {
            console.error('Error parsing localStorage:', err);
            setAssessments(INITIAL_ASSESSMENTS);
          }
        } else {
          // No local data, use initial assessments for demo
          setAssessments(INITIAL_ASSESSMENTS);
        }
        setEditingAssessmentId(null);
        setViewingAssessmentId(null);
      }
      
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle browser back button - prevent navigation to other websites
  useEffect(() => {
    // Initialize history state
    window.history.pushState({ view: 'dashboard' }, '', window.location.href);

    const handlePopState = () => {
      // Reset to dashboard view when browser back button is pressed
      setEditingAssessmentId(null);
      setViewingAssessmentId(null);
      
      // Push dashboard state back to history to prevent back navigation to other sites
      window.history.pushState({ view: 'dashboard' }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to storage (now Firestore if logged in, localStorage otherwise)
  const syncToStorage = async (updated: RiskAssessment[]) => {
    setAssessments(updated);
    
    // If user is logged in, save to Firestore
    if (authUser) {
      for (const assessment of updated) {
        await saveAssessment(authUser.uid, assessment);
      }
    } else {
      // Fallback to localStorage if not logged in
      localStorage.setItem('kras_manufacturing_assessments', JSON.stringify(updated));
    }
  };

  // Create new blank assessment
  const handleCreateNew = () => {
    const newAssess: RiskAssessment = {
      id: `assess_${Date.now()}`,
      title: `${new Date().getFullYear()}년도 신규 제조업 수시 위험성평가`,
      assessmentType: 'occasional',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: 1,
      status: 'draft',
      companyProfile: { ...DEFAULT_PROFILE },
      processes: [
        {
          id: `proc_${Date.now()}`,
          processName: '부품 아크 용접 공정',
          detailedWorkContent: '수동 아크 용접 설비를 사용해 철판 부품 가가공 및 도금 조립을 전개하는 현장 활동.',
          supervisor: DEFAULT_PROFILE.siteManager || '안전관리자',
          workerNames: ['작업자A'],
          equipmentUsed: ['아크 용접기 (Arc Welder)'],
          chemicalsUsed: [],
          hazards: []
        }
      ]
    };

    const nextList = [newAssess, ...assessments];
    syncToStorage(nextList);
    setEditingAssessmentId(newAssess.id);
  };

  const handleSelect = (id: string) => {
    setEditingAssessmentId(id);
    setViewingAssessmentId(null);
  };

  const handleViewDoc = (id: string) => {
    setViewingAssessmentId(id);
    setEditingAssessmentId(null);
  };

  // Re-use and revision handler (SME/Consultant crucial feature)
  const handleDuplicate = (id: string) => {
    const original = assessments.find(a => a.id === id);
    if (!original) return;

    const prefix = original.status === 'completed' || original.status === 'approved' 
      ? `[개정본] ` 
      : `[사본] `;

    const isRevision = original.status === 'completed' || original.status === 'approved';

    const cloned: RiskAssessment = {
      ...original,
      id: `assess_cloned_${Date.now()}`,
      title: `${prefix}${original.title}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      // If it is a revision of an approved document, increment the revision number!
      version: isRevision ? original.version + 1 : original.version,
      // Map processes to reset hazard completion dates to simulate next tracking round
      processes: original.processes.map(p => ({
        ...p,
        hazards: p.hazards.map(h => ({
          ...h,
          completionDate: '' // Reset completion date for the new revision tracking
        }))
      }))
    };

    const nextList = [cloned, ...assessments];
    syncToStorage(nextList);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('선택하신 위험성평가 내역과 도출된 유해유형 데이터가 영구히 소멸됩니다. 정말 삭제하시겠습니까?')) {
      const nextList = assessments.filter(a => a.id !== id);
      
      // If logged in, delete from Firestore too
      if (authUser) {
        await deleteAssessment(id);
      }
      
      syncToStorage(nextList);
      if (editingAssessmentId === id) setEditingAssessmentId(null);
      if (viewingAssessmentId === id) setViewingAssessmentId(null);
    }
  };

  const handleSave = (updated: RiskAssessment) => {
    const nextList = assessments.map(a => a.id === updated.id ? updated : a);
    syncToStorage(nextList);
  };

  const handleLogAudit = (action: string, details: string) => {
    console.log(`[Audit Log] Action: ${action} | Details: ${details}`);
  };

  // Get active editing assessment
  const activeEditing = assessments.find(a => a.id === editingAssessmentId);
  const activeViewing = assessments.find(a => a.id === viewingAssessmentId);

  const handleEnterDashboard = () => {
    localStorage.setItem('kras_dashboard_visited', 'true');
    setShowLanding(false);
  };

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      const result = await logOut();
      if (result.success) {
        setAuthUser(null);
        setAssessments([]);
        setEditingAssessmentId(null);
        setViewingAssessmentId(null);
        setShowLanding(true);
      }
    }
  };

  // Show loading state while Firebase auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-semibold">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not visited (regardless of login status)
  if (showLanding) {
    return <LandingPage onStartClick={handleEnterDashboard} />;
  }

  // Show auth page only if user explicitly tries to save (not here anymore)

  // Show data migration state
  if (migratingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-semibold">데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans" id="app-shell">
      
      {/* Top Main Navigation Bar (Hidden on Print) */}
      <header className="bg-[#2C3E50] text-white border-b border-[#34495E] print:hidden" id="app-main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" id="header-wrapper">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg font-black flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider leading-none">B2B Safety Platform</span>
              <h1 className="text-sm font-black text-white tracking-tight">KRAS 제조업 위험성평가 생성기</h1>
            </div>
          </div>

          {/* Nav Tab Swappers */}
          <div className="flex items-center gap-1 bg-slate-900/40 p-1 rounded-xl" id="header-tab-group">
            <button
              onClick={() => {
                setActiveTab('assessments');
                setEditingAssessmentId(null);
                setViewingAssessmentId(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'assessments' && !editingAssessmentId && !viewingAssessmentId
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              id="nav-assessments-tab"
            >
              <Layers size={14} />
              위험성평가 관리
            </button>
            {/* PRD tab removed per user request */}
          </div>

          {/* User Meta */}
          <div className="hidden sm:flex items-center gap-3 text-xs border-l border-[#34495E] pl-4" id="header-user-badge">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">로그인 사용자</span>
              <strong className="text-slate-200 text-[11px] font-semibold">{authUser?.displayName || authUser?.email}</strong>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center font-bold text-slate-200">
              {authUser?.displayName?.[0] || authUser?.email?.[0] || '사'}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 hover:bg-white/10 rounded-lg transition"
              title="로그아웃"
            >
              <LogOut size={16} className="text-slate-300" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Body Content Switcher */}
      <main className="flex-1" id="app-main-content">
        {activeViewing ? (
          <DocumentViewer
            assessment={activeViewing}
            onBack={() => setViewingAssessmentId(null)}
          />
        ) : activeEditing ? (
          <AssessmentForm
            assessment={activeEditing}
            onSave={handleSave}
            onBack={() => setEditingAssessmentId(null)}
            onLogAudit={handleLogAudit}
          />
        ) : (
          <AssessmentList
            assessments={assessments}
            onCreateNew={handleCreateNew}
            onSelect={handleSelect}
            onViewDoc={handleViewDoc}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Standard Bottom Disclaimer (Hidden on Print) */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400 print:hidden" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" id="footer-inner">
          <div className="flex items-center gap-1">
            <Info size={14} />
            <span>KOSHA KRAS 5단계 제조 위험성 가이드 연동 서비스</span>
          </div>
          <div>© 2026 KRAS Generator Inc. All Rights Reserved.</div>
        </div>
      </footer>

    </div>
  );
}
