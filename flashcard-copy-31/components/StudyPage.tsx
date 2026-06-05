
import React, { useState } from 'react';
import { ArrowLeft, Volume2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Deck, Card, Theme } from '../types';

interface StudyPageProps {
  deck: Deck;
  onBack: () => void;
  onFinish: () => void;
  theme: Theme;
  onResult: (cardId: string, success: boolean) => void;
  targetLevel?: number;
  overrideCards?: Card[]; // Added for Quiz Mode
}

const themeClasses: Record<Theme, string> = {
  blue: 'bg-[#56aaff]',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  pistachio: 'bg-[#93C572]',
  orange: 'bg-orange-400',
  carnation: 'bg-[#F95A61]',
  latte: 'bg-[#C4A484]',
  chocolate: 'bg-[#5D4037]',
  lavender: 'bg-[#CE93D8]',
  iceBlue: 'bg-[#80DEEA]',
  magenta: 'bg-[#FF00FF]',
  olive: 'bg-[#808000]',
  lime: 'bg-[#00FF00]',
  greenYellow: 'bg-[#ADFF2F]',
  skyBlue: 'bg-[#00BFFF]',
};

export const StudyPage: React.FC<StudyPageProps> = ({ deck, onBack, onFinish, theme, onResult, targetLevel, overrideCards }) => {
  // Filter only due cards on mount OR use overrideCards if provided
  const [studyCards] = useState(() => {
      if (overrideCards && overrideCards.length > 0) {
          return overrideCards;
      }

      const now = Date.now();
      const nowObj = new Date(now);
      const endOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();

      const dueCards = deck.cards?.filter(c => {
        const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
        const matchesTargetLevel = targetLevel === undefined || c.level === targetLevel;
        return isDue && matchesTargetLevel;
      }) || [];

      // Fisher-Yates Shuffle
      const shuffled = [...dueCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [enableTransition, setEnableTransition] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 250); // Matches animation duration
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
        onFinish();
    }, 250);
  };

  // Fallback if no due cards
  if (studyCards.length === 0) {
    return (
        <div className={`min-h-screen bg-[#F3F5F9] flex flex-col items-center justify-center p-6 ${isExiting ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
            <p className="text-slate-500 mb-4">No cards available.</p>
            <button onClick={handleExit} className="text-blue-500 font-medium">Go Back</button>
        </div>
    );
  }

  const currentCard = studyCards[currentIndex];
  const totalCards = studyCards.length;

  const handleNext = () => {
      setEnableTransition(false);
      setShowAnswer(false);
      setHasRevealed(false);
      if (currentIndex < totalCards - 1) {
          setCurrentIndex(currentIndex + 1);
      } else {
          handleComplete();
      }
  };
  
  const handleResult = (success: boolean) => {
      onResult(currentCard.id, success);
      handleNext();
  };

  const handleShowAnswer = () => {
      setEnableTransition(true);
      setShowAnswer(true);
      setHasRevealed(true);
  };

  const activeColorClass = themeClasses[theme];
  const isQuizMode = !!overrideCards;
  
  // Determine text color for solid light themes
  const isLight = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLight ? 'text-slate-900' : 'text-white';

  return (
    <div className={`min-h-screen bg-[#F3F5F9] flex flex-col relative ${isExiting ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between relative z-10">
        <button 
            onClick={handleExit} 
            className="p-2 -ml-2 rounded-full active:bg-slate-200/50 transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-900" />
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-2xl font-normal text-slate-900">
                {currentIndex + 1}/{totalCards}
            </span>
            {isQuizMode && <span className="text-xs text-slate-400 font-medium">Quiz Mode</span>}
        </div>
        
        <div className="w-10"></div> {/* Spacer for balance */}
      </header>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-200 mt-2 mb-6 mx-auto max-w-[92%] rounded-full overflow-hidden">
          <div 
            className={`h-full ${activeColorClass} transition-all duration-300`} 
            style={{ 
                width: `${((currentIndex + 1) / totalCards) * 100}%`
            }}
          />
      </div>

      {/* Card Container */}
      <main className="flex-1 px-4 pb-6 flex flex-col" style={{ perspective: '1000px' }}>
        <div 
          className={`relative flex-1 ${enableTransition ? 'transition-transform duration-500' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)' 
          }}
        >
          {/* Front Face */}
          <div 
            onClick={handleShowAnswer}
            className="absolute inset-0 bg-white rounded-2xl shadow-sm flex flex-col p-8 cursor-pointer active:scale-[0.98] transition-transform duration-100"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {/* Card Content (Centered with Safe Scroll) */}
            <div className="flex-1 w-full overflow-y-auto">
              <div className="min-h-full flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl text-slate-800 font-normal leading-relaxed break-words whitespace-pre-wrap w-full">
                      {currentCard.front}
                  </h2>
              </div>
            </div>

            {/* Card Footer Info */}
            <div className="flex justify-between items-center mt-auto pt-4 flex-shrink-0">
               <button 
                onClick={(e) => e.stopPropagation()}
                className="p-2 -ml-2 text-slate-400 active:text-slate-600 transition-colors"
               >
                  <Volume2 size={24} />
               </button>
               <span className="text-slate-400 text-sm font-medium">Level {currentCard.level}</span>
            </div>
          </div>

          {/* Back Face */}
          <div 
             onClick={() => setShowAnswer(false)}
             className="absolute inset-0 bg-white rounded-2xl shadow-sm flex flex-col p-8 cursor-pointer active:scale-[0.98] transition-transform duration-100"
             style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)' 
             }}
          >
            {/* Answer Content (Centered with Safe Scroll) */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center justify-center text-center">
                    <p className="text-xl text-slate-800 font-normal leading-relaxed break-words whitespace-pre-wrap w-full">
                        {currentCard.back}
                    </p>
                </div>
            </div>

            {/* Card Footer Info (Replicated) */}
            <div className="flex justify-between items-center mt-auto pt-4 flex-shrink-0">
               <button 
                onClick={(e) => e.stopPropagation()}
                className="p-2 -ml-2 text-slate-400 active:text-slate-600 transition-colors"
               >
                  <Volume2 size={24} />
               </button>
               <span className="text-slate-400 text-sm font-medium">Level {currentCard.level}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Action Button */}
      <div className="px-4 pb-8 pt-2">
        {!hasRevealed ? (
            <button 
                onClick={handleShowAnswer}
                className={`w-full h-12 flex items-center justify-center ${activeColorClass} ${contrastTextColor} font-medium rounded-xl text-lg shadow-sm active:scale-[0.98] transition-all`}
            >
                Show Answer
            </button>
        ) : (
            <div className="flex gap-4">
                <button 
                    onClick={() => handleResult(false)}
                    className="flex-1 h-12 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center active:bg-slate-300 active:scale-[0.98] transition-all shadow-sm"
                    aria-label="Dislike"
                >
                    <ThumbsDown size={18} strokeWidth={2} />
                </button>
                <button 
                    onClick={() => handleResult(true)}
                    className={`flex-1 h-12 ${activeColorClass} ${contrastTextColor} rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform shadow-lg`}
                    aria-label="Like"
                >
                    <ThumbsUp size={18} strokeWidth={2} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
