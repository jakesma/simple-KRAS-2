import { ExpertDatabaseItem } from '../types';

export const CONSTRUCTION_EQUIPMENT_LIST = [
  '카고크레인', '지게차', '핸드카트(대차)', '섬유벨트/샤클',
  '고소작업대(시저형 렌탈)', '고소작업차(스카이)', '이동식비계(BT비계)', 'A형 사다리(말비계)',
  '전동 케이블 윈치(풀러)', '케이블 드럼 롤러', '유압 단자압착기', '고속절단기', '핸드 그라인더',
  '해머드릴(타공기)', '충전 임팩드릴', '체인블록/도비 롤러',
  '절연저항계(메거)', '접지저항계', '특고압/저압 검전기', '특고압 절연장구(장갑/화/면)',
  'LOTO(잠금장치·표지)', '활선 경보기', '강관비계', '굴착기', '덤프트럭', '철근 절단기', '콘크리트 펌프카'
];

export const CONSTRUCTION_HAZARDS: ExpertDatabaseItem[] = [
  // =========================================================================
  // 1. [통전 전] 자재 반입 및 야적·현장 소운반 (장비작업/중량물 취급)
  // ※ 통전 전 단계이므로 감전 위험은 전혀 없으며, 양중·낙하·협착·전도·요통 중심
  // =========================================================================
  {
    machinery: '카고크레인',
    processName: '전기 자재 반입 및 야적·소운반 (통전 전)',
    hazardCategory: 'Mechanical',
    accidentType: '낙하·깔림',
    hazardSituation: '카고크레인으로 고중량 전선 드럼 및 배전반 하역 중 슬링벨트 체결 불량 또는 샤클 핀 이탈로 인양물이 낙하하여 하부 신호수 및 작업자를 덮쳐 중대재해 발생 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제163조 (구속 등 위험방지) 및 제38조 (사전조사 및 작업계획서 작성)',
    currentSafetyMeasures: '작업자 안전모 착용 및 슬링벨트 육안 확인 상태',
    reductionMeasures: '양중 전 섬유벨트 마모·손상 점검 및 2줄 걸이 원칙 준수, 크레인 작업반경 하부 출입통제선(구획) 설치, 유자격 전담 신호수 배치 및 무전 신호체계 확립',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: '지게차',
    processName: '전기 자재 반입 및 야적·소운반 (통전 전)',
    hazardCategory: 'Mechanical',
    accidentType: '부딪힘(충돌)',
    hazardSituation: '지게차로 전선관 번들 및 케이블 트레이 자재 운반 중 과적에 따른 전방 시야 미확보 상태에서 회전하다 현장 통행 근로자와 충돌할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제179조 (전조등 및 후미등) 및 제181조 (작업계획서의 작성)',
    currentSafetyMeasures: '지게차 경광등 작동 상태 유지',
    reductionMeasures: '화물 적재 높이를 운전자 시야 확보 수준으로 제한, 후진 경보음 및 후방 감지센서 상시 가동, 현장 보행자 전용 통로 확보 및 유도자 배치',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '케이블 드럼 롤러',
    processName: '전기 자재 반입 및 야적·소운반 (통전 전)',
    hazardCategory: 'Physical',
    accidentType: '끼임(협착)',
    hazardSituation: '원형 케이블 드럼을 야적장 경사지 또는 요철 바닥에 임시 적치하던 중 고임목 미설치로 드럼이 불시에 굴러내려 인근 작업자 하체가 드럼과 벽체 사이에 협착될 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제393조 (원동기·회전축 등의 위험 방지)',
    currentSafetyMeasures: '드럼 인근 작업자 주의 환기',
    reductionMeasures: '드럼 적치 즉시 양방향 전용 쐐기형 고임목 체결 의무화, 평탄하고 단단한 지정 야적구역에만 적치, 드럼 이송 시 2인 1조 이동 수칙 준수',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '핸드카트(대차)',
    processName: '전기 자재 반입 및 야적·소운반 (통전 전)',
    hazardCategory: 'Ergonomic',
    accidentType: '근골격계질환·낙하',
    hazardSituation: '무거운 분전함 외함 및 금속 전선관 묶음을 계단 및 협소 통로로 무리하게 인력 소운반하다 허리 급성 염좌 발생 및 자재를 놓쳐 발등을 타격할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제663조 (중량물의 제한) 및 제665조 (중량물의 운반조건)',
    currentSafetyMeasures: '일반 장갑 착용 후 수동 운반',
    reductionMeasures: '25kg 이상 중량물은 반드시 핸드카트 등 운반기구 사용 또는 2인 이상 공동 운반, 안전화 및 발등 보호구 착용, 운반 동선 장애물 사전 정리',
    suggestedLikelihood: 4,
    suggestedSeverity: 3
  },

  // =========================================================================
  // 2. [통전 전] 배관 및 케이블 트레이·레이스웨이 고소 설치 (고소작업/장비작업)
  // ※ 통전 전 단계: 고소작업대·비계 추락, 빔 협착, 절단 베임, 공구 낙하 비래
  // =========================================================================
  {
    machinery: '고소작업대(시저형 렌탈)',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Mechanical',
    accidentType: '끼임(상부 협착)',
    hazardSituation: '고소작업대(렌탈)를 상승시켜 천장 트레이 행거 설치 중 상부 철골 H빔 또는 환기 덕트 간섭 구간에서 상승 레버 오조작으로 작업자 상체·두부가 구조물 사이에 끼일 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제186조 (고소작업대 등의 사용)',
    currentSafetyMeasures: '작업자 안전모 착용 상태',
    reductionMeasures: '고소작업대 과상승 방지봉(터치바 안전장치) 정상 작동 철저 점검, 천장 근접 시 미세 저속 조작 수칙 준수, 전담 유도자 하부 배치',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: '고소작업대(시저형 렌탈)',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Physical',
    accidentType: '떨어짐(추락)',
    hazardSituation: '고소작업대 난간을 딛고 올라서거나 상부 난간 밖으로 몸을 과도하게 내밀어 트레이 볼트를 체결하다 무게중심을 잃고 5m 아래 콘크리트 바닥으로 추락할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제42조 (추락의 방지) 및 제44조 (안전대의 부착설비 등)',
    currentSafetyMeasures: '안전대 착용 중이나 안전고리 미체결',
    reductionMeasures: '작업대 난간 디딤 절대 금지, 턱끈 조인 안전모 및 안전대 착용 후 작업대 내 안전고리 전용 걸이부에 100% 체결, 정격하중 초과 탑승 금지',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: '이동식비계(BT비계)',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Physical',
    accidentType: '넘어짐(전도)·추락',
    hazardSituation: '이동식비계 상부에서 해머드릴로 천장 앵커 타공 중 아웃트리거 미설치 및 바퀴 스토퍼 미고정 상태에서 천공 반력에 의해 비계가 전도되어 작업자가 추락할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제68조 (이동식비계)',
    currentSafetyMeasures: '비계 바퀴만 고정하고 아웃트리거 미설치',
    reductionMeasures: '비계 4개소 아웃트리거 전개 고정 및 바퀴 스토퍼 체결 확인, 비계 탑승 상태에서 비계 이동 절대 금지, 최상부 4면 안전난간대 완비',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: 'A형 사다리(말비계)',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Physical',
    accidentType: '떨어짐(추락)',
    hazardSituation: '천장 높이 2.5m 배관 작업 시 A형 사다리 최상단 디딤판에 올라서서 두 손으로 전선관을 결속하다 중심을 잃고 실족 추락할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제24조 (사다리식 통로 등의 구조) 및 이동식 사다리 안전작업 지침',
    currentSafetyMeasures: '사다리 단독 작업 실시',
    reductionMeasures: 'A형 사다리 최상단 및 차상단 디딤판 작업 금지, 2인 1조 작업(1인 작업, 1인 하부 사다리 지지 및 감시), 작업발판형 사다리 또는 말비계 우선 사용',
    suggestedLikelihood: 4,
    suggestedSeverity: 4
  },
  {
    machinery: '고속절단기',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Mechanical',
    accidentType: '날아와 맞음(비래)·베임',
    hazardSituation: '케이블 트레이 현장 절단 시 고속절단기 안전덮개 미부착 상태에서 절단석이 파손되어 파편이 작업자 안면을 타격하거나 트레이의 날카로운 버(Burr)에 손가락 열상 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제120조 (연삭숫돌의 덮개 등)',
    currentSafetyMeasures: '일반 면장갑 착용 후 절단',
    reductionMeasures: '절단기 전용 안전덮개 부착 확인, 절단석 규격 적정성 및 균열 점검, 보안경(안면보호구) 및 절단 방지 안전장갑(Level 5) 착용, 절단 단면 디버링 처리',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '체인블록/도비 롤러',
    processName: '배관 및 케이블 트레이·레이스웨이 설치 (통전 전 - 고소작업)',
    hazardCategory: 'Physical',
    accidentType: '물체에 맞음(낙하)',
    hazardSituation: '천장 트레이 조립 작업 중 상부 작업자가 라쳇렌치 및 볼트·너트를 떨어뜨려 하부 통행 근로자의 머리를 타격할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제14조 (낙하물에 의한 위험의 방지)',
    currentSafetyMeasures: '하부 안전모 착용 안내',
    reductionMeasures: '모든 수공구에 낙하방지 끈(랜야드) 체결 의무화, 작업발판 발끝막이판(높이 10cm 이상) 설치, 고소작업 하부 출입금지 구획선 및 감시원 배치',
    suggestedLikelihood: 4,
    suggestedSeverity: 4
  },

  // =========================================================================
  // 3. [통전 전] 케이블 풀링 및 배선 입선 공사 (윈치/장비작업)
  // ※ 통전 전 단계: 전동 윈치 손끼임, 풀링 로프 파단 타격, 근골격계 요통
  // =========================================================================
  {
    machinery: '전동 케이블 윈치(풀러)',
    processName: '케이블 풀링 및 배선 입선 공사 (통전 전 - 장비작업)',
    hazardCategory: 'Mechanical',
    accidentType: '끼임(협착)',
    hazardSituation: '전동 케이블 윈치(풀러)로 대구경 간선 케이블을 배관 내부로 고속 견인 중, 인입구 풀박스에서 케이블 유도 작업자의 장갑 또는 손가락이 롤러와 배관 사이에 말려들어갈 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)',
    currentSafetyMeasures: '작업자 손으로 케이블 밀어넣기',
    reductionMeasures: '인입구 전용 케이블 가이드 롤러 설치, 윈치 조작자와 인입구 작업자 간 무전 신호체계 및 비상정지 스위치(E-Stop) 확보, 롤러 전방 30cm 이내 손 접근 엄금',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '전동 케이블 윈치(풀러)',
    processName: '케이블 풀링 및 배선 입선 공사 (통전 전 - 장비작업)',
    hazardCategory: 'Mechanical',
    accidentType: '맞음(로프 파단)',
    hazardSituation: '장거리 굴곡 배관 포설 시 과도한 견인 장력으로 인해 윈치 풀링 로프(와이어)가 순간 파단되면서 강력하게 튕겨나가 인근 작업자를 타격할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제163조 (구속 등 위험방지)',
    currentSafetyMeasures: '일반 나일론 로프로 견인',
    reductionMeasures: '케이블 규격에 맞는 정격 인장강도의 전용 풀링 로프 사용, 인장하중계(장력계) 부착으로 과부하 차단, 로프 견인 직선 경로 상 작업자 위치 금지',
    suggestedLikelihood: 2,
    suggestedSeverity: 5
  },
  {
    machinery: '케이블 드럼 롤러',
    processName: '케이블 풀링 및 배선 입선 공사 (통전 전 - 장비작업)',
    hazardCategory: 'Ergonomic',
    accidentType: '근골격계질환',
    hazardSituation: 'EPS/TPS 피트 내 협소 공간에서 굵고 뻣뻣한 전력케이블을 웅크린 부자연스러운 자세로 장시간 무리하게 잡아당기다 요추 추간판 탈출증 등 근골격계 손상 발생 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제657조 (유해요인조사) 및 제662조 (작업환경개선)',
    currentSafetyMeasures: '수동 인력 견인 작업',
    reductionMeasures: '케이블 드럼 롤러에 윤활제(풀링젤) 충분 도포로 마찰 저항 감소, 2인 1조 교대 작업 및 50분 작업 후 10분 스트레칭 휴식 의무화, 전동 보조 풀러 적극 활용',
    suggestedLikelihood: 4,
    suggestedSeverity: 3
  },

  // =========================================================================
  // 4. [통전 전] 수배전반 및 중량 기기 반입·안착 (중장비/공구작업)
  // ※ 통전 전 단계: 큐비클 전도 압사, 유압 압착기 손가락 협착, 칼날 베임
  // =========================================================================
  {
    machinery: '체인블록/도비 롤러',
    processName: '수배전반 및 중량 기기 반입·안착 (통전 전 - 중장비작업)',
    hazardCategory: 'Mechanical',
    accidentType: '넘어짐(전도)·깔림',
    hazardSituation: '고중량 변압기 및 고압 수배전반 큐비클을 전기실 콘크리트 패드 위로 도비 롤러로 이동하던 중 바닥 단차 요철에 걸려 반체가 기울어지면서 작업자를 덮쳐 압사할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제38조 (사전조사 및 작업계획서 작성) 및 제172조 (접촉의 방지)',
    currentSafetyMeasures: '작업자 2인이 밀어서 이동',
    reductionMeasures: '중량물 취급 작업계획서 작성 및 이행, 이동 경로 철판 보강으로 단차 평탄화, 전도 방지 지지대(턴버클) 체결 후 전용 도비 롤러 사용, 4인 이상 전담 신호수 지휘',
    suggestedLikelihood: 2,
    suggestedSeverity: 5
  },
  {
    machinery: '유압 단자압착기',
    processName: '수배전반 및 중량 기기 반입·안착 (통전 전 - 중장비작업)',
    hazardCategory: 'Mechanical',
    accidentType: '끼임(협착)',
    hazardSituation: '충전식 전동 유압 압착기로 대형 케이블 러그 단자 압착 작업 중, 스위치 오조작 또는 압착 다이스 부위에 손가락이 위치하여 협착 절단될 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제88조 (기계의 동력차단장치)',
    currentSafetyMeasures: '작업자 수동 스위치 조작',
    reductionMeasures: '압착 다이스 내 단자 안착 후 양손 조작 수칙 준수, 전동 압착기 방아쇠 안전 락(Lock) 체결 확인, 밀착형 안전장갑 착용 및 집중 작업 환경 조성',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '충전 임팩드릴',
    processName: '수배전반 및 중량 기기 반입·안착 (통전 전 - 중장비작업)',
    hazardCategory: 'Physical',
    accidentType: '베임(자상)',
    hazardSituation: '굵은 간선 케이블 외피 스트리퍼 및 다목적 칼로 절연체 탈피 작업 중 칼날 진행 방향 전방에 손을 두어 칼날이 미끄러지면서 손가락과 손목 인대를 깊게 베일 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제32조 (보호구의 지급 등)',
    currentSafetyMeasures: '일반 면장갑 착용 상태',
    reductionMeasures: '전용 회전식 피복 탈피 공구(케이블 스트리퍼) 사용 원칙, 칼날 사용 시 반드시 신체 바깥 방향으로 절단, 내절창 방검장갑(Cut Level 5) 필수 착용',
    suggestedLikelihood: 4,
    suggestedSeverity: 3
  },

  // =========================================================================
  // 5. [통전 전] 전등·전열 기구 취급 및 취부공사 (고소작업)
  // ※ 통전 전 단계: 말비계 실족 추락, 천장 개구부 추락 (감전 위험 없음)
  // =========================================================================
  {
    machinery: 'A형 사다리(말비계)',
    processName: '전등·전열 기구 취급 및 취부공사 (통전 전 - 고소작업)',
    hazardCategory: 'Physical',
    accidentType: '떨어짐(추락)',
    hazardSituation: '사무실 천장 매립형 LED 평판등 기구 취부 작업 중, 말비계(우마) 위에서 옆으로 과도하게 손을 뻗다 작업발판 단부를 헛디뎌 바닥으로 실족 추락할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제42조 (추락의 방지)',
    currentSafetyMeasures: '간이 말비계 1인 작업',
    reductionMeasures: '말비계 발판 폭 40cm 이상 확보 및 발판 이탈 방지 클립 체결, 작업 반경 변경 시 발판에서 내려와 말비계 이동 후 작업, 턱끈 체결 안전모 착용',
    suggestedLikelihood: 4,
    suggestedSeverity: 3
  },

  // =========================================================================
  // 6. [★통전 수반] 수전 및 절연측정·통전 시험 (시운전/가압 - 특고압·저압)
  // ※ 통전 수반 단계: 특고압 섬락 감전, 아크 플래시 화상, 누전 감전, 잔류전하 감전
  // =========================================================================
  {
    machinery: '특고압/저압 검전기',
    processName: '수전 및 절연측정·통전 시험 (★통전 수반 - 감전·아크 위험)',
    hazardCategory: 'Electrical',
    accidentType: '감전(섬락 방전)',
    hazardSituation: '특고압(22.9kV) 수변전설비 최초 수전 가압 중, 전기가 차단된 상태로 오인하고 특고압 부스바 근접 거리 내에 신체 또는 도체 공구가 접근하여 공기절연 파괴에 따른 특고압 섬락(Flashover) 감전으로 사망할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제321조 (충전전로에서의 전기작업) 및 제323조 (절연용 보호구 등의 착용)',
    currentSafetyMeasures: '육안으로 차단기 상태 확인',
    reductionMeasures: '특고압 접근한계거리(22.9kV 기준 90cm) 절대 준수, 작업 전 특고압 검전기로 3회 이상 무전압 테스트, 특고압 절연장갑·절연화·아크방호면 100% 착용, 유자격 전기안전관리자 현장 지휘',
    suggestedLikelihood: 2,
    suggestedSeverity: 5
  },
  {
    machinery: '절연저항계(메거)',
    processName: '수전 및 절연측정·통전 시험 (★통전 수반 - 감전·아크 위험)',
    hazardCategory: 'FireExplosion',
    accidentType: '화재·폭발(아크 플래시)',
    hazardSituation: '저압 분전반 1차 메인 차단기 최초 투입 시 분전함 내부 공구(볼트, 절단선 부스러기) 잔여물 또는 배선 오결선으로 상간 단락(쇼트)이 발생하여 아크 플래시(Arc Flash) 고열 폭발로 안면·전신 3도 화상 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구 등의 위험 방지) 및 제309조 (임시 배선 등의 위험 방지)',
    currentSafetyMeasures: '육안 점검 후 차단기 투입',
    reductionMeasures: '차단기 투입 전 분전함 내부 진공 흡입 클리닝 및 육안 전수 검사, 전 회로 메거(절연저항계)로 대지간·선간 절연저항 측정(기준치 0.2MΩ 이상 확보), 차단기 투입 시 측면에서 몸을 비껴 조작하며 아크방호면 착용',
    suggestedLikelihood: 2,
    suggestedSeverity: 5
  },
  {
    machinery: '접지저항계',
    processName: '수전 및 절연측정·통전 시험 (★통전 수반 - 감전·아크 위험)',
    hazardCategory: 'Electrical',
    accidentType: '감전(누전 접촉)',
    hazardSituation: '분전반 외함 접지선 체결 누락 또는 접지 단자 풀림 상태에서 전원 가압 시 내부 전선 절연 불량에 따른 누설전류로 금속 외함 전체가 충전되어 분전함 도어를 여는 작업자가 접촉 감전될 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제302조 (전기 기계·기구의 접지)',
    currentSafetyMeasures: '분전함 외함 설치 완료 상태',
    reductionMeasures: '전원 투입 전 접지저항계로 접지 저항치 기준값 충족 여부 측정 및 외함 접지선 본딩 상태 토크렌치 체결 검사, 고감도 누전차단기(정격감도전류 30mA, 동작시간 0.03초 이내) 정상 작동 시험',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '특고압 절연장구(장갑/화/면)',
    processName: '수전 및 절연측정·통전 시험 (★통전 수반 - 감전·아크 위험)',
    hazardCategory: 'Electrical',
    accidentType: '감전(잔류 전하)',
    hazardSituation: '특고압 케이블 내전압 시험 및 직류 고전압 절연저항 측정 직후 잔류 정전용량(전하)을 충분히 방전시키지 않은 상태에서 케이블 심선에 손을 대어 축적된 전하 방전으로 충격 감전될 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제320조 (정전전로에서의 전기작업)',
    currentSafetyMeasures: '시험 완료 후 즉시 단자 분리',
    reductionMeasures: '시험 종료 즉시 전용 접지봉(방전 저항기)을 이용하여 케이블 전하를 대지로 완전 방전 조치 후 검전기로 무전압 재확인, 방전 확인 전까지 절연장갑 착용 유지',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },

  // =========================================================================
  // 7. [★통전 수반] 활선 근접 점검 및 정전·LOTO 유지보수 (오투입 방지)
  // ※ 통전 수반 단계: 불시 가압 감전, 금속 공구 단락, 활선 근접 접촉
  // =========================================================================
  {
    machinery: 'LOTO(잠금장치·표지)',
    processName: '활선 근접 점검 및 정전·LOTO 유지보수 (★통전 수반)',
    hazardCategory: 'Electrical',
    accidentType: '감전(불시 가압)',
    hazardSituation: '차단기를 내리고 정전 상태에서 배선 결선 보수 작업 중, 상황을 모르는 타 작업자 또는 협력업체 직원이 차단기를 임의로 올려 불시 통전됨으로써 전로를 잡고 있던 작업자가 심실세동 감전 사망할 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제319조 (정전전로에서의 전기작업 절차 등)',
    currentSafetyMeasures: '차단기에 종이 안내문 부착',
    reductionMeasures: 'LOTO(Lockout/Tagout) 5대 원칙 의무화: 차단기 차단 -> 전용 잠금자물쇠 체결 -> "조작금지" 표지 부착 -> 검전기로 무전압 확인 -> 단락접지기 체결 후 작업 착수, 열쇠는 작업 책임자 단독 보관',
    suggestedLikelihood: 2,
    suggestedSeverity: 5
  },
  {
    machinery: '활선 경보기',
    processName: '활선 근접 점검 및 정전·LOTO 유지보수 (★통전 수반)',
    hazardCategory: 'Electrical',
    accidentType: '감전·아크(공구 단락)',
    hazardSituation: '통전 중인 상시 분전반 내부에서 차단기 교체 및 회로 점검 중, 비절연 금속 드라이버 끝이 인접 충전 부스바와 접지 외함에 동시 접촉되어 대전류 단락 아크 폭발 및 작업자 감전 위험',
    legalBasis: '산업안전보건기준에 관한 규칙 제321조 (충전전로에서의 전기작업) 및 제323조 (절연용 방호구 등의 사용)',
    currentSafetyMeasures: '일반 공구 손잡이에 절연테이프 감기',
    reductionMeasures: '정전 작업이 원칙이며 부득이한 활선 근접 작업 시 IEC 60900 공인 1,000V 절연공구 사용, 인접 충전부에 절연시트(방호덮개) 장착, 작업자 손목 활선 경보기 착용 및 저압 절연장갑 착용',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },

  // =========================================================================
  // 8. 기타 일반 건설 공종 (토공, 골조, 비계)
  // =========================================================================
  {
    machinery: '강관비계',
    processName: '비계 설치·해체',
    hazardCategory: 'Physical',
    accidentType: '떨어짐(추락)',
    hazardSituation: '비계 작업발판의 틈 또는 난간 미설치 구간에서 작업자가 추락할 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 제54조 (비계의 점검 및 보수)',
    currentSafetyMeasures: '안전모와 안전대 지급',
    reductionMeasures: '작업발판 빈틈을 3cm 이하로 방지하고 상부 난간, 중간 난간 및 발끝막이판을 설치한다.',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: '굴착기',
    processName: '굴착 및 흙막이',
    hazardCategory: 'Physical',
    accidentType: '무너짐(매몰)',
    hazardSituation: '굴착면 붕괴 또는 흙막이 지보공 변형으로 작업자가 토사에 매몰될 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 제338조 (토석붕괴 위험 방지)',
    currentSafetyMeasures: '작업 전 육안점검',
    reductionMeasures: '굴착면 안전 기울기를 확보하고 흙막이 지보공을 설치하며 작업 전후 변형 여부를 계측 점검한다.',
    suggestedLikelihood: 3,
    suggestedSeverity: 5
  },
  {
    machinery: '철근 절단기',
    processName: '철근 가공·조립',
    hazardCategory: 'Mechanical',
    accidentType: '끼임',
    hazardSituation: '철근 절단기와 절곡기 가동부에 손 또는 의복이 끼일 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)',
    currentSafetyMeasures: '작업자 교육 실시',
    reductionMeasures: '회전 및 절단부 방호덮개를 유지하고 정비 시 전원을 차단한다.',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  },
  {
    machinery: '콘크리트 펌프카',
    processName: '콘크리트 타설',
    hazardCategory: 'Physical',
    accidentType: '맞음',
    hazardSituation: '펌프카 붐 또는 타설 호스가 흔들리거나 파손되어 작업자를 타격할 수 있음',
    legalBasis: '산업안전보건기준에 관한 규칙 제332조 (콘크리트 펌프 등의 사용)',
    currentSafetyMeasures: '신호수 배치',
    reductionMeasures: '붐 작업반경을 출입 통제하고 호스 체결 상태를 확인하며 신호수 지시에 따라 작업한다.',
    suggestedLikelihood: 3,
    suggestedSeverity: 4
  }
];

export const getConstructionSuggestedHazards = (processName: string, equipment: string[] = []) => {
  const pName = (processName || '').toLowerCase();
  const eqList = (equipment || []).map(e => e.toLowerCase());

  // Check if process explicitly involves energization (통전 수반)
  const isEnergizedStage = /(통전|수전|가압|시운전|시험|활선|검전|loto|정전|차단기 투입|외함 접지)/.test(pName);

  // Check if process is explicitly pre-energization material handling (자재 반입)
  const isMaterialStage = /(자재|반입|하차|야적|소운반|하역|운반)/.test(pName);

  // Check if process is high-altitude installation (고소작업/트레이/배관)
  const isHighAltitudeStage = /(고소|트레이|배관|레이스웨이|닥트|비계|사다리|렌탈|앵커|천공)/.test(pName);

  // Check if process is cable pulling (풀링/배선)
  const isPullingStage = /(풀링|배선|입선|포설|윈치|풀러|간선)/.test(pName);

  // Check if process is equipment positioning (안착/큐비클/도비)
  const isEquipmentStage = /(안착|큐비클|변압기|도비|패드|단말)/.test(pName);

  // Check if process is lighting/device installation (전등/전열/기구)
  const isLightingStage = /(전등|전열|기구|조명|콘센트|스위치|취부)/.test(pName);

  let filtered: ExpertDatabaseItem[] = [];

  if (isEnergizedStage) {
    // Return ONLY or primarily energized hazards (감전, 아크, 화재폭발)
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.hazardCategory === 'Electrical' || h.hazardCategory === 'FireExplosion' || h.processName.includes('통전')
    );
  } else if (isMaterialStage) {
    // Strictly NO electrical shock! Return material handling & heavy equipment hazards
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.processName.includes('자재 반입') ||
      ['카고크레인', '지게차', '핸드카트(대차)', '케이블 드럼 롤러'].includes(h.machinery)
    ).filter(h => h.hazardCategory !== 'Electrical');
  } else if (isHighAltitudeStage) {
    // Strictly NO electrical shock! Return high altitude / cutting / falling hazards
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.processName.includes('고소작업') ||
      ['고소작업대(시저형 렌탈)', '이동식비계(BT비계)', 'A형 사다리(말비계)', '고속절단기'].includes(h.machinery)
    ).filter(h => h.hazardCategory !== 'Electrical');
  } else if (isPullingStage) {
    // Strictly NO electrical shock! Cable pulling winch & ergonomic hazards
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.processName.includes('케이블 풀링') ||
      h.machinery.includes('윈치') || h.machinery.includes('롤러')
    ).filter(h => h.hazardCategory !== 'Electrical');
  } else if (isEquipmentStage) {
    // Equipment positioning: strictly NO electrical shock!
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.processName.includes('중량 기기 반입') ||
      ['체인블록/도비 롤러', '유압 단자압착기', '충전 임팩드릴'].includes(h.machinery)
    ).filter(h => h.hazardCategory !== 'Electrical');
  } else if (isLightingStage) {
    // Lighting/device installation: strictly NO electrical shock!
    filtered = CONSTRUCTION_HAZARDS.filter(h =>
      h.processName.includes('전등·전열 기구') ||
      h.machinery.includes('말비계')
    ).filter(h => h.hazardCategory !== 'Electrical');
  } else {
    // General match by equipment or process name
    const matches = CONSTRUCTION_HAZARDS.filter(item =>
      item.processName.toLowerCase().includes(pName) ||
      eqList.some(eq => item.machinery.toLowerCase().includes(eq))
    );

    // If pre-energization generally, filter out Electrical category unless explicitly energized
    if (!isEnergizedStage) {
      filtered = matches.filter(h => h.hazardCategory !== 'Electrical');
    } else {
      filtered = matches;
    }
  }

  // If still empty, provide general construction hazards
  if (filtered.length === 0) {
    filtered = CONSTRUCTION_HAZARDS.filter(item => item.accidentType.includes('추락') || item.accidentType.includes('깔림'));
  }

  return filtered;
};