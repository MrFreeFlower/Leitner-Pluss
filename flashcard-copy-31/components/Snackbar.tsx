
import React, { useEffect, useState } from 'react';
import { Theme } from '../types';

interface SnackbarProps {
  message: string;
  onUndo: () => void;
  isVisible: boolean;
  theme: Theme;
}

const themeColors: Record<Theme, string> = {
  blue: '#56aaff',
  yellow: '#eab308', // Darker yellow for visibility on white background
  green: '#22c55e',
  pink: '#ec4899',
  purple: '#a855f7',
  pistachio: '#93C572',
  orange: '#fb923c',
  carnation: '#F95A61',
  latte: '#C4A484',
  chocolate: '#5D4037',
  lavender: '#CE93D8',
  iceBlue: '#80DEEA',
  magenta: '#FF00FF',
  olive: '#808000',
  lime: '#00C000', // Using darker for text visibility
  greenYellow: '#9ACD32', // Using darker for text visibility
  skyBlue: '#00BFFF',
};

export const Snackbar: React.FC<SnackbarProps> = ({ message, onUndo, isVisible, theme }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const startTime = Date.now();
      const duration = 4000;
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (elapsed >= duration) clearInterval(timer);
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  // Stable color per visibility cycle (or per theme change)
  const color = themeColors[theme];

  if (!isVisible) return null;

  // Clock Pie Chart Logic
  const radius = 5;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div id="snackbar-root" className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 w-auto">
      <div 
        className="bg-white px-6 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center border-2"
        style={{ borderColor: color }}
      >
        <button 
          onClick={onUndo}
          className="group flex items-center gap-3 text-base font-bold tracking-wide active:opacity-60 transition-opacity"
          style={{ color: color }}
        >
          <span>UNDO</span>
          {/* Clock Timer */}
          <div className="relative w-5 h-5 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 20 20">
                {/* Background faint circle */}
                <circle 
                  cx="10" 
                  cy="10" 
                  r="9" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="opacity-20"
                />
                {/* Progress Pie (Swipe area) */}
                <circle 
                  cx="10" 
                  cy="10" 
                  r={radius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
             </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
