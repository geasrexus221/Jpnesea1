import React, { useState } from 'react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KANJI_N5_DATA } from '../../data/kanji_n5';
import { KanaItem, KanjiItem } from '../../types';
import { StrokeCanvas } from '../canvas/StrokeCanvas';
import { AudioButton } from '../ui/AudioButton';
import { StrokeRulesModal } from './StrokeRulesModal';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  PenTool,
  Shuffle,
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useHaptics } from '../../hooks/useHaptics';

export const WritingGym: React.FC = () => {
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isShuffleOn, setIsShuffleOn] = useState<boolean>(false);

  const { speak } = useSpeech();
  const { triggerHaptic } = useHaptics();

  // Current dataset
  const dataset: (KanaItem | KanjiItem)[] =
    scriptType === 'hiragana'
      ? HIRAGANA_DATA.filter((i) => i.type === 'gojuon')
      : scriptType === 'katakana'
      ? KATAKANA_DATA
      : KANJI_N5_DATA;

  const safeIndex = Math.min(selectedCharIndex, dataset.length - 1);
  const currentChar = dataset[safeIndex] || dataset[0];

  const isKana = (item: KanaItem | KanjiItem): item is KanaItem => {
    return 'romaji' in item;
  };

  const getCharDisplay = (item: KanaItem | KanjiItem) => {
    return isKana(item) ? item.char : item.kanji;
  };

  const getRomajiDisplay = (item: KanaItem | KanjiItem) => {
    return isKana(item) ? item.romaji : item.meanings.join(', ');
  };

  const handleSelectChar = (index: number) => {
    setSelectedCharIndex(index);
    setIsPickerModalOpen(false);
    const item = dataset[index];
    if (item) speak(getCharDisplay(item));
  };

  const getRandomIndex = () => {
    if (dataset.length <= 1) return 0;
    let nextIdx = safeIndex;
    while (nextIdx === safeIndex) {
      nextIdx = Math.floor(Math.random() * dataset.length);
    }
    return nextIdx;
  };

  // If shuffle mode is ON, next/prev selects a random character
  const handlePrev = () => {
    if (isShuffleOn) {
      handleSelectChar(getRandomIndex());
    } else {
      const newIdx = safeIndex > 0 ? safeIndex - 1 : dataset.length - 1;
      handleSelectChar(newIdx);
    }
    triggerHaptic('light');
  };

  const handleNext = () => {
    if (isShuffleOn) {
      handleSelectChar(getRandomIndex());
    } else {
      const newIdx = safeIndex < dataset.length - 1 ? safeIndex + 1 : 0;
      handleSelectChar(newIdx);
    }
    triggerHaptic('light');
  };

  const toggleShuffle = () => {
    const nextState = !isShuffleOn;
    setIsShuffleOn(nextState);
    triggerHaptic(nextState ? 'success' : 'light');
    if (nextState) {
      handleSelectChar(getRandomIndex());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-5 pb-16">
      {/* 1. Compact Header Bar (Saves vertical space on phone) */}
      <div className="bg-white px-4 py-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-japan-crimson">
            <PenTool size={18} />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight">
              Writing Gym (書道)
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
              Trace characters on the 4-quadrant grid
            </p>
          </div>
        </div>

        {/* Action Toggles: Shuffle & Stroke Rules */}
        <div className="flex items-center gap-1.5">
          {/* Shuffle Toggle Button */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active:scale-95 ${
              isShuffleOn
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100 text-slate-600 border-stone-200'
            }`}
            title="When ON, next/prev selects a random character"
          >
            <Shuffle size={14} className={isShuffleOn ? 'animate-spin' : ''} />
            <span>Shuffle: {isShuffleOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* Stroke Rules Modal Button */}
          <button
            type="button"
            onClick={() => setIsRulesModalOpen(true)}
            className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200 text-xs font-semibold flex items-center gap-1"
            title="The 6 Stroke Rules"
          >
            <BookOpen size={14} className="text-amber-700" />
            <span className="hidden sm:inline">6 Rules</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Script Selector Tabs */}
      <div className="flex p-1 bg-stone-100 rounded-xl max-w-sm mx-auto">
        {(['hiragana', 'katakana', 'kanji'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setScriptType(s);
              setSelectedCharIndex(0);
            }}
            className={`flex-1 py-1 sm:py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              scriptType === s
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 3. Compact Carousel Bar (Directly over the pad for zero scrolling) */}
      <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-stone-100 text-slate-700 active:scale-90 transition-all"
          title={isShuffleOn ? 'Random Character' : 'Previous Character'}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Center Character Selector Trigger */}
        <button
          type="button"
          onClick={() => setIsPickerModalOpen(true)}
          className="flex-1 py-1.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-all flex items-center justify-center gap-2.5 group"
        >
          <span className="font-japanese font-bold text-2xl text-slate-900 group-hover:text-japan-crimson">
            {getCharDisplay(currentChar)}
          </span>
          <div className="text-left">
            <div className="text-xs font-bold uppercase text-japan-crimson leading-tight">
              {getRomajiDisplay(currentChar)}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Grid size={10} />
              <span>
                Pick ({safeIndex + 1}/{dataset.length})
              </span>
            </div>
          </div>
          <AudioButton text={getCharDisplay(currentChar)} size="sm" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-stone-100 text-slate-700 active:scale-90 transition-all"
          title={isShuffleOn ? 'Random Character' : 'Next Character'}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* 4. Canvas Drawing Pad Section (Compact, perfectly visible on mobile without scrolling!) */}
      <div className="flex flex-col items-center justify-center">
        <StrokeCanvas
          character={getCharDisplay(currentChar)}
          strokeCount={currentChar.strokeCount}
        />
      </div>

      {/* 5. Compact 1-Line Mnemonic & Word Card (Subtle hint without pushing pad off-screen) */}
      {isKana(currentChar) && (
        <div className="max-w-sm mx-auto p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2 shadow-sm">
          <span className="truncate font-medium">💡 {currentChar.mnemonic}</span>
          {currentChar.exampleWord && (
            <span className="shrink-0 font-japanese text-slate-700 text-[11px] bg-white px-2 py-0.5 rounded-lg border border-amber-200/60">
              {currentChar.exampleWord.japanese} ({currentChar.exampleWord.english})
            </span>
          )}
        </div>
      )}

      {/* Character Grid Selection Modal */}
      {isPickerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Grid size={16} className="text-japan-crimson" />
                <span>Select a Character ({scriptType.toUpperCase()})</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPickerModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid of Characters */}
            <div className="p-4 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-2">
              {dataset.map((item, idx) => {
                const isCurrent = idx === safeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectChar(idx)}
                    className={`h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all border active:scale-95 ${
                      isCurrent
                        ? 'bg-red-50 border-japan-crimson ring-2 ring-red-400/50 shadow-sm text-japan-crimson'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-slate-800'
                    }`}
                  >
                    <span className="font-japanese font-bold text-2xl leading-none">
                      {getCharDisplay(item)}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">
                      {isKana(item) ? item.romaji : item.meanings[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6 Stroke Rules Modal */}
      <StrokeRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};
