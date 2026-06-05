
import React, { useState, useRef } from 'react';
import { Trash2, Check, Star } from 'lucide-react';
import { Card } from '../types';
import { Theme } from '../types';

interface CardItemProps {
  card: Card;
  index: number;
  isSearchOpen: boolean; // Used to determine if checkbox is visible/interactive
  onDelete: (id: string, source?: 'swipe') => void;
  onClick: (card: Card) => void;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  theme: Theme;
  activeTimerId: string | null;
  onToggleTimer: (id: string) => void;
  onLongPress: (id: string) => void;
}

const themeClasses: Record<Theme, { bg: string; border: string }> = {
    blue: { bg: 'bg-[#56aaff]', border: 'border-[#56aaff]' },
    yellow: { bg: 'bg-yellow-400', border: 'border-yellow-400' },
    green: { bg: 'bg-green-500', border: 'border-green-500' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-500' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-500' },
    pistachio: { bg: 'bg-[#93C572]', border: 'border-[#93C572]' },
    orange: { bg: 'bg-orange-400', border: 'border-orange-400' },
    carnation: { bg: 'bg-[#F95A61]', border: 'border-[#F95A61]' },
    latte: { bg: 'bg-[#C4A484]', border: 'border-[#C4A484]' },
    chocolate: { bg: 'bg-[#5D4037]', border: 'border-[#5D4037]' },
    lavender: { bg: 'bg-[#CE93D8]', border: 'border-[#CE93D8]' },
    iceBlue: { bg: 'bg-[#80DEEA]', border: 'border-[#80DEEA]' },
    magenta: { bg: 'bg-[#FF00FF]', border: 'border-[#FF00FF]' },
    olive: { bg: 'bg-[#808000]', border: 'border-[#808000]' },
    lime: { bg: 'bg-[#00FF00]', border: 'border-[#00FF00]' },
    greenYellow: { bg: 'bg-[#ADFF2F]', border: 'border-[#ADFF2F]' },
    skyBlue: { bg: 'bg-[#00BFFF]', border: 'border-[#00BFFF]' },
};

export const CardItem: React.FC<CardItemProps> = ({ card, index, isSearchOpen, onDelete, onClick, isSelected, onSelectToggle, theme, activeTimerId, onToggleTimer, onLongPress }) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const longPressTimerRef = useRef<any>(null);
  const isLongPressTriggeredRef = useRef(false);
  
  const classes = themeClasses[theme];

  const showTimer = activeTimerId === card.id;
  const isMastered = card.level >= 8;

  // Time Logic
  const now = Date.now();
  const nowObj = new Date(now);
  const startOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 0, 0, 0, 0).getTime();
  const endOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();

  // "isDue" determines if the card counts towards today's study goal
  // Logic: Card is due if it has no date, OR its date is before the end of today.
  const isDue = (!card.dueDate || card.dueDate <= endOfToday) && !isMastered;
  
  // "isOverdue" means the card was due strictly before today (yesterday or earlier)
  const isOverdue = card.dueDate && card.dueDate < startOfToday;
  
  let label = '';
  let timeText = '';

  // Calculate calendar days difference
  const dueObj = new Date(card.dueDate || 0);
  const todayZero = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate());
  const dueZero = new Date(dueObj.getFullYear(), dueObj.getMonth(), dueObj.getDate());
  
  const diffTime = dueZero.getTime() - todayZero.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (isDue) {
      label = 'Next study :';
      if (diffDays < 0) {
          // Overdue: Show negative days (e.g., "-3 days")
          timeText = `${diffDays} days`;
      } else {
          // Due today (diffDays === 0)
          timeText = 'Today';
      }
  } else {
      // If future, show calendar days until available
      label = 'Next study date :';
      timeText = diffDays <= 1 ? '1 day' : `${diffDays} days`;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // If we start interacting with the card (swipe), close timer if it's open on this card (or any other)
    if (activeTimerId) onToggleTimer(activeTimerId); 
    
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
    isLongPressTriggeredRef.current = false;

    // Start long press detection
    longPressTimerRef.current = setTimeout(() => {
        if (!isDragging.current) {
            isLongPressTriggeredRef.current = true;
            if (navigator.vibrate) navigator.vibrate(50);
            onLongPress(card.id);
        }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;

    if (Math.abs(diff) > 10) {
      isDragging.current = true;
      // Cancel long press if moved significantly
      if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
      }
    }

    if (diff < 0) {
      setOffsetX(diff);
    }
  };

  const handleTouchEnd = () => {
    // Cancel long press timer if it hasn't fired yet
    if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
    }

    if (startX.current === null) return;
    
    // If long press triggered, do not snap or delete, just reset
    if (isLongPressTriggeredRef.current) {
        startX.current = null;
        return;
    }

    if (offsetX < -100) {
      setOffsetX(-window.innerWidth); 
      setTimeout(() => onDelete(card.id, 'swipe'), 300);
    } else {
      setOffsetX(0);
    }
    
    startX.current = null;
    setTimeout(() => {
        isDragging.current = false;
    }, 50);
  };

  // Helper for truncation with space
  const truncate = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + ' ...';
  };

  // Logic for colors
  // Default (not due): text-slate-600 (Gray)
  // Due Today: text-slate-900 (Black) - regardless of level
  // Overdue: text-red-500 (Red)
  
  const isDueToday = isDue && !isOverdue;

  const levelTextColor = isDueToday 
    ? 'text-slate-900' 
    : (isOverdue ? 'text-red-500' : 'text-slate-600');
    
  const popupTimeTextColor = isDueToday
    ? 'text-slate-900'
    : (isOverdue ? 'text-red-500' : 'text-slate-900');

  return (
    <div className={`relative rounded-lg select-none ${showTimer ? 'z-50 overflow-visible' : 'overflow-hidden'}`}>
      {/* Background Delete Layer */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 gap-3 rounded-lg">
        <span className="text-white font-bold text-base">Delete</span>
        <Trash2 className="text-white w-5 h-5" />
      </div>

      {/* Foreground Card */}
      <div 
        onClick={() => {
           if (isLongPressTriggeredRef.current) return;
           
           if (!isDragging.current && offsetX === 0) {
             if (activeTimerId) onToggleTimer(activeTimerId);
             onClick(card);
           }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: startX.current !== null ? 'none' : 'transform 0.3s ease-out',
        }}
        className="bg-[#F3F5F9] py-2 pl-4 pr-3 rounded-lg flex items-start gap-3 relative z-10 touch-pan-y border border-transparent active:border-slate-200 transition-colors"
      >
        {/* Checkbox */}
        {isSearchOpen && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectToggle(card.id);
            }}
            className={`w-5 h-5 mt-1 rounded border-[1.5px] flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${isSelected ? classes.bg + ' border-transparent' : 'border-slate-400 bg-white'}`}
          >
            {isSelected && <Check size={14} className="text-white" />}
          </div>
        )}
        
        {/* Truncated text */}
        <span className="text-slate-800 text-base font-normal flex-1 truncate py-0.5">
            {truncate(card.front, 32)}
        </span>
        
        {/* Level Indicator */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onToggleTimer(card.id);
          }}
          className="relative w-7 h-7 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          {isMastered ? (
             <Star size={16} className="text-slate-600" strokeWidth={1.5} />
          ) : (
             <span className={`text-sm font-medium ${levelTextColor}`}>{card.level}</span>
          )}

          {/* Timer Popover */}
          {showTimer && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.08)] z-50 flex items-center gap-2 border border-slate-100 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 origin-right">
                 {isMastered ? (
                    <span className="text-slate-500 font-medium text-xs tracking-wide">Card Mastered</span>
                 ) : (
                    <>
                        <span className="text-slate-500 font-medium text-xs tracking-wide">{label}</span>
                        <span className={`font-bold text-sm ${popupTimeTextColor}`}>
                            {timeText}
                        </span>
                    </>
                 )}
                 {/* Arrow pointing right */}
                 <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
