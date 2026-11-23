export type AgeGroupId = '20s' | '30s' | '40s' | '50s' | '60s' | '70plus';
export type GenderId = 'female' | 'male' | 'none';
export type ClothingStyleId = 'casual' | 'neat' | 'active' | 'classic';

export interface SelectionOption<T extends string> {
  id: T;
  label: string;
}

export interface ClothingStyleOption {
  id: ClothingStyleId;
  name: string;
  description: string;
}

export const AGE_GROUPS: SelectionOption<AgeGroupId>[] = [
  {id: '20s', label: '20대'},
  {id: '30s', label: '30대'},
  {id: '40s', label: '40대'},
  {id: '50s', label: '50대'},
  {id: '60s', label: '60대'},
  {id: '70plus', label: '70대 이상'},
];

export const GENDERS: SelectionOption<GenderId>[] = [
  {id: 'female', label: '여성'},
  {id: 'male', label: '남성'},
  {id: 'none', label: '선택 안 함'},
];

export const CLOTHING_STYLES: ClothingStyleOption[] = [
  {
    id: 'casual',
    name: '편안한 캐주얼',
    description: '동네 산책·장보기, 편하고 무난하게',
  },
  {
    id: 'neat',
    name: '단정한 외출복',
    description: '모임·병원·관공서, 깔끔하게',
  },
  {
    id: 'active',
    name: '활동적인 운동복',
    description: '걷기·등산·운동, 가볍고 따뜻하게',
  },
  {
    id: 'classic',
    name: '차분한 클래식',
    description: '격식 있는 자리, 고급스럽게',
  },
];

export interface UserProfileDraft {
  ageGroup: AgeGroupId | null;
  gender: GenderId | null;
  clothingStyle: ClothingStyleId | null;
}

export function getMissingPrompt(profile: UserProfileDraft): string | null {
  const missing: {label: string; hasBatchim: boolean}[] = [];

  if (!profile.ageGroup) {
    missing.push({label: '연령대', hasBatchim: false});
  }
  if (!profile.gender) {
    missing.push({label: '성별', hasBatchim: true});
  }
  if (!profile.clothingStyle) {
    missing.push({label: '선호하는 옷 스타일', hasBatchim: true});
  }

  if (missing.length === 0) {
    return null;
  }

  const last = missing[missing.length - 1];
  const particle = last.hasBatchim ? '을' : '를';
  const joined = missing.map((item) => item.label).join(', ');
  return `${joined}${particle} 골라 주세요`;
}
