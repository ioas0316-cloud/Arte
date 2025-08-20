
import React from 'react';
import { useLanguage } from '../localization';
import { AppSettings, GeminiModel } from '../types';
import Tooltip from './Tooltip';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleModelChange = (model: GeminiModel) => {
    onSettingsChange({ ...settings, selectedModel: model });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-2xl flex flex-col border border-purple-400/30"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-purple-400/20 flex-shrink-0">
          <h2 className="text-2xl font-bold text-purple-200">{t('settingsTitle')}</h2>
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
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">{t('modelSelectionTitle')}</h3>
          <p className="text-sm text-slate-400 mb-4">{t('modelSelectionDesc')}</p>
          <div className="space-y-2">
            <ModelOption
              label="Gemini 2.5 Flash"
              value="gemini-2.5-flash"
              isSelected={settings.selectedModel === 'gemini-2.5-flash'}
              onChange={handleModelChange}
              description={t('modelFlashDesc')}
            />
            <Tooltip text={t('modelProTooltip')}>
              <div>
                <ModelOption
                  label="Gemini Pro"
                  value="gemini-pro"
                  isSelected={settings.selectedModel === 'gemini-pro'}
                  onChange={handleModelChange}
                  description={t('modelProDesc')}
                  disabled={true}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelOption: React.FC<{
  label: string;
  value: GeminiModel;
  isSelected: boolean;
  onChange: (value: GeminiModel) => void;
  description: string;
  disabled?: boolean;
}> = ({ label, value, isSelected, onChange, description, disabled = false }) => (
  <label
    className={`block p-4 rounded-lg border-2 transition-colors cursor-pointer ${
      isSelected ? 'bg-purple-900/50 border-purple-500' : 'bg-slate-800/50 border-slate-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-600'}`}
  >
    <div className="flex items-center">
      <input
        type="radio"
        name="model-option"
        value={value}
        checked={isSelected}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="form-radio h-5 w-5 text-purple-500 bg-slate-700 border-slate-500 focus:ring-purple-400"
      />
      <div className="ml-4">
        <p className="font-bold text-white">{label}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  </label>
);

export default SettingsModal;
