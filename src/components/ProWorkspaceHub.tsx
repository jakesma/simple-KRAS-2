/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { RiskAssessment, CompanyProfile, ManufacturingProcess } from '../types';
import {
  Building2,
  Users,
  BookmarkCheck,
  BarChart3,
  Headphones,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  FileSpreadsheet,
  Sparkles,
  PhoneCall,
  Mail,
  Send,
  Layers,
  MapPin,
  UserPlus,
  FolderKanban
} from 'lucide-react';

export type ProHubTab = 'admin' | 'sites' | 'templates' | 'team' | 'support';

export interface SiteItem {
  id: string;
  companyName: string;
  siteName: string;
  ceoName: string;
  siteManager: string;
  department: string;
  address: string;
  employeeCount: number;
  businessRegNo: string;
  createdAt: string;
}

export interface CompanyTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  processes: ManufacturingProcess[];
}

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  permission: '관리자 (편집/승인)' | '작성자 (평가 작성)' | '열람자 (조회/출력)';
  status: '활성' | '초대됨';
  joinedAt: string;
}

export interface SupportTicketItem {
  id: string;
  category: string;
  title: string;
  content: string;
  contact: string;
  status: '우선 배정됨 (전담 매니저 확인중)' | '답변 완료';
  createdAt: string;
  reply?: string;
}

interface ProWorkspaceHubProps {
  activeSubTab: ProHubTab;
  onChangeSubTab: (tab: ProHubTab) => void;
  assessments: RiskAssessment[];
  subscriptionPlan: string | null;
  onUpgradePro: () => void;
  onCreateAssessmentFromSite: (profile: CompanyProfile, siteTitle: string) => void;
  onCreateAssessmentFromTemplate: (template: CompanyTemplateItem) => void;
  onSelectAssessment: (id: string) => void;
  onViewAssessmentDoc: (id: string) => void;
}

const STORAGE_SITES_KEY = 'kras_pro_sites_v1';
const STORAGE_TEMPLATES_KEY = 'kras_pro_templates_v1';
const STORAGE_TEAM_KEY = 'kras_pro_team_v1';
const STORAGE_SUPPORT_KEY = 'kras_pro_support_v1';

const DEFAULT_SITES: SiteItem[] = [
  {
    id: 'site_1',
    companyName: '(주)대한전설 건설사업본부',
    siteName: '평택 고덕 반도체 클린룸 전기공사 현장',
    ceoName: '홍길동',
    siteManager: '김철수 부장',
    department: '전기안전보건팀',
    address: '경기도 평택시 고덕면 산단로 101',
    employeeCount: 45,
    businessRegNo: '123-45-67890',
    createdAt: '2026-10-01',
  },
  {
    id: 'site_2',
    companyName: '(주)대한전설 건설사업본부',
    siteName: '송도 공동주택 3공구 골조 및 가설공사 현장',
    ceoName: '홍길동',
    siteManager: '박민수 소장',
    department: '건축안전팀',
    address: '인천광역시 연수구 센트럴로 210',
    employeeCount: 68,
    businessRegNo: '123-45-67890',
    createdAt: '2026-10-15',
  },
];

const DEFAULT_TEAM: TeamMemberItem[] = [
  {
    id: 'tm_1',
    name: '김철수 부장',
    email: 'cs.kim@safetycon.co.kr',
    role: '총괄 안전보건관리책임자',
    phone: '010-2345-6789',
    permission: '관리자 (편집/승인)',
    status: '활성',
    joinedAt: '2026-10-01',
  },
  {
    id: 'tm_2',
    name: '박민수 소장',
    email: 'ms.park@safetycon.co.kr',
    role: '현장소장 (골조/가설)',
    phone: '010-3456-7890',
    permission: '작성자 (평가 작성)',
    status: '활성',
    joinedAt: '2026-10-05',
  },
  {
    id: 'tm_3',
    name: '이수진 기사',
    email: 'sj.lee@safetycon.co.kr',
    role: '산업안전기사 (TBM/점검)',
    phone: '010-4567-8901',
    permission: '작성자 (평가 작성)',
    status: '활성',
    joinedAt: '2026-10-12',
  },
];

export default function ProWorkspaceHub({
  activeSubTab,
  onChangeSubTab,
  assessments,
  subscriptionPlan,
  onUpgradePro,
  onCreateAssessmentFromSite,
  onCreateAssessmentFromTemplate,
  onSelectAssessment,
  onViewAssessmentDoc,
}: ProWorkspaceHubProps) {
  // 1. 다수 현장 관리 상태
  const [sites, setSites] = useState<SiteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SITES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SITES;
    } catch {
      return DEFAULT_SITES;
    }
  });
  const [newSiteName, setNewSiteName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('(주)대한전설 건설사업본부');
  const [newSiteManager, setNewSiteManager] = useState('');
  const [newSiteAddress, setNewSiteAddress] = useState('');
  const [newEmployeeCount, setNewEmployeeCount] = useState('30');

  // 2. 회사 템플릿 관리 상태
  const [templates, setTemplates] = useState<CompanyTemplateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEMPLATES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return assessments.slice(0, 2).map((a, idx) => ({
      id: `tpl_seed_${idx}`,
      name: `[사내표준] ${a.title}`,
      category: a.assessmentType === 'regular' ? '정기 위험성평가 표준' : '수시 위험성평가 표준',
      description: `${a.processes.length}개 공정 / 유해위험요인 ${a.processes.reduce((s, p) => s + p.hazards.length, 0)}건 포함 표준 템플릿`,
      createdAt: a.createdAt,
      processes: a.processes,
    }));
  });
  const [selectedAssessmentForTemplate, setSelectedAssessmentForTemplate] = useState<string>(
    assessments[0]?.id || ''
  );
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('건설현장 사내 표준 템플릿');

  // 3. 팀원 공유 (최대 5명) 상태
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEAM_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  });
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPermission, setMemberPermission] = useState<TeamMemberItem['permission']>('작성자 (평가 작성)');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // 4. 우선 고객 지원 상태
  const [tickets, setTickets] = useState<SupportTicketItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SUPPORT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'tkt_1',
        category: '건설현장 위험성평가 기술지원',
        title: '고용노동부 정기감독 대비 KRAS 양식 및 사진대지 검토 요청',
        content: '수변전 설비 반입 공정 위험성평가표의 감소대책 적정성 검토를 요청합니다.',
        contact: '010-2345-6789',
        status: '답변 완료',
        createdAt: '2026-11-01',
        reply: '전담 안전컨설턴트 검토 완료: 산업안전보건기준에 관한 규칙 제301조~제325조 법적근거 및 절연보호구/검전기 조치사항이 적정하게 반영되어 있습니다.',
      },
    ];
  });
  const [ticketCategory, setTicketCategory] = useState('건설현장 위험성평가 기술지원');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketContent, setTicketContent] = useState('');
  const [ticketContact, setTicketContact] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_SITES_KEY, JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SUPPORT_KEY, JSON.stringify(tickets));
  }, [tickets]);

  // 전체 통계 계산 (관리자 대시보드용)
  const totalAssessments = assessments.length;
  const totalProcesses = assessments.reduce((sum, a) => sum + a.processes.length, 0);
  const allHazards = assessments.flatMap((a) => a.processes.flatMap((p) => p.hazards));
  const highRiskCount = allHazards.filter((h) => h.riskScore >= 12 || h.riskLevel === 'High').length;
  const mediumRiskCount = allHazards.filter((h) => h.riskScore >= 6 && h.riskScore < 12).length;
  const lowRiskCount = allHazards.filter((h) => h.riskScore < 6).length;
  const mitigatedCount = allHazards.filter((h) => h.postRiskScore <= 6).length;
  const mitigationRate = allHazards.length > 0 ? Math.round((mitigatedCount / allHazards.length) * 100) : 100;

  // 전체 평가서 통합 Excel 다운로드
  const handleExportAllSummaryExcel = () => {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><body>`;
    html += `<table border="1" style="border-collapse:collapse;font-family:'Malgun Gothic',sans-serif;font-size:12px;">`;
    html += `<tr style="background:#1e293b;color:#ffffff;font-weight:bold;">
      <th>번호</th><th>평가명</th><th>현장/회사명</th><th>구분</th><th>상태</th><th>공정 수</th><th>총 위험요인</th><th>고위험(High)</th><th>현장책임자</th><th>최종수정일</th>
    </tr>`;
    assessments.forEach((a, idx) => {
      const hList = a.processes.flatMap((p) => p.hazards);
      const highCnt = hList.filter((h) => h.riskScore >= 9).length;
      html += `<tr>
        <td>${idx + 1}</td>
        <td>${a.title}</td>
        <td>${a.companyProfile.companyName || '미지정'}</td>
        <td>${a.assessmentType === 'regular' ? '정기평가' : '수시평가'}</td>
        <td>${a.status}</td>
        <td>${a.processes.length}</td>
        <td>${hList.length}</td>
        <td>${highCnt}</td>
        <td>${a.companyProfile.siteManager || '안전관리자'}</td>
        <td>${a.updatedAt}</td>
      </tr>`;
    });
    html += `</table></body></html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIMPLE_KRAS_전체현장_위험성평가_통합현황_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddSite = () => {
    if (!newSiteName.trim()) return;
    const item: SiteItem = {
      id: `site_${Date.now()}`,
      companyName: newCompanyName.trim() || '(주)대한전설',
      siteName: newSiteName.trim(),
      ceoName: '홍길동',
      siteManager: newSiteManager.trim() || '현장소장',
      department: '안전보건관리팀',
      address: newSiteAddress.trim() || '현장 주소 미지정',
      employeeCount: Number(newEmployeeCount) || 30,
      businessRegNo: '123-45-67890',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSites([item, ...sites]);
    setNewSiteName('');
    setNewSiteManager('');
    setNewSiteAddress('');
  };

  const handleSaveTemplateFromAssessment = () => {
    const target = assessments.find((a) => a.id === selectedAssessmentForTemplate) || assessments[0];
    if (!target) return;
    const tplName = newTemplateName.trim() || `[사내표준] ${target.title}`;
    const clonedProcesses: ManufacturingProcess[] = JSON.parse(JSON.stringify(target.processes));
    const item: CompanyTemplateItem = {
      id: `tpl_${Date.now()}`,
      name: tplName,
      category: newTemplateCategory.trim() || '사내 표준 템플릿',
      description: `${clonedProcesses.length}개 공정 · 위험요인 ${clonedProcesses.reduce((s, p) => s + p.hazards.length, 0)}건 수록`,
      createdAt: new Date().toISOString().split('T')[0],
      processes: clonedProcesses,
    };
    setTemplates([item, ...templates]);
    setNewTemplateName('');
  };

  const handleAddTeamMember = () => {
    if (!memberName.trim() || !memberEmail.trim()) return;
    if (teamMembers.length >= 5) {
      alert('PRO 플랜은 최대 5명까지 팀원 공유가 가능합니다. 기존 팀원을 삭제 후 추가해 주세요.');
      return;
    }
    const item: TeamMemberItem = {
      id: `tm_${Date.now()}`,
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: memberRole.trim() || '안전담당자',
      phone: memberPhone.trim() || '010-0000-0000',
      permission: memberPermission,
      status: '초대됨',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setTeamMembers([...teamMembers, item]);
    setMemberName('');
    setMemberEmail('');
    setMemberRole('');
    setMemberPhone('');
  };

  const handleSubmitSupportTicket = () => {
    if (!ticketTitle.trim() || !ticketContent.trim()) return;
    const titleVal = ticketTitle.trim();
    const contentVal = ticketContent.trim();
    const contactVal = ticketContact.trim() || '등록된 연락처';
    const item: SupportTicketItem = {
      id: `tkt_${Date.now()}`,
      category: ticketCategory,
      title: titleVal,
      content: contentVal,
      contact: contactVal,
      status: '우선 배정됨 (전담 매니저 확인중)',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTickets([item, ...tickets]);
    // jake3082kk@gmail.com 으로 실시간 문의 알림 전송
    fetch('https://formsubmit.co/ajax/jake3082kk@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `[SIMPLE KRAS PRO 우선지원] ${ticketCategory} - ${titleVal}`,
        분류: ticketCategory,
        제목: titleVal,
        연락처: contactVal,
        내용: contentVal,
      }),
    }).catch(() => {});
    setTicketTitle('');
    setTicketContent('');
    setTicketContact('');
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 상단 PRO 워크스페이스 헤더 및 서브탭 */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                <Sparkles size={13} />
                <span>
                  {subscriptionPlan === 'Pro'
                    ? 'PRO 비즈니스 워크스페이스 가동 중 (전체 기능 무제한)'
                    : 'PRO 통합 안전관리 워크스페이스'}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                SIMPLE KRAS PRO 통합 관리 센터
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                관리자 대시보드 · 다수 현장 관리 · 회사 템플릿 관리 · 팀원 공유(최대 5명) · 우선 고객 지원
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAllSummaryExcel}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <FileSpreadsheet size={15} />
                <span>전체 현장 통합 Excel 출력</span>
              </button>
              {subscriptionPlan !== 'Pro' && (
                <button
                  onClick={onUpgradePro}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-sm cursor-pointer"
                >
                  <span>PRO 정식 활성화 (₩380,000)</span>
                </button>
              )}
            </div>
          </div>

          {/* 5대 PRO 핵심 기능 탭 버튼 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'admin' as ProHubTab, label: '관리자 대시보드', icon: BarChart3, badge: '통합 통계' },
              { id: 'sites' as ProHubTab, label: '다수 현장 관리', icon: Building2, badge: `${sites.length}개 현장` },
              { id: 'templates' as ProHubTab, label: '회사 템플릿 관리', icon: BookmarkCheck, badge: `${templates.length}/20개` },
              { id: 'team' as ProHubTab, label: '팀원 공유 (최대 5명)', icon: Users, badge: `${teamMembers.length}/5명` },
              { id: 'support' as ProHubTab, label: '우선 고객 지원', icon: Headphones, badge: 'VIP 직통' },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeSubTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeSubTab(t.id)}
                  className={`flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer border ${
                    active
                      ? 'bg-white text-slate-900 border-white shadow-md font-black'
                      : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/15 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon size={16} className={active ? 'text-indigo-600 shrink-0' : 'text-amber-300 shrink-0'} />
                    <span className="text-xs truncate">{t.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      active ? 'bg-indigo-100 text-indigo-700' : 'bg-black/30 text-slate-300'
                    }`}
                  >
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. 관리자 대시보드 탭 */}
        {activeSubTab === 'admin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400">운영 중인 건설현장</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{sites.length}개 현장</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  총 평가서 {totalAssessments}건 · 공정 {totalProcesses}개
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400">고위험(High) 유해요인</span>
                <div className="text-2xl font-black text-rose-600 mt-1">{highRiskCount}건</div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  중위험 {mediumRiskCount}건 · 저위험 {lowRiskCount}건
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400">위험감소대책 적정 이행률</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{mitigationRate}%</div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  개선 후 허용 가능 수준({mitigatedCount}/{allHazards.length}건)
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400">협업 팀원 및 사내 템플릿</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">
                  {teamMembers.length}/5명 · {templates.length}개
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  PRO 권한 실시간 동기화 활성
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">전사 현장별 위험성평가 종합 모니터링</h2>
                  <p className="text-xs text-slate-500">각 현장의 위험성평가 승인 상태 및 고위험 요인을 한눈에 관리합니다.</p>
                </div>
                <button
                  onClick={handleExportAllSummaryExcel}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Excel 리포트 다운로드</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                      <th className="py-3 px-4">평가서 제목</th>
                      <th className="py-3 px-4">현장 / 회사명</th>
                      <th className="py-3 px-4">관리감독자</th>
                      <th className="py-3 px-4 text-center">공정 수</th>
                      <th className="py-3 px-4 text-center">고위험 요인</th>
                      <th className="py-3 px-4 text-center">결재 상태</th>
                      <th className="py-3 px-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assessments.map((a) => {
                      const highCnt = a.processes.reduce(
                        (s, p) => s + p.hazards.filter((h) => h.riskScore >= 9).length,
                        0
                      );
                      return (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{a.title}</td>
                          <td className="py-3 px-4 text-slate-600">{a.companyProfile.companyName || '본사 표준 현장'}</td>
                          <td className="py-3 px-4 text-slate-600">{a.companyProfile.siteManager || '안전관리자'}</td>
                          <td className="py-3 px-4 text-center font-semibold">{a.processes.length}개</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">
                              {highCnt}건
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                              {a.status === 'approved' ? '최종승인' : a.status === 'completed' ? '이행완료' : '작성/검토중'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => onViewAssessmentDoc(a.id)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                            >
                              보고서/Excel
                            </button>
                            <button
                              onClick={() => onSelectAssessment(a.id)}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                            >
                              편집
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. 다수 현장 관리 탭 */}
        {activeSubTab === 'sites' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <Building2 size={18} className="text-indigo-600" />
                신규 건설현장 등록 (다수 현장 통합 관리)
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                여러 건설현장의 기본 정보(현장명, 소장명, 주소, 근로자 수)를 등록해 두고 현장별 위험성평가를 즉시 생성할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="소속 회사명"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="현장명 (예: 판교 데이터센터 신축현장) *"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newSiteManager}
                  onChange={(e) => setNewSiteManager(e.target.value)}
                  placeholder="현장소장 / 안전관리자명"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  placeholder="현장 주소"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  onClick={handleAddSite}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>현장 추가</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                        {site.companyName}
                      </span>
                      <button
                        onClick={() => setSites(sites.filter((s) => s.id !== site.id))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="현장 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{site.siteName}</h3>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{site.address}</span>
                      </div>
                      <div>
                        현장책임자: <strong>{site.siteManager}</strong> · 투입 근로자: <strong>{site.employeeCount}명</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">등록일: {site.createdAt}</span>
                    <button
                      onClick={() =>
                        onCreateAssessmentFromSite(
                          {
                            companyName: `${site.companyName} - ${site.siteName}`,
                            ceoName: site.ceoName,
                            address: site.address,
                            employeeCount: site.employeeCount,
                            businessRegNo: site.businessRegNo,
                            siteManager: site.siteManager,
                            department: site.department,
                          },
                          `${site.siteName} 정기 위험성평가`
                        )
                      }
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <span>이 현장 위험성평가 즉시 생성</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 회사 템플릿 관리 탭 */}
        {activeSubTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <BookmarkCheck size={18} className="text-emerald-600" />
                사내 표준 위험성평가 템플릿 보관함 ({templates.length} / 20개)
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                자주 사용하는 공종별 위험성평가표를 회사 표준 템플릿으로 저장하고, 신규 착공 현장에서 1초 만에 불러와 재사용할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={selectedAssessmentForTemplate}
                  onChange={(e) => setSelectedAssessmentForTemplate(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      원본 선택: {a.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="새 템플릿 이름 (미입력 시 자동 생성)"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  placeholder="분류 (예: 전기공사 표준, 골조공사 표준)"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  onClick={handleSaveTemplateFromAssessment}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>사내 템플릿으로 등록</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                        {tpl.category}
                      </span>
                      <button
                        onClick={() => setTemplates(templates.filter((t) => t.id !== tpl.id))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="템플릿 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{tpl.name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{tpl.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">생성일: {tpl.createdAt}</span>
                    <button
                      onClick={() => onCreateAssessmentFromTemplate(tpl)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <span>이 템플릿으로 새 평가서 생성</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 팀원 공유 (최대 5명) 탭 */}
        {activeSubTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    팀원 공유 및 협업 권한 관리 ({teamMembers.length} / 5명)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    최대 5명의 현장소장·안전관리자·시공담당자를 초대하여 위험성평가서와 TBM 회의록을 공동 작성·결재할 수 있습니다.
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?invite=pro-team`);
                    setCopiedShareLink(true);
                    setTimeout(() => setCopiedShareLink(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer shrink-0"
                >
                  {copiedShareLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedShareLink ? '초대 링크 복사됨!' : '팀원 전용 공유 링크 복사'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="팀원 성명 *"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="이메일 주소 *"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="직책/담당 (예: 공무과장, 안전기사)"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <select
                  value={memberPermission}
                  onChange={(e) => setMemberPermission(e.target.value as TeamMemberItem['permission'])}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="관리자 (편집/승인)">관리자 (편집/승인)</option>
                  <option value="작성자 (평가 작성)">작성자 (평가 작성)</option>
                  <option value="열람자 (조회/출력)">열람자 (조회/출력)</option>
                </select>
                <button
                  onClick={handleAddTeamMember}
                  disabled={teamMembers.length >= 5}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <UserPlus size={15} />
                  <span>팀원 초대 ({teamMembers.length}/5)</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">성명</th>
                    <th className="py-3 px-4">이메일</th>
                    <th className="py-3 px-4">담당 직책</th>
                    <th className="py-3 px-4">접근 권한</th>
                    <th className="py-3 px-4 text-center">상태</th>
                    <th className="py-3 px-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {teamMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{m.email}</td>
                      <td className="py-3 px-4 text-slate-600">{m.role}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {m.permission}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setTeamMembers(teamMembers.filter((t) => t.id !== m.id))}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="팀원 제외"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. 우선 고객 지원 탭 */}
        {activeSubTab === 'support' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">PRO 전용 우선 고객지원 핫라인</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">010-6491-6210</div>
                  <span className="text-[11px] text-slate-500">평일 09:00 ~ 18:00 (PRO 고객 최우선 응대)</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">전담 기술/안전컨설팅 이메일</span>
                  <a
                    href="mailto:jake3082kk@gmail.com"
                    className="text-base font-black text-slate-900 hover:text-indigo-600 mt-0.5 block"
                  >
                    jake3082kk@gmail.com
                  </a>
                  <span className="text-[11px] text-slate-500">위험성평가 양식 커스텀 및 감독 대응 지원</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">평균 회신 소요 시간</span>
                  <div className="text-base font-black text-emerald-600 mt-0.5">영업시간 내 2시간 이내</div>
                  <span className="text-[11px] text-slate-500">PRO 회원 전담 기술지원 SLA 보장</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <Headphones size={18} className="text-indigo-600" />
                PRO 우선 고객 지원 1:1 요청 접수
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                현장 공종 추가 요청, 고용노동부 점검 대비 위험성평가 검토, 출력 서식 기술지원을 최우선으로 처리해 드립니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="건설현장 위험성평가 기술지원">건설현장 위험성평가 기술지원</option>
                  <option value="사내 맞춤 공종/템플릿 추가 요청">사내 맞춤 공종/템플릿 추가 요청</option>
                  <option value="PDF/Excel 보고서 서식 지원">PDF/Excel 보고서 서식 지원</option>
                  <option value="결제/세금계산서/계정 문의">결제/세금계산서/계정 문의</option>
                </select>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="문의 제목 *"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={ticketContact}
                  onChange={(e) => setTicketContact(e.target.value)}
                  placeholder="회신받을 연락처 또는 이메일"
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <textarea
                  value={ticketContent}
                  onChange={(e) => setTicketContent(e.target.value)}
                  placeholder="현장명 및 지원이 필요한 내용을 입력해 주세요..."
                  rows={2}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  onClick={handleSubmitSupportTicket}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <Send size={14} />
                  <span>우선 지원 접수하기</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                        {t.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{t.createdAt}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      {t.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{t.content}</p>
                  {t.reply && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <strong className="text-indigo-700 block mb-0.5">전담 컨설턴트 답변:</strong>
                      {t.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

