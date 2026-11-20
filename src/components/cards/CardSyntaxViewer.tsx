import React, { useState } from 'react';
import { CardClause, ClauseType } from '../../types/yugioh';
import { Info, Volume2 } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface CardSyntaxViewerProps {
  clauses: CardClause[];
}

export const CardSyntaxViewer: React.FC<CardSyntaxViewerProps> = ({ clauses }) => {
  const { speak } = useSpeech();
  const [activePartIndex, setActivePartIndex] = useState<string | null>(null);

  const getClauseBadge = (type: ClauseType) => {
    switch (type) {
      case 'condition':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500',
          label: 'Condition (条件)',
        };
      case 'cost_target':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          label: 'Cost / Targeting (コスト・対象)',
        };
      case 'resolution':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Resolution (効果処理)',
        };
      case 'restriction':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          dot: 'bg-purple-500',
          label: 'Turn Limit (ターン制限)',
        };
      case 'lore':
        return {
          bg: 'bg-stone-100 border-stone-200 text-stone-700',
          dot: 'bg-stone-500',
          label: 'Flavour Lore (通常説明)',
        };
    }
  };

  const getPartColor = (role?: string) => {
    switch (role) {
      case 'particle':
        return 'text-rose-600 bg-rose-50 border-rose-200 font-semibold';
      case 'keyword':
        return 'text-blue-700 bg-blue-50 border-blue-200 font-bold';
      case 'timing':
        return 'text-amber-700 bg-amber-50 border-amber-200 font-semibold';
      case 'verb':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold';
      default:
        return 'text-slate-800 hover:bg-stone-100 border-transparent';
    }
  };

  return (
    <div className="space-y-3.5">
      {clauses.map((clause, cIdx) => {
        const badge = getClauseBadge(clause.clauseType);

        return (
          <div
            key={clause.id || cIdx}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm transition-all hover:border-stone-300"
          >
            {/* Clause Header Badge & Audio */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Clause {cIdx + 1}
                </span>
              </div>

              <button
                type="button"
                onClick={() => speak(clause.japanese)}
                className="p-1 rounded-lg text-slate-400 hover:text-japan-crimson hover:bg-red-50 transition-colors"
                title="Listen to clause"
              >
                <Volume2 size={16} />
              </button>
            </div>

            {/* Interactive Word Chunks */}
            <div className="flex flex-wrap items-baseline gap-1.5 my-2.5">
              {clause.parts.map((part, pIdx) => {
                const partKey = `${cIdx}-${pIdx}`;
                const isSelected = activePartIndex === partKey;

                return (
                  <button
                    key={partKey}
                    type="button"
                    onClick={() => setActivePartIndex(isSelected ? null : partKey)}
                    className={`group relative inline-flex flex-col items-center px-2 py-1 rounded-xl border text-left transition-all ${getPartColor(
                      part.role
                    )} ${isSelected ? 'ring-2 ring-japan-crimson ring-offset-1' : ''}`}
                  >
                    {/* Furigana Ruby over text */}
                    {part.furigana && (
                      <span className="text-[10px] text-slate-400 font-japanese leading-none tracking-tight">
                        {part.furigana}
                      </span>
                    )}
                    <span className="font-japanese text-base sm:text-lg leading-snug">
                      {part.text}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans tracking-tight">
                      {part.romaji}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Word Detail Inspector */}
            {activePartIndex && activePartIndex.startsWith(`${cIdx}-`) && (
              <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 animate-fade-in flex items-start gap-2">
                <Info size={14} className="text-japan-crimson mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 mr-1.5">
                    {clause.parts[parseInt(activePartIndex.split('-')[1], 10)].text}
                  </span>
                  <span className="text-slate-500 mr-2">
                    ({clause.parts[parseInt(activePartIndex.split('-')[1], 10)].romaji}):
                  </span>
                  <span className="font-medium text-japan-crimson">
                    {clause.parts[parseInt(activePartIndex.split('-')[1], 10)].english}
                  </span>
                </div>
              </div>
            )}

            {/* Translation & Grammar Explanations */}
            <div className="mt-2 pt-2 border-t border-stone-100 space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-800">
                {clause.english}
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                💡 <span className="font-medium text-slate-600">Grammar:</span> {clause.grammarNote}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
