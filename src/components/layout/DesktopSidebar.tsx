import React from 'react';
import {
  LayoutGrid,
  BookOpen,
  Grid,
  Trophy,
  Compass,
  BookCheck,
  Sparkles,
  PenTool,
} from 'lucide-react';
import { TabType } from './BottomNav';

interface DesktopSidebarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onChangeTab,
  completedLessonsCount,
  totalLessonsCount,
}) => {
  const menuItems = [
    {
      id: 'menu' as TabType,
      label: 'Main Menu (ホーム)',
      sublabel: 'Overview & 3-row hub',
      icon: LayoutGrid,
    },
    {
      id: 'learn' as TabType,
      label: 'Curriculum Path',
      sublabel: 'Step-by-step masterclass',
      icon: BookOpen,
    },
    {
      id: 'chart' as TabType,
      label: 'Kana Charts',
      sublabel: '50-Sounds audio & drill',
      icon: Grid,
    },
    {
      id: 'write' as TabType,
      label: 'Writing Gym (書道)',
      sublabel: 'Zen manuscript practice pad',
      icon: PenTool,
    },
    {
      id: 'drills' as TabType,
      label: 'Quiz Arena (試験)',
      sublabel: 'Survival exam & 3 lives challenge',
      icon: Trophy,
    },
    {
      id: 'signs' as TabType,
      label: 'Street Signs (看板)',
      sublabel: 'Real signs & combini labels',
      icon: Compass,
    },
    {
      id: 'reader' as TabType,
      label: 'Sentence Reader',
      sublabel: 'Furigana toggle reading',
      icon: BookCheck,
    },
  ];

  const progressPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-stone-200/80 bg-white/70 backdrop-blur-md p-4 min-h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-1.5 flex-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-start gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all text-left group ${
                isActive
                  ? 'bg-red-50 text-japan-crimson font-semibold shadow-sm border border-red-100'
                  : 'text-slate-600 hover:bg-stone-100/70 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-2 rounded-xl mt-0.5 transition-colors ${
                  isActive
                    ? 'bg-japan-crimson text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                }`}
              >
                <Icon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{item.label}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Overall Progress Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span className="flex items-center gap-1 text-slate-800 font-bold">
            <Sparkles size={14} className="text-amber-500" />
            Curriculum
          </span>
          <span className="font-bold text-japan-crimson">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-japan-crimson rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {completedLessonsCount} of {totalLessonsCount} lessons finished
        </p>
      </div>
    </aside>
  );
};
