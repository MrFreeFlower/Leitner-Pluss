
import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Card } from '../types';
import { Theme } from '../types';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
  onSave: (id: string, front: string, back: string) => void;
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
  theme: Theme;
}

const themeClasses: Record<Theme, { bg: string; border: string }> = {
    blue: { bg: 'bg-[#56aaff]', border: 'focus:border-[#56aaff]' },
    yellow: { bg: 'bg-yellow-400', border: 'focus:border-yellow-400' },
    green: { bg: 'bg-green-500', border: 'focus:border-green-500' },
    pink: { bg: 'bg-pink-500', border: 'focus:border-pink-500' },
    purple: { bg: 'bg-purple-500', border: 'focus:border-purple-500' },
    pistachio: { bg: 'bg-[#93C572]', border: 'focus:border-[#93C572]' },
    orange: { bg: 'bg-orange-400', border: 'focus:border-orange-400' },
    carnation: { bg: 'bg-[#F95A61]', border: 'focus:border-[#F95A61]' },
    latte: { bg: 'bg-[#C4A484]', border: 'focus:border-[#C4A484]' },
    chocolate: { bg: 'bg-[#5D4037]', border: 'focus:border-[#5D4037]' },
    lavender: { bg: 'bg-[#CE93D8]', border: 'focus:border-[#CE93D8]' },
    iceBlue: { bg: 'bg-[#80DEEA]', border: 'focus:border-[#80DEEA]' },
    magenta: { bg: 'bg-[#FF00FF]', border: 'focus:border-[#FF00FF]' },
    olive: { bg: 'bg-[#808000]', border: 'focus:border-[#808000]' },
    lime: { bg: 'bg-[#00FF00]', border: 'focus:border-[#00FF00]' },
    greenYellow: { bg: 'bg-[#ADFF2F]', border: 'focus:border-[#ADFF2F]' },
    skyBlue: { bg: 'bg-[#00BFFF]', border: 'focus:border-[#00BFFF]' },
};

const buttonThemeClasses: Record<Theme, string> = {
    blue: 'border-[#56aaff] text-[#56aaff]',
    yellow: 'border-yellow-400 text-yellow-400',
    green: 'border-green-500 text-green-500',
    pink: 'border-pink-500 text-pink-500',
    purple: 'border-purple-500 text-purple-500',
    pistachio: 'border-[#93C572] text-[#93C572]',
    orange: 'border-orange-400 text-orange-400',
    carnation: 'border-[#F95A61] text-[#F95A61]',
    latte: 'border-[#C4A484] text-[#C4A484]',
    chocolate: 'border-[#5D4037] text-[#5D4037]',
    lavender: 'border-[#CE93D8] text-[#CE93D8]',
    iceBlue: 'border-[#80DEEA] text-[#80DEEA]',
    magenta: 'border-[#FF00FF] text-[#FF00FF]',
    olive: 'border-[#808000] text-[#808000]',
    lime: 'border-[#00FF00] text-[#00C000]',
    greenYellow: 'border-[#ADFF2F] text-[#9ACD32]',
    skyBlue: 'border-[#00BFFF] text-[#00BFFF]',
};

export const EditCardModal: React.FC<EditCardModalProps> = ({ isOpen, onClose, card, onSave, onDelete, onReset, theme }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const frontRef = useRef<HTMLTextAreaElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);

  // Determine text/icon color for solid light themes
  const isLightTheme = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLightTheme ? 'text-slate-900' : 'text-white';

  // Synchronize internal state with props and handle animation timing
  useEffect(() => {
    if (isOpen && card) {
      // Opening or switching cards
      setActiveCard(card);
      setFront(card.front);
      setBack(card.back);
      setIsClosing(false);
    } else if (!isOpen && activeCard) {
      // Closing: Start exit animation
      setIsClosing(true);
      const timer = setTimeout(() => {
        setActiveCard(null);
        setIsClosing(false);
      }, 325); // Duration matches CSS animation (0.325s)
      return () => clearTimeout(timer);
    }
  }, [isOpen, card, activeCard]);

  // Auto-resize effects
  useEffect(() => {
    if (frontRef.current) {
        frontRef.current.style.height = 'auto';
        frontRef.current.style.height = frontRef.current.scrollHeight + 'px';
    }
  }, [front, activeCard]);

  useEffect(() => {
    if (backRef.current) {
        backRef.current.style.height = 'auto';
        backRef.current.style.height = backRef.current.scrollHeight + 'px';
    }
  }, [back, activeCard]);

  // Only render if we have a card to display (either open or animating out)
  if (!activeCard) return null;

  const handleSave = () => {
    if (front.trim() && back.trim()) {
      onSave(activeCard.id, front.trim(), back.trim());
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(activeCard.id);
    onClose();
  };

  const handleReset = () => {
    onReset(activeCard.id);
    onClose();
  };
  
  const classes = themeClasses[theme];
  const buttonClasses = buttonThemeClasses[theme];

  return (
    <div 
      className={`
        fixed inset-0 z-[70] bg-[#F3F5F9] flex flex-col 
        ${isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up'}
      `}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-2 grid grid-cols-[48px_1fr_48px] items-center flex-shrink-0">
         <button 
            onClick={onClose}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            type="button"
         >
            <X size={24} className="text-slate-900" />
         </button>
         
         <div className="text-center">
            <h2 className="text-2xl font-normal text-slate-900">Edit Card</h2>
            <p className="text-sm text-slate-900 mt-1">Level: {activeCard.level}</p>
         </div>
         
         <button 
            onClick={handleSave}
            disabled={!front.trim() || !back.trim()}
            className={`w-12 h-12 ${classes.bg} rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed`}
            type="button"
         >
            <Check size={24} className={contrastTextColor} />
         </button>
      </div>

      {/* Form Content */}
      <div className="p-5 flex flex-col gap-6 mt-4 flex-1 overflow-y-auto">
        <div>
            <label className="block text-slate-900 text-base font-normal mb-3 pl-1">Front Side</label>
            <textarea
                ref={frontRef}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={1}
                className={`w-full bg-white px-5 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 text-lg focus:outline-none border-2 border-transparent ${classes.border} shadow-sm transition-all duration-500 resize-none overflow-hidden min-h-[56px]`}
            />
        </div>

        <div>
            <label className="block text-slate-900 text-base font-normal mb-3 pl-1">Back Side</label>
            <textarea
                ref={backRef}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={1}
                className={`w-full bg-white px-5 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 text-lg focus:outline-none border-2 border-transparent ${classes.border} shadow-sm transition-all duration-500 resize-none overflow-hidden min-h-[56px]`}
            />
        </div>

        <div className="flex flex-col gap-3 items-center mt-2 pb-6">
            <button
                onClick={handleDelete}
                className="w-fit text-center px-6 py-3 bg-transparent border-2 border-[#e11d48] text-[#e11d48] font-medium rounded-xl text-lg active:scale-95 transition-transform"
            >
                Delete Card
            </button>
            <button
                onClick={handleReset}
                className={`w-fit text-center px-6 py-3 bg-transparent border-2 ${buttonClasses} font-medium rounded-xl text-lg active:scale-95 transition-transform`}
            >
                Study Again
            </button>
        </div>
      </div>
    </div>
  );
};
