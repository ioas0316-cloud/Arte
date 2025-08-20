
import React, { useState, useEffect, useRef } from 'react';

interface ChatLogEntry {
  author: 'user' | 'elysia';
  content: string;
}

interface StoryPanelProps {
  chatLog: ChatLogEntry[];
  isFastForward: boolean;
}

const ElysiaMessage: React.FC<{ text: string, isLastMessage: boolean, isFastForward: boolean }> = ({ text, isLastMessage, isFastForward }) => {
  const [displayedText, setDisplayedText] = useState(isLastMessage && !isFastForward ? '' : text);
  const [isTyping, setIsTyping] = useState(isLastMessage && !isFastForward);

  useEffect(() => {
    if (!isLastMessage || text === displayedText) {
        if (text !== displayedText) setDisplayedText(text);
        if (isTyping) setIsTyping(false);
        return;
    };

    if (isFastForward) {
        setDisplayedText(text);
        setIsTyping(false);
        return;
    }

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [text, isLastMessage, isFastForward]);
  
  return (
    <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
      <p 
        className={isTyping ? 'typing-cursor' : ''}
      >
        {displayedText}
      </p>
    </div>
  );
};

const UserMessage: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="flex justify-end">
            <p 
              className="bg-indigo-800/50 text-indigo-100 rounded-lg rounded-br-none px-4 py-2 text-base max-w-full sm:max-w-[80%] break-words"
            >
                {text}
            </p>
        </div>
    );
}

const StoryPanel: React.FC<StoryPanelProps> = ({ chatLog, isFastForward }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const parent = scrollRef.current?.parentElement;

  useEffect(() => {
    if (parent) {
      parent.scrollTop = parent.scrollHeight;
    }
  }, [chatLog, parent]);

  return (
    <div ref={scrollRef} className="space-y-4 flex flex-col mt-auto">
      <div className="flex-grow"></div>
      <div className="space-y-4">
        {chatLog.map((entry, index) => {
            if (entry.author === 'user') {
            return <UserMessage key={index} text={entry.content} />;
            } else {
            const isLastMessage = index === chatLog.length - 1 && entry.author === 'elysia';
            return <ElysiaMessage key={index} text={entry.content} isLastMessage={isLastMessage} isFastForward={isFastForward} />;
            }
        })}
      </div>
    </div>
  );
};

export default StoryPanel;