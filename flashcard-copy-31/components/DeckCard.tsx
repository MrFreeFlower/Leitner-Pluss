
import React, { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Deck, Theme } from '../types';
import { BoxIcon } from './BoxIcon';

interface DeckCardProps {
  deck: Deck;
  onClick: (deck: Deck) => void;
  onDelete: (id: number, source?: 'swipe') => void;
  theme: Theme;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onClick, onDelete, theme }) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;

    // Detect horizontal swipe intention
    if (Math.abs(diff) > 10) {
      isDragging.current = true;
    }

    // Only allow swiping left (negative values)
    if (diff < 0) {
      // Direct 1-to-1 movement following finger
      setOffsetX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (startX.current === null) return;
    
    // Threshold to trigger delete (swipe 120px to the left)
    if (offsetX < -120) {
      // Animate off screen completely
      setOffsetX(-window.innerWidth); 
      // Trigger delete after animation
      setTimeout(() => onDelete(deck.id, 'swipe'), 300);
    } else {
      // Snap back to original position
      setOffsetX(0);
    }
    
    startX.current = null;
    // We keep isDragging true for a moment to prevent the onClick firing immediately after a release
    setTimeout(() => {
        isDragging.current = false;
    }, 50);
  };

  // Get current time to ensure real-time status updates
  const now = Date.now();
  const nowObj = new Date(now);
  const endOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();

  // Calculate dynamic count for today based on endOfToday, EXCLUDING Level 8
  const dynamicCardsToday = deck.cards 
    ? deck.cards.filter(c => (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8).length
    : deck.cardsToday;

  // Calculate box status dynamically based on cards in the deck
  const getBoxStatus = (level: number) => {
    if (!deck.cards || deck.cards.length === 0) return false;
    // A box is active if there is at least one card in that level that is due by end of today
    return deck.cards.some(c => c.level === level && (!c.dueDate || c.dueDate <= endOfToday));
  };

  // Helper for truncation with space
  const truncate = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + ' ...';
  };

  return (
    <div className="relative mb-3 overflow-hidden rounded-lg select-none">
      {/* Background Delete Layer */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 gap-3 rounded-lg">
        <span className="text-white font-bold text-xl">Delete</span>
        <Trash2 className="text-white w-6 h-6" />
      </div>

      {/* Foreground Card */}
      <div 
        onClick={() => {
          // Only trigger click if not dragging and not currently swiped open/deleting
          if (!isDragging.current && offsetX === 0) {
            onClick(deck);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: startX.current !== null ? 'none' : 'transform 0.3s ease-out',
        }}
        className="relative bg-white p-5 shadow-sm rounded-lg active:bg-gray-50 touch-pan-y"
      >
        <h3 className="text-xl font-normal text-slate-800 mb-1 truncate">
          {truncate(deck.title, 24)}
        </h3>
        <p className="text-base text-slate-800 mb-4">
          cards total: {deck.totalCards}, cards for today: {dynamicCardsToday}
        </p>
        
        <div className="flex flex-row gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((level) => {
            return (
              <BoxIcon key={level} active={getBoxStatus(level)} theme={theme} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
