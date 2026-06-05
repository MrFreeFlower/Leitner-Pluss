
import React, { useState, useRef } from 'react';
import { Box } from 'lucide-react';
import { Theme } from '../types';

interface BoxIconProps {
  active?: boolean;
  theme: Theme;
  color?: string; // Hex color override
}

const themeClasses: Record<Theme, string> = {
  blue: 'text-blue-500 fill-blue-500/20',
  yellow: 'text-yellow-500 fill-yellow-500/20',
  green: 'text-green-600 fill-green-600/20',
  pink: 'text-pink-600 fill-pink-600/20',
  purple: 'text-purple-500 fill-purple-500/20',
  pistachio: 'text-[#93C572] fill-[#93C572]/20',
  orange: 'text-orange-400 fill-orange-400/20',
  carnation: 'text-[#F95A61] fill-[#F95A61]/20',
  latte: 'text-[#C4A484] fill-[#C4A484]/20',
  chocolate: 'text-[#5D4037] fill-[#5D4037]/20',
  lavender: 'text-[#CE93D8] fill-[#CE93D8]/20',
  iceBlue: 'text-[#80DEEA] fill-[#80DEEA]/20',
  magenta: 'text-[#FF00FF] fill-[#FF00FF]/20',
  olive: 'text-[#808000] fill-[#808000]/20',
  lime: 'text-[#00C000] fill-[#00FF00]/20',
  greenYellow: 'text-[#9ACD32] fill-[#ADFF2F]/20',
  skyBlue: 'text-[#00BFFF] fill-[#00BFFF]/20',
};

export const BoxIcon: React.FC<BoxIconProps> = ({ active = false, theme, color }) => {
  if (color) {
      return (
        <Box 
          size={20} 
          style={{ 
             color: active ? color : undefined,
             fill: active ? `${color}33` : undefined // 20% opacity approx 
          }}
          className={!active ? "text-slate-400" : ""}
          strokeWidth={1.5}
        />
      );
  }

  return (
    <Box 
      size={20} 
      className={active ? themeClasses[theme] : "text-slate-400"}
      strokeWidth={1.5}
    />
  );
};
