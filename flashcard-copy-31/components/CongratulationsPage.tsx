
import React, { useMemo } from 'react';
import { 
  GraduationCap, Pencil, ThumbsUp, Brain, Medal, AlarmClock, Hourglass, StickyNote, Monitor, Trophy,
  BookOpen, Lightbulb, Calculator, Globe, Microscope, PartyPopper, Music,
  Zap, Puzzle, Rocket, Crown, Gem, Key, Compass, Feather, Umbrella, Palette
} from 'lucide-react';
import { Theme } from '../types';
import { Deck } from '../types';

interface CongratulationsPageProps {
  onContinue: () => void;
  theme: Theme;
  deck: Deck;
}

const themeClasses: Record<Theme, { fill: string; text: string; border: string; icon: string }> = {
  blue: { fill: 'bg-[#56aaff]', text: 'text-[#56aaff]', border: 'border-[#56aaff]', icon: 'text-[#56aaff]' },
  yellow: { fill: 'bg-yellow-400', text: 'text-yellow-500', border: 'border-yellow-400', icon: 'text-yellow-400' },
  green: { fill: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', icon: 'text-green-500' },
  pink: { fill: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', icon: 'text-pink-500' },
  purple: { fill: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', icon: 'text-purple-500' },
  pistachio: { fill: 'bg-[#93C572]', text: 'text-[#93C572]', border: 'border-[#93C572]', icon: 'text-[#93C572]' },
  orange: { fill: 'bg-orange-400', text: 'text-orange-400', border: 'border-orange-400', icon: 'text-orange-400' },
  carnation: { fill: 'bg-[#F95A61]', text: 'text-[#F95A61]', border: 'border-[#F95A61]', icon: 'text-[#F95A61]' },
  latte: { fill: 'bg-[#C4A484]', text: 'text-[#C4A484]', border: 'border-[#C4A484]', icon: 'text-[#C4A484]' },
  chocolate: { fill: 'bg-[#5D4037]', text: 'text-[#5D4037]', border: 'border-[#5D4037]', icon: 'text-[#5D4037]' },
  lavender: { fill: 'bg-[#CE93D8]', text: 'text-[#CE93D8]', border: 'border-[#CE93D8]', icon: 'text-[#CE93D8]' },
  iceBlue: { fill: 'bg-[#80DEEA]', text: 'text-[#80DEEA]', border: 'border-[#80DEEA]', icon: 'text-[#80DEEA]' },
  magenta: { fill: 'bg-[#FF00FF]', text: 'text-[#FF00FF]', border: 'border-[#FF00FF]', icon: 'text-[#FF00FF]' },
  olive: { fill: 'bg-[#808000]', text: 'text-[#808000]', border: 'border-[#808000]', icon: 'text-[#808000]' },
  lime: { fill: 'bg-[#00FF00]', text: 'text-[#00C000]', border: 'border-[#00FF00]', icon: 'text-[#00C000]' },
  greenYellow: { fill: 'bg-[#ADFF2F]', text: 'text-[#9ACD32]', border: 'border-[#ADFF2F]', icon: 'text-[#9ACD32]' },
  skyBlue: { fill: 'bg-[#00BFFF]', text: 'text-[#00BFFF]', border: 'border-[#00BFFF]', icon: 'text-[#00BFFF]' },
};

const ColorfulTrophyIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="trophyGold" x1="256" y1="80" x2="256" y2="400" gradientUnits="userSpaceOnUse">
           <stop offset="0%" stopColor="#FDE047" /> {/* Lighter Gold */}
           <stop offset="20%" stopColor="#FACC15" /> 
           <stop offset="50%" stopColor="#EAB308" /> {/* Rich Gold */}
           <stop offset="100%" stopColor="#A16207" /> {/* Dark Gold Shadow */}
        </linearGradient>
        
        <linearGradient id="trophyHandles" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%" stopColor="#CA8A04" />
           <stop offset="50%" stopColor="#EAB308" />
           <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        <linearGradient id="baseGradient" x1="256" y1="380" x2="256" y2="500" gradientUnits="userSpaceOnUse">
           <stop offset="0%" stopColor="#854D0E" />
           <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Base */}
      <path d="M166 442 h180 a 10 10 0 0 1 10 10 v20 a 10 10 0 0 1 -10 10 h-180 a 10 10 0 0 1 -10 -10 v-20 a 10 10 0 0 1 10 -10 z" fill="url(#baseGradient)"/>
      <path d="M226 380 h60 l 15 62 h-90 z" fill="#713F12"/>

      {/* Handles (Back part) */}
      <path d="M125 150 c -50 0 -60 100 -10 140 c 15 12 35 15 45 5" stroke="url(#trophyHandles)" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M387 150 c 50 0 60 100 10 140 c -15 12 -35 15 -45 5" stroke="url(#trophyHandles)" strokeWidth="18" fill="none" strokeLinecap="round" />

      {/* Cup Body */}
      <path d="M118 100 h276 c 0 0 25 210 -138 290 c -163 -80 -138 -290 -138 -290 z" fill="url(#trophyGold)" filter="url(#shadow)" />
      
      {/* Rim */}
      <ellipse cx="256" cy="100" rx="138" ry="18" fill="#FEF9C3" />
      <ellipse cx="256" cy="100" rx="122" ry="14" fill="#FACC15" />

      {/* Inner Shine */}
      <path d="M170 140 Q 185 240 230 320" stroke="white" strokeWidth="10" strokeLinecap="round" opacity="0.3" fill="none" />
      <path d="M342 140 Q 327 240 282 320" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.15" fill="none" />
      
      {/* Star Emblem */}
      <path transform="translate(256, 210) scale(3.5)" d="M0 -10 L2.3 -3.2 L9.5 -3.2 L3.6 1.2 L5.9 8.1 L0 3.8 L-5.9 8.1 L-3.6 1.2 L-9.5 -3.2 L-2.3 -3.2 Z" fill="#FFFFFF" opacity="0.95" />
    </svg>
);

export const CongratulationsPage: React.FC<CongratulationsPageProps> = ({ onContinue, theme, deck }) => {
  const classes = themeClasses[theme];

  // Use Stratified Sampling (Grid + Jitter) to ensure semi-equal distances between icons
  const pattern = useMemo(() => {
    let icons: any[] = [];
    
    // Normal Mode (Education/Study icons)
    icons = [
        GraduationCap, Pencil, ThumbsUp, Brain, Medal, AlarmClock, Hourglass, StickyNote, Monitor, Trophy,
        BookOpen, Lightbulb, Calculator, Globe, Microscope, PartyPopper, Music,
        Zap, Puzzle, Rocket, Crown, Gem, Key, Compass, Feather, Umbrella, Palette
    ];

    const items: any[] = [];
    
    // Grid Configuration
    const cols = 7;
    const rows = 13;
    
    const cellW = 100 / cols;
    const cellH = 100 / rows;

    // Deterministic Random Number Generator (LCG)
    let seed = 123456;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const randomInt = (max: number) => Math.floor(random() * max);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Calculate base cell center
            const baseX = c * cellW + cellW / 2;
            const baseY = r * cellH + cellH / 2;

            // Apply Jitter
            const jitterFactor = 0.7; // 0.7 width means +/- 0.35
            const jitterX = (random() - 0.5) * cellW * jitterFactor;
            const jitterY = (random() - 0.5) * cellH * jitterFactor;

            const cX = baseX + jitterX;
            const cY = baseY + jitterY;

            // Exclusion Zone Logic (Ellipse around the trophy)
            const dx = cX - 50;
            const dy = cY - 50;
            
            // RX = 28 (56% width), RY = 18 (36% height)
            const val = (dx * dx) / (28 * 28) + (dy * dy) / (18 * 18);
            
            if (val >= 1) {
                // Animation Parameters
                const startRot = Math.floor(random() * 360);
                const spin = 720 + random() * 1080; 
                const direction = random() > 0.5 ? 1 : -1;
                const endRot = startRot + (spin * direction);
                
                // Drift between -30vw and +30vw
                const drift = (random() - 0.5) * 60; 

                items.push({
                    Icon: icons[randomInt(icons.length)],
                    left: cX,
                    top: cY,
                    // Animation Props
                    duration: 5 + random() * 4, // Range 5s to 9s
                    delay: random() * -9, // Adjusted delay to match new duration range
                    startRot,
                    endRot,
                    drift,
                });
            }
        }
    }
    return items;
  }, [theme]);

  return (
    <div 
        onClick={onContinue}
        className="fixed inset-0 bg-[#F3F5F9] flex flex-col items-center justify-center z-50 overflow-hidden cursor-pointer"
    >
      <style>
      {`
        @keyframes fall-drift-rotate {
          0% { 
            transform: translate(-50%, -50%) translate(0, -150vh) rotate(var(--start-rot)); 
          }
          100% { 
            transform: translate(-50%, -50%) translate(var(--drift), 150vh) rotate(var(--end-rot)); 
          }
        }
      `}
      </style>

      {/* Background Pattern Layer (z-0 to stay behind content) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {pattern.map((item, i) => (
            <div 
                key={i} 
                className="absolute"
                style={{
                    left: `${item.left}%`,
                    top: `${item.top}%`,
                    // Using CSS Variables for unique animation paths
                    // Casting to any to allow custom properties
                    ['--drift' as any]: `${item.drift}vw`,
                    ['--start-rot' as any]: `${item.startRot}deg`,
                    ['--end-rot' as any]: `${item.endRot}deg`,
                    animation: `fall-drift-rotate ${item.duration}s linear infinite`,
                    animationDelay: `${item.delay}s`
                }}
            >
                {/* Scale Wrapper (Static relative to animation) */}
                <div style={{
                    transform: `scale(1)`,
                    opacity: 1
                }}>
                    <item.Icon 
                        size={25} 
                        className={classes.icon}
                        strokeWidth={2}
                    />
                </div>
            </div>
        ))}
      </div>

      {/* Content Container (z-10 to stay above icons) */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-6">
          {/* Center Trophy */}
          <div 
            className={`w-56 h-56 rounded-full bg-white border-[3px] flex items-center justify-center shadow-xl shadow-slate-200/50 animate-zoom-in ${classes.border}`}
          >
             <ColorfulTrophyIcon size={140} className="drop-shadow-sm" />
          </div>

          {/* Congratulations Text */}
          <div 
            className={`flex flex-col items-center opacity-0 animate-zoom-in bg-white border-[3px] rounded-3xl px-12 py-8 shadow-sm ${classes.border}`} 
            style={{ 
                animationDelay: '0.15s'
            }}
          >
             <h2 
                className={`text-3xl font-bold tracking-tight text-center ${classes.text}`}
             >
                Congratulations!
             </h2>
             <p className="text-lg text-slate-500 font-medium mt-2 text-center">Session complete</p>
          </div>
      </div>

    </div>
  );
};
