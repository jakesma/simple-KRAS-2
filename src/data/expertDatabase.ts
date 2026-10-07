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
  '가스 연소기 / 열처리로 (Heat Treatment Furnace)',
  // 전기로 세부 종류
  '진공열처리로 (Vacuum Heat Treatment Furnace)',
  '소둔로 (Annealing Furnace)',
  '템퍼링로 (Tempering Furnace)',
  '극저온처리기 (Cryogenic Treatment Unit)',
  '유도 가열 로 (Induction Furnace)',
  '전기저항로 (Electric Resistance Furnace)',
  // 기타 제조장비
  'CNC 머신 (CNC Machine)',
  '유압 프레스 (Hydraulic Press)',
  '로봇 팔 / 산업용 로봇 (Industrial Robot)',
  '자동 조립 기계 (Automatic Assembly Machine)',
  '샌딩 머신 (Sanding Machine)',
  '포장 기계 (Packaging Machine)',
  '측정 장비 / 좌표측정기 (Coordinate Measuring Machine)',
  '초음파 세척기 (Ultrasonic Cleaner)',
  '전원공급 장치 (Power Supply Unit)',
  '펌프 / 모터 (Pump & Motor)',
  '흄 제거 장치 (Fume Extraction System)',
  '증기 보일러 (Steam Boiler)',
  '압축기 (Air Compressor)',
  '가압식 하이스 전용로 (Pressurized HSS Furnace)',
  '고성능 냉각 칠러 (High-Performance Cooling Chiller)',
  '질소 분위기 템퍼링로 (Nitrogen Atmosphere Tempering Furnace)',
  '대형 서브제로 처리기 (Large Subzero Treatment Unit)',
  'PVD 코팅 장비 (PVD Coating System)',
  'TD 표면처리로 (TD Coating Furnace)',
  '평면 연마기 (Surface Grinder)',
  '금형 교정기 (Die Straightening Press)',
  '리브 경도계 (Leeb Hardness Tester)'
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
  },
  {
    processName: '금속 진공열처리 공정',
    detailedWorkContent: '진공열처리로에 금속 부품을 장입하여 고온 가열(800~1000°C)한 후 불활성 가스 분위기에서 냉각하는 진공 열처리 공정',
    equipmentUsed: ['진공열처리로 (Vacuum Heat Treatment Furnace)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['질소 가스 (N2)', '아르곤 가스 (Ar)', '냉각수'],
    hazards: [
      {
        machineryRelated: '진공열처리로 (Vacuum Heat Treatment Furnace)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '화상 (Burn)',
        hazardSituation: '진공열처리로 온도가 800~1000°C에 달하는 고열 상태에서, 로 문을 개방할 때 방사열 및 대류열에 의해 얼굴과 신체가 화상을 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지)',
        currentSafetyMeasures: '원거리 조작용 로드(Long Rod) 사용',
        reductionMeasures: '로 문 개방 시 안전 거리 2m 확보 및 반사 방열판 설치, 로 온도 시스템 자동 제어 및 알람 기능, 방열 차단막(Thermal Barrier) 부스 구축, 내열성 작업복 및 안면 보호구 지급',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '진공열처리로 (Vacuum Heat Treatment Furnace)',
        hazardCategory: 'Electrical' as HazardCategory,
        accidentType: '감전 (Electric Shock)',
        hazardSituation: '진공열처리로의 고전압 히터(380V, 3상) 배선 절연 손상 상태에서 누전이 발생하여 수동 조작 중 감전사고 발생',
        legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구의 접지)',
        currentSafetyMeasures: '단순 육안 점검 및 보호 접지',
        reductionMeasures: '고전압 배선 정기 절연 저항값 측정(1,000V 이상), 고감도 누전차단기(30mA, 0.03초) 설치, 절연 장갑 및 절연 신발 제공',
        suggestedLikelihood: 2,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '진공열처리로 (Vacuum Heat Treatment Furnace)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '질식 (Asphyxiation)',
        hazardSituation: '진공 배기 시스템 고장으로 로 내 질소 및 아르곤 가스가 실내에 누적되어, 산소 결핍 환경에서 작업자가 질식 위험에 처함',
        legalBasis: '산업안전보건기준에 관한 규칙 제632조 (산소결핍위험장소의 작업)',
        currentSafetyMeasures: '주기적인 환기',
        reductionMeasures: '불활성 가스 누출 감지기(산소 20% 이하 자동 경보) 설치, 연속 배기 흡입 시스템 가동, 밀폐공간 진입 절차 준수 및 송기마스크 지급',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      }
    ]
  },
  {
    processName: '금속 소둔 및 템퍼링 열처리 공정',
    detailedWorkContent: '소둔로에서 강재를 천천히 가열(600~850°C)한 후 서냉하는 열처리와, 템퍼링로에서 담금질된 부품을 중온(200~600°C)으로 가열하는 공정',
    equipmentUsed: ['소둔로 (Annealing Furnace)', '템퍼링로 (Tempering Furnace)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['냉각수', '냉동유', '가스 연료 (LPG/LNG)'],
    hazards: [
      {
        machineryRelated: '소둔로 (Annealing Furnace)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '화상 (Burn)',
        hazardSituation: '소둔로 표면 온도가 100°C 이상의 상태에서, 작업자가 로 몸체에 접촉하거나 로드로 취급된 가열 부품에 직접 접촉하여 광범위한 화상을 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지)',
        currentSafetyMeasures: '장갑 착용 및 거리 유지',
        reductionMeasures: '로 표면 방열 단열재 및 금속 보호 케이싱 설치, 뜨거운 부품 취급용 특수 집게(Tongs) 제공, 화상 응급 처치 구급약품 및 훈련',
        suggestedLikelihood: 3,
        suggestedSeverity: 3
      },
      {
        machineryRelated: '소둔로 (Annealing Furnace)',
        hazardCategory: 'FireExplosion' as HazardCategory,
        accidentType: '화재·폭발 (Fire/Explosion)',
        hazardSituation: '가스 연료(LPG/LNG) 공급 배관 누수로 실내에 가연성 가스가 누적되다가 로의 착화점에서 폭발하여 로실과 주변을 파괴함',
        legalBasis: '산업안전보건기준에 관한 규칙 제241조 (통풍 등이 충분하지 않은 장소에서의 화재예방)',
        currentSafetyMeasures: '가스 누출 감시(육안)',
        reductionMeasures: '가스 배관 정기 누누설 검사(비눗물 시험 주 1회), 가스 누출 감지 자동 센서 및 차단 밸브 설치, 작업실 환기 시스템 상시 가동',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '템퍼링로 (Tempering Furnace)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '중독 (Poisoning)',
        hazardSituation: '템퍼링 공정 중 냉각유에서 발생하는 유증기(Oil Vapor)가 충분한 환기 없이 누적되어 호흡기 자극 및 장기간 노출 시 폐 손상을 유발함',
        legalBasis: '산업안전보건기준에 관한 규칙 제429조 (국소배기장치의 성능)',
        currentSafetyMeasures: '창문 개방 및 일반 마스크',
        reductionMeasures: '냉각유 밀폐 순환식 냉각 시스템 도입, 로 주변 국소배기장치(집진 및 필터 교체 주 1회), 유증기 흡수용 활성탄 필터 설치',
        suggestedLikelihood: 3,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '극저온처리 공정',
    detailedWorkContent: '극저온처리기를 사용하여 강화된 금속 부품을 -196°C(액화질소) 이하로 냉각시켜 잔류 오스테나이트를 제거하고 경도를 향상시키는 공정',
    equipmentUsed: ['극저온처리기 (Cryogenic Treatment Unit)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['액화질소 (Liquid Nitrogen, LN2)'],
    hazards: [
      {
        machineryRelated: '극저온처리기 (Cryogenic Treatment Unit)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '저온화상 (Cryogenic Burn)',
        hazardSituation: '극저온 처리로에서 -196°C의 액화질소에 불의로 신체 일부(손, 팔)가 접촉하여 극심한 저온화상을 입고 조직 괴사 위험이 발생함',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지) - 확대 해석',
        currentSafetyMeasures: '주의 표지판 및 감시인',
        reductionMeasures: '액화질소 저장 및 공급 라인 완전 자동화(원격 제어), 극저온 저항성 장갑(Cryogenic Gloves, -196°C까지 감내) 지급 및 의무 착용, 긴급 응급실 근처 배치 및 저온화상 치료 훈련',
        suggestedLikelihood: 2,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '극저온처리기 (Cryogenic Treatment Unit)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '질식 (Asphyxiation)',
        hazardSituation: '극저온처리 과정에서 액화질소가 기화(Boil-off)하여 실내에 질소 가스가 대량으로 방출되고, 산소 농도가 급격히 저하(20% 미만)되어 산소결핍 질식 위험',
        legalBasis: '산업안전보건기준에 관한 규칙 제632조 (산소결핍위험장소의 작업)',
        currentSafetyMeasures: '정기적 환기 및 산소 농도 측정',
        reductionMeasures: '극저온 처리실 내 산소 농도 자동 감시 시스템(20% 이하 자동 알람 및 배기), 24/7 연속 기계식 환기 시스템 가동, 밀폐공간 진입 시 송기마스크 및 구조원 배치',
        suggestedLikelihood: 3,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '극저온처리기 (Cryogenic Treatment Unit)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '끼임 (Entrapment)',
        hazardSituation: '극저온처리기 내부의 액화질소 공급 및 배출 밸브 근처에서 작업 중 의류나 신체 부위가 밸브 개폐 기구에 걸려 협착 및 압박 상해를 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)',
        currentSafetyMeasures: '주의문 표시 및 조작 표준화',
        reductionMeasures: '모든 밸브 조작을 완전 자동화 또는 원격 제어식으로 변경, 밸브 주변 가드 설치, 작업 중 느슨한 의류 금지 규정',
        suggestedLikelihood: 2,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '유도 가열 열처리 공정',
    detailedWorkContent: '유도 가열 로에 금속 부품을 장입하여 유도 가열 코일의 고주파 전자기장(10~50kHz)으로 부품을 급속 가열(1000°C 이상)한 후 급냉하는 열처리 공정',
    equipmentUsed: ['유도 가열 로 (Induction Furnace)'],
    chemicalsUsed: ['냉각수 (Coolant)', '고주파 전원'],
    hazards: [
      {
        machineryRelated: '유도 가열 로 (Induction Furnace)',
        hazardCategory: 'Electrical' as HazardCategory,
        accidentType: '감전 (Electric Shock)',
        hazardSituation: '유도 가열 로의 고주파 전원 공급 부분(수kW ~ 수십kW)에서 절연 손상으로 누전이 발생하여, 전원 케이블 손상 부위에 접촉한 작업자가 고전류에 감전됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구의 접지)',
        currentSafetyMeasures: '보호 접지 및 일일 점검',
        reductionMeasures: '고주파 전원 정기 절연 저항값 측정(1,000V 메거 이상), 고감도 누전차단기(30mA) 인입 배선, 절연 장갑 및 절연화 지급',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '유도 가열 로 (Induction Furnace)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '화상 (Burn)',
        hazardSituation: '유도 가열 코일에서 방사되는 적외선 및 고온 부품 표면 복사열에 의해, 안면과 상체가 심각한 화상을 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지)',
        currentSafetyMeasures: '보호복 및 안면 보호구 착용',
        reductionMeasures: '고온 부품 주변 방사열 차단판 설치, 내열성 작업복 및 면 안전모 지급, 고온 부품 취급용 특수 집게 및 가열패드 제공',
        suggestedLikelihood: 3,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '하이스 L-H-H 가압 열처리 공정',
    detailedWorkContent: 'SKH51 등 고속도공구강을 가압식 전용로에서 용도별 조건으로 저온 소입한 뒤 고성능 칠러로 급속 냉각하고, 질소 분위기 템퍼링을 반복하여 내마모성과 충격강도를 확보하는 공정',
    equipmentUsed: ['가압식 하이스 전용로 (Pressurized HSS Furnace)', '고성능 냉각 칠러 (High-Performance Cooling Chiller)', '질소 분위기 템퍼링로 (Nitrogen Atmosphere Tempering Furnace)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['질소 가스 (N2)', '아르곤 가스 (Ar)', '냉각 가스', '냉각유'],
    hazards: [
      {
        machineryRelated: '가압식 하이스 전용로 (Pressurized HSS Furnace)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '화상 (Burn)',
        hazardSituation: '고온 소입 사이클이 끝나기 전에 로 문을 열거나 장입물을 인출하는 과정에서 고온 부품과 방사열에 노출되어 화상을 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지)',
        currentSafetyMeasures: '내열장갑 착용 및 작업자 육안 확인',
        reductionMeasures: '온도·압력·냉각 완료 인터록과 도어 잠금장치 설치, 원격 조작 및 방열 차단막 적용, 내열 작업복·안면보호구 지급',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '고성능 냉각 칠러 (High-Performance Cooling Chiller)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '맞음 (Struck by)',
        hazardSituation: '고압 냉각 배관이나 호스의 연결부가 파손되어 냉각 가스 또는 부품이 비산하고 주변 작업자를 타격함',
        legalBasis: '산업안전보건기준에 관한 규칙 제261조 (고압의 공기·가스 등의 취급)',
        currentSafetyMeasures: '호스 연결부 주기적 육안 점검',
        reductionMeasures: '압력계·안전밸브·호스 체결 상태 점검표 운영, 배관 차폐 및 비산 방지 커버 설치, 정비 전 압력 제거와 잠금표지(LOTO) 실시',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '질소 분위기 템퍼링로 (Nitrogen Atmosphere Tempering Furnace)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '질식 (Asphyxiation)',
        hazardSituation: '질소 공급 배관이나 로 도어 실링에서 누출된 질소가 작업장에 축적되어 산소 농도가 낮아지고 작업자가 의식을 잃음',
        legalBasis: '산업안전보건기준에 관한 규칙 제632조 (산소결핍위험장소의 작업)',
        currentSafetyMeasures: '일반 환기 및 작업 전 설비 확인',
        reductionMeasures: '산소농도계와 질소 누출 경보 연동, 연속 기계환기 및 배기 덕트 설치, 가스 차단밸브와 비상대피 절차 운영',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      }
    ]
  },
  {
    processName: '진공열처리 및 서브제로 처리 공정',
    detailedWorkContent: '진공로에서 금형을 가열·소입한 후 대형 서브제로 처리기에서 극저온 냉각하고, 후속 템퍼링과 치수 확인을 수행하는 금형 열처리 공정',
    equipmentUsed: ['진공열처리로 (Vacuum Heat Treatment Furnace)', '대형 서브제로 처리기 (Large Subzero Treatment Unit)', '고성능 냉각 칠러 (High-Performance Cooling Chiller)', '천장 크레인 / 호이스트 (Overhead Crane)'],
    chemicalsUsed: ['액화질소 (Liquid Nitrogen, LN2)', '질소 가스 (N2)', '아르곤 가스 (Ar)'],
    hazards: [
      {
        machineryRelated: '대형 서브제로 처리기 (Large Subzero Treatment Unit)',
        hazardCategory: 'Thermal' as HazardCategory,
        accidentType: '저온화상 (Cryogenic Burn)',
        hazardSituation: '액화질소 주입·배출 또는 처리품 인출 중 극저온 표면과 액화질소가 피부에 접촉하여 저온화상을 입음',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지) 및 저온물 취급 안전기준',
        currentSafetyMeasures: '극저온 장갑과 보안경 착용',
        reductionMeasures: '액화질소 공급 자동화, 처리기 도어·밸브 가드 설치, 극저온용 안면보호구와 장갑 착용 확인, 누출 시 접근금지 절차 운영',
        suggestedLikelihood: 2,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '대형 서브제로 처리기 (Large Subzero Treatment Unit)',
        hazardCategory: 'WorkEnvironment' as HazardCategory,
        accidentType: '질식 (Asphyxiation)',
        hazardSituation: '액화질소 기화로 처리실 산소 농도가 급격히 저하되어 작업자가 산소결핍 환경에 노출됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제632조 (산소결핍위험장소의 작업)',
        currentSafetyMeasures: '작업 전 산소 농도 일회 측정',
        reductionMeasures: '산소농도 연속 감시와 19.5% 경보 설정, 비상 배기·자동 차단 연동, 출입 전 환기 확인 및 2인 1조 구조체계 운영',
        suggestedLikelihood: 3,
        suggestedSeverity: 5
      },
      {
        machineryRelated: '천장 크레인 / 호이스트 (Overhead Crane)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '깔림 (Crushed by)',
        hazardSituation: '대형 금형을 서브제로 처리기에 장입·인출할 때 줄걸이 불량이나 흔들림으로 금형이 떨어져 작업자를 깔리게 함',
        legalBasis: '산업안전보건기준에 관한 규칙 제147조 (와이어로프 등의 사용 한계)',
        currentSafetyMeasures: '인양 전 줄걸이 육안 점검',
        reductionMeasures: '인양 중량·줄걸이 각도 확인, 신호수 지정과 출입통제, 훅 해지장치 및 정격하중 표기, 인양물 하부 진입 금지',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      }
    ]
  },
  {
    processName: 'PVD 및 TD 표면처리 공정',
    detailedWorkContent: '열처리된 금형과 부품을 세척·전처리한 뒤 진공 PVD 코팅 또는 TD 확산 표면처리를 실시하고 냉각·검사를 수행하는 표면처리 공정',
    equipmentUsed: ['PVD 코팅 장비 (PVD Coating System)', 'TD 표면처리로 (TD Coating Furnace)', '초음파 세척기 (Ultrasonic Cleaner)', '흄 제거 장치 (Fume Extraction System)'],
    chemicalsUsed: ['세척제', '알칼리 탈지제', '금속 염류 처리제', '코팅 원료'],
    hazards: [
      {
        machineryRelated: 'PVD 코팅 장비 (PVD Coating System)',
        hazardCategory: 'Electrical' as HazardCategory,
        accidentType: '감전 (Electric Shock)',
        hazardSituation: '진공 챔버의 고전압 전원과 플라즈마 발생부를 정비하면서 잔류 전압을 확인하지 않아 감전됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구의 접지)',
        currentSafetyMeasures: '정비 전 전원 차단 및 육안 확인',
        reductionMeasures: '도어 개방 연동 차단, 잔류전압 방전 확인, 전원 차단·잠금표지와 검전 절차 표준화, 정비 작업자 자격관리',
        suggestedLikelihood: 2,
        suggestedSeverity: 5
      },
      {
        machineryRelated: 'TD 표면처리로 (TD Coating Furnace)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '중독 (Poisoning)',
        hazardSituation: 'TD 처리액 취급과 고온 공정 중 발생한 증기·분진을 국소배기 없이 흡입하여 호흡기와 피부가 유해물질에 노출됨',
        legalBasis: '산업안전보건기준에 관한 규칙 제429조 (국소배기장치의 성능)',
        currentSafetyMeasures: '일반 마스크와 보호장갑 착용',
        reductionMeasures: '처리조 밀폐 및 국소배기 성능 점검, 물질안전보건자료 기반 취급교육, 적합한 방독·방진마스크와 내화학 보호구 지급',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '초음파 세척기 (Ultrasonic Cleaner)',
        hazardCategory: 'Chemical' as HazardCategory,
        accidentType: '화상 (Burn)',
        hazardSituation: '가열된 세척액과 세척 대상물을 꺼내는 과정에서 세척액이 튀어 손과 얼굴에 화상을 입거나 피부염이 발생함',
        legalBasis: '산업안전보건기준에 관한 규칙 제232조 (고온물체에 의한 화상 방지)',
        currentSafetyMeasures: '보호장갑과 보안경 착용',
        reductionMeasures: '세척액 온도 제한과 덮개·비산방지판 설치, 인양용 바스켓 사용, 세척제 농도관리와 세안·세척 설비 비치',
        suggestedLikelihood: 3,
        suggestedSeverity: 3
      }
    ]
  },
  {
    processName: '금형 연마·교정 및 경도검사 공정',
    detailedWorkContent: '열처리된 금형을 샌딩·평면 연마하고 교정기로 치수를 보정한 후 리브 경도계 등 시험계측기로 경도와 품질을 확인하는 후처리 공정',
    equipmentUsed: ['샌딩 머신 (Sanding Machine)', '평면 연마기 (Surface Grinder)', '금형 교정기 (Die Straightening Press)', '리브 경도계 (Leeb Hardness Tester)', '흄 제거 장치 (Fume Extraction System)'],
    chemicalsUsed: ['연마재', '절삭유 (Coolant)', '세척제'],
    hazards: [
      {
        machineryRelated: '평면 연마기 (Surface Grinder)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '맞음 (Struck by)',
        hazardSituation: '연마숫돌의 균열이나 과속 회전으로 숫돌이 파손되어 파편이 작업자에게 비산함',
        legalBasis: '산업안전보건기준에 관한 규칙 제92조 (정비 등의 작업 시 운전정지 등)',
        currentSafetyMeasures: '숫돌 상태 육안 점검 및 보안경 착용',
        reductionMeasures: '숫돌 사용 전 타음검사와 최고사용원주속도 확인, 덮개와 투명 비산방지판 설치, 작업구역 출입통제 및 안면보호구 착용',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
      },
      {
        machineryRelated: '샌딩 머신 (Sanding Machine)',
        hazardCategory: 'Physical' as HazardCategory,
        accidentType: '분진 흡입 (Dust Inhalation)',
        hazardSituation: '금속 연마·샌딩 중 발생한 미세 금속분진을 국소배기 없이 흡입하여 호흡기 질환과 안구 자극이 발생함',
        legalBasis: '산업안전보건기준에 관한 규칙 제422조 (관리대상 유해물질과 관계있는 설비)',
        currentSafetyMeasures: '방진마스크 착용 및 작업 후 청소',
        reductionMeasures: '연마점 국소배기와 집진기 풍량 점검, 압축공기로 분진을 날리는 청소 금지, 적합한 방진마스크·보안경과 정기 작업환경측정 실시',
        suggestedLikelihood: 4,
        suggestedSeverity: 3
      },
      {
        machineryRelated: '금형 교정기 (Die Straightening Press)',
        hazardCategory: 'Mechanical' as HazardCategory,
        accidentType: '끼임 (Entrapment)',
        hazardSituation: '금형을 교정 위치에 맞추는 중 프레스 슬라이드가 오작동하여 손가락이나 손이 금형과 작업대 사이에 끼임',
        legalBasis: '산업안전보건기준에 관한 규칙 제103조 (프레스 등의 방호장치)',
        currentSafetyMeasures: '수동 조작 버튼과 작업자 주의에 의존',
        reductionMeasures: '양손 조작식 제어와 광전자식 방호장치 적용, 금형 고정 지그 사용, 정비·조정 시 전원 차단 및 불시 작동 방지',
        suggestedLikelihood: 3,
        suggestedSeverity: 4
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
