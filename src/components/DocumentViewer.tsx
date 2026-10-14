/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RiskAssessment, HazardItem, AssessmentPhotoSheet, AssessmentPhotoItem } from '../types';
import { 
  FileText, Printer, ArrowLeft, Download, ShieldAlert, 
  CheckCircle2, Copy, Check, Pencil, ClipboardCheck, 
  Camera, Image as ImageIcon, Upload, Trash2, Plus, RefreshCw 
} from 'lucide-react';

interface DocumentViewerProps {
  assessment: RiskAssessment;
  onBack: () => void;
  onCreateTbm: () => void;
  onEdit: () => void;
  onUpdateAssessment?: (updated: RiskAssessment) => void;
}

type DocumentTab = 'survey' | 'hazard' | 'estimation' | 'reduction' | 'kras';

export default function DocumentViewer({ assessment, onBack, onCreateTbm, onEdit, onUpdateAssessment }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<DocumentTab>('kras');
  const [copied, setCopied] = useState(false);

  // Photo Sheet State (Applied only to standard KRAS evaluation sheet)
  const [photoSheet, setPhotoSheet] = useState<AssessmentPhotoSheet>(() => {
    return assessment.photoSheet || {
      title: '현장 유해·위험요인 및 개선 조치 사진대지',
      inspector: assessment.companyProfile.siteManager || '안전관리자',
      inspectionDate: assessment.createdAt || new Date().toISOString().split('T')[0],
      photo1: {
        title: '개선 전 (위험요인 발견)',
        location: assessment.processes[0]?.processName || '현장 주요 공종 구역',
        description: '작업 전 유해·위험요인 발생 상태 및 불안전한 행동·상태 현장 사진',
        imageUrl: ''
      },
      photo2: {
        title: '개선 후 (안전조치 완료)',
        location: assessment.processes[0]?.processName || '현장 주요 공종 구역',
        description: '위험성 감소대책 이행 완료 및 안전시설물·보호구 착용 조치 결과 사진',
        imageUrl: ''
      }
    };
  });

  const handleUpdatePhotoSheet = (updatedSheet: AssessmentPhotoSheet) => {
    setPhotoSheet(updatedSheet);
    if (onUpdateAssessment) {
      onUpdateAssessment({
        ...assessment,
        photoSheet: updatedSheet
      });
    }
  };

  const handleImageUpload = (slot: 'photo1' | 'photo2', file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        // High quality client compression to ~100KB so it prints crisply and saves reliably
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

          const currentSlot = photoSheet[slot] || {
            title: slot === 'photo1' ? '개선 전 (위험요인 발견)' : '개선 후 (안전조치 완료)',
            location: '주요 작업 구역',
            description: '',
            imageUrl: ''
          };

          const updated: AssessmentPhotoSheet = {
            ...photoSheet,
            [slot]: {
              ...currentSlot,
              imageUrl: dataUrl
            }
          };
          handleUpdatePhotoSheet(updated);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (slot: 'photo1' | 'photo2') => {
    const currentSlot = photoSheet[slot];
    if (!currentSlot) return;
    const updated: AssessmentPhotoSheet = {
      ...photoSheet,
      [slot]: {
        ...currentSlot,
        imageUrl: ''
      }
    };
    handleUpdatePhotoSheet(updated);
  };

  const handleFieldChange = (slot: 'photo1' | 'photo2', field: keyof AssessmentPhotoItem, val: string) => {
    const currentSlot = photoSheet[slot] || {
      title: slot === 'photo1' ? '개선 전 (위험요인 발견)' : '개선 후 (안전조치 완료)',
      location: '',
      description: '',
      imageUrl: ''
    };
    const updated: AssessmentPhotoSheet = {
      ...photoSheet,
      [slot]: {
        ...currentSlot,
        [field]: val
      }
    };
    handleUpdatePhotoSheet(updated);
  };

  const totalHazards = assessment.processes.reduce((acc, p) => acc + p.hazards.length, 0);
  const unacceptableHazards = assessment.processes.reduce(
    (acc, p) => acc + p.hazards.filter((h) => h.riskScore >= 9).length,
    0
  );
  const completedReductions = assessment.processes.reduce(
    (acc, p) => acc + p.hazards.filter((h) => h.riskScore >= 9 && h.completionDate).length,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  // Helper to copy standard document representation as markdown table
  const handleCopyMarkdown = () => {
    let markdown = `# 위험성평가 보고서 - ${assessment.title}\n\n`;
    markdown += `* **사업장명**: ${assessment.companyProfile.companyName}\n`;
    markdown += `* **대표자**: ${assessment.companyProfile.ceoName}\n`;
    markdown += `* **평가 구분**: ${assessment.assessmentType === 'regular' ? '정기평가' : '수시평가'}\n`;
    markdown += `* **평가일**: ${assessment.createdAt}\n\n`;

    if (activeTab === 'kras') {
      markdown += `## KRAS 표준 위험성평가표\n\n`;
      markdown += `| 공정명 | 작업 내용 | 유해위험 요인 (상황 및 결과) | 법적근거 | 현재조치 | 빈도 | 강도 | 최초점수 | 위험감소대책 | 개선예정일 | 담당자 | 개선후 빈도 | 개선후 강도 | 잔류점수 |\n`;
      markdown += `| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |\n`;
      
      assessment.processes.forEach((p) => {
        if (p.hazards.length === 0) {
          markdown += `| ${p.processName} | ${p.detailedWorkContent} | 등록된 위험요인 없음 | - | - | - | - | - | - | - | - | - | - | - |\n`;
        } else {
          p.hazards.forEach((h) => {
            markdown += `| ${p.processName} | ${p.detailedWorkContent} | ${h.hazardSituation} | ${h.legalBasis} | ${h.currentSafetyMeasures} | ${h.likelihood} | ${h.severity} | ${h.riskScore} (${h.riskLevel}) | ${h.reductionMeasures} | ${h.plannedDate} | ${h.responsiblePerson} | ${h.postLikelihood} | ${h.postSeverity} | ${h.postRiskScore} |\n`;
          });
        }
      });

      if (photoSheet.photo1?.imageUrl || photoSheet.photo2?.imageUrl) {
        markdown += `\n\n## 현장 위험요인 및 개선 조치 사진대지\n`;
        if (photoSheet.photo1?.imageUrl) {
          markdown += `* **[사진 1] ${photoSheet.photo1.title}**: ${photoSheet.photo1.description} (위치: ${photoSheet.photo1.location})\n`;
        }
        if (photoSheet.photo2?.imageUrl) {
          markdown += `* **[사진 2] ${photoSheet.photo2.title}**: ${photoSheet.photo2.description} (위치: ${photoSheet.photo2.location})\n`;
        }
      }
    } else if (activeTab === 'survey') {
      markdown += `## 안전보건정보 사전조사서\n\n`;
      markdown += `| 공정명 | 작업내용 | 사용 기계·설비 | 취급 화학물질 | 투입 근로자 | 관리감독자 |\n`;
      markdown += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      assessment.processes.forEach((p) => {
        markdown += `| ${p.processName} | ${p.detailedWorkContent} | ${p.equipmentUsed.join(', ') || '없음'} | ${p.chemicalsUsed.join(', ') || '없음'} | ${p.workerNames.join(', ') || '지정 안 됨'} | ${p.supervisor || '지정 안 됨'} |\n`;
      });
    }

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-16" id="document-viewer-container">
      {/* Document Control Header (Hidden on Print) */}
      <div className="bg-slate-100 border-b border-slate-200 py-4 px-6 sticky top-0 z-20 print:hidden" id="doc-control-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4" id="doc-control-inner">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition"
              title="뒤로 가기"
              id="doc-back-btn"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">KRAS-Style Output</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  assessment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  assessment.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {assessment.status === 'completed' ? '이행완료' :
                   assessment.status === 'approved' ? '승인완료' : '검토/작성중'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 truncate max-w-md">{assessment.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={onCreateTbm}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              id="doc-create-tbm-btn"
            >
              <ClipboardCheck size={14} />
              오늘 TBM 회의록
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              id="doc-edit-btn"
            >
              <Pencil size={14} />
              수정하기
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold transition"
              id="doc-copy-markdown-btn"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? '복사됨!' : '마크다운 복사'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition"
              id="doc-print-btn"
            >
              <Printer size={14} />
              인쇄 및 PDF 저장
            </button>
          </div>
        </div>
      </div>

      {/* Mini Stats (Hidden on Print) */}
      <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 print:hidden" id="doc-stats-bar">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">총 도출 요인</span>
            <span className="text-lg font-bold text-slate-800">{totalHazards}건</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">허용 불가 요인</span>
            <span className={`text-lg font-bold ${unacceptableHazards > 0 ? 'text-red-500' : 'text-slate-800'}`}>
              {unacceptableHazards}건
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">대책 실행 완료</span>
            <span className="text-lg font-bold text-emerald-600">
              {completedReductions} / {unacceptableHazards}건
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">개정 이력</span>
            <span className="text-lg font-bold text-blue-600">Revision {assessment.version}</span>
          </div>
        </div>
      </div>

      {/* Document Tab Switcher (Hidden on Print) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 sticky top-[69px] z-10 print:hidden" id="doc-tabs-bar">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-1" id="doc-tabs-inner">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'survey' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-survey-btn"
          >
            1. 안전보건정보 조사서
          </button>
          <button
            onClick={() => setActiveTab('hazard')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'hazard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-hazard-btn"
          >
            2. 유해위험요인 파악표
          </button>
          <button
            onClick={() => setActiveTab('estimation')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'estimation' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-estimation-btn"
          >
            3. 위험성 추정 및 결정서
          </button>
          <button
            onClick={() => setActiveTab('reduction')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'reduction' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-reduction-btn"
          >
            4. 위험감소대책 실행계획서
          </button>
          <button
            onClick={() => setActiveTab('kras')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'kras' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
            id="tab-kras-btn"
          >
            5. KRAS 표준 위험성평가표
          </button>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div className="max-w-7xl mx-auto px-6 py-10 print:p-0" id="printable-sheet">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12 print:border-none print:shadow-none print:p-0 print:text-black">
          
          {/* Document Common Title Header */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-4 mb-8" id="sheet-title-header">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-1">
              {activeTab === 'survey' && '안 전 보 건 정 보 사 전 조 사 서'}
              {activeTab === 'hazard' && '유 해 · 위 험 요 인 파 악 표'}
              {activeTab === 'estimation' && '위 험 성 추 정 및 결 정 서'}
              {activeTab === 'reduction' && '위 험 감 소 대 책 실 행 계 획 서'}
              {activeTab === 'kras' && 'KRAS 표 준 위 험 성 평 가 표'}
            </h1>
            <p className="text-[11px] text-slate-500 print:text-slate-600 font-medium">
              한국산업안전보건공단 KRAS(위험성평가) 표준 규격 연동 고시 서식
            </p>
          </div>

          {/* Business & Review Approval Sign Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-8 print:grid-cols-2" id="sheet-meta-block">
            {/* Left Info */}
            <div className="space-y-1 text-xs">
              <div className="flex"><span className="w-24 font-bold text-slate-500">평가명:</span> <span className="text-slate-950 font-semibold">{assessment.title}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-500">사업장명:</span> <span className="text-slate-950">{assessment.companyProfile.companyName}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-500">대표자명:</span> <span className="text-slate-950">{assessment.companyProfile.ceoName}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-500">소재지:</span> <span className="text-slate-950">{assessment.companyProfile.address}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-500">근로자수:</span> <span className="w-24 text-right text-slate-950">{assessment.companyProfile.employeeCount} 명</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-500">작성일자:</span> <span className="w-24 text-right text-slate-950 font-mono">{assessment.createdAt}</span></div>
            </div>

            {/* Right Standard Korean Approval Box */}
            <div className="flex justify-end" id="approval-box-wrapper">
              <table className="border-collapse border border-slate-900 text-[10px] text-center w-56">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-900">
                    <th rowSpan={2} className="border-r border-slate-900 w-10 font-bold p-1">결재</th>
                    <th className="border-r border-slate-900 p-1 font-medium">작성자 (안전인)</th>
                    <th className="p-1 font-medium">승인자 (대표이사)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-12">
                    <td className="border-r border-slate-900 bg-slate-50 p-1 font-bold text-slate-500">서명</td>
                    <td className="border-r border-slate-900 p-1 text-slate-400 italic">
                      {assessment.companyProfile.siteManager || '인'}
                    </td>
                    <td className="p-1 text-slate-400 italic">
                      {assessment.status === 'approved' || assessment.status === 'completed' ? (
                        <span className="text-blue-600 font-bold not-italic">서명완료</span>
                      ) : (
                        '서명대기'
                      )}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-900">
                    <td className="border-r border-slate-900 bg-slate-50 p-1 font-bold text-slate-500">일자</td>
                    <td className="border-r border-slate-900 p-1 font-mono text-[9px]">{assessment.createdAt}</td>
                    <td className="p-1 font-mono text-[9px]">
                      {assessment.status === 'approved' || assessment.status === 'completed' ? assessment.updatedAt : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================= */}
          {/* TAB 1: SAFETY & HEALTH INFORMATION SURVEY */}
          {/* ========================================= */}
          {activeTab === 'survey' && (
            <div className="space-y-6" id="survey-doc-content">
              <h3 className="text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 border-l-4 border-slate-900">
                1. 공정별 투입자원 및 작업환경 기초 조사
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-900" id="survey-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-900 text-slate-700 font-bold text-center">
                    <th className="border-r border-slate-900 p-2.5 w-1/5">공정명</th>
                    <th className="border-r border-slate-900 p-2.5 w-1/3">상세 작업 내용</th>
                    <th className="border-r border-slate-900 p-2.5">사용 기계 및 설비</th>
                    <th className="border-r border-slate-900 p-2.5">취급 유해물질 / 화학제품</th>
                    <th className="border-r border-slate-900 p-2.5 w-24">근로자수 / 감독자</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {assessment.processes.map((p) => (
                    <tr key={p.id}>
                      <td className="border-r border-slate-900 p-2.5 font-bold bg-slate-50/50">{p.processName}</td>
                      <td className="border-r border-slate-900 p-2.5 whitespace-pre-wrap">{p.detailedWorkContent}</td>
                      <td className="border-r border-slate-900 p-2.5">{p.equipmentUsed.join(', ') || '특이 기계 없음'}</td>
                      <td className="border-r border-slate-900 p-2.5">{p.chemicalsUsed.join(', ') || '해당 없음'}</td>
                      <td className="border-r border-slate-900 p-2.5 text-center">
                        <div className="font-semibold">{p.workerNames.length}명</div>
                        <div className="text-[10px] text-slate-500">감독자: {p.supervisor}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 2: HAZARD IDENTIFICATION SURVEY */}
          {/* ========================================= */}
          {activeTab === 'hazard' && (
            <div className="space-y-6" id="hazard-doc-content">
              <h3 className="text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 border-l-4 border-slate-900">
                2. 공정별 현장 순회 및 인터뷰 기반 유해·위험요인 도출표
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-900" id="hazard-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-900 text-slate-700 font-bold text-center">
                    <th className="border-r border-slate-900 p-2.5 w-1/6">공정명</th>
                    <th className="border-r border-slate-900 p-2.5 w-1/6">기계·작업활동</th>
                    <th className="border-r border-slate-900 p-2.5 w-32">위험 분류 / 형태</th>
                    <th className="border-r border-slate-900 p-2.5">유해위험요인 상황 및 예상 결과 (KRAS 표준어조)</th>
                    <th className="border-r border-slate-900 p-2.5 w-1/4">관련 법적 근거 명시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {assessment.processes.flatMap((p) => 
                    p.hazards.map((h, index) => (
                      <tr key={h.id}>
                        {index === 0 ? (
                          <td rowSpan={p.hazards.length} className="border-r border-slate-900 p-2.5 font-bold bg-slate-50/50 text-center align-middle w-1/6">
                            {p.processName}
                          </td>
                        ) : null}
                        <td className="border-r border-slate-900 p-2.5">{h.machineryRelated}</td>
                        <td className="border-r border-slate-900 p-2.5 text-center">
                          <span className="font-bold text-slate-900">
                            {h.hazardCategory === 'Mechanical' ? '기계적' :
                             h.hazardCategory === 'Electrical' ? '전기적' :
                             h.hazardCategory === 'Chemical' ? '화학적' :
                             h.hazardCategory === 'FireExplosion' ? '화재·폭발' :
                             h.hazardCategory === 'Ergonomic' ? '근골격계' :
                             h.hazardCategory === 'Physical' ? '물리적' :
                             h.hazardCategory === 'WorkEnvironment' ? '작업환경' : '기타'}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">({h.accidentType})</div>
                        </td>
                        <td className="border-r border-slate-900 p-2.5 whitespace-pre-wrap leading-relaxed">{h.hazardSituation}</td>
                        <td className="border-r border-slate-900 p-2.5 text-slate-600 leading-normal text-[11px]">{h.legalBasis}</td>
                      </tr>
                    ))
                  )}
                  {totalHazards === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">등록된 유해위험요인이 전혀 없습니다. 평가를 편집하여 등록해주십시오.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 3: RISK ESTIMATION & DETERMINATION */}
          {/* ========================================= */}
          {activeTab === 'estimation' && (
            <div className="space-y-6" id="estimation-doc-content">
              <h3 className="text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 border-l-4 border-slate-900">
                3. 빈도 × 강도 계산법 기반 위험성 정량 추정 및 허용 판정서
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-900" id="estimation-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-900 text-slate-700 font-bold text-center">
                    <th className="border-r border-slate-900 p-2 w-1/6">공정명</th>
                    <th className="border-r border-slate-900 p-2">유해위험 상황 및 예상 결과</th>
                    <th className="border-r border-slate-900 p-2 w-28">현재 안전 조치 상태</th>
                    <th className="border-r border-slate-900 p-2 w-14">빈도 (L)</th>
                    <th className="border-r border-slate-900 p-2 w-14">강도 (S)</th>
                    <th className="border-r border-slate-900 p-2 w-16">위험 점수 (L×S)</th>
                    <th className="border-r border-slate-900 p-2 w-16">위험 수준</th>
                    <th className="border-r border-slate-900 p-2 w-20">허용 여부</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-center">
                  {assessment.processes.flatMap((p) => 
                    p.hazards.map((h, index) => (
                      <tr key={h.id} className="text-slate-800">
                        {index === 0 ? (
                          <td rowSpan={p.hazards.length} className="border-r border-slate-900 p-2 font-bold bg-slate-50/50 align-middle text-center w-1/6">
                            {p.processName}
                          </td>
                        ) : null}
                        <td className="border-r border-slate-900 p-2 text-left whitespace-pre-wrap leading-relaxed">{h.hazardSituation}</td>
                        <td className="border-r border-slate-900 p-2 text-left whitespace-pre-wrap">{h.currentSafetyMeasures}</td>
                        <td className="border-r border-slate-900 p-2 font-semibold font-mono">{h.likelihood}</td>
                        <td className="border-r border-slate-900 p-2 font-semibold font-mono">{h.severity}</td>
                        <td className="border-r border-slate-900 p-2 font-bold font-mono text-slate-950 bg-slate-50">{h.riskScore}</td>
                        <td className="border-r border-slate-900 p-2">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            h.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                            h.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {h.riskLevel === 'High' ? '고위험' : h.riskLevel === 'Medium' ? '중위험' : '저위험'}
                          </span>
                        </td>
                        <td className="border-r border-slate-900 p-2">
                          <span className={`font-extrabold text-[11px] ${h.isAcceptable ? 'text-emerald-600' : 'text-red-600 font-black'}`}>
                            {h.isAcceptable ? '허용 가능' : '허용 불가'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="bg-slate-50 p-4 border border-slate-300 text-[11px] leading-relaxed text-slate-600 rounded" id="estimation-notes">
                <span className="font-bold text-slate-800 block mb-1">※ 위험성 결정 고시 기준:</span>
                • 위험 점수 <strong>1~8점</strong>: 통상 수준의 관리 조치가 유지되는 상태로 안전성이 <strong>허용 가능(Acceptable)</strong>한 수준으로 결정됩니다.<br />
                • 위험 점수 <strong>9~25점</strong>: 중상해 및 기계 협착, 중독 리스크가 잔존하여 <strong>허용 불가(Unacceptable)</strong> 상태이므로 조속한 감소대책의 이행이 강제됩니다.
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 4: RISK REDUCTION MEASURE EXECUTION PLAN */}
          {/* ========================================= */}
          {activeTab === 'reduction' && (
            <div className="space-y-6" id="reduction-doc-content">
              <h3 className="text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 border-l-4 border-slate-900">
                4. 개선 대상 유해위험요인 감소 대책 실행 및 추적 계획서
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-900" id="reduction-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-900 text-slate-700 font-bold text-center">
                    <th className="border-r border-slate-900 p-2 w-1/6">공정명</th>
                    <th className="border-r border-slate-900 p-2">기존 요인 (점수)</th>
                    <th className="border-r border-slate-900 p-2 w-1/3">수립된 구체적 위험 감소 대책</th>
                    <th className="border-r border-slate-900 p-2 w-20">개선예정일</th>
                    <th className="border-r border-slate-900 p-2 w-14">담당자</th>
                    <th className="border-r border-slate-900 p-2 w-20">이행 완료일</th>
                    <th className="border-r border-slate-900 p-2 w-16">개선 후 잔류위험 (L×S)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-center">
                  {assessment.processes.flatMap((p) => 
                    p.hazards.filter(h => h.riskScore >= 9).map((h, index, arr) => (
                      <tr key={h.id}>
                        {index === 0 ? (
                          <td rowSpan={arr.length} className="border-r border-slate-900 p-2 font-bold bg-slate-50/50 align-middle text-center w-1/6">
                            {p.processName}
                          </td>
                        ) : null}
                        <td className="border-r border-slate-900 p-2 text-left">
                          <div className="line-clamp-2 leading-snug">{h.hazardSituation}</div>
                          <div className="text-[10px] text-red-600 font-bold mt-1">최초 점수: {h.riskScore}점</div>
                        </td>
                        <td className="border-r border-slate-900 p-2 text-left whitespace-pre-wrap leading-relaxed font-medium">{h.reductionMeasures}</td>
                        <td className="border-r border-slate-900 p-2 font-mono text-[10px]">{h.plannedDate}</td>
                        <td className="border-r border-slate-900 p-2">{h.responsiblePerson}</td>
                        <td className="border-r border-slate-900 p-2 font-mono text-[10px] text-emerald-700 font-semibold">
                          {h.completionDate ? (
                            <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {h.completionDate}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-normal">미완료/진행중</span>
                          )}
                        </td>
                        <td className="border-r border-slate-900 p-2 bg-slate-50/80">
                          <div className="font-bold font-mono text-slate-900">{h.postRiskScore}점</div>
                          <div className="text-[9px] text-slate-400">({h.postLikelihood}×{h.postSeverity})</div>
                        </td>
                      </tr>
                    ))
                  )}
                  {unacceptableHazards === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                        개선 대책 수립이 강제되는 허용 불가 요인(9점 이상)이 전혀 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 5: COMPREHENSIVE KRAS FORM            */}
          {/* ========================================= */}
          {activeTab === 'kras' && (
            <div className="space-y-6" id="kras-doc-content">
              <h3 className="text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 border-l-4 border-slate-900">
                5. KRAS 통합형 표준 위험성평가 종합 결과지 (통합 양식)
              </h3>
              <div className="overflow-x-auto w-full" id="kras-scroll-container">
                <table className="w-full text-[10px] text-left border-collapse border border-slate-900 min-w-[850px]" id="kras-master-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-900 text-slate-700 font-bold text-center">
                      <th className="border-r border-slate-900 p-1.5 w-24">공정명</th>
                      <th className="border-r border-slate-900 p-1.5 w-32">위험요인 (상황 및 예상재해)</th>
                      <th className="border-r border-slate-900 p-1.5 w-24">관련 법적 근거</th>
                      <th className="border-r border-slate-900 p-1.5 w-24">현재 안전조치</th>
                      <th className="border-r border-slate-900 p-1.5 w-10">위험도</th>
                      <th className="border-r border-slate-900 p-1.5 w-40">위험 감소대책 수립안</th>
                      <th className="border-r border-slate-900 p-1.5 w-20">개선완료 목표일</th>
                      <th className="border-r border-slate-900 p-1.5 w-12">담당자</th>
                      <th className="p-1.5 w-10">잔류도</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 leading-normal">
                    {assessment.processes.flatMap((p) => 
                      p.hazards.map((h, index) => (
                        <tr key={h.id}>
                          {index === 0 ? (
                            <td rowSpan={p.hazards.length} className="border-r border-slate-900 p-2 font-bold bg-slate-50/50 align-middle text-center w-24">
                              {p.processName}
                            </td>
                          ) : null}
                          <td className="border-r border-slate-900 p-1.5 whitespace-pre-wrap">{h.hazardSituation}</td>
                          <td className="border-r border-slate-900 p-1.5 text-slate-600">{h.legalBasis}</td>
                          <td className="border-r border-slate-900 p-1.5 whitespace-pre-wrap">{h.currentSafetyMeasures}</td>
                          <td className={`border-r border-slate-900 p-1 text-center font-bold ${
                            h.riskLevel === 'High' ? 'bg-red-50 text-red-700' :
                            h.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {h.riskLevel === 'High' ? '상' : h.riskLevel === 'Medium' ? '중' : '하'}
                          </td>
                          <td className="border-r border-slate-900 p-1.5 whitespace-pre-wrap">{h.reductionMeasures || '-'}</td>
                          <td className="border-r border-slate-900 p-1 text-center font-mono text-[9px]">{h.plannedDate || '-'}</td>
                          <td className="border-r border-slate-900 p-1 text-center">{h.responsiblePerson || '-'}</td>
                          <td className={`p-1 text-center font-bold ${
                            h.postRiskLevel === 'High' ? 'bg-red-50 text-red-700' :
                            h.postRiskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {h.postRiskScore ? (h.postRiskLevel === 'High' ? '상' : h.postRiskLevel === 'Medium' ? '중' : '하') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-2" id="worker-signature-section">
                <h3 className="mb-2 text-sm font-bold text-slate-900">작업자 확인 및 서명부</h3>
                <table className="w-full border-collapse border border-slate-900 text-xs text-center" id="worker-signature-table">
                  <thead>
                    <tr className="bg-slate-50 font-bold text-slate-700">
                      <th className="w-16 border-r border-slate-900 p-2">NO</th>
                      <th className="w-[25%] border-r border-slate-900 p-2">이름</th>
                      <th className="w-[20%] border-r border-slate-900 p-2">직책</th>
                      <th className="w-[25%] border-r border-slate-900 p-2">서명</th>
                      <th className="p-2">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 15 }, (_, index) => (
                      <tr key={index} className="h-9 border-t border-slate-900">
                        <td className="border-r border-slate-900 font-mono">{index + 1}</td>
                        <td className="border-r border-slate-900"></td>
                        <td className="border-r border-slate-900"></td>
                        <td className="border-r border-slate-900"></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ============================================================== */}
              {/* 6. PHOTO EVIDENCE SHEET (사진대지 - 표준위험평가표 전용)        */}
              {/* ============================================================== */}
              <div 
                className="pt-8 print:break-before-page border-t-2 border-slate-200 print:border-none mt-8" 
                id="photo-sheet-section"
                style={{ breakBefore: 'page', pageBreakBefore: 'always' }}
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b-2 border-slate-900 pb-2 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Camera size={18} className="text-slate-900" />
                      위험성평가 현장 확인 및 개선 조치 사진대지 (2매 첨부)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 print:hidden">
                      ※ 표준위험평가표의 개선 전·후 실사 사진 2장을 등록합니다. (인쇄 및 PDF 출력 시 별도의 사진대지 페이지로 출력됩니다.)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 print:hidden self-start sm:self-auto">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ★ 표준위험평가표 전용 부속서
                    </span>
                  </div>
                </div>

                {/* Photo Sheet Info Table (Official Korean Standard Header) */}
                <table className="w-full border-collapse border border-slate-900 text-xs mb-5" id="photo-sheet-info-table">
                  <tbody>
                    <tr className="border-b border-slate-900">
                      <th className="bg-slate-100 p-2 border-r border-slate-900 w-24 text-center font-bold">사업장명</th>
                      <td className="p-2 border-r border-slate-900 w-1/3 font-semibold">{assessment.companyProfile.companyName || '사업장 미지정'}</td>
                      <th className="bg-slate-100 p-2 border-r border-slate-900 w-24 text-center font-bold">평가 공종명</th>
                      <td className="p-2 font-semibold">{assessment.title}</td>
                    </tr>
                    <tr>
                      <th className="bg-slate-100 p-2 border-r border-slate-900 text-center font-bold">점검/촬영일</th>
                      <td className="p-2 border-r border-slate-900">
                        <input
                          type="date"
                          value={photoSheet.inspectionDate || assessment.createdAt}
                          onChange={(e) => handleUpdatePhotoSheet({ ...photoSheet, inspectionDate: e.target.value })}
                          className="w-full bg-transparent p-0 text-xs border-0 focus:ring-1 focus:ring-slate-900 rounded print:border-none font-mono"
                        />
                      </td>
                      <th className="bg-slate-100 p-2 border-r border-slate-900 text-center font-bold">점검·확인자</th>
                      <td className="p-2">
                        <input
                          type="text"
                          value={photoSheet.inspector || assessment.companyProfile.siteManager || '안전보건관리자'}
                          onChange={(e) => handleUpdatePhotoSheet({ ...photoSheet, inspector: e.target.value })}
                          placeholder="점검자 성명 입력"
                          className="w-full bg-transparent p-0 text-xs border-0 focus:ring-1 focus:ring-slate-900 rounded print:border-none font-semibold text-slate-800"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 2 Photo Cards Grid (Photo 1: 개선 전, Photo 2: 개선 후) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="photo-cards-grid">
                  
                  {/* ========================================= */}
                  {/* PHOTO 1: 개선 전 (위험요인 발견 / 조치 전) */}
                  {/* ========================================= */}
                  <div className="border border-slate-900 rounded-lg p-3 bg-white space-y-3 flex flex-col justify-between">
                    <div>
                      {/* Photo 1 Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <ShieldAlert size={13} />
                          [사진 1] 개선 전 (위험요인 발견)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">STEP 1</span>
                      </div>

                      {/* Photo 1 Image Display or Upload Area */}
                      <div className="relative">
                        <input 
                          type="file" 
                          id="photo-file-input-1" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload('photo1', e.target.files[0]);
                              e.target.value = '';
                            }
                          }} 
                          className="hidden" 
                        />

                        {photoSheet.photo1?.imageUrl ? (
                          <div className="relative group rounded-lg overflow-hidden border border-slate-900 bg-slate-900/5 aspect-[4/3] flex items-center justify-center">
                            <img 
                              src={photoSheet.photo1.imageUrl} 
                              alt="개선 전 현장 사진" 
                              className="w-full h-full object-contain"
                            />
                            {/* Action overlay on screen (hidden on print) */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 print:hidden">
                              <button
                                type="button"
                                onClick={() => document.getElementById('photo-file-input-1')?.click()}
                                className="bg-white text-slate-800 px-3 py-1.5 rounded-md text-xs font-bold shadow-md hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Upload size={13} /> 사진 교체
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto('photo1')}
                                className="bg-rose-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-md hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={13} /> 삭제
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Screen Interactive Upload Dropzone */}
                            <button
                              type="button"
                              onClick={() => document.getElementById('photo-file-input-1')?.click()}
                              className="w-full aspect-[4/3] border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-lg bg-rose-50/30 hover:bg-rose-50/60 transition flex flex-col items-center justify-center p-4 text-center cursor-pointer group print:hidden"
                            >
                              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                <Camera size={22} />
                              </div>
                              <span className="text-xs font-bold text-rose-900">클릭하여 [개선 전] 현장 사진 첨부</span>
                              <span className="text-[10px] text-slate-400 mt-1">스마트폰 촬영 사진, JPG, PNG 파일 지원</span>
                            </button>

                            {/* Print Fallback Frame (displayed when printing empty) */}
                            <div className="hidden print:flex aspect-[4/3] border-2 border-dashed border-slate-400 rounded items-center justify-center text-slate-400 text-xs font-bold">
                              [ 개선 전 현장 사진 부착 위치 ]
                            </div>
                          </>
                        )}
                      </div>

                      {/* Photo 1 Meta: Location */}
                      <div className="mt-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">작업 위치 / 세부 공종명</label>
                        <input
                          type="text"
                          value={photoSheet.photo1?.location || ''}
                          onChange={(e) => handleFieldChange('photo1', 'location', e.target.value)}
                          placeholder="예: 2층 전기실 케이블 트레이 고소 설치 구역"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-slate-900 print:bg-transparent print:border-b print:border-slate-300 font-medium"
                        />
                      </div>

                      {/* Photo 1 Meta: Hazard Description */}
                      <div className="mt-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">유해위험요인 파악 내용 (조치 전 상황)</label>
                        <textarea
                          rows={3}
                          value={photoSheet.photo1?.description || ''}
                          onChange={(e) => handleFieldChange('photo1', 'description', e.target.value)}
                          placeholder="원인 행위 및 유해위험 발생 상태를 구체적으로 기재 (예: 고소작업대 탑승 시 안전대 미체결 및 안전난간 밖으로 몸을 과도하게 내밀어 추락 위험 발견)"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-slate-900 print:bg-transparent print:border-none leading-relaxed text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ========================================= */}
                  {/* PHOTO 2: 개선 후 (안전조치 완료 / 조치 후) */}
                  {/* ========================================= */}
                  <div className="border border-slate-900 rounded-lg p-3 bg-white space-y-3 flex flex-col justify-between">
                    <div>
                      {/* Photo 2 Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 size={13} />
                          [사진 2] 개선 후 (안전조치 이행 완료)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">STEP 2</span>
                      </div>

                      {/* Photo 2 Image Display or Upload Area */}
                      <div className="relative">
                        <input 
                          type="file" 
                          id="photo-file-input-2" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload('photo2', e.target.files[0]);
                              e.target.value = '';
                            }
                          }} 
                          className="hidden" 
                        />

                        {photoSheet.photo2?.imageUrl ? (
                          <div className="relative group rounded-lg overflow-hidden border border-slate-900 bg-slate-900/5 aspect-[4/3] flex items-center justify-center">
                            <img 
                              src={photoSheet.photo2.imageUrl} 
                              alt="개선 후 현장 사진" 
                              className="w-full h-full object-contain"
                            />
                            {/* Action overlay on screen (hidden on print) */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 print:hidden">
                              <button
                                type="button"
                                onClick={() => document.getElementById('photo-file-input-2')?.click()}
                                className="bg-white text-slate-800 px-3 py-1.5 rounded-md text-xs font-bold shadow-md hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Upload size={13} /> 사진 교체
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto('photo2')}
                                className="bg-rose-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-md hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={13} /> 삭제
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Screen Interactive Upload Dropzone */}
                            <button
                              type="button"
                              onClick={() => document.getElementById('photo-file-input-2')?.click()}
                              className="w-full aspect-[4/3] border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-lg bg-emerald-50/30 hover:bg-emerald-50/60 transition flex flex-col items-center justify-center p-4 text-center cursor-pointer group print:hidden"
                            >
                              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                <Camera size={22} />
                              </div>
                              <span className="text-xs font-bold text-emerald-900">클릭하여 [개선 후] 현장 사진 첨부</span>
                              <span className="text-[10px] text-slate-400 mt-1">위험감소대책 이행 및 안전조치 완료 사진</span>
                            </button>

                            {/* Print Fallback Frame (displayed when printing empty) */}
                            <div className="hidden print:flex aspect-[4/3] border-2 border-dashed border-slate-400 rounded items-center justify-center text-slate-400 text-xs font-bold">
                              [ 개선 후 현장 사진 부착 위치 ]
                            </div>
                          </>
                        )}
                      </div>

                      {/* Photo 2 Meta: Location */}
                      <div className="mt-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">조치 위치 / 세부 공종명</label>
                        <input
                          type="text"
                          value={photoSheet.photo2?.location || ''}
                          onChange={(e) => handleFieldChange('photo2', 'location', e.target.value)}
                          placeholder="예: 2층 전기실 케이블 트레이 고소 설치 구역"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-slate-900 print:bg-transparent print:border-b print:border-slate-300 font-medium"
                        />
                      </div>

                      {/* Photo 2 Meta: Reduction Measure Result */}
                      <div className="mt-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">위험성 감소대책 조치 결과 (조치 후 상태)</label>
                        <textarea
                          rows={3}
                          value={photoSheet.photo2?.description || ''}
                          onChange={(e) => handleFieldChange('photo2', 'description', e.target.value)}
                          placeholder="이행 완료된 안전보건 조치 사항을 구체적으로 기재 (예: 고소작업대 안전대 부착설비에 안전고리 100% 체결 확인, 전담 유도원 하부 배치 및 안전난간 내 작업 준수)"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-slate-900 print:bg-transparent print:border-none leading-relaxed text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Photo Sheet Footer Confirmation & Stamp Box */}
                <div className="mt-5 border border-slate-900 p-3 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 leading-relaxed text-[11px]">
                    <span className="font-bold text-slate-900">확인 증빙:</span> 본 사진대지는 위 위험성평가표에 명시된 유해위험요인의 실제 현장 확인 및 위험성 감소대책 이행 결과를 증명합니다.
                  </div>
                  <div className="flex items-center gap-6 font-semibold shrink-0">
                    <span>점검자: <u className="font-bold text-slate-900">&nbsp;&nbsp;{photoSheet.inspector || '안전관리자'}&nbsp;&nbsp;</u> (서명)</span>
                    <span>현장총괄: <u className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> (인)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Legal Footnote Warning Disclaimer (Required by PRD constraints) */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-[10px] leading-relaxed text-slate-400 font-sans print:text-slate-600" id="legal-disclaimer">
            <span className="font-semibold text-slate-600 block mb-0.5 print:text-black">◆ 법적 고지 및 면책 조항 (AI Disclaimer) :</span>
            본 보고서는 안전관리 자동화 지원 도구를 통해 생성되었으며, 위험도 결정 및 법적 근거는 참고용 템플릿입니다. 
            위험성평가의 정당성 확보 및 실행의 책임은 대한민국 산업안전보건법에 따라 보고서 상단에 최종 날인/서명한 **당해 사업장의 경영책임자 및 대표이사**에게 귀속되며, 
            보고서 내 기재된 안전보건 조치 이행여부는 반드시 사업장 자체 안전점검 및 근로자 회의 등 인간 주체의 추가 정밀 검토를 필한 후 최종 집행되어야 합니다.
          </div>

        </div>
      </div>
    </div>
  );
}
