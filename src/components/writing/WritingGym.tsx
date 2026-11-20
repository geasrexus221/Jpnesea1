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

  const handlePrev = () => {
    const newIdx = safeIndex > 0 ? safeIndex - 1 : dataset.length - 1;
    handleSelectChar(newIdx);
  };

  const handleNext = () => {
    const newIdx = safeIndex < dataset.length - 1 ? safeIndex + 1 : 0;
    handleSelectChar(newIdx);
  };

  // Pick a random character from the current pool
  const handleRandomChar = () => {
    if (dataset.length <= 1) return;
    let nextIdx = safeIndex;
    while (nextIdx === safeIndex) {
      nextIdx = Math.floor(Math.random() * dataset.length);
    }
    handleSelectChar(nextIdx);
    triggerHaptic('light');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header & Rules Button */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PenTool size={20} className="text-japan-crimson" />
            <span>Writing Gym (書道 Shodō)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trace characters on the 4-quadrant manuscript grid and check accuracy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRulesModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <BookOpen size={15} className="text-amber-700" />
          <span>The 6 Stroke Rules</span>
        </button>
      </div>

      {/* Script Selector Tabs */}
      <div className="flex p-1 bg-stone-100 rounded-2xl max-w-md mx-auto">
        {(['hiragana', 'katakana', 'kanji'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setScriptType(s);
              setSelectedCharIndex(0);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              scriptType === s
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Carousel Controller with Shuffle / Random Button */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between gap-2 max-w-xl mx-auto">
        <button
          type="button"
          onClick={handlePrev}
          className="p-3 rounded-2xl hover:bg-stone-100 text-slate-600 active:scale-95 transition-all"
          title="Previous character"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Center Current Character Trigger (Click to open grid picker modal) */}
        <button
          type="button"
          onClick={() => setIsPickerModalOpen(true)}
          className="flex-1 py-2 px-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-all flex items-center justify-center gap-3 group"
        >
          <span className="font-japanese font-bold text-3xl text-slate-900 group-hover:text-japan-crimson transition-colors">
            {getCharDisplay(currentChar)}
          </span>
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-japan-crimson">
              {getRomajiDisplay(currentChar)}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Grid size={11} />
              <span>Tap to pick ({safeIndex + 1}/{dataset.length})</span>
            </div>
          </div>
        </button>

        {/* Random Shuffle Button */}
        <button
          type="button"
          onClick={handleRandomChar}
          className="p-3 rounded-2xl bg-stone-50 hover:bg-red-50 text-slate-600 hover:text-japan-crimson active:scale-95 border border-stone-200/80 hover:border-red-200 transition-all flex items-center gap-1"
          title="Pick random character"
        >
          <Shuffle size={18} />
          <span className="hidden sm:inline text-xs font-bold">Random</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-3 rounded-2xl hover:bg-stone-100 text-slate-600 active:scale-95 transition-all"
          title="Next character"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Main Drawing Pad Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Side: Character Details & Mnemonic */}
        <div className="flex-1 text-center md:text-left space-y-4 max-w-sm">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-japanese text-6xl font-bold text-slate-900">
              {getCharDisplay(currentChar)}
            </span>
            <AudioButton text={getCharDisplay(currentChar)} size="lg" />
          </div>

          <div>
            <span className="text-xl font-bold uppercase tracking-widest text-japan-crimson">
              {getRomajiDisplay(currentChar)}
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Stroke count: <strong>{currentChar.strokeCount} strokes</strong>
            </p>
          </div>

          {isKana(currentChar) && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
              💡 {currentChar.mnemonic}
            </div>
          )}

          {isKana(currentChar) && currentChar.exampleWord && (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Word: </span>
                <strong className="font-japanese text-sm text-slate-900">
                  {currentChar.exampleWord.japanese}
                </strong>
                <span className="text-slate-500 ml-1">({currentChar.exampleWord.reading})</span>
              </div>
              <span className="font-semibold text-japan-crimson">
                {currentChar.exampleWord.english}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: The Touch Canvas Pad */}
        <div className="flex flex-col items-center">
          <StrokeCanvas
            character={getCharDisplay(currentChar)}
            strokeCount={currentChar.strokeCount}
          />
        </div>
      </div>

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
            <div className="p-4 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-2.5">
              {dataset.map((item, idx) => {
                const isCurrent = idx === safeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectChar(idx)}
                    className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all border active:scale-95 ${
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
