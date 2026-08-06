/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RiskAssessment, WorkflowStatus } from '../types';
import { Search, Plus, Calendar, ShieldCheck, Copy, Trash2, ArrowRight, Eye, ClipboardList } from 'lucide-react';

interface AssessmentListProps {
  assessments: RiskAssessment[];
  onCreateNew: () => void;
  onSelect: (id: string) => void;
  onViewDoc: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AssessmentList({
  assessments,
  onCreateNew,
  onSelect,
  onViewDoc,
  onDuplicate,
  onDelete
}: AssessmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.companyProfile.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate high level stats
  const totalCount = assessments.length;
  const approvedCount = assessments.filter(a => a.status === 'approved' || a.status === 'completed').length;
  const reviewCount = assessments.filter(a => a.status === 'review').length;
  const draftCount = assessments.filter(a => a.status === 'draft').length;

  return (
    <div className="bg-slate-50 min-h-screen p-6 sm:p-8" id="assessment-list-root">
      <div className="max-w-7xl mx-auto space-y-6" id="assessment-list-container">
        
        {/* Top Title & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="list-header">
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-8 bg-emerald-500 rounded-sm mt-1 shrink-0"></span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                KRAS 위험성평가 종합 대시보드
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                제조 현장의 5단계 위험성평가 내역을 작성하고 버전을 관리합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            id="create-new-assessment-btn"
          >
            <Plus size={16} />
            신규 위험성평가 생성
          </button>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="list-metrics">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">총 평가 일지</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">14</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-700">
              <ClipboardList size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">최종 승인/이행</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">42%</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">결재 승인 대기</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">2건</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">작성 중 초안</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{draftCount}건</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
              <ClipboardList size={20} />
            </div>
          </div>
        </div>

        {/* Search, Status Filtering Row */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs" id="list-controls">
          {/* Left Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="평가명 또는 사업장명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              id="dashboard-search-input"
            />
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          </div>

          {/* Right Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5" id="dashboard-filter-chips">
            <span className="text-[11px] font-bold text-slate-400 mr-1.5">상태 필터:</span>
            {[
              { id: 'all', label: '전체보기' },
              { id: 'draft', label: '작성중' },
              { id: 'review', label: '결재중' },
              { id: 'approved', label: '승인됨' },
              { id: 'completed', label: '이행완료' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Card Grid / Rows */}
        <div className="space-y-4.5" id="dashboard-items-list">
          {filteredAssessments.map((a) => {
            const totalFactors = a.processes.reduce((sum, p) => sum + p.hazards.length, 0);
            const unacceptableFactors = a.processes.reduce(
              (sum, p) => sum + p.hazards.filter(h => h.riskScore >= 9).length,
              0
            );

            return (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                id={`assessment-card-${a.id}`}
              >
                {/* Left Side: Metadata */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      a.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {a.status === 'completed' ? '이행완료' :
                       a.status === 'approved' ? '최종승인' :
                       a.status === 'review' ? '결재검토중' : '작성초안'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Rev. {a.version}</span>
                    <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded">
                      {a.assessmentType === 'regular' ? '정기평가' : '수시평가'}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-950 truncate">{a.title}</h3>
                  
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                    <span>회사: <strong className="text-slate-600 font-medium">{a.companyProfile.companyName}</strong></span>
                    <span>공정수: <strong className="text-slate-600 font-medium">{a.processes.length}개</strong></span>
                    <span>도출 요인: <strong className="text-slate-600 font-medium">{totalFactors}건</strong> (허용불가: <span className="text-red-500 font-bold">{unacceptableFactors}건</span>)</span>
                  </div>
                </div>

                {/* Middle Date & Creator */}
                <div className="text-[11px] text-slate-400 flex flex-col justify-center">
                  <div>작성인: <strong className="text-slate-600 font-semibold">{a.companyProfile.siteManager || '안전관리자'}</strong></div>
                  <div className="mt-0.5">최종수정: <span className="font-mono">{a.updatedAt}</span></div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2" id="assessment-card-actions">
                  <button
                    onClick={() => onViewDoc(a.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition"
                    title="KRAS 표준 서식 인쇄/미리보기"
                    id={`view-doc-btn-${a.id}`}
                  >
                    <Eye size={14} />
                    문서 보기
                  </button>
                  <button
                    onClick={() => onSelect(a.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg transition"
                    title="편집 마법사 열기"
                    id={`edit-wizard-btn-${a.id}`}
                  >
                    기록 편집
                    <ArrowRight size={14} />
                  </button>
                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <button
                    onClick={() => onDuplicate(a.id)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    title="개정본 또는 사본 복사 생성"
                    id={`duplicate-btn-${a.id}`}
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="평가서 영구 삭제"
                    id={`delete-btn-${a.id}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredAssessments.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400" id="list-empty-state">
              <ClipboardList size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-xs font-semibold text-slate-600">등록된 위험성평가 내역이 없습니다.</p>
              <p className="text-[11px] text-slate-400 mt-1">상단의 '신규 위험성평가 생성' 버튼을 클릭해 첫 위험성분석을 시작하십시오.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
