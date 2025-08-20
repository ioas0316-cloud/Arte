

import React from 'react';
import { useLanguage } from '../localization';

interface InfoPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoPanelModal: React.FC<InfoPanelModalProps> = ({ isOpen, onClose, title, children }) => {
  const { t } = useLanguage();
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full h-full max-w-4xl max-h-[90vh] bg-gray-900/80 rounded-2xl shadow-2xl flex flex-col border border-purple-400/30"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-purple-400/20 flex-shrink-0">
          <h2 className="text-2xl font-bold text-purple-200">{title}</h2>
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
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPanelModal;
