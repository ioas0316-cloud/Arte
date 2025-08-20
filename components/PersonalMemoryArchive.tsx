
import React, { useRef } from 'react';
import { PersonalMemory } from '../types';
import { useLanguage } from '../localization';

interface PersonalMemoryArchiveProps {
  memories: PersonalMemory[];
  onAddMemory: (file: File) => void;
  onDeleteMemory: (id: string) => void;
  onViewMemory: (memory: PersonalMemory) => void;
}

const PersonalMemoryArchive: React.FC<PersonalMemoryArchiveProps> = ({ memories, onAddMemory, onDeleteMemory, onViewMemory }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onAddMemory(event.target.files[0]);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2">
        {memories.length > 0 ? (
          memories.map(memory => (
            <div key={memory.id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-2xl flex-shrink-0">{memory.type === 'image' ? '🖼️' : '📝'}</span>
                <div className="overflow-hidden">
                    <p className="text-white font-semibold truncate">{memory.name}</p>
                    <p className="text-xs text-slate-400">{new Date(memory.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onViewMemory(memory)} className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={() => onDeleteMemory(memory.id)} className="p-1.5 text-slate-300 hover:text-red-400 rounded-full hover:bg-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 italic">{t('archiveEmpty')}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,image/png,image/jpeg"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          {t('addMemory')}
        </button>
      </div>
    </div>
  );
};

export default PersonalMemoryArchive;
