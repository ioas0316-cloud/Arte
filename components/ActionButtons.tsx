
import React from 'react';

interface ActionButtonsProps {
  choices: string[];
  onActionSelect: (choice: string) => void;
  isLoading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ choices, onActionSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {choices.map((choice) => (
        <button
          key={choice}
          onClick={() => onActionSelect(choice)}
          disabled={isLoading}
          className="w-full text-center bg-cyan-600 bg-opacity-50 border border-cyan-400 rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all duration-300
                     hover:bg-cyan-500 hover:bg-opacity-70 hover:shadow-lg hover:shadow-cyan-500/30
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-300
                     disabled:bg-gray-500 disabled:bg-opacity-30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
