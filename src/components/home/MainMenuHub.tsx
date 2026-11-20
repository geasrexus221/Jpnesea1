import React from 'react';
import {
  BookOpen,
  Grid,
  PenTool,
  Trophy,
  Compass,
  BookCheck,
  Sparkles,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { TabType } from '../layout/BottomNav';

interface MainMenuHubProps {
  onSelectTab: (tab: TabType) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
  streakDays: number;
}

export const MainMenuHub: React.FC<MainMenuHubProps> = ({
  onSelectTab,
  completedLessonsCount,
  totalLessonsCount,
  streakDays,
}) => {
  // 6 Core Modules arranged in 3 logical rows (2 columns x 3 rows)
  const menuItems = [
    // ROW 1: FOUNDATIONS (Lessons & Reference)
    {
      id: 'learn' as TabType,
      title: 'Curriculum',
      japaneseTitle: 'カリキュラム',
      description: 'Step-by-step path',
      badge: 'Start Here',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen,
      iconColor: 'bg-blue-500 text-white',
      cardTheme: 'from-blue-50/40 to-white hover:border-blue-300',
    },
    {
      id: 'chart' as TabType,
      title: 'Kana Charts',
      japaneseTitle: '五十音図',
      description: '50-Sounds & audio',
      badge: 'Audio Grid',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Grid,
      iconColor: 'bg-indigo-500 text-white',
      cardTheme: 'from-indigo-50/40 to-white hover:border-indigo-300',
    },

    // ROW 2: ACTIVE PRACTICE (Handwriting & Survival Quiz)
    {
      id: 'write' as TabType,
      title: 'Writing Gym',
      japaneseTitle: '書道 (Shodō)',
      description: 'Manuscript canvas',
      badge: 'Draw & Check',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: PenTool,
      iconColor: 'bg-emerald-600 text-white',
      cardTheme: 'from-emerald-50/40 to-white hover:border-emerald-300',
    },
    {
      id: 'drills' as TabType,
      title: 'Quiz Arena',
      japaneseTitle: 'クイズ試験',
      description: 'Survival 3-lives',
      badge: 'Pass / Fail',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Trophy,
      iconColor: 'bg-amber-500 text-white',
      cardTheme: 'from-amber-50/40 to-white hover:border-amber-300',
    },

    // ROW 3: REAL-WORLD APPLICATION (Signs & Graded Sentences)
    {
      id: 'signs' as TabType,
      title: 'Street Signs',
      japaneseTitle: '看板・標識',
      description: 'Station & combini',
      badge: 'Real Japan',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Compass,
      iconColor: 'bg-rose-500 text-white',
      cardTheme: 'from-rose-50/40 to-white hover:border-rose-300',
    },
    {
      id: 'reader' as TabType,
      title: 'Sentence Reader',
      japaneseTitle: '多読 (Tadoku)',
      description: 'Furigana text',
      badge: 'Read Stories',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: BookCheck,
      iconColor: 'bg-teal-600 text-white',
      cardTheme: 'from-teal-50/40 to-white hover:border-teal-300',
    },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-3 sm:space-y-4 pb-12 animate-fade-in">
      {/* Quick Progress Banner */}
      <div className="bg-gradient-to-r from-red-500 to-japan-crimson rounded-2xl p-3.5 text-white shadow-md flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-100">
            <Flame size={14} className="fill-amber-300 text-amber-300" />
            <span>{streakDays} Day Learning Streak</span>
          </div>
          <div className="text-sm font-bold tracking-tight">
            Ready to read Japanese?
          </div>
          <div className="text-[11px] text-red-100">
            {completedLessonsCount} of {totalLessonsCount} lessons finished
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('learn')}
          className="px-3.5 py-2 rounded-xl bg-white text-japan-crimson font-bold text-xs shadow-sm hover:bg-stone-50 active:scale-95 transition-all flex items-center gap-1"
        >
          <span>Continue</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2-Column x 3-Row Grid (Fits on any mobile screen without scrolling) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${item.cardTheme} border border-stone-200/90 shadow-sm transition-all duration-150 active:scale-95 text-left flex flex-col justify-between group h-[115px] sm:h-[135px]`}
            >
              {/* Card Top: Icon & Badge */}
              <div className="flex items-start justify-between w-full">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${item.iconColor} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Card Bottom: Titles & Subtitle */}
              <div className="mt-1">
                <div className="font-japanese text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none">
                  {item.japaneseTitle}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight mt-0.5 group-hover:text-japan-crimson transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
