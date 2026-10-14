import { HazardCategory, ManufacturingProcess } from '../types';

export interface ConstructionSubCategory {
  id: string;
  name: string;
  description: string;
  equipment: string[];
  materials: string[];
}

export interface ConstructionCategory {
  id: string;
  name: string;
  description: string;
  subCategories: ConstructionSubCategory[];
}

export const CONSTRUCTION_CATEGORIES: ConstructionCategory[] = [
  {
    id: 'temporary',
    name: '가설 및 토공사',
    description: '가설시설 설치와 굴착, 되메우기 작업',
    subCategories: [
      { id: 'scaffolding', name: '비계 설치·해체', description: '강관비계와 작업발판을 설치하거나 해체하는 작업', equipment: ['강관비계', '작업발판', '안전대'], materials: ['강관', '클램프', '안전망'] },
      { id: 'excavation', name: '굴착 및 흙막이', description: '굴착기와 흙막이 지보공을 사용하는 토공 작업', equipment: ['굴착기', '덤프트럭', '흙막이 지보공'], materials: ['토사', '복공판'] }
    ]
  },
  {
    id: 'structure',
    name: '골조공사',
    description: '철근, 거푸집, 콘크리트 타설 작업',
    subCategories: [
      { id: 'rebar', name: '철근 가공·조립', description: '철근 절단, 가공 및 배근 작업', equipment: ['철근 절단기', '철근 절곡기', '이동식 크레인'], materials: ['철근', '결속선'] },
      { id: 'formwork', name: '거푸집 설치·해체', description: '거푸집과 동바리를 설치 또는 해체하는 작업', equipment: ['거푸집', '동바리', '이동식 작업발판'], materials: ['합판', '각재', '시스템 동바리'] },
      { id: 'concrete', name: '콘크리트 타설', description: '펌프카와 바이브레이터로 콘크리트를 타설하는 작업', equipment: ['콘크리트 펌프카', '진동기', '고소작업대'], materials: ['레미콘', '양생제'] }
    ]
  },
  {
    id: 'finishing',
    name: '마감공사',
    description: '외부·실내 인테리어 마감, 방수, 설비와 전기 작업',
    subCategories: [
      { id: 'exterior', name: '외벽 마감', description: '고소작업대 또는 곤돌라를 이용한 외벽 마감 작업', equipment: ['고소작업대', '곤돌라', '이동식 비계'], materials: ['석재', '외장패널', '실란트'] },
      { id: 'waterproofing', name: '방수 작업', description: '옥상과 지하층의 도막 및 시트 방수 작업', equipment: ['토치', '환기팬', '이동식 사다리'], materials: ['방수시트', '우레탄 방수재', '접착제'] },
      { id: 'painting-finish', name: '도장공사', description: '내·외벽과 천장에 퍼티, 프라이머 및 도료를 도장 또는 분사하는 작업', equipment: ['스프레이건', '이동식 비계', '환기팬'], materials: ['도료', '희석제', '퍼티'] },
      { id: 'tile-finish', name: '타일공사', description: '벽체와 바닥에 타일을 절단·접착하고 줄눈을 시공하는 작업', equipment: ['타일 절단기', '믹서', '이동식 작업발판'], materials: ['타일', '타일 접착제', '줄눈재'] },
      { id: 'wallpaper-finish', name: '도배공사', description: '내벽과 천장에 벽지를 재단하고 접착·마감하는 작업', equipment: ['이동식 사다리', '재단 공구', '풀 도포기'], materials: ['벽지', '도배풀', '실리콘'] },
      { id: 'self-leveling', name: '셀프레벨링 공사', description: '바닥면에 자동수평 모르타르를 혼합·타설하여 바닥 평활도를 확보하는 작업', equipment: ['믹서', '펌프', '스크리드'], materials: ['셀프레벨링 몰탈', '프라이머', '양생제'] },
      { id: 'flooring-finish', name: '바닥재 공사', description: '데코타일, 마루, 카펫 및 시트 바닥재를 재단·접착·마감하는 작업', equipment: ['바닥재 절단기', '열풍기', '롤러'], materials: ['데코타일', '마루', '접착제'] },
      { id: 'ceiling-finish', name: '천장공사', description: '경량철골과 천장재를 조립하고 천장 마감재를 설치하는 작업', equipment: ['이동식 비계', '전동드릴', '고소작업대'], materials: ['경량철골', '석고보드', '천장재'] },
      { id: 'partition-finish', name: '경량벽체·석고보드 공사', description: '경량철골 프레임과 석고보드를 설치해 내부 칸막이를 시공하는 작업', equipment: ['전동드릴', '이동식 사다리', '석고보드 절단기'], materials: ['경량철골', '석고보드', '퍼티'] },
      { id: 'furniture-finish', name: '가구·집기 설치공사', description: '붙박이장, 주방가구 및 실내 집기를 운반·조립·고정하는 작업', equipment: ['전동드릴', '핸드카트', '이동식 사다리'], materials: ['가구', '앵커', '실리콘'] },
      { id: 'electrical', name: '전기·통신 설비', description: '분전반, 케이블 및 전선관을 설치하는 작업', equipment: ['이동식 사다리', '절연 공구', '활선 경보기'], materials: ['전선', '전선관', '분전반'] }
    ]
  },
  {
    id: 'civil-work',
    name: '토목공사',
    description: '자료의 토목 공사 분류에 따른 현장 작업',
    subCategories: [
      { id: 'earthwork', name: '토공사', description: '굴착, 성토, 절토 및 지반 정지 작업', equipment: ['굴착기', '덤프트럭', '다짐기'], materials: ['토사', '골재', '복공판'] },
      { id: 'stonework', name: '석축 공사', description: '석재와 블록을 이용하여 석축을 축조하는 작업', equipment: ['굴착기', '이동식 크레인', '석재 절단기'], materials: ['석재', '모르타르', '철망'] },
      { id: 'retaining-wall', name: '옹벽 공사', description: '토압을 지지하는 옹벽을 설치·보강하는 작업', equipment: ['굴착기', '콘크리트 펌프카', '철근 절단기'], materials: ['철근', '레미콘', '거푸집'] },
      { id: 'drainage', name: '배수 공사', description: '배수로와 집수정, 우수관을 설치하는 작업', equipment: ['굴착기', '관로 절단기', '다짐기'], materials: ['배수관', '집수정', '골재'] },
      { id: 'paving-work', name: '포장 공사', description: '도로와 보행로에 아스팔트 또는 콘크리트를 포장하는 작업', equipment: ['아스팔트 피니셔', '롤러', '덤프트럭'], materials: ['아스팔트', '콘크리트', '골재'] },
      { id: 'landscaping-work', name: '조경 공사', description: '수목, 잔디 및 조경시설물을 설치하는 작업', equipment: ['굴착기', '고소작업대', '체인톱'], materials: ['수목', '잔디', '조경석'] }
    ]
  },
  {
    id: 'building-work',
    name: '건축공사',
    description: '자료의 건축 공사 분류에 따른 구조·마감 작업',
    subCategories: [
      { id: 'steel-frame', name: '철골 공사', description: '철골 부재를 양중·조립·볼트 체결 또는 용접하는 작업', equipment: ['이동식 크레인', '고소작업대', '용접기'], materials: ['철골', '고장력 볼트', '용접봉'] },
      { id: 'masonry', name: '조적 공사', description: '벽돌과 블록을 모르타르로 쌓아 벽체를 만드는 작업', equipment: ['믹서', '이동식 작업발판', '절단기'], materials: ['벽돌', '시멘트 블록', '모르타르'] },
      { id: 'plastering', name: '미장 공사', description: '벽체와 바닥에 모르타르를 바르고 면을 고르는 작업', equipment: ['믹서', '이동식 작업발판', '그라인더'], materials: ['모르타르', '플라스터', '단열재'] },
      { id: 'interior-wood', name: '내장 목공사', description: '실내 천장·벽체·가구용 목재와 합판을 재단·조립하는 작업', equipment: ['원형톱', '전동드릴', '이동식 사다리'], materials: ['목재', '합판', '못'] },
      { id: 'window', name: '창호 공사', description: '창문과 문틀을 양중·설치하고 고정·실링하는 작업', equipment: ['유리 흡착기', '고소작업대', '전동드릴'], materials: ['창호', '앵커', '실란트'] },
      { id: 'glass', name: '유리 공사', description: '유리 패널을 운반·양중·설치하고 마감하는 작업', equipment: ['유리 흡착기', '고소작업대', '핸드카트'], materials: ['유리', '실란트', '가스켓'] },
      { id: 'decorative-finish', name: '수장 공사', description: '실내 벽체·천장·바닥의 장식 마감재를 설치하는 작업', equipment: ['전동드릴', '재단 공구', '이동식 사다리'], materials: ['몰딩', '마감재', '접착제'] },
      { id: 'living-room-floor', name: '거실 바닥 공사', description: '거실 바닥에 마루, 장판 또는 바닥 마감재를 시공하는 작업', equipment: ['바닥재 절단기', '열풍기', '롤러'], materials: ['마루', '장판', '접착제'] }
    ]
  },
  {
    id: 'building-services',
    name: '설비공사',
    description: '자료의 기계·위생 설비 공사 분류에 따른 현장 작업',
    subCategories: [
      { id: 'heating', name: '난방 공사', description: '보일러, 난방배관과 난방기기를 설치·시험하는 작업', equipment: ['배관 공구', '용접기', '압력시험기'], materials: ['난방배관', '보일러', '단열재'] },
      { id: 'ventilation', name: '환기 공사', description: '덕트, 환기팬과 환기설비를 설치하는 작업', equipment: ['고소작업대', '전동드릴', '이동식 크레인'], materials: ['덕트', '환기팬', '행거'] },
      { id: 'air-conditioning', name: '공조·조화 공사', description: '공조기, 냉난방기 및 관련 덕트·배관을 설치하는 작업', equipment: ['이동식 크레인', '용접기', '고소작업대'], materials: ['공조기', '냉매배관', '덕트'] },
      { id: 'water-supply-drainage', name: '급배수 설비 공사', description: '급수관, 배수관, 펌프 및 부속기기를 설치하는 작업', equipment: ['배관 절단기', '용접기', '압력시험기'], materials: ['급배수관', '밸브', '펌프'] },
      { id: 'sanitary', name: '위생 설비 공사', description: '위생기구와 급배수 연결부를 설치·시험하는 작업', equipment: ['배관 공구', '전동드릴', '누설시험기'], materials: ['양변기', '세면기', '밸브'] },
      { id: 'outdoor-water-sanitary', name: '옥외 급수·위생 관련 공사', description: '옥외 급수관과 위생 관련 배관·부대설비를 설치하는 작업', equipment: ['굴착기', '관로 절단기', '다짐기'], materials: ['급수관', '맨홀', '밸브'] },
      { id: 'gas-fire-protection', name: '가스·소화 설비 공사', description: '가스 배관과 소화설비 배관·기기를 설치·시험하는 작업', equipment: ['가스 검지기', '배관 용접기', '압력시험기'], materials: ['가스배관', '소화배관', '밸브'] }
    ]
  },
  {
    id: 'electrical-work',
    name: '전기공사',
    description: '전기공사의 전체 공정 흐름(자재 반입 및 소운반부터 고소·장비작업, 배선, 기기안착, 통전시험 및 활선 유지보수)을 포괄하는 작업 분류',
    subCategories: [
      {
        id: 'electrical-material-handling',
        name: '전기 자재 반입 및 야적·소운반 (통전 전)',
        description: '카고크레인·지게차를 이용한 전선 드럼, 배전반 외함, 케이블 트레이, 전선관 하차, 야적 및 구역별 소운반 (통전 전 무전압)',
        equipment: ['카고크레인', '지게차', '핸드카트(대차)', '섬유벨트/샤클', '케이블 드럼 롤러'],
        materials: ['케이블 드럼', '배전반 외함', '케이블 트레이', '전선관']
      },
      {
        id: 'electrical-conduit-tray',
        name: '배관 및 케이블 트레이·레이스웨이 고소 설치 (통전 전 - 고소작업)',
        description: '천장·벽체 앵커 드릴 천공, 트레이 및 전선관 고소 조립, 찬넬 행거 설치 (통전 전 무전압 고소작업)',
        equipment: ['고소작업대(시저형 렌탈)', '이동식비계(BT비계)', 'A형 사다리(말비계)', '해머드릴(타공기)', '고속절단기'],
        materials: ['케이블 트레이', '전선관', '찬넬', '전산볼트', '앵커']
      },
      {
        id: 'electrical-cable-pulling',
        name: '케이블 풀링 및 배선 입선 공사 (통전 전 - 장비작업)',
        description: '트레이 및 배관 내부로 간선 전력케이블 및 제어선 견인·포설 작업 (전동 윈치 견인, 통전 전 무전압)',
        equipment: ['전동 케이블 윈치(풀러)', '케이블 드럼 롤러', '풀링 로프', '윤활유(풀링젤)'],
        materials: ['전력케이블', '제어케이블', '인입선']
      },
      {
        id: 'electrical-equipment-setting',
        name: '수배전반 및 중량 기기 반입·안착 (통전 전 - 중장비작업)',
        description: '전기실 내 변압기, 수배전반 큐비클, MCC반 양중 및 기초패드 안착, 단말 처리 (통전 전 무전압)',
        equipment: ['체인블록/도비 롤러', '카고크레인', '유압 단자압착기', '충전 임팩드릴'],
        materials: ['수배전반 큐비클', '변압기', 'MCC반', '압착터미널']
      },
      {
        id: 'electrical-lighting-device',
        name: '전등·전열 기구 취급 및 취부공사 (통전 전 - 고소작업)',
        description: '실내 천장 조명기구, 배선기구, 콘센트, 스위치 설치 및 결선 준비 (통전 전 무전압 상태)',
        equipment: ['A형 사다리(말비계)', '충전 임팩드릴', '와이어 스트리퍼'],
        materials: ['LED 조명기구', '콘센트', '스위치', '전등 배선']
      },
      {
        id: 'electrical-energization-test',
        name: '수전 및 절연측정·통전 시험 (★통전 수반 - 감전·아크 위험)',
        description: '특고압(22.9kV) 수전 가압, 변압기 여자 시험, 메인 차단기 투입, 상회전 확인, 절연/접지저항 측정, 시운전 (통전 상태)',
        equipment: ['특고압/저압 검전기', '절연저항계(메거)', '접지저항계', '특고압 절연장구(장갑/화/면)'],
        materials: ['차단기', '접지선', '단락접지기', '위험 표지판']
      },
      {
        id: 'electrical-live-maintenance',
        name: '활선 근접 점검 및 정전·LOTO 유지보수 (★통전 수반)',
        description: '통전 상태 분전반 점검, 정전 작업 시 잠금장치(LOTO) 체결, 검전 및 방전, 불시 가압 방지',
        equipment: ['LOTO(잠금장치·표지)', '활선 경보기', '1000V 공인 절연공구', '저압 절연장갑'],
        materials: ['안전 자물쇠', '조작금지 표지', '절연 시트']
      },
      { id: 'power-equipment', name: '전기·전력 설비 공사 (종합 공정)', description: '자재반입부터 고소 트레이 설치, 케이블 풀링, 배전반 안착, 통전시험까지의 종합 전기공사', equipment: ['고소작업대(시저형 렌탈)', '카고크레인', '전동 케이블 윈치(풀러)', '절연저항계(메거)', '특고압/저압 검전기'], materials: ['전력케이블', '분전반', '조명기구', '케이블 트레이'] },
      { id: 'substation', name: '수변전 설비 공사', description: '차단기, 변성기, 변압기, 배전반, 발전기 및 UPS를 반입·설치·결선 및 수전하는 작업', equipment: ['체인블록/도비 롤러', '특고압/저압 검전기', '절연저항계(메거)'], materials: ['차단기', '변압기', '배전반'] },
      { id: 'mechanical-room-power', name: '기계실 동력 설비 공사', description: 'MCC, 모터, 펌프, 팬과 밸브의 동력 배선·제어설비를 설치하는 작업', equipment: ['전동 케이블 윈치(풀러)', '절연저항계(메거)', '충전 임팩드릴'], materials: ['MCC', '동력케이블', '제어반'] },
      { id: 'power-feeder', name: '전력 간선 설비 공사', description: '분전반, 케이블 트레이, 버스덕트, 케이블 및 레이스웨이를 설치하는 작업', equipment: ['고소작업대(시저형 렌탈)', '전동 케이블 윈치(풀러)', '고속절단기'], materials: ['케이블 트레이', '버스덕트', '전력케이블'] },
      { id: 'conduit-wiring', name: '전기 배관·배선 공사', description: '슬래브·벽체·노출 배관, 박스 및 전선을 설치·입선하는 작업', equipment: ['A형 사다리(말비계)', '해머드릴(타공기)', '전기드릴'], materials: ['전선관', '풀박스', '전선'] },
      { id: 'grounding', name: '접지 설비 공사', description: '전력용·통신용·피뢰설비용 접지극과 접지선을 설치·측정하는 작업', equipment: ['접지저항계', '굴착기', '유압 단자압착기'], materials: ['접지선', '접지봉', '접지동판'] },
      { id: 'lightning-protection', name: '피뢰 설비 공사', description: '낙뢰 보호용 수뢰부, 인하도선 및 접지설비를 설치하는 작업', equipment: ['고소작업차(스카이)', '접지저항계', '토크렌치'], materials: ['피뢰침', '인하도선', '접지선'] },
      { id: 'solar-power', name: '태양광 발전 설비 공사', description: '태양광 모듈, 인버터, 구조물과 전력계통 연계 설비를 설치하는 작업', equipment: ['고소작업대(시저형 렌탈)', '토크렌치', '절연저항계(메거)'], materials: ['태양광 모듈', '인버터', '전력케이블'] },
      { id: 'fire-detection', name: '자동화재탐지 설비 공사', description: '차동식·정온식·연기식 감지기, 수신반과 중계반을 설치하는 작업', equipment: ['A형 사다리(말비계)', '충전 임팩드릴', '특고압/저압 검전기'], materials: ['감지기', '수신반', '중계반'] }
    ]
  }
];

import { getConstructionSuggestedHazards } from './constructionExpertDatabase';

/**
 * Creates the standard 5-stage comprehensive Electrical Work process set (자재반입 ~ 통전시험)
 */
export const createElectricalStandardProcesses = (): ManufacturingProcess[] => {
  const baseTimestamp = Date.now();

  const stages = [
    {
      name: '1단계: [통전 전] 전기 자재 반입 및 야적·현장 소운반',
      workContent: '카고크레인 및 지게차를 사용하여 전선 드럼, 배전반 외함, 케이블 트레이, 전선관 등 고중량 전기 자재를 현장 하차하고 지정 야적장에 고임목 체결 적치 후 구역별 소운반을 실시함. (전기 인입 전 무전압 단계로 감전 위험 없음)',
      equipment: ['카고크레인', '지게차', '핸드카트(대차)', '케이블 드럼 롤러', '섬유벨트/샤클'],
      chemicals: ['방청유', '기계 그리스']
    },
    {
      name: '2단계: [통전 전] 배관 및 케이블 트레이·레이스웨이 고소 설치',
      workContent: '고소작업대(렌탈) 및 이동식비계를 활용하여 천장 4m 높이에 행거 전산볼트 앵커를 타공 설치하고 케이블 트레이 및 배관을 고소 거치·연결함. 고속절단기로 트레이 현장 절단 및 면취를 실시함. (통전 전 무전압 고소작업)',
      equipment: ['고소작업대(시저형 렌탈)', '이동식비계(BT비계)', 'A형 사다리(말비계)', '해머드릴(타공기)', '고속절단기'],
      chemicals: ['절삭유', '터치업 페인트']
    },
    {
      name: '3단계: [통전 전] 케이블 풀링 및 배선 입선 공사',
      workContent: '전동 케이블 윈치(풀러)와 가이드 롤러를 설치하고 트레이 및 배관 경로로 굵은 전력 간선 케이블을 포설 견인함. 풀링젤을 도포하고 인입구에서 케이블 유도를 실시함. (비통전 무전압 상태)',
      equipment: ['전동 케이블 윈치(풀러)', '케이블 드럼 롤러', '풀링 로프'],
      chemicals: ['윤활유(풀링젤)']
    },
    {
      name: '4단계: [통전 전] 수배전반 기기 안착 및 단말 처리',
      workContent: '전기실 콘크리트 패드 위로 도비 롤러 및 체인블록을 이용하여 수배전반 큐비클을 운반 안착하고 앵커로 고정함. 유압 압착기로 케이블 단말 러그를 압착 체결하고 부스바에 연결함. (통전 전 완전 무전압 상태)',
      equipment: ['체인블록/도비 롤러', '유압 단자압착기', '충전 임팩드릴'],
      chemicals: ['절연 바니시', '접촉개선제']
    },
    {
      name: '5단계: [★통전 수반] 수전 및 절연측정·통전 시험 (시운전)',
      workContent: '전기안전관리자 입회하에 1차 특고압(22.9kV) 수전 가압, 변압기 여자 시험을 거쳐 저압 분전반 메인 차단기를 순차 투입함. 상회전 확인, 절연저항계(메거) 측정 및 접지저항 계측, 부하 시운전을 실시함. (통전 상태의 고위험 감전·아크 관리 단계)',
      equipment: ['특고압/저압 검전기', '절연저항계(메거)', '접지저항계', '특고압 절연장구(장갑/화/면)', 'LOTO(잠금장치·표지)'],
      chemicals: ['절연유']
    }
  ];

  return stages.map((stg, sIdx) => {
    const rawHazards = getConstructionSuggestedHazards(stg.name, stg.equipment);
    const hazards = rawHazards.map((item, hIdx) => {
      const score = item.suggestedLikelihood * item.suggestedSeverity;
      const level = score >= 16 ? 'High' : score >= 9 ? 'Medium' : 'Low';
      const isAcceptable = score < 9;
      const postL = Math.max(1, item.suggestedLikelihood - 2);
      const postS = item.suggestedSeverity;
      const postScore = postL * postS;

      return {
        id: `haz_std_${baseTimestamp}_${sIdx}_${hIdx}`,
        hazardCategory: item.hazardCategory,
        machineryRelated: item.machinery,
        accidentType: item.accidentType,
        hazardSituation: item.hazardSituation,
        legalBasis: item.legalBasis,
        currentSafetyMeasures: item.currentSafetyMeasures,
        likelihood: item.suggestedLikelihood,
        severity: item.suggestedSeverity,
        riskScore: score,
        riskLevel: level as 'Low' | 'Medium' | 'High',
        isAcceptable,
        reductionMeasures: item.reductionMeasures,
        plannedDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        completionDate: '',
        responsiblePerson: '현장 전기안전책임자',
        postLikelihood: postL,
        postSeverity: postS,
        postRiskScore: postScore,
        postRiskLevel: (postScore >= 9 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High'
      };
    });

    return {
      id: `proc_std_${baseTimestamp}_${sIdx}`,
      processName: stg.name,
      detailedWorkContent: stg.workContent,
      supervisor: '현장 전기공무 소장',
      workerNames: ['작업조장', '전기공1', '전기공2', '안전유도원'],
      equipmentUsed: stg.equipment,
      chemicalsUsed: stg.chemicals,
      hazards
    };
  });
};

/**
 * Creates multi-step or trade-tailored construction processes for the selected subcategory
 */
export const createConstructionProcesses = (category: ConstructionSubCategory): ManufacturingProcess[] => {
  const catName = category.name.toLowerCase();
  const catId = category.id.toLowerCase();

  // If the user selected general electrical work, produce the full 5-stage standard workflow
  if (catId === 'power-equipment' || catId === 'electrical-work') {
    return createElectricalStandardProcesses();
  }

  // Otherwise, produce a focused process tailored to the specific subcategory with high-quality hazards
  const rawHazards = getConstructionSuggestedHazards(category.name, category.equipment);
  const now = Date.now();

  const hazards = rawHazards.slice(0, 5).map((item, idx) => {
    const score = item.suggestedLikelihood * item.suggestedSeverity;
    const level = score >= 16 ? 'High' : score >= 9 ? 'Medium' : 'Low';
    const isAcceptable = score < 9;
    const postL = Math.max(1, item.suggestedLikelihood - 2);
    const postS = item.suggestedSeverity;
    const postScore = postL * postS;

    return {
      id: `haz_proc_${now}_${idx}`,
      hazardCategory: item.hazardCategory,
      machineryRelated: item.machinery,
      accidentType: item.accidentType,
      hazardSituation: item.hazardSituation,
      legalBasis: item.legalBasis,
      currentSafetyMeasures: item.currentSafetyMeasures,
      likelihood: item.suggestedLikelihood,
      severity: item.suggestedSeverity,
      riskScore: score,
      riskLevel: level as 'Low' | 'Medium' | 'High',
      isAcceptable,
      reductionMeasures: item.reductionMeasures,
      plannedDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      completionDate: '',
      responsiblePerson: '현장 안전관리자',
      postLikelihood: postL,
      postSeverity: postS,
      postRiskScore: postScore,
      postRiskLevel: (postScore >= 9 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High'
    };
  });

  return [
    {
      id: `proc_${now}`,
      processName: category.name,
      detailedWorkContent: category.description,
      supervisor: '현장 공종관리자',
      workerNames: ['작업조장', '작업원1', '안전감시원'],
      equipmentUsed: category.equipment,
      chemicalsUsed: category.materials,
      hazards
    }
  ];
};

/**
 * Backward-compatible single-process creator
 */
export const createConstructionProcess = (category: ConstructionSubCategory): ManufacturingProcess => {
  const procs = createConstructionProcesses(category);
  return procs[0];
};