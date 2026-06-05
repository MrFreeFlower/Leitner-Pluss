
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Theme, getThemeHex } from '../types';

interface SettingsPageProps {
  onBack: () => void;
  userName: string;
  onUserNameChange: (name: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeBgClasses: Record<Theme, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    pistachio: 'bg-[#93C572]',
    orange: 'bg-orange-400',
    carnation: 'bg-[#F95A61]',
    latte: 'bg-[#C4A484]',
    chocolate: 'bg-[#5D4037]',
    lavender: 'bg-[#CE93D8]',
    iceBlue: 'bg-[#80DEEA]',
    magenta: 'bg-[#FF00FF]',
    olive: 'bg-[#808000]',
    lime: 'bg-[#00FF00]',
    greenYellow: 'bg-[#ADFF2F]',
    skyBlue: 'bg-[#00BFFF]',
};

const ToggleSwitch: React.FC<{enabled: boolean, onToggle: () => void, theme: Theme}> = ({ enabled, onToggle, theme }) => {
    const activeClass = themeBgClasses[theme];
    
    return (
        <button 
            onClick={onToggle} 
            className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${enabled ? activeClass : 'bg-slate-300'}`}
            aria-pressed={enabled}
            role="switch"
        >
            <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
};

const themeFocusClasses: Record<Theme, string> = {
    blue: 'focus:ring-blue-400',
    yellow: 'focus:ring-yellow-400',
    green: 'focus:ring-green-500',
    pink: 'focus:ring-pink-400',
    purple: 'focus:ring-purple-400',
    pistachio: 'focus:ring-[#93C572]',
    orange: 'focus:ring-orange-400',
    carnation: 'focus:ring-[#F95A61]',
    latte: 'focus:ring-[#C4A484]',
    chocolate: 'focus:ring-[#5D4037]',
    lavender: 'focus:ring-[#CE93D8]',
    iceBlue: 'focus:ring-[#80DEEA]',
    magenta: 'focus:ring-[#FF00FF]',
    olive: 'focus:ring-[#808000]',
    lime: 'focus:ring-[#00FF00]',
    greenYellow: 'focus:ring-[#ADFF2F]',
    skyBlue: 'focus:ring-[#00BFFF]',
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, userName, onUserNameChange, theme, onThemeChange }) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('16:00');
  const [showExtendedColors, setShowExtendedColors] = useState(false);

  const handleTimeChange = (part: 'hour' | 'minute', value: string) => {
    const [currentHour, currentMinute] = reminderTime.split(':');
    let sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 2);

    if (part === 'hour') {
        if (parseInt(sanitizedValue, 10) > 23) {
            sanitizedValue = '23';
        }
        setReminderTime(`${sanitizedValue}:${currentMinute}`);
    } else { // minute
        if (parseInt(sanitizedValue, 10) > 59) {
            sanitizedValue = '59';
        }
        setReminderTime(`${currentHour}:${sanitizedValue}`);
    }
  };

  const handleTimeBlur = () => {
      const [currentHour, currentMinute] = reminderTime.split(':');
      setReminderTime(`${currentHour.padStart(2, '0')}:${currentMinute.padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-slate-900 animate-slow-fade pb-10">
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center">
        <button onClick={onBack} className="p-3 -ml-3 rounded-full active:bg-slate-200/60 active:scale-95 transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-center flex-1 -ml-8">Settings</h1>
      </header>

      <main className="px-4 mt-4">
        {/* General Section */}
        <section>
          <h2 className="text-sm font-normal text-slate-500 uppercase tracking-wider px-4 py-2">General</h2>
          <div className="flex flex-col gap-2">
            
            <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center min-h-[64px]">
              <span className="text-base">Your Name</span>
              <input 
                type="text" 
                value={userName} 
                onChange={e => onUserNameChange(e.target.value)}
                aria-label="Your Name"
                className={`bg-slate-100 rounded-lg px-3 py-1.5 text-base text-slate-700 text-center border-0 focus:outline-none focus:ring-2 ${themeFocusClasses[theme]} w-36 transition`}
              />
            </div>

            <div className={`bg-white rounded-xl shadow-sm p-4 flex flex-col justify-center min-h-[64px] gap-4 transition-all duration-300`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-base">Color</span>
                <div className="flex items-center gap-4">
                    <button
                    aria-label="Blue Theme"
                    onClick={() => onThemeChange('blue')}
                    className={`w-7 h-7 rounded-full bg-blue-500 transition-all focus:outline-none ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    />
                    <button
                    aria-label="Yellow Theme"
                    onClick={() => onThemeChange('yellow')}
                    className={`w-7 h-7 rounded-full bg-yellow-400 transition-all focus:outline-none ${theme === 'yellow' ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}
                    />
                    <button
                    aria-label="Green Theme"
                    onClick={() => onThemeChange('green')}
                    className={`w-7 h-7 rounded-full bg-green-500 transition-all focus:outline-none ${theme === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                    />
                    <button
                    aria-label="Pink Theme"
                    onClick={() => onThemeChange('pink')}
                    className={`w-7 h-7 rounded-full bg-pink-500 transition-all focus:outline-none ${theme === 'pink' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`}
                    />
                    <button
                    aria-label="Purple Theme"
                    onClick={() => onThemeChange('purple')}
                    className={`w-7 h-7 rounded-full bg-purple-500 transition-all focus:outline-none ${theme === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                    />
                    {/* Expand Colors Button */}
                    <button
                        onClick={() => setShowExtendedColors(!showExtendedColors)}
                        className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-all focus:outline-none active:scale-95 hover:bg-slate-200 ${showExtendedColors ? 'bg-slate-200' : ''}`}
                        aria-label="Show more colors"
                    >
                        <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${showExtendedColors ? 'rotate-180' : ''}`} />
                    </button>
                </div>
              </div>

              {/* Extended Colors Row */}
              {showExtendedColors && (
                  <div className="flex flex-wrap items-center justify-end gap-4 w-full animate-in slide-in-from-top-2 fade-in duration-300 pr-11">
                      <button
                      aria-label="Pistachio Theme"
                      onClick={() => onThemeChange('pistachio')}
                      className={`w-7 h-7 rounded-full bg-[#93C572] transition-all focus:outline-none ${theme === 'pistachio' ? 'ring-2 ring-offset-2 ring-[#93C572]' : ''}`}
                      />
                      <button
                      aria-label="Orange Theme"
                      onClick={() => onThemeChange('orange')}
                      className={`w-7 h-7 rounded-full bg-orange-400 transition-all focus:outline-none ${theme === 'orange' ? 'ring-2 ring-offset-2 ring-orange-400' : ''}`}
                      />
                      <button
                      aria-label="Carnation Theme"
                      onClick={() => onThemeChange('carnation')}
                      className={`w-7 h-7 rounded-full bg-[#F95A61] transition-all focus:outline-none ${theme === 'carnation' ? 'ring-2 ring-offset-2 ring-[#F95A61]' : ''}`}
                      />
                      <button
                      aria-label="Latte Theme"
                      onClick={() => onThemeChange('latte')}
                      className={`w-7 h-7 rounded-full bg-[#C4A484] transition-all focus:outline-none ${theme === 'latte' ? 'ring-2 ring-offset-2 ring-[#C4A484]' : ''}`}
                      />
                      <button
                      aria-label="Chocolate Theme"
                      onClick={() => onThemeChange('chocolate')}
                      className={`w-7 h-7 rounded-full bg-[#5D4037] transition-all focus:outline-none ${theme === 'chocolate' ? 'ring-2 ring-offset-2 ring-[#5D4037]' : ''}`}
                      />
                      <button
                      aria-label="Lavender Theme"
                      onClick={() => onThemeChange('lavender')}
                      className={`w-7 h-7 rounded-full bg-[#CE93D8] transition-all focus:outline-none ${theme === 'lavender' ? 'ring-2 ring-offset-2 ring-[#CE93D8]' : ''}`}
                      />
                      <button
                      aria-label="Ice Blue Theme"
                      onClick={() => onThemeChange('iceBlue')}
                      className={`w-7 h-7 rounded-full bg-[#80DEEA] transition-all focus:outline-none ${theme === 'iceBlue' ? 'ring-2 ring-offset-2 ring-[#80DEEA]' : ''}`}
                      />
                      <button
                      aria-label="Magenta Theme"
                      onClick={() => onThemeChange('magenta')}
                      className={`w-7 h-7 rounded-full bg-[#FF00FF] transition-all focus:outline-none ${theme === 'magenta' ? 'ring-2 ring-offset-2 ring-[#FF00FF]' : ''}`}
                      />
                      <button
                      aria-label="Olive Theme"
                      onClick={() => onThemeChange('olive')}
                      className={`w-7 h-7 rounded-full bg-[#808000] transition-all focus:outline-none ${theme === 'olive' ? 'ring-2 ring-offset-2 ring-[#808000]' : ''}`}
                      />
                      <button
                      aria-label="Lime Theme"
                      onClick={() => onThemeChange('lime')}
                      className={`w-7 h-7 rounded-full bg-[#00FF00] transition-all focus:outline-none ${theme === 'lime' ? 'ring-2 ring-offset-2 ring-[#00FF00]' : ''}`}
                      />
                      <button
                      aria-label="Green Yellow Theme"
                      onClick={() => onThemeChange('greenYellow')}
                      className={`w-7 h-7 rounded-full bg-[#ADFF2F] transition-all focus:outline-none ${theme === 'greenYellow' ? 'ring-2 ring-offset-2 ring-[#ADFF2F]' : ''}`}
                      />
                      <button
                      aria-label="Sky Blue Theme"
                      onClick={() => onThemeChange('skyBlue')}
                      className={`w-7 h-7 rounded-full bg-[#00BFFF] transition-all focus:outline-none ${theme === 'skyBlue' ? 'ring-2 ring-offset-2 ring-[#00BFFF]' : ''}`}
                      />
                  </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center min-h-[64px]">
              <span className="text-base">Reminder</span>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                    <input 
                        type="text"
                        inputMode="numeric" 
                        value={reminderTime.split(':')[0]} 
                        onChange={e => handleTimeChange('hour', e.target.value)}
                        onBlur={handleTimeBlur}
                        aria-label="Reminder hour"
                        className={`bg-slate-100 rounded-lg w-12 text-center py-1.5 text-base text-slate-700 border-0 focus:outline-none focus:ring-2 ${themeFocusClasses[theme]} transition`}
                    />
                    <span className="text-slate-500 font-semibold text-lg pb-0.5">:</span>
                    <input 
                        type="text"
                        inputMode="numeric" 
                        value={reminderTime.split(':')[1]} 
                        onChange={e => handleTimeChange('minute', e.target.value)}
                        onBlur={handleTimeBlur}
                        aria-label="Reminder minute"
                        className={`bg-slate-100 rounded-lg w-12 text-center py-1.5 text-base text-slate-700 border-0 focus:outline-none focus:ring-2 ${themeFocusClasses[theme]} transition`}
                    />
                 </div>
                 <ToggleSwitch 
                    enabled={reminderEnabled} 
                    onToggle={() => setReminderEnabled(!reminderEnabled)} 
                    theme={theme}
                 />
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};
