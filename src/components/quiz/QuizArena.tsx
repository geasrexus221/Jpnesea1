import React, { useState } from 'react';
import { SurvivalQuiz } from './SurvivalQuiz';
import { ConfusingPairs } from '../drills/ConfusingPairs';
import { Trophy, Swords, Zap } from 'lucide-react';

export const QuizArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survival' | 'confusing'>('survival');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Quiz Section Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-xl bg-red-50 text-japan-crimson">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900">Quiz & Practice Arena</h2>
            <p className="text-xs text-slate-500">Test your recall with real survival stakes</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('survival')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'survival'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={14} />
            <span>Survival Exam (Pass/Fail)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('confusing')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'confusing'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Swords size={14} />
            <span>Confusing Pairs</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'survival' ? <SurvivalQuiz /> : <ConfusingPairs />}
    </div>
  );
};
