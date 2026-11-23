export interface WeatherSummary {
  currentTemp: number;
  apparentTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitationProbability: number;
  conditionLabel: string;
  emoji: string;
}

export async function fetchTodayWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherSummary> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
  });

  const response = await fetch(`/api/weather?${params.toString()}`, {
    method: 'GET',
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = '날씨 정보를 불러오지 못했어요.';
    try {
      const errBody = (await response.json()) as {error?: string};
      if (errBody.error) {
        errorMessage = errBody.error;
      }
    } catch {
      // Ignore non-JSON error body and use fallback message
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as Partial<WeatherSummary>;

  if (
    typeof data.currentTemp !== 'number' ||
    typeof data.apparentTemp !== 'number' ||
    typeof data.minTemp !== 'number' ||
    typeof data.maxTemp !== 'number' ||
    typeof data.precipitationProbability !== 'number' ||
    typeof data.conditionLabel !== 'string' ||
    typeof data.emoji !== 'string'
  ) {
    throw new Error('날씨 데이터가 올바르지 않아요.');
  }

  return {
    currentTemp: data.currentTemp,
    apparentTemp: data.apparentTemp,
    minTemp: data.minTemp,
    maxTemp: data.maxTemp,
    precipitationProbability: data.precipitationProbability,
    conditionLabel: data.conditionLabel,
    emoji: data.emoji,
  };
}
