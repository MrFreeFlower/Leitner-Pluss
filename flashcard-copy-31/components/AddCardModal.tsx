
import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Theme } from '../types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (front: string, back: string) => void;
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

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd, theme }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const frontInputRef = useRef<HTMLTextAreaElement>(null);
  const backInputRef = useRef<HTMLTextAreaElement>(null);

  // Determine text/icon color for solid light themes
  const isLightTheme = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLightTheme ? 'text-slate-900' : 'text-white';

  useEffect(() => {
    if (isOpen) {
      setFront('');
      setBack('');
      // Reset heights
      if (frontInputRef.current) frontInputRef.current.style.height = 'auto';
      if (backInputRef.current) backInputRef.current.style.height = 'auto';
      
      // Focus the first input when modal opens
      setTimeout(() => frontInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-resize effects
  useEffect(() => {
    if (frontInputRef.current) {
        frontInputRef.current.style.height = 'auto';
        frontInputRef.current.style.height = frontInputRef.current.scrollHeight + 'px';
    }
  }, [front]);

  useEffect(() => {
    if (backInputRef.current) {
        backInputRef.current.style.height = 'auto';
        backInputRef.current.style.height = backInputRef.current.scrollHeight + 'px';
    }
  }, [back]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (front.trim() && back.trim()) {
      onAdd(front.trim(), back.trim());
    }
  };

  const classes = themeClasses[theme];

  return (
    <div className="fixed inset-0 z-[70] bg-[#F3F5F9] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between flex-shrink-0">
         <button 
            onClick={onClose}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            type="button"
         >
            <X size={24} className="text-slate-900" />
         </button>
         
         <h2 className="text-2xl font-normal text-slate-900">Add New Card</h2>
         
         <button 
            onClick={handleSubmit}
            disabled={!front.trim() || !back.trim()}
            className={`w-12 h-12 ${classes.bg} rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed`}
            type="button"
         >
            <Check size={24} className={contrastTextColor} />
         </button>
      </div>

      {/* Form Content */}
      <div className="p-5 flex flex-col gap-8 mt-2 overflow-y-auto">
        <div>
            <label className="block text-slate-900 text-base font-normal mb-3 pl-1">Front Side</label>
            <textarea
                ref={frontInputRef}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={1}
                placeholder="Enter front side content here"
                className={`w-full bg-white px-5 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 text-lg focus:outline-none border-2 border-transparent ${classes.border} shadow-sm transition-all duration-200 resize-none overflow-hidden min-h-[56px]`}
            />
        </div>

        <div>
            <label className="block text-slate-900 text-base font-normal mb-3 pl-1">Back Side</label>
            <textarea
                ref={backInputRef}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={1}
                placeholder="Enter back side content here"
                className={`w-full bg-white px-5 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 text-lg focus:outline-none border-2 border-transparent ${classes.border} shadow-sm transition-all duration-200 resize-none overflow-hidden min-h-[56px]`}
            />
        </div>
      </div>
    </div>
  );
};
