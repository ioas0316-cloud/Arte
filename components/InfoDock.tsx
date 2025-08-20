

import React from 'react';
import Tooltip from './Tooltip';
import { useLanguage } from '../localization';

interface InfoDockProps {
  activePanel: string | null;
  onShowPanel: (panel: string) => void;
}

const InfoButton: React.FC<{ 
    onClick: () => void; 
    'aria-label': string; 
    children: React.ReactNode;
    isActive?: boolean;
    delay: number;
}> = ({ onClick, children, isActive, delay, ...props }) => (
  <button 
    onClick={onClick}
    {...props}
    style={{ animationDelay: `${delay}ms` }}
    className={`p-2 rounded-full text-purple-300 transition-all duration-300 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-black/50 focus:ring-purple-400 animate-icon-fade-in ${
        isActive 
        ? 'bg-purple-600/70 text-white ring-2 ring-purple-500' 
        : 'bg-indigo-900/40 hover:bg-indigo-700/60 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const InfoDock: React.FC<InfoDockProps> = ({ activePanel, onShowPanel }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 p-2 bg-black/20 rounded-full border border-[var(--border-color)]">
      <Tooltip text={t('panelTitleStats')}>
        <InfoButton onClick={() => onShowPanel('stats')} aria-label={t('panelTitleStats')} isActive={activePanel === 'stats'} delay={0}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </InfoButton>
      </Tooltip>
      <Tooltip text={t('panelTitleInventory')}>
        <InfoButton onClick={() => onShowPanel('inventory')} aria-label={t('panelTitleInventory')} isActive={activePanel === 'inventory'} delay={50}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </InfoButton>
      </Tooltip>
      <Tooltip text={t('panelTitleQuests')}>
        <InfoButton onClick={() => onShowPanel('quests')} aria-label={t('panelTitleQuests')} isActive={activePanel === 'quests'} delay={100}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </InfoButton>
      </Tooltip>
      <Tooltip text={t('panelTitleMemories')}>
        <InfoButton onClick={() => onShowPanel('memories')} aria-label={t('panelTitleMemories')} isActive={activePanel === 'memories'} delay={150}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </InfoButton>
      </Tooltip>
      <Tooltip text={t('panelTitleSanctuary')}>
        <InfoButton onClick={() => onShowPanel('sanctuary')} aria-label={t('panelTitleSanctuary')} isActive={activePanel === 'sanctuary'} delay={200}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0118 17.657c-1.566 1.566-2.343 3-4.657 1C11 18.5 9 19 7.343 17.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 14.121A3 3 0 1014.12 9.88l-4.242 4.242z" />
          </svg>
        </InfoButton>
      </Tooltip>
      <Tooltip text={t('panelTitleWorldInfo')}>
        <InfoButton onClick={() => onShowPanel('worldInfo')} aria-label={t('panelTitleWorldInfo')} isActive={activePanel === 'worldInfo'} delay={250}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.757a3 3 0 104.486 0M12 10.5h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </InfoButton>
      </Tooltip>
    </div>
  );
};

export default InfoDock;
