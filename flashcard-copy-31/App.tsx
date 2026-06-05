
import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import { Deck, Card, Theme, getThemeHex } from './types';
import { DeckCard } from './components/DeckCard';
import { FloatingActionButton } from './components/FloatingActionButton';
import { AddDeckModal } from './components/AddDeckModal';
import { BoxDetail } from './components/BoxDetail';
import { SettingsPage } from './components/SettingsPage';
import { StudyPage } from './components/StudyPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Snackbar } from './components/Snackbar';
import { CongratulationsPage } from './components/CongratulationsPage';
import { QuizSetupModal } from './components/QuizSetupModal';

// Helper to generate random initial data based on new requirements
const generateRandomDecks = (): Deck[] => {
  const frontWords = ["Apple", "Run", "Blue", "Sky", "Fire", "Water", "Earth", "Wind", "Love", "Hate", "Code", "Data", "Mind", "Soul", "Time", "Book", "Pen", "Car", "Door", "Key"];
  const backWords = ["Apfel", "Laufen", "Blau", "Himmel", "Feuer", "Wasser", "Erde", "Wind", "Liebe", "Hass", "Kode", "Daten", "Geist", "Seele", "Zeit", "Buch", "Stift", "Auto", "Tur", "Schlussel"];

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const deckTitles = ["Random Box 1", "Random Box 2", "Random Box 3"];
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return deckTitles.map((title, index) => {
    const numCards = getRandomInt(6, 15);
    const cards: Card[] = [];

    // Generate active cards (Levels 1-7)
    for (let i = 0; i < numCards; i++) {
        // Random level between 1 and 7
        // Weighted slightly towards 1 to show the examples
        const roll = Math.random();
        let level = 1;
        if (roll > 0.4) level = getRandomInt(2, 7);
        
        let dueDate = now;
        
        // Randomize if the card is "Due" (past/now) or "Waiting" (future)
        const isDue = Math.random() < 0.6;

        if (level === 1) {
            // Level 1 Logic:
            // 50% chance to be "Overdue" (Missed study time -> Red)
            // 50% chance to be "Due Today" (Fresh -> Black)
            const isOverdue = Math.random() < 0.5;
            
            if (isDue) {
                if (isOverdue) {
                    // Set due date to 1-3 days ago
                    dueDate = now - getRandomInt(1, 3) * oneDayMs;
                } else {
                    // Set due date to earlier today (0-10 hours ago)
                    dueDate = now - getRandomInt(0, 10) * 60 * 60 * 1000;
                }
            } else {
                // Future Level 1 (Shouldn't happen often in Leitner, but for safety)
                dueDate = now;
            }
        } else {
             // Calculate interval based on the previous level success to get to this current level state
             let maxWaitDays = 1;
             if (level === 2) maxWaitDays = 1;
             else if (level === 3) maxWaitDays = 3;
             else if (level === 4) maxWaitDays = 7;
             else if (level === 5) maxWaitDays = 15;
             else if (level === 6) maxWaitDays = 31;
             else if (level === 7) maxWaitDays = 61;

             if (isDue) {
                 // Due date is in the past
                 dueDate = now - getRandomInt(1, 48) * 60 * 60 * 1000;
             } else {
                 // Due date is in the future (waiting for the interval)
                 dueDate = now + getRandomInt(1, maxWaitDays) * oneDayMs;
             }
        }

        cards.push({
            id: `card-${index}-${i}-${Math.random().toString(36).substr(2, 5)}`,
            front: getRandomItem(frontWords),
            back: getRandomItem(backWords),
            level: level,
            dueDate: dueDate
        });
    }

    // Add a bunch of Mastered cards (Level 8)
    const numMastered = getRandomInt(4, 8);
    for (let k = 0; k < numMastered; k++) {
        cards.push({
            id: `card-${index}-mastered-${k}-${Math.random().toString(36).substr(2, 5)}`,
            front: getRandomItem(frontWords),
            back: getRandomItem(backWords),
            level: 8, // Mastered
            dueDate: 0 // Not due
        });
    }

    // Calculate initial box status for the UI
    const nowObj = new Date();
    const endOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();

    const boxStatus = Array(7).fill(false);
    let cardsToday = 0;
    
    cards.forEach(c => {
        // Exclude Level 8 from 'Due' counts
        const isCardDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
        if (isCardDue) cardsToday++;
        
        if (c.level >= 1 && c.level <= 7 && isCardDue) {
            boxStatus[c.level - 1] = true;
        }
    });

    return {
        id: index + 1,
        title: title,
        totalCards: cards.length,
        cardsToday: cardsToday,
        boxStatus: boxStatus,
        cards: cards,
        quizzedCardIds: [],
        colorSeed: Math.floor(Math.random() * 1000) // Initialize seed here for stability
    };
  });
};

const INITIAL_DECKS: Deck[] = generateRandomDecks();

const App: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>(INITIAL_DECKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  
  // Study / Quiz State
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState<'leitner' | 'quiz'>('leitner');
  const [studyLevel, setStudyLevel] = useState<number | undefined>(undefined);
  const [quizCards, setQuizCards] = useState<Card[]>([]);
  const [isQuizSetupOpen, setIsQuizSetupOpen] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userName, setUserName] = useState('MrFreeFlower');
  const [theme, setTheme] = useState<Theme>('blue');
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Deletion State
  const [deckToDelete, setDeckToDelete] = useState<number | null>(null);
  const [swipeResetToken, setSwipeResetToken] = useState(0);

  // Undo / Snackbar State
  const [snackbarState, setSnackbarState] = useState<{
    isVisible: boolean;
    message: string;
    undoAction: (() => void) | null;
  }>({ isVisible: false, message: '', undoAction: null });
  const snackbarTimeoutRef = useRef<any>(null);

  // Update time every second to sync real-time status
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalDue = decks.reduce((acc, deck) => {
    const nowObj = new Date(currentTime);
    const endOfToday = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate(), 23, 59, 59, 999).getTime();

    const deckDue = deck.cards 
      ? deck.cards.filter(c => (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8).length
      : deck.cardsToday;
    return acc + deckDue;
  }, 0);

  const showUndoSnackbar = (message: string, undoCallback: () => void) => {
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
    
    setSnackbarState({
      isVisible: true,
      message,
      undoAction: undoCallback
    });

    snackbarTimeoutRef.current = setTimeout(() => {
      setSnackbarState(prev => ({ ...prev, isVisible: false }));
    }, 4000); // 4 seconds duration
  };

  const dismissSnackbar = () => {
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
    setSnackbarState(prev => ({ ...prev, isVisible: false }));
  };

  const handleUndo = () => {
    if (snackbarState.undoAction) {
      snackbarState.undoAction();
    }
    setSnackbarState(prev => ({ ...prev, isVisible: false }));
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
  };

  // Global click listener to dismiss snackbar
  useEffect(() => {
    const handleGlobalInteraction = (e: MouseEvent | TouchEvent) => {
        if (snackbarState.isVisible) {
            const target = e.target as HTMLElement;
            const snackbarEl = document.getElementById('snackbar-root');
            // If interaction is outside the snackbar (undo button), dismiss it
            if (snackbarEl && !snackbarEl.contains(target)) {
                dismissSnackbar();
            }
        }
    };

    if (snackbarState.isVisible) {
        // Small delay to prevent the event that triggered the snackbar from immediately dismissing it
        const timer = setTimeout(() => {
            document.addEventListener('click', handleGlobalInteraction);
            document.addEventListener('touchstart', handleGlobalInteraction);
        }, 50);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleGlobalInteraction);
            document.removeEventListener('touchstart', handleGlobalInteraction);
        };
    }
  }, [snackbarState.isVisible]);

  const handleAddDeck = (name: string) => {
    dismissSnackbar();
    const newDeck: Deck = {
      id: Date.now(),
      title: name,
      totalCards: 0,
      cardsToday: 0,
      boxStatus: [false, false, false, false, false, false, false],
      cards: [],
      quizzedCardIds: [],
      colorSeed: Math.floor(Math.random() * 1000) // Assign stable seed
    };
    setDecks([...decks, newDeck]);
    setIsModalOpen(false);
  };

  const executeDeleteDeck = (id: number) => {
    if (navigator.vibrate) navigator.vibrate(50);
    
    const deckToRemove = decks.find(d => d.id === id);
    const deckIndex = decks.findIndex(d => d.id === id);
    
    if (deckToRemove) {
      // Optimistic Delete
      setDecks(prevDecks => prevDecks.filter(deck => deck.id !== id));
      
      // Define Undo Action
      const undo = () => {
         setDecks(prev => {
           const newDecks = [...prev];
           // Insert back at original position or just append if complicated
           if (deckIndex >= 0 && deckIndex <= newDecks.length) {
              newDecks.splice(deckIndex, 0, deckToRemove);
           } else {
              newDecks.push(deckToRemove);
           }
           return newDecks;
         });
      };
      
      showUndoSnackbar('Box deleted', undo);
    }

    if (selectedDeck?.id === id) {
      setSelectedDeck(null);
    }
  };

  const onRequestDeleteDeck = (id: number, source?: 'swipe') => {
    setDeckToDelete(id);
  };

  const confirmDeleteDeck = () => {
    if (deckToDelete) {
      executeDeleteDeck(deckToDelete);
      setDeckToDelete(null);
    }
  };

  const cancelDeleteDeck = () => {
    setDeckToDelete(null);
    setSwipeResetToken(prev => prev + 1);
  };

  const handleRenameDeck = (id: number, newTitle: string) => {
    dismissSnackbar();
    const updatedDecks = decks.map(deck => 
      deck.id === id ? { ...deck, title: newTitle } : deck
    );
    setDecks(updatedDecks);
    
    if (selectedDeck && selectedDeck.id === id) {
      setSelectedDeck({ ...selectedDeck, title: newTitle });
    }
  };

  const handleDeckClick = (deck: Deck) => {
    dismissSnackbar();
    setSelectedDeck(deck);
  };

  const handleStudy = (deck: Deck, level?: number) => {
      dismissSnackbar();
      setSelectedDeck(deck);
      setStudyLevel(level);
      setStudyMode('leitner');
      setQuizCards([]);
      setIsStudying(true);
      setShowCongratulations(false);
  };
  
  const handleQuizSetup = () => {
      if (!selectedDeck) return;
      setIsQuizSetupOpen(true);
  };
  
  const handleStartQuiz = (count: number, resetHistory: boolean) => {
      if (!selectedDeck) return;
      
      let currentDeck = decks.find(d => d.id === selectedDeck.id);
      if (!currentDeck) return;

      const allCards = currentDeck.cards || [];
      const poolCards = allCards.filter(c => c.level >= 8);
      
      let quizzedIds = currentDeck.quizzedCardIds || [];
      if (resetHistory) {
          quizzedIds = [];
      }
      
      let availableCards = poolCards.filter(c => !quizzedIds.includes(c.id));
      
      if (availableCards.length < count && availableCards.length === 0) {
          quizzedIds = [];
          availableCards = poolCards;
      } else if (availableCards.length < count) {
          count = availableCards.length;
      }

      const shuffled = [...availableCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const selectedCards = shuffled.slice(0, count);
      
      if (resetHistory) {
          const updatedDeck = { ...currentDeck, quizzedCardIds: [] };
          setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
          setSelectedDeck(updatedDeck);
      }
      
      setQuizCards(selectedCards);
      setStudyMode('quiz');
      setStudyLevel(undefined);
      setIsQuizSetupOpen(false);
      setIsStudying(true);
      setShowCongratulations(false);
  };

  const handleImportCards = (deckId: number, importedCards: { front: string, back: string, level: number, daysLeft?: number }[]) => {
      dismissSnackbar();
      
      const targetDeck = decks.find(d => d.id === deckId);
      if (!targetDeck) return;
      
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();

      const newCards: Card[] = importedCards.map((c, i) => {
          let dueDate = now;
          if (c.level >= 8) {
              dueDate = 0;
          } else if (c.daysLeft !== undefined) {
              // Positive days are preserved as future dates from now.
              // Negative/Zero are scheduled for today (now).
              if (c.daysLeft > 0) {
                  dueDate = now + c.daysLeft * oneDayMs;
              } else {
                  dueDate = now;
              }
          }
          
          return {
              id: `imported-${deckId}-${Date.now()}-${i}`,
              front: c.front,
              back: c.back,
              level: c.level,
              dueDate: dueDate
          };
      });

      const updatedCards = [...newCards, ...(targetDeck.cards || [])];
      
      let newCardsToday = 0;
      updatedCards.forEach(c => {
         const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
         if (isDue) newCardsToday++;
      });
      
      const updatedDeck = {
          ...targetDeck,
          cards: updatedCards,
          totalCards: updatedCards.length,
          cardsToday: newCardsToday
      };

      setDecks(prev => prev.map(d => d.id === deckId ? updatedDeck : d));
      if (selectedDeck?.id === deckId) {
          setSelectedDeck(updatedDeck);
      }
      
      showUndoSnackbar(`${newCards.length} cards imported`, () => {
          setDecks(prev => prev.map(d => d.id === deckId ? targetDeck : d));
          if (selectedDeck?.id === deckId) setSelectedDeck(targetDeck);
      });
  };

  const handleAddCard = (front: string, back: string) => {
    dismissSnackbar();
    if (!selectedDeck) return;

    const newCard: Card = {
      id: Date.now().toString(),
      front,
      back,
      level: 1,
      dueDate: Date.now()
    };

    const updatedDeck = {
      ...selectedDeck,
      cards: [newCard, ...(selectedDeck.cards || [])],
      totalCards: (selectedDeck.totalCards || 0) + 1,
      cardsToday: (selectedDeck.cardsToday || 0) + 1
    };

    setSelectedDeck(updatedDeck);
    setDecks(prevDecks => 
      prevDecks.map(d => d.id === selectedDeck.id ? updatedDeck : d)
    );
  };

  const handleResetCard = (cardId: string) => {
    dismissSnackbar();
    if (!selectedDeck) return;
    
    const currentCards = selectedDeck.cards || [];
    const cardIndex = currentCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const originalCard = currentCards[cardIndex];
    const updatedCard = { ...originalCard, level: 1, dueDate: Date.now() };
    
    const updatedCards = [...currentCards];
    updatedCards[cardIndex] = updatedCard;

    const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();
    const cardsTodayCount = updatedCards.filter(c => (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8).length;

    const updatedDeck = {
        ...selectedDeck,
        cards: updatedCards,
        cardsToday: cardsTodayCount
    };

    setSelectedDeck(updatedDeck);
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));

    showUndoSnackbar("Card reset to Level 1", () => {
        const revertDeck = {
             ...selectedDeck,
             cards: currentCards,
             cardsToday: selectedDeck.cardsToday
        };
        setSelectedDeck(revertDeck);
        setDecks(prev => prev.map(d => d.id === revertDeck.id ? revertDeck : d));
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (!selectedDeck) return;
    if (navigator.vibrate) navigator.vibrate(50);

    const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();
    const cardToRemove = selectedDeck.cards?.find(c => c.id === cardId);
    if (!cardToRemove) return;

    const deckId = selectedDeck.id;
    const isDue = (!cardToRemove.dueDate || cardToRemove.dueDate <= endOfToday) && cardToRemove.level < 8;

    const updatedCards = selectedDeck.cards?.filter(c => c.id !== cardId) || [];
    const newCount = updatedCards.length;
    const newToday = Math.max(0, (selectedDeck.cardsToday || 0) - (isDue ? 1 : 0));

    const updatedDeck = {
        ...selectedDeck,
        cards: updatedCards,
        totalCards: newCount,
        cardsToday: newToday
    };

    setSelectedDeck(updatedDeck);
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));

    const undo = () => {
       setDecks(prev => prev.map(d => {
         if (d.id === deckId) {
            const restoredCards = [...(d.cards || []), cardToRemove];
            const restoredIsDue = (!cardToRemove.dueDate || cardToRemove.dueDate <= endOfToday) && cardToRemove.level < 8;
            return {
                ...d,
                cards: restoredCards,
                totalCards: (d.totalCards || 0) + 1,
                cardsToday: (d.cardsToday || 0) + (restoredIsDue ? 1 : 0)
            };
         }
         return d;
       }));

       setSelectedDeck(current => {
         if (current && current.id === deckId) {
             const restoredCards = [...(current.cards || []), cardToRemove];
             const restoredIsDue = (!cardToRemove.dueDate || cardToRemove.dueDate <= endOfToday) && cardToRemove.level < 8;
             return {
                 ...current,
                 cards: restoredCards,
                 totalCards: (current.totalCards || 0) + 1,
                 cardsToday: (current.cardsToday || 0) + (restoredIsDue ? 1 : 0)
             };
         }
         return current;
       });
    };

    showUndoSnackbar('Card deleted', undo);
  };

  const handleDeleteMultipleCards = (cardIds: string[]) => {
    if (!selectedDeck) return;
    if (navigator.vibrate) navigator.vibrate(50);

    const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();
    const deckId = selectedDeck.id;

    const cardsToRemove = selectedDeck.cards?.filter(c => cardIds.includes(c.id)) || [];
    if (cardsToRemove.length === 0) return;

    const updatedCards = selectedDeck.cards?.filter(c => !cardIds.includes(c.id)) || [];
    
    let dueRemovedCount = 0;
    cardsToRemove.forEach(c => {
         const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
         if (isDue) dueRemovedCount++;
    });

    const newToday = Math.max(0, (selectedDeck.cardsToday || 0) - dueRemovedCount);

    const updatedDeck = {
        ...selectedDeck,
        cards: updatedCards,
        totalCards: updatedCards.length,
        cardsToday: newToday
    };

    setSelectedDeck(updatedDeck);
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));

    const undo = () => {
         setDecks(prev => prev.map(d => {
             if (d.id === deckId) {
                 const restoredCards = [...(d.cards || []), ...cardsToRemove];
                 let restoredDueCount = 0;
                 cardsToRemove.forEach(c => {
                    const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
                    if (isDue) restoredDueCount++;
                 });
                 
                 return {
                     ...d,
                     cards: restoredCards,
                     totalCards: (d.totalCards || 0) + cardsToRemove.length,
                     cardsToday: (d.cardsToday || 0) + restoredDueCount
                 };
             }
             return d;
         }));

         setSelectedDeck(current => {
             if (current && current.id === deckId) {
                 const restoredCards = [...(current.cards || []), ...cardsToRemove];
                 let restoredDueCount = 0;
                 cardsToRemove.forEach(c => {
                    const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
                    if (isDue) restoredDueCount++;
                 });
                 return {
                     ...current,
                     cards: restoredCards,
                     totalCards: (current.totalCards || 0) + cardsToRemove.length,
                     cardsToday: (current.cardsToday || 0) + restoredDueCount
                 };
             }
             return current;
         });
    }

    showUndoSnackbar(`${cardsToRemove.length} cards deleted`, undo);
  };

  const handleMoveCards = (targetDeckId: number, cardIds: string[]) => {
    if (!selectedDeck) return;
    dismissSnackbar();

    const now = Date.now();
    const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();
    
    const sourceDeckId = selectedDeck.id;
    const cardsToMove = selectedDeck.cards?.filter(c => cardIds.includes(c.id)) || [];
    if (cardsToMove.length === 0) return;

    const updatedSourceCards = selectedDeck.cards?.filter(c => !cardIds.includes(c.id)) || [];
    
    let sourceDueRemoved = 0;
    cardsToMove.forEach(c => {
         const isDue = (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8;
         if (isDue) sourceDueRemoved++;
    });
    
    const newSourceToday = Math.max(0, (selectedDeck.cardsToday || 0) - sourceDueRemoved);

    const updatedSourceDeck = {
        ...selectedDeck,
        cards: updatedSourceCards,
        totalCards: updatedSourceCards.length,
        cardsToday: newSourceToday
    };

    const newCardsForTarget = cardsToMove.map(c => ({
        ...c,
        level: 1,
        dueDate: now
    }));

    setDecks(prevDecks => {
        return prevDecks.map(d => {
            if (d.id === sourceDeckId) {
                return { ...updatedSourceDeck, boxStatus: d.boxStatus, colorSeed: d.colorSeed }; // Preserve colorSeed
            }
            if (d.id === targetDeckId) {
                const existingCards = d.cards || [];
                const combinedCards = [...newCardsForTarget, ...existingCards];
                const addedDue = newCardsForTarget.length;
                return {
                    ...d,
                    cards: combinedCards,
                    totalCards: (d.totalCards || 0) + newCardsForTarget.length,
                    cardsToday: (d.cardsToday || 0) + addedDue
                };
            }
            return d;
        });
    });

    setSelectedDeck(updatedSourceDeck);
    
    const targetDeckTitle = decks.find(d => d.id === targetDeckId)?.title || 'target box';
    
    const undo = () => {
         const uEndOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();

         setDecks(prev => prev.map(d => {
             if (d.id === sourceDeckId) {
                 const restoredCards = [...(d.cards || []), ...cardsToMove];
                 let restoredDueCount = 0;
                 cardsToMove.forEach(c => {
                    const isDue = (!c.dueDate || c.dueDate <= uEndOfToday) && c.level < 8;
                    if (isDue) restoredDueCount++;
                 });
                 return {
                     ...d,
                     cards: restoredCards,
                     totalCards: (d.totalCards || 0) + cardsToMove.length,
                     cardsToday: (d.cardsToday || 0) + restoredDueCount
                 };
             }
             if (d.id === targetDeckId) {
                 const idsToRemove = cardsToMove.map(c => c.id);
                 const currentCards = d.cards || [];
                 const keptCards = currentCards.filter(c => !idsToRemove.includes(c.id));
                 const removedCards = currentCards.filter(c => idsToRemove.includes(c.id));
                 
                 let targetDueRemoved = 0;
                 removedCards.forEach(c => {
                     const isDue = (!c.dueDate || c.dueDate <= uEndOfToday) && c.level < 8;
                     if (isDue) targetDueRemoved++;
                 });

                 return {
                     ...d,
                     cards: keptCards,
                     totalCards: keptCards.length,
                     cardsToday: Math.max(0, (d.cardsToday || 0) - targetDueRemoved)
                 };
             }
             return d;
         }));

         setSelectedDeck(current => {
             if (current && current.id === sourceDeckId) {
                 const restoredCards = [...(current.cards || []), ...cardsToMove];
                 let restoredDueCount = 0;
                 cardsToMove.forEach(c => {
                      const isDue = (!c.dueDate || c.dueDate <= uEndOfToday) && c.level < 8;
                      if (isDue) restoredDueCount++;
                 });
                 return {
                     ...current,
                     cards: restoredCards,
                     totalCards: (current.totalCards || 0) + cardsToMove.length,
                     cardsToday: (current.cardsToday || 0) + restoredDueCount
                 };
             }
             return current;
         });
    };

    showUndoSnackbar(`${cardsToMove.length} cards moved to ${targetDeckTitle}`, undo);
  };

  const handleEditCard = (cardId: string, newFront: string, newBack: string) => {
    dismissSnackbar();
    if (!selectedDeck) return;
    
    const updatedCards = selectedDeck.cards?.map(c => 
        c.id === cardId ? { ...c, front: newFront, back: newBack } : c
    ) || [];

    const updatedDeck = {
        ...selectedDeck,
        cards: updatedCards
    };

    setSelectedDeck(updatedDeck);
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const handleCardResult = (cardId: string, success: boolean) => {
    if (!selectedDeck) return;

    if (studyMode === 'quiz') {
        if (success) {
            const currentQuizzed = selectedDeck.quizzedCardIds || [];
            if (!currentQuizzed.includes(cardId)) {
                const updatedQuizzed = [...currentQuizzed, cardId];
                const totalMastered = (selectedDeck.cards || []).filter(c => c.level >= 8).length;
                let finalQuizzed = updatedQuizzed;
                if (updatedQuizzed.length >= totalMastered) {
                     finalQuizzed = [];
                }

                const updatedDeck = {
                    ...selectedDeck,
                    quizzedCardIds: finalQuizzed
                };
                
                setSelectedDeck(updatedDeck);
                setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
            }
        }
        return;
    }

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999).getTime();
    
    const currentCards = selectedDeck.cards || [];
    const targetCardIndex = currentCards.findIndex(c => c.id === cardId);
    
    if (targetCardIndex === -1) return;

    const targetCard = currentCards[targetCardIndex];
    let updatedCard: Card;

    if (success) {
         const currentLevel = targetCard.level;
         if (currentLevel >= 7) {
             updatedCard = { ...targetCard, level: 8, dueDate: 0 };
         } else {
             let daysToAdd = 1;
             switch(currentLevel) {
                 case 1: daysToAdd = 1; break;
                 case 2: daysToAdd = 3; break;
                 case 3: daysToAdd = 7; break;
                 case 4: daysToAdd = 15; break;
                 case 5: daysToAdd = 31; break;
                 case 6: daysToAdd = 61; break;
                 default: daysToAdd = 1; break;
             }
             
             const nextDueDate = now + (daysToAdd * oneDay);
             updatedCard = { ...targetCard, level: targetCard.level + 1, dueDate: nextDueDate };
         }
    } else {
         updatedCard = { ...targetCard, level: 1, dueDate: now };
    }

    let newCards: Card[];
    if (!success) {
        const otherCards = currentCards.filter(c => c.id !== cardId);
        newCards = [updatedCard, ...otherCards];
    } else {
        newCards = currentCards.map(c => c.id === cardId ? updatedCard : c);
    }

    const cardsTodayCount = newCards.filter(c => (!c.dueDate || c.dueDate <= endOfToday) && c.level < 8).length;

    const updatedDeck = {
        ...selectedDeck,
        cards: newCards,
        cardsToday: cardsTodayCount
    };

    setSelectedDeck(updatedDeck);
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  if (showSettings) {
    return <SettingsPage 
      onBack={() => {
        dismissSnackbar();
        setShowSettings(false);
      }} 
      userName={userName} 
      onUserNameChange={setUserName}
      theme={theme}
      onThemeChange={setTheme}
    />;
  }

  if (showCongratulations && selectedDeck) {
    return (
      <CongratulationsPage 
        onContinue={() => {
           setShowCongratulations(false);
           setStudyLevel(undefined);
           setStudyMode('leitner');
        }}
        theme={theme}
        deck={selectedDeck}
      />
    );
  }

  if (isStudying && selectedDeck) {
      return (
          <StudyPage 
             deck={selectedDeck}
             onBack={() => {
                 setIsStudying(false);
                 setStudyLevel(undefined);
                 setStudyMode('leitner');
             }}
             onFinish={() => {
                setIsStudying(false);
                setShowCongratulations(true);
             }}
             theme={theme}
             onResult={handleCardResult}
             targetLevel={studyLevel}
             overrideCards={studyMode === 'quiz' ? quizCards : undefined}
          />
      )
  }

  return (
    <>
      {selectedDeck ? (
        <BoxDetail 
          deck={selectedDeck} 
          seed={selectedDeck.colorSeed || 0}
          allDecks={decks}
          onBack={() => {
            dismissSnackbar();
            setSelectedDeck(null);
          }} 
          onAddCard={handleAddCard}
          onImportCards={handleImportCards}
          onDeleteCard={handleDeleteCard}
          onDeleteCards={handleDeleteMultipleCards}
          onMoveCards={handleMoveCards}
          onEditCard={handleEditCard}
          onDeleteDeck={onRequestDeleteDeck}
          onRenameDeck={handleRenameDeck}
          onStudy={handleStudy}
          onQuizSetup={handleQuizSetup}
          onResetCard={handleResetCard}
          theme={theme}
          onInteraction={dismissSnackbar}
        />
      ) : (
        <div className="min-h-screen relative pb-24 overflow-x-hidden flex flex-col">
          {/* Header Section */}
          <header className="px-5 pt-6 pb-2 flex justify-between items-center z-10">
            <h1 className="text-2xl leading-tight text-slate-900 font-normal">
              Hi, {userName}!
            </h1>
            <button onClick={() => {
              dismissSnackbar();
              setShowSettings(true);
            }} className="p-2 active:scale-95 transition-transform group">
              <Settings size={24} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
            </button>
          </header>

          {/* Sub-header / Summary - Only visible when there are decks */}
          {decks.length > 0 && (
            <div className="px-5 mb-6 animate-in fade-in duration-300">
                <p className="text-xl text-slate-900">
                Cards to study today: <span className="font-bold" style={{ color: getThemeHex(theme) }}>{totalDue}</span>
                </p>
            </div>
          )}

          {/* Main Content Area */}
          <main className={`px-4 flex flex-col gap-1 flex-1 ${decks.length === 0 ? 'justify-center -mt-24' : ''}`}>
            {decks.length > 0 ? (
                decks.map((deck) => (
                <DeckCard 
                    key={deck.id}
                    deck={deck} 
                    onClick={handleDeckClick}
                    onDelete={onRequestDeleteDeck}
                    theme={theme}
                />
                ))
            ) : (
                <div className="flex flex-col items-center animate-in fade-in duration-500 px-4">
                    <p className="text-[22px] text-center text-slate-900 font-normal leading-relaxed mb-8">
                        Welcome to Leitner Box app!<br />
                        Let's start by adding your first box.
                    </p>
                </div>
            )}
          </main>

          {/* Floating Action Button */}
          <FloatingActionButton onClick={() => {
            dismissSnackbar();
            setIsModalOpen(true);
          }} theme={theme} />

          {/* Add Deck Modal */}
          <AddDeckModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={handleAddDeck}
            theme={theme} 
          />
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={!!deckToDelete}
        onClose={cancelDeleteDeck}
        onConfirm={confirmDeleteDeck}
        title="Are you sure you want to delete this box?"
        description="This action will also delete all the cards inside the box. It cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        theme={theme}
      />

      {selectedDeck && (
          <QuizSetupModal 
             isOpen={isQuizSetupOpen}
             onClose={() => setIsQuizSetupOpen(false)}
             onStart={handleStartQuiz}
             theme={theme}
             deckId={selectedDeck.id}
             totalAvailable={selectedDeck.cards ? selectedDeck.cards.filter(c => c.level >= 8).length : 0}
             cardsInCycle={selectedDeck.cards 
                ? selectedDeck.cards.filter(c => c.level >= 8 && !(selectedDeck.quizzedCardIds || []).includes(c.id)).length 
                : 0}
          />
      )}

      {/* Undo Snackbar */}
      <Snackbar 
        message={snackbarState.message}
        onUndo={handleUndo}
        isVisible={snackbarState.isVisible}
        theme={theme}
      />
    </>
  );
};

export default App;
