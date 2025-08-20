
import React, { useState, useEffect } from 'react';
import * as storage from '../services/storageService';
import { useLanguage } from '../localization';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slotId: string) => void;
  onLoad: (slotId: string) => void;
}

const SaveSlot: React.FC<{
    summary: storage.SaveSlotSummary;
    onSave: (slotId: string) => void;
    onLoad: (slotId: string) => void;
    isAutosave?: boolean;
}> = ({ summary, onSave, onLoad, isAutosave = false }) => {
    const { t } = useLanguage();
    const { slotId, isEmpty, characterImage, gameState, savedAt } = summary;

    const locationName = gameState?.worldState.locations.find(l => l.id === gameState.worldState.currentLocationId)?.name || t('unknownLocation');
    const activeQuest = gameState?.quests.find(q => q.status === 'active');
    
    const formattedDate = savedAt ? new Date(savedAt).toLocaleString() : '';

    const slotTitle = isAutosave 
        ? t('autosaveSlot') 
        : t('manualSlot', { number: slotId.split('-')[1] });

    return (
        <div className="bg-slate-800/50 rounded-lg p-3 flex gap-3 border border-slate-700">
            <div className="w-24 h-32 bg-black/30 rounded-md flex-shrink-0 overflow-hidden">
                {!isEmpty && characterImage && (
                    <img src={characterImage} alt="Save Thumbnail" className="w-full h-full object-cover" />
                )}
                 {isEmpty && (
                     <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">{t('slotEmpty')}</div>
                 )}
            </div>
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg text-purple-200">
                        {slotTitle}
                    </h3>
                    {isEmpty ? (
                        <p className="text-slate-400 italic mt-2">{t('noData')}</p>
                    ) : (
                        <>
                            <p className="text-sm text-slate-300">Day {gameState?.worldState.day} - {locationName}</p>
                            <p className="text-sm text-slate-400 truncate">{t('journey')}: {activeQuest?.title || t('none')}</p>
                            <p className="text-xs text-slate-500 mt-1">{formattedDate}</p>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <button 
                        onClick={() => onSave(slotId)}
                        className="flex-grow px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        disabled={isAutosave}
                    >
                        {t('save')}
                    </button>
                    <button 
                        onClick={() => onLoad(slotId)}
                        className="flex-grow px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        disabled={isEmpty}
                    >
                        {t('load')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ isOpen, onClose, onSave, onLoad }) => {
    const { t } = useLanguage();
    const [slots, setSlots] = useState<storage.SaveSlotSummary[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSlots(storage.getSaveSlotSummaries());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const autosaveSlot = slots.find(s => s.slotId === storage.AUTOSAVE_SLOT_ID);
    const manualSlots = slots.filter(s => s.slotId !== storage.AUTOSAVE_SLOT_ID);

    return (
        <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-lg bg-gray-900/80 rounded-2xl shadow-2xl flex flex-col border border-purple-400/30"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-purple-400/20 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-purple-200">{t('saveLoadTitle')}</h2>
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
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar max-h-[70vh]">
                    {autosaveSlot && <SaveSlot summary={autosaveSlot} onSave={onSave} onLoad={onLoad} isAutosave />}
                    {manualSlots.map(slot => (
                        <SaveSlot key={slot.slotId} summary={slot} onSave={onSave} onLoad={onLoad} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SaveLoadModal;
