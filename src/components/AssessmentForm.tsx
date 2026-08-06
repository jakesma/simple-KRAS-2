/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RiskAssessment, ManufacturingProcess, HazardItem, HazardCategory, CompanyProfile, AuditLog } from '../types';
import { EXPERT_MACHINERY_LIST, getSuggestedHazards } from '../data/expertDatabase';
import { 
  Building2, Users, Sliders, ClipboardList, AlertTriangle, 
  CheckCircle, ShieldAlert, Cpu, Sparkles, Plus, Trash2, 
  ArrowLeft, ArrowRight, Save, History, PlayCircle 
} from 'lucide-react';

interface AssessmentFormProps {
  assessment: RiskAssessment;
  onSave: (updated: RiskAssessment) => void;
  onBack: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function AssessmentForm({ assessment, onSave, onBack, onLogAudit }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [title, setTitle] = useState<string>(assessment.title);
  const [assessmentType, setAssessmentType] = useState<'regular' | 'occasional'>(assessment.assessmentType);
  const [profile, setProfile] = useState<CompanyProfile>({ ...assessment.companyProfile });
  const [processes, setProcesses] = useState<ManufacturingProcess[]>([...assessment.processes]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'initial',
      timestamp: new Date().toLocaleTimeString(),
      userRole: '안전보건관리자',
      action: '평가 시작',
      details: '신규 위험성평가 초안 작성 마법사 시작됨.'
    }
  ]);

  // Loading state for AI generation
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // Profile Field Handlers
  const handleProfileChange = (field: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Process Handlers
  const handleAddProcess = () => {
    const newProc: ManufacturingProcess = {
      id: `proc_${Date.now()}`,
      processName: '신규 제조 공정',
      detailedWorkContent: '',
      supervisor: '',
      workerNames: ['작업자1'],
      equipmentUsed: [],
      chemicalsUsed: [],
      hazards: []
    };
    setProcesses(prev => [...prev, newProc]);
    logLocalAudit('공정 추가', `신규 공정 '${newProc.processName}'을(를) 세부 리스트에 등록함.`);
  };

  const handleUpdateProcess = (procId: string, updates: Partial<ManufacturingProcess>) => {
    setProcesses(prev => prev.map(p => p.id === procId ? { ...p, ...updates } : p));
  };

  const handleDeleteProcess = (procId: string) => {
    const deleted = processes.find(p => p.id === procId);
    setProcesses(prev => prev.filter(p => p.id !== procId));
    if (deleted) {
      logLocalAudit('공정 삭제', `공정 '${deleted.processName}'을(를) 평가에서 영구 삭제함.`);
    }
  };

  const logLocalAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: '안전보건관리자',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
    onLogAudit(action, details);
  };

  // Asset Checklist helpers
  const toggleMachinery = (procId: string, mach: string) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;
    
    const exist = proc.equipmentUsed.includes(mach);
    const updated = exist 
      ? proc.equipmentUsed.filter(m => m !== mach) 
      : [...proc.equipmentUsed, mach];
      
    handleUpdateProcess(procId, { equipmentUsed: updated });
  };

  const addChemical = (procId: string, chem: string) => {
    if (!chem.trim()) return;
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;
    
    if (!proc.chemicalsUsed.includes(chem)) {
      handleUpdateProcess(procId, { chemicalsUsed: [...proc.chemicalsUsed, chem] });
    }
  };

  const removeChemical = (procId: string, chem: string) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;
    handleUpdateProcess(procId, { chemicalsUsed: proc.chemicalsUsed.filter(c => c !== chem) });
  };

  // Step 3 & 4: Hazard Items Handlers
  const handleAddHazard = (procId: string) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;

    const newHazard: HazardItem = {
      id: `haz_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      hazardCategory: 'Mechanical',
      machineryRelated: proc.equipmentUsed[0] || '공정 범용 자재',
      hazardSituation: '',
      accidentType: '끼임',
      legalBasis: '',
      currentSafetyMeasures: '',
      likelihood: 3,
      severity: 3,
      riskScore: 9,
      riskLevel: 'Medium',
      isAcceptable: false,
      reductionMeasures: '',
      plannedDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0], // 7 days later default
      completionDate: '',
      responsiblePerson: proc.supervisor || '',
      postLikelihood: 2,
      postSeverity: 3,
      postRiskScore: 6,
      postRiskLevel: 'Low'
    };

    const updatedHazards = [...proc.hazards, newHazard];
    handleUpdateProcess(procId, { hazards: updatedHazards });
    logLocalAudit('위험요인 직접 등록', `'${proc.processName}' 공정에 신규 위험요인을 수동 기재함.`);
  };

  // AI & Expert integration
  const handleAutoGenerateHazards = async (procId: string) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;

    setAiLoading(procId);
    logLocalAudit('AI 요인 분석 요청', `'${proc.processName}' 공정의 장비 및 수동 활동 기반 분석 중.`);

    try {
      // 1. First try to invoke real server-side Gemini proxy
      const response = await fetch('/api/gemini/generate-hazard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processName: proc.processName,
          detailedWorkContent: proc.detailedWorkContent,
          machineryRelated: proc.equipmentUsed.join(', ') || '일반 공업 도구'
        })
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        // Map response to our internal HazardItem model
        const raw = resData.data;
        const initialScore = raw.suggestedLikelihood * raw.suggestedSeverity;
        const level = initialScore >= 16 ? 'High' : initialScore >= 9 ? 'Medium' : 'Low';
        const isAcceptable = initialScore < 9;

        const aiHazard: HazardItem = {
          id: `haz_ai_${Date.now()}`,
          hazardCategory: raw.hazardCategory as HazardCategory,
          machineryRelated: proc.equipmentUsed[0] || '공정 전반',
          hazardSituation: raw.hazardSituation,
          accidentType: raw.accidentType,
          legalBasis: raw.legalBasis,
          currentSafetyMeasures: raw.currentSafetyMeasures,
          likelihood: raw.suggestedLikelihood,
          severity: raw.suggestedSeverity,
          riskScore: initialScore,
          riskLevel: level as 'Low' | 'Medium' | 'High',
          isAcceptable: isAcceptable,
          reductionMeasures: raw.reductionMeasures,
          plannedDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
          completionDate: '',
          responsiblePerson: proc.supervisor || '공정관리자',
          postLikelihood: Math.max(1, raw.suggestedLikelihood - 2),
          postSeverity: raw.suggestedSeverity,
          postRiskScore: Math.max(1, raw.suggestedLikelihood - 2) * raw.suggestedSeverity,
          postRiskLevel: (Math.max(1, raw.suggestedLikelihood - 2) * raw.suggestedSeverity) >= 9 ? 'Medium' : 'Low'
        };

        handleUpdateProcess(procId, { hazards: [...proc.hazards, aiHazard] });
        logLocalAudit('AI 분석 완료', `'${proc.processName}' 공정에 AI 추천 정밀 요인을 주입함.`);
      } else {
        // 2. Fallback to expert pre-populated database if Gemini is offline
        const localItems = getSuggestedHazards(proc.processName, proc.equipmentUsed);
        
        const mappedLocal = localItems.map((raw, idx) => {
          const initialScore = raw.suggestedLikelihood * raw.suggestedSeverity;
          const level = initialScore >= 16 ? 'High' : initialScore >= 9 ? 'Medium' : 'Low';
          const isAcceptable = initialScore < 9;
          
          return {
            id: `haz_local_${Date.now()}_${idx}`,
            hazardCategory: raw.hazardCategory,
            machineryRelated: raw.machineryRelated,
            hazardSituation: raw.hazardSituation,
            accidentType: raw.accidentType,
            legalBasis: raw.legalBasis,
            currentSafetyMeasures: raw.currentSafetyMeasures,
            likelihood: raw.suggestedLikelihood,
            severity: raw.suggestedSeverity,
            riskScore: initialScore,
            riskLevel: level as any,
            isAcceptable: isAcceptable,
            reductionMeasures: raw.reductionMeasures,
            plannedDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
            completionDate: '',
            responsiblePerson: proc.supervisor || '반장',
            postLikelihood: Math.max(1, raw.suggestedLikelihood - 1),
            postSeverity: raw.suggestedSeverity,
            postRiskScore: Math.max(1, raw.suggestedLikelihood - 1) * raw.suggestedSeverity,
            postRiskLevel: (Math.max(1, raw.suggestedLikelihood - 1) * raw.suggestedSeverity) >= 9 ? 'Medium' : 'Low' as any
          };
        });

        handleUpdateProcess(procId, { hazards: [...proc.hazards, ...mappedLocal] });
        logLocalAudit('전문가 DB 연동', `'${proc.processName}' 공정에 KOSHA 표준 전문가 템플릿(총 ${mappedLocal.length}건)을 로드함.`);
      }
    } catch (err) {
      console.error(err);
      // Fail gracefully to local database
      const localItems = getSuggestedHazards(proc.processName, proc.equipmentUsed);
      const mappedLocal = localItems.map((raw, idx) => {
        const score = raw.suggestedLikelihood * raw.suggestedSeverity;
        return {
          id: `haz_local_${Date.now()}_${idx}`,
          hazardCategory: raw.hazardCategory,
          machineryRelated: raw.machineryRelated,
          hazardSituation: raw.hazardSituation,
          accidentType: raw.accidentType,
          legalBasis: raw.legalBasis,
          currentSafetyMeasures: raw.currentSafetyMeasures,
          likelihood: raw.suggestedLikelihood,
          severity: raw.suggestedSeverity,
          riskScore: score,
          riskLevel: (score >= 16 ? 'High' : score >= 9 ? 'Medium' : 'Low') as any,
          isAcceptable: score < 9,
          reductionMeasures: raw.reductionMeasures,
          plannedDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
          completionDate: '',
          responsiblePerson: proc.supervisor || '반장',
          postLikelihood: Math.max(1, raw.suggestedLikelihood - 1),
          postSeverity: raw.suggestedSeverity,
          postRiskScore: Math.max(1, raw.suggestedLikelihood - 1) * raw.suggestedSeverity,
          postRiskLevel: (Math.max(1, raw.suggestedLikelihood - 1) * raw.suggestedSeverity) >= 9 ? 'Medium' : 'Low' as any
        };
      });
      handleUpdateProcess(procId, { hazards: [...proc.hazards, ...mappedLocal] });
      logLocalAudit('오프라인 DB 복구', `'${proc.processName}' 공정 분석 실패로 오프라인 백업 전문가 템플릿 로드.`);
    } finally {
      setAiLoading(null);
    }
  };

  const handleUpdateHazard = (procId: string, hazId: string, updates: Partial<HazardItem>) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;

    const updatedHazards = proc.hazards.map(h => {
      if (h.id === hazId) {
        const merged = { ...h, ...updates };
        
        // Recalculate original scores if L or S changed
        if ('likelihood' in updates || 'severity' in updates) {
          merged.riskScore = merged.likelihood * merged.severity;
          merged.riskLevel = merged.riskScore >= 16 ? 'High' : merged.riskScore >= 9 ? 'Medium' : 'Low';
          merged.isAcceptable = merged.riskScore < 9;
        }

        // Recalculate post scores if postL or postS changed
        if ('postLikelihood' in updates || 'postSeverity' in updates) {
          merged.postRiskScore = merged.postLikelihood * merged.postSeverity;
          merged.postRiskLevel = merged.postRiskScore >= 16 ? 'High' : merged.postRiskScore >= 9 ? 'Medium' : 'Low';
        }

        return merged;
      }
      return h;
    });

    handleUpdateProcess(procId, { hazards: updatedHazards });
  };

  const handleDeleteHazard = (procId: string, hazId: string) => {
    const proc = processes.find(p => p.id === procId);
    if (!proc) return;

    handleUpdateProcess(procId, { hazards: proc.hazards.filter(h => h.id !== hazId) });
    logLocalAudit('위험요인 삭제', `'${proc.processName}' 공정의 특정 위험요인 카드 삭제 완료.`);
  };

  // Top level submit/save
  const handleSaveAssessment = (nextStatus?: 'draft' | 'review' | 'approved' | 'completed') => {
    const finalStatus = nextStatus || assessment.status;
    
    const updated: RiskAssessment = {
      ...assessment,
      title,
      assessmentType,
      companyProfile: profile,
      processes,
      status: finalStatus,
      updatedAt: new Date().toLocaleDateString(),
      version: nextStatus === 'approved' ? assessment.version + 1 : assessment.version
    };

    logLocalAudit('기록 물리적 저장', `평가서 상태를 '${finalStatus}'(으)로 최종 보존하였습니다.`);
    onSave(updated);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans" id="assessment-wizard-root">
      
      {/* Wizard Step Progress Tracker */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 shadow-sm" id="wizard-progress">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4" id="wizard-progress-inner">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition self-start"
            id="wizard-cancel-btn"
          >
            <ArrowLeft size={14} /> 목록 대시보드로 복귀
          </button>
          
          <div className="flex items-center gap-2 sm:gap-6" id="step-indicator-wrapper">
            {[
              { num: 1, label: '1. 프로필' },
              { num: 2, label: '2. 공정등록' },
              { num: 3, label: '3. 위험도출' },
              { num: 4, label: '4. 감소대책' },
              { num: 5, label: '5. 승인상신' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer ${
                  currentStep === s.num
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                  currentStep === s.num
                    ? 'bg-white text-emerald-700 font-bold'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSaveAssessment()}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition"
            id="wizard-quick-save-btn"
          >
            <Save size={14} /> 중간 저장
          </button>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="max-w-4xl mx-auto px-4 mt-8" id="wizard-form-body">
        
        {/* ========================================= */}
        {/* STEP 1: COMPANY PROFILE                   */}
        {/* ========================================= */}
        {currentStep === 1 && (
          <div className="space-y-6" id="wizard-step1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="text-slate-800" />
                  평가 문서 개요 및 회사 프로필 설정
                </h2>
                <p className="text-xs text-slate-400 mt-1">위험성평가 문서 표지 및 표준 날인용 기업 정보를 입력합니다.</p>
              </div>

              {/* Assessment Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">위험성평가 계획서 명칭</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 2026년 정기 프레스 조립라인 위험성평가"
                    id="input-title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">평가 형태</label>
                  <select
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    id="select-type"
                  >
                    <option value="regular">정기 위험성평가</option>
                    <option value="occasional">수시 위험성평가</option>
                  </select>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">회사명 / 테넌트</label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => handleProfileChange('companyName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 주식회사 한국정밀금속"
                    id="input-company-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">대표이사 성명</label>
                  <input
                    type="text"
                    value={profile.ceoName}
                    onChange={(e) => handleProfileChange('ceoName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 홍길동"
                    id="input-ceo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">사업자 등록번호</label>
                  <input
                    type="text"
                    value={profile.businessRegNo}
                    onChange={(e) => handleProfileChange('businessRegNo', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="123-45-67890"
                    id="input-bizno"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">상시 근로자 수 (명)</label>
                  <input
                    type="number"
                    value={profile.employeeCount}
                    onChange={(e) => handleProfileChange('employeeCount', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    id="input-employees"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">사업장 소속 주소지</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 경기도 안산시 단원구 반월공단로 123"
                    id="input-address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">안전인 / 실무책임자</label>
                  <input
                    type="text"
                    value={profile.siteManager}
                    onChange={(e) => handleProfileChange('siteManager', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 김성태 부장"
                    id="input-manager"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">담당 행정 부서</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleProfileChange('department', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="예: 안전환경방재과"
                    id="input-dept"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* STEP 2: PROCESS REGISTRATION              */}
        {/* ========================================= */}
        {currentStep === 2 && (
          <div className="space-y-6" id="wizard-step2">
            
            {/* Step Intro */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders size={16} /> 공정 및 제조 자원(기계·설비/물질) 등록
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">평가 대상이 될 핵심 가동 라인 및 각 설비를 바인딩하십시오.</p>
              </div>
              <button
                onClick={handleAddProcess}
                className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
                id="add-process-btn"
              >
                <Plus size={14} /> 공정 추가
              </button>
            </div>

            {/* List of Processes */}
            {processes.map((p, index) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm relative">
                {/* Delete Process Button */}
                <button
                  onClick={() => handleDeleteProcess(p.id)}
                  className="absolute right-4 top-4 p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition"
                  title="이 공정 전체 삭제"
                >
                  <Trash2 size={15} />
                </button>

                {/* Process Header Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">공정 {index + 1} 명칭</label>
                    <input
                      type="text"
                      value={p.processName}
                      onChange={(e) => handleUpdateProcess(p.id, { processName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                      placeholder="공정명 입력 (예: 용접 및 사출 공정)"
                      id={`proc-name-input-${p.id}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">공정 관리감독자 (Supervisor)</label>
                    <input
                      type="text"
                      value={p.supervisor}
                      onChange={(e) => handleUpdateProcess(p.id, { supervisor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                      placeholder="관리 조장/반장 성명"
                      id={`proc-supervisor-input-${p.id}`}
                    />
                  </div>
                </div>

                {/* Work description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">상세 작업 활동 명세</label>
                  <textarea
                    rows={2}
                    value={p.detailedWorkContent}
                    onChange={(e) => handleUpdateProcess(p.id, { detailedWorkContent: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="해당 공정에서 작업자가 실행하는 세부 절차와 활동 양식을 구체적으로 기술하십시오."
                    id={`proc-work-input-${p.id}`}
                  />
                </div>

                {/* Workers names manager */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">투입 근로자 목록 (콤마 분리)</label>
                  <input
                    type="text"
                    value={p.workerNames.join(', ')}
                    onChange={(e) => handleUpdateProcess(p.id, { workerNames: e.target.value.split(',').map(n => n.trim()) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-slate-900"
                    placeholder="작업자 명단을 쉼표로 작성 (예: 김철수, 이영희, 박지성)"
                  />
                </div>

                {/* Machinery Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">공정 내 사용 주요 유해 기계·기구 (선택)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-slate-100 bg-slate-50 p-3 rounded-lg max-h-36 overflow-y-auto">
                    {EXPERT_MACHINERY_LIST.map((mach) => {
                      const selected = p.equipmentUsed.includes(mach);
                      return (
                        <button
                          key={mach}
                          onClick={() => toggleMachinery(p.id, mach)}
                          className={`px-2.5 py-1.5 rounded-md text-[10px] text-left border transition ${
                            selected 
                              ? 'bg-slate-900 text-white border-slate-900 font-semibold' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mach}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chemicals handling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">취급 유해 화학물질 등록</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="화학 제품명 입력 (예: 시너, 에폭시)"
                        id={`chem-add-input-${p.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.currentTarget;
                            addChemical(p.id, target.value);
                            target.value = '';
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                      />
                      <button
                        onClick={() => {
                          const el = document.getElementById(`chem-add-input-${p.id}`) as HTMLInputElement;
                          if (el) {
                            addChemical(p.id, el.value);
                            el.value = '';
                          }
                        }}
                        className="bg-slate-200 text-slate-800 text-xs px-3 rounded-lg hover:bg-slate-300 transition"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">등록된 물질 목록 (클릭하여 삭제)</label>
                    <div className="flex flex-wrap gap-1">
                      {p.chemicalsUsed.map((chem) => (
                        <button
                          key={chem}
                          onClick={() => removeChemical(p.id, chem)}
                          className="bg-amber-50 hover:bg-red-50 text-amber-800 hover:text-red-800 text-[10px] px-2 py-0.5 rounded border border-amber-200 hover:border-red-200 transition"
                        >
                          {chem} ✕
                        </button>
                      ))}
                      {p.chemicalsUsed.length === 0 && (
                        <span className="text-[10px] text-slate-400">등록된 화학물질 없음</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ========================================= */}
        {/* STEP 3: HAZARD IDENTIFICATION             */}
        {/* ========================================= */}
        {currentStep === 3 && (
          <div className="space-y-6" id="wizard-step3">
            
            {/* Step Intro */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ClipboardList size={16} /> 공정별 유해·위험요인 도출 및 AI 비서 추천
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                공정에서 발생할 수 있는 사고 위험 상황, 관련 법적 근거, 현재 불량 대책을 입력합니다. 
                <strong>'AI 요인 분석'</strong>을 이용해 KOSHA 표준 텍스트를 즉각 로드할 수 있습니다.
              </p>
            </div>

            {processes.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm" id={`step3-proc-${p.id}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase">Process Group</h4>
                    <h3 className="text-sm font-bold text-slate-900">{p.processName}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleAutoGenerateHazards(p.id)}
                      disabled={aiLoading === p.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                      id={`ai-suggest-btn-${p.id}`}
                    >
                      <Sparkles size={12} className={aiLoading === p.id ? 'animate-spin' : ''} />
                      {aiLoading === p.id ? 'AI 정밀 분석 중...' : 'AI 위험 요인 분석'}
                    </button>
                    <button
                      onClick={() => handleAddHazard(p.id)}
                      className="bg-slate-100 text-slate-800 hover:bg-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      id={`add-manual-hazard-${p.id}`}
                    >
                      <Plus size={12} />
                      요인 직접 기재
                    </button>
                  </div>
                </div>

                {/* Hazards List Inside This Process */}
                <div className="space-y-4">
                  {p.hazards.map((h) => (
                    <div key={h.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3 relative">
                      <button
                        onClick={() => handleDeleteHazard(p.id, h.id)}
                        className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-500 rounded hover:bg-white transition"
                        title="이 요인 카드 삭제"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* Hazard Machinery / Category row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">원인 기계·설비</label>
                          <select
                            value={h.machineryRelated}
                            onChange={(e) => handleUpdateHazard(p.id, h.id, { machineryRelated: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          >
                            <option value="공정 공통">공정 공통</option>
                            {p.equipmentUsed.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">유해분류 카테고리</label>
                          <select
                            value={h.hazardCategory}
                            onChange={(e) => handleUpdateHazard(p.id, h.id, { hazardCategory: e.target.value as any })}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] focus:ring-1 focus:ring-slate-900 focus:outline-none"
                          >
                            <option value="Mechanical">기계적 위험</option>
                            <option value="Electrical">전기적 위험</option>
                            <option value="Chemical">화학적 위험</option>
                            <option value="FireExplosion">화재·폭발 위험</option>
                            <option value="Ergonomic">근골격계/인간공학</option>
                            <option value="Physical">물리적 위험 (추락 등)</option>
                            <option value="WorkEnvironment">작업환경 위험</option>
                            <option value="Other">기타 위험</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">재해 형태 (사고 유형)</label>
                          <input
                            type="text"
                            value={h.accidentType}
                            onChange={(e) => handleUpdateHazard(p.id, h.id, { accidentType: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] focus:ring-1 focus:ring-slate-900 focus:outline-none"
                            placeholder="예: 끼임, 감전, 중독, 추락"
                          />
                        </div>
                      </div>

                      {/* Situation description */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-0.5">위험발생 상황 및 결과 묘사 (KOSHA 가이드 표준)</label>
                        <textarea
                          rows={2}
                          value={h.hazardSituation}
                          onChange={(e) => handleUpdateHazard(p.id, h.id, { hazardSituation: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-[11px] focus:ring-1 focus:ring-slate-900 focus:outline-none leading-relaxed"
                          placeholder="원인 상황과 예상 결과를 인과구도로 작성하십시오 (예: 보호 덮개가 누락되어 회전 기어에 면장갑이 말려들어가 협착 재해 우려)"
                        />
                      </div>

                      {/* Legal & Poor current status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">관련 법적 근거 (산업안전기준에 관한 규칙)</label>
                          <input
                            type="text"
                            value={h.legalBasis}
                            onChange={(e) => handleUpdateHazard(p.id, h.id, { legalBasis: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px]"
                            placeholder="예: 산업안전기준에 관한 규칙 제103조"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">현재 안전보건 조치 상태 (기본/미흡점)</label>
                          <input
                            type="text"
                            value={h.currentSafetyMeasures}
                            onChange={(e) => handleUpdateHazard(p.id, h.id, { currentSafetyMeasures: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px]"
                            placeholder="예: 방호 울 없음, 작업자 육안 주의에 의존"
                          />
                        </div>
                      </div>

                    </div>
                  ))}

                  {p.hazards.length === 0 && (
                    <div className="text-center p-6 border border-dashed border-slate-200 bg-slate-50 rounded-lg text-slate-400 text-xs">
                      추출된 요인이 없습니다. 위의 AI 분석 버튼이나 직접 기재 버튼으로 추가해주십시오.
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ========================================= */}
        {/* STEP 4: RISK ASSESSMENT & REDUCTION      */}
        {/* ========================================= */}
        {currentStep === 4 && (
          <div className="space-y-6" id="wizard-step4">
            
            {/* Step Intro */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="text-slate-900" size={16} /> 위험성 추정(빈도x강도) 및 감소 대책 계획
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                빈도(L, 1-5)와 강도(S, 1-5)를 입력하여 오점수를 연산합니다. 
                <strong>9점 이상인 요인은 허용 불가</strong>로 판정되므로 반드시 감소대책과 이행 담당자, 개선 후 잔류위험(8점 이하 설계)을 배정하십시오.
              </p>
            </div>

            {processes.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm" id={`step4-proc-${p.id}`}>
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase">Process</h3>
                  <h3 className="text-sm font-bold text-slate-900">{p.processName}</h3>
                </div>

                <div className="space-y-5">
                  {p.hazards.map((h) => {
                    const needsAction = h.riskScore >= 9;

                    return (
                      <div key={h.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-4">
                        
                        {/* Summary of Hazard text */}
                        <div className="bg-slate-100/50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex justify-between gap-4">
                          <div>
                            <span className="font-extrabold text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded uppercase mr-2">{h.accidentType}</span>
                            <span>{h.hazardSituation || '작성된 요인 상황 요약 없음.'}</span>
                          </div>
                        </div>

                        {/* Estimations Likelihood / Severity Slider / Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-3 rounded-xl border border-slate-200">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">발생 빈도 (Likelihood - 1 to 5)</label>
                            <select
                              value={h.likelihood}
                              onChange={(e) => handleUpdateHazard(p.id, h.id, { likelihood: parseInt(e.target.value) })}
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs font-bold font-mono"
                            >
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}단계</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">치명 강도 (Severity - 1 to 5)</label>
                            <select
                              value={h.severity}
                              onChange={(e) => handleUpdateHazard(p.id, h.id, { severity: parseInt(e.target.value) })}
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs font-bold font-mono"
                            >
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}단계</option>)}
                            </select>
                          </div>

                          <div className="flex flex-col justify-center items-center bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">위험 점수 (L x S)</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xl font-black font-mono ${needsAction ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                                {h.riskScore}점
                              </span>
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                h.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                h.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {needsAction ? '허용 불가' : '허용 가능'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Reduction measures form - visible always but forced red warning if needsAction */}
                        <div className={`space-y-3 p-4 rounded-xl border transition-all duration-300 ${
                          needsAction ? 'bg-red-50/30 border-red-200' : 'bg-slate-50/30 border-slate-200'
                        }`}>
                          {needsAction && (
                            <div className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                              <ShieldAlert size={12} />
                              위험도가 9점 이상으로 법적 고시에 따른 감소대책 기재 및 잔류위험 평가가 의무적입니다.
                            </div>
                          )}

                          {/* Plan Inputs */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">추천 위험 감소 대책 수립안</label>
                            <textarea
                              rows={2}
                              value={h.reductionMeasures}
                              onChange={(e) => handleUpdateHazard(p.id, h.id, { reductionMeasures: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-slate-900"
                              placeholder="엔지니어링(센서 설치, 울타리 가드) 대책 또는 관리적(SOP 수립, 보호구 착용) 대책안 기재"
                            />
                          </div>

                          {/* Responsible & Planned date */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">개선예정 기한일</label>
                              <input
                                type="date"
                                value={h.plannedDate}
                                onChange={(e) => handleUpdateHazard(p.id, h.id, { plannedDate: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">실행 완료일 (이행 완료 시 기입)</label>
                              <input
                                type="date"
                                value={h.completionDate}
                                onChange={(e) => handleUpdateHazard(p.id, h.id, { completionDate: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">조치 책임 이행자</label>
                              <input
                                type="text"
                                value={h.responsiblePerson}
                                onChange={(e) => handleUpdateHazard(p.id, h.id, { responsiblePerson: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-xs"
                                placeholder="예: 김성태 부장"
                              />
                            </div>
                          </div>

                          {/* Residual post improvement evaluation */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 border-t border-slate-100 items-center">
                            <span className="text-[10px] font-bold text-slate-500 block">개선 조치 후 예상 잔류위험 추정:</span>
                            <div>
                              <label className="block text-[9px] text-slate-400">잔류 빈도 (L')</label>
                              <select
                                value={h.postLikelihood}
                                onChange={(e) => handleUpdateHazard(p.id, h.id, { postLikelihood: parseInt(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px]"
                              >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}단계</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-400">잔류 강도 (S')</label>
                              <select
                                value={h.postSeverity}
                                onChange={(e) => handleUpdateHazard(p.id, h.id, { postSeverity: parseInt(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px]"
                              >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}단계</option>)}
                              </select>
                            </div>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ========================================= */}
        {/* STEP 5: WORKFLOW & APPROVALS              */}
        {/* ========================================= */}
        {currentStep === 5 && (
          <div className="space-y-6" id="wizard-step5">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="text-slate-800" />
                  위험성평가 계획서 결재 및 이행 상신
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  작성을 마치고 결재 권한이 있는 경영 책임자(대표이사)에게 상신하거나 승인을 확정합니다.
                </p>
              </div>

              {/* Status Transitors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="workflow-action-cards">
                
                {/* Draft -> Review card */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-2 hover:border-slate-400 transition bg-slate-50/50">
                  <span className="bg-slate-200 text-slate-800 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">Action 1</span>
                  <h4 className="text-xs font-bold text-slate-900">대표이사 및 관리감독자 결재 상신</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    문서 상태를 <strong>'결재 중 (In Review)'</strong> 상태로 마크하여 타 부서에 회람을 요청합니다. 더 이상의 즉각적 요인 임의 삭제가 차단됩니다.
                  </p>
                  <button
                    onClick={() => handleSaveAssessment('review')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition mt-2"
                  >
                    결재 상신하기
                  </button>
                </div>

                {/* Simulated CEO Approval Card */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-2 hover:border-slate-400 transition bg-emerald-50/20">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">Action 2</span>
                  <h4 className="text-xs font-bold text-slate-900">대표이사 디지털 날인 및 최종 승인</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    경영책임자(대표이사) 권한으로 계획서를 최종 확인하고 <strong>'승인완료 (Approved)'</strong> 상태로 확정합니다. 법적 효력이 가동됩니다.
                  </p>
                  <button
                    onClick={() => handleSaveAssessment('approved')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition mt-2"
                  >
                    대표자 최종 결재 승인
                  </button>
                </div>

              </div>

              {/* Status Check Completion */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">현장 이행 상태 업데이트 (Completed)</h4>
                  <p className="text-[10px] text-slate-400">모든 위험 요인 감소 대책에 실제 완료일이 입력되면 이행완료 상태로 전환할 수 있습니다.</p>
                </div>
                <button
                  onClick={() => handleSaveAssessment('completed')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  이행 완료 마크
                </button>
              </div>

              {/* Real-time Audit Logs */}
              <div className="space-y-3" id="audit-logs-section">
                <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <History size={12} /> 평가 감사 로그 (Audit Trail Logs)
                </h3>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-xl max-h-48 overflow-y-auto space-y-1.5">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className="text-blue-400">[{log.userRole}]</span>
                      <span className="text-amber-300">{log.action}:</span>
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="mt-8 flex justify-between items-center" id="wizard-navigation">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold transition disabled:opacity-50"
            id="wizard-prev-btn"
          >
            <ArrowLeft size={14} /> 이전 단계
          </button>
          
          <button
            onClick={() => {
              if (currentStep === 5) {
                handleSaveAssessment();
                onBack();
              } else {
                setCurrentStep(prev => Math.min(5, prev + 1));
              }
            }}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
            id="wizard-next-btn"
          >
            {currentStep === 5 ? '저장 후 종료' : '다음 단계'}
            {currentStep !== 5 && <ArrowRight size={14} />}
          </button>
        </div>

      </div>
    </div>
  );
}
