/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useRef, useState} from 'react';
import {AboutMeScreen} from './components/AboutMeScreen';
import {TodayOutfitScreen} from './components/TodayOutfitScreen';
import {TodayWeatherScreen} from './components/TodayWeatherScreen';
import {
  AGE_GROUPS,
  CLOTHING_STYLES,
  GENDERS,
  UserProfileDraft,
} from './data/profileOptions';
import {
  OutfitRecommendation,
  fetchOutfitRecommendation,
} from './services/recommendationApi';
import {WeatherSummary} from './services/weatherApi';

export default function App() {
  const [step, setStep] = useState<'about' | 'weather' | 'outfit'>('about');
  const [profile, setProfile] = useState<UserProfileDraft>({
    ageGroup: null,
    gender: null,
    clothingStyle: null,
  });

  const [weatherContext, setWeatherContext] = useState<{
    locationLabel: string;
    weather: WeatherSummary;
  } | null>(null);

  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const selectedAgeLabel = AGE_GROUPS.find((a) => a.id === profile.ageGroup)?.label;
  const selectedGenderLabel = GENDERS.find((g) => g.id === profile.gender)?.label;
  const selectedStyle = CLOTHING_STYLES.find((s) => s.id === profile.clothingStyle);

  const requestRecommendationOnce = async (
    locationLabel: string,
    weather: WeatherSummary,
  ) => {
    if (inFlightRef.current || !selectedAgeLabel || !selectedGenderLabel || !selectedStyle) {
      return;
    }

    inFlightRef.current = true;
    setIsRecommending(true);
    setRecommendError(null);
    setRecommendation(null);

    try {
      const result = await fetchOutfitRecommendation({
        ageGroup: selectedAgeLabel,
        gender: selectedGenderLabel,
        styleName: selectedStyle.name,
        styleDescription: selectedStyle.description,
        weather,
      });
      setRecommendation(result);
    } catch {
      setRecommendError('지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요');
    } finally {
      inFlightRef.current = false;
      setIsRecommending(false);
    }
  };

  if (step === 'outfit' && weatherContext && selectedStyle) {
    return (
      <TodayOutfitScreen
        locationLabel={weatherContext.locationLabel}
        weather={weatherContext.weather}
        selectedStyle={selectedStyle}
        recommendation={recommendation}
        isLoading={isRecommending}
        error={recommendError}
        onRetry={() => {
          void requestRecommendationOnce(weatherContext.locationLabel, weatherContext.weather);
        }}
        onGoHome={() => {
          setStep('about');
          setProfile({ageGroup: null, gender: null, clothingStyle: null});
          setWeatherContext(null);
          setRecommendation(null);
          setRecommendError(null);
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
      />
    );
  }

  if (step === 'weather') {
    return (
      <TodayWeatherScreen
        onBack={() => {
          setStep('about');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onRecommend={(locationLabel, weather) => {
          setWeatherContext({locationLabel, weather});
          setStep('outfit');
          window.scrollTo({top: 0, behavior: 'smooth'});
          void requestRecommendationOnce(locationLabel, weather);
        }}
      />
    );
  }

  return (
    <AboutMeScreen
      profile={profile}
      onProfileChange={setProfile}
      onNext={() => setStep('weather')}
    />
  );
}
