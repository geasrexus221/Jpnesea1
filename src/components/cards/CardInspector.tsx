import React, { useState } from 'react';
import { YugiohCard } from '../../types/yugioh';
import { YUGIOH_CARDS } from '../../data/yugioh_cards';
import { CardSyntaxViewer } from './CardSyntaxViewer';
import { CardSelectorModal } from './CardSelectorModal';
import {
  Volume2,
  Sparkles,
  Layers,
  Search,
  ChevronDown,
  FileText,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export const CardInspector: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>(YUGIOH_CARDS[0].id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'breakdown' | 'fulltext'>('breakdown');
  const [copiedType, setCopiedType] = useState<'jp' | 'romaji' | 'all' | null>(null);

  const { speak } = useSpeech();

  const currentCard = YUGIOH_CARDS.find((c) => c.id === selectedCardId) || YUGIOH_CARDS[0];

  const fullRomajiText =
    currentCard.fullRomaji || currentCard.clauses.map((c) => c.romaji).join(' ');

  const handleCopy = (text: string, type: 'jp' | 'romaji' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getCardTypeBadge = (card: YugiohCard) => {
    switch (card.cardType) {
      case 'spell':
        return 'bg-emerald-500 text-white';
      case 'trap':
        return 'bg-pink-600 text-white';
      case 'monster':
        if (card.subtype === 'synchro') return 'bg-slate-100 text-slate-900 border border-slate-300';
        if (card.subtype === 'xyz') return 'bg-stone-900 text-amber-300 border border-stone-700';
        if (card.subtype === 'link') return 'bg-blue-600 text-white';
        return card.subtype === 'normal' ? 'bg-amber-500 text-white' : 'bg-orange-600 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Sleek Card Selector Trigger Button (Replaces the horizontal scrollbar!) */}
      <div className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Selected Card ({currentCard.typeOrProperty.split(' ')[0]})
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1.5">
              <span className="font-japanese text-sm">{currentCard.nameJapanese}</span>
              <span className="text-slate-400 font-normal truncate hidden sm:inline">
                ({currentCard.nameEnglish})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Search size={13} className="text-amber-300" />
          <span>Change Card</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
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

            {/* Japanese Name with Audio */}
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
                {currentCard.subtype === 'link'
                  ? `LINK-${currentCard.linkRating}`
                  : currentCard.subtype === 'xyz'
                  ? `◆ Rank ${currentCard.levelOrRank}`
                  : `★ Level ${currentCard.levelOrRank}`}
              </div>
              <div className="font-mono font-bold text-sm sm:text-base text-amber-400">
                ATK/{currentCard.atk} {currentCard.def !== undefined ? `DEF/${currentCard.def}` : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Switcher: Clause Breakdown vs Full Text & Romaji */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/70 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveView('breakdown')}
          className={`py-2 px-3 rounded-xl text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
            activeView === 'breakdown'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <Layers size={15} className={activeView === 'breakdown' ? 'text-japan-crimson' : 'text-slate-400'} />
          <span className="text-xs">Clause Breakdown</span>
          <span className="text-[10px] text-slate-400 font-japanese hidden sm:inline">(文法分解)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('fulltext')}
          className={`py-2 px-3 rounded-xl text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
            activeView === 'fulltext'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <FileText size={15} className={activeView === 'fulltext' ? 'text-japan-crimson' : 'text-slate-400'} />
          <span className="text-xs">Full Text & Romaji</span>
          <span className="text-[10px] text-slate-400 font-japanese hidden sm:inline">(全文・ローマ字)</span>
        </button>
      </div>

      {/* VIEW 1: CLAUSE BREAKDOWN */}
      {activeView === 'breakdown' && (
        <div className="space-y-4 animate-fade-in">
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

          {/* Syntax Viewer with Particle Separator */}
          <CardSyntaxViewer clauses={currentCard.clauses} />
        </div>
      )}

      {/* VIEW 2: FULL TEXT & ROMAJI COMBINED */}
      {activeView === 'fulltext' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4 animate-fade-in">
          {/* Header with Listen & Copy */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-japan-crimson" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Combined Full Text & Romaji (全文・ローマ字)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speak(currentCard.fullJapanese)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-japan-crimson text-slate-700 transition-colors text-xs flex items-center gap-1.5 font-medium"
                title="Listen to entire card effect"
              >
                <Volume2 size={15} />
                <span>Listen Full</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(`${currentCard.fullJapanese}\n\n${fullRomajiText}`, 'all')}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors text-xs flex items-center gap-1.5 font-medium"
                title="Copy combined Japanese & Romaji"
              >
                {copiedType === 'all' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedType === 'all' ? 'Copied' : 'Copy Both'}</span>
              </button>
            </div>
          </div>

          {/* Combined Sentence Pairs (Japanese text on top, Romaji directly underneath!) */}
          <div className="space-y-3">
            {currentCard.clauses.map((clause, cIdx) => (
              <div
                key={clause.id || cIdx}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2 transition-all hover:bg-stone-50 hover:border-stone-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Clause / Sentence {cIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => speak(clause.japanese)}
                    className="text-slate-400 hover:text-japan-crimson transition-colors p-1 rounded-lg"
                    title="Listen to this line"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>

                {/* Japanese Sentence */}
                <div className="font-japanese font-bold text-base sm:text-lg text-slate-900 leading-relaxed">
                  {clause.japanese}
                </div>

                {/* Combined Romaji Line (Directly Below!) */}
                <div className="font-mono text-xs sm:text-sm text-indigo-700 font-medium leading-relaxed bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100/70">
                  {clause.romaji}
                </div>

                {/* English Meaning Line */}
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium pt-0.5">
                  {clause.english}
                </div>
              </div>
            ))}
          </div>

          {/* Complete Official TCG English Game Text */}
          <div className="pt-3 border-t border-stone-100 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Official TCG English Translation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/60 font-medium">
              {currentCard.englishEffect}
            </p>
          </div>
        </div>
      )}

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

      {/* Card Selector Pop-Up Modal */}
      <CardSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCardId={selectedCardId}
        onSelectCard={(id) => setSelectedCardId(id)}
      />
    </div>
  );
};
