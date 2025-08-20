
import React, { useState, useEffect } from 'react';

interface CharacterThoughtsProps {
  thoughts: string;
}

const CharacterThoughts: React.FC<CharacterThoughtsProps> = ({ thoughts }) => {
  const [displayedThoughts, setDisplayedThoughts] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!thoughts || thoughts === '...' || thoughts === displayedThoughts) {
        if (thoughts !== displayedThoughts) setDisplayedThoughts(thoughts);
        return;
    }

    setIsTyping(true);
    setDisplayedThoughts('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < thoughts.length) {
        setDisplayedThoughts(prev => prev + thoughts.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 30); // Typing speed in ms

    return () => clearInterval(intervalId);
  }, [thoughts]);

  // Don't render the component if there are no thoughts to display
  if (!displayedThoughts || displayedThoughts === '...') {
    return null;
  }
  
  return (
    <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-purple-400/30 animate-fade-in">
      <div className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p 
            className={`text-purple-200 italic text-lg leading-relaxed ${isTyping ? 'typing-cursor' : ''}`}
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 12px rgba(192, 132, 252, 0.6)' }}
        >
          "{displayedThoughts}"
        </p>
      </div>
    </div>
  );
};

export default CharacterThoughts;