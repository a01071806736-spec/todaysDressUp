/**
 * Vercel Serverless Function: POST /api/recommend-outfit
 *
 * 필수 Vercel 환경 변수 (Environment Variables):
 * - GEMINI_API_KEY: Google Gemini API 키 (서버 전용, 절대 VITE_ 접두사를 붙이지 마세요)
 *
 * Vercel Dashboard > Project Settings > Environment Variables에서
 * GEMINI_API_KEY를 등록하면 process.env.GEMINI_API_KEY로 안전하게 읽어들입니다.
 */
import type {IncomingMessage, ServerResponse} from 'node:http';
import {GoogleGenAI, Type} from '@google/genai';

interface WeatherPayload {
  currentTemp: number;
  apparentTemp: number;
  conditionLabel: string;
  minTemp: number;
  maxTemp: number;
  precipitationProbability: number;
}

interface RecommendRequestBody {
  ageGroup: string;
  gender: string;
  styleName: string;
  styleDescription: string;
  weather: WeatherPayload;
}

interface OutfitRecommendation {
  outerwear: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  reason: string;
}

export interface ApiRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
}

export interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse;
  json?: (body: unknown) => void;
}

function sendJson(res: ApiResponse, statusCode: number, payload: unknown): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    const nextRes = res.status(statusCode);
    if (typeof nextRes.json === 'function') {
      nextRes.json(payload);
      return;
    }
  }

  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body);
    }
    if (Buffer.isBuffer(req.body)) {
      return JSON.parse(req.body.toString('utf8'));
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  const maxBytes = 100 * 1024;

  for await (const chunk of req) {
    const bufferChunk = typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer);
    totalBytes += bufferChunk.length;
    if (totalBytes > maxBytes) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(bufferChunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

function isValidPayload(body: unknown): body is RecommendRequestBody {
  if (!body || typeof body !== 'object') return false;
  const candidate = body as Partial<RecommendRequestBody>;
  if (
    typeof candidate.ageGroup !== 'string' ||
    typeof candidate.gender !== 'string' ||
    typeof candidate.styleName !== 'string' ||
    typeof candidate.styleDescription !== 'string' ||
    !candidate.weather ||
    typeof candidate.weather !== 'object'
  ) {
    return false;
  }

  const w = candidate.weather as Partial<WeatherPayload>;
  return (
    typeof w.currentTemp === 'number' &&
    Number.isFinite(w.currentTemp) &&
    typeof w.apparentTemp === 'number' &&
    Number.isFinite(w.apparentTemp) &&
    typeof w.conditionLabel === 'string' &&
    typeof w.minTemp === 'number' &&
    Number.isFinite(w.minTemp) &&
    typeof w.maxTemp === 'number' &&
    Number.isFinite(w.maxTemp) &&
    typeof w.precipitationProbability === 'number' &&
    Number.isFinite(w.precipitationProbability)
  );
}

export async function handleRecommendOutfit(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {error: '허용되지 않은 요청 방식입니다.'});
    return;
  }

  let parsedBody: unknown;
  try {
    parsedBody = await readJsonBody(req);
  } catch (err) {
    const isTooLarge = err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE';
    sendJson(res, isTooLarge ? 413 : 400, {error: '요청 본문 형식이 올바르지 않습니다.'});
    return;
  }

  if (!isValidPayload(parsedBody)) {
    sendJson(res, 400, {error: '추천에 필요한 정보가 부족합니다.'});
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {error: 'AI 서비스 설정을 확인할 수 없습니다.'});
    return;
  }

  const {ageGroup, gender, styleName, styleDescription, weather} = parsedBody;
  const tempDiff = Math.round(weather.maxTemp - weather.minTemp);

  const prompt = [
    '아래 사용자 정보와 오늘 날씨를 바탕으로 가을 여행에 어울리는 옷차림을 정확히 1가지만 추천해 주세요.',
    '',
    '[사용자 정보]',
    `- 연령대: ${ageGroup}`,
    `- 성별: ${gender}`,
    `- 고른 스타일: ${styleName} (${styleDescription})`,
    '',
    '[오늘 날씨]',
    `- 지금 기온: ${weather.currentTemp}℃`,
    `- 체감온도: ${weather.apparentTemp}℃`,
    `- 날씨 상태: ${weather.conditionLabel}`,
    `- 오늘 최저 기온: ${weather.minTemp}℃`,
    `- 오늘 최고 기온: ${weather.maxTemp}℃ (일교차 약 ${tempDiff}℃)`,
    `- 강수 확률: ${weather.precipitationProbability}%`,
    '',
    '[지침]',
    '1. 고른 스타일에 맞는 옷차림 정확히 1가지로 겉옷, 상의, 하의, 신발, 소품을 모두 추천해 주세요.',
    '2. 오늘 기온과 날씨에 꼭 맞게 구성해 주세요. 비 올 확률이 높으면 우산이나 방수 신발을 꼭 넣어 주세요.',
    '3. 아침저녁과 낮의 기온 차이가 크면 가벼운 옷을 껴입는 방식을 추천해 주세요.',
    '4. 연령대와 성별에 어울리게, 누구나 쉽게 구할 수 있는 평범한 옷으로 추천해 주세요. 특정 브랜드 이름은 절대 넣지 마세요.',
    '5. 추천 이유(reason)는 오늘 날씨를 근거로 한 문장으로만 작성해 주세요.',
    '6. 모든 내용은 친절한 한국어 존댓말과 쉬운 말로 작성해 주세요.',
  ].join('\n');

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          '당신은 한국인을 위한 친절한 가을 여행 옷차림 도우미입니다. 반드시 요청된 JSON 형식으로만 답하고, 쉬운 존댓말을 사용하며 특정 브랜드명은 쓰지 마세요.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outerwear: {
              type: Type.STRING,
              description: '겉옷 추천 (쉽게 구할 수 있는 평범한 옷, 브랜드명 제외, 쉬운 존댓말)',
            },
            top: {
              type: Type.STRING,
              description: '상의 추천 (브랜드명 제외, 쉬운 존댓말)',
            },
            bottom: {
              type: Type.STRING,
              description: '하의 추천 (브랜드명 제외, 쉬운 존댓말)',
            },
            shoes: {
              type: Type.STRING,
              description: '신발 추천 (브랜드명 제외, 쉬운 존댓말)',
            },
            accessories: {
              type: Type.STRING,
              description: '소품 추천 (예: 접이식 우산, 얇은 스카프, 모자 등, 쉬운 존댓말)',
            },
            reason: {
              type: Type.STRING,
              description: '오늘 날씨를 근거로 한 한 문장 추천 이유 (존댓말)',
            },
          },
          required: ['outerwear', 'top', 'bottom', 'shoes', 'accessories', 'reason'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      sendJson(res, 502, {error: '추천 결과를 받지 못했습니다.'});
      return;
    }

    const parsed = JSON.parse(rawText) as Partial<OutfitRecommendation>;
    if (
      !parsed.outerwear ||
      !parsed.top ||
      !parsed.bottom ||
      !parsed.shoes ||
      !parsed.accessories ||
      !parsed.reason
    ) {
      sendJson(res, 502, {error: '추천 결과 형식이 올바르지 않습니다.'});
      return;
    }

    sendJson(res, 200, {
      outerwear: parsed.outerwear,
      top: parsed.top,
      bottom: parsed.bottom,
      shoes: parsed.shoes,
      accessories: parsed.accessories,
      reason: parsed.reason,
    });
  } catch (error) {
    console.error('Gemini recommendation failed:', error);
    sendJson(res, 500, {error: '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요'});
  }
}

export default handleRecommendOutfit;
