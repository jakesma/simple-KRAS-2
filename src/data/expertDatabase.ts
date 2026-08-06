/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExpertDatabaseItem, HazardCategory } from '../types';

export const EXPERT_MACHINERY_LIST = [
  '파워 프레스 (Power Press)',
  '아크 용접기 (Arc Welder)',
  '수동 절단기 (Manual Cutter)',
  '선반 / 밀링 머신 (Lathe & Milling)',
  '지게차 (Forklift)',
  '천장 크레인 / 호이스트 (Overhead Crane)',
  '스프레이 도장 건 (Spray Painting Gun)',
  '혼합기 / 교반기 (Industrial Mixer)',
  '컨베이어 벨트 (Conveyor Belt)',
  '가스 연소기 / 열처리로 (Heat Treatment Furnace)'
];

export const EXPERT_PROCESS_TEMPLATES = [
  {
    processName: '금속 부품 프레스 성형 공정',
    detailedWorkContent: '프레스 기계에 금형을 장착하고 철판 원자재를 피딩하여 자동차 및 전자기기 금속 외판을 성형 및 타공하는 작업',
    equipmentUsed: ['파워 프레스 (Power Press)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['방청유', '기계 윤활유'],
    hazards: [
      {
        machineryRelated: '파워 프레스 (Power Press)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '끼임 (Entrapment)',
        hazardSituation: '프레스 금형 작동 영역에 손을 넣은 채 오조작 페달을 밟아 손가락이 금형 사이에 끼여 절단됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제103조 (프레스 등의 방호장치)',
        currentSafetyMeasures: '작업자 안전모 착용, 수동 조작식 페달 사용',
        reductionMeasures: '양손 조작식 안전 스위치(동조제어) 설치, 광전자식 방호장치 장착, 금형 가드 설치',
        suggestedLikelihood: 4,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '파워 프레스 (Power Press)',
        hazardCategory: 'Electrical' as HazardCategory,
        accidentType: '감전 (Electric Shock)',
        hazardSituation: '프레스 모터 외함 접지 손상 상태에서 충전부 절연 파손으로 누전이 발생하여 접촉한 작업자가 감전됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구의 접지)',
        currentSafetyMeasures: '절연장갑 미착용, 누전차단기 미확인',
        reductionMeasures: '프레스 금속제 외함 보호접지 및 전선관 방수 마감 처리, 고감도 전선용 누전차단기(30mA, 0.03초) 인입 배선',
        suggestedLikelihood: 2,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '천장 크레인 / 호이스트 (Overhead Crane)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '맞음 (Struck by)',
        hazardSituation: '무거운 금형을 크레인으로 양중하여 이동하던 중 와이어로프 체결 불량으로 금형이 탈락하여 하부 작업자를 타격함',
        legalBasis: '산업안전보건기준에 관한 규칙 제147조 (와이어로프 등의 사용 한계)',
        currentSafetyMeasures: '줄걸이 작업 육안 검사 실시',
        reductionMeasures: '와이어로프 안전 계수 확인 및 폐기 기준 준수, 인양물 하부 출입 통제 펜스 설치, 무선 리모컨 작업 시 안전 거리 확보',
        suggestedLikelihood: 3,
        suggestedSeverity: 5
      }
    ]
  },
  {
    processName: '부품 아크 용접 공정',
    detailedWorkContent: '강판 부품을 지그에 고정시키고 아크 용접기를 사용해 구조물을 가접 및 본용접하는 조립 작업',
    equipmentUsed: ['아크 용접기 (Arc Welder)', '수동 절단기 (Manual Cutter)'],
    chemicalsUsed: ['용접 가스 (Ar, CO2)', '용접 와이어 / 용접봉'],
    hazards: [
      {
        machineryRelated: '아크 용접기 (Arc Welder)',
        hazardCategory: 'Electrical' as HazardCategory,
        accidentType: '감전 (Electric Shock)',
        hazardSituation: '용접봉 교체 작업 중 자동전격방지기 성능 저하로 무부하 전압에 감전되어 낙상하거나 쇼크가 발생함',
        legalBasis: '산업안전보건기준에 관한 규칙 제306조 (교류아크용접기 등의 자동전격방지기)',
        currentSafetyMeasures: '보호구 수동 지급 및 육안 점검',
        reductionMeasures: '외함 내 고성능 교류아크용접용 자동전격방지기(내장형) 정기 점검 및 수분 침투 방지 조치',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '아크 용접기 (Arc Welder)',
        hazardCategory: 'FireExplosion' as HazardCategory,
        accidentType: '화재·폭발 (Fire/Explosion)',
        hazardSituation: '밀폐용기 인근이나 가연성 자재 적재 구역 근처에서 용접 불꽃이 튀어 인근 유기용제 분진과 만나 화재가 유발됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제241조 (통풍 등이 충분하지 않은 장소에서의 화재예방)',
        currentSafetyMeasures: '간이 소화기 비치',
        reductionMeasures: '작업 반경 10m 이내 가연물 제거, 용접 불티 방지 커버 및 불침투성 포 비치, 화재 감시인 배치',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '아크 용접기 (Arc Welder)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '중독 (Poisoning)',
        hazardSituation: '환기가 불충분한 작업 부스에서 다량의 용접 흄과 가스가 축적되어 보호구를 미착용한 작업자가 흡입하여 직업성 천식에 노출됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제422조 (관리대상 유해물질과 관계있는 설비)',
        currentSafetyMeasures: '일반 황사마스크 착용, 창문 개방',
        reductionMeasures: '이동식 국소배기장치(플렉시블 흄 집진기) 노즐을 용접 위치에 밀착 설치, 송기마스크 또는 용접용 특급 방진마스크 지급',
        suggestedLikelihood: 4,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '수동 부품 절삭 가공 공정',
    detailedWorkContent: '고속 회전하는 선반 및 밀링 머신을 사용해 금속 부품의 표면을 깎아내거나 드릴로 구멍을 뚫는 기계 가공 작업',
    equipmentUsed: ['선반 / 밀링 머신 (Lathe & Milling)', '수동 절단기 (Manual Cutter)'],
    chemicalsUsed: ['절삭유 (Coolant)', '기계 그리스'],
    hazards: [
      {
        machineryRelated: '선반 / 밀링 머신 (Lathe & Milling)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '끼임 (Entrapment)',
        hazardSituation: '작업자가 회전축 인근에서 장갑을 낀 채 부품 치수를 조절하다가 회전 기어 및 척 부분에 장갑이 말려들어가 손가락이 협착됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)',
        currentSafetyMeasures: '안전 장갑 의무 착용(회전체 작업에 면장갑 착용 유도 오류)',
        reductionMeasures: '회전체 가공 작업 시 면장갑 착용 전면 금지(맨손 또는 밀착형 특수 장갑), 회전축 투명 덮개 및 비상정지 스위치 증설',
        suggestedLikelihood: 4,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '수동 절단기 (Manual Cutter)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '벤 (Laceration)',
        hazardSituation: '원형 고속 절단 날의 보호 덮개가 누락되었거나 고정 상태가 부실하여 칼날 교체 중 또는 작동 중 손이 베임',
        legalBasis: '산업안전보건기준에 관한 규칙 제92조 (정비 등의 작업 시 운전정지 등)',
        currentSafetyMeasures: '보호 가드 가끔 탈착됨',
        reductionMeasures: '연동형 기계식 회전 가드(날 접촉 방지 장치) 상시 장착, 전원 차단용 안전 키스위치 연동',
        suggestedLikelihood: 3,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '유기 solvent 혼합 및 스프레이 도장 공정',
    detailedWorkContent: '금속 도금 부품 표면의 이물질을 유기용제로 탈지 세척한 후, 압축공기 스프레이건을 이용하여 에폭시 도료를 도포하고 열처리 건조하는 작업',
    equipmentUsed: ['스프레이 도장 건 (Spray Painting Gun)', '혼합기 / 교반기 (Industrial Mixer)', '가스 연소기 / 열처리로 (Heat Treatment Furnace)'],
    chemicalsUsed: ['희석제 (Thinner)', '에폭시 페인트', '메틸에틸케톤 (MEK)'],
    hazards: [
      {
        machineryRelated: '스프레이 도장 건 (Spray Painting Gun)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '중독 (Poisoning)',
        hazardSituation: '스프레이 도장 작업 시 시너 및 유기 가스가 환기가 안 되는 도장 부스 내 가득 차 작업자가 만성 간독성 및 환각을 일으킴',
        legalBasis: '산업안전보건기준에 관한 규칙 제429조 (국소배기장치의 성능)',
        currentSafetyMeasures: '간이 송풍기 가동',
        reductionMeasures: '도장 부스 내 급배기 풍량 적정값 유지(0.5 m/s 이상 포착풍량 확보), 유기화합물용 방독 마스크(필터 주기적 교체) 지급 및 교육',
        suggestedLikelihood: 4,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '혼합기 / 교반기 (Industrial Mixer)',
        hazardCategory: 'FireExplosion' as HazardCategory,
        accidentType: '화재·폭발 (Fire/Explosion)',
        hazardSituation: '시너와 페인트를 교반기로 기계식 배합하던 중 모터 회전 스파크가 유기용제 가연성 가스 영역에 인화하여 도장실 폭발 사고 유발',
        legalBasis: '산업안전보건기준에 관한 규칙 제311조 (폭발위험장소에서 사용하는 전기 기계·기구의 선정)',
        currentSafetyMeasures: '일반 전기식 교반 모터 사용',
        reductionMeasures: '도장 교반 구역 전체 방폭 구조 전기 기계기구(Ex d IIB T4 등)로 변경, 가스 누출 감지기 설치',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      }
    ]
  },
  {
    processName: '창고 적재 및 지게차 이송 작업',
    detailedWorkContent: '완성된 도장 제품 및 수입 원자재 팔레트를 디젤 지게차를 이용해 제품 하역장에 상차하거나 창고 선반에 적재 및 하역하는 작업',
    equipmentUsed: ['지게차 (Forklift)'],
    chemicalsUsed: ['디젤 연료'],
    hazards: [
      {
        machineryRelated: '지게차 (Forklift)',
        hazardCategory: 'Physical' as HazardCategory,
        accidentType: '부딪힘 (Collision)',
        hazardSituation: '지게차가 적재물을 전방 시야 한계 이상으로 과적한 채 전진 주행하다가, 복도 코너에서 도보로 지나가던 작업자를 인지하지 못하고 충돌하여 깔림',
        legalBasis: '산업안전보건기준에 관한 규칙 제179조 (전도 등의 방지)',
        currentSafetyMeasures: '지게차 경보음 작동',
        reductionMeasures: '전방 시야 차단 시 후진 주행 의무화, 작업 현장 보차도 분리 펜스 설치, 지게차 안전속도(10km/h) 준수 알람 장착, 충돌방지 AI 어라운드뷰 카메라 설치',
        suggestedLikelihood: 3,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '지게차 (Forklift)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '깔림 (Crushed by)',
        hazardSituation: '지게차 포크를 높이 올린 채 물건을 적재하다 경사면에서 무게 중심을 잃고 전도되어, 안전벨트를 매지 않은 운전자가 밖으로 튕겨나가 지게차 헤드가드에 깔려 사망함',
        legalBasis: '산업안전보건기준에 관한 규칙 제183조 (좌석안전띠의 착용)',
        currentSafetyMeasures: '안전벨트 장착은 되어 있으나 착용하지 않음',
        reductionMeasures: '안전벨트 미착용 시 시동 제한 시스템 도입, 지게차 자격 보유자 전용 운행, 급회전 금지 및 노면 평탄화',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      }
    ]
  }
];

export function getSuggestedHazards(processName: string, selectedMachinery: string[]): any[] {
  // Find match in our expert templates
  const template = EXPERT_PROCESS_TEMPLATES.find(
    (t) => t.processName.includes(processName) || processName.includes(t.processName)
  );
  
  if (template) {
    // If we have selected machinery, filter hazards by them, otherwise return all hazards in the template
    if (selectedMachinery && selectedMachinery.length > 0) {
      return template.hazards.filter((h) => selectedMachinery.includes(h.machineryRelated));
    }
    return template.hazards;
  }
  
  // Generic hazards fallback if nothing matches
  return [
    {
      machineryRelated: selectedMachinery[0] || '일반 공정 설비',
      hazardCategory: 'Mechanical' as HazardCategory,
      accidentType: '끼임 (Entrapment)',
      hazardSituation: '가동 중인 설비의 구동 부위에 신체 일부가 접촉하여 옷소매가 말려 들어가 협착 사고 및 신체 상해가 발생할 위험이 상존함',
      legalBasis: '산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)',
      currentSafetyMeasures: '작업자 안전모 및 안전화 착용',
      reductionMeasures: '구동축 방호 덮개 및 비상 연동형 비상정지 로프 장치 추가 설치, 비상 정지 절차 수립 및 근로자 특별 전파 교육',
      suggestedLikelihood: 3,
      suggestedSeverity: 3
    },
    {
      machineryRelated: selectedMachinery[0] || '일반 공정 설비',
      hazardCategory: 'Physical' as HazardCategory,
      accidentType: '넘어짐 (Trip & Fall)',
      hazardSituation: '작업장 바닥에 전선 릴과 도구함, 자재 박스 등 적재 상태 불량으로 인해 근로자가 이동 중 걸려 넘어져 골절 피해 발생',
      legalBasis: '산업안전보건기준에 관한 규칙 제3조 (작업장의 청결)',
      currentSafetyMeasures: '바닥 청소 가끔 실시',
      reductionMeasures: '바닥 통행선 적색 도색 및 돌출 전선 매립(덕트 처리), 작업 직후 잔여 자재 5S(정리/정돈/청소/청결/습관화) 정립',
      suggestedLikelihood: 3,
      suggestedSeverity: 2
    }
  ];
}
