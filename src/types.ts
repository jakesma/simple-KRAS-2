/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WorkflowStatus = 'draft' | 'review' | 'approved' | 'completed';

export interface CompanyProfile {
  companyName: string;
  ceoName: string;
  address: string;
  employeeCount: number;
  businessRegNo: string;
  siteManager: string;
  department: string;
}

export type HazardCategory =
  | 'Mechanical' // 기계적 위험
  | 'Electrical' // 전기적 위험
  | 'Chemical' // 화학적 위험
  | 'FireExplosion' // 화재·폭발 위험
  | 'Ergonomic' // 근골격계/인간공학적 위험
  | 'Physical' // 물리적 위험 (소음, 진동 등)
  | 'WorkEnvironment' // 작업환경 위험 (밀폐공간 등)
  | 'Other'; // 기타 제조업 위험

export interface HazardItem {
  id: string;
  hazardCategory: HazardCategory;
  machineryRelated: string; // 관련 설비/기계
  hazardSituation: string; // 유해위험요인 파악 상황 및 예상 재해 (KRAS 기준)
  accidentType: string; // 재해형태 (끼임, 추락, 질식 등)
  legalBasis: string; // 관련 법적근거
  currentSafetyMeasures: string; // 현재 안전조치 상태
  
  // 위험성 추정 및 결정 (Likelihood 1-5 x Severity 1-5)
  likelihood: number; // 빈도 (1-5)
  severity: number; // 강도 (1-5)
  riskScore: number; // 위험성 계산값
  riskLevel: 'Low' | 'Medium' | 'High'; // 위험성 결정 수준
  isAcceptable: boolean; // 허용 가능한 위험 여부
  
  // 위험성 감소대책 및 실행
  reductionMeasures: string; // 위험감소대책
  plannedDate: string; // 개선계획일
  completionDate: string; // 완료일
  responsiblePerson: string; // 담당자
  
  // 개선 후 잔류위험
  postLikelihood: number;
  postSeverity: number;
  postRiskScore: number;
  postRiskLevel: 'Low' | 'Medium' | 'High';
}

export interface ManufacturingProcess {
  id: string;
  processName: string; // 공정명 (예: 용접, 사출성형 등)
  detailedWorkContent: string; // 상세 작업내용
  supervisor: string; // 관리감독자
  workerNames: string[]; // 작업자 목록
  equipmentUsed: string[]; // 사용 기계·설비
  chemicalsUsed: string[]; // 사용 화학물질·유해물질
  hazards: HazardItem[]; // 도출된 위험 요인 목록
}

export interface RiskAssessment {
  id: string;
  title: string; // 평가명 (예: 2026년 정기 위험성평가)
  assessmentType: 'regular' | 'occasional'; // 정기 / 수시
  createdAt: string;
  updatedAt: string;
  version: number;
  status: WorkflowStatus;
  companyProfile: CompanyProfile;
  processes: ManufacturingProcess[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: string;
  action: string;
  details: string;
}

export interface ExpertDatabaseItem {
  machinery: string;
  processName: string;
  hazardCategory: HazardCategory;
  accidentType: string;
  hazardSituation: string;
  legalBasis: string;
  currentSafetyMeasures: string;
  reductionMeasures: string;
  suggestedLikelihood: number;
  suggestedSeverity: number;
}
