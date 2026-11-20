import React, { useState } from 'react';
import { CardClause, ClauseType } from '../../types/yugioh';
import { Info, Volume2, Split } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { splitClauseParts } from '../../utils/particleSplitter';

interface CardSyntaxViewerProps {
  clauses: CardClause[];
}

export const CardSyntaxViewer: React.FC<CardSyntaxViewerProps> = ({ clauses }) => {
  const { speak } = useSpeech();
  const [activePartIndex, setActivePartIndex] = useState<string | null>(null);
  const [separateParticles, setSeparateParticles] = useState<boolean>(true); // Defaults to ON for maximum clarity!

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
        return 'text-rose-600 bg-rose-50 border-rose-300 font-bold hover:bg-rose-100 shadow-2xs';
      case 'keyword':
        return 'text-blue-700 bg-blue-50 border-blue-200 font-bold hover:bg-blue-100';
      case 'timing':
        return 'text-amber-700 bg-amber-50 border-amber-200 font-semibold hover:bg-amber-100';
      case 'verb':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold hover:bg-emerald-100';
      default:
        return 'text-slate-800 bg-stone-50/80 hover:bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Top Filter Bar: Separate Particles Toggle Switch (Compact) */}
      <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-50 text-japan-crimson flex items-center justify-center shrink-0">
            <Split size={13} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>Separate Words & Particles</span>
              <span className="font-japanese text-[10px] text-slate-400 font-medium">
                (助詞分離)
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {separateParticles ? (
                <span className="text-japan-crimson font-medium">
                  Active: Words separated (e.g. 墓地 + の, モンスター + を)
                </span>
              ) : (
                <span>Combined phrases (e.g. 墓地の, モンスターを)</span>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Pill Button */}
        <button
          type="button"
          onClick={() => {
            setSeparateParticles(!separateParticles);
            setActivePartIndex(null);
          }}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            separateParticles ? 'bg-japan-crimson' : 'bg-stone-300'
          }`}
          title="Toggle separating particles from root words"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              separateParticles ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Clauses List (Compact cards) */}
      {clauses.map((clause, cIdx) => {
        const badge = getClauseBadge(clause.clauseType);
        const displayParts = splitClauseParts(clause.parts, separateParticles);

        return (
          <div
            key={clause.id || cIdx}
            className="p-2.5 sm:p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs transition-all hover:border-stone-300 space-y-1.5"
          >
            {/* Clause Header Badge & Audio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold border ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Clause {cIdx + 1}
                </span>
              </div>

              <button
                type="button"
                onClick={() => speak(clause.japanese)}
                className="p-1 rounded-md text-slate-400 hover:text-japan-crimson hover:bg-red-50 transition-colors"
                title="Listen to clause"
              >
                <Volume2 size={15} />
              </button>
            </div>

            {/* Interactive Word Chunks (Separated or Combined) */}
            <div className="flex flex-wrap items-baseline gap-1 my-1.5">
              {displayParts.map((part, pIdx) => {
                const partKey = `${cIdx}-${pIdx}`;
                const isSelected = activePartIndex === partKey;
                const isParticle = part.role === 'particle';

                return (
                  <button
                    key={partKey}
                    type="button"
                    onClick={() => setActivePartIndex(isSelected ? null : partKey)}
                    className={`group relative inline-flex flex-col items-center px-1.5 py-0.5 rounded-lg border text-left transition-all active:scale-95 ${getPartColor(
                      part.role
                    )} ${isSelected ? 'ring-2 ring-japan-crimson ring-offset-1' : ''}`}
                  >
                    {/* Furigana Ruby over text (or particle tag) */}
                    {part.furigana ? (
                      <span className="text-[9px] text-slate-400 font-japanese leading-none tracking-tight">
                        {part.furigana}
                      </span>
                    ) : isParticle && separateParticles ? (
                      <span className="text-[8px] text-rose-500 font-bold leading-none tracking-tight">
                        助詞
                      </span>
                    ) : (
                      <span className="text-[8px] leading-none opacity-0 select-none">
                        -
                      </span>
                    )}

                    <span className="font-japanese text-sm sm:text-base leading-snug">
                      {part.text}
                    </span>
                    <span className="text-[9px] text-slate-500 font-sans tracking-tight">
                      {part.romaji}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Word Detail Inspector */}
            {activePartIndex && activePartIndex.startsWith(`${cIdx}-`) && (
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 animate-fade-in flex items-start gap-1.5">
                <Info size={13} className="text-japan-crimson mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 mr-1.5">
                    {displayParts[parseInt(activePartIndex.split('-')[1], 10)]?.text}
                  </span>
                  <span className="text-slate-500 mr-1.5">
                    ({displayParts[parseInt(activePartIndex.split('-')[1], 10)]?.romaji}):
                  </span>
                  <span className="font-medium text-japan-crimson">
                    {displayParts[parseInt(activePartIndex.split('-')[1], 10)]?.english}
                  </span>
                </div>
              </div>
            )}

            {/* Translation & Grammar Explanations */}
            <div className="pt-1.5 border-t border-stone-100 space-y-0.5">
              <div className="text-xs font-semibold text-slate-800">
                {clause.english}
              </div>
              <div className="text-[10px] text-slate-500 leading-normal">
                💡 <span className="font-medium text-slate-600">Grammar:</span> {clause.grammarNote}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
