
import React from 'react';
import { Dream } from '../types';
import { useLanguage } from '../localization';
import LoadingSpinner from './LoadingSpinner';

interface DreamJournalProps {
  dreams: Dream[];
  onGenerateDream: () => void;
  isLoading: boolean;
}

const DreamJournal: React.FC<DreamJournalProps> = ({ dreams, onGenerateDream, isLoading }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {dreams.length > 0 ? (
          dreams.map(dream => (
            <div key={dream.id} className="bg-slate-800/50 p-3 rounded-lg animate-fade-in">
              <div className="flex gap-4">
                {dream.imageBase64 ? (
                  <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 border-purple-400/30">
                    <img src={dream.imageBase64} alt="Dream visualization" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 rounded-md bg-black/30 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
                <div>
                  <p className="text-slate-300 italic text-sm">"{dream.text}"</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(dream.dreamtAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 italic text-center px-4">{t('dreamJournalEmpty')}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex-shrink-0">
        <button
          onClick={onGenerateDream}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-500 transition-colors disabled:bg-slate-700 disabled:cursor-wait flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('dreaming')}...
            </>
          ) : (
            t('generateDream')
          )}
        </button>
      </div>
    </div>
  );
};

export default DreamJournal;
