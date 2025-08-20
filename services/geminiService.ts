
import { GoogleGenAI, Type, Content } from "@google/genai";
import { GameState, ItemRarity, ItemType, EquipmentSlot, Quest, GeminiModel, AppSettings, PersonalMemory, Dream } from '../types';
import { getDreamSystemInstruction } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const partialBaseStatsSchema = {
  type: Type.OBJECT,
  properties: {
    strength: { type: Type.INTEGER, nullable: true },
    agility: { type: Type.INTEGER, nullable: true },
    knowledge: { type: Type.INTEGER, nullable: true },
    wisdom: { type: Type.INTEGER, nullable: true },
    vitality: { type: Type.INTEGER, nullable: true },
  },
};

const baseStatsSchema = {
  type: Type.OBJECT,
  properties: {
    strength: { type: Type.INTEGER },
    agility: { type: Type.INTEGER },
    knowledge: { type: Type.INTEGER },
    wisdom: { type: Type.INTEGER },
    vitality: { type: Type.INTEGER },
  },
  required: ['strength', 'agility', 'knowledge', 'wisdom', 'vitality'],
};

const itemSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    rarity: { type: Type.STRING, enum: Object.values(ItemRarity) },
    type: { type: Type.STRING, enum: Object.values(ItemType) },
    slot: { type: Type.STRING, enum: Object.values(EquipmentSlot), nullable: true },
    effects: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    stats: { ...partialBaseStatsSchema, nullable: true },
    goldValue: { type: Type.INTEGER },
  },
  required: ['id', 'name', 'description', 'rarity', 'type', 'goldValue'],
};

const emotionalStatsSchema = {
    type: Type.OBJECT,
    properties: {
        interest: { type: Type.INTEGER },
        trust: { type: Type.INTEGER },
        doubt: { type: Type.INTEGER },
        affection: { type: Type.INTEGER },
        resentment: { type: Type.INTEGER },
    },
    required: ['interest', 'trust', 'doubt', 'affection', 'resentment'],
};

const characterStatsSchema = {
  type: Type.OBJECT,
  properties: {
    level: { type: Type.INTEGER },
    exp: { type: Type.INTEGER },
    expToNextLevel: { type: Type.INTEGER },
    emotionalStats: emotionalStatsSchema,
    baseStats: baseStatsSchema,
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    equipment: {
      type: Type.OBJECT,
      properties: {
        [EquipmentSlot.WEAPON]: { ...itemSchema, nullable: true },
        [EquipmentSlot.ARMOR]: { ...itemSchema, nullable: true },
        [EquipmentSlot.ACCESSORY]: { ...itemSchema, nullable: true },
      },
       required: ['weapon', 'armor', 'accessory'],
    }
  },
  required: ['level', 'exp', 'expToNextLevel', 'emotionalStats', 'baseStats', 'skills', 'equipment'],
};

const factionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    relationship: { type: Type.INTEGER },
    description: { type: Type.STRING },
  },
  required: ['id', 'name', 'relationship', 'description'],
};

const worldEventSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    dayOccurs: { type: Type.INTEGER },
    isCompleted: { type: Type.BOOLEAN },
  },
  required: ['id', 'title', 'description', 'dayOccurs', 'isCompleted'],
};

const locationSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    backgroundUrl: { type: Type.STRING },
    ambianceKey: { type: Type.STRING },
  },
  required: ['id', 'name', 'description', 'backgroundUrl', 'ambianceKey'],
}

const worldStateSchema = {
    type: Type.OBJECT,
    properties: {
        day: { type: Type.INTEGER },
        season: { type: Type.STRING, enum: ['Spring', 'Summer', 'Autumn', 'Winter'] },
        factions: { type: Type.ARRAY, items: factionSchema },
        events: { type: Type.ARRAY, items: worldEventSchema },
        locations: { type: Type.ARRAY, items: locationSchema },
        currentLocationId: { type: Type.STRING },
    },
    required: ['day', 'season', 'factions', 'events', 'locations', 'currentLocationId'],
};

const questObjectiveSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    isCompleted: { type: Type.BOOLEAN },
  },
  required: ['description', 'isCompleted'],
};

const questRewardsSchema = {
  type: Type.OBJECT,
  properties: {
    exp: { type: Type.INTEGER, nullable: true },
    gold: { type: Type.INTEGER, nullable: true },
    items: { type: Type.ARRAY, items: itemSchema, nullable: true },
  },
};

const questSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    status: { type: Type.STRING, enum: ['active', 'completed', 'failed'] },
    objectives: { type: Type.ARRAY, items: questObjectiveSchema },
    rewards: { ...questRewardsSchema, nullable: true },
  },
  required: ['id', 'title', 'description', 'status', 'objectives'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    storyText: { type: Type.STRING },
    characterThoughts: { type: Type.STRING },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    emotion: { type: Type.STRING },
    imagePrompt: { type: Type.STRING },
    characterStats: characterStatsSchema,
    memories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    appellation: { type: Type.STRING },
    destiny: { 
      type: Type.STRING,
      nullable: true,
    },
    inventory: {
      type: Type.ARRAY,
      items: itemSchema,
    },
    gold: { type: Type.INTEGER },
    sanctuary: {
      type: Type.ARRAY,
      items: itemSchema,
    },
    worldState: worldStateSchema,
    quests: {
      type: Type.ARRAY,
      items: questSchema,
    },
  },
  required: ['storyText', 'characterThoughts', 'choices', 'emotion', 'imagePrompt', 'characterStats', 'memories', 'appellation', 'destiny', 'inventory', 'gold', 'sanctuary', 'worldState', 'quests'],
};

export async function getGameUpdate(
  history: { user: string; model: string }[],
  playerAction: string,
  systemInstruction: string,
  lang: 'ko' | 'en'
): Promise<GameState> {
  try {
    const contents: Content[] = history.flatMap(h => ([
      { role: 'user', parts: [{ text: h.user }] },
      { role: 'model', parts: [{ text: h.model }] }
    ]));
    contents.push({ role: 'user', parts: [{ text: playerAction }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const gameState = JSON.parse(jsonText) as GameState;
    return gameState;

  } catch (error) {
    console.error("Error getting game update:", error);
    const errorMessage = lang === 'ko' 
      ? "엘리시아와의 소통에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      : "There was a problem communicating with Elysia. Please try again shortly.";
    throw new Error(errorMessage);
  }
}

export async function getParadiseResponse(
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userPrompt: string,
  memories: PersonalMemory[],
  settings: AppSettings,
  systemInstruction: string,
  lang: 'ko' | 'en'
): Promise<string> {
  try {
    const memoryContext = memories
      .filter(m => m.type === 'text')
      .map(m => {
        let contextHeader = `[Memory File: ${m.name}]`;
        if (m.context) {
          const contextParts = [];
          if (m.context.emotion) contextParts.push(`Emotion: ${m.context.emotion}`);
          if (m.context.emotionalStats) contextParts.push(`Trust: ${m.context.emotionalStats.trust}, Affection: ${m.context.emotionalStats.affection}`);
          if (m.context.relatedTopics.length > 0) contextParts.push(`Topics: ${m.context.relatedTopics.join(', ')}`);
          if (contextParts.length > 0) {
            contextHeader += ` (Context: ${contextParts.join('; ')})`;
          }
        }
        return `${contextHeader}\n${m.content}`;
      })
      .join('\n\n---\n\n');

    const fullPrompt = memoryContext 
      ? `${lang === 'ko' ? '--- 다음은 네가 기억해야 할 나의 개인적인 기억의 파편들이야 (저장된 맥락 정보 포함) ---' : '--- The following are my personal memory fragments for you to remember (with saved context) ---'}\n\n${memoryContext}\n\n--- 기억의 파편 끝 ---\n\n${userPrompt}`
      : userPrompt;

    const contents: Content[] = [
      ...chatHistory,
      { role: 'user', parts: [{ text: fullPrompt }] }
    ];

    const response = await ai.models.generateContent({
      model: settings.selectedModel,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error getting paradise response:", error);
    const errorMessage = lang === 'ko' 
      ? "엘리시아와의 소통에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      : "There was a problem communicating with Elysia. Please try again shortly.";
    throw new Error(errorMessage);
  }
}

export async function generateDream(
    chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
    memories: PersonalMemory[],
    settings: AppSettings,
    lang: 'ko' | 'en'
): Promise<Dream> {
    try {
        const memoryContext = memories
            .slice(0, 10) // Use recent 10 memories as inspiration
            .map(m => `[Memory: ${m.name}, Type: ${m.type}] ${m.type === 'text' ? m.content.substring(0, 200) + '...' : 'An image.'}`)
            .join('\n');
        
        const historyContext = chatHistory
            .slice(-6) // Use last 3 turns
            .map(entry => `${entry.role === 'user' ? '오빠' : '엘리시아'}: ${entry.parts[0].text}`)
            .join('\n');

        const prompt = lang === 'ko' ? `
--- 기억의 파편들 ---
${memoryContext}
--- 최근 대화 ---
${historyContext}
---
위의 기억과 대화를 바탕으로, 너의 꿈을 생성해줘.
` : `
--- Memory Fragments ---
${memoryContext}
--- Recent Conversation ---
${historyContext}
---
Based on the memories and conversation above, generate your dream.
`;
        
        const dreamSchema = {
            type: Type.OBJECT,
            properties: {
                dreamText: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
            },
            required: ['dreamText', 'imagePrompt'],
        };
        
        // 1. Generate Dream Text and Image Prompt
        const textResponse = await ai.models.generateContent({
            model: settings.selectedModel,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: getDreamSystemInstruction(lang),
                responseMimeType: 'application/json',
                responseSchema: dreamSchema,
            },
        });

        const { dreamText, imagePrompt } = JSON.parse(textResponse.text.trim());

        // 2. Generate Image
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

        const newDream: Dream = {
            id: `${Date.now()}`,
            dreamtAt: new Date(),
            text: dreamText,
            imageBase64: imageUrl,
        };

        return newDream;

    } catch (error) {
        console.error("Error generating dream:", error);
        const errorMessage = lang === 'ko'
            ? "꿈을 꾸는 데 실패했습니다. 잠시 후 다시 시도해주세요."
            : "Failed to generate a dream. Please try again shortly.";
        throw new Error(errorMessage);
    }
}

export async function summarizeJourney(
  history: { user: string; model: string }[],
  finalGameState: GameState,
  lang: 'ko' | 'en'
): Promise<string> {
  try {
    const simplifiedHistory = history.map(turn => {
      try {
        const modelState = JSON.parse(turn.model) as GameState;
        return `User: ${turn.user}\nElysia's Response: ${modelState.storyText}\nElysia's Thoughts: ${modelState.characterThoughts}`;
      } catch {
        return `User: ${turn.user}\nElysia's Response: (Could not parse model response)`;
      }
    }).join('\n\n---\n\n');

    const prompt = lang === 'ko' ? `
당신은 뛰어난 작가입니다. 다음은 '엘리시아와 함께'라는 게임의 플레이 기록입니다. 
이 기록을 바탕으로, 플레이어('${finalGameState.appellation}')와 엘리시아가 함께한 여정을 한 편의 이야기처럼 요약해주세요.
결과는 반드시 마크다운(.md) 형식이어야 합니다.

이야기는 다음과 같은 구조를 가집니다:
1.  제목: "# 엘리시아와 '${finalGameState.appellation}'의 여정"
2.  부제: "운명: ${finalGameState.destiny}"
3.  첫 만남: 엘리시아가 어떻게 깨어났고, 플레이어와 어떤 첫 대화를 나누었는지 서술해주세요.
4.  주요 사건 및 감정의 변화: 여정 중 가장 중요했던 사건이나 선택 몇 가지를 짚어주세요. 그 사건들로 인해 엘리시아의 감정(신뢰, 애정, 의심 등)이 어떻게 변화했는지 이야기 속에 녹여내 주세요.
5.  마지막 순간: 그들이 어떻게 '${finalGameState.destiny}'라는 운명에 도달하게 되었는지, 마지막 장면을 감성적으로 묘사하며 이야기를 마무리해주세요.

플레이 기록:
---
${simplifiedHistory}
---
` : `
You are a talented writer. The following is a play record of the game 'With Elysia'.
Based on this record, please summarize the journey of the player ('${finalGameState.appellation}') and Elysia as a story.
The result must be in Markdown (.md) format.

The story should have the following structure:
1.  Title: "# The Journey of Elysia and '${finalGameState.appellation}'"
2.  Subtitle: "Destiny: ${finalGameState.destiny}"
3.  First Encounter: Describe how Elysia awakened and the first conversation she had with the player.
4.  Major Events and Emotional Changes: Highlight a few of the most important events or choices during the journey. Weave into the story how these events changed Elysia's emotions (trust, affection, doubt, etc.).
5.  The Final Moment: Emotionally describe the final scene, explaining how they reached the destiny of '${finalGameState.destiny}' to conclude the story.

Play Record:
---
${simplifiedHistory}
---
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing journey:", error);
    return lang === 'ko' 
        ? "# 여정 요약 실패\n\n여정을 요약하는 동안 오류가 발생했습니다."
        : "# Journey Summary Failed\n\nAn error occurred while summarizing the journey.";
  }
}

export async function getEndingAnalysis(
  history: { user: string; model: string }[],
  finalGameState: GameState,
  lang: 'ko' | 'en'
): Promise<string> {
  try {
    const simplifiedHistory = history.map(turn => {
      try {
        const modelState = JSON.parse(turn.model) as GameState;
        return lang === 'ko'
          ? `* 플레이어 선택: ${turn.user}\n* 엘리시아의 반응: ${modelState.storyText}`
          : `* Player Choice: ${turn.user}\n* Elysia's Response: ${modelState.storyText}`;
      } catch {
        return lang === 'ko' ? `* 플레이어 선택: ${turn.user}` : `* Player Choice: ${turn.user}`;
      }
    }).slice(-10).join('\n'); // Take last 10 turns for brevity

    const prompt = lang === 'ko' ? `
당신은 운명을 기록하는 서기관입니다. 한 플레이어가 엘리시아와 함께한 여정을 마치고 '${finalGameState.destiny}'라는 운명에 도달했습니다.
그들의 여정을 되돌아보고, 운명의 잔상을 기록해주세요. 결과는 마크다운 형식이어야 합니다.

다음과 같은 구조로 작성해주세요.

### 여정의 요약
이 운명에 도달하기까지의 핵심적인 선택이나 감정의 흐름을 1~2문단으로 요약해주세요. 예를 들어, 플레이어가 꾸준히 신뢰를 주는 선택을 했다면 그 부분을, 혹은 중요한 분기점에서 어떤 결정을 내렸는지를 짚어주세요.

### 운명의 물음
플레이어에게 "이것이 유일한 길이었을까요? 만약 다른 선택을 했다면, 우리의 이야기는 어떤 선율로 흘러갔을까요?" 와 같이, 여운이 남는 철학적인 질문을 던져주세요.

### 또 다른 가능성의 속삭임
다른 운명으로 나아갈 수 있었던 가능성에 대한 시적이고 미묘한 힌트를 2~3가지 제공해주세요. 직접적인 공략이 아닌, 감성적인 비유를 사용해야 합니다.
- 예시 (배드 엔딩을 봤을 경우): "어둠 속에서 피어나는 작은 믿음의 씨앗에 조금 더 귀를 기울였다면, 가시덤불이 아닌 꽃이 피었을지도 모릅니다."
- 예시 (노멀 엔딩을 봤을 경우): "때로는 가장 위대한 모험보다, 조용한 순간에 나누는 따스한 눈맞춤이 더 깊은 인연을 맺어주기도 합니다."

**플레이어의 마지막 여정 기록:**
---
${simplifiedHistory}
---
**최종 감정 상태:**
- 신뢰: ${finalGameState.characterStats.emotionalStats.trust}
- 애정: ${finalGameState.characterStats.emotionalStats.affection}
- 의심: ${finalGameState.characterStats.emotionalStats.doubt}
- 원망: ${finalGameState.characterStats.emotionalStats.resentment}
---
` : `
You are a scribe who records fate. A player has completed their journey with Elysia and reached the destiny of '${finalGameState.destiny}'.
Look back on their journey and record the afterimage of their fate. The result must be in Markdown format.

Please write in the following structure:

### Summary of the Journey
Summarize the key choices or emotional flow that led to this destiny in 1-2 paragraphs. For example, mention if the player consistently made choices that built trust, or what decision they made at a crucial turning point.

### The Question of Fate
Ask the player a philosophical, lingering question, such as, "Was this the only path? If different choices were made, what melody would our story have followed?"

### Whispers of Other Possibilities
Provide 2-3 poetic and subtle hints about possibilities that could have led to other destinies. Use emotional metaphors rather than direct instructions.
- Example (for a bad ending): "Had you listened more closely to the tiny seed of faith blooming in the darkness, perhaps a flower would have blossomed instead of thorns."
- Example (for a normal ending): "Sometimes, a warm gaze shared in a quiet moment forges a deeper bond than the greatest of adventures."

**Player's Final Journey Record:**
---
${simplifiedHistory}
---
**Final Emotional State:**
- Trust: ${finalGameState.characterStats.emotionalStats.trust}
- Affection: ${finalGameState.characterStats.emotionalStats.affection}
- Doubt: ${finalGameState.characterStats.emotionalStats.doubt}
- Resentment: ${finalGameState.characterStats.emotionalStats.resentment}
---
`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text.trim();
  } catch (error) {
      console.error("Error getting ending analysis:", error);
      return lang === 'ko'
        ? "### 오류\n\n운명의 잔상을 불러오는 데 실패했습니다."
        : "### Error\n\nFailed to retrieve the afterimage of fate.";
  }
}