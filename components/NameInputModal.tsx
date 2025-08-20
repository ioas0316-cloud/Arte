
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../localization';

interface NameInputModalProps {
  mode: 'initial' | 'edit';
  currentName?: string | null;
  onClose: () => void;
  onNameSubmit: (name: string) => void;
}

const NameInputModal: React.FC<NameInputModalProps> = ({ mode, currentName, onClose, onNameSubmit }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && currentName) {
      setName(currentName);
    }
  }, [mode, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (mode === 'initial') {
        setIsConfirming(true);
      } else {
        onNameSubmit(name.trim());
      }
    }
  };

  const handleConfirm = () => {
    onNameSubmit(name.trim());
  };

  const handleCancel = () => {
      setIsConfirming(false);
  }

  const title = mode === 'initial' ? t('nameModalTitleInitial') : t('nameModalTitleEdit');
  const description = mode === 'initial' ? t('nameModalDescInitial') : t('nameModalDescEdit');
  const buttonText = mode === 'initial' ? t('nameModalButtonInitial') : t('nameModalButtonEdit');

  const confirmDescription = t('nameModalConfirmDesc', { name: name });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md text-center bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-purple-400/30">
        
        {isConfirming ? (
            <div>
                <h2 className="text-2xl font-bold text-purple-200 mb-4">{t('nameModalConfirmTitle')}</h2>
                <p className="text-slate-300 mb-6" dangerouslySetInnerHTML={{ __html: confirmDescription.replace(name, `<span class="font-bold text-white">${name}</span>`) }} />
                <div className="flex gap-4">
                     <button
                        onClick={handleCancel}
                        className="w-full bg-slate-600 bg-opacity-80 border border-slate-400/50 rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-slate-400"
                    >
                        {t('nameModalButtonRetry')}
                    </button>
                     <button
                        onClick={handleConfirm}
                        className="w-full bg-indigo-600 bg-opacity-80 border border-indigo-400/50 rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </div>
        ) : (
             <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-purple-200 mb-4">{title}</h2>
                <p className="text-slate-300 mb-6">{description}</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('nameModalPlaceholder')}
                    className="w-full bg-gray-800/50 border border-purple-400/50 rounded-lg px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    aria-label="Your Name"
                    autoFocus
                />
                <div className="flex gap-4 mt-6">
                    {mode === 'edit' && (
                         <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-slate-600 bg-opacity-80 border border-slate-400/50 rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-slate-400"
                        >
                            {t('cancel')}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full bg-indigo-600 bg-opacity-80 border border-indigo-400/50 rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400 disabled:bg-gray-500/30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default NameInputModal;
