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
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export const CardInspector: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>(YUGIOH_CARDS[0].id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'breakdown' | 'fulltext'>('breakdown');
  const [copiedType, setCopiedType] = useState<'jp' | 'romaji' | null>(null);

  const { speak } = useSpeech();

  const currentCard = YUGIOH_CARDS.find((c) => c.id === selectedCardId) || YUGIOH_CARDS[0];

  const fullRomajiText =
    currentCard.fullRomaji || currentCard.clauses.map((c) => c.romaji).join(' ');

  const handleCopy = (text: string, type: 'jp' | 'romaji') => {
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
    <div className="space-y-2.5">
      {/* Compact Card Selector Trigger Bar */}
      <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Layers size={14} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1.5">
              <span className="font-japanese text-sm">{currentCard.nameJapanese}</span>
              <span className="text-slate-500 font-normal truncate hidden sm:inline">
                ({currentCard.nameEnglish})
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {currentCard.typeOrProperty}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Search size={12} className="text-amber-300" />
          <span>Change Card</span>
          <ChevronDown size={12} className="text-slate-400" />
        </button>
      </div>

      {/* Selected Card Header Plate (Compact height) */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-stone-900 to-slate-800 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${getCardTypeBadge(
                  currentCard
                )}`}
              >
                {currentCard.typeOrProperty.split(' ')[0]}
              </span>
              {currentCard.attribute && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/20 text-white">
                  {currentCard.attribute}
                </span>
              )}
            </div>

            {/* Japanese Name & Audio */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <h2 className="font-japanese font-black text-xl sm:text-2xl tracking-wide">
                {currentCard.nameJapanese}
              </h2>
              <button
                type="button"
                onClick={() => speak(currentCard.nameJapanese)}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
                title="Pronounce card name"
              >
                <Volume2 size={15} />
              </button>
            </div>

            <div className="text-[11px] text-amber-300/90 font-medium">
              {currentCard.nameReading} • <span className="text-white font-semibold">{currentCard.nameEnglish}</span>
            </div>
          </div>

          {/* Monster Stats (if applicable) */}
          {currentCard.cardType === 'monster' && currentCard.atk !== undefined && (
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-1.5 sm:pt-0 border-white/10">
              <div className="text-[10px] text-slate-300">
                {currentCard.subtype === 'link'
                  ? `LINK-${currentCard.linkRating}`
                  : currentCard.subtype === 'xyz'
                  ? `◆ Rank ${currentCard.levelOrRank}`
                  : `★ Level ${currentCard.levelOrRank}`}
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-amber-400">
                ATK/{currentCard.atk} {currentCard.def !== undefined ? `DEF/${currentCard.def}` : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Switcher: Clause Breakdown vs Full Text */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-200/60 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveView('breakdown')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
            activeView === 'breakdown'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <Layers size={14} className={activeView === 'breakdown' ? 'text-japan-crimson' : 'text-slate-400'} />
          <span className="text-xs">Clause Breakdown</span>
          <span className="text-[10px] text-slate-400 font-japanese hidden sm:inline">(文法分解)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('fulltext')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
            activeView === 'fulltext'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <FileText size={14} className={activeView === 'fulltext' ? 'text-japan-crimson' : 'text-slate-400'} />
          <span className="text-xs">Full Text & Romaji</span>
          <span className="text-[10px] text-slate-400 font-japanese hidden sm:inline">(全文・ローマ字)</span>
        </button>
      </div>

      {/* VIEW 1: CLAUSE BREAKDOWN */}
      {activeView === 'breakdown' && (
        <div className="space-y-2.5 animate-fade-in">
          {/* PSCT Color Legend (Compact) */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white border border-stone-200/80 text-[10px]">
            <span className="font-bold text-slate-500 mr-0.5">PSCT:</span>
            <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Condition (`：`)
            </span>
            <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Cost / Target (`；`)
            </span>
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Resolution (`。`)
            </span>
            <span className="flex items-center gap-1 text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Turn Limit
            </span>
          </div>

          {/* Syntax Viewer with Particle Separator */}
          <CardSyntaxViewer clauses={currentCard.clauses} />
        </div>
      )}

      {/* VIEW 2: FULL TEXT & ROMAJI */}
      {activeView === 'fulltext' && (
        <div className="space-y-2.5 animate-fade-in">
          {/* 1. Japanese Full Text Block */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-japan-crimson" />
                Japanese Full Text (公式全文)
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => speak(currentCard.fullJapanese)}
                  className="px-2 py-1 rounded-md text-slate-500 hover:text-japan-crimson hover:bg-red-50 transition-colors text-[10px] font-medium flex items-center gap-1"
                  title="Listen to full text"
                >
                  <Volume2 size={13} />
                  <span>Listen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(currentCard.fullJapanese, 'jp')}
                  className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-stone-100 transition-colors text-[10px] font-medium flex items-center gap-1"
                  title="Copy Japanese text"
                >
                  {copiedType === 'jp' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedType === 'jp' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="font-japanese text-sm sm:text-base leading-relaxed text-slate-900 bg-stone-50/70 p-2.5 rounded-lg border border-stone-200/70">
              {currentCard.fullJapanese}
            </p>
          </div>

          {/* 2. Full Continuous Romaji Block */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Full Romaji Reading (ローマ字読み)
              </span>

              <button
                type="button"
                onClick={() => handleCopy(fullRomajiText, 'romaji')}
                className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-stone-100 transition-colors text-[10px] font-medium flex items-center gap-1"
                title="Copy Romaji"
              >
                {copiedType === 'romaji' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copiedType === 'romaji' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="font-mono text-xs sm:text-xs leading-relaxed text-slate-700 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/70">
              {fullRomajiText}
            </p>
          </div>

          {/* 3. Official English Translation Block */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              English Game Effect (英語翻訳)
            </span>
            <p className="text-xs sm:text-xs leading-relaxed text-slate-800 bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-100/70 font-medium">
              {currentCard.englishEffect}
            </p>
          </div>
        </div>
      )}

      {/* Grammar & Kanji Highlights (Compact) */}
      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-600" />
          <span>Card Text Nuances & Kanji</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentCard.grammarBreakdownHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-white border border-amber-200/60 shadow-2xs space-y-0.5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-japanese font-bold text-xs sm:text-sm text-slate-900">
                  {hl.term}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">
                  {hl.meaning}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">{hl.reading}</div>
              <p className="text-[11px] text-slate-600 leading-snug pt-0.5">
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
