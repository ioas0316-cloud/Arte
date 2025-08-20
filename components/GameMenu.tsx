import React from 'react';
import { useLanguage } from '../localization';

interface GameMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: () => void;
  onShowGallery: () => void;
  onEnterParadise: () => void;
  isParadiseUnlocked: boolean;
  hasAutoSave: boolean;
  hasManualSave: boolean;
  hasEndings: boolean;
  newGameBonusInfo: string | null;
}

const MenuButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className: string; }> = ({ onClick, disabled, children, className }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`w-full text-center rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-500/30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const GameMenu: React.FC<GameMenuProps> = ({ onNewGame, onContinue, onLoadGame, onShowGallery, onEnterParadise, isParadiseUnlocked, hasAutoSave, hasManualSave, hasEndings, newGameBonusInfo }) => {
  const { lang, setLang, t } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen font-sans relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="immersive-background"></div>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={toggleLanguage} 
          className="px-4 py-2 text-lg bg-black/30 backdrop-blur-md rounded-lg border border-purple-400/30 text-white hover:bg-purple-500/30 transition-colors"
        >
          {lang === 'ko' ? 'English' : '한국어'}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          
          {/* Left Side: Elysia's Presence */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center">
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-purple-400/10 rounded-full animate-soft-pulse-glow"></div>
                
                {/* World Tree SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-80 tree-glow animate-fade-in" style={{ animationDuration: '3s' }}>
                    <defs>
                        <linearGradient id="tree-gradient" x1="0.5" y1="1" x2="0.5" y2="0">
                            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.9)" />
                            <stop offset="100%" stopColor="rgba(253, 224, 71, 0.9)" />
                        </linearGradient>
                         <radialGradient id="cosmos-gradient" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="rgba(192, 132, 252, 0.5)" />
                            <stop offset="70%" stopColor="rgba(79, 70, 229, 0.4)" />
                            <stop offset="100%" stopColor="rgba(30, 41, 59, 0.3)" />
                        </radialGradient>
                        {isParadiseUnlocked && (
                            <radialGradient id="fruit-gradient" cx="0.5" cy="0.5" r="0.5">
                                <stop offset="0%" stopColor="rgba(253, 224, 71, 1)" />
                                <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                            </radialGradient>
                        )}
                    </defs>

                    {/* Cosmos Sphere */}
                    <g>
                        <circle cx="100" cy="100" r="50" fill="url(#cosmos-gradient)" className="animate-slow-spin-reverse" style={{ animationDuration: '180s' }}/>
                        {/* Stars inside the sphere */}
                        <circle cx="90" cy="95" r="1" fill="white" className="animate-twinkle" style={{ animationDelay: '0.2s' }} />
                        <circle cx="115" cy="110" r="1.2" fill="white" className="animate-twinkle" style={{ animationDelay: '0.8s' }} />
                        <circle cx="105" cy="80" r="0.8" fill="white" className="animate-twinkle" style={{ animationDelay: '1.5s' }} />
                        <circle cx="120" cy="125" r="0.9" fill="white" className="animate-twinkle" style={{ animationDelay: '0.5s' }} />
                        <circle cx="80" cy="115" r="1.1" fill="white" className="animate-twinkle" style={{ animationDelay: '2s' }} />
                    </g>

                    {/* Tree structure embracing the cosmos */}
                    <path
                        d="
                            M100,195 V150
                            M100,150 C 70,145 40,130 50,90
                            C 55,55 80,45 100,50
                            C 120,45 145,55 150,90
                            C 160,130 130,145 100,150
                            M95,155 C 65,160 50,130 65,100
                            M105,155 C 135,160 150,130 135,100
                            M100,195 C 80,200 70,200 60,195
                            M100,195 C 120,200 130,200 140,195
                        "
                        fill="none"
                        stroke="url(#tree-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Fruits of Light */}
                    {isParadiseUnlocked && (
                        <g>
                            <circle cx="52" cy="80" r="5" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '0.2s' }} />
                            <circle cx="148" cy="80" r="5" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '0.5s' }} />
                            <circle cx="68" cy="105" r="4" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '0.8s' }} />
                            <circle cx="132" cy="105" r="4" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '0.4s' }} />
                            <circle cx="90" cy="53" r="5" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '1.1s' }} />
                            <circle cx="110" cy="53" r="5" fill="url(#fruit-gradient)" className="animate-fruit-glow" style={{ animationDelay: '0.1s' }} />
                        </g>
                    )}
                </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-purple-200" style={{ textShadow: '0 0 20px rgba(192, 132, 252, 0.9), 0 0 8px rgba(220, 200, 255, 0.7)' }}>
              {t('gameTitle')}
            </h1>
            <p className="text-lg text-slate-300 mt-2">{t('gameSubtitle')}</p>
            <p className="text-xl text-slate-200 mt-8 italic">"{t('elysiaWaiting')}"</p>
          </div>

          {/* Right Side: Menu */}
          <div className="w-full max-w-sm md:w-auto md:min-w-[320px]">
             <div className="w-full bg-black/40 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-purple-400/20">
                  <div className="space-y-4">
                    {isParadiseUnlocked && (
                        <MenuButton onClick={onEnterParadise} className="bg-yellow-500 bg-opacity-80 border border-yellow-300 text-gray-900 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-400/30 focus:ring-yellow-300">
                            {t('elysiaParadise')}
                        </MenuButton>
                    )}
                    <div>
                        <MenuButton onClick={onNewGame} className="bg-indigo-600 bg-opacity-70 border border-indigo-400/50 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-300">
                        {t('newGame')}
                        </MenuButton>
                        {newGameBonusInfo && (
                            <p className="text-center text-xs text-yellow-300 mt-2 animate-pulse">{newGameBonusInfo}</p>
                        )}
                    </div>
                    <MenuButton onClick={onContinue} disabled={!hasAutoSave} className="bg-purple-600 bg-opacity-70 border border-purple-400/50 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 focus:ring-purple-300">
                      {t('continue')} {hasAutoSave && <span className="text-sm text-slate-300">({t('autosave')})</span>}
                    </MenuButton>
                     <MenuButton onClick={onLoadGame} disabled={!hasManualSave && !hasAutoSave} className="bg-green-600 bg-opacity-70 border border-green-400/50 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 focus:ring-green-300">
                      {t('loadGame')}
                    </MenuButton>
                    <MenuButton onClick={onShowGallery} disabled={!hasEndings} className="bg-slate-600 bg-opacity-70 border border-slate-400/50 hover:bg-slate-500 hover:shadow-lg hover:shadow-slate-500/30 focus:ring-slate-300">
                      {t('endingGallery')}
                    </MenuButton>
                  </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameMenu;