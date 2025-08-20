
import React from 'react';
import { useLanguage } from '../localization';

interface MemoryJournalProps {
  memories: string[];
}

const MemoryJournal: React.FC<MemoryJournalProps> = ({ memories }) => {
  const { t } = useLanguage();
  if (memories.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 5m0 14l2.293-2.293a1 1 0 011.414 1.414L12 17.586l2.293-2.293a1 1 0 011.414 1.414L14 17m-4-8v2m0 4v2m-4-2h2m4 0h2" />
        </svg>
        {t('panelTitleMemories')}
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
        {memories.map((memory, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{memory}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryJournal;
