
import { GameState } from '../types';

export interface SavedGame {
  gameState: GameState;
  characterImage: string | null;
  history: { user: string; model: string }[];
  userName: string | null;
  savedAt: string;
}

export interface SavedEnding {
  destiny: string;
  finalStory: string;
  finalImage: string;
}

export interface SaveSlotSummary {
  slotId: string;
  gameState?: Pick<GameState, 'worldState' | 'quests'>;
  characterImage: string | null;
  savedAt: string;
  isEmpty: boolean;
}

const SAVE_KEY_PREFIX = 'elysia-save-';
export const AUTOSAVE_SLOT_ID = 'autosave';
export const MANUAL_SLOT_IDS = ['manual-1', 'manual-2', 'manual-3'];

const ENDINGS_KEY = 'elysia-endings';

// --- Game Save/Load ---

export const saveGame = (slotId: string, data: Omit<SavedGame, 'savedAt'>): void => {
  try {
    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    const saveData: SavedGame = { ...data, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(saveData));
  } catch (error)
 {
    console.error(`Error saving game to slot ${slotId}:`, error);
    // The alert will be handled by the component using a localized string.
  }
};

export const loadGame = (slotId: string): SavedGame | null => {
  try {
    const key = `${SAVE_KEY_PREFIX}${slotId}`;
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error(`Error loading game from slot ${slotId}:`, error);
    return null;
  }
};

export const getSaveSlotSummaries = (): SaveSlotSummary[] => {
  const allSlots = [AUTOSAVE_SLOT_ID, ...MANUAL_SLOT_IDS];
  return allSlots.map(slotId => {
    const data = loadGame(slotId);
    if (data) {
      return {
        slotId,
        gameState: { worldState: data.gameState.worldState, quests: data.gameState.quests },
        characterImage: data.characterImage,
        savedAt: data.savedAt,
        isEmpty: false,
      };
    }
    return { slotId, isEmpty: true, characterImage: null, savedAt: '' };
  });
};

export const hasAnyManualSave = (): boolean => {
    return MANUAL_SLOT_IDS.some(slotId => loadGame(slotId) !== null);
}

export const hasAutoSave = (): boolean => {
    return loadGame(AUTOSAVE_SLOT_ID) !== null;
}


// --- Ending Gallery ---

export const getSavedEndings = (): SavedEnding[] => {
  try {
    const savedEndings = localStorage.getItem(ENDINGS_KEY);
    return savedEndings ? JSON.parse(savedEndings) : [];
  } catch (error) {
    console.error("Error getting saved endings:", error);
    return [];
  }
};

export const saveEnding = (newEnding: SavedEnding): boolean => {
  try {
    const existingEndings = getSavedEndings();
    // Avoid duplicates
    if (!existingEndings.some(e => e.destiny === newEnding.destiny)) {
      const updatedEndings = [...existingEndings, newEnding];
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(updatedEndings));
      return true; // Indicates a new ending was saved
    }
    return false; // Indicates the ending already existed
  } catch (error) {
    console.error("Error saving ending:", error);
    return false;
  }
};