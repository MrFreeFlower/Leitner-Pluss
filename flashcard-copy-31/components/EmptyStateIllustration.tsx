
import React from 'react';
import { Theme } from '../types';

interface EmptyStateIllustrationProps {
  theme: Theme;
}

const themeColors: Record<Theme, string> = {
  blue: '#56aaff',
  yellow: '#facc15',
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
  lime: '#00FF00',
  greenYellow: '#ADFF2F',
  skyBlue: '#00BFFF',
};

export const EmptyStateIllustration: React.FC<EmptyStateIllustrationProps> = ({ theme }) => {
  const mainColor = themeColors[theme];

  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-4 select-none">
       {/* Definitions for Gradients and Filters */}
       <defs>
         <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
         </filter>
       </defs>

       {/* Speech Bubble */}
       <g transform="translate(65, 10)" className="animate-in zoom-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards">
         <path 
            d="M20 10 H130 C143 10 154 21 154 34 V70 C154 83 143 94 130 94 H90 L65 110 L60 94 H20 C7 94 -4 83 -4 70 V34 C-4 21 7 10 20 10 Z" 
            fill={mainColor} 
            filter="url(#softShadow)"
         />
         <text x="75" y="62" textAnchor="middle" fill="white" fontSize="28" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.5">Hello!</text>
         {/* Bubble Highlight */}
         <path d="M15 25 Q25 15 45 15" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
       </g>

       {/* Primitive Man with Stick */}
       <g transform="translate(60, 100)">
          
          {/* Big Wooden Stick (Behind) */}
          <g transform="rotate(-15 45 80)">
             <path d="M25 20 C10 20 0 35 5 50 L35 140 L55 135 L25 50 C28 35 40 20 25 20 Z" fill="#8D6E63" />
             {/* Wood grain details */}
             <path d="M15 40 Q25 50 35 40" stroke="#5D4037" strokeWidth="2" fill="none" opacity="0.5" />
             <path d="M20 80 Q30 90 40 80" stroke="#5D4037" strokeWidth="2" fill="none" opacity="0.5" />
          </g>

          {/* Hair (Back Layer) */}
          <path d="M30 60 C20 50 10 70 15 90 C20 100 10 110 20 120 L140 120 C150 110 140 100 145 90 C150 70 140 50 130 60" fill="#3E2723" />

          {/* Body/Skin */}
          <path d="M50 120 L50 160 C50 175 60 180 80 180 C100 180 110 175 110 160 L110 120" fill="#FFDFC4" />
          
          {/* Legs */}
          <path