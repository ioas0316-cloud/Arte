

import React, { useState } from 'react';
import StoryPanel from './StoryPanel';
import ChatInput from './ChatInput';
import MainMenu from './MainMenu';
import SidePanel from './SidePanel';
import { PersonalMemory, Dream } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../localization';
import RealtimeClock from './RealtimeClock';

interface ParadiseHubProps {
  chatLog: { author: 'user' | 'elysia', content: string }[];
  memories: PersonalMemory[];
  dreams: Dream[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onAddMemory: (file: File) => void;
  onDeleteMemory: (id: string) => void;
  onViewMemory: (memory: PersonalMemory) => void;
  onGenerateDream: () => void;
  onGoToMenu: () => void;
  onOpenSettings: () => void;
  userInput: string;
  setUserInput: (input: string) => void;
}

const ParadiseHub: React.FC<ParadiseHubProps> = (props) => {
  const { t } = useLanguage();

  return (
    <div className="h-screen text-white font-sans flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="immersive-background" style={{ backgroundImage: "url('https://i.imgur.com/h5T0j1j.jpeg')", animationDuration: '120s' }}></div>
            <div className="absolute inset-0 bg-indigo-900/40"></div>
        </div>

        <RealtimeClock />

        <div className="relative z-10 w-full h-full flex flex-col">
            <main className="w-full flex-grow flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
                <div className="w-full lg:w-1/3 h-1/2 lg:h-full flex-shrink-0">
                    <SidePanel
                        memories={props.memories}
                        dreams={props.dreams}
                        onAddMemory={props.onAddMemory}
                        onDeleteMemory={props.onDeleteMemory}
                        onViewMemory={props.onViewMemory}
                        onGenerateDream={props.onGenerateDream}
                        isLoading={props.isLoading}
                    />
                </div>

                <div className="flex-grow bg-black/50 rounded-2xl shadow-2xl p-6 flex flex-col backdrop-blur-md border border-[var(--border-color)] overflow-hidden">
                    {props.isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-2xl z-20">
                            <LoadingSpinner />
                            <p className="mt-4 text-[var(--accent-color)] animate-pulse">{t('elysiaThinking')}</p>
                        </div>
                    )}
                    <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        <StoryPanel chatLog={props.chatLog} isFastForward={false} />
                    </div>
                    <div className="flex-shrink-0 mt-auto pt-4 relative">
                        <ChatInput
                            onSendMessage={props.onSendMessage}
                            isLoading={props.isLoading}
                            userInput={props.userInput}
                            setUserInput={props.setUserInput}
                        />
                    </div>
                </div>
            </main>

            <MainMenu
                onOpenSaveLoad={() => alert(t('saveLoadNotAvailableInParadise'))}
                onGoToMenu={props.onGoToMenu}
                isSaving={false}
                onToggleThoughts={() => {}}
                isThoughtsVisible={false}
                onToggleQuestTracker={() => {}}
                isQuestTrackerVisible={false}
                onToggleFastForward={() => {}}
                isFastForward={false}
                onOpenSettings={props.onOpenSettings}
            />
        </div>
    </div>
  );
};

export default ParadiseHub;
