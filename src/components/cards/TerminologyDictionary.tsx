import React, { useState } from 'react';
import { YUGIOH_TERMS } from '../../data/yugioh_terms';
import { YugiohTerm } from '../../types/yugioh';
import { Search, Volume2, BookOpen, Sparkles } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

type TermCategory =
  | 'all'
  | 'type'
  | 'attribute'
  | 'property'
  | 'mechanic'
  | 'action'
  | 'psct'
  | 'combat'
  | 'zone'
  | 'particle';

export const TerminologyDictionary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory>('all');
  const { speak } = useSpeech();

  const categories = [
    { id: 'all' as TermCategory, label: 'All Terms (全て)' },
    { id: 'type' as TermCategory, label: 'Monster Types (種族)' },
    { id: 'attribute' as TermCategory, label: 'Attributes (属性)' },
    { id: 'property' as TermCategory, label: 'Spell / Trap (魔法・罠)' },
    { id: 'mechanic' as TermCategory, label: 'Subtypes & Summons (分類・召喚)' },
    { id: 'action' as TermCategory, label: 'Actions (動詞)' },
    { id: 'psct' as TermCategory, label: 'PSCT Rules (文法)' },
    { id: 'combat' as TermCategory, label: 'Combat & Stats (戦闘・値)' },
    { id: 'zone' as TermCategory, label: 'Game Zones (場所)' },
    { id: 'particle' as TermCategory, label: 'Particles (助詞)' },
  ];

  const filteredTerms = YUGIOH_TERMS.filter((term) => {
    const matchesCategory =
      selectedCategory === 'all' || term.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      term.term.toLowerCase().includes(q) ||
      term.reading.toLowerCase().includes(q) ||
      term.romaji.toLowerCase().includes(q) ||
      term.english.toLowerCase().includes(q) ||
      term.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'particle':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'action':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'psct':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'zone':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'mechanic':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'type':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'attribute':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'property':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'combat':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-stone-100 text-slate-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search card terms, particles, or English meanings..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 focus:border-japan-crimson focus:ring-2 focus:ring-red-100 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-japan-crimson text-white shadow-xs'
                : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTerms.map((term: YugiohTerm) => (
          <div
            key={term.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              {/* Header: Term, Audio, Category */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-japanese font-black text-lg sm:text-xl text-slate-900">
                    {term.term}
                  </span>
                  <button
                    type="button"
                    onClick={() => speak(term.term)}
                    className="p-1 rounded-lg text-slate-400 hover:text-japan-crimson hover:bg-red-50 transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getCategoryBadge(
                    term.category
                  )}`}
                >
                  {term.category}
                </span>
              </div>

              {/* Sub-readings */}
              <div className="text-[11px] text-slate-400 font-medium">
                {term.reading} • <span className="font-semibold text-slate-700">{term.romaji}</span>
              </div>

              {/* English Meaning & Description */}
              <div className="text-xs sm:text-sm font-bold text-japan-crimson mt-1">
                {term.english}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {term.description}
              </p>
            </div>

            {/* Real Card Example Clause */}
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] space-y-0.5">
              <div className="font-japanese font-semibold text-slate-800">
                例: {term.cardExample}
              </div>
              <div className="text-slate-500">{term.exampleMeaning}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-stone-300">
          No terms matching "{searchQuery}". Try searching for words like "Summon", "GY", or "墓地".
        </div>
      )}
    </div>
  );
};
