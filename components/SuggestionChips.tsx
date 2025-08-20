

import React from 'react';
import { useLanguage } from '../localization';

interface SuggestionChipsProps {
  choices: string[];
  onActionSelect: (choice: string) => void;
  isLoading: boolean;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ choices, onActionSelect, isLoading }) => {
  const { t } = useLanguage();
  if (choices.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-slate-400 mr-2">{t('suggestionPrefix')}</span>
        {choices.map((choice) => {
            const isElysiaSuggestion = choice.startsWith('[엘리시아의 제안]') || choice.startsWith("[Elysia's Suggestion]");
            const isCriticalChoice = choice.startsWith('[!!]');
            
            let displayChoice = choice;
            if (isElysiaSuggestion) {
                displayChoice = `✨ ${choice.replace(/\[(엘리시아의 제안|Elysia's Suggestion)\]/g, '').trim()}`;
            } else if (isCriticalChoice) {
                displayChoice = `⚠️ ${choice.replace('[!!]', '').trim()}`;
            }

            const baseClasses = "text-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-700/30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed";
            const userChoiceClasses = "bg-indigo-800/50 border border-indigo-600/70 text-indigo-200 hover:bg-indigo-700/70 hover:border-indigo-500 focus:ring-indigo-400";
            const elysiaChoiceClasses = "bg-purple-800/50 border border-purple-600/70 text-purple-200 hover:bg-purple-700/70 hover:border-purple-500 focus:ring-purple-400";
            const criticalChoiceClasses = "bg-red-900/50 border-2 border-red-500/70 text-red-200 hover:bg-red-800/70 hover:border-red-400 focus:ring-red-400 animate-critical-pulse";

            const getButtonClasses = () => {
                if (isCriticalChoice) return criticalChoiceClasses;
                if (isElysiaSuggestion) return elysiaChoiceClasses;
                return userChoiceClasses;
            }

            return (
                <button
                key={choice}
                onClick={() => onActionSelect(choice)}
                disabled={isLoading}
                className={`${baseClasses} ${getButtonClasses()}`}
                >
                {displayChoice}
                </button>
            )
        })}
    </div>
  );
};

export default SuggestionChips;
