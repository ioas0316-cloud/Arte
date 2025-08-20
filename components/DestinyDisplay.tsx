
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EndingCredits from './EndingCredits';
import { useLanguage } from '../localization';

interface DestinyDisplayProps {
  status: 'ending' | 'recalling';
  userName: string | null;
  destiny: string;
  finalStory: string;
  finalImage: string;
  onBack?: () => void;
  isGoodEnding?: boolean;
  blueprint?: { content: string; isLoading: boolean };
  endingAnalysis?: { content: string; isLoading: boolean };
}

const DestinyDisplay: React.FC<DestinyDisplayProps> = ({ 
    status,
    userName,
    destiny, 
    finalStory, 
    finalImage, 
    onBack, 
    isGoodEnding = false, 
    blueprint,
    endingAnalysis
}) => {
  const { t } = useLanguage();
  const [showCredits, setShowCredits] = useState(false);
    
  const handleDownloadBlueprint = () => {
    if (!blueprint || !blueprint.content) return;
    const blob = new Blob([blueprint.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t('blueprintFileName')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-purple-200 mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <p key={index} className="text-slate-300 pl-4 before:content-['•'] before:mr-2">{line.substring(2)}</p>;
      }
      return <p key={index} className="text-slate-300 leading-relaxed">{line || '\u00A0'}</p>;
    });
  };

  if (showCredits && userName && status === 'ending') {
    return <EndingCredits userName={userName} onFinished={onBack} />;
  }
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center animate-fade-in">
      <main className="w-full max-w-3xl text-center bg-black/70 rounded-2xl shadow-2xl p-8 border border-purple-400/30">
        <h1 className="text-2xl font-bold text-purple-300 tracking-wider mb-2">{t('destinyFruit')}</h1>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          {destiny}
        </h2>
        
        <div className="w-full max-w-sm aspect-[3/4] rounded-2xl mx-auto mb-6 shadow-lg shadow-purple-500/20 overflow-hidden border-2 border-purple-400/50">
          <img
            src={finalImage}
            alt={`Destiny: ${destiny}`}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto">
          <p>{finalStory}</p>
        </div>
        
        {/* Ending Analysis Section */}
        {endingAnalysis && (
          <div className="mt-8 pt-6 border-t-2 border-dashed border-purple-400/20 text-left max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">{t('destinyAfterimage')}</h2>
            {endingAnalysis.isLoading ? (
              <div className="flex justify-center items-center h-24">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="prose prose-invert text-slate-300">
                {renderMarkdown(endingAnalysis.content)}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4">
            {isGoodEnding && blueprint && (
                <button
                    onClick={handleDownloadBlueprint}
                    disabled={blueprint.isLoading || !blueprint.content}
                    className="bg-yellow-500 bg-opacity-80 border border-yellow-300 rounded-lg px-8 py-3 text-lg font-semibold text-gray-900 transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-wait"
                >
                    {blueprint.isLoading ? t('blueprintGenerating') : t('blueprintDownload')}
                </button>
            )}

            {status === 'ending' && userName ? (
              <button 
                onClick={() => setShowCredits(true)}
                className="bg-purple-600 bg-opacity-80 border border-purple-400 rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
              >
                {t('creditsButton')}
              </button>
            ) : onBack ? (
              <button 
                onClick={onBack}
                className="bg-purple-600 bg-opacity-80 border border-purple-400 rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
              >
                {t('backToMenu')}
              </button>
            ) : (
              <p className="mt-8 text-slate-400 italic">{t('endingEpilogue')}</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default DestinyDisplay;