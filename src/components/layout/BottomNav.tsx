import React from 'react';
import { LayoutGrid, BookOpen, Grid, Trophy, Compass, BookCheck, PenTool } from 'lucide-react';

export type TabType = 'menu' | 'learn' | 'chart' | 'write' | 'drills' | 'signs' | 'reader' | 'cards' | 'flashcards';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  // Only rendered if desktop or user wants quick dock; can be omitted on mobile since Main Menu Hub handles navigation
  const tabs = [
    { id: 'menu' as TabType, label: 'Menu', icon: LayoutGrid },
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'write' as TabType, label: 'Write', icon: PenTool },
    { id: 'drills' as TabType, label: 'Quiz', icon: Trophy },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1 safe-bottom">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-japan-crimson font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-red-50 text-japan-crimson' : ''
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
