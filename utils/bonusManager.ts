
import { GameState } from '../types';
import { SavedEnding } from '../services/storageService';
import { produce } from "https://esm.sh/immer@10.1.1";

// Define which endings are considered high-tier
const TRUE_ENDINGS_KO = [
  '세계수의 심장',
  '세계수의 화신',
];
const GOOD_ENDINGS_KO = [
  '영원한 동반자',
  '별빛의 인도자',
  '세상의 수호자',
];
const TRUE_ENDINGS_EN = [
  'Heart of the World Tree',
  'Avatar of the World Tree',
];
const GOOD_ENDINGS_EN = [
  'Eternal Companion',
  'Starlight Guide',
  'Guardian of the World',
];


interface NewGameBonus {
    trust: number;
    affection: number;
    gold: number;
    message: string | null;
}

export const calculateNewGameBonus = (savedEndings: SavedEnding[], lang: 'ko' | 'en'): NewGameBonus => {
    const bonus: NewGameBonus = {
        trust: 0,
        affection: 0,
        gold: 0,
        message: null,
    };

    const TRUE_ENDINGS = lang === 'ko' ? TRUE_ENDINGS_KO : TRUE_ENDINGS_EN;
    const GOOD_ENDINGS = lang === 'ko' ? GOOD_ENDINGS_KO : GOOD_ENDINGS_EN;

    let highTierEndingCount = 0;

    savedEndings.forEach(ending => {
        if (TRUE_ENDINGS.includes(ending.destiny) || TRUE_ENDINGS_KO.includes(ending.destiny)) {
            bonus.trust += 10;
            bonus.affection += 5;
            bonus.gold += 150;
            highTierEndingCount++;
        } else if (GOOD_ENDINGS.includes(ending.destiny) || GOOD_ENDINGS_KO.includes(ending.destiny)) {
            bonus.trust += 5;
            bonus.gold += 50;
            highTierEndingCount++;
        }
    });

    if (highTierEndingCount > 0) {
        bonus.message = lang === 'ko'
            ? `획득한 ${highTierEndingCount}개의 운명에 따라, 새로운 여정에 작은 축복이 함께합니다.`
            : `Following the ${highTierEndingCount} destinies you have acquired, a small blessing accompanies your new journey.`;
    }

    return bonus;
};

export const applyBonusToGameState = (initialState: GameState, bonus: NewGameBonus, lang: 'ko' | 'en'): GameState => {
    if (!bonus.message) {
        return initialState;
    }

    // Use immer for safe nested state updates
    return produce(initialState, draft => {
        draft.gold += bonus.gold;
        draft.characterStats.emotionalStats.trust += bonus.trust;
        draft.characterStats.emotionalStats.affection += bonus.affection;
        
        const bonusText = lang === 'ko'
            ? `당신과 엘리시아의 이전 여정에서 비롯된 인연의 실이, 이번 만남을 조금 더 따스하게 만들어줍니다. [시작 보너스가 적용되었습니다: 신뢰 +${bonus.trust}, 애정 +${bonus.affection}, 골드 +${bonus.gold}]`
            : `The threads of fate from your previous journeys with Elysia make this new beginning a little warmer. [Starting Bonus Applied: Trust +${bonus.trust}, Affection +${bonus.affection}, Gold +${bonus.gold}]`;

        draft.storyText = `${bonusText}\n\n${draft.storyText}`;
    });
};
