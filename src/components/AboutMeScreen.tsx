import {useRef, useState} from 'react';
import {AlertCircle, ArrowRight, Check, Sun} from 'lucide-react';
import {
  AGE_GROUPS,
  AgeGroupId,
  CLOTHING_STYLES,
  ClothingStyleId,
  GENDERS,
  GenderId,
  UserProfileDraft,
  getMissingPrompt,
} from '../data/profileOptions';
import {StyleIllustration} from './StyleIllustration';

interface AboutMeScreenProps {
  profile?: UserProfileDraft;
  onProfileChange?: (next: UserProfileDraft) => void;
  onNext?: () => void;
}

export function AboutMeScreen({
  profile: controlledProfile,
  onProfileChange,
  onNext,
}: AboutMeScreenProps) {
  const [internalProfile, setInternalProfile] = useState<UserProfileDraft>({
    ageGroup: null,
    gender: null,
    clothingStyle: null,
  });
  const [highlightNotice, setHighlightNotice] = useState(false);

  const profile = controlledProfile ?? internalProfile;
  const updateProfile = (updater: (prev: UserProfileDraft) => UserProfileDraft) => {
    const next = updater(profile);
    if (onProfileChange) {
      onProfileChange(next);
    } else {
      setInternalProfile(next);
    }
  };

  const ageSectionRef = useRef<HTMLElement>(null);
  const genderSectionRef = useRef<HTMLElement>(null);
  const styleSectionRef = useRef<HTMLElement>(null);

  const missingPrompt = getMissingPrompt(profile);
  const isComplete = missingPrompt === null;

  const handleSelectAge = (ageGroup: AgeGroupId) => {
    updateProfile((prev) => ({...prev, ageGroup}));
    setHighlightNotice(false);
  };

  const handleSelectGender = (gender: GenderId) => {
    updateProfile((prev) => ({...prev, gender}));
    setHighlightNotice(false);
  };

  const handleSelectStyle = (clothingStyle: ClothingStyleId) => {
    updateProfile((prev) => ({...prev, clothingStyle}));
    setHighlightNotice(false);
  };

  const handleDisabledTap = () => {
    if (isComplete) return;
    setHighlightNotice(true);
    if (!profile.ageGroup) {
      ageSectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    } else if (!profile.gender) {
      genderSectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    } else if (!profile.clothingStyle) {
      styleSectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

  const handleNext = () => {
    if (!isComplete) return;
    if (onNext) {
      onNext();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Compact bright sky header */}
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
            1단계 · 나에 대해
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page title */}
        <div className="mb-7 sm:mb-9">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            나에 대해
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-slate-600">
            딱 맞는 가을 여행 옷차림을 위해 아래 세 가지를 골라 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left column: Age group & Gender */}
          <div className="lg:col-span-5 space-y-8">
            {/* 1. 연령대 */}
            <section
              ref={ageSectionRef}
              aria-labelledby="age-heading"
              className="bg-white border border-sky-200/90 rounded-3xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <h2 id="age-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  연령대
                </h2>
                <span className="text-sm sm:text-base font-medium text-sky-700 whitespace-nowrap">
                  하나만 선택
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                {AGE_GROUPS.map((option) => {
                  const isSelected = profile.ageGroup === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectAge(option.id)}
                      className={`min-h-[60px] px-3 py-3.5 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-sky-600 text-white border-[2.5px] border-sky-700 shadow-md shadow-sky-600/20'
                          : 'bg-sky-50/40 text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                      }`}
                    >
                      {isSelected && <Check className="w-5 h-5 shrink-0" strokeWidth={3} aria-hidden="true" />}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. 성별 */}
            <section
              ref={genderSectionRef}
              aria-labelledby="gender-heading"
              className="bg-white border border-sky-200/90 rounded-3xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <h2 id="gender-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  성별
                </h2>
                <span className="text-sm sm:text-base font-medium text-sky-700 whitespace-nowrap">
                  하나만 선택
                </span>
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-3">
                {GENDERS.map((option) => {
                  const isSelected = profile.gender === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectGender(option.id)}
                      className={`min-h-[60px] px-2.5 py-3.5 rounded-2xl text-[17px] sm:text-lg font-bold flex items-center justify-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-sky-600 text-white border-[2.5px] border-sky-700 shadow-md shadow-sky-600/20'
                          : 'bg-sky-50/40 text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                      }`}
                    >
                      {isSelected && <Check className="w-5 h-5 shrink-0" strokeWidth={3} aria-hidden="true" />}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right column: Preferred Clothing Style + Bottom Next CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section
              ref={styleSectionRef}
              aria-labelledby="style-heading"
              className="bg-white border border-sky-200/90 rounded-3xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <h2 id="style-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  선호하는 옷 스타일
                </h2>
                <span className="text-sm sm:text-base font-medium text-sky-700 whitespace-nowrap">
                  하나만 선택
                </span>
              </div>

              <div role="radiogroup" aria-labelledby="style-heading" className="space-y-3.5">
                {CLOTHING_STYLES.map((style) => {
                  const isSelected = profile.clothingStyle === style.id;
                  return (
                    <label
                      key={style.id}
                      className={`flex items-center gap-3.5 sm:gap-5 p-4 sm:p-5 rounded-2xl cursor-pointer select-none transition-all duration-150 focus-within:ring-4 focus-within:ring-sky-300 ${
                        isSelected
                          ? 'border-[3px] border-sky-600 bg-sky-50/90 shadow-md shadow-sky-900/10'
                          : 'border-2 border-sky-200/90 bg-white hover:border-sky-400 hover:bg-sky-50/35'
                      }`}
                    >
                      <input
                        type="radio"
                        name="clothingStyle"
                        value={style.id}
                        checked={isSelected}
                        onChange={() => handleSelectStyle(style.id)}
                        className="sr-only"
                      />

                      <StyleIllustration styleId={style.id} selected={isSelected} />

                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                          {style.name}
                        </div>
                        <p className="text-[15px] sm:text-base text-slate-600 mt-1 leading-snug">
                          {style.description}
                        </p>
                      </div>

                      {/* Visible radio circle */}
                      <span
                        aria-hidden="true"
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-sky-600 border-2 border-sky-700'
                            : 'bg-white border-2 border-sky-300'
                        }`}
                      >
                        {isSelected && <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white" />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Missing prompt & Bottom '다음' CTA */}
            <div className="space-y-3 pt-1">
              {missingPrompt ? (
                <div
                  role="status"
                  aria-live="polite"
                  onClick={handleDisabledTap}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border text-base sm:text-lg font-semibold cursor-pointer transition-colors ${
                    highlightNotice
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-sky-100/80 border-sky-300 text-sky-900'
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 shrink-0 ${highlightNotice ? 'text-amber-600' : 'text-sky-700'}`}
                    aria-hidden="true"
                  />
                  <span>{missingPrompt}</span>
                </div>
              ) : (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border bg-sky-50 border-sky-300 text-sky-900 text-base sm:text-lg font-semibold"
                >
                  <Check className="w-5 h-5 shrink-0 text-sky-700" strokeWidth={2.8} aria-hidden="true" />
                  <span>모두 고르셨어요. 아래 다음 버튼을 눌러 주세요.</span>
                </div>
              )}

              <div onClick={!isComplete ? handleDisabledTap : undefined}>
                <button
                  type="button"
                  disabled={!isComplete}
                  onClick={handleNext}
                  className={`w-full min-h-[62px] px-6 py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                    isComplete
                      ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                      : 'bg-sky-200/80 text-sky-700/70 border border-sky-300/70 cursor-not-allowed'
                  }`}
                >
                  <span>다음</span>
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
