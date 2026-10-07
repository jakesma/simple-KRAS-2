import { ExpertDatabaseItem } from '../types';

export const CONSTRUCTION_EQUIPMENT_LIST = [
  '강관비계', '굴착기', '덤프트럭', '철근 절단기', '철근 절곡기',
  '이동식 크레인', '콘크리트 펌프카', '고소작업대', '곤돌라', '이동식 사다리'
];

const CONSTRUCTION_HAZARDS: ExpertDatabaseItem[] = [
  {
    machinery: '강관비계', processName: '비계 설치·해체', hazardCategory: 'Physical', accidentType: '추락',
    hazardSituation: '비계 작업발판의 틈 또는 난간 미설치 구간에서 작업자가 추락할 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (비계의 조립 등)', currentSafetyMeasures: '안전모와 안전대 지급',
    reductionMeasures: '작업발판 빈틈을 방지하고 상부 난간, 중간 난간 및 발끝막이판을 설치한다.', suggestedLikelihood: 3, suggestedSeverity: 5
  },
  {
    machinery: '굴착기', processName: '굴착 및 흙막이', hazardCategory: 'Physical', accidentType: '매몰',
    hazardSituation: '굴착면 붕괴 또는 흙막이 지보공 변형으로 작업자가 토사에 매몰될 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (굴착면의 기울기 및 흙막이 지보공)', currentSafetyMeasures: '작업 전 육안점검',
    reductionMeasures: '굴착면 기울기를 확보하고 흙막이 지보공을 설치하며, 작업 전후 변형 여부를 점검한다.', suggestedLikelihood: 3, suggestedSeverity: 5
  },
  {
    machinery: '철근 절단기', processName: '철근 가공·조립', hazardCategory: 'Mechanical', accidentType: '끼임',
    hazardSituation: '철근 절단기와 절곡기 가동부에 손 또는 의복이 끼일 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (기계의 방호)', currentSafetyMeasures: '작업자 교육 실시',
    reductionMeasures: '회전 및 절단부 방호덮개를 유지하고 정비 시 전원을 차단한다.', suggestedLikelihood: 3, suggestedSeverity: 4
  },
  {
    machinery: '콘크리트 펌프카', processName: '콘크리트 타설', hazardCategory: 'Physical', accidentType: '맞음',
    hazardSituation: '펌프카 붐 또는 타설 호스가 흔들리거나 파손되어 작업자를 타격할 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (차량계 건설기계)', currentSafetyMeasures: '신호수 배치',
    reductionMeasures: '붐 작업반경을 출입 통제하고 호스 체결 상태를 확인하며 신호수 지시에 따라 작업한다.', suggestedLikelihood: 3, suggestedSeverity: 4
  },
  {
    machinery: '고소작업대', processName: '외벽 마감', hazardCategory: 'Physical', accidentType: '추락',
    hazardSituation: '고소작업대 난간 밖으로 몸을 내밀거나 안전대 미체결 상태에서 작업자가 추락할 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (고소작업대)', currentSafetyMeasures: '안전대 지급',
    reductionMeasures: '작업대 난간을 유지하고 안전대 걸이설비에 안전대를 체결하며 정격하중을 준수한다.', suggestedLikelihood: 3, suggestedSeverity: 5
  },
  {
    machinery: '이동식 사다리', processName: '전기·통신 설비', hazardCategory: 'Electrical', accidentType: '감전',
    hazardSituation: '활선 인근에서 절연조치 없이 전선 연결 작업 중 충전부에 접촉하여 감전될 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 (전기작업)', currentSafetyMeasures: '절연장갑 지급',
    reductionMeasures: '정전 후 작업을 원칙으로 하고 불가피한 경우 절연 보호구와 활선 경보기를 사용한다.', suggestedLikelihood: 2, suggestedSeverity: 5
  }
];

export const getConstructionSuggestedHazards = (processName: string, equipment: string[]) => {
  const matches = CONSTRUCTION_HAZARDS.filter((item) =>
    item.processName === processName || equipment.includes(item.machinery)
  );
  return matches.length > 0 ? matches : CONSTRUCTION_HAZARDS.filter((item) => item.accidentType === '추락');
};