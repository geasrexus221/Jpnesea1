import React from 'react';
import { Flame, Settings, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  streak: number;
  onOpenSettings: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  streak,
  onOpenSettings,
  title = '日本語を読む',
  subtitle = 'Japanese Reading Practice',
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-japan-crimson flex items-center justify-center text-white shadow-md font-japanese font-bold text-lg select-none">
            あ
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
              <span>{title}</span>
              <span className="hidden sm:inline-block text-xs font-normal text-japan-crimson px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
                Beginner Track
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Right Actions: Streak Counter & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Badge */}
          <div
            title={`${streak} Day Learning Streak`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs sm:text-sm shadow-sm select-none"
          >
            <Flame size={16} className="text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streak}</span>
            <span className="hidden md:inline font-normal text-amber-600">days</span>
          </div>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-stone-200/60 active:scale-95 transition-all"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
