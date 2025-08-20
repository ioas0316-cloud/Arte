

import React, { useState, useRef, useEffect } from 'react';
import Tooltip from './Tooltip';
import { audioService } from '../services/audioService';
import { useLanguage } from '../localization';

interface MainMenuProps {
  onOpenSaveLoad: () => void;
  onGoToMenu: () => void;
  isSaving: boolean;
  onToggleThoughts: () => void;
  isThoughtsVisible: boolean;
  onToggleQuestTracker: () => void;
  isQuestTrackerVisible: boolean;
  onToggleFastForward: () => void;
  isFastForward: boolean;
  onOpenSettings: () => void;
}

const MenuButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center gap-3 px-4 py-2 text-left text-slate-200 rounded-md hover:bg-purple-600/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
    >
        {children}
    </button>
);

const MainMenu: React.FC<MainMenuProps> = ({
  onOpenSaveLoad,
  onGoToMenu,
  isSaving,
  onToggleThoughts,
  isThoughtsVisible,
  onToggleQuestTracker,
  isQuestTrackerVisible,
  onToggleFastForward,
  isFastForward,
  onOpenSettings
}) => {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.getIsMuted());
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleToggleMute = () => {
    const newMuteState = audioService.toggleMute();
    setIsMuted(newMuteState);
  };
  
  const handleLanguageToggle = () => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  };

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-40">
      <div className="relative">
        {isOpen && (
           <div className="absolute top-full left-0 mt-3 w-60 bg-slate-900/80 backdrop-blur-md rounded-xl border border-[var(--border-color)] p-2 shadow-2xl animate-fade-in-down">
              <div className="space-y-1">
                <MenuButton onClick={onToggleThoughts}>
                   {isThoughtsVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>
                    )}
                    <span>{t('menuToggleThoughts', { state: isThoughtsVisible ? t('hide') : t('show') })}</span>
                </MenuButton>

                <MenuButton onClick={onToggleQuestTracker}>
                   {isQuestTrackerVisible ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    )}
                    <span>{t('menuToggleQuests', { state: isQuestTrackerVisible ? t('hide') : t('show') })}</span>
                </MenuButton>

                <MenuButton onClick={onToggleFastForward}>
                   {isFastForward ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" /></svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    )}
                    <span>{t('menuToggleFastForward', { state: isFastForward ? t('off') : t('on') })}</span>
                </MenuButton>
                
                <div className="pt-1 mt-1 border-t border-slate-700/50"></div>

                <MenuButton onClick={onOpenSettings}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                    <span>{t('menuSettings')}</span>
                </MenuButton>

                <MenuButton onClick={handleToggleMute}>
                   {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                    <span>{t('menuToggleSound', { state: isMuted ? t('on') : t('off') })}</span>
                </MenuButton>

                 <MenuButton onClick={handleLanguageToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13l4-4M19 17v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m14-6a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2z" /></svg>
                    <span>{lang === 'ko' ? 'English' : '한국어'}</span>
                </MenuButton>
                
                <div className="pt-1 mt-1 border-t border-slate-700/50"></div>
                
                <MenuButton onClick={onOpenSaveLoad} disabled={isSaving}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    <span>{t('menuSaveLoad')}</span>
                </MenuButton>

                <MenuButton onClick={onGoToMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    <span>{t('menuBackToTitle')}</span>
                </MenuButton>
              </div>
           </div>
        )}
        <Tooltip text="Menu">
          <button 
            onClick={() => setIsOpen(v => !v)} 
            aria-label="Open game menu"
            className="p-3 bg-slate-900/60 backdrop-blur-md rounded-full text-white hover:bg-purple-600/50 transition-colors duration-300 border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MainMenu;
