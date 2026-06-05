
export interface Card {
  id: string;
  front: string;
  back: string;
  level: number;
  dueDate?: number;
}

export interface Deck {
  id: number;
  title: string;
  totalCards: number;
  cardsToday: number;
  boxStatus: boolean[]; // true = colored (active), false = gray (inactive)
  cards?: Card[];
  quizzedCardIds?: string[]; // IDs of cards successfully remembered in the current quiz cycle
  colorSeed?: number; // Persist random color assignment
}

export type Theme = 'blue' | 'yellow' | 'green' | 'pink' | 'purple' | 'pistachio' | 'orange' | 'carnation' | 'latte' | 'chocolate' | 'lavender' | 'iceBlue' | 'magenta' | 'olive' | 'lime' | 'greenYellow' | 'skyBlue';

export const THEME_HEX_MAP: Record<Theme, string> = {
    blue: '#3b82f6', // blue-500
    yellow: '#facc15', // yellow-400
    green: '#22c55e', // green-500
    pink: '#ec4899', // pink-500
    purple: '#a855f7', // purple-500
    pistachio: '#93C572',
    orange: '#fb923c', // orange-400
    carnation: '#F95A61',
    latte: '#C4A484',
    chocolate: '#5D4037',
    lavender: '#CE93D8',
    iceBlue: '#80DEEA',
    magenta: '#FF00FF',
    olive: '#808000',
    lime: '#00FF00',
    greenYellow: '#ADFF2F',
    skyBlue: '#00BFFF',
};

export const getThemeHex = (theme: Theme): string => {
    return THEME_HEX_MAP[theme];
};
