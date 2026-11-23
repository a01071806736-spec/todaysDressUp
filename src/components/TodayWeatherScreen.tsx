import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Sun,
} from 'lucide-react';
import {
  CITIES,
  CityId,
  SEOUL_GU_LIST,
  SEOUL_POPULAR_DONG_IDS,
  SubRegionOption,
} from '../data/locations';
import {WeatherSummary, fetchTodayWeather} from '../services/weatherApi';

interface TodayWeatherScreenProps {
  onBack: () => void;
  onRecommend: (locationLabel: string, weather: WeatherSummary) => void;
}

interface ActiveLocation {
  label: string;
  lat: number;
  lon: number;
  source: 'gps' | 'manual';
}

type GeoStatus = 'idle' | 'locating' | 'success' | 'failed';

export function TodayWeatherScreen({onBack, onRecommend}: TodayWeatherScreenProps) {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [selectedCityId, setSelectedCityId] = useState<CityId | null>(null);
  const [selectedGu, setSelectedGu] = useState<string>('popular');
  const [dongSearch, setDongSearch] = useState('');
  const [selectedSubRegionId, setSelectedSubRegionId] = useState<string | null>(null);

  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const userSelectedManualRef = useRef(false);
  const weatherCardRef = useRef<HTMLElement>(null);

  const selectedCity = useMemo(
    () => CITIES.find((city) => city.id === selectedCityId) ?? null,
    [selectedCityId],
  );

  const filteredSeoulDongs = useMemo(() => {
    if (selectedCityId !== 'seoul' || !selectedCity) return [];
    const query = dongSearch.trim();
    if (query.length > 0) {
      return selectedCity.subRegions.filter(
        (region) => region.name.includes(query) || (region.gu && region.gu.includes(query)),
      );
    }
    if (selectedGu === 'popular') {
      return selectedCity.subRegions.filter((region) =>
        SEOUL_POPULAR_DONG_IDS.includes(region.id),
      );
    }
    return selectedCity.subRegions.filter((region) => region.gu === selectedGu);
  }, [dongSearch, selectedCity, selectedCityId, selectedGu]);

  const requestCurrentLocation = useCallback((isUserTriggered: boolean) => {
    if (isUserTriggered) {
      userSelectedManualRef.current = false;
      setSelectedCityId(null);
      setSelectedSubRegionId(null);
    }

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('failed');
      return;
    }

    setGeoStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isUserTriggered && userSelectedManualRef.current) {
          return;
        }
        setGeoStatus('success');
        setSelectedCityId(null);
        setSelectedSubRegionId(null);
        setActiveLocation({
          label: '현재 위치',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          source: 'gps',
        });
      },
      () => {
        if (!isUserTriggered && userSelectedManualRef.current) {
          return;
        }
        setGeoStatus('failed');
      },
      {
        enableHighAccuracy: false,
        timeout: 4500,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
    requestCurrentLocation(false);
  }, [requestCurrentLocation]);

  useEffect(() => {
    if (!activeLocation) {
      setWeather(null);
      setWeatherError(null);
      setIsLoadingWeather(false);
      return;
    }

    const controller = new AbortController();
    setIsLoadingWeather(true);
    setWeatherError(null);

    fetchTodayWeather(activeLocation.lat, activeLocation.lon, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setWeather(result);
          setIsLoadingWeather(false);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error && err.message
            ? err.message
            : '날씨 정보를 불러오지 못했어요.';
        setWeatherError(message);
        setWeather(null);
        setIsLoadingWeather(false);
      });

    return () => {
      controller.abort();
    };
  }, [activeLocation]);

  const handleSelectCity = (cityId: CityId) => {
    userSelectedManualRef.current = true;
    setSelectedCityId(cityId);
    setSelectedSubRegionId(null);
    setSelectedGu('popular');
    setDongSearch('');
  };

  const handleSelectSubRegion = (subRegion: SubRegionOption) => {
    if (!selectedCity) return;
    userSelectedManualRef.current = true;
    setSelectedSubRegionId(subRegion.id);
    const fullLabel = subRegion.gu
      ? `${selectedCity.name} ${subRegion.gu} ${subRegion.name}`
      : `${selectedCity.name} ${subRegion.name}`;

    setActiveLocation({
      label: fullLabel,
      lat: subRegion.lat,
      lon: subRegion.lon,
      source: 'manual',
    });

    if (window.innerWidth < 1024) {
      setTimeout(() => {
        weatherCardRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }, 60);
    }
  };

  const handleRetryWeather = () => {
    if (!activeLocation) return;
    setActiveLocation({...activeLocation});
  };

  const locationPromptText =
    geoStatus === 'failed' && !activeLocation
      ? '위치를 찾지 못했어요. 지역을 골라 주세요'
      : '지역을 골라 주세요';

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Compact bright sky header matching Screen 1 */}
      <header className="w-full border-b border-sky-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-sky-600" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap truncate">
              가을 여행 추천옷
            </span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-sky-700 whitespace-nowrap shrink-0">
            2단계 · 오늘 날씨
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page title */}
        <div className="mb-7 sm:mb-9">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            오늘 날씨
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-slate-600">
            어디로 가시는지 고르면 오늘 기온과 비 올 확률을 바로 확인해 드려요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left column: Location selection */}
          <section
            aria-labelledby="location-heading"
            className="lg:col-span-7 bg-white border border-sky-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-sky-600 shrink-0" aria-hidden="true" />
                <h2 id="location-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  위치 선택
                </h2>
              </div>

              <button
                type="button"
                onClick={() => requestCurrentLocation(true)}
                disabled={geoStatus === 'locating'}
                className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-sky-200 bg-sky-50/70 hover:bg-sky-100/80 text-sky-800 text-sm sm:text-base font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                {geoStatus === 'locating' ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{geoStatus === 'locating' ? '위치 찾는 중…' : '내 위치로 찾기'}</span>
              </button>
            </div>

            {/* Prompt message: handles missing/denied geolocation cleanly */}
            <div
              role="status"
              aria-live="polite"
              className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border text-base sm:text-lg font-semibold ${
                geoStatus === 'failed' && !activeLocation
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-sky-50/90 border-sky-200 text-sky-900'
              }`}
            >
              {geoStatus === 'failed' && !activeLocation ? (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
              ) : (
                <MapPin className="w-5 h-5 text-sky-700 shrink-0" aria-hidden="true" />
              )}
              <span>
                {activeLocation
                  ? `선택된 지역: ${activeLocation.label} (다른 지역을 고를 수도 있어요)`
                  : locationPromptText}
              </span>
            </div>

            {/* 8 Cities Grid */}
            <div>
              <p className="text-base font-semibold text-slate-700 mb-3">
                도시를 먼저 골라 주세요
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CITIES.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectCity(city.id)}
                      className={`min-h-[58px] px-3 py-3 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-sky-600 text-white border-[2.5px] border-sky-700 shadow-md shadow-sky-600/20'
                          : 'bg-sky-50/40 text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 shrink-0" strokeWidth={3} aria-hidden="true" />
                      )}
                      <span>{city.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-region Selector: Seoul by 동, others by 군/구 */}
            {selectedCity && (
              <div className="pt-4 border-t border-sky-100 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {selectedCity.name} 세부 지역 ({selectedCity.subUnitLabel})
                  </h3>
                  <span className="text-sm sm:text-base font-medium text-sky-700">
                    {selectedCity.id === 'seoul'
                      ? '동을 골라 주세요'
                      : `${selectedCity.subUnitLabel.replace(' 단위', '')}을 골라 주세요`}
                  </span>
                </div>

                {selectedCity.id === 'seoul' ? (
                  <div className="space-y-4">
                    {/* Dong Search */}
                    <div className="relative">
                      <Search
                        className="w-5 h-5 text-sky-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={dongSearch}
                        onChange={(e) => setDongSearch(e.target.value)}
                        placeholder="동 또는 구 이름으로 찾기 (예: 역삼동, 명동, 잠실)"
                        aria-label="서울 동 이름 검색"
                        className="w-full min-h-[54px] pl-12 pr-4 py-3 rounded-2xl border-2 border-sky-200 bg-sky-50/30 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>

                    {/* Gu filter tabs when search is empty */}
                    {dongSearch.trim().length === 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">
                          자치구별로 보기
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedGu('popular')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                              selectedGu === 'popular'
                                ? 'bg-sky-600 text-white'
                                : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
                            }`}
                          >
                            주요 동
                          </button>
                          {SEOUL_GU_LIST.map((gu) => (
                            <button
                              key={gu}
                              type="button"
                              onClick={() => setSelectedGu(gu)}
                              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                                selectedGu === gu
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
                              }`}
                            >
                              {gu}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dong buttons */}
                    {filteredSeoulDongs.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {filteredSeoulDongs.map((dong) => {
                          const isSelected = selectedSubRegionId === dong.id;
                          return (
                            <button
                              key={dong.id}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => handleSelectSubRegion(dong)}
                              className={`min-h-[58px] px-3 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-sky-600 text-white border-[2.5px] border-sky-700 shadow-sm'
                                  : 'bg-white text-slate-900 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                              }`}
                            >
                              <span className="text-base sm:text-lg font-bold leading-tight">
                                {dong.name}
                              </span>
                              {dong.gu && (selectedGu === 'popular' || dongSearch.trim().length > 0) && (
                                <span
                                  className={`text-xs sm:text-sm mt-0.5 ${
                                    isSelected ? 'text-sky-100' : 'text-slate-500'
                                  }`}
                                >
                                  {dong.gu}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 text-center text-base text-slate-600">
                        검색한 동을 찾지 못했어요. 자치구를 선택해서 골라 보세요.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedCity.subRegions.map((subRegion) => {
                      const isSelected = selectedSubRegionId === subRegion.id;
                      return (
                        <button
                          key={subRegion.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectSubRegion(subRegion)}
                          className={`min-h-[58px] px-3 py-3 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-1.5 text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                            isSelected
                              ? 'bg-sky-600 text-white border-[2.5px] border-sky-700 shadow-sm'
                              : 'bg-white text-slate-900 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                          )}
                          <span>{subRegion.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Right column: Weather Display & Bottom CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section
              ref={weatherCardRef}
              aria-labelledby="weather-heading"
              className="bg-white border-2 border-sky-200 rounded-3xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 id="weather-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  오늘의 날씨
                </h2>
                {activeLocation && (
                  <span className="text-sm sm:text-base font-bold text-sky-700 truncate max-w-[60%]">
                    {activeLocation.label}
                  </span>
                )}
              </div>

              {isLoadingWeather ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-10 px-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col items-center justify-center gap-3 text-center"
                >
                  <Loader2 className="w-9 h-9 text-sky-600 animate-spin" aria-hidden="true" />
                  <p className="text-xl sm:text-2xl font-bold text-sky-900">
                    날씨를 확인하는 중…
                  </p>
                </div>
              ) : weatherError ? (
                <div
                  role="alert"
                  className="py-8 px-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col items-center text-center gap-4"
                >
                  <AlertCircle className="w-8 h-8 text-amber-600" aria-hidden="true" />
                  <p className="text-lg font-bold text-amber-950">{weatherError}</p>
                  <button
                    type="button"
                    onClick={handleRetryWeather}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-base font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    <span>다시 확인하기</span>
                  </button>
                </div>
              ) : weather ? (
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-[#F2F9FF] to-white border-2 border-sky-300 p-5 sm:p-6 space-y-4">
                  <p className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-snug tabular-nums">
                    {weather.emoji} 지금 {weather.currentTemp}℃ (체감 {weather.apparentTemp}℃) ·{' '}
                    {weather.conditionLabel}
                  </p>
                  <div className="border-t border-sky-200/80 pt-3.5">
                    <p className="text-lg sm:text-xl font-bold text-sky-900 leading-relaxed tabular-nums">
                      오늘 최저 {weather.minTemp}℃ · 최고 {weather.maxTemp}℃ · 비 올 확률{' '}
                      {weather.precipitationProbability}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-10 px-5 rounded-2xl bg-sky-50/50 border border-sky-200 text-center">
                  <p className="text-lg sm:text-xl font-semibold text-slate-600 leading-relaxed">
                    왼쪽에서 지역을 고르시면
                    <br />
                    오늘 날씨를 크게 보여드려요.
                  </p>
                </div>
              )}
            </section>

            {/* Bottom action buttons: '이전' and '🤖 옷차림 추천받기' */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="min-h-[62px] px-5 py-4 rounded-2xl border-2 border-sky-300 bg-white hover:bg-sky-50 active:scale-[0.99] text-sky-800 text-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 whitespace-nowrap"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>이전</span>
              </button>

              <button
                type="button"
                disabled={!weather || isLoadingWeather || !activeLocation}
                onClick={() => {
                  if (weather && activeLocation) {
                    onRecommend(activeLocation.label, weather);
                  }
                }}
                className={`min-h-[62px] px-5 py-4 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 whitespace-nowrap ${
                  weather && !isLoadingWeather && activeLocation
                    ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                    : 'bg-sky-200/80 text-sky-700/70 border border-sky-300/70 cursor-not-allowed'
                }`}
              >
                <span>🤖 옷차림 추천받기</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
