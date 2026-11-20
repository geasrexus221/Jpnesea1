import React, { useState, useEffect } from 'react';
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
  Sliders,
  RotateCcw,
  Save,
  Copy,
  Check,
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export const WritingGym: React.FC = () => {
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isCalibratorOpen, setIsCalibratorOpen] = useState<boolean>(false);

  // Calibration state (persistent in localStorage)
  const [charOffsetY, setCharOffsetY] = useState<number>(() => {
    return Number(localStorage.getItem('nihongo_calib_offset_y') || 0);
  });
  const [charOffsetX, setCharOffsetX] = useState<number>(() => {
    return Number(localStorage.getItem('nihongo_calib_offset_x') || 0);
  });
  const [charScale, setCharScale] = useState<number>(() => {
    return Number(localStorage.getItem('nihongo_calib_scale') || 76);
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const { speak } = useSpeech();

  // Save calibration changes to localStorage
  const handleSaveCalibration = () => {
    localStorage.setItem('nihongo_calib_offset_y', charOffsetY.toString());
    localStorage.setItem('nihongo_calib_offset_x', charOffsetX.toString());
    localStorage.setItem('nihongo_calib_scale', charScale.toString());
    setIsCalibratorOpen(false);
  };

  const handleResetCalibration = () => {
    setCharOffsetY(0);
    setCharOffsetX(0);
    setCharScale(76);
    localStorage.removeItem('nihongo_calib_offset_y');
    localStorage.removeItem('nihongo_calib_offset_x');
    localStorage.removeItem('nihongo_calib_scale');
  };

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PenTool size={20} className="text-japan-crimson" />
            <span>Writing Gym (書道 Shodō)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow starting point ①, draw the strokes, and check accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Calibrate / Adjust Position Button */}
          <button
            type="button"
            onClick={() => setIsCalibratorOpen(!isCalibratorOpen)}
            className={`px-3 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isCalibratorOpen
                ? 'bg-slate-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
            }`}
            title="Adjust character position & scale"
          >
            <Sliders size={15} />
            <span>Adjust Alignment</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRulesModalOpen(true)}
            className="px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <BookOpen size={15} className="text-amber-700" />
            <span className="hidden sm:inline">6 Stroke Rules</span>
          </button>
        </div>
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

      {/* Modern Carousel Controller */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between gap-2 max-w-xl mx-auto">
        <button
          type="button"
          onClick={handlePrev}
          className="p-3 rounded-2xl hover:bg-stone-100 text-slate-600 active:scale-95 transition-all"
          title="Previous character"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Center Current Character Trigger */}
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
              <span>Tap to pick character ({safeIndex + 1}/{dataset.length})</span>
            </div>
          </div>
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

      {/* Live Visual Alignment Calibrator Panel (When toggled open) */}
      {isCalibratorOpen && (
        <div className="bg-gradient-to-br from-stone-900 to-slate-900 text-white p-5 rounded-3xl shadow-xl max-w-xl mx-auto space-y-4 animate-fade-in border border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Live Alignment Calibrator</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsCalibratorOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Nudge the character up, down, or scale it to fit the guides perfectly on your screen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Y Offset */}
            <div className="bg-slate-800/80 p-3 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between font-semibold">
                <span>Vertical (Y)</span>
                <span className="text-emerald-400">{charOffsetY}px</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCharOffsetY((prev) => prev - 2)}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  onClick={() => setCharOffsetY((prev) => prev + 2)}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  ↓ Down
                </button>
              </div>
            </div>

            {/* X Offset */}
            <div className="bg-slate-800/80 p-3 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between font-semibold">
                <span>Horizontal (X)</span>
                <span className="text-emerald-400">{charOffsetX}px</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCharOffsetX((prev) => prev - 2)}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  ← Left
                </button>
                <button
                  type="button"
                  onClick={() => setCharOffsetX((prev) => prev + 2)}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  → Right
                </button>
              </div>
            </div>

            {/* Size Scale */}
            <div className="bg-slate-800/80 p-3 rounded-2xl space-y-2 border border-slate-700">
              <div className="flex justify-between font-semibold">
                <span>Scale Size</span>
                <span className="text-emerald-400">{charScale}px</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCharScale((prev) => Math.max(50, prev - 3))}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  - Smaller
                </button>
                <button
                  type="button"
                  onClick={() => setCharScale((prev) => Math.min(100, prev + 3))}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  + Bigger
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetCalibration}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Reset to Default</span>
            </button>

            <button
              type="button"
              onClick={handleSaveCalibration}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Save size={14} />
              <span>Save Alignment</span>
            </button>
          </div>
        </div>
      )}

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

        {/* Right Side: The Touch Canvas Pad with Live Calibration parameters */}
        <div className="flex flex-col items-center">
          <StrokeCanvas
            character={getCharDisplay(currentChar)}
            strokeCount={currentChar.strokeCount}
            charOffsetY={charOffsetY}
            charOffsetX={charOffsetX}
            charScale={charScale}
          />
        </div>
      </div>

      {/* Clean Character Grid Selection Modal */}
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
