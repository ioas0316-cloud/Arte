
export enum Emotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SHY = 'shy',
  SURPRISED = 'surprised',
  THINKING = 'thinking',
  SAD = 'sad',
  ANGRY = 'angry',
  LOVE = 'love',
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

export enum ItemType {
  EQUIPMENT = 'equipment',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
  QUEST = 'quest',
  ARTIFACT = 'artifact',
}

export enum EquipmentSlot {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
}

export interface BaseStats {
  strength: number;
  agility: number;
  knowledge: number;
  wisdom: number;
  vitality: number;
}

export interface Item {
  id: string; // Unique identifier, e.g., "ancient_sword_of_fire"
  name: string;
  description: string;
  rarity: ItemRarity;
  type: ItemType;
  slot?: EquipmentSlot; // Only for equipment type
  effects?: string[]; // For consumables
  stats?: Partial<BaseStats>; // For equipment
  goldValue: number;
}

export interface EmotionalStats {
  interest: number; // 관심
  trust: number;    // 신뢰
  doubt: number;    // 의심
  affection: number; // 애정
  resentment: number; // 원망
}

export interface CharacterStats {
  level: number;
  exp: number;
  expToNextLevel: number;
  emotionalStats: EmotionalStats;
  baseStats: BaseStats;
  skills: string[];
  equipment: Record<EquipmentSlot, Item | null>;
}

export interface Faction {
  id: string;
  name: string;
  relationship: number; // -100 (Hostile) to 100 (Allied), 0 is Neutral
  description: string;
}

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  dayOccurs: number;
  isCompleted: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  backgroundUrl: string;
  ambianceKey: string;
}

export interface WorldState {
  day: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  factions: Faction[];
  events: WorldEvent[];
  locations: Location[];
  currentLocationId: string;
}

export interface QuestObjective {
  description: string;
  isCompleted: boolean;
}

export interface QuestRewards {
  exp?: number;
  gold?: number;
  items?: Item[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
  rewards?: QuestRewards;
}

export interface GameState {
  storyText: string;
  characterThoughts: string;
  choices: string[];
  emotion: Emotion;
  imagePrompt: string;
  characterStats: CharacterStats;
  memories: string[];
  appellation: string;
  destiny: string | null;
  inventory: Item[];
  gold: number;
  sanctuary: Item[];
  worldState: WorldState;
  quests: Quest[];
}

// --- New Types for Paradise Mode & Settings ---
export type GameMode = 'menu' | 'story' | 'paradise' | 'ending' | 'gallery' | 'recalling';

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-pro';

export interface AppSettings {
    selectedModel: GeminiModel;
    thoughtsOpacity: number;
}

export interface MemoryContext {
    emotion: Emotion;
    emotionalStats: EmotionalStats;
    relatedTopics: string[];
}

export interface PersonalMemory {
    id: string; // timestamp + name
    type: 'text' | 'image';
    name: string;
    content: string; // text content or base64 data URL for images
    createdAt: Date;
    context?: MemoryContext; // The emotional context when the memory was saved
}

export interface Dream {
    id: string; // timestamp
    dreamtAt: Date;
    text: string;
    imageBase64: string | null;
}