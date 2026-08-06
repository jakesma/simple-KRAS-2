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
당신은 대한민국 산업안전보건법 및 KOSHA 가이드를 통달한 제조업 안전 진단 전문가입니다.
사용자가 다음의 제조 공정 세부사항을 제공했습니다:

- 공정명: ${processName}
- 상세 작업 활동: ${detailedWorkContent || '일반 제조 및 설비 취급 작업'}
- 관련 설비/기계: ${machineryRelated || '공정 전반 공통'}

이 정보를 토대로 한국산업안전보건공단의 KRAS(위험성평가 시스템) 기준에 완벽히 부합하는 위험성평가 요인 1건을 정교하게 도출하십시오.
결과는 반드시 한국어로 제공되어야 하며, 다음 필드 조건을 정확히 지켜 JSON으로 반환하십시오:

1. hazardCategory: 기계적(Mechanical), 전기적(Electrical), 화학적(Chemical), 화재·폭발(FireExplosion), 근골격계/인간공학적(Ergonomic), 물리적(Physical), 작업환경(WorkEnvironment), 기타(Other) 중 가장 대표적인 한 종류 선택 (반드시 지정된 영문 토큰값 중 하나여야 함).
2. accidentType: 예시: "끼임", "감전", "추락", "맞음", "벤", "중독", "화재·폭발", "넘어짐" 등 한국어로 작성.
3. hazardSituation: 구체적인 유해위험요인 파악 상황 및 발생 상황과 예상되는 불리한 결과를 인과관계가 드러나도록 서술하십시오. (예: "프레스 기어 가드가 없는 상태에서 이물질을 수동 제거하려다 기어에 면장갑이 끌려들어가 손가락이 짓눌릴 위험")
4. legalBasis: 구체적인 산업안전보건기준에 관한 규칙 제X조 (조항 명칭) 형태로 작성하십시오. 실제 존재하는 조항을 추천해야 합니다.
5. currentSafetyMeasures: 현재 현장에서 안전조치 상태가 어떤지 대조군이 될 만한 미흡하거나 기본적인 상태를 명시하십시오. (예: "안전모는 쓰고 있으나 회전체 작업에 면장갑 착용 상태 유지")
6. reductionMeasures: 위 위험을 근본적으로 감소시키기 위한 구체적이고 실현 가능한 기술적(인터락, 방호물), 관리적(안전규칙, 교육) 대책을 자세히 적어주십시오.
7. suggestedLikelihood: 위험 발생 빈도 (1부터 5까지의 정수, 5가 가장 자주 발생)
8. suggestedSeverity: 재해 발생 시 강도 (1부터 5까지의 정수, 5가 사망/중대재해)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a professional industrial safety officer in South Korea specializing in manufacturing plant risk assessments.',
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
