
import React from 'react';
import { Plus } from 'lucide-react';
import { Theme } from '../types';

interface FloatingActionButtonProps {
  onClick: () => void;
  theme: Theme;
}

const themeClasses: Record<Theme, { bg: string; hoverBg: string }> = {
    blue: { bg: 'bg-[#56aaff]', hoverBg: 'hover:bg-blue-500' },
    yellow: { bg: 'bg-yellow-400', hoverBg: 'hover:bg-yellow-500' },
    green: { bg: 'bg-green-500', hoverBg: 'hover:bg-green-600' },
    pink: { bg: 'bg-pink-500', hoverBg: 'hover:bg-pink-600' },
    purple: { bg: 'bg-purple-500', hoverBg: 'hover:bg-purple-600' },
    pistachio: { bg: 'bg-[#93C572]', hoverBg: 'hover:brightness-95' },
    orange: { bg: 'bg-orange-400', hoverBg: 'hover:bg-orange-500' },
    carnation: { bg: 'bg-[#F95A61]', hoverBg: 'hover:brightness-95' },
    latte: { bg: 'bg-[#C4A484]', hoverBg: 'hover:brightness-95' },
    chocolate: { bg: 'bg-[#5D4037]', hoverBg: 'hover:bg-[#4E342E]' },
    lavender: { bg: 'bg-[#CE93D8]', hoverBg: 'hover:bg-[#BA68C8]' },
    iceBlue: { bg: 'bg-[#80DEEA]', hoverBg: 'hover:bg-[#4DD0E1]' },
    magenta: { bg: 'bg-[#FF00FF]', hoverBg: 'hover:bg-[#E000E0]' },
    olive: { bg: 'bg-[#808000]', hoverBg: 'hover:bg-[#666600]' },
    lime: { bg: 'bg-[#00FF00]', hoverBg: 'hover:bg-[#00E000]' },
    greenYellow: { bg: 'bg-[#ADFF2F]', hoverBg: 'hover:bg-[#9ACD32]' },
    skyBlue: { bg: 'bg-[#00BFFF]', hoverBg: 'hover:bg-[#009ACD]' },
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, theme }) => {
  const classes = themeClasses[theme];
  
  // Determine if we need dark text for contrast on light backgrounds (Lime, GreenYellow)
  const isLight = ['lime', 'greenYellow'].includes(theme);
  const textColorClass = isLight ? 'text-slate-900' : 'text-white';

  return (
    <button 
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 ${classes.bg} rounded-full flex items-center justify-center shadow-lg ${classes.hoverBg} transition-colors active:scale-95 z-50`}
      aria-label="Add new deck"
    >
      <Plus className={`${textColorClass} w-8 h-8`} />
    </button>
  );
};
