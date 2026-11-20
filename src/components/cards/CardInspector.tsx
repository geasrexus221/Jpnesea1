import React, { useState } from 'react';
import { YugiohCard } from '../../types/yugioh';
import { YUGIOH_CARDS } from '../../data/yugioh_cards';
import { CardSyntaxViewer } from './CardSyntaxViewer';
import { Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export const CardInspector: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>(YUGIOH_CARDS[0].id);
  const { speak } = useSpeech();

  const currentCard = YUGIOH_CARDS.find((c) => c.id === selectedCardId) || YUGIOH_CARDS[0];

  const getCardTypeBadge = (card: YugiohCard) => {
    switch (card.cardType) {
      case 'spell':
        return 'bg-emerald-500 text-white';
      case 'trap':
        return 'bg-pink-600 text-white';
      case 'monster':
        return card.subtype === 'normal' ? 'bg-amber-500 text-white' : 'bg-orange-600 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Card Selector Carousel / Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {YUGIOH_CARDS.map((card) => {
          const isSelected = card.id === selectedCardId;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCardId(card.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-stone-200/90 hover:bg-stone-50'
              }`}
            >
              <span className="font-japanese">{card.nameJapanese}</span>
              <span className="text-[10px] opacity-70">({card.nameEnglish})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Card Header Plate */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-slate-800 text-white shadow-md relative overflow-hidden">
        {/* Background Decorative Emblem */}
        <div className="absolute -right-4 -bottom-6 opacity-10 text-white pointer-events-none font-japanese text-8xl font-black">
          遊戯
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getCardTypeBadge(
                  currentCard
                )}`}
              >
                {currentCard.typeOrProperty}
              </span>
              {currentCard.attribute && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                  {currentCard.attribute}
                </span>
              )}
            </div>

            {/* Japanese Name with Furigana & Audio */}
            <div className="flex items-baseline gap-2 pt-1">
              <h2 className="font-japanese font-black text-2xl sm:text-3xl tracking-wide">
                {currentCard.nameJapanese}
              </h2>
              <button
                type="button"
                onClick={() => speak(currentCard.nameJapanese)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
                title="Pronounce card name"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div className="text-xs text-amber-300/90 font-medium">
              {currentCard.nameReading} • <span className="text-white font-semibold">{currentCard.nameEnglish}</span>
            </div>
          </div>

          {/* Monster Stats (if applicable) */}
          {currentCard.cardType === 'monster' && currentCard.atk !== undefined && (
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              <div className="text-[11px] text-slate-300">
                ★ Level {currentCard.levelOrRank}
              </div>
              <div className="font-mono font-bold text-sm sm:text-base text-amber-400">
                ATK/{currentCard.atk} DEF/{currentCard.def}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PSCT Color Legend */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80 text-[11px]">
        <span className="font-bold text-slate-600 mr-1">PSCT Key:</span>
        <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Condition (`：`)
        </span>
        <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Cost / Target (`；`)
        </span>
        <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolution (`。`)
        </span>
        <span className="flex items-center gap-1 text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Turn Limit
        </span>
      </div>

      {/* Card Syntax Clauses */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Layers size={14} />
          <span>Clause Breakdown (文法分解)</span>
        </h3>
        <CardSyntaxViewer clauses={currentCard.clauses} />
      </div>

      {/* Grammar & Kanji Highlights */}
      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-600" />
          <span>Card Text Nuances & Kanji</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentCard.grammarBreakdownHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-1"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-japanese font-bold text-sm text-slate-900">
                  {hl.term}
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  {hl.meaning}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">{hl.reading}</div>
              <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                {hl.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
