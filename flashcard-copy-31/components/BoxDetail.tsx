
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Star, ChevronDown, ChevronRight, Plus, FileDown, FileUp, Pencil, Trash2, X, FolderInput, Bot } from 'lucide-react';
import { Deck, Card, Theme, getThemeHex } from '../types';
import { AddCardModal } from './AddCardModal';
import { EditCardModal } from './EditCardModal';
import { RenameDeckModal } from './RenameDeckModal';
import { ConfirmationModal } from './ConfirmationModal';
import { MoveCardsModal } from './MoveCardsModal';
import { CardItem } from './CardItem';

interface BoxDetailProps {
  deck: Deck;
  seed: number;
  allDecks?: Deck[];
  onBack: () => void;
  onAddCard?: (front: string, back: string) => void;
  onImportCards?: (deckId: number, cards: { front: string, back: string, level: number, daysLeft?: number }[]) => void;
  onDeleteCard?: (cardId: string) => void;
  onDeleteCards?: (cardIds: string[]) => void;
  onMoveCards?: (targetDeckId: number, cardIds: string[]) => void;
  onEditCard?: (cardId: string, front: string, back: string) => void;
  onDeleteDeck?: (deckId: number) => void;
  onRenameDeck?: (deckId: number, newName: string) => void;
  onStudy: (deck: Deck, level?: number) => void;
  onQuizSetup?: () => void;
  onResetCard?: (cardId: string) => void;
  theme: Theme;
  onInteraction?: () => void;
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

const NumberOneIcon = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5v14M8 9l4-4" />
    </svg>
);

export const BoxDetail: React.FC<BoxDetailProps> = ({ deck, seed, allDecks = [], onBack, onAddCard, onImportCards, onDeleteCard, onDeleteCards, onMoveCards, onEditCard, onDeleteDeck, onRenameDeck, onStudy, onQuizSetup, onResetCard, theme, onInteraction }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedLevelFilters, setSelectedLevelFilters] = useState<Set<number | 'done'>>(new Set());
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const [activeTimerCardId, setActiveTimerCardId] = useState<string | null>(null);

  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [swipeResetToken, setSwipeResetToken] = useState(0);

  const [isSelectionMenuOpen, setIsSelectionMenuOpen] = useState(false);
  
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const [studyMode, setStudyMode] = useState<'study' | 'quiz'>('study');
  const studySwipeStartX = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isLightTheme = ['lime', 'greenYellow'].includes(theme);
  const contrastTextColor = isLightTheme ? 'text-slate-900' : 'text-white';

  const classes = themeClasses[theme];
  const cards = deck.cards || [];
  const hasCards = cards.length > 0;
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTimerCardId) {
      const timer = setTimeout(() => {
        setActiveTimerCardId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTimerCardId]);

  const endOfToday = useMemo(() => {
     const nowObj = new Date(currentTime);
     return new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();
  }, [currentTime]);

  const dueCardsCount = useMemo(() => {
    return cards.filter(c => (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8).length;
  }, [cards, endOfToday]);

  const levelStats = useMemo(() => {
    const stats = Array(7).fill(0).map((_, i) => ({ level: i + 1, count: 0, hasDue: false }));
    let doneCount = 0;
    
    cards.forEach(card => {
        const isDue = !card.dueDate || card.dueDate <= endOfToday;
        
        if (card.level >= 1 && card.level <= 7) {
            const stat = stats[card.level - 1];
            stat.count++;
            if (isDue) {
                stat.hasDue = true;
            }
        } else if (card.level > 7) {
            doneCount++;
        }
    });
    return { levels: stats, done: doneCount };
  }, [cards, endOfToday]);

  const escapeCSV = (str: string) => {
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
  };

  const handleExport = (resetLevels: boolean = false) => {
      if (!cards || cards.length === 0) return;
      
      const nowObj = new Date();
      const todayZero = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate());
      
      let csvContent = "Front,Back,Level,Days Left\n";
      cards.forEach(card => {
          const lvl = resetLevels ? "1" : card.level.toString();
          
          let daysLeft = "";
          if (resetLevels) {
              daysLeft = "0"; // All reset cards are due today
          } else if (card.level < 8) {
              if (card.dueDate) {
                  const dueObj = new Date(card.dueDate);
                  const dueZero = new Date(dueObj.getFullYear(), dueObj.getMonth(), dueObj.getDate());
                  const diffTime = dueZero.getTime() - todayZero.getTime();
                  daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24)).toString();
              } else {
                  daysLeft = "0"; // Level < 8 without due date is considered due today
              }
          }
          // Level 8 cards leave daysLeft as empty string per user request

          const row = [
              escapeCSV(card.front),
              escapeCSV(card.back),
              lvl,
              daysLeft
          ].join(",");
          csvContent += row + "\n";
      });
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const safeTitle = deck.title.replace(/[\\/]/g, '_');
      const filename = `${safeTitle}.csv`;
      const downloadFallback = () => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);
      };
      const shareFile = new File([blob], filename, { type: 'text/csv' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
          navigator.share({
              files: [shareFile],
              title: deck.title,
          }).catch((err) => {
              console.warn("Share failed or cancelled:", err);
          });
      } else {
          downloadFallback();
      }
      setIsMenuOpen(false);
  };

  const handleImportClick = () => {
      onInteraction?.();
      fileInputRef.current?.click();
      setIsMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
          const text = evt.target?.result as string;
          if (!text) return;
          const newCards: { front: string, back: string, level: number, daysLeft?: number }[] = [];
          let cursor = 0;
          const getField = (): string | null => {
              if (cursor >= text.length) return null;
              if (text[cursor] === '"') {
                  cursor++;
                  let value = "";
                  while (cursor < text.length) {
                      if (text[cursor] === '"') {
                          if (cursor + 1 < text.length && text[cursor + 1] === '"') {
                              value += '"';
                              cursor += 2;
                          } else {
                              cursor++;
                              break;
                          }
                      } else {
                          value += text[cursor];
                          cursor++;
                      }
                  }
                  return value;
              } else {
                  let value = "";
                  while (cursor < text.length && text[cursor] !== ',' && text[cursor] !== '\n' && text[cursor] !== '\r') {
                      value += text[cursor];
                      cursor++;
                  }
                  return value;
              }
          };
          const consumeSeparator = () => {
              if (cursor < text.length && text[cursor] === ',') {
                  cursor++;
                  return 'comma';
              }
              if (cursor < text.length && (text[cursor] === '\n' || text[cursor] === '\r')) {
                  if (text[cursor] === '\r' && cursor + 1 < text.length && text[cursor+1] === '\n') {
                      cursor += 2;
                  } else {
                      cursor++;
                  }
                  return 'newline';
              }
              return 'eof';
          };
          if (text.charCodeAt(0) === 0xFEFF) {
              cursor++;
          }
          let currentRow: string[] = [];
          let isHeader = true;

          const parseRowData = (row: string[]) => {
              const front = row[0] || "";
              const back = row[1] || "";
              const lvlParsed = row[2] ? parseInt(row[2]) : 1;
              const dlStr = row[3];
              const dlParsed = dlStr ? parseInt(dlStr) : undefined;
              
              return {
                  front,
                  back,
                  level: isNaN(lvlParsed) || lvlParsed < 1 || lvlParsed > 8 ? 1 : lvlParsed,
                  daysLeft: isNaN(dlParsed as any) ? undefined : dlParsed
              };
          };

          while (cursor < text.length) {
              const field = getField();
              if (field !== null) {
                  currentRow.push(field);
              }
              const sep = consumeSeparator();
              if (sep === 'newline' || sep === 'eof') {
                  if (currentRow.length >= 2) {
                       if (isHeader) {
                           if (currentRow[0].toLowerCase().trim() !== 'front') {
                               newCards.push(parseRowData(currentRow));
                           }
                           isHeader = false;
                       } else {
                           if (currentRow[0].trim() || currentRow[1].trim()) {
                                newCards.push(parseRowData(currentRow));
                           }
                       }
                  }
                  currentRow = [];
              }
          }
          if (newCards.length > 0 && onImportCards) {
              onImportCards(deck.id, newCards);
          }
          if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsText(file);
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.back.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesLevel = true;
    if (selectedLevelFilters.size > 0) {
        if (card.level > 7) {
            matchesLevel = selectedLevelFilters.has('done');
        } else {
            matchesLevel = selectedLevelFilters.has(card.level);
        }
    }
    return matchesSearch && matchesLevel;
  });

  const handleSelectToggle = (id: string) => {
    onInteraction?.();
    setActiveTimerCardId(null);
    const newSelected = new Set(selectedCards);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCards(newSelected);
  };

  const toggleLevelFilter = (lvl: number | 'done') => {
      onInteraction?.();
      setActiveTimerCardId(null);
      const newFilters = new Set(selectedLevelFilters);
      if (newFilters.has(lvl)) {
          newFilters.delete(lvl);
      } else {
          newFilters.add(lvl);
      }
      setSelectedLevelFilters(newFilters);
  };

  const handleToggleSearch = () => {
    onInteraction?.();
    setActiveTimerCardId(null);
    if (isSearchExpanded) {
        setSearchTerm('');
        setSelectedLevelFilters(new Set());
        setSelectedCards(new Set());
    }
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleDeleteBox = () => {
    onInteraction?.();
    if (onDeleteDeck) {
      onDeleteDeck(deck.id);
    }
  };

  const handleRenameBox = (newName: string) => {
      if (onRenameDeck) {
          onRenameDeck(deck.id, newName);
          setIsRenameModalOpen(false);
      }
  };

  const handleRequestDeleteCard = (cardId: string, source?: 'swipe') => {
    onInteraction?.();
    setActiveTimerCardId(null);
    setCardToDelete(cardId);
  };

  const handleConfirmDeleteCard = () => {
    if (cardToDelete && onDeleteCard) {
      onDeleteCard(cardToDelete);
    }
    setCardToDelete(null);
  };

  const handleCancelDeleteCard = () => {
    setCardToDelete(null);
    setSwipeResetToken(prev => prev + 1);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    if (onDeleteCards) {
        onDeleteCards(Array.from(selectedCards));
    }
    setSelectedCards(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  const handleOpenMoveModal = () => {
    setIsMoveModalOpen(true);
    setIsSelectionMenuOpen(false);
  };

  const handleExecuteMove = (targetDeckId: number) => {
    if (onMoveCards) {
        onMoveCards(targetDeckId, Array.from(selectedCards));
    }
    setSelectedCards(new Set());
    setIsMoveModalOpen(false);
  };

  const handleToggleTimer = (id: string) => {
    setActiveTimerCardId(prev => prev === id ? null : id);
  };

  const handleCardLongPress = (cardId: string) => {
      onInteraction?.();
      setActiveTimerCardId(null);
      setSelectedCards(prev => {
          const newSet = new Set(prev);
          newSet.add(cardId);
          return newSet;
      });
  };

  const handleStudySwipeStart = (e: React.TouchEvent) => {
    studySwipeStartX.current = e.touches[0].clientX;
  };

  const handleStudySwipeEnd = (e: React.TouchEvent) => {
    if (studySwipeStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - studySwipeStartX.current;
    if (Math.abs(diff) > 50) {
        if (diff < 0) {
            setStudyMode('quiz');
        } else {
            setStudyMode('study');
        }
    }
    studySwipeStartX.current = null;
  };

  const truncate = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + ' ...';
  };

  const isSelectionMode = selectedCards.size > 0;

  return (
    <div 
      className="min-h-screen bg-[#F3F5F9] relative flex flex-col pb-20"
      onClick={() => {
        if (activeTimerCardId) setActiveTimerCardId(null);
        if (isSelectionMenuOpen) setIsSelectionMenuOpen(false);
      }}
    >
       {/* Header */}
       <header className="px-[18px] pt-6 pb-2 flex items-center justify-between relative flex-shrink-0 z-20">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-slate-200/50">
              <ArrowLeft size={24} className="text-slate-900" />
          </button>
          
          <div className="flex flex-col items-center absolute left-0 right-0 pointer-events-none px-12 gap-1">
              <h1 className="text-2xl font-normal text-slate-900 truncate w-full text-center">
                  {truncate(deck.title, 20)}
              </h1>
              <span className="text-sm text-slate-500">Total Cards: {deck.totalCards}</span>
          </div>

          <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onInteraction?.();
                  setIsMenuOpen(!isMenuOpen);
                  setActiveTimerCardId(null);
                }} 
                className="p-2 -mr-2 rounded-full active:bg-slate-200/50"
              >
                  <MoreVertical size={24} className="text-slate-900" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl z-40 py-2 animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
                    <button 
                        onClick={handleImportClick}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 active:bg-slate-50 transition-colors text-left"
                        type="button"
                    >
                        <FileDown size={18} />
                        <span className="font-medium text-sm">Import</span>
                    </button>
                    <button 
                        onClick={() => handleExport(false)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 active:bg-slate-50 transition-colors text-left"
                        type="button"
                    >
                        <FileUp size={18} />
                        <span className="font-medium text-sm">Export</span>
                    </button>
                    <button 
                        onClick={() => handleExport(true)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 active:bg-slate-50 transition-colors text-left"
                        type="button"
                    >
                        <NumberOneIcon size={18} />
                        <span className="font-medium text-sm">Export as Level 1</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-4"></div>
                    <button 
                        onClick={() => { 
                          onInteraction?.();
                          setIsRenameModalOpen(true); 
                          setIsMenuOpen(false); 
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 active:bg-slate-50 transition-colors text-left"
                        type="button"
                    >
                        <Pencil size={18} />
                        <span className="font-medium text-sm">Rename</span>
                    </button>
                    <button 
                        onClick={handleDeleteBox}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 active:bg-slate-50 transition-colors text-left"
                        type="button"
                    >
                        <Trash2 size={18} />
                        <span className="font-medium text-sm">Delete</span>
                    </button>
                  </div>
                </>
              )}
          </div>
       </header>

       <div className="flex-1 overflow-y-auto pt-4 flex flex-col">
           <div className="grid grid-cols-8 gap-2 px-[18px] mb-8 flex-shrink-0">
               {levelStats.levels.map((stat) => (
                   <div key={stat.level} className="flex flex-col items-center gap-1">
                       <span className="text-xs text-slate-800 font-medium">{stat.count}</span>
                       <div 
                         onClick={() => {
                            if (stat.hasDue) {
                                onInteraction?.();
                                onStudy(deck, stat.level);
                            }
                         }}
                         className={`w-full aspect-square rounded-2xl flex items-center justify-center text-[15px] font-normal shadow-sm transition-transform active:scale-95 ${stat.hasDue ? `${classes.bg} ${contrastTextColor} cursor-pointer` : 'bg-white text-slate-600'}`}
                       >
                           {stat.level} lv
                       </div>
                   </div>
               ))}
               <div className="flex flex-col items-center gap-1">
                   <span className="text-xs text-slate-800 font-medium">{levelStats.done}</span>
                   <div className="w-full aspect-square rounded-2xl flex items-center justify-center bg-white shadow-sm transition-transform active:scale-95">
                       <Star size={16} className="text-slate-600" strokeWidth={1.5} />
                   </div>
               </div>
           </div>

           {hasCards ? (
             <>
               <div className="px-[18px] mb-3 flex-shrink-0">
                   <div 
                        className="grid grid-cols-1 overflow-hidden rounded-xl shadow-lg relative bg-transparent"
                        onTouchStart={handleStudySwipeStart}
                        onTouchEnd={handleStudySwipeEnd}
                   >
                        <button 
                             onClick={(e) => {
                               if (studyMode !== 'study') return;
                               e.stopPropagation();
                               onInteraction?.();
                               if (dueCardsCount > 0) onStudy(deck);
                             }}
                             disabled={dueCardsCount === 0}
                             className={`col-start-1 row-start-1 w-full py-4 text-lg font-medium transition-all duration-500 ease-out 
                                 ${studyMode === 'study' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'} 
                                 ${dueCardsCount > 0 
                                     ? `${classes.bg} ${contrastTextColor} shadow-blue-500/20 active:scale-[0.98]` 
                                     : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            Study Cards - {dueCardsCount}
                        </button>

                        <button 
                             onClick={(e) => {
                               if (studyMode !== 'quiz') return;
                               e.stopPropagation();
                               onInteraction?.();
                               if (onQuizSetup) onQuizSetup();
                             }}
                             className={`col-start-1 row-start-1 w-full py-4 text-lg font-medium transition-all duration-500 ease-out 
                                 ${studyMode === 'quiz' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'} 
                                 ${classes.bg} ${contrastTextColor} shadow-blue-500/20 active:scale-[0.98]`}
                        >
                            Quiz Mode
                        </button>
                   </div>
               </div>
               
               <div className="flex justify-center gap-2 mb-8 flex-shrink-0">
                   <button 
                    onClick={() => setStudyMode('study')}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${studyMode === 'study' ? classes.bg : 'bg-slate-300'}`}
                    aria-label="Study Mode"
                   />
                   <button 
                    onClick={() => setStudyMode('quiz')}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${studyMode === 'quiz' ? classes.bg : 'bg-slate-300'}`}
                    aria-label="Quiz Mode"
                   />
               </div>

               <div className="px-[18px] flex-shrink-0">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSearch();
                    }}
                    className={`flex items-center gap-2 w-full transition-all duration-300 ${isSearchExpanded ? 'mb-4' : 'mb-6'}`}
                   >
                       {isSearchExpanded ? <ChevronDown size={16} className="text-slate-800" /> : <ChevronRight size={16} className="text-slate-800" />}
                       <span className="text-sm font-medium text-slate-800">Search & Select</span>
                   </button>

                   <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSearchExpanded ? 'max-h-[300px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`} onClick={(e) => e.stopPropagation()}>
                       <div className="bg-white rounded-xl py-3 px-3 shadow-sm mb-3">
                           <div className="relative">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search"
                                    className={`w-full bg-[#F3F5F9] border-2 ${searchTerm ? classes.border : 'border-transparent'} focus:${classes.border} focus:ring-2 focus:ring-opacity-50 pl-4 pr-11 py-2 rounded-lg text-slate-800 focus:outline-none transition-all placeholder:text-slate-400`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                    <Bot size={20} strokeWidth={1.5} className="text-slate-400 flex-shrink-0" />
                                </div>
                           </div>

                           <div className="grid grid-cols-8 gap-3 mt-3">
                               {[1,2,3,4,5,6,7].map(n => (
                                   <button 
                                    key={n}
                                    onClick={() => toggleLevelFilter(n)}
                                    className={`w-full aspect-square rounded-md flex items-center justify-center text-sm font-medium transition-all border-2 ${selectedLevelFilters.has(n) ? `bg-white ${classes.text} ${classes.border} shadow-md` : 'bg-[#F3F5F9] text-slate-700 border-transparent'}`}
                                   >
                                       {n}
                                   </button>
                               ))}
                               <button 
                                onClick={() => toggleLevelFilter('done')}
                                className={`w-full aspect-square rounded-md flex items-center justify-center transition-all border-2 ${selectedLevelFilters.has('done') ? `bg-white ${classes.text} ${classes.border} shadow-md` : 'bg-[#F3F5F9] text-slate-700 border-transparent'}`}
                               >
                                   <Star size={18} strokeWidth={1.5} />
                               </button>
                           </div>
                       </div>
                       
                       <div className="text-center text-slate-800 font-normal text-lg">
                           Cards found: {filteredCards.length}
                       </div>
                   </div>
               </div>

               {filteredCards.length > 0 && (
                <div className="px-[18px] pb-24 flex-shrink-0">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                        <div className="flex flex-col gap-2">
                            {filteredCards.map((card, index) => (
                                <CardItem 
                                    key={`${card.id}-${swipeResetToken}`} 
                                    card={card} 
                                    index={index}
                                    isSearchOpen={isSearchExpanded || selectedCards.size > 0}
                                    onDelete={handleRequestDeleteCard}
                                    onClick={(c) => {
                                      onInteraction?.();
                                      setActiveTimerCardId(null);
                                      setEditingCard(c);
                                    }}
                                    isSelected={selectedCards.has(card.id)}
                                    onSelectToggle={handleSelectToggle}
                                    theme={theme}
                                    activeTimerId={activeTimerCardId}
                                    onToggleTimer={handleToggleTimer}
                                    onLongPress={handleCardLongPress}
                                />
                            ))}
                        </div>
                    </div>
                </div>
               )}
             </>
           ) : (
             <div className="px-[18px] flex-1 flex flex-col items-center justify-center pb-24">
               <p className="text-xl text-slate-900 font-normal text-center">Start by adding new cards to this box</p>
             </div>
           )}
       </div>

       {isSelectionMode ? (
         <div 
            className="fixed bottom-0 left-0 right-0 bg-white px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between z-40 animate-slide-in-up" 
            onClick={(e) => e.stopPropagation()}
         >
            <button onClick={() => { setSelectedCards(new Set()); setIsSelectionMenuOpen(false); }} className="p-2 rounded-full active:bg-slate-100 -ml-2 relative z-10">
                 <X size={24} className="text-slate-500"/>
            </button>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg font-medium text-slate-800">{selectedCards.size} selected</span>
            </div>
            
            <div className="relative z-10">
                <button 
                    onClick={() => setIsSelectionMenuOpen(!isSelectionMenuOpen)} 
                    className="p-2 -mr-2 rounded-full active:bg-slate-100 text-slate-700"
                >
                    <MoreVertical size={24} />
                </button>

                {isSelectionMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsSelectionMenuOpen(false)}></div>
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                             <button 
                                onClick={handleOpenMoveModal}
                                className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 active:bg-slate-50 transition-colors text-left"
                             >
                                <FolderInput size={18} />
                                <span className="font-medium">Move cards</span>
                             </button>
                             <div className="h-px bg-slate-100 mx-3"></div>
                             <button 
                                onClick={() => {
                                    setIsSelectionMenuOpen(false);
                                    handleBulkDelete();
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-red-500 active:bg-red-50 transition-colors text-left"
                             >
                                <Trash2 size={18} />
                                <span className="font-medium">Delete</span>
                             </button>
                        </div>
                    </>
                )}
            </div>
         </div>
       ) : (
         <button 
            onClick={(e) => {
              e.stopPropagation();
              onInteraction?.();
              setActiveTimerCardId(null);
              setIsAddCardModalOpen(true);
            }}
            className={`fixed bottom-8 right-8 w-16 h-16 ${classes.bg} rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-30`}
         >
            <Plus className={`${contrastTextColor} w-8 h-8`} />
         </button>
       )}
       
       <input 
          type="file" 
          accept=".csv,.txt"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
       />

       <AddCardModal 
          isOpen={isAddCardModalOpen} 
          onClose={() => setIsAddCardModalOpen(false)} 
          onAdd={(f, b) => {
              if(onAddCard) onAddCard(f, b);
              setIsAddCardModalOpen(false);
          }}
          theme={theme}
       />

       <EditCardModal 
          isOpen={!!editingCard} 
          onClose={() => setEditingCard(null)} 
          card={editingCard}
          onSave={(id, f, b) => {
            if(onEditCard) onEditCard(id, f, b);
          }}
          onDelete={(id) => handleRequestDeleteCard(id)}
          onReset={(id) => {
              if(onResetCard) onResetCard(id);
              setEditingCard(null);
          }}
          theme={theme}
       />

       <RenameDeckModal 
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRenameBox}
          currentName={deck.title}
          theme={theme}
       />

      <ConfirmationModal
        isOpen={!!cardToDelete}
        onClose={handleCancelDeleteCard}
        onConfirm={handleConfirmDeleteCard}
        title="Delete Card?"
        description="Are you sure you want to delete this card? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        theme={theme}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedCards.size} Cards?`}
        description={`Are you sure you want to delete ${selectedCards.size} cards? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        theme={theme}
      />
      
      <MoveCardsModal 
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        decks={allDecks}
        currentDeckId={deck.id}
        onMove={handleExecuteMove}
        theme={theme}
      />
    </div>
  );
};
