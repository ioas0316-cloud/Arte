
import React, { useState, useCallback, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import { GameState, Emotion, Quest, GameMode, AppSettings, PersonalMemory, GeminiModel, MemoryContext, Dream } from './types';
import { getInitialState, getSystemInstruction, BLUEPRINT_ENDINGS, getParadiseSystemInstruction } from './constants';
import { getGameUpdate, summarizeJourney, getEndingAnalysis, getParadiseResponse, generateDream } from './services/geminiService';
import { audioService } from './services/audioService';
import * as storage from './services/storageService';
import * as db from './services/dbService';
import { readFileAsText, readFileAsDataURL } from './utils/fileUtils';
import { formatGameStateToMarkdown } from './utils/formatters';
import { calculateNewGameBonus, applyBonusToGameState } from './utils/bonusManager';
import CharacterDisplay from './components/CharacterDisplay';
import StoryPanel from './components/StoryPanel';
import LoadingSpinner from './components/LoadingSpinner';
import StatsAndSkills from './components/CharacterStats';
import CharacterThoughts from './components/CharacterThoughts';
import MemoryJournal from './components/MemoryJournal';
import DestinyDisplay from './components/DestinyDisplay';
import NameInputModal from './components/NameInputModal';
import GameMenu from './components/GameMenu';
import EndingGallery from './components/EndingGallery';
import MainMenu from './components/MainMenu';
import Inventory from './components/Inventory';
import InfoDock from './components/InfoDock';
import Sanctuary from './components/Sanctuary';
import SuggestionChips from './components/SuggestionChips';
import ChatInput from './components/ChatInput';
import WorldInfo from './components/WorldInfo';
import Tooltip from './components/Tooltip';
import InfoPanelModal from './components/InfoPanelModal';
import QuestLog from './components/QuestLog';
import DynamicBackground from './components/DynamicBackground';
import WorldMap from './components/WorldMap';
import SaveLoadModal from './components/SaveLoadModal';
import { elysiaImageBase64 } from './elysiaImage';
import { useLanguage } from './localization';
import ParadiseHub from './components/ParadiseHub';
import SettingsModal from './components/SettingsModal';
import MemoryViewerModal from './components/MemoryViewerModal';

const ELYSIA_BASE_IMAGE = elysiaImageBase64;

export type PanelSizeMode = 'default' | 'expanded';
type NameModalMode = 'initial' | 'edit';

interface ChatLogEntry {
  author: 'user' | 'elysia';
  content: string;
}

const emotionThemes = {
  [Emotion.NEUTRAL]: { overlay: 'rgba(17, 24, 39, 0.5)', accent: '#a78bfa' }, // Lilac
  [Emotion.HAPPY]: { overlay: 'rgba(76, 29, 149, 0.4)', accent: '#fde047' }, // Starlight Yellow
  [Emotion.LOVE]: { overlay: 'rgba(134, 25, 143, 0.4)', accent: '#f472b6' }, // Cosmic Pink
  [Emotion.SHY]: { overlay: 'rgba(157, 51, 118, 0.5)', accent: '#fb7185' }, // Soft Pink
  [Emotion.SAD]: { overlay: 'rgba(30, 58, 138, 0.5)', accent: '#93c5fd' }, // Nebula Blue
  [Emotion.ANGRY]: { overlay: 'rgba(153, 27, 27, 0.5)', accent: '#ef4444' }, // Red Giant
  [Emotion.SURPRISED]: { overlay: 'rgba(6, 78, 59, 0.5)', accent: '#34d399' }, // Aurora Green
  [Emotion.THINKING]: { overlay: 'rgba(15, 23, 42, 0.6)', accent: '#818cf8' }, // Indigo
};

interface QuestTrackerProps {
  quests: Quest[];
}

const QuestTracker: React.FC<QuestTrackerProps> = ({ quests }) => {
  const { t } = useLanguage();
  const activeQuest = quests.find(q => q.status === 'active');

  if (!activeQuest) return null;

  return (
    <div className="fixed top-4 right-4 z-30 w-full max-w-xs p-4 bg-slate-900/95 rounded-xl border border-[var(--border-color)] shadow-2xl animate-fade-in-down">
      <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <span>{t('questTrackerTitle')}</span>
      </h3>
      <h4 className="text-lg font-bold text-purple-200 mb-3 truncate" title={activeQuest.title}>{activeQuest.title}</h4>
      <ul className="space-y-2">
        {activeQuest.objectives.map((obj, index) => (
          <li key={index} className={`flex items-start gap-3 text-slate-300 transition-colors duration-300 ${obj.isCompleted ? 'line-through text-slate-500' : ''}`}>
            <div className={`mt-1 w-4 h-4 flex-shrink-0 rounded-sm flex items-center justify-center border-2 ${obj.isCompleted ? 'bg-purple-500 border-purple-400' : 'border-slate-500'}`}>
              {obj.isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm">{obj.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const { lang, t } = useLanguage();
  // Story Mode State
  const [gameState, setGameState] = useState<GameState>(() => getInitialState(lang));
  const [history, setHistory] = useState<{ user: string; model: string }[]>([]);
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([{ author: 'elysia', content: getInitialState(lang).storyText }]);
  const [userInput, setUserInput] = useState('');

  // Paradise Mode State
  const [paradiseChatLog, setParadiseChatLog] = useState<ChatLogEntry[]>([]);
  const [personalMemories, setPersonalMemories] = useState<PersonalMemory[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);

  // Global App State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [settings, setSettings] = useState<AppSettings>({ selectedModel: 'gemini-2.5-flash', thoughtsOpacity: 0.8 });

  // UI and Modal State
  const [characterImage, setCharacterImage] = useState<string | null>(ELYSIA_BASE_IMAGE);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameModalMode, setNameModalMode] = useState<NameModalMode>('initial');
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState({ content: '', isLoading: false });
  const [endingAnalysis, setEndingAnalysis] = useState({ content: '', isLoading: false });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [savedEndings, setSavedEndings] = useState<storage.SavedEnding[]>([]);
  const [recalledEnding, setRecalledEnding] = useState<storage.SavedEnding | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [newGameBonusInfo, setNewGameBonusInfo] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isSuggestionsPanelVisible, setIsSuggestionsPanelVisible] = useState(false);
  const [isThoughtsOverlayVisible, setIsThoughtsOverlayVisible] = useState(true);
  const [isQuestTrackerVisible, setIsQuestTrackerVisible] = useState(false);
  const [characterPanelSize, setCharacterPanelSize] = useState<PanelSizeMode>('default');
  const [isSaveLoadModalVisible, setIsSaveLoadModalVisible] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [viewingMemory, setViewingMemory] = useState<PersonalMemory | null>(null);
  const [isFastForward, setIsFastForward] = useState(false);
  const [isParadiseUnlocked, setIsParadiseUnlocked] = useState(false);

  // Language Change Effect
  useEffect(() => {
    // Only reset story state if in story mode
    if (gameMode === 'story' && !userName) { // Do not reset if a game is in progress
        setGameState(getInitialState(lang));
        setChatLog([{ author: 'elysia', content: getInitialState(lang).storyText }]);
    }
  }, [lang, gameMode, userName]);

  // Initial Load Effect
  useEffect(() => {
    if (!hasLoaded) {
      const endings = storage.getSavedEndings();
      setSavedEndings(endings);
      
      const isUnlocked = endings.some(e => BLUEPRINT_ENDINGS.includes(e.destiny));
      setIsParadiseUnlocked(isUnlocked);

      const bonus = calculateNewGameBonus(endings, lang);
      if (bonus.message) {
        setNewGameBonusInfo(bonus.message);
      }

      db.getMemories().then(mems => setPersonalMemories(mems.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())));
      db.getDreams().then(drms => setDreams(drms.sort((a,b) => b.dreamtAt.getTime() - a.dreamtAt.getTime())));


      setHasLoaded(true);
    }
  }, [hasLoaded, lang]);

  // --- Audio Hooks ---
  useEffect(() => {
    if (gameMode === 'menu') audioService.playBgm('menu');
    else if (gameMode === 'story') audioService.playBgm(gameState.emotion);
    else if (gameMode === 'ending' || gameMode === 'recalling') audioService.playBgm('ending');
    else if (gameMode === 'paradise') audioService.playBgm('menu'); // Paradise uses menu theme for now
    else audioService.stopBgm();
  }, [gameState.emotion, gameMode]);
  
  useEffect(() => {
    if (gameMode === 'story') {
      const currentLocation = gameState.worldState.locations.find(l => l.id === gameState.worldState.currentLocationId);
      if (currentLocation && currentLocation.ambianceKey) {
        audioService.playAmbiance(currentLocation.ambianceKey);
      } else {
        audioService.stopAmbiance();
      }
    } else {
      audioService.stopAmbiance();
    }
  }, [gameState.worldState.currentLocationId, gameState.worldState.locations, gameMode]);

  // Theme management effect
  useEffect(() => {
    const theme = emotionThemes[gameState.emotion] || emotionThemes.neutral;
    const root = document.documentElement;
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--accent-color-glow', `${theme.accent}60`);
  }, [gameState.emotion]);

  // Destiny/Ending handler
  useEffect(() => {
    const handleEnding = async (endingState: GameState, endingImage: string) => {
        const newEnding: storage.SavedEnding = {
            destiny: endingState.destiny!,
            finalStory: endingState.storyText,
            finalImage: endingImage,
        };
        const isNewEnding = storage.saveEnding(newEnding);
        if (isNewEnding) {
            const updatedEndings = [...savedEndings, newEnding];
            setSavedEndings(updatedEndings);
            if (BLUEPRINT_ENDINGS.includes(newEnding.destiny)) {
              setIsParadiseUnlocked(true);
            }
            const bonus = calculateNewGameBonus(updatedEndings, lang);
            if (bonus.message) setNewGameBonusInfo(bonus.message);
        }
        
        setEndingAnalysis({ content: '', isLoading: true });
        try {
            const analysis = await getEndingAnalysis(history, endingState, lang);
            setEndingAnalysis({ content: analysis, isLoading: false });
        } catch(e) {
            console.error("Failed to generate ending analysis", e);
            setEndingAnalysis({ content: t('endingAnalysisFailed'), isLoading: false });
        }

        if (BLUEPRINT_ENDINGS.includes(endingState.destiny!)) {
            setBlueprint({ content: '', isLoading: true });
            try {
                const journeySummary = await summarizeJourney(history, endingState, lang);
                const statsSummary = formatGameStateToMarkdown(endingState, lang);
                const fullBlueprint = `${journeySummary}\n\n---\n\n${statsSummary}`;
                setBlueprint({ content: fullBlueprint, isLoading: false });
            } catch (e) {
                console.error("Failed to generate blueprint", e);
                setBlueprint({ content: `# ${t('error')}\n\n${t('blueprintGenerationFailed')}`, isLoading: false });
            }
        }
        setGameMode('ending');
    };

    if (gameState.destiny && characterImage && gameMode === 'story') {
        handleEnding(gameState, characterImage);
    }
  }, [gameState, characterImage, gameMode, history, savedEndings, lang, t]);
  
  const autoSaveGame = useCallback((newState: GameState, newImage: string | null, newHistory: typeof history, newUserName: string | null) => {
    if (newUserName) {
      storage.saveGame(storage.AUTOSAVE_SLOT_ID, {
        gameState: newState,
        characterImage: newImage,
        history: newHistory,
        userName: newUserName
      });
    }
  }, []);

  const handleInitialNameSubmit = async (name: string) => {
    if (!pendingChoice) return;
    setUserName(name);
    setIsNameModalOpen(false);
    
    const currentInput = pendingChoice;
    setUserInput(currentInput); // Keep the text
    setChatLog(prev => [...prev, { author: 'user', content: currentInput }]);
    setIsLoading(true);
    setError(null);
    
    try {
      const playerInput = lang === 'ko' ? `내 이름은 ${name}이야. 이제 너와 이야기를 시작할게. 나의 첫 마디는 이것이야: "${currentInput}"` : `My name is ${name}. I will now begin our conversation. My first words are: "${currentInput}"`;
      const newGameState = await getGameUpdate([], playerInput, getSystemInstruction(lang), lang);
      const newHistory = [{ user: playerInput, model: JSON.stringify(newGameState) }];
      setGameState(newGameState);
      setHistory(newHistory);
      setChatLog(prev => [...prev, { author: 'elysia', content: newGameState.storyText }]);
      autoSaveGame(newGameState, ELYSIA_BASE_IMAGE, newHistory, name);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setChatLog(prev => prev.slice(0, -1)); // Revert user message on error
    } finally {
      setIsLoading(false);
      setPendingChoice(null);
      setUserInput(''); // Clear input after success
    }
  };
  
  const handleNameChange = async (newName: string) => {
      setUserName(newName);
      setIsNameModalOpen(false);
      const message = lang === 'ko' ? `(이제부터 내 이름을 '${newName}'(으)로 불러줘.)` : `(From now on, please call me '${newName}'.)`;
      setUserInput(message);
      setChatLog(prev => [...prev, { author: 'user', content: message }]);
      setIsLoading(true);
      setError(null);

      try {
          const playerInput = lang === 'ko' ? `플레이어의 이름이 방금 '${newName}'(으)로 변경되었습니다. 이제부터 그를 이 이름으로 불러주세요. 이 사실을 자연스럽게 다음 대화에 반영해주세요.` : `The player's name has just been changed to '${newName}'. Please call them by this name from now on. Naturally reflect this fact in the next conversation.`;
          const newGameState = await getGameUpdate(history, playerInput, getSystemInstruction(lang), lang);
          const newHistory = [...history, { user: playerInput, model: JSON.stringify(newGameState) }];
          setGameState(newGameState);
          setHistory(newHistory);
          setChatLog(prev => [...prev, { author: 'elysia', content: newGameState.storyText }]);
          autoSaveGame(newGameState, characterImage, newHistory, newName);
          setUserInput('');
      } catch (e) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred.');
          setChatLog(prev => prev.slice(0, -1)); // Revert on error
      } finally {
          setIsLoading(false);
      }
  }

  const handleAction = useCallback(async (choice: string) => {
    if (!userName) {
      setPendingChoice(choice);
      setNameModalMode('initial');
      setIsNameModalOpen(true);
      return;
    }

    audioService.playSfx('click');
    setIsSuggestionsPanelVisible(false);
    setUserInput(choice); // Keep user text
    setChatLog(prev => [...prev, { author: 'user', content: choice }]);
    setIsLoading(true);
    setError(null);
    try {
      const playerInput = choice;
      const newGameState = await getGameUpdate(history, playerInput, getSystemInstruction(lang), lang);
      const newHistory = [...history, { user: playerInput, model: JSON.stringify(newGameState) }];
      setGameState(newGameState);
      setHistory(newHistory);
      setChatLog(prev => [...prev, { author: 'elysia', content: newGameState.storyText }]);
      audioService.playSfx('message');
      autoSaveGame(newGameState, characterImage, newHistory, userName);
      setUserInput(''); // Clear on success
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setChatLog(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [history, userName, characterImage, autoSaveGame, lang]);
  
  // --- Paradise Mode Logic ---
  const handleParadiseMessage = useCallback(async (message: string) => {
    setUserInput(message);
    setParadiseChatLog(prev => [...prev, { author: 'user', content: message }]);
    setIsLoading(true);
    setError(null);

    const paradiseHistory = paradiseChatLog.map(entry => ({
        role: entry.author === 'user' ? 'user' : 'model',
        parts: [{ text: entry.content }]
    }) as { role: 'user' | 'model'; parts: { text: string }[] });

    try {
        const responseText = await getParadiseResponse(
            paradiseHistory,
            message,
            personalMemories,
            settings,
            getParadiseSystemInstruction(lang),
            lang
        );
        setParadiseChatLog(prev => [...prev, { author: 'elysia', content: responseText }]);
        audioService.playSfx('message');
        setUserInput('');
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        setParadiseChatLog(prev => prev.slice(0, -1));
    } finally {
        setIsLoading(false);
    }
  }, [paradiseChatLog, personalMemories, settings, lang]);

  const handleAddMemory = async (file: File) => {
    try {
        const isText = file.type === 'text/plain' || file.type === 'text/markdown';
        const isImage = file.type.startsWith('image/');

        if (!isText && !isImage) {
            alert(t('unsupportedFileType'));
            return;
        }

        const content = isText ? await readFileAsText(file) : await readFileAsDataURL(file);
        
        const lastGameState = history.length > 0 ? JSON.parse(history[history.length - 1].model) as GameState : gameState;
        
        const memoryContext: MemoryContext = {
            emotion: lastGameState.emotion,
            emotionalStats: lastGameState.characterStats.emotionalStats,
            relatedTopics: [file.name.split('.')[0].replace(/_/g, ' ')] 
        };

        const newMemory: PersonalMemory = {
            id: `${Date.now()}-${file.name}`,
            type: isText ? 'text' : 'image',
            name: file.name,
            content: content,
            createdAt: new Date(),
            context: memoryContext
        };

        await db.addMemory(newMemory);
        setPersonalMemories(prev => [newMemory, ...prev].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
        console.error("Error adding memory:", error);
        alert(t('addMemoryError'));
    }
  };

  const handleDeleteMemory = async (id: string) => {
      if (confirm(t('confirmDeleteMemory'))) {
        try {
            await db.deleteMemory(id);
            setPersonalMemories(prev => prev.filter(mem => mem.id !== id));
        } catch (error) {
            console.error("Error deleting memory:", error);
            alert(t('deleteMemoryError'));
        }
      }
  };
  
  const handleGenerateDream = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const paradiseHistory = paradiseChatLog.map(entry => ({
        role: entry.author === 'user' ? 'user' : 'model',
        parts: [{ text: entry.content }]
    }) as { role: 'user' | 'model'; parts: { text: string }[] });

    try {
        const newDream = await generateDream(paradiseHistory, personalMemories, settings, lang);
        await db.addDream(newDream);
        setDreams(prev => [newDream, ...prev].sort((a,b) => b.dreamtAt.getTime() - a.dreamtAt.getTime()));
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [paradiseChatLog, personalMemories, settings, lang]);

  // --- Game Flow and Navigation ---
  const handleSaveToSlot = (slotId: string) => {
    if (userName) {
      const slotNumber = slotId.includes('manual') ? slotId.split('-')[1] : null;
      const slotName = slotNumber ? t('manualSlot', { number: slotNumber }) : t('autosaveSlot');

      storage.saveGame(slotId, { gameState, characterImage, history, userName });
      setSaveMessage(t('gameSaved', { slot: slotName }));
      setTimeout(() => setSaveMessage(null), 3000);
      setIsSaveLoadModalVisible(false);
    }
  };

  const handleLoadFromSlot = (slotId: string) => {
    const data = storage.loadGame(slotId);
    if (data) {
      setGameState(data.gameState);
      setCharacterImage(data.characterImage);
      setHistory(data.history);
      setUserName(data.userName);
      setChatLog([{ author: 'elysia', content: data.gameState.storyText }]);
      setError(null);
      setGameMode('story');
      setIsSaveLoadModalVisible(false);
    }
  };

  const handleNewGame = () => {
    const bonus = calculateNewGameBonus(savedEndings, lang);
    const startingState = applyBonusToGameState(getInitialState(lang), bonus, lang);

    setGameState(startingState);
    setCharacterImage(ELYSIA_BASE_IMAGE);
    setHistory([]);
    setUserName(null);
    setChatLog([{ author: 'elysia', content: startingState.storyText }]);
    setError(null);
    setGameMode('story');
    setIsQuestTrackerVisible(true);
    setBlueprint({ content: '', isLoading: false });
    setEndingAnalysis({ content: '', isLoading: false });
  };
  
  const handleEnterParadise = () => {
    const lastSave = storage.loadGame(storage.AUTOSAVE_SLOT_ID);
    if (lastSave?.userName) {
        setUserName(lastSave.userName);
    }
    setParadiseChatLog([{author: 'elysia', content: lang === 'ko' ? "다녀오셨어요, 오빠. 여기서부터는 우리 둘만의 이야기에요. 무엇이든 이야기해주세요." : "Welcome back, Brother. From here on, it's just our story. Please, tell me anything."}]);
    setGameMode('paradise');
  };

  const startGameAction = (action: () => void) => {
      audioService.initialize();
      action();
  };

  const handleBackToMenu = () => {
    setRecalledEnding(null);
    setGameMode('menu');
  };

  const handlePanelResize = () => setCharacterPanelSize(prev => (prev === 'default' ? 'expanded' : 'default'));
  const handleOpenNameEdit = () => {
      setNameModalMode('edit');
      setIsNameModalOpen(true);
  };
  
  const handleOpenSettings = () => {
      setIsSettingsModalOpen(true);
  };

  const panelSizeClasses = {
      default: { char: 'lg:w-2/5', story: 'flex-grow' },
      expanded: { char: 'lg:w-3/5', story: 'lg:w-2/5' },
  };

  // --- RENDER LOGIC ---

  if (gameMode === 'menu') {
    return (
      <GameMenu 
        onNewGame={() => startGameAction(handleNewGame)}
        onContinue={() => startGameAction(() => handleLoadFromSlot(storage.AUTOSAVE_SLOT_ID))}
        onLoadGame={() => startGameAction(() => setIsSaveLoadModalVisible(true))}
        onShowGallery={() => startGameAction(() => setGameMode('gallery'))}
        onEnterParadise={() => startGameAction(handleEnterParadise)}
        isParadiseUnlocked={isParadiseUnlocked}
        hasAutoSave={storage.hasAutoSave()}
        hasManualSave={storage.hasAnyManualSave()}
        hasEndings={savedEndings.length > 0}
        newGameBonusInfo={newGameBonusInfo}
      />
    );
  }

  if (gameMode === 'gallery') {
    return (
      <EndingGallery 
        endings={savedEndings}
        onSelectEnding={(ending) => {
          setRecalledEnding(ending);
          setGameMode('recalling');
        }}
        onBack={handleBackToMenu}
      />
    );
  }

  if ((gameMode === 'ending' || gameMode === 'recalling') && (recalledEnding || gameState.destiny)) {
    const isRecalling = gameMode === 'recalling';
    const endingData = recalledEnding || {
      destiny: gameState.destiny!,
      finalStory: gameState.storyText,
      finalImage: characterImage!,
    };
    return (
        <DestinyDisplay 
            status={gameMode}
            userName={isRecalling ? null : userName}
            {...endingData} 
            onBack={handleBackToMenu}
            isGoodEnding={BLUEPRINT_ENDINGS.includes(endingData.destiny)}
            blueprint={blueprint}
            endingAnalysis={endingAnalysis}
        />
    );
  }

  if (gameMode === 'paradise') {
    return (
      <>
        <ParadiseHub
          chatLog={paradiseChatLog}
          memories={personalMemories}
          dreams={dreams}
          isLoading={isLoading}
          onSendMessage={handleParadiseMessage}
          onAddMemory={handleAddMemory}
          onDeleteMemory={handleDeleteMemory}
          onViewMemory={setViewingMemory}
          onGenerateDream={handleGenerateDream}
          onGoToMenu={handleBackToMenu}
          onOpenSettings={handleOpenSettings}
          userInput={userInput}
          setUserInput={setUserInput}
        />
        <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            settings={settings}
            onSettingsChange={setSettings}
        />
        <MemoryViewerModal
            memory={viewingMemory}
            onClose={() => setViewingMemory(null)}
        />
      </>
    );
  }
  
  // Default to 'story' mode render
  const currentTheme = emotionThemes[gameState.emotion] || emotionThemes.neutral;
  
  const handlePanelToggle = (panel: string) => {
    audioService.playSfx(activePanel === panel ? 'closePanel' : 'openPanel');
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const getPanelTitle = (panel: string | null): string => {
      switch(panel) {
          case 'stats': return t('panelTitleStats');
          case 'inventory': return t('panelTitleInventory');
          case 'memories': return t('panelTitleMemories');
          case 'sanctuary': return t('panelTitleSanctuary');
          case 'worldInfo': return t('panelTitleWorldInfo');
          case 'quests': return t('panelTitleQuests');
          default: return '';
      }
  };

  const renderActivePanel = () => {
      switch(activePanel) {
          case 'stats': return <StatsAndSkills stats={gameState.characterStats} appellation={gameState.appellation} onEditName={handleOpenNameEdit} />;
          case 'inventory': return <Inventory inventory={gameState.inventory} gold={gameState.gold} />;
          case 'memories': return <MemoryJournal memories={gameState.memories} />;
          case 'sanctuary': return <Sanctuary sanctuary={gameState.sanctuary} />;
          case 'worldInfo': return (
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/2"><WorldInfo worldState={gameState.worldState} /></div>
                <div className="lg:w-1/2"><WorldMap worldState={gameState.worldState} /></div>
            </div>
          );
          case 'quests': return <QuestLog quests={gameState.quests} />;
          default: return null;
      }
  };

  return (
    <div className="h-screen text-white font-sans flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DynamicBackground worldState={gameState.worldState} />
        <div 
            className="absolute inset-0 transition-colors duration-[1500ms] ease-in-out"
            style={{ backgroundColor: currentTheme.overlay }} 
        ></div>
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col">
        {isNameModalOpen && (
            <NameInputModal mode={nameModalMode} currentName={userName} onClose={() => setIsNameModalOpen(false)} onNameSubmit={nameModalMode === 'initial' ? handleInitialNameSubmit : handleNameChange} />
        )}
        {isSaveLoadModalVisible && (
            <SaveLoadModal isOpen={isSaveLoadModalVisible} onClose={() => setIsSaveLoadModalVisible(false)} onSave={handleSaveToSlot} onLoad={handleLoadFromSlot} />
        )}
        {isSettingsModalOpen && (
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} settings={settings} onSettingsChange={setSettings} />
        )}
        {isQuestTrackerVisible && <QuestTracker quests={gameState.quests} />}
        
        <InfoPanelModal isOpen={activePanel !== null} onClose={() => { audioService.playSfx('closePanel'); setActivePanel(null); }} title={getPanelTitle(activePanel)}>
          {renderActivePanel()}
        </InfoPanelModal>
        
        <main className="w-full flex-grow flex flex-col lg:flex-row gap-4 p-2 sm:p-4 overflow-hidden" style={{ transform: 'rotateY(-1deg) rotateX(2deg)' }}>
          <div className={`w-full h-1/2 lg:h-full flex-shrink-0 relative transition-all duration-500 ease-in-out ${panelSizeClasses[characterPanelSize].char}`}>
            <CharacterDisplay image={characterImage} emotion={gameState.emotion} isLoading={isLoading && !characterImage} onResize={handlePanelResize} size={characterPanelSize} />
             {isThoughtsOverlayVisible && (
              <div className="absolute top-4 left-4 right-4 z-20">
                <CharacterThoughts thoughts={gameState.characterThoughts} thoughtsOpacity={settings.thoughtsOpacity} />
              </div>
            )}
          </div>
          <div className={`flex-grow bg-black/90 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col border border-[var(--border-color)] overflow-hidden transition-all duration-500 ease-in-out ${panelSizeClasses[characterPanelSize].story}`}>
            {isLoading && !isNameModalOpen && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-2xl z-20">
                  <LoadingSpinner />
                  <p className="mt-4 text-[var(--accent-color)] animate-pulse">{t('elysiaThinking')}</p>
                </div>
            )}
            <InfoDock activePanel={activePanel} onShowPanel={handlePanelToggle} />
            <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
              <StoryPanel chatLog={chatLog} isFastForward={isFastForward} />
            </div>
            <div className="flex-shrink-0 mt-auto pt-4 relative">
              {error && <p className="text-red-400 text-center mb-2">{error}</p>}
              {saveMessage && <p className="text-green-400 text-center mb-2 animate-pulse">{saveMessage}</p>}
              
              {isSuggestionsPanelVisible && (
                <div className="absolute bottom-full w-full mb-2 z-10 animate-fade-in-up">
                    <div className="p-4 bg-slate-900/95 rounded-xl border border-[var(--border-color)]">
                        <SuggestionChips choices={gameState.choices} onActionSelect={handleAction} isLoading={isLoading || isNameModalOpen} />
                    </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <ChatInput onSendMessage={handleAction} isLoading={isLoading || isNameModalOpen} userInput={userInput} setUserInput={setUserInput} />
                </div>
                {gameState.choices.length > 0 && (
                  <div className="flex-shrink-0">
                    <Tooltip text={t('tooltipShowSuggestions')}>
                      <button onClick={() => setIsSuggestionsPanelVisible(v => !v)} aria-label={t('ariaToggleSuggestions')} className={`p-3 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-400 ${ isSuggestionsPanelVisible ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'bg-slate-800/60 border border-slate-600/80 hover:bg-slate-700/80' }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <MainMenu onOpenSaveLoad={() => { audioService.playSfx('openPanel'); setIsSaveLoadModalVisible(true); }} onGoToMenu={handleBackToMenu} isSaving={isLoading} onToggleThoughts={() => setIsThoughtsOverlayVisible(v => !v)} isThoughtsVisible={isThoughtsOverlayVisible} onToggleQuestTracker={() => setIsQuestTrackerVisible(v => !v)} isQuestTrackerVisible={isQuestTrackerVisible} onToggleFastForward={() => setIsFastForward(v => !v)} isFastForward={isFastForward} onOpenSettings={handleOpenSettings} />
      </div>
    </div>
  );
}

export default App;