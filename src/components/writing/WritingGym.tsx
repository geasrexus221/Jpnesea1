import React, { useState } from 'react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KANJI_N5_DATA } from '../../data/kanji_n5';
import { KanaItem, KanjiItem } from '../../types';
import { StrokeCanvas } from '../canvas/StrokeCanvas';
import { AudioButton } from '../ui/AudioButton';
import { StrokeRulesModal } from './StrokeRulesModal';
import { BookOpen, Sparkles, HelpCircle, Eye, EyeOff, RotateCcw, Check, PenTool } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useHaptics } from '../../hooks/useHaptics';

export const WritingGym: React.FC = () => {
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [practiceMode, setPracticeMode] = useState<'trace' | 'blind'>('trace');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
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

  const currentChar = dataset[selectedCharIndex] || dataset[0];

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
    setIsRevealed(false);
    const item = dataset[index];
    if (item) speak(getCharDisplay(item));
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
            Build muscle memory with tactile finger tracing and blind recall drawing tests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRulesModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <BookOpen size={15} className="text-amber-700" />
          <span>The 6 Stroke Order Rules</span>
        </button>
      </div>

      {/* Script & Mode Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
        {/* Script Tabs */}
        <div className="flex p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
          {(['hiragana', 'katakana', 'kanji'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setScriptType(s);
                setSelectedCharIndex(0);
                setIsRevealed(false);
              }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                scriptType === s
                  ? 'bg-japan-crimson text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Practice Mode Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setPracticeMode('trace');
              setIsRevealed(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              practiceMode === 'trace'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Trace Mode (Guide)
          </button>
          <button
            type="button"
            onClick={() => {
              setPracticeMode('blind');
              setIsRevealed(false);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              practiceMode === 'blind'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Blind Recall (Test)
          </button>
        </div>
      </div>

      {/* Main Canvas & Character Display Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Side: Character Details & Prompt */}
        <div className="flex-1 text-center md:text-left space-y-4 max-w-sm">
          {practiceMode === 'trace' ? (
            <>
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
            </>
          ) : (
            /* Blind Mode Prompt */
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-japan-crimson text-xs font-bold">
                <Sparkles size={14} />
                <span>Blind Recall Challenge</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Write the character for:
              </h3>

              <div className="text-3xl font-extrabold uppercase tracking-widest text-japan-crimson flex items-center justify-center md:justify-start gap-3">
                <span>{getRomajiDisplay(currentChar)}</span>
                <AudioButton text={getCharDisplay(currentChar)} size="md" />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Draw it from memory on the pad without looking. When finished, tap <strong>"Reveal & Compare"</strong> to check!
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRevealed(!isRevealed);
                    triggerHaptic('light');
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 mx-auto md:mx-0 ${
                    isRevealed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                  }`}
                >
                  {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{isRevealed ? 'Hide Answer' : 'Reveal & Compare'}</span>
                </button>
              </div>

              {isRevealed && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 animate-fade-in flex items-center gap-3">
                  <span className="font-japanese text-4xl font-bold text-emerald-700">
                    {getCharDisplay(currentChar)}
                  </span>
                  <div>
                    <strong className="block font-semibold">Standard Shape</strong>
                    <span className="text-slate-600">{currentChar.strokeCount} total strokes</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: The Touch Canvas Pad */}
        <div className="flex flex-col items-center">
          <StrokeCanvas
            character={
              practiceMode === 'trace' || isRevealed ? getCharDisplay(currentChar) : ''
            }
          />
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Traditional Genkō yōshi 4-quadrant grid
          </span>
        </div>
      </div>

      {/* Horizontal Character Quick Picker */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
          Pick a Character to Practice ({dataset.length} items)
        </span>

        <div className="flex gap-2 overflow-x-auto py-1">
          {dataset.map((item, idx) => {
            const isSelected = idx === selectedCharIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectChar(idx)}
                className={`min-w-[52px] h-14 rounded-2xl flex flex-col items-center justify-center transition-all border active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-red-50 border-japan-crimson ring-2 ring-red-300 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-700'
                }`}
              >
                <span className="font-japanese font-bold text-xl leading-none">
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

      {/* Stroke Rules Modal */}
      <StrokeRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};
