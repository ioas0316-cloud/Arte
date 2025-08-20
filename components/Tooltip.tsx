

import React, { useState, useLayoutEffect, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tooltipRef.current && triggerRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      // A small buffer to prevent sticking to the edge
      const buffer = 5; 
      
      if (rect.top < buffer) {
        setPosition('bottom');
      } else {
        // Check if it fits on top before resetting
        const triggerRect = triggerRef.current.getBoundingClientRect();
        if (triggerRect.top - rect.height - buffer > 0) {
            setPosition('top');
        }
      }
    }
  }, [text, children]); // Re-check when content or children change which might affect position

  const positionClasses = position === 'top' 
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' 
    : 'top-full left-1/2 -translate-x-1/2 mt-2';
  
  return (
    <div ref={triggerRef} className="relative group flex items-center justify-center">
      {children}
      <div 
        ref={tooltipRef}
        className={`absolute w-max max-w-xs p-2 bg-slate-900 text-white text-sm border border-[var(--border-color)] rounded-lg shadow-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${positionClasses}`}
        role="tooltip"
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;