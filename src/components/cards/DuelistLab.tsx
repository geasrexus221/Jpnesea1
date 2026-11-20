import React, { useState } from 'react';
import { CardInspector } from './CardInspector';
import { TextSandbox } from './TextSandbox';
import { TerminologyDictionary } from './TerminologyDictionary';
import { Swords, Terminal, BookMarked, Sparkles } from 'lucide-react';

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
    <div className="space-y-4 pb-12 animate-fade-in max-w-3xl mx-auto">
      {/* Duelist Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Sparkles size={14} className="fill-amber-300 text-amber-300" />
            <span>Yu-Gi-Oh! OCG Japanese Grammar Lab</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
            遊戯王 カード研究所
          </h1>
          <p className="text-xs text-red-100 max-w-md mt-0.5">
            Master Japanese syntax, particles, and Problem-Solving Card Text (PSCT) through official card effects.
          </p>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-stone-200/70 rounded-2xl">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`py-2 px-2 rounded-xl text-center transition-all duration-150 active:scale-95 flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={15} className={isActive ? 'text-japan-crimson' : 'text-slate-400'} />
                <span className="text-xs leading-none">{tab.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-japanese mt-0.5 hidden sm:inline-block">
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View */}
      <div className="pt-1">
        {subTab === 'inspector' && <CardInspector />}
        {subTab === 'sandbox' && <TextSandbox />}
        {subTab === 'dictionary' && <TerminologyDictionary />}
      </div>
    </div>
  );
};
