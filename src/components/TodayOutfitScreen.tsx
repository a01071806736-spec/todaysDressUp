import {AlertCircle, Home, Loader2, RefreshCw, Sun} from 'lucide-react';
import {ClothingStyleOption} from '../data/profileOptions';
import {OutfitRecommendation} from '../services/recommendationApi';
import {WeatherSummary} from '../services/weatherApi';
import {StyleIllustration} from './StyleIllustration';

interface TodayOutfitScreenProps {
  locationLabel: string;
  weather: WeatherSummary;
  selectedStyle: ClothingStyleOption;
  recommendation: OutfitRecommendation | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onGoHome: () => void;
}

export function TodayOutfitScreen({
  locationLabel,
  weather,
  selectedStyle,
  recommendation,
  isLoading,
  error,
  onRetry,
  onGoHome,
}: TodayOutfitScreenProps) {
  const outfitRows = recommendation
    ? [
        {emoji: '🧥', label: '겉옷', value: recommendation.outerwear},
        {emoji: '👕', label: '상의', value: recommendation.top},
        {emoji: '👖', label: '하의', value: recommendation.bottom},
        {emoji: '👟', label: '신발', value: recommendation.shoes},
        {emoji: '🧣', label: '소품', value: recommendation.accessories},
      ]
    : [];

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Compact bright sky header matching Screens 1 & 2 */}
      <header className="w-full border-b border-sky-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-sky-600" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap truncate">
              가을 여행 추천옷
            </span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-sky-700 whitespace-nowrap shrink-0">
            3단계 · 오늘의 옷차림
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            오늘의 옷차림
          </h1>
        </div>

        {/* Top single-line today's weather summary */}
        <section
          aria-label="오늘 날씨 요약"
          className="bg-sky-50/90 border border-sky-200 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4"
        >
          <p className="text-base sm:text-lg font-bold text-sky-950 leading-snug tabular-nums">
            {locationLabel} · {weather.emoji} 지금 {weather.currentTemp}℃ (체감{' '}
            {weather.apparentTemp}℃) · {weather.conditionLabel} / 최저 {weather.minTemp}℃ · 최고{' '}
            {weather.maxTemp}℃ · 비 올 확률 {weather.precipitationProbability}%
          </p>
        </section>

        {/* Main single recommendation card / loading / error */}
        {isLoading ? (
          <section
            role="status"
            aria-live="polite"
            className="bg-white border-2 border-sky-200 rounded-3xl px-6 py-16 shadow-sm flex flex-col items-center justify-center text-center gap-4"
          >
            <Loader2 className="w-11 h-11 text-sky-600 animate-spin" aria-hidden="true" />
            <p className="text-xl sm:text-2xl font-bold text-sky-900">
              AI가 옷을 고르는 중이에요…
            </p>
            <p className="text-base sm:text-lg text-slate-600">
              오늘 날씨와 고르신 스타일에 딱 맞게 정리하고 있어요.
            </p>
          </section>
        ) : error ? (
          <section
            role="alert"
            className="bg-white border-2 border-amber-300 rounded-3xl px-6 py-12 shadow-sm flex flex-col items-center justify-center text-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-amber-600" aria-hidden="true" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-950">{error}</p>
          </section>
        ) : recommendation ? (
          <section
            aria-label="추천 옷차림"
            className="bg-white border-2 border-sky-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6"
          >
            {/* Card Header: Selected style illustration & name */}
            <div className="flex items-center gap-4 pb-5 border-b border-sky-100">
              <StyleIllustration styleId={selectedStyle.id} selected />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-sky-700">고른 스타일</p>
                <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-snug">
                  {selectedStyle.name}
                </h2>
              </div>
            </div>

            {/* 5 item rows: 겉옷, 상의, 하의, 신발, 소품 */}
            <ul className="divide-y divide-sky-100">
              {outfitRows.map((item) => (
                <li
                  key={item.label}
                  className="py-3.5 sm:py-4 flex items-start gap-3.5 sm:gap-4"
                >
                  <span
                    className="text-2xl sm:text-[26px] leading-none pt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </span>
                  <div className="flex-1 min-w-0 sm:flex sm:items-baseline sm:gap-4">
                    <span className="block sm:w-16 shrink-0 text-base sm:text-lg font-bold text-sky-800">
                      {item.label}
                    </span>
                    <span className="block text-lg sm:text-xl font-medium text-slate-900 leading-relaxed mt-0.5 sm:mt-0">
                      {item.value}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* 💡 추천 이유 */}
            <div className="pt-5 border-t border-sky-200/80">
              <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 sm:p-5">
                <p className="text-base sm:text-lg font-bold text-sky-900 mb-1.5">
                  💡 추천 이유
                </p>
                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* Bottom action buttons: '다시 추천받기' and '처음으로' */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onRetry}
            className={`min-h-[62px] px-5 py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 whitespace-nowrap ${
              isLoading
                ? 'bg-sky-200/80 text-sky-700/70 border border-sky-300/70 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
            }`}
          >
            <RefreshCw className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>다시 추천받기</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onGoHome}
            className={`min-h-[62px] px-5 py-4 rounded-2xl border-2 text-xl font-bold flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 whitespace-nowrap ${
              isLoading
                ? 'border-sky-200 bg-sky-50/60 text-sky-400 cursor-not-allowed'
                : 'border-sky-300 bg-white hover:bg-sky-50 active:scale-[0.99] text-sky-800 cursor-pointer'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>처음으로</span>
          </button>
        </div>
      </main>
    </div>
  );
}
