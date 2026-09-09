/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getRiskLevelFromScore } from '../utils/risk';

export interface CategoryHazard {
  hazardType: string;
  description: string;
  riskFactors: string[];
  controlMeasures: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  equipment: string[];
  chemicals: string[];
  hazards: CategoryHazard[];
}

export interface MainCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
}

export const MANUFACTURING_CATEGORIES: MainCategory[] = [
  {
    id: 'plating_coating',
    name: '도금 / 피막',
    icon: '🔧',
    description: '금속 표면에 다른 금속이나 화합물을 입혀서 보호하거나 기능을 부여하는 공정',
    subCategories: [
      {
        id: 'zinc_plating',
        name: '아연도금',
        description: '철강 제품에 아연을 도금하여 부식을 방지',
        equipment: [
          '도금 장치 (Electroplating Tank)',
          '정류기 (Rectifier)',
          '냉각 시스템',
          '화학약품 저장탱크',
          '펌프',
          '호이스트'
        ],
        chemicals: [
          '황산아연 (Zinc Sulfate)',
          '염산 (Hydrochloric Acid)',
          '수산화나트륨 (Sodium Hydroxide)',
          '방청유 (Rust Preventive Oil)',
          '기계유'
        ],
        hazards: [
          {
            hazardType: '화학적 위험',
            description: '산과 알칼리 용액 노출',
            riskFactors: ['산 화상', '알칼리 화상', '피부 자극'],
            controlMeasures: [
              '안전 장갑 및 앞치마 착용',
              '보안경 착용',
              '통풍 시스템 운영',
              '응급 세척 시설 설치'
            ]
          },
          {
            hazardType: '기계적 위험',
            description: '호이스트 및 운반 장비 사용 중 낙하',
            riskFactors: ['낙하', '끼임', '압축'],
            controlMeasures: [
              '호이스트 정기 점검',
              '낙하 방지 장치 설치',
              '안전 확보 후 작업',
              '근처 인원 제한'
            ]
          },
          {
            hazardType: '전기적 위험',
            description: '정류기 및 고전압 장비 감전',
            riskFactors: ['감전', '전기 화상'],
            controlMeasures: [
              '접지 확인',
              '절연 처리',
              '보호 캡 설치',
              '정기 안전 점검'
            ]
          },
          {
            hazardType: '열적 위험',
            description: '가열된 도금 용액 접촉',
            riskFactors: ['화상', '증기 흡입'],
            controlMeasures: [
              '온도 표시 라벨',
              '보호 복 착용',
              '안전 거리 유지',
              '통풍 확보'
            ]
          }
        ]
      },
      {
        id: 'chrome_plating',
        name: '크롬도금',
        description: '크롬을 도금하여 내식성과 광택성 부여',
        equipment: [
          '크롬도금 장치',
          '정류기',
          '냉각 시스템',
          '화학약품 저장탱크',
          '호이스트'
        ],
        chemicals: [
          '삼산화크롬 (Chromium Trioxide)',
          '황산 (Sulfuric Acid)',
          '염산',
          '메탄올 (Methanol)',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '화학적 위험',
            description: '크롬 화합물 노출 (발암성 물질)',
            riskFactors: ['피부 암', '폐암', '피부 궤양'],
            controlMeasures: [
              '밀폐 시스템 구축',
              '통풍 시스템 강화',
              '보호 장비 착용 (장갑, 앞치마, 마스크)',
              '정기 건강 진단',
              '크롬 농도 모니터링'
            ]
          },
          {
            hazardType: '산 화상',
            description: '황산 및 염산 직접 접촉',
            riskFactors: ['심각한 화상', '안구 손상'],
            controlMeasures: [
              '산 방호복 착용',
              '보안경 착용',
              '응급 샤워 및 세척 시설',
              '산 취급 교육'
            ]
          },
          {
            hazardType: '증기 흡입',
            description: '크롬산 증기 흡입',
            riskFactors: ['호흡기 질환', '폐 손상'],
            controlMeasures: [
              '면적식 환기시스템',
              '호흡보호구 착용 (공기청정식 마스크)',
              '정기 공기질 측정'
            ]
          }
        ]
      },
      {
        id: 'nickel_plating',
        name: '니켈도금',
        description: '니켈을 도금하여 내식성과 경도성 향상',
        equipment: [
          '니켈도금 장치',
          '정류기',
          '냉각 시스템',
          '약품 저장탱크',
          '호이스트'
        ],
        chemicals: [
          '황산니켈 (Nickel Sulfate)',
          '염화니켈 (Nickel Chloride)',
          '황산',
          '염산',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '니켈 독성',
            description: '니켈 염 노출',
            riskFactors: ['접촉 피부염', '니켈 알레르기', '호흡기 질환'],
            controlMeasures: [
              '보호 장갑 착용',
              '통풍 시스템 운영',
              '산 취급 주의',
              '정기 건강 검진'
            ]
          },
          {
            hazardType: '화학 화상',
            description: '산 용액 접촉',
            riskFactors: ['심각한 화상'],
            controlMeasures: [
              '산 방호복',
              '보안경',
              '응급 세척 시설'
            ]
          }
        ]
      },
      {
        id: 'tin_plating',
        name: '주석도금',
        description: '주석을 도금하여 솔더링 성능 향상',
        equipment: [
          '주석도금 장치',
          '정류기',
          '냉각 시스템',
          '약품 저장탱크'
        ],
        chemicals: [
          '황산주석 (Tin Sulfate)',
          '염산',
          '황산',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '화학 화상',
            description: '산 용액 직접 접촉',
            riskFactors: ['피부 화상'],
            controlMeasures: [
              '보호 장갑 및 앞치마',
              '응급 세척 시설',
              '통풍'
            ]
          }
        ]
      },
      {
        id: 'black_oxide',
        name: '흑색산화',
        description: '금속 표면을 검게 산화시켜 부식 방지',
        equipment: [
          '산화 욕조',
          '가열 시스템',
          '냉각 시스템',
          '호이스트'
        ],
        chemicals: [
          '염화철 (Ferric Chloride)',
          '염산',
          '수산화칼슘 (Calcium Hydroxide)',
          '기계유'
        ],
        hazards: [
          {
            hazardType: '열 위험',
            description: '고온 산화 욕조',
            riskFactors: ['화상'],
            controlMeasures: [
              '온도 표시',
              '안전 거리 유지',
              '보호복 착용'
            ]
          },
          {
            hazardType: '화학 노출',
            description: '산 및 염화철 노출',
            riskFactors: ['화학 화상', '호흡기 자극'],
            controlMeasures: [
              '통풍 시스템',
              '보호 장갑 및 앞치마',
              '보안경'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'grinding_blasting',
    name: '연마 / 블라스트',
    icon: '🔨',
    description: '표면을 갈아내거나 입자를 분사하여 정소, 광택, 코팅 제거 등의 표면처리',
    subCategories: [
      {
        id: 'barrel_polishing',
        name: '바렐연마',
        description: '회전하는 드럼에서 부품과 연마재를 섞어 표면 정소 및 광택',
        equipment: [
          '바렐 연마기 (Barrel Polisher)',
          '모터 (Motor)',
          '벨트 구동계',
          '타이머',
          '호이스트'
        ],
        chemicals: [
          '연마재 (Abrasive Media)',
          '냉각수',
          '세제',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '회전체 끼임',
            description: '바렐 회전 중 손, 옷 등이 끼임',
            riskFactors: ['손가락 절단', '팔 골절', '사망'],
            controlMeasures: [
              '회전 정지 후 검사',
              '인터락 안전장치 설치',
              '느슨한 의류 금지',
              '보호 가드 설치'
            ]
          },
          {
            hazardType: '소음',
            description: '연마 소음 노출',
            riskFactors: ['청력 손실', '이명'],
            controlMeasures: [
              '소음 차단 귀마개',
              '정기 청력검사',
              '소음 지역 표시'
            ]
          },
          {
            hazardType: '먼지',
            description: '연마재 먼지 흡입',
            riskFactors: ['진폐증', '호흡기 질환'],
            controlMeasures: [
              '집진 시스템 설치',
              '호흡 보호구 착용',
              '작업장 통풍'
            ]
          }
        ]
      },
      {
        id: 'vibration_finishing',
        name: '진동연마',
        description: '진동을 이용하여 부품과 연마재를 마찰시켜 표면 정소',
        equipment: [
          '진동연마기',
          '모터',
          '타이머',
          '온도계'
        ],
        chemicals: [
          '연마재',
          '냉각수',
          '세제'
        ],
        hazards: [
          {
            hazardType: '진동 노출',
            description: '고주파 진동 장시간 노출',
            riskFactors: ['진동병', '관절염', '신경 손상'],
            controlMeasures: [
              '진동 감소 장비 사용',
              '작업 시간 제한',
              '정기 건강검진'
            ]
          },
          {
            hazardType: '소음',
            description: '진동음 노출',
            riskFactors: ['청력 손실'],
            controlMeasures: [
              '귀마개 착용',
              '청력검사'
            ]
          }
        ]
      },
      {
        id: 'electropolishing',
        name: '전해연마',
        description: '전류를 이용하여 금속 표면을 화학적으로 연마',
        equipment: [
          '전해연마 장치',
          '정류기',
          '냉각 시스템',
          '화학약품 저장탱크'
        ],
        chemicals: [
          '인산 (Phosphoric Acid)',
          '황산',
          '에탄올',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '전기 위험',
            description: '고전압 정류기 감전',
            riskFactors: ['감전', '심장 부정맥'],
            controlMeasures: [
              '절연 처리',
              '접지 확인',
              '정기 검사'
            ]
          },
          {
            hazardType: '산 노출',
            description: '인산, 황산 직접 접촉',
            riskFactors: ['화학 화상'],
            controlMeasures: [
              '보호복 착용',
              '응급 세척 시설',
              '통풍'
            ]
          }
        ]
      },
      {
        id: 'sandblasting',
        name: '샌드블라스트',
        description: '모래 또는 연마재를 고압으로 분사하여 표면 정소',
        equipment: [
          '샌드블라스트 기계',
          '컴프레셔 (Air Compressor)',
          '먼지 수집기',
          '보안경 및 헬멧'
        ],
        chemicals: [
          '블라스트 연마재 (모래, 코런덤 등)',
          '윤활유'
        ],
        hazards: [
          {
            hazardType: '규폐증',
            description: '실리카 먼지 흡입 (모래 사용)',
            riskFactors: ['규폐증 (Silicosis)', '폐암', '폐기능 저하'],
            controlMeasures: [
              '규폐증 안전 기준 준수 (OSHA)',
              '습식 블라스트 또는 대체 재료 사용',
              '호흡 보호구 착용 (HEPA)',
              '정기 폐 X-선 검사',
              '작업장 환기'
            ]
          },
          {
            hazardType: '소음',
            description: '블라스트 소음',
            riskFactors: ['청력 손실'],
            controlMeasures: [
              '귀마개 착용',
              '청력검사'
            ]
          },
          {
            hazardType: '안구 손상',
            description: '연마재 입자 직접 접촉',
            riskFactors: ['각막 손상', '시력 상실'],
            controlMeasures: [
              '보안경 착용',
              '페이스 시뮬드 착용'
            ]
          }
        ]
      },
      {
        id: 'polishing',
        name: '폴리싱',
        description: '연마 휠을 사용하여 부품 표면을 광택 처리',
        equipment: [
          '폴리싱 머신',
          '연마 휠',
          '호닝 스톤',
          '모터'
        ],
        chemicals: [
          '연마재',
          '연마유',
          '광택 왁스'
        ],
        hazards: [
          {
            hazardType: '회전체 끼임',
            description: '회전 연마 휠에 손, 옷 끼임',
            riskFactors: ['손가락 절단', '손상된 손'],
            controlMeasures: [
              '회전 정지 후 작업',
              '보호 가드 설치',
              '느슨한 의류 금지',
              '인터락 장치'
            ]
          },
          {
            hazardType: '먼지 노출',
            description: '연마재 및 재료 먼지',
            riskFactors: ['진폐증', '호흡기 질환'],
            controlMeasures: [
              '국소배기 시스템',
              '호흡 보호구'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'heat_treatment',
    name: '열처리',
    icon: '🔥',
    description: '금속에 열을 가하여 강도, 경도 등 물성을 변화시키는 공정',
    subCategories: [
      {
        id: 'induction_hardening',
        name: '고주파열처리',
        description: '고주파 유도 가열로 부품 표면을 빠르게 가열하여 경화',
        equipment: [
          '고주파 가열 장치',
          '냉각 시스템',
          '온도계',
          '냉각 분무 시스템'
        ],
        chemicals: [
          '냉각수 (Quenching Oil)',
          '방청유',
          '세제'
        ],
        hazards: [
          {
            hazardType: '화상',
            description: '고온 부품 및 열 방사',
            riskFactors: ['심각한 화상', '흉터'],
            controlMeasures: [
              '보호복 착용',
              '안전 거리 유지',
              '온도 표시',
              '응급 처치 시설'
            ]
          },
          {
            hazardType: '냉각유 화재',
            description: '냉각유 연소',
            riskFactors: ['화재', '폭발'],
            controlMeasures: [
              '냉각유 온도 관리',
              '금지화 방지',
              '소화기 비치',
              '환기'
            ]
          },
          {
            hazardType: '전자기장',
            description: '고주파 유도 장에 노출',
            riskFactors: ['신경 자극', '심박 영향'],
            controlMeasures: [
              '차폐 시설 설치',
              '작업 시간 제한',
              '거리 유지'
            ]
          }
        ]
      },
      {
        id: 'vacuum_hardening',
        name: '진공열처리',
        description: '산소를 제거한 진공 환경에서 부품을 가열 처리',
        equipment: [
          '진공 열처리로',
          '진공 펌프',
          '냉각 시스템',
          '온도계',
          '진공 게이지'
        ],
        chemicals: [
          '냉각 가스 (질소)',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '화상',
            description: '고온 로 표면 및 부품',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복',
              '안전 거리',
              '온도 표시'
            ]
          },
          {
            hazardType: '진공 위험',
            description: '진공 시스템 폭발 또는 누출',
            riskFactors: ['폭발', '기밀 손상'],
            controlMeasures: [
              '정기 점검',
              '안전 밸브 설치',
              '누출 감지기'
            ]
          }
        ]
      },
      {
        id: 'carburizing',
        name: '침탄열처리',
        description: '탄소를 부품에 침투시켜 표면 경도 증가',
        equipment: [
          '침탄로',
          '온도계',
          '가스 공급 시스템',
          '냉각 시스템'
        ],
        chemicals: [
          '메탄가스 (Methane)',
          '일산화탄소 (CO) - 독성',
          '냉각유',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '일산화탄소 중독',
            description: '로에서 발생하는 CO 가스',
            riskFactors: ['두통', '현기증', '중독', '사망'],
            controlMeasures: [
              '로 밀폐 및 배기 시스템',
              '환기 강화',
              'CO 감지기 설치',
              '호흡 보호구',
              '안전교육'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 로 및 부품',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복',
              '안전 거리'
            ]
          },
          {
            hazardType: '가스 누출',
            description: '메탄 또는 CO 누출',
            riskFactors: ['질식', '화재'],
            controlMeasures: [
              '가스 누출 감지기',
              '환기 시스템',
              '정기 점검'
            ]
          }
        ]
      },
      {
        id: 'nitriding',
        name: '질화열처리',
        description: '질소를 부품 표면에 침투시켜 경화',
        equipment: [
          '질화로',
          '온도계',
          '가스 공급 시스템',
          '냉각 시스템'
        ],
        chemicals: [
          '암모니아 (Ammonia) - 독성',
          '질소 가스',
          '냉각유'
        ],
        hazards: [
          {
            hazardType: '암모니아 중독',
            description: '로에서 발생하는 암모니아 가스',
            riskFactors: ['눈/코 자극', '호흡곤란', '중독'],
            controlMeasures: [
              '로 배기 시스템',
              '환기 강화',
              '암모니아 감지기',
              '호흡 보호구',
              '정기 공기 질량 검사'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 로 및 부품',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복',
              '안전 거리'
            ]
          }
        ]
      },
      {
        id: 'annealing',
        name: '소둔열처리',
        description: '금속을 천천히 냉각하여 경도를 낮추고 연성 증가',
        equipment: [
          '소둔로',
          '온도계',
          '냉각 시스템'
        ],
        chemicals: [
          '냉각유',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '화상',
            description: '고온 로 및 부품',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복 착용',
              '안전 거리 유지'
            ]
          }
        ]
      },
      {
        id: 'tempering',
        name: '템퍼링',
        description: '경화된 금속을 낮은 온도에서 재가열하여 취성 감소',
        equipment: [
          '템퍼링로',
          '온도계',
          '냉각 시스템'
        ],
        chemicals: [
          '냉각유',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '화상',
            description: '고온 로 및 부품',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복',
              '안전 거리'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cutting_sheet_metal',
    name: '절단 / 판금',
    icon: '✂️',
    description: '금속 판이나 봉을 절단, 구부려서 원하는 형태로 가공',
    subCategories: [
      {
        id: 'laser_cutting',
        name: '레이저절단',
        description: '레이저 광선으로 금속을 절단',
        equipment: [
          '레이저 절단기',
          '산업용 레이저',
          '냉각 시스템',
          '집진 시스템',
          '렌즈'
        ],
        chemicals: [
          '절단유',
          '냉각수',
          '보호 가스 (질소, 아르곤)'
        ],
        hazards: [
          {
            hazardType: '레이저 노출',
            description: '고출력 레이저 광선',
            riskFactors: ['안구 손상', '피부 화상', '실명'],
            controlMeasures: [
              '레이저 안전 경 착용',
              '구역 차폐',
              '대면 경보 시스템',
              '정기 안전 교육',
              '작동 중 접근 금지'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 절단 부위',
            riskFactors: ['화상'],
            controlMeasures: [
              '냉각 시간 제공',
              '보호 장갑'
            ]
          },
          {
            hazardType: '먼지 및 흄',
            description: '레이저 절단 시 발생하는 금속 증기',
            riskFactors: ['호흡기 질환'],
            controlMeasures: [
              '국소배기 시스템',
              '호흡 보호구'
            ]
          }
        ]
      },
      {
        id: 'wire_edm',
        name: '와이어컷팅',
        description: '와이어 방전을 통해 복잡한 형태 절단',
        equipment: [
          '와이어컷팅 기계',
          '전원공급 장치',
          '냉각 시스템',
          '화학약품 저장탱크'
        ],
        chemicals: [
          '윤활유',
          '냉각수',
          '세제'
        ],
        hazards: [
          {
            hazardType: '전기 위험',
            description: '고전압 전원',
            riskFactors: ['감전'],
            controlMeasures: [
              '절연 처리',
              '접지 확인',
              '정기 점검'
            ]
          },
          {
            hazardType: '와이어 끊김',
            description: '고속 와이어 돌출',
            riskFactors: ['상처', '눈 손상'],
            controlMeasures: [
              '보호 가드',
              '보안경 착용'
            ]
          }
        ]
      },
      {
        id: 'bending',
        name: '절곡',
        description: '프레스나 벤딩머신으로 금속판을 구부림',
        equipment: [
          '유압 프레스 (Hydraulic Press)',
          '벤딩 머신',
          '금형',
          '안전 장치'
        ],
        chemicals: [
          '유압유',
          '윤활유',
          '방청유'
        ],
        hazards: [
          {
            hazardType: '끼임',
            description: '프레스 가동 중 손 끼임',
            riskFactors: ['손가락 절단', '손 골절', '사망'],
            controlMeasures: [
              '양손 제어 장치 (Two-Hand Control)',
              '광전자 안전 센서',
              '유압 안전 밸브',
              '정기 점검',
              '안전교육'
            ]
          },
          {
            hazardType: '유압 누출',
            description: '유압유 분사',
            riskFactors: ['피부 상처', '고압 분사 상처'],
            controlMeasures: [
              '유압 호스 정기 점검',
              '누출 방지',
              '보호 거리 유지'
            ]
          }
        ]
      },
      {
        id: 'sheet_metal_work',
        name: '판금가공',
        description: '금속판을 자르고, 구부려서 부품 제조',
        equipment: [
          '가위류 (Shear)',
          '프레스',
          '드릴',
          '안전 장치'
        ],
        chemicals: [
          '절단유',
          '윤활유',
          '냉각수'
        ],
        hazards: [
          {
            hazardType: '절단',
            description: '날카로운 모서리 절단',
            riskFactors: ['상처', '손가락 손상'],
            controlMeasures: [
              '보호 장갑 착용',
              '안전 가드',
              '취급 주의'
            ]
          },
          {
            hazardType: '끼임',
            description: '프레스 또는 가위류 끼임',
            riskFactors: ['손가락 절단'],
            controlMeasures: [
              '양손 제어 장치',
              '안전 센서'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cnc_machining',
    name: 'CNC / 정밀가공',
    icon: '⚙️',
    description: '컴퓨터로 제어되는 공작기계로 높은 정밀도의 부품 가공',
    subCategories: [
      {
        id: 'cnc_lathe',
        name: 'CNC선반',
        description: '회전 축에 있는 부품을 깎아서 원통형 부품 제조',
        equipment: [
          'CNC 선반',
          '척(Collet)',
          '공구',
          '냉각 시스템',
          '칩 수집기'
        ],
        chemicals: [
          '절삭유 (Cutting Oil)',
          '냉각수',
          '세제'
        ],
        hazards: [
          {
            hazardType: '회전체 끼임',
            description: '회전 축에 옷이나 손 끼임',
            riskFactors: ['손가락 절단', '팔 골절', '사망'],
            controlMeasures: [
              '느슨한 의류 금지',
              '장시간 착용 금지',
              '보호 가드 설치',
              '자동 정지 장치',
              '정기 안전 검사'
            ]
          },
          {
            hazardType: '칩 비산',
            description: '고속 회전 중 금속 칩 비산',
            riskFactors: ['눈 손상', '얼굴 상처'],
            controlMeasures: [
              '보안경 또는 보호면',
              '보호 겉',
              '작업 중 커버'
            ]
          },
          {
            hazardType: '절삭유 노출',
            description: '절삭유 직접 접촉',
            riskFactors: ['피부 자극', '접촉 피부염'],
            controlMeasures: [
              '보호 장갑',
              '피부 세정',
              '통풍'
            ]
          }
        ]
      },
      {
        id: 'milling',
        name: '밀링가공',
        description: '회전 커터로 부품의 평면, 홈 등을 가공',
        equipment: [
          '밀링 머신',
          '커터',
          '척',
          '냉각 시스템',
          '칩 수집기'
        ],
        chemicals: [
          '절삭유',
          '냉각수',
          '세제'
        ],
        hazards: [
          {
            hazardType: '회전체 끼임',
            description: '회전 커터 또는 척에 손 끼임',
            riskFactors: ['손가락 절단'],
            controlMeasures: [
              '느슨한 의류 금지',
              '보호 가드',
              '정지 후 조정'
            ]
          },
          {
            hazardType: '칩 비산',
            description: '고속 회전 중 금속 칩',
            riskFactors: ['눈 손상'],
            controlMeasures: [
              '보안경',
              '보호 겉'
            ]
          }
        ]
      },
      {
        id: 'grinding',
        name: '평면연삭',
        description: '회전 그라인딩 휠로 평면을 정밀 연삭',
        equipment: [
          '평면 그라인더',
          '그라인딩 휠',
          '냉각 시스템',
          '집진기'
        ],
        chemicals: [
          '절삭유',
          '냉각수',
          '연마 휠'
        ],
        hazards: [
          {
            hazardType: '휠 파편 비산',
            description: '고속 회전 휠 파편 폭발',
            riskFactors: ['눈 손상', '얼굴 상처', '사망'],
            controlMeasures: [
              '휠 정기 검사',
              '휠 안전 속도 확인',
              '보호 덮개',
              '보안경',
              '정기 교체'
            ]
          },
          {
            hazardType: '회전체 끼임',
            description: '회전 휠에 손 끼임',
            riskFactors: ['손가락 절단'],
            controlMeasures: [
              '보호 가드',
              '정지 후 조정'
            ]
          },
          {
            hazardType: '먼지 흡입',
            description: '연삭 먼지',
            riskFactors: ['진폐증', '호흡기 질환'],
            controlMeasures: [
              '집진 시스템',
              '호흡 보호구'
            ]
          }
        ]
      },
      {
        id: 'boring',
        name: '보링',
        description: '회전 보링 공구로 구멍을 확대하거나 정밀 가공',
        equipment: [
          '보링 머신',
          '보링 공구',
          '냉각 시스템'
        ],
        chemicals: [
          '절삭유',
          '냉각수'
        ],
        hazards: [
          {
            hazardType: '회전체 끼임',
            description: '회전 보링 공구에 손 끼임',
            riskFactors: ['손가락 절단'],
            controlMeasures: [
              '보호 가드',
              '정지 후 조정',
              '안전교육'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'welding_joining',
    name: '용접 / 접합',
    icon: '🔗',
    description: '두 개의 금속을 열로 녹여 붙이거나 접착제로 접합',
    subCategories: [
      {
        id: 'argon_welding',
        name: '알곤용접 (TIG)',
        description: '텅스텐 전극과 알곤 가스를 사용한 정밀 용접',
        equipment: [
          'TIG 용접기',
          '전원 공급장치',
          '토치',
          '냉각 시스템',
          '가스 실린더'
        ],
        chemicals: [
          '알곤 가스 (Argon)',
          '용접봉',
          '용제 (Flux)',
          '냉각수'
        ],
        hazards: [
          {
            hazardType: '자외선 방사',
            description: '용접 호에서 발생하는 자외선',
            riskFactors: ['눈 손상', '각막염', '백내장'],
            controlMeasures: [
              '용접면/보안경 (IR과 UV 차단)',
              '용접복 착용',
              '주변 인원 보호',
              '정기 눈 검진'
            ]
          },
          {
            hazardType: '열 방사',
            description: '용접 시 발생하는 극고온',
            riskFactors: ['화상', '얼굴 손상'],
            controlMeasures: [
              '용접 보호복',
              '용접 장갑',
              '보호 에이프런',
              '안전 거리'
            ]
          },
          {
            hazardType: '가스 질식',
            description: '용접 후 산소 부족',
            riskFactors: ['질식', '의식 상실'],
            controlMeasures: [
              '제한된 공간 환기',
              '산소 농도 측정',
              '호흡 보호구',
              '구출 계획'
            ]
          },
          {
            hazardType: '흄 흡입',
            description: '용접 흄 및 금속 산화물',
            riskFactors: ['호흡기 질환', '금속열', '폐 손상'],
            controlMeasures: [
              '국소배기 시스템',
              '작업장 환기',
              '호흡 보호구',
              '정기 건강검진'
            ]
          }
        ]
      },
      {
        id: 'co2_welding',
        name: 'CO2용접 (MIG)',
        description: '와이어 전극과 CO2 가스를 사용한 반자동 용접',
        equipment: [
          'MIG 용접기',
          '전원 공급장치',
          '토치',
          '와이어 공급 장치',
          '냉각 시스템',
          '가스 실린더'
        ],
        chemicals: [
          '이산화탄소 (CO2)',
          '용접 와이어',
          '냉각수'
        ],
        hazards: [
          {
            hazardType: '자외선 방사',
            description: '용접 호에서 발생하는 자외선',
            riskFactors: ['눈 손상', '각막염'],
            controlMeasures: [
              '용접면 착용',
              '용접복'
            ]
          },
          {
            hazardType: '흄 흡입',
            description: '용접 금속 흄 및 CO2 가스',
            riskFactors: ['호흡기 질환', '금속열', '메탈 퓨버 피버'],
            controlMeasures: [
              '국소배기',
              '환기',
              '호흡 보호구'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 용접부 및 스패터',
            riskFactors: ['화상'],
            controlMeasures: [
              '용접복',
              '용접 장갑',
              '보호 에이프런'
            ]
          }
        ]
      },
      {
        id: 'spot_welding',
        name: '스폿용접',
        description: '전극으로 국소 부위를 강하게 가압하여 용접',
        equipment: [
          '스폿 용접기',
          '전원 공급장치',
          '수압 시스템',
          '전극',
          '냉각 시스템'
        ],
        chemicals: [
          '냉각수',
          '윤활유'
        ],
        hazards: [
          {
            hazardType: '끼임',
            description: '용접기 전극 또는 부품 끼임',
            riskFactors: ['손가락 절단', '손 골절'],
            controlMeasures: [
              '양손 제어 장치',
              '광전자 센서',
              '안전 거리 유지'
            ]
          },
          {
            hazardType: '전기 위험',
            description: '고전류 전원',
            riskFactors: ['감전'],
            controlMeasures: [
              '절연 처리',
              '접지',
              '정기 점검'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 용접부',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호 장갑',
              '안전 거리'
            ]
          }
        ]
      },
      {
        id: 'laser_welding',
        name: '레이저용접',
        description: '레이저 광선으로 금속을 용접',
        equipment: [
          '레이저 용접기',
          '냉각 시스템',
          '렌즈',
          '정렬 카메라'
        ],
        chemicals: [
          '냉각수',
          '보호 가스'
        ],
        hazards: [
          {
            hazardType: '레이저 노출',
            description: '고출력 레이저',
            riskFactors: ['눈 손상', '실명'],
            controlMeasures: [
              '레이저 안전경',
              '구역 차폐',
              '경보 시스템'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 용접부',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호 장갑',
              '안전 거리'
            ]
          }
        ]
      },
      {
        id: 'brazing',
        name: '브레이징',
        description: '모재보다 낮은 온도의 녹인 금속으로 접합',
        equipment: [
          '브레이징 오븐 또는 토치',
          '가열 시스템',
          '냉각 시스템',
          '플럭스'
        ],
        chemicals: [
          '플럭스',
          '브레이징 로드',
          '냉각수'
        ],
        hazards: [
          {
            hazardType: '화상',
            description: '고온 부품 및 오븐',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호복',
              '보호 장갑',
              '안전 거리'
            ]
          },
          {
            hazardType: '플럭스 흄',
            description: '플럭스 분해 가스',
            riskFactors: ['호흡기 자극'],
            controlMeasures: [
              '환기',
              '호흡 보호구'
            ]
          }
        ]
      },
      {
        id: 'soldering',
        name: '납땜',
        description: '녹인 납으로 두 금속을 접합',
        equipment: [
          '납땜 인두',
          '온도 제어 장치',
          '납땜 스테이션',
          '흄 추출 시스템'
        ],
        chemicals: [
          '납 (Lead) 함유 납땜',
          '로진 플럭스 (Rosin Flux)',
          '무연 납땜 (Lead-free)'
        ],
        hazards: [
          {
            hazardType: '납 중독',
            description: '납 함유 납땜 사용 (권장되지 않음)',
            riskFactors: ['신경 손상', '신장 손상', '생식계 영향'],
            controlMeasures: [
              '무연 납땜 사용 권장',
              '보호 장갑',
              '피부 세정',
              '정기 혈중 납 검사'
            ]
          },
          {
            hazardType: '로진 플럭스 흄',
            description: '플럭스 분해 가스',
            riskFactors: ['천식', '호흡기 자극', '알레르기'],
            controlMeasures: [
              '국소배기 또는 흄 추출',
              '작업장 환기',
              '호흡 보호구'
            ]
          },
          {
            hazardType: '화상',
            description: '고온 납땜 인두',
            riskFactors: ['화상'],
            controlMeasures: [
              '보호 장갑',
              '스탠드 사용',
              '냉각 시간'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'painting_coating',
    name: '도장 / 코팅',
    icon: '🎨',
    description: '금속 표면에 도료나 코팅제를 도포하여 보호하고 미관 향상',
    subCategories: [
      {
        id: 'powder_coating',
        name: '분체도장',
        description: '건조한 분말 형태의 도료를 정전기로 분사한 후 고온에서 건조',
        equipment: [
          '분체도장 부스',
          '스프레이 건',
          '정전기 발생기',
          '건조로',
          '컨베이어 시스템',
          '집진기'
        ],
        chemicals: [
          '분체 도료 (Powder Coating)',
          '경화제',
          '압축공기'
        ],
        hazards: [
          {
            hazardType: '분체 흡입',
            description: '도료 분체 입자 흡입',
            riskFactors: ['호흡기 질환', '폐 손상', '알레르기'],
            controlMeasures: [
              '부스 환기 시스템',
              '호흡 보호구 (공기청정식 마스크)',
              '작업 시간 제한',
              '정기 폐 기능 검사'
            ]
          },
          {
            hazardType: '정전기 위험',
            description: '정전기 방전',
            riskFactors: ['화재', '폭발'],
            controlMeasures: [
              '접지 시설',
              '항정전성 신발',
              '습도 관리 (35~65%)',
              '화학약품 금지 구역'
            ]
          },
          {
            hazardType: '화재',
            description: '분체 도료의 가연성',
            riskFactors: ['화재', '폭발'],
            controlMeasures: [
              '부스 환기 (폭발 범위 유지)',
              '소화기 비치',
              '금지화 방지'
            ]
          }
        ]
      },
      {
        id: 'liquid_coating',
        name: '액체도장',
        description: '액체 도료를 분사 또는 침지하여 도장',
        equipment: [
          '도장 부스',
          '스프레이 건',
          '컨베이어 시스템',
          '건조로',
          '집진기'
        ],
        chemicals: [
          '액체 도료',
          '용제 (Solvent)',
          '경화제',
          '씬너'
        ],
        hazards: [
          {
            hazardType: '유기용제 중독',
            description: '도료 용제 증기 흡입',
            riskFactors: ['신경 손상', '기억력 손상', '간 손상'],
            controlMeasures: [
              '부스 환기 시스템',
              '호흡 보호구',
              '작업 시간 제한',
              '정기 건강검진'
            ]
          },
          {
            hazardType: '화재',
            description: '용제의 높은 가연성',
            riskFactors: ['화재', '폭발'],
            controlMeasures: [
              '부스 환기',
              '소화기 비치',
              '금지화 방지',
              '정전기 방지'
            ]
          },
          {
            hazardType: '피부 자극',
            description: '도료 접촉',
            riskFactors: ['접촉 피부염', '알레르기'],
            controlMeasures: [
              '보호 장갑',
              '앞치마',
              '피부 세정'
            ]
          }
        ]
      },
      {
        id: 'electrocoating',
        name: '전착도장',
        description: '정전기를 이용하여 도료를 도포',
        equipment: [
          '전착도장 탱크',
          '정류기',
          '냉각 시스템',
          '건조로'
        ],
        chemicals: [
          '전착 도료 (Electrocoat)',
          '용제',
          '경화제'
        ],
        hazards: [
          {
            hazardType: '전기 위험',
            description: '고전압 정류기',
            riskFactors: ['감전'],
            controlMeasures: [
              '절연 처리',
              '접지',
              '정기 점검'
            ]
          },
          {
            hazardType: '용제 증기',
            description: '휘발성 유기용제',
            riskFactors: ['신경 손상'],
            controlMeasures: [
              '환기',
              '호흡 보호구'
            ]
          }
        ]
      },
      {
        id: 'epoxy_coating',
        name: '에폭시코팅',
        description: '에폭시 수지를 도포하여 내식성 강화',
        equipment: [
          '도장 부스',
          '스프레이 건 또는 붓',
          '믹싱 장비',
          '건조로'
        ],
        chemicals: [
          '에폭시 수지',
          '경화제',
          '용제',
          '촉진제'
        ],
        hazards: [
          {
            hazardType: '에폭시 수지 알레르기',
            description: '에폭시 수지 접촉',
            riskFactors: ['접촉 피부염', '호흡기 감작'],
            controlMeasures: [
              '보호 장갑',
              '호흡 보호구',
              '환기',
              '피부 세정'
            ]
          },
          {
            hazardType: '용제 중독',
            description: '용제 증기 흡입',
            riskFactors: ['신경 손상'],
            controlMeasures: [
              '환기 시스템',
              '호흡 보호구'
            ]
          }
        ]
      }
    ]
  }
];

interface CatalogProfile {
  equipment: string[];
  chemicals: string[];
  hazards: CategoryHazard[];
}

const TONG_LINK_CATEGORY_METADATA: Record<string, Omit<MainCategory, 'subCategories'>> = {
  plating_coating: { id: 'plating_coating', name: '도금 / 피막', icon: '🔧', description: '금속 표면에 보호 및 기능성 피막을 형성하는 공정' },
  grinding_blasting: { id: 'grinding_blasting', name: '연마 / 블라스트', icon: '🔨', description: '연마재와 분사 장비로 금속 표면을 가공하는 공정' },
  heat_treatment: { id: 'heat_treatment', name: '열처리', icon: '🔥', description: '열과 냉각으로 금속의 물성을 변화시키는 공정' },
  cutting_sheet_metal: { id: 'cutting_sheet_metal', name: '절단 / 판금', icon: '✂️', description: '금속 소재를 절단하고 성형하는 공정' },
  cnc_machining: { id: 'cnc_machining', name: 'CNC / 정밀가공', icon: '⚙️', description: '공작기계로 정밀 부품을 가공하는 공정' },
  welding_joining: { id: 'welding_joining', name: '용접 / 접합', icon: '🔗', description: '열과 압력으로 소재를 접합하는 공정' },
  painting_coating: { id: 'painting_coating', name: '도장 / 코팅', icon: '🎨', description: '도료 및 코팅제로 표면을 보호하는 공정' },
  mold_injection: { id: 'mold_injection', name: '금형 / 사출', icon: '🧩', description: '금형을 이용해 플라스틱과 고무 부품을 성형하는 공정' },
  press_forming: { id: 'press_forming', name: '프레스 / 성형', icon: '🛠️', description: '프레스와 성형기로 소재를 가공하는 공정' },
  casting_forging: { id: 'casting_forging', name: '주조 / 단조', icon: '🏭', description: '용융 금속과 고온 소재를 성형하는 공정' },
  electrical_wiring: { id: 'electrical_wiring', name: '전기 / 배선', icon: '⚡', description: '전장품과 배선, 전기설비를 조립하는 공정' },
  assembly_processing: { id: 'assembly_processing', name: '조립 / 임가공', icon: '🔩', description: '부품을 체결하고 제품을 조립하는 공정' },
  inspection_finishing: { id: 'inspection_finishing', name: '검사 / 후처리', icon: '🔍', description: '품질을 검사하고 세척, 마킹, 포장하는 공정' },
  office_computer: { id: 'office_computer', name: '사무기기 / 컴퓨터', icon: '💻', description: '사무기기와 정보통신 장비를 설치하고 유지보수하는 서비스' },
  interior_demolition: { id: 'interior_demolition', name: '인테리어 / 철거', icon: '🏗️', description: '실내 공간을 시공, 해체, 복구하는 작업' },
  facility_logistics: { id: 'facility_logistics', name: '설비 / 물류서비스', icon: '🚚', description: '설비를 유지보수하고 물류를 운반하는 서비스' }
};

const TONG_LINK_PROCESS_CATALOG: Record<string, string[]> = {
  plating_coating: ['도금', '전기도금', '무전해도금', '화학도금', '아연도금', '니켈도금', '무전해니켈', '크롬도금', '경질크롬', '동도금', '금도금', '은도금', '주석도금', '카드뮴도금', '아노다이징', '알루마이트', '양극산화', '크로메이트', '삼가크로메이트', '화성피막', '인산염피막', '흑착색', '블랙옥사이드', '부동태', '패시베이션'],
  grinding_blasting: ['연마', '바렐연마', '진동연마', '전해연마', '평면연마', '원통연마', '센터리스연마', '폴리싱', '버핑', '광택', '랩핑', '연삭', '평면연삭', '원통연삭', '사상', '디버링', '면취', '샌딩', '샌드블라스트', '쇼트블라스트', '쇼트피닝', '비드블라스트'],
  heat_treatment: ['열처리', '고주파열처리', '진공열처리', '침탄열처리', '질화열처리', '침탄질화', '연질화', '소입', '담금질', '퀜칭', '템퍼링', '뜨임', '소둔', '어닐링', '풀림', '고용화처리', '용체화처리', '시효처리'],
  cutting_sheet_metal: ['레이저절단', '레이저가공', '와이어컷팅', '플라즈마절단', '워터젯', '톱절단', '가스절단', '절단가공', '절곡', '벤딩', '롤벤딩', '판금', '판금가공', 'NCT가공', 'NCT펀칭', '펀칭', '타공', '타발', '샤링'],
  cnc_machining: ['CNC가공', 'MCT가공', '머시닝센터', '5축가공', '복합가공', 'CNC선반', '선반가공', '자동선반', '밀링가공', '탭가공', '보링', '드릴가공', '브로칭', '호닝', '방전가공', '와이어방전', '정밀가공', '평면연삭', '원통연삭'],
  welding_joining: ['용접', '알곤용접', '아르곤용접', 'TIG용접', 'MIG용접', 'MAG용접', 'CO2용접', '아크용접', '로봇용접', '스폿용접', '프로젝션용접', '레이저용접', '브레이징', '은납', '납땜', '마찰교반용접', '초음파용접'],
  painting_coating: ['도장', '분체도장', '액체도장', '소부도장', '스프레이도장', '전착도장', '파우더코팅', '에폭시코팅', '테프론코팅', '우레탄코팅', '세라믹코팅', '불소코팅', '액상코팅', '코팅'],
  mold_injection: ['금형제작', '금형수리', '사출성형', '사출금형', '프레스금형', '다이캐스팅금형', '인서트사출', '이중사출', '금속인서트', '압출성형', '진공성형', '블로우성형', '실리콘성형', '고무성형', '플라스틱성형'],
  press_forming: ['프레스', '프레스가공', '프레스성형', '단발프레스', '순차프레스', '트랜스퍼프레스', '딥드로잉', '포밍', '롤포밍', '스피닝', '굽힘성형', '코이닝', '타발', '펀칭', '압입', '압연'],
  casting_forging: ['주조', '주물', '주물제작', '사형주조', '금형주조', '중력주조', '저압주조', '고압주조', '정밀주조', '로스트왁스', '원심주조', '알루미늄주조', '비철주조', '동합금주조', '주철주조', '주강주조', '다이캐스팅', '단조', '열간단조', '냉간단조', '형단조', '자유단조'],
  electrical_wiring: ['하네스', '와이어하네스', '케이블하네스', '케이블조립', '케이블가공', '단자압착', '커넥터조립', '배선조립', '전장배선', 'PCB조립', 'SMT실장', '회로조립', '납땜', '전장조립', '제어반', '배전반', '전기판넬'],
  assembly_processing: ['부품조립', '제품조립', '수작업조립', '모듈조립', '금속부품조립', '프레스조립', '공압프레스조립', '핫프레스조립', '리벳팅', '압입', '나사조립', '볼트체결', '임가공', '외주임가공', '검사임가공', '포장임가공'],
  inspection_finishing: ['검사', '3차원측정', 'CMM측정', '치수검사', '비전검사', '외관검사', '현미경검사', '기능검사', '조립검사', '기밀검사', '비파괴검사', '침투탐상', '자분탐상', '초음파탐상', '성적서대응', '초음파세척', '산업세척', '정밀세척', '탈지', '레이저마킹', '각인', '실크인쇄', '라벨부착', '산업포장', '포장'],
  office_computer: ['복합기수리', '복합기렌탈', '프린터수리', '프린터렌탈', '복사기수리', '복사기렌탈', '사무기기수리', '사무기기렌탈', '컴퓨터수리', '컴퓨터렌탈', '노트북수리', 'PC유지보수', '네트워크설치', '랜공사', '와이파이설치', '서버관리', 'NAS설치', '데이터복구', '전산유지보수', '기업전산관리'],
  interior_demolition: ['인테리어', '사무실인테리어', '상가인테리어', '공장인테리어', '리모델링', '칸막이공사', '도배', '바닥공사', '천장공사', '도색공사', '철거', '사무실철거', '상가철거', '공장철거', '부분철거', '내부철거', '간판철거', '집기철거', '원상복구', '폐기물처리'],
  facility_logistics: ['CCTV설치', 'CCTV유지보수', '출입통제', '보안시스템', '전기공사', '공장배선', '배관공사', '소방설비', '에어컨설치', '냉난방기', '공조환기', '콤프레샤', '자동문수리', '기계수리', '산업기계수리', '모터수리', '펌프수리', '설비보수', '공장유지보수', '화물운송', '퀵서비스', '용달', '지게차', '공장이사', '기업이사', '기계운반', '중량물운반', '창고보관', '물류대행', '납품대행', '공장청소', '산업청소', '방역', '폐기물수거', '문서파쇄']
};

function getCatalogProfile(categoryId: string): CatalogProfile {
  const chemicalHazard: CategoryHazard = { hazardType: '화학물질 노출', description: '약품, 도료 또는 유해 증기와 접촉하거나 흡입할 위험', riskFactors: ['피부염', '화학 화상', '호흡기 질환'], controlMeasures: ['국소배기장치 가동', '보호장갑 및 보안경 착용', 'MSDS 비치 및 취급 교육'] };
  const mechanicalHazard: CategoryHazard = { hazardType: '기계적 위험', description: '회전체, 금형 또는 이동 설비에 신체가 접촉할 위험', riskFactors: ['끼임', '절단', '충돌'], controlMeasures: ['방호장치 점검', '정비 시 전원 차단', '보호구 착용 및 안전거리 유지'] };
  const thermalHazard: CategoryHazard = { hazardType: '고온 및 화상', description: '고온 설비, 용융물 또는 가열 부품에 접촉할 위험', riskFactors: ['화상', '화재'], controlMeasures: ['내열 보호구 착용', '고온부 표지', '소화기 비치 및 작업 전 점검'] };
  const electricalHazard: CategoryHazard = { hazardType: '전기적 위험', description: '전원, 제어반 또는 충전부에 접촉할 위험', riskFactors: ['감전', '전기 화상'], controlMeasures: ['접지 및 절연 상태 점검', '잠금표지 절차 준수', '전기 작업자 교육'] };
  const physicalHazard: CategoryHazard = { hazardType: '작업환경 위험', description: '소음, 분진, 비산물 또는 중량물 취급으로 인한 위험', riskFactors: ['청력 손상', '호흡기 질환', '근골격계 부담'], controlMeasures: ['집진 및 환기장치 가동', '보안경과 귀마개 착용', '중량물 취급 보조장비 사용'] };

  if (['plating_coating', 'painting_coating'].includes(categoryId)) return { equipment: ['처리조 또는 도장 설비', '정류기 또는 분사기', '국소배기장치'], chemicals: ['공정용 약품 또는 도료', '세척제'], hazards: [chemicalHazard, electricalHazard] };
  if (['heat_treatment', 'casting_forging'].includes(categoryId)) return { equipment: ['가열로 또는 용해로', '냉각 설비', '호이스트'], chemicals: ['냉각유', '방청유'], hazards: [thermalHazard, mechanicalHazard] };
  if (categoryId === 'electrical_wiring') return { equipment: ['전원공급장치', '압착기 또는 납땜기', '검사장비'], chemicals: ['세척제', '납땜용 플럭스'], hazards: [electricalHazard, chemicalHazard] };
  if (['interior_demolition', 'facility_logistics'].includes(categoryId)) return { equipment: ['이동식 공구', '운반장비', '사다리 또는 작업발판'], chemicals: ['윤활유', '세척제'], hazards: [mechanicalHazard, physicalHazard] };
  if (categoryId === 'office_computer') return { equipment: ['전동 공구', '컴퓨터 및 주변기기', '운반 카트'], chemicals: ['세척제'], hazards: [electricalHazard, physicalHazard] };
  if (categoryId === 'inspection_finishing') return { equipment: ['측정기 또는 검사장비', '세척 설비', '마킹 장비'], chemicals: ['세척제'], hazards: [physicalHazard, electricalHazard] };
  return { equipment: ['공정 전용 설비', '안전 방호장치', '운반 보조장비'], chemicals: ['윤활유', '세척제'], hazards: [mechanicalHazard, physicalHazard] };
}

function createCatalogSubCategory(categoryId: string, name: string): SubCategory {
  const profile = getCatalogProfile(categoryId);
  return {
    id: `${categoryId}_${name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}`,
    name,
    description: `${name} 작업의 표준 위험성평가`,
    equipment: profile.equipment,
    chemicals: profile.chemicals,
    hazards: profile.hazards
  };
}

function normalizeProcessName(name: string) {
  return name === '흑색산화' ? '블랙옥사이드' : name;
}

for (const [categoryId, processNames] of Object.entries(TONG_LINK_PROCESS_CATALOG)) {
  let category = MANUFACTURING_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) {
    const metadata = TONG_LINK_CATEGORY_METADATA[categoryId];
    category = { ...metadata, subCategories: [] };
    MANUFACTURING_CATEGORIES.push(category);
  }

  const existingNames = new Set(category.subCategories.map((item) => normalizeProcessName(item.name)));
  category.subCategories.push(
    ...processNames
      .filter((name) => !existingNames.has(normalizeProcessName(name)))
      .map((name) => createCatalogSubCategory(categoryId, name))
  );
}

/**
 * 카테고리 데이터를 기반으로 위험성평가 프로세스 생성
 */
export function generateProcessFromCategory(category: SubCategory) {
  return {
    processName: category.name,
    detailedWorkContent: category.description,
    supervisor: '',
    workerNames: [],
    equipmentUsed: category.equipment,
    chemicalsUsed: category.chemicals,
    hazards: category.hazards.map((hazard, index) => {
      const hazardCategory = getHazardCategory(hazard.hazardType);
      const likelihood = 3;
      const severity = hazardCategory === 'Chemical' || hazardCategory === 'FireExplosion' ? 4 : 3;
      const riskScore = likelihood * severity;
      const postLikelihood = 2;
      const postRiskScore = postLikelihood * severity;

      return {
        id: `haz_category_${category.id}_${index + 1}`,
        hazardCategory,
        machineryRelated: category.equipment[0] || '공정 전반',
        hazardSituation: `${hazard.description}: ${hazard.riskFactors.join(', ')} 위험이 발생할 수 있음`,
        accidentType: hazard.riskFactors.join(', '),
        legalBasis: '산업안전보건기준에 관한 규칙 및 해당 작업 안전보건 기준',
        currentSafetyMeasures: hazard.controlMeasures.join(', '),
        likelihood,
        severity,
        riskScore,
        riskLevel: getRiskLevelFromScore(riskScore),
        isAcceptable: riskScore < 9,
        reductionMeasures: hazard.controlMeasures.join(', '),
        plannedDate: '',
        completionDate: '',
        responsiblePerson: '',
        postLikelihood,
        postSeverity: severity,
        postRiskScore,
        postRiskLevel: getRiskLevelFromScore(postRiskScore)
      };
    })
  };
}

function getHazardCategory(hazardType: string) {
  if (/(전기|감전|정전기)/.test(hazardType)) return 'Electrical' as const;
  if (/(화학|산 |독성|중독|용제|흄|증기|납)/.test(hazardType)) return 'Chemical' as const;
  if (/(화상|열|레이저)/.test(hazardType)) return 'Thermal' as const;
  if (/(화재|폭발|가스 누출)/.test(hazardType)) return 'FireExplosion' as const;
  if (/(소음|진동|먼지|안구|규폐)/.test(hazardType)) return 'Physical' as const;
  if (/(끼임|절단|회전체|낙하|기계)/.test(hazardType)) return 'Mechanical' as const;
  return 'Other' as const;
}
