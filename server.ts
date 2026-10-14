/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper to safely get the Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log('Gemini AI Client initialized successfully.');
      } catch (err) {
        console.error('Failed to initialize Gemini AI Client:', err);
      }
    } else {
      console.warn('GEMINI_API_KEY not configured or has default placeholder. Running in Offline Expert DB mode.');
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      geminiActive: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    });
  });

  // API Route: AI-powered hazard recommendation using gemini-3.5-flash
  app.post('/api/gemini/generate-hazard', async (req, res) => {
    const { processName, detailedWorkContent, machineryRelated } = req.body;

    if (!processName) {
      return res.status(400).json({ error: '공정명(processName)은 필수 입력 항목입니다.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        source: 'local_fallback',
        message: 'Gemini API 키가 설정되지 않아 로컬 안전 전문가 시스템에서 가공된 위험요인을 제공합니다.'
      });
    }

    try {
      const prompt = `
당신은 대한민국 산업안전보건법, KOSHA 가이드 및 한국전기설비규정(KEC)을 통달한 건설업 현장(전기공사·가설·토목·골조·마감) 위험성평가 최고 전문가입니다.
사용자가 다음의 건설 공정 세부사항을 제공했습니다:

- 공정명: ${processName}
- 상세 작업 활동: ${detailedWorkContent || '일반 건설 및 설비 공사 작업'}
- 관련 설비/기계: ${machineryRelated || '공정 전반 공통'}

한국산업안전보건공단(KOSHA)의 KRAS(위험성평가 시스템) 표준 지침에 따라 현실적이고 정밀한 위험성평가 요인 1건을 도출하십시오.

★전기공사 및 현장 위험성평가 핵심 판정 원칙★:
1. [공정 시작점 원칙]: 전기공사의 시작은 반드시 [자재 반입 및 야적·소운반]부터 출발합니다.
2. [고위험 작업 반영]: 자재 반입 이후의 고소작업(고소작업대, 이동식비계, A형 사다리, 천장 배관/트레이 거치)과 장비작업(카고크레인, 지게차, 전동 케이블 윈치, 도비 롤러) 등 고위험 요소를 상세하고 구체적으로 분석하십시오.
3. [★통전 여부 엄격 구분 원칙 - 매우 중요★]:
   - 【통전 전 단계】(자재 반입, 야적, 소운반, 배관·트레이 고소 설치, 앵커 타공, 케이블 풀링/포설, 분전반 안착, 기구 취부 등):
     전기가 전혀 투입되지 않은 완전 무전압 상태이므로 **감전(Electric shock)에 관한 내용은 절대 포함하지 마십시오.**
     대신 중량물 낙하/깔림, 크레인 슬링 이탈, 고소작업대/비계 추락, 천장 협착, 고속절단기 칩 비산 및 날카로운 트레이 단면 베임, 전동 윈치 손가락 끼임 등 실제 발생하는 물리적·기계적 고위험 요인을 도출하십시오.
   - 【통전 수반/가압 단계】(수전, 가압 시험, 차단기 투입, 변압기 시운전, 절연/접지저항 측정, 활선 근접 점검, 정전 LOTO 등):
     전기가 실제로 공급되는 상태이므로 **전기적 위험(특고압 섬락 감전, 충전부 직접 접촉 감전, 상간 단락 아크 플래시 화상, 외함 누전 감전, 불시 가압 오투입 감전 등)**을 최우선으로 정밀 도출하십시오.

결과는 반드시 한국어로 제공되어야 하며, 다음 필드 조건을 정확히 지켜 JSON으로 반환하십시오:

1. hazardCategory: 기계적(Mechanical), 전기적(Electrical), 화학적(Chemical), 화재·폭발(FireExplosion), 근골격계/인간공학적(Ergonomic), 물리적(Physical), 작업환경(WorkEnvironment), 기타(Other) 중 하나. (통전 전이면 Electrical 배제, 통전 수반이면 Electrical 또는 FireExplosion 선택)
2. accidentType: 예: "떨어짐(추락)", "끼임(협착)", "물체에 맞음", "넘어짐(전도)", "감전(접촉/섬락)", "화재·폭발(아크)" 등.
3. hazardSituation: 원인 행위, 대상 설비, 불안전한 상태와 발생할 피해 결과를 인과관계가 명확한 KOSHA 표준 문장으로 서술하십시오.
4. legalBasis: 실제 존재하는 산업안전보건기준에 관한 규칙 제X조 (조항 명칭) 형태로 작성하십시오.
5. currentSafetyMeasures: 건설 현장에서 흔히 볼 수 있는 미흡하거나 형식적인 안전조치 상태를 구체적으로 명시하십시오. (예: "고소작업대 탑승 시 안전대 착용하였으나 안전난간대 고리에 미체결 상태")
6. reductionMeasures: 위험을 근본적으로 제거/감소시키기 위한 구체적이고 실현 가능한 기술적(방호장치, 인터록, LOTO), 관리적(안전기준, 유도자 배치, 2인1조) 대책을 서술하십시오.
7. suggestedLikelihood: 위험 발생 빈도 (1부터 5까지의 정수, 5가 최고 빈도)
8. suggestedSeverity: 재해 발생 시 피해 강도 (1부터 5까지의 정수, 5가 사망/중대재해)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a premier South Korean construction safety engineer and electrical safety professional specializing in KOSHA KRAS risk assessments.',
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hazardCategory: {
                type: Type.STRING,
                description: 'Hazard category (Mechanical, Electrical, Chemical, FireExplosion, Ergonomic, Physical, WorkEnvironment, Other)'
              },
              accidentType: {
                type: Type.STRING,
                description: 'Type of manufacturing accident in Korean'
              },
              hazardSituation: {
                type: Type.STRING,
                description: 'Detailed hazard occurrence situation and expected negative result in Korean'
              },
              legalBasis: {
                type: Type.STRING,
                description: 'Specific Korean Industrial Safety Rule clause reference'
              },
              currentSafetyMeasures: {
                type: Type.STRING,
                description: 'Typical poor or partial safety measures present in South Korean small factories'
              },
              reductionMeasures: {
                type: Type.STRING,
                description: 'Recommended engineering or administrative reduction measures in Korean'
              },
              suggestedLikelihood: {
                type: Type.INTEGER,
                description: 'Integer from 1 to 5 representing probability'
              },
              suggestedSeverity: {
                type: Type.INTEGER,
                description: 'Integer from 1 to 5 representing severity'
              }
            },
            required: [
              'hazardCategory',
              'accidentType',
              'hazardSituation',
              'legalBasis',
              'currentSafetyMeasures',
              'reductionMeasures',
              'suggestedLikelihood',
              'suggestedSeverity'
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini model returned empty response.');
      }

      const generatedData = JSON.parse(responseText.trim());

      return res.json({
        success: true,
        source: 'gemini_api',
        data: generatedData
      });
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Gemini API 호출 과정에서 요인 분석 오류가 발생했습니다.',
        source: 'error'
      });
    }
  });

  // Integrate Vite as a middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server middleware loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving compiled static assets from dist/.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KRAS App server listening on port ${PORT}`);
  });
}

startServer();
