
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  theme: Theme;
}

const themeClasses: Record<Theme, { bg: string; ring: string; border: string }> = {
    blue: { bg: 'bg-[#56aaff]', ring: 'focus:ring-[#56aaff]/20', border: 'border-[#56aaff]' },
    yellow: { bg: 'bg-yellow-400', ring: 'focus:ring-yellow-400/20', border: 'border-yellow-400' },
    green: { bg: 'bg-green-500', ring: 'focus:ring-green-500/20', border: 'border-green-500' },
    pink: { bg: 'bg-pink-500', ring: 'focus:ring-pink-500/20', border: 'border-pink-500' },
    purple: { bg: 'bg-purple-500', ring: 'focus:ring-purple-500/20', border: 'border-purple-500' },
    pistachio: { bg: 'bg-[#93C572]', ring: 'focus:ring-[#93C572]/20', border: 'border-[#93C572]' },
    orange: { bg: 'bg-orange-400', ring: 'focus:ring-orange-400/20', border: 'border-orange-400' },
    carnation: { bg: 'bg-[#F95A61]', ring: 'focus:ring-[#F95A61]/20', border: 'border-[#F95A61]' },
    latte: { bg: 'bg-[#C4A484]', ring: 'focus:ring-[#C4A484]/20', border: 'border-[#C4A484]' },
    chocolate: { bg: 'bg-[#5D4037]', ring: 'focus:ring-[#5D4037]/20', border: 'border-[#5D4037]' },
    lavender: { bg: 'bg-[#CE93D8]', ring: 'focus:ring-[#CE93D8]/20', border: 'border-[#CE93D8]' },
    iceBlue: { bg: 'bg-[#80DEEA]', ring: 'focus:ring-[#80DEEA]/20', border: 'border-[#80DEEA]' },
    magenta: { bg: 'bg-[#FF00FF]', ring: 'focus:ring-[#FF00FF]/20', border: 'border-[#FF00FF]' },
    olive: { bg: 'bg-[#808000]', ring: 'focus:ring-[#808000]/20', border: 'border-[#808000]' },
    lime: { bg: 'bg-[#00FF00]', ring: 'focus:ring-[#00FF00]/20', border: 'border-[#00FF00]' },
    greenYellow: { bg: 'bg-[#ADFF2F]', ring: 'focus:ring-[#ADFF2F]/20', border: 'border-[#ADFF2F]' },
    skyBlue: { bg: 'bg-[#00BFFF]', ring: 'focus:ring-[#00BFFF]/20', border: 'border-[#00BFFF]' },
};

export const AddDeckModal: React.FC<AddDeckModalProps> = ({ isOpen, onClose, onAdd, theme }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Determine text color for solid light themes
  const isLightTheme = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLightTheme ? 'text-slate-900' : 'text-white';

  useEffect(() => {
    if (isOpen) {
      setName('');
      // Reset height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      // Focus input after a small delay to ensure rendering and transition
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-resize logic
  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [name]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (name.trim()) onAdd(name.trim());
    }
  };
  
  const classes = themeClasses[theme];

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
            <h2 className="text-2xl font-normal text-slate-900">Add New Box</h2>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <label className="block text-slate-900 text-base font-normal mb-3 pl-1">Box name</label>
            <div className="relative mb-1">
                <textarea
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 80))}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Enter box name here"
                    className={`w-full bg-white px-5 py-4 rounded-2xl text-slate-900 placeholder:text-slate-400 text-lg focus:outline-none shadow-sm transition-colors border-2 ${name.trim() ? classes.border : 'border-transparent'} ${classes.border.replace('border-', 'focus:border-')} resize-none overflow-hidden`}
                />
            </div>
            <div className="flex justify-end mb-8 pr-1">
                <span className="text-sm text-slate-300 font-medium">{name.length}/80</span>
            </div>

            <button 
              type="submit"
              disabled={!name.trim()}
              className={`w-full py-4 ${classes.bg} ${contrastTextColor} font-medium rounded-2xl active:scale-[0.98] hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md text-lg mt-auto mb-4`}
            >
              Add Box
            </button>
        </form>
      </div>
    </div>
  );
};
