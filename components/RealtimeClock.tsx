
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../localization';

const RealtimeClock: React.FC = () => {
  const { lang } = useLanguage();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const locale = lang === 'ko' ? 'ko-KR' : 'en-US';
  const formattedTime = date.toLocaleTimeString(locale, timeOptions);
  const formattedDate = date.toLocaleDateString(locale, dateOptions);

  return (
    <div className="absolute top-4 right-6 z-20 text-right font-mono animate-fade-in-down">
      <p className="text-3xl font-bold text-white" style={{ textShadow: '0 0 8px rgba(167, 139, 250, 0.7)' }}>
        {formattedTime}
      </p>
      <p className="text-sm text-slate-300" style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
        {formattedDate}
      </p>
    </div>
  );
};

export default RealtimeClock;
