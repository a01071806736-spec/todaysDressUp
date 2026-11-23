/**
 * Vercel Serverless Function: GET /api/weather
 *
 * Open-Meteo 날씨 API를 서버 측에서 프록시 호출하여 브라우저 CORS 문제 및
 * 네트워크 차단 오류를 방지합니다.
 * 별도의 외부 API 키가 필요하지 않으며, Vercel Node.js 22+ ESM 환경에서 실행됩니다.
 */
import type {IncomingMessage, ServerResponse} from 'node:http';

export interface WeatherSummary {
  currentTemp: number;
  apparentTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitationProbability: number;
  conditionLabel: string;
  emoji: string;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: (number | null)[];
  };
}

export interface ApiRequest extends IncomingMessage {
  method?: string;
  url?: string;
  query?: Record<string, unknown>;
}

export interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse;
  json?: (body: unknown) => void;
}

function sendJson(res: ApiResponse, statusCode: number, payload: unknown): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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

function mapWeatherCodeToKorean(code: number): {label: string; emoji: string} {
  if (code === 0) return {label: '맑음', emoji: '☀️'};
  if (code === 1) return {label: '대체로 맑음', emoji: '🌤️'};
  if (code === 2) return {label: '구름 조금', emoji: '⛅'};
  if (code === 3) return {label: '흐림', emoji: '☁️'};
  if (code === 45 || code === 48) return {label: '안개', emoji: '🌫️'};
  if (code >= 51 && code <= 57) return {label: '이슬비', emoji: '🌦️'};
  if (code >= 61 && code <= 67) return {label: '비', emoji: '🌧️'};
  if (code >= 71 && code <= 77) return {label: '눈', emoji: '❄️'};
  if (code >= 80 && code <= 82) return {label: '소나기', emoji: '🌧️'};
  if (code === 85 || code === 86) return {label: '눈보라', emoji: '🌨️'};
  if (code >= 95 && code <= 99) return {label: '천둥·번개', emoji: '⛈️'};
  return {label: '구름', emoji: '☁️'};
}

function extractQueryParam(req: ApiRequest, key: string): string | undefined {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === 'string') return fromQuery;
  if (Array.isArray(fromQuery) && typeof fromQuery[0] === 'string') return fromQuery[0];

  if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      return parsedUrl.searchParams.get(key) ?? undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function handleWeather(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, {error: '허용되지 않은 요청 방식입니다.'});
    return;
  }

  const latRaw = extractQueryParam(req, 'lat');
  const lonRaw = extractQueryParam(req, 'lon');

  const lat = latRaw !== undefined ? Number(latRaw) : NaN;
  const lon = lonRaw !== undefined ? Number(lonRaw) : NaN;

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    sendJson(res, 400, {error: '올바른 위치 좌표(lat, lon)를 전달해 주세요.'});
    return;
  }

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Seoul',
    forecast_days: '1',
  });

  try {
    const upstream = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!upstream.ok) {
      sendJson(res, 502, {error: '날씨 정보를 불러오지 못했어요.'});
      return;
    }

    const data = (await upstream.json()) as OpenMeteoResponse;

    const currentTemp = data.current?.temperature_2m;
    const apparentTemp = data.current?.apparent_temperature;
    const weatherCode = data.current?.weather_code ?? 0;
    const maxTemp = data.daily?.temperature_2m_max?.[0];
    const minTemp = data.daily?.temperature_2m_min?.[0];
    const rainProb = data.daily?.precipitation_probability_max?.[0] ?? 0;

    if (
      typeof currentTemp !== 'number' ||
      typeof apparentTemp !== 'number' ||
      typeof maxTemp !== 'number' ||
      typeof minTemp !== 'number'
    ) {
      sendJson(res, 502, {error: '날씨 데이터가 올바르지 않아요.'});
      return;
    }

    const {label, emoji} = mapWeatherCodeToKorean(weatherCode);

    const summary: WeatherSummary = {
      currentTemp: Math.round(currentTemp),
      apparentTemp: Math.round(apparentTemp),
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      precipitationProbability: Math.round(rainProb ?? 0),
      conditionLabel: label,
      emoji,
    };

    sendJson(res, 200, summary);
  } catch (error) {
    console.error('Weather proxy request failed:', error);
    sendJson(res, 502, {error: '날씨 정보를 불러오지 못했어요.'});
  }
}

export default handleWeather;
