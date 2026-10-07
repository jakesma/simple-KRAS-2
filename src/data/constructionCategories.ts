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
    description: '자료의 전기·통신·방재 설비 공사 분류에 따른 현장 작업',
    subCategories: [
      { id: 'power-equipment', name: '전기·전력 설비 공사', description: '수배전반, 전력케이블, 조명과 전기기구를 설치하는 작업', equipment: ['절연 공구', '활선 경보기', '이동식 사다리'], materials: ['전력케이블', '분전반', '조명기구'] },
      { id: 'substation', name: '수변전 설비 공사', description: '차단기, 변성기, 변압기, 배전반, 발전기 및 UPS를 반입·설치·결선하는 작업', equipment: ['절연 공구', '체인블록', '절연저항계'], materials: ['차단기', '변압기', '배전반'] },
      { id: 'mechanical-room-power', name: '기계실 동력 설비 공사', description: 'MCC, 모터, 펌프, 팬과 밸브의 동력 배선·제어설비를 설치하는 작업', equipment: ['절연 공구', '케이블 포설기', '절연저항계'], materials: ['MCC', '동력케이블', '제어반'] },
      { id: 'power-feeder', name: '전력 간선 설비 공사', description: '분전반, 케이블 트레이, 버스덕트, 케이블 및 레이스웨이를 설치하는 작업', equipment: ['케이블 포설기', '고소작업대', '절연 공구'], materials: ['케이블 트레이', '버스덕트', '전력케이블'] },
      { id: 'conduit-wiring', name: '전기 배관·배선 공사', description: '슬래브·벽체·노출 배관, 박스 및 전선을 설치·입선하는 작업', equipment: ['전기드릴', '케이블 포설기', '절연저항계'], materials: ['전선관', '풀박스', '전선'] },
      { id: 'power-duct-incoming', name: '전력 관로·인입 공사', description: '지중 전력관로, 맨홀·핸드홀 및 건물 인입 케이블을 설치하는 작업', equipment: ['굴착기', '케이블 윈치', '케이블 포설기'], materials: ['지중 전선관', '전력맨홀', '특고압 케이블'] },
      { id: 'electrical-room', name: '전기실·변전실 공사', description: '전기실의 찬넬, 트레이, 접지 및 수배전설비 기반을 설치하는 작업', equipment: ['체인블록', '전기드릴', '절연저항계'], materials: ['찬넬', '케이블 트레이', '접지선'] },
      { id: 'emergency-generator', name: '비상발전기·예비전원 설비 공사', description: '디젤발전기, 자동절체기, 운전반 및 방진·배기설비를 설치·연동하는 작업', equipment: ['이동식 크레인', '체인블록', '절연저항계'], materials: ['디젤발전기', '자동절체기', '전력케이블'] },
      { id: 'lighting', name: '전등 설비 공사', description: '실내·옥외·터널·공장 조명기구와 배선을 설치하는 작업', equipment: ['고소작업대', '절연 공구', '조도계'], materials: ['조명기구', '전선', '전선관'] },
      { id: 'outdoor-road-lighting', name: '옥외·도로·교통신호 조명 공사', description: '단지·도로·터널 조명, 보안등 및 교통신호기 설비를 설치하는 작업', equipment: ['고소작업대', '굴착기', '절연저항계'], materials: ['가로등주', '교통신호기', '지중케이블'] },
      { id: 'aviation-obstruction-light', name: '항공장애표시등 설비 공사', description: '건축물 상부의 항공장애표시등과 제어반·배선을 설치하는 작업', equipment: ['고소작업대', '절연 공구', '테스터기'], materials: ['항공장애등', '제어반', '전선관'] },
      { id: 'electric-heating', name: '전열 설비 공사', description: '전기 냉난방기기와 전열기기의 전원·제어 배선을 설치하는 작업', equipment: ['절연 공구', '절연저항계', '이동식 사다리'], materials: ['전력케이블', '콘센트', '차단기'] },
      { id: 'grounding', name: '접지 설비 공사', description: '전력용·통신용·피뢰설비용 접지극과 접지선을 설치·측정하는 작업', equipment: ['접지저항계', '굴착 공구', '압착 공구'], materials: ['접지선', '접지봉', '접지판'] },
      { id: 'lightning-protection', name: '피뢰 설비 공사', description: '낙뢰 보호용 수뢰부, 인하도선 및 접지설비를 설치하는 작업', equipment: ['고소작업대', '절연 공구', '접지저항계'], materials: ['피뢰침', '인하도선', '접지선'] },
      { id: 'solar-power', name: '태양광 발전 설비 공사', description: '태양광 모듈, 인버터, 구조물과 전력계통 연계 설비를 설치하는 작업', equipment: ['고소작업대', '절연 공구', '토크렌치'], materials: ['태양광 모듈', '인버터', '전력케이블'] },
      { id: 'wind-power', name: '풍력 발전 설비 공사', description: '풍력발전 타워, 발전기, 계통연계반 및 모니터링 설비를 설치하는 작업', equipment: ['이동식 크레인', '고소작업대', '절연 공구'], materials: ['풍력발전기', '타워', '계통연계반'] },
      { id: 'electric-floor-heating', name: '전기온돌·전열보드 공사', description: '발열선, 전열보드, 온도센서 및 자동온도조절기를 설치하는 작업', equipment: ['절연 공구', '절연저항계', '테스터기'], materials: ['발열선', '전열보드', '온도조절기'] },
      { id: 'electric-vehicle-charging', name: '전기자동차 충전 설비 공사', description: '완속·급속 충전기, 분전반, 전원 배선과 운영서버를 설치·시험하는 작업', equipment: ['절연 공구', '절연저항계', '테스터기'], materials: ['충전기', '분전반', '전력케이블'] },
      { id: 'telephone', name: '전화 설비 공사', description: '유선·무선·인터넷 전화용 배선과 단말기를 설치하는 작업', equipment: ['케이블 포설기', '압착 공구', '테스터기'], materials: ['전화케이블', '단자함', '모듈'] },
      { id: 'data-network', name: '정보통신·데이터 통신 공사', description: '데이터 통신망, 인터넷, 허브 및 서버실 배선 설비를 설치하는 작업', equipment: ['케이블 포설기', '랜 테스터기', '압착 공구'], materials: ['LAN 케이블', '광케이블', '허브'] },
      { id: 'tv-system', name: 'TV 설비 공사', description: '공중파·위성·DMB 수신 설비와 동축케이블을 설치하는 작업', equipment: ['케이블 포설기', '신호측정기', '이동식 사다리'], materials: ['동축케이블', '안테나', '분배기'] },
      { id: 'cctv', name: 'CCTV 설비 공사', description: 'CCTV 카메라, 녹화장치 및 감시용 네트워크 배선을 설치하는 작업', equipment: ['고소작업대', '전동드릴', '랜 테스터기'], materials: ['CCTV 카메라', 'LAN 케이블', '녹화장치'] },
      { id: 'home-network', name: '홈네트워크 설비 공사', description: '스마트홈 월패드, 홈네트워크 장비 및 세대 통신배선을 설치하는 작업', equipment: ['절연 공구', '랜 테스터기', '압착 공구'], materials: ['월패드', '통신케이블', '스위치'] },
      { id: 'parking-control', name: '주차관제 설비 공사', description: '주차 게이트, 차량 인식기와 요금정산 시스템을 설치하는 작업', equipment: ['전동드릴', '절연 공구', '케이블 포설기'], materials: ['차단기', '차량인식기', '통신케이블'] },
      { id: 'access-control', name: '출입통제 설비 공사', description: '출입 게이트, 카드·지문 인식기와 제어 배선을 설치하는 작업', equipment: ['전동드릴', '절연 공구', '테스터기'], materials: ['출입통제기', '전기정', '통신케이블'] },
      { id: 'emergency-bell', name: '비상벨 설비 공사', description: '비상벨, 경광등, 사이렌 및 연동 제어설비를 설치하는 작업', equipment: ['절연 공구', '테스터기', '이동식 사다리'], materials: ['비상벨', '경광등', '사이렌'] },
      { id: 'mobile-repeater', name: '이동통신 중계 설비 공사', description: '지하·건물 내 이동통신 중계기, 안테나 및 광케이블을 설치하는 작업', equipment: ['고소작업대', '광케이블 융착기', '케이블 포설기'], materials: ['중계기', '안테나', '광케이블'] },
      { id: 'remote-metering', name: '원격자동검침 설비 공사', description: '전자식 전력량계, 세대전송장치, 중계기 및 원격검침 서버를 설치하는 작업', equipment: ['절연 공구', '랜 테스터기', '테스터기'], materials: ['전력량계', '중계기', '통신케이블'] },
      { id: 'electric-clock', name: '전기시계 설비 공사', description: '모시계, 자시계 및 전원장치를 설치하고 시간 동기화 시험을 하는 작업', equipment: ['절연 공구', '테스터기', '이동식 사다리'], materials: ['모시계', '자시계', '전선'] },
      { id: 'snow-melting', name: '제설 설비 공사', description: '진입로·보행로의 히팅케이블, 감지센서와 제어반을 설치하는 작업', equipment: ['절연 공구', '절연저항계', '테스터기'], materials: ['히팅케이블', '온도센서', '제어반'] },
      { id: 'fire-detection', name: '자동화재탐지 설비 공사', description: '차동식·정온식·연기식 감지기, 수신반과 중계반을 설치하는 작업', equipment: ['절연 공구', '테스터기', '이동식 사다리'], materials: ['감지기', '수신반', '중계반'] },
      { id: 'evacuation-lighting', name: '피난유도등 설비 공사', description: '유도등과 유도표지를 설치하고 비상전원 회로를 결선하는 작업', equipment: ['고소작업대', '절연 공구', '테스터기'], materials: ['유도등', '유도표지', '전선'] },
      { id: 'fire-alarm', name: '화재경보·비상방송 설비 공사', description: '사이렌, 경종, 앰프, 스피커와 비상방송 중계설비를 설치하는 작업', equipment: ['고소작업대', '절연 공구', '음향측정기'], materials: ['사이렌', '경종', '스피커'] },
      { id: 'fire-emergency-power', name: '소방용 비상전원 설비 공사', description: '비상콘센트와 소방용 비상전원 회로를 설치·시험하는 작업', equipment: ['절연 공구', '절연저항계', '테스터기'], materials: ['비상콘센트', '내화케이블', '차단기'] },
      { id: 'fire-radio', name: '무선통신보조 설비 공사', description: '소방활동용 무선통신 보조설비와 누설동축케이블을 설치하는 작업', equipment: ['고소작업대', '케이블 포설기', '신호측정기'], materials: ['누설동축케이블', '안테나', '중계기'] },
      { id: 'communication-signal-disaster', name: '통신·신호·방재 설비 공사', description: '통신, 신호, 방송 및 방재 설비의 배선·기기를 설치하는 작업', equipment: ['절연 공구', '케이블 포설기', '이동식 사다리'], materials: ['통신케이블', '감지기', '수신기'] }
    ]
  }
];

const categoryForHazard = (name: string): HazardCategory => {
  if (/(전기|전력|수변전|동력|간선|전등|전열|접지|피뢰|태양광|풍력|통신|CCTV|TV|방재|화재|피난|비상|소방|전화|출입|주차|배관·배선|관로|인입|변전실|발전기|항공장애|원격검침|전기시계|제설|충전)/.test(name)) return 'Electrical';
  if (name.includes('방수')) return 'Chemical';
  return 'Physical';
};

export const createConstructionProcess = (category: ConstructionSubCategory): ManufacturingProcess => ({
  id: `proc_${Date.now()}`,
  processName: category.name,
  detailedWorkContent: category.description,
  supervisor: '현장 안전관리자',
  workerNames: ['작업자1'],
  equipmentUsed: category.equipment,
  chemicalsUsed: category.materials,
  hazards: [{
    id: `haz_${Date.now()}`,
    hazardCategory: categoryForHazard(category.name),
    machineryRelated: category.equipment[0],
    accidentType: '추락',
    hazardSituation: `${category.name} 작업 중 작업발판 또는 개구부에서 작업자가 추락할 수 있음`,
    legalBasis: '산업안전보건기준에 관한 규칙 (추락 위험 방지 조항)',
    currentSafetyMeasures: '작업 전 안전점검 및 개인보호구 지급',
    likelihood: 3,
    severity: 5,
    riskScore: 15,
    riskLevel: 'High',
    isAcceptable: false,
    reductionMeasures: '작업발판과 난간을 설치하고 안전대를 걸이설비에 체결한 뒤 작업한다.',
    plannedDate: new Date().toISOString().slice(0, 10),
    completionDate: '',
    responsiblePerson: '현장 안전관리자',
    postLikelihood: 1,
    postSeverity: 5,
    postRiskScore: 5,
    postRiskLevel: 'Low'
  }]
});