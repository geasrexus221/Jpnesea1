import React, { useState } from 'react';
import { YugiohCard, CardType } from '../../types/yugioh';
import { YUGIOH_CARDS } from '../../data/yugioh_cards';
import { Search, X, Check, Sparkles, Filter } from 'lucide-react';

interface CardSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCardId: string;
  onSelectCard: (cardId: string) => void;
}

type FilterCategory = 'all' | 'monster' | 'spell' | 'trap';

export const CardSelectorModal: React.FC<CardSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCardId,
  onSelectCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FilterCategory>('all');

  if (!isOpen) return null;

  const countByType = {
    all: YUGIOH_CARDS.length,
    monster: YUGIOH_CARDS.filter((c) => c.cardType === 'monster').length,
    spell: YUGIOH_CARDS.filter((c) => c.cardType === 'spell').length,
    trap: YUGIOH_CARDS.filter((c) => c.cardType === 'trap').length,
  };

  const filteredCards = YUGIOH_CARDS.filter((card) => {
    // 1. Type match
    const matchesType = selectedType === 'all' || card.cardType === selectedType;

    // 2. Search query match (Japanese name, reading, English, or type)
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      card.nameJapanese.toLowerCase().includes(q) ||
      card.nameReading.toLowerCase().includes(q) ||
      card.nameEnglish.toLowerCase().includes(q) ||
      card.typeOrProperty.toLowerCase().includes(q);

    return matchesType && matchesQuery;
  });

  const getCardBorder = (card: YugiohCard) => {
    switch (card.cardType) {
      case 'spell':
        return 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/20';
      case 'trap':
        return 'border-pink-300 hover:border-pink-500 bg-pink-50/20';
      case 'monster':
        if (card.subtype === 'synchro') return 'border-slate-300 hover:border-slate-500 bg-slate-50/50';
        if (card.subtype === 'xyz') return 'border-stone-800 hover:border-amber-500 bg-stone-900/5';
        if (card.subtype === 'link') return 'border-blue-400 hover:border-blue-600 bg-blue-50/20';
        return card.subtype === 'normal'
          ? 'border-amber-300 hover:border-amber-500 bg-amber-50/20'
          : 'border-orange-300 hover:border-orange-500 bg-orange-50/20';
    }
  };

  const getCardBadge = (card: YugiohCard) => {
    switch (card.cardType) {
      case 'spell':
        return 'bg-emerald-600 text-white';
      case 'trap':
        return 'bg-pink-600 text-white';
      case 'monster':
        if (card.subtype === 'synchro') return 'bg-slate-700 text-white';
        if (card.subtype === 'xyz') return 'bg-stone-900 text-amber-300';
        if (card.subtype === 'link') return 'bg-blue-600 text-white';
        return card.subtype === 'normal' ? 'bg-amber-600 text-white' : 'bg-orange-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-japan-crimson text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🎴
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Card Library (カード一覧)
              </h2>
              <p className="text-[11px] text-slate-500">
                Select any card to decrypt its Japanese text and PSCT
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Bar: Monster, Spell, Trap Pills */}
        <div className="p-3 sm:px-5 border-b border-stone-100 space-y-3 bg-stone-50/60">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              All ({countByType.all})
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('monster')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                selectedType === 'monster'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>👹 Monster</span>
              <span className="text-[10px] opacity-80">({countByType.monster})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('spell')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                selectedType === 'spell'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🪄 Spell</span>
              <span className="text-[10px] opacity-80">({countByType.spell})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('trap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                selectedType === 'trap'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>⚡ Trap</span>
              <span className="text-[10px] opacity-80">({countByType.trap})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Japanese, Romaji, or English name..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-200 focus:border-japan-crimson focus:ring-2 focus:ring-red-100 text-xs text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Card Tiles Grid (Scrollable inside modal, 2 columns on mobile) */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-2">
          {filteredCards.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-stone-200">
              No cards found matching "{searchQuery}" in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCards.map((card) => {
                const isSelected = card.id === selectedCardId;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      onSelectCard(card.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-98 flex items-start justify-between gap-2 relative ${getCardBorder(
                      card
                    )} ${
                      isSelected
                        ? 'ring-2 ring-japan-crimson ring-offset-1 shadow-xs bg-red-50/40'
                        : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${getCardBadge(
                            card
                          )}`}
                        >
                          {card.typeOrProperty.split(' ')[0]}
                        </span>
                        {card.attribute && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-slate-700">
                            {card.attribute}
                          </span>
                        )}
                      </div>

                      <div className="font-japanese font-black text-sm sm:text-base text-slate-900 leading-snug truncate">
                        {card.nameJapanese}
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium truncate">
                        {card.nameReading}
                      </div>

                      <div className="text-xs font-semibold text-slate-700 truncate">
                        {card.nameEnglish}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-japan-crimson text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-[11px] text-slate-500">
          <span>{filteredCards.length} cards available</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
