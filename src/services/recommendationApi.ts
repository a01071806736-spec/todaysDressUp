import type {WeatherSummary} from './weatherApi';

export interface OutfitRecommendation {
  outerwear: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  reason: string;
}

export interface RecommendOutfitInput {
  ageGroup: string;
  gender: string;
  styleName: string;
  styleDescription: string;
  weather: WeatherSummary;
}

export async function fetchOutfitRecommendation(
  input: RecommendOutfitInput,
): Promise<OutfitRecommendation> {
  const response = await fetch('/api/recommend-outfit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let errorMessage = '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요';
    try {
      const errBody = (await response.json()) as {error?: string};
      if (errBody.error) {
        errorMessage = errBody.error;
      }
    } catch {
      // Ignore non-JSON error body
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as Partial<OutfitRecommendation>;
  if (
    !data.outerwear ||
    !data.top ||
    !data.bottom ||
    !data.shoes ||
    !data.accessories ||
    !data.reason
  ) {
    throw new Error('지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요');
  }

  return {
    outerwear: data.outerwear,
    top: data.top,
    bottom: data.bottom,
    shoes: data.shoes,
    accessories: data.accessories,
    reason: data.reason,
  };
}
