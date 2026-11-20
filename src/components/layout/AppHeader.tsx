import React from 'react';
import { Flame, Settings, ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  streak: number;
  onOpenSettings: () => void;
  title?: string;
  subtitle?: string;
  currentTabName?: string;
  showBackButton?: boolean;
  onBackToMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  streak,
  onOpenSettings,
  title = '日本語を読む',
  subtitle = 'Japanese Reading Practice',
  currentTabName,
  showBackButton = false,
  onBackToMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/80 px-3 py-2.5 sm:px-6 sm:py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Back to Menu button OR Brand Logo */}
        <div className="flex items-center gap-2.5">
          {showBackButton && onBackToMenu ? (
            <button
              type="button"
              onClick={onBackToMenu}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 active:scale-95 transition-all flex items-center gap-1.5 font-bold text-xs"
              title="Return to Main Menu"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-japan-crimson flex items-center justify-center text-white shadow-sm font-japanese font-bold text-base sm:text-lg select-none">
              あ
            </div>
          )}

          <div>
            <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>{showBackButton && currentTabName ? currentTabName : title}</span>
              {!showBackButton && (
                <span className="hidden sm:inline-block text-[10px] font-normal text-japan-crimson px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
                  Beginner
                </span>
              )}
            </h1>
            {!showBackButton && (
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Actions: Streak & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Badge */}
          <div
            title={`${streak} Day Learning Streak`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs shadow-sm select-none"
          >
            <Flame size={14} className="text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streak}</span>
            <span className="hidden md:inline font-normal text-amber-600">days</span>
          </div>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-stone-200/60 active:scale-95 transition-all"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
