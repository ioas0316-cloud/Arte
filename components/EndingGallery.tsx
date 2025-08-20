
import React from 'react';
import { SavedEnding } from '../services/storageService';
import { useLanguage } from '../localization';

interface EndingGalleryProps {
  endings: SavedEnding[];
  onSelectEnding: (ending: SavedEnding) => void;
  onBack: () => void;
}

const EndingGallery: React.FC<EndingGalleryProps> = ({ endings, onSelectEnding, onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-2xl bg-black/30 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-purple-400/30">
        <h1 className="text-3xl font-bold text-purple-300 tracking-wider mb-6 text-center">{t('endingGallery')}</h1>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {endings.length > 0 ? (
            endings.map((ending, index) => (
              <button
                key={index}
                onClick={() => onSelectEnding(ending)}
                className="w-full text-left p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:bg-slate-700/70 hover:border-purple-400 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-white">{ending.destiny}</h2>
              </button>
            ))
          ) : (
            <p className="text-center text-slate-400">{t('noEndings')}</p>
          )}
        </div>
        <div className="text-center mt-8">
          <button onClick={onBack} className="bg-cyan-600 bg-opacity-80 border border-cyan-400 rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30">
            {t('goBack')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndingGallery;
