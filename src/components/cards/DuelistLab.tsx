import React, { useState } from 'react';
import { CardInspector } from './CardInspector';
import { TextSandbox } from './TextSandbox';
import { TerminologyDictionary } from './TerminologyDictionary';
import { Swords, Terminal, BookMarked } from 'lucide-react';

type DuelistSubTab = 'inspector' | 'sandbox' | 'dictionary';

export const DuelistLab: React.FC = () => {
  const [subTab, setSubTab] = useState<DuelistSubTab>('inspector');

  const subTabs = [
    {
      id: 'inspector' as DuelistSubTab,
      label: 'Card Decrypter',
      sublabel: 'カード解読',
      icon: Swords,
    },
    {
      id: 'sandbox' as DuelistSubTab,
      label: 'Text Sandbox',
      sublabel: 'テキスト解析',
      icon: Terminal,
    },
    {
      id: 'dictionary' as DuelistSubTab,
      label: 'Terms & PSCT',
      sublabel: '用語・文法',
      icon: BookMarked,
    },
  ];

  return (
    <div className="space-y-2.5 pb-10 animate-fade-in max-w-3xl mx-auto">
      {/* Sub-Tab Navigation Switcher (Compact at the very top, banner removed!) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`py-1.5 px-1.5 rounded-lg text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-japan-crimson' : 'text-slate-400'} />
              <span className="text-xs leading-none">{tab.label}</span>
              <span className="text-[10px] text-slate-400 font-japanese hidden md:inline">
                ({tab.sublabel})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View */}
      <div>
        {subTab === 'inspector' && <CardInspector />}
        {subTab === 'sandbox' && <TextSandbox />}
        {subTab === 'dictionary' && <TerminologyDictionary />}
      </div>
    </div>
  );
};
