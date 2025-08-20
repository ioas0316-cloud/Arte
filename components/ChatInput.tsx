

import React, { useState } from 'react';
import { useLanguage } from '../localization';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, userInput, setUserInput }) => {
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onSendMessage(userInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={t('chatPlaceholder')}
        disabled={isLoading}
        className="flex-grow bg-gray-800/50 border border-purple-400/30 rounded-lg px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        aria-label="Your message to Elysia"
      />
      <button
        type="submit"
        disabled={isLoading || !userInput.trim()}
        className="p-3 bg-indigo-600 bg-opacity-70 border border-indigo-400/50 rounded-full text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400 disabled:bg-gray-500/30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
