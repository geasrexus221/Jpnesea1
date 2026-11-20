import React, { useState } from 'react';
import { CardInspector } from './CardInspector';
import { CardReadingQuiz } from './CardReadingQuiz';
import { TextSandbox } from './TextSandbox';
import { TerminologyDictionary } from './TerminologyDictionary';
import { Swords, Gamepad2, Terminal, BookMarked } from 'lucide-react';

type DuelistSubTab = 'inspector' | 'quiz' | 'dictionary' | 'sandbox';

export const DuelistLab: React.FC = () => {
  const [subTab, setSubTab] = useState<DuelistSubTab>('inspector');

  const subTabs = [
    {
      id: 'inspector' as DuelistSubTab,
      label: 'Decrypter',
      sublabel: '解読',
      icon: Swords,
    },
    {
      id: 'quiz' as DuelistSubTab,
      label: 'Reading Quiz',
      sublabel: '通読クイズ',
      icon: Gamepad2,
    },
    {
      id: 'dictionary' as DuelistSubTab,
      label: 'Terms & PSCT',
      sublabel: '用語・文法',
      icon: BookMarked,
    },
    {
      id: 'sandbox' as DuelistSubTab,
      label: 'Sandbox',
      sublabel: '解析',
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-2.5 pb-10 animate-fade-in max-w-3xl mx-auto">
      {/* Sub-Tab Navigation Switcher (Compact 4-column bar) */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-stone-200/70 rounded-xl">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`py-1.5 px-1 rounded-lg text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-japan-crimson' : 'text-slate-400'} />
              <span className="text-[11px] sm:text-xs leading-none truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View */}
      <div>
        {subTab === 'inspector' && <CardInspector />}
        {subTab === 'quiz' && <CardReadingQuiz />}
        {subTab === 'dictionary' && <TerminologyDictionary />}
        {subTab === 'sandbox' && <TextSandbox />}
      </div>
    </div>
  );
};
