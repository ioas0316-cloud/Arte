
import React from 'react';
import { Emotion } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Tooltip from './Tooltip';
import { PanelSizeMode } from '../App';
import { useLanguage } from '../localization';

interface CharacterDisplayProps {
  image: string | null;
  emotion: Emotion;
  isLoading: boolean;
  onResize: () => void;
  size: PanelSizeMode;
}

const emotionToAnimation: Record<string, string> = {
  [Emotion.NEUTRAL]: 'animate-float',
  [Emotion.HAPPY]: 'animate-glow',
  [Emotion.SHY]: 'animate-shy-sway',
  [Emotion.SURPRISED]: 'animate-pulse',
  [Emotion.THINKING]: 'animate-float',
  [Emotion.SAD]: 'animate-none opacity-80',
  [Emotion.ANGRY]: 'animate-pulse',
  [Emotion.LOVE]: 'animate-glow',
};

const particleConfig: Record<string, { count: number }> = {
  [Emotion.NEUTRAL]: { count: 0 },
  [Emotion.HAPPY]: { count: 15 },
  [Emotion.LOVE]: { count: 20 },
  [Emotion.SHY]: { count: 10 },
  [Emotion.SAD]: { count: 12 },
  [Emotion.ANGRY]: { count: 18 },
  [Emotion.SURPRISED]: { count: 25 },
  [Emotion.THINKING]: { count: 8 },
};

const BlushEffect: React.FC = () => (
  <>
    <div 
      className="blush-effect z-20"
      style={{ top: '48%', left: '22%', transform: 'rotate(-15deg)' }}
    ></div>
    <div 
      className="blush-effect z-20"
      style={{ top: '48%', right: '22%', transform: 'rotate(15deg)' }}
    ></div>
  </>
);

const ParticleBackground: React.FC<{ emotion: Emotion }> = ({ emotion }) => {
  const config = particleConfig[emotion] || particleConfig[Emotion.NEUTRAL];
  if (config.count === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none z-0">
      {Array.from({ length: config.count }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 4}s`, // 4s to 9s
          animationDelay: `${Math.random() * 6}s`,
          backgroundColor: 'var(--accent-color)',
        };
        return <div key={i} className="absolute bottom-0 w-1 h-1 rounded-full animate-particle-up" style={style} />;
      })}
    </div>
  );
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ image, emotion, isLoading, onResize, size }) => {
  const { t } = useLanguage();
  const animationClass = emotionToAnimation[emotion] || 'animate-float';
  const showBlush = emotion === Emotion.SHY || emotion === Emotion.LOVE;
  const isExpanded = size === 'expanded';

  return (
    <div className="relative w-full h-full rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center p-4 border border-[var(--border-color)] shadow-lg shadow-purple-500/10">
      <ParticleBackground emotion={emotion} />
      <div className="absolute top-2 right-2 z-30">
        <Tooltip text={isExpanded ? t('tooltipShrink') : t('tooltipExpand')}>
          <button onClick={onResize} className="p-2 bg-black/40 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400">
            {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M3 3l7 7M21 21l-7-7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
            )}
          </button>
        </Tooltip>
      </div>

      {isLoading ? (
        <div className="text-center z-10">
          <LoadingSpinner />
          <p className="mt-4 text-[var(--accent-color)]">{t('loadingElysia')}</p>
        </div>
      ) : image ? (
        <>
          <img
            key={image} // Force re-render for animation reset
            src={image}
            alt="Elysia"
            className={`relative z-10 object-contain w-full h-full transition-all duration-500 ease-in-out ${animationClass}`}
          />
          {showBlush && <BlushEffect />}
        </>
      ) : (
        <div className="text-center text-slate-400 z-10">
          <p>{t('promptToMeetElysia')}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterDisplay;
