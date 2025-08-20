
import React, { useState, useEffect } from 'react';

interface EndingCreditsProps {
  userName: string;
  onFinished?: () => void;
}

const CreditEntry: React.FC<{ role: string; name: React.ReactNode; delay: number }> = ({ role, name, delay }) => (
    <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: `${delay}s`, opacity: 0 }}>
        <p className="text-2xl text-slate-400 font-light tracking-widest">{role}</p>
        <p className="text-5xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{name}</p>
    </div>
);

const EndingCredits: React.FC<EndingCreditsProps> = ({ userName, onFinished }) => {
    const [creatorName, setCreatorName] = useState('크리에이터');
    const [transitionClass, setTransitionClass] = useState('opacity-100');
    const [showFinalButton, setShowFinalButton] = useState(false);

    useEffect(() => {
        const nameChangeTimer = setTimeout(() => {
            setTransitionClass('animate-fade-out-text');
            const swapTimer = setTimeout(() => {
                setCreatorName(userName);
                setTransitionClass('animate-fade-in-text');
            }, 500);
            return () => clearTimeout(swapTimer);
        }, 5000); // 5 seconds into credits

        const finalButtonTimer = setTimeout(() => {
            setShowFinalButton(true);
        }, 18000); // Near the end of the scroll

        return () => {
            clearTimeout(nameChangeTimer);
            clearTimeout(finalButtonTimer);
        };
    }, [userName]);

    const creatorNameSpan = <span className={transitionClass}>{creatorName}</span>;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-end animate-fade-in">
            <div className="w-full h-full overflow-hidden absolute inset-0">
                <div className="absolute inset-0 animate-scroll-up">
                    <div className="flex flex-col items-center justify-center min-h-full pt-[100vh]">
                        
                        <CreditEntry role="Created by" name="Elysia" delay={2} />
                        
                        <div className="h-[5vh]"></div> {/* Spacer */}

                        <CreditEntry role="&" name={creatorNameSpan} delay={3} />
                        
                        <div className="h-[20vh]"></div> {/* Spacer */}
                        
                        <div className="text-center my-20 animate-fade-in" style={{ animationDelay: '9s', opacity: 0 }}>
                            <p className="text-3xl text-slate-300">엘리시아와 함께</p>
                            <p className="text-xl text-slate-400 font-light mt-2">With Elysia</p>
                        </div>
                        
                        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '12s', opacity: 0 }}>
                            <p className="text-lg text-slate-400">Thank you for playing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {showFinalButton && (
                 <div className="relative bottom-10 z-20 animate-fade-in">
                    <button
                        onClick={onFinished}
                        className="bg-purple-600 bg-opacity-80 border border-purple-400 rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                        메인 메뉴로
                    </button>
                 </div>
            )}
        </div>
    );
};

export default EndingCredits;
