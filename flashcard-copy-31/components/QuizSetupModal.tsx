
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface QuizSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number, resetHistory: boolean) => void;
  totalAvailable: number; // Cards in deck
  cardsInCycle: number; // Cards remaining in current unremembered pool
  theme: Theme;
  deckId?: number;
}

const themeClasses: Record<Theme, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-[#56aaff]', text: 'text-[#56aaff]', border: 'border-[#56aaff]' },
    yellow: { bg: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400' },
    green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' },
    pink: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
    pistachio: { bg: 'bg-[#93C572]', text: 'text-[#93C572]', border: 'border-[#93C572]' },
    orange: { bg: 'bg-orange-400', text: 'text-orange-400', border: 'border-orange-400' },
    carnation: { bg: 'bg-[#F95A61]', text: 'text-[#F95A61]', border: 'border-[#F95A61]' },
    latte: { bg: 'bg-[#C4A484]', text: 'text-[#C4A484]', border: 'border-[#C4A484]' },
    chocolate: { bg: 'bg-[#5D4037]', text: 'text-[#5D4037]', border: 'border-[#5D4037]' },
    lavender: { bg: 'bg-[#CE93D8]', text: 'text-[#CE93D8]', border: 'border-[#CE93D8]' },
    iceBlue: { bg: 'bg-[#80DEEA]', text: 'text-[#80DEEA]', border: 'border-[#80DEEA]' },
    magenta: { bg: 'bg-[#FF00FF]', text: 'text-[#FF00FF]', border: 'border-[#FF00FF]' },
    olive: { bg: 'bg-[#808000]', text: 'text-[#808000]', border: 'border-[#808000]' },
    lime: { bg: 'bg-[#00FF00]', text: 'text-[#00C000]', border: 'border-[#00FF00]' },
    greenYellow: { bg: 'bg-[#ADFF2F]', text: 'text-[#9ACD32]', border: 'border-[#ADFF2F]' },
    skyBlue: { bg: 'bg-[#00BFFF]', text: 'text-[#00BFFF]', border: 'border-[#00BFFF]' },
};

export const QuizSetupModal: React.FC<QuizSetupModalProps> = ({ isOpen, onClose, onStart, totalAvailable, cardsInCycle, theme, deckId }) => {
  const [count, setCount] = useState(10);
  const [inputValue, setInputValue] = useState("10");

  // Determine if we are in a "fresh start" scenario (0 cards left means full deck available)
  const isCycleEmpty = cardsInCycle === 0;
  const currentMax = isCycleEmpty ? totalAvailable : cardsInCycle;

  useEffect(() => {
    if (isOpen) {
      // Default to 10 or max available
      const initialCount = Math.min(10, currentMax);
      setCount(initialCount);
      setInputValue(initialCount.toString());
    }
  }, [isOpen, currentMax]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      
      // Allow user to clear input
      if (val === '') {
          setInputValue('');
          return;
      }
      
      let parsed = parseInt(val);
      if (!isNaN(parsed)) {
          // Auto-correct to max if larger
          if (parsed > currentMax) {
              parsed = currentMax;
          }
          setCount(parsed);
          setInputValue(parsed.toString());
      }
  };

  const handleInputBlur = () => {
      if (inputValue === '' || parseInt(inputValue) < 1) {
          setCount(1);
          setInputValue("1");
      } else {
           // Ensure consistency (though onChange handles max, good to be safe)
           let parsed = parseInt(inputValue);
           if (parsed > currentMax) {
               parsed = currentMax;
               setCount(parsed);
               setInputValue(parsed.toString());
           }
      }
  };

  if (!isOpen) return null;

  const classes = themeClasses[theme];
  
  // Determine text color for solid light themes
  const isLightTheme = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLightTheme ? 'text-slate-900' : 'text-white';
  
  // Ensure count is within bounds for submission
  const effectiveCount = Math.min(Math.max(1, count), currentMax);

  const handleStart = () => {
      onStart(effectiveCount, isCycleEmpty);
  };
  
  return (
    <div className="fixed inset-0 z-[60] bg-[#F3F5F9] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8 pt-2">
            <button 
                onClick={onClose}
                className="absolute left-0 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                type="button"
            >
                <X size={20} className="text-slate-900" />
            </button>
            <h2 className="text-2xl font-normal text-slate-900">Quiz Setup</h2>
        </div>
        
        <div className="flex flex-col flex-1 gap-6">
            
            {/* Stats Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-medium">Unseen in Cycle</span>
                    <span className={`text-xl font-bold ${classes.text}`}>
                        {cardsInCycle} / {totalAvailable}
                    </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${classes.bg} transition-all duration-500`}
                        style={{ 
                            width: `${(cardsInCycle / totalAvailable) * 100}%`
                        }}
                    />
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Cards are removed from the cycle when you remember them. The cycle resets automatically when finished.
                </p>
            </div>

            {/* Controls */}
            <div>
                <label className="block text-slate-900 text-lg font-normal mb-4 pl-1 text-center">
                    Number of cards
                </label>
                
                <div className="mb-6 flex justify-center">
                    <div 
                        className={`w-32 h-16 bg-white rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${classes.border}`}
                    >
                        <input 
                            type="number" 
                            min="1" 
                            max={currentMax} 
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={`w-full h-full bg-transparent text-center font-bold text-3xl ${classes.text} outline-none appearance-none m-0 p-0`}
                        />
                    </div>
                </div>
            </div>

            <button 
              onClick={handleStart}
              disabled={effectiveCount < 1}
              className={`w-full py-4 ${classes.bg} ${contrastTextColor} font-medium rounded-2xl active:scale-[0.98] hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md text-lg mt-auto mb-4`}
            >
              Start Quiz
            </button>
        </div>
      </div>
    </div>
  );
};
