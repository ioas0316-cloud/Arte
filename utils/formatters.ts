
import { GameState, Item, CharacterStats, Quest } from '../types';

const translations = {
    ko: {
        stats: '능력치',
        value: '수치',
        strength: '힘',
        agility: '민첩',
        knowledge: '지식',
        wisdom: '지혜',
        vitality: '체력',
        emotion: '감정',
        interest: '관심',
        trust: '신뢰',
        doubt: '의심',
        affection: '애정',
        resentment: '원망',
        noItems: '없음',
        noQuests: '기록된 여정이 없습니다.',
        questStatus: '상태',
        finalRecordTitle: '엘리시아의 최종 기록',
        basicInfo: '기본 정보',
        finalAppellation: '최종 호칭',
        level: '레벨',
        gold: '골드',
        emotionalState: '마음의 상태',
        finalStats: '최종 능력치',
        skills: '획득한 경험의 편린 (스킬)',
        inventory: '소지품',
        sanctuary: '마음의 안식처',
        memories: '기억의 파편들',
        completedJourneys: '완수한 여정들',
    },
    en: {
        stats: 'Stats',
        value: 'Value',
        strength: 'Strength',
        agility: 'Agility',
        knowledge: 'Knowledge',
        wisdom: 'Wisdom',
        vitality: 'Vitality',
        emotion: 'Emotion',
        interest: 'Interest',
        trust: 'Trust',
        doubt: 'Doubt',
        affection: 'Affection',
        resentment: 'Resentment',
        noItems: 'None',
        noQuests: 'No journeys recorded.',
        questStatus: 'Status',
        finalRecordTitle: "Elysia's Final Record",
        basicInfo: 'Basic Information',
        finalAppellation: 'Final Appellation',
        level: 'Level',
        gold: 'Gold',
        emotionalState: 'State of Mind',
        finalStats: 'Final Stats',
        skills: 'Fragments of Experience (Skills)',
        inventory: 'Inventory',
        sanctuary: 'Sanctuary of the Heart',
        memories: 'Memory Fragments',
        completedJourneys: 'Completed Journeys',
    }
};

const formatStats = (stats: CharacterStats['baseStats'], t: typeof translations.ko): string => {
    return `
| ${t.stats}   | ${t.value} |
|----------|------|
| ${t.strength}       | ${stats.strength}  |
| ${t.agility}     | ${stats.agility}   |
| ${t.knowledge}     | ${stats.knowledge}|
| ${t.wisdom}    | ${stats.wisdom}    |
| ${t.vitality}     | ${stats.vitality}  |
    `;
};

const formatEmotionalStats = (stats: CharacterStats['emotionalStats'], t: typeof translations.ko): string => {
    return `
| ${t.emotion}     | ${t.value} |
|----------|------|
| ${t.interest}     | ${stats.interest}    |
| ${t.trust}       | ${stats.trust}       |
| ${t.doubt}       | ${stats.doubt}       |
| ${t.affection}   | ${stats.affection}   |
| ${t.resentment}  | ${stats.resentment}  |
    `;
};

const formatItems = (items: Item[], t: typeof translations.ko): string => {
    if (items.length === 0) return t.noItems;
    return items.map(item => `- **${item.name}** (${item.rarity}): *${item.description}*`).join('\n');
};

const formatQuests = (quests: Quest[], t: typeof translations.ko): string => {
    if (quests.length === 0) return t.noQuests;
    return quests.map(q => `
### ${q.title} (${t.questStatus}: ${q.status})
*${q.description}*
${q.objectives.map(o => `- [${o.isCompleted ? 'x' : ' '}] ${o.description}`).join('\n')}
    `).join('\n---\n');
};

export const formatGameStateToMarkdown = (gameState: GameState, lang: 'ko' | 'en'): string => {
    const t = translations[lang];
    return `
## ${t.finalRecordTitle}

### ${t.basicInfo}
- **${t.finalAppellation}:** ${gameState.appellation}
- **${t.level}:** ${gameState.characterStats.level} (${gameState.characterStats.exp} / ${gameState.characterStats.expToNextLevel} EXP)
- **${t.gold}:** ${gameState.gold} Gold

### ${t.emotionalState}
${formatEmotionalStats(gameState.characterStats.emotionalStats, t)}

### ${t.finalStats}
${formatStats(gameState.characterStats.baseStats, t)}

### ${t.skills}
${gameState.characterStats.skills.length > 0 ? gameState.characterStats.skills.map(s => `- ${s}`).join('\n') : t.noItems}

### ${t.inventory}
${formatItems(gameState.inventory, t)}

### ${t.sanctuary}
${formatItems(gameState.sanctuary, t)}

### ${t.memories}
${gameState.memories.length > 0 ? gameState.memories.map(m => `- ${m}`).join('\n') : t.noItems}

---

## ${t.completedJourneys}
${formatQuests(gameState.quests, t)}
    `;
}
