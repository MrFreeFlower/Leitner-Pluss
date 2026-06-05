
import React from 'react';
import { X, Box } from 'lucide-react';
import { Deck } from '../types';
import { Theme } from '../types';

interface MoveCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  currentDeckId: number;
  onMove: (targetDeckId: number) => void;
  theme: Theme;
}

const themeClasses: Record<Theme, { bg: string }> = {
    blue: { bg: 'text-[#56aaff]' },
    yellow: { bg: 'text-yellow-400' },
    green: { bg: 'text-green-500' },
    pink: { bg: 'text-pink-500' },
    purple: { bg: 'text-purple-500' },
    pistachio: { bg: 'text-[#93C572]' },
    orange: { bg: 'text-orange-400' },
    carnation: { bg: 'text-[#F95A61]' },
    latte: { bg: 'text-[#C4A484]' },
    chocolate: { bg: 'text-[#5D4037]' },
    lavender: { bg: 'text-[#CE93D8]' },
    iceBlue: { bg: 'text-[#80DEEA]' },
    magenta: { bg: 'text-[#FF00FF]' },
    olive: { bg: 'text-[#808000]' },
    lime: { bg: 'text-[#00FF00]' },
    greenYellow: { bg: 'text-[#ADFF2F]' },
    skyBlue: { bg: 'text-[#00BFFF]' },
};

export const MoveCardsModal: React.FC<MoveCardsModalProps> = ({ isOpen, onClose, decks, currentDeckId, onMove, theme }) => {
  if (!isOpen) return null;

  const availableDecks = decks.filter(d => d.id !== currentDeckId);
  const classes = themeClasses[theme];

  return (
    <div className="fixed inset-0 z-[80] bg-[#F3F5F9] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 pt-6 pb-2 flex items-center justify-between flex-shrink-0">
           <div className="relative w-12 h-12">
             <button 
                onClick={onClose}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                type="button"
             >
                <X size={24} className="text-slate-900" />
             </button>
           </div>
           
           <h2 className="text-2xl font-normal text-slate-900">Move to...</h2>
           <div className="w-12"></div> {/* Spacer */}
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
            {availableDecks.length > 0 ? (
                availableDecks.map(deck => (
                    <button
                        key={deck.id}
                        onClick={() => {
                            onMove(deck.id);
                            onClose();
                        }}
                        className="bg-white p-4 rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center gap-4 text-left"
                    >
                        <div 
                            className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${classes.bg}`}
                        >
                            <Box size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg text-slate-900 font-normal">{deck.title}</h3>
                            <p className="text-sm text-slate-500">{deck.totalCards} cards</p>
                        </div>
                    </button>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center pt-20 opacity-50">
                    <p className="text-lg text-slate-500">No other boxes available</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
