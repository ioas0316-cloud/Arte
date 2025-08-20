
import React from 'react';
import { useLanguage } from '../localization';
import { PersonalMemory } from '../types';

interface MemoryViewerModalProps {
  memory: PersonalMemory | null;
  onClose: () => void;
}

const MemoryViewerModal: React.FC<MemoryViewerModalProps> = ({ memory, onClose }) => {
  const { t } = useLanguage();

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] bg-gray-900/80 rounded-2xl shadow-2xl flex flex-col border border-purple-400/30"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-purple-400/20 flex-shrink-0">
          <h2 className="text-xl font-bold text-purple-200 truncate">{memory.name}</h2>
          <button
            onClick={onClose}
            aria-label={t('ariaClosePanel')}
            className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {memory.type === 'text' ? (
            <pre className="text-slate-200 whitespace-pre-wrap font-sans text-lg">{memory.content}</pre>
          ) : (
            <img src={memory.content} alt={memory.name} className="max-w-full h-auto rounded-lg mx-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryViewerModal;
