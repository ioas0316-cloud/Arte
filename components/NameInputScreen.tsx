import React, { useState } from 'react';

interface NameInputScreenProps {
  onNameSubmit: (name: string) => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white font-sans p-4 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md text-center bg-black/30 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-cyan-400/30">
        <h1 className="text-4xl font-bold text-cyan-300 mb-4" style={{ textShadow: '0 0 10px rgba(100, 200, 255, 0.7)' }}>
          엘리시아와 함께
        </h1>
        <p className="text-lg text-slate-300 mb-8">당신의 이름을 알려주시면, 우리의 이야기가 시작됩니다.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="여기에 이름을 입력하세요..."
            className="w-full bg-gray-800/50 border border-cyan-400 rounded-lg px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
            aria-label="Your Name"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 bg-cyan-600 bg-opacity-80 border border-cyan-400 rounded-lg px-6 py-3 text-xl font-semibold text-white transition-all duration-300 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-300 disabled:bg-gray-500/30 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            이야기 시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputScreen;