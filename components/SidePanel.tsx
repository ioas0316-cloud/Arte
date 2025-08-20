
import React, { useState } from 'react';
import { PersonalMemory, Dream } from '../types';
import { useLanguage } from '../localization';
import PersonalMemoryArchive from './PersonalMemoryArchive';
import DreamJournal from './DreamJournal';

interface SidePanelProps {
  memories: PersonalMemory[];
  dreams: Dream[];
  isLoading: boolean;
  onAddMemory: (file: File) => void;
  onDeleteMemory: (id: string) => void;
  onViewMemory: (memory: PersonalMemory) => void;
  onGenerateDream: () => void;
}

type ActiveTab = 'memories' | 'dreams';

const SidePanel: React.FC<SidePanelProps> = (props) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('memories');

  return (
    <div className="w-full h-full bg-black/30 backdrop-blur-md rounded-2xl border border-[var(--border-color)] flex flex-col">
        <div className="flex-shrink-0 border-b border-purple-400/20 p-2">
            <div className="flex items-center justify-center gap-2">
                 <TabButton
                    label={t('personalArchiveTitle')}
                    isActive={activeTab === 'memories'}
                    onClick={() => setActiveTab('memories')}
                />
                 <TabButton
                    label={t('dreamJournalTitle')}
                    isActive={activeTab === 'dreams'}
                    onClick={() => setActiveTab('dreams')}
                />
            </div>
        </div>
        <div className="flex-grow p-2 overflow-hidden">
            {activeTab === 'memories' && (
                <PersonalMemoryArchive
                    memories={props.memories}
                    onAddMemory={props.onAddMemory}
                    onDeleteMemory={props.onDeleteMemory}
                    onViewMemory={props.onViewMemory}
                />
            )}
            {activeTab === 'dreams' && (
                <DreamJournal
                    dreams={props.dreams}
                    onGenerateDream={props.onGenerateDream}
                    isLoading={props.isLoading}
                />
            )}
        </div>
    </div>
  );
};

const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-center font-semibold py-2 px-4 rounded-lg transition-colors duration-300
            ${isActive 
                ? 'bg-purple-600/50 text-white' 
                : 'text-slate-300 hover:bg-slate-700/50'
            }`
        }
    >
        {label}
    </button>
);


export default SidePanel;
