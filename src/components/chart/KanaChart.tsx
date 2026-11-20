import React, { useState, useEffect } from 'react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KanaItem } from '../../types';
import { AudioButton } from '../ui/AudioButton';
import { Grid, Sparkles, CheckCircle2, XCircle, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useHaptics } from '../../hooks/useHaptics';

interface KanaChartProps {
  romajiVisible: boolean;
  onSelectCharacter?: (item: KanaItem) => void;
}

type QuizDirection = 'romaji_to_kana' | 'kana_to_romaji' | 'mixed';

export const KanaChart: React.FC<KanaChartProps> = ({ romajiVisible, onSelectCharacter }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'quiz'>('grid');
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [activeItem, setActiveItem] = useState<KanaItem | null>(null);

  // Quiz State
  const [quizDirection, setQuizDirection] = useState<QuizDirection>('romaji_to_kana');
  const [targetItem, setTargetItem] = useState<KanaItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [currentPromptIsRomaji, setCurrentPromptIsRomaji] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const { speak } = useSpeech();
  const { triggerHaptic } = useHaptics();

  const currentDataset = selectedType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  const gojuonItems = currentDataset.filter((item) => item.type === 'gojuon');
  const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];

  // Helper to fetch character in a row
  const getCharInRow = (row: string, vowelIndex: number) => {
    const vowels = ['a', 'i', 'u', 'e', 'o'];
    const targetVowel = vowels[vowelIndex];

    if (row === 'n') {
      return vowelIndex === 0 ? gojuonItems.find((i) => i.row === 'n') : null;
    }
    if (row === 'ya') {
      if (vowelIndex === 0) return gojuonItems.find((i) => i.id.endsWith('ya'));
      if (vowelIndex === 2) return gojuonItems.find((i) => i.id.endsWith('yu'));
      if (vowelIndex === 4) return gojuonItems.find((i) => i.id.endsWith('yo'));
      return null;
    }
    if (row === 'wa') {
      if (vowelIndex === 0) return gojuonItems.find((i) => i.id.endsWith('wa'));
      if (vowelIndex === 4) return gojuonItems.find((i) => i.id.endsWith('wo'));
      return null;
    }

    return gojuonItems.find((i) => i.row === row && i.romaji.endsWith(targetVowel));
  };

  const handleCellClick = (item: KanaItem) => {
    speak(item.char);
    setActiveItem(item);
    if (onSelectCharacter) {
      onSelectCharacter(item);
    }
  };

  // Generate a new Chart Quiz question
  const generateQuestion = (type = selectedType, dir = quizDirection) => {
    const pool = type === 'hiragana' ? HIRAGANA_DATA.filter((i) => i.type === 'gojuon') : KATAKANA_DATA;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];

    let isRomajiPrompt = true;
    if (dir === 'kana_to_romaji') {
      isRomajiPrompt = false;
    } else if (dir === 'mixed') {
      isRomajiPrompt = Math.random() > 0.5;
    }

    setTargetItem(randomItem);
    setCurrentPromptIsRomaji(isRomajiPrompt);
    setSelectedAnswer(null);

    // If Romaji prompt, options are 4 Kana characters (e.g. Prompt: "a" -> Options: [あ, い, う, え])
    // If Kana prompt, options are 4 Romaji strings (e.g. Prompt: "あ" -> Options: [a, i, u, e])
    const correctAnswer = isRomajiPrompt ? randomItem.char : randomItem.romaji;
    const distractors = pool
      .filter((i) => i.id !== randomItem.id)
      .map((i) => (isRomajiPrompt ? i.char : i.romaji))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setQuizOptions([correctAnswer, ...distractors].sort(() => Math.random() - 0.5));
  };

  // Initialize question when switching to quiz mode
  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuestion(selectedType, quizDirection);
    }
  }, [viewMode, selectedType, quizDirection]);

  const handleQuizAnswer = (chosen: string) => {
    if (!targetItem || selectedAnswer !== null) return;
    setSelectedAnswer(chosen);

    const correctAnswer = currentPromptIsRomaji ? targetItem.char : targetItem.romaji;
    const isCorrect = chosen === correctAnswer;

    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      triggerHaptic('success');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      speak(targetItem.char);
    } else {
      triggerHaptic('error');
      setStreak(0);
    }

    // Auto-advance to next question after 1s
    setTimeout(() => {
      generateQuestion(selectedType, quizDirection);
    }, 1100);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Master View Mode Selector: Grid vs Chart Quiz */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-japan-crimson">
            {viewMode === 'grid' ? <Grid size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {viewMode === 'grid' ? '50-Sounds Master Chart' : 'Kana Recall Quiz'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {viewMode === 'grid'
                ? '五十音図 — Tap any character for audio & mnemonics'
                : 'Test your recognition: Romaji ➔ Kana or Kana ➔ Romaji'}
            </p>
          </div>
        </div>

        {/* View Mode Tabs (Grid vs Quiz) */}
        <div className="flex p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid size={14} />
            <span>Chart Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('quiz')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'quiz'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} />
            <span>Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* 2. SCRIPT TABS (Hiragana vs Katakana) */}
      <div className="flex p-1 bg-stone-100 rounded-xl max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setSelectedType('hiragana')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedType === 'hiragana'
              ? 'bg-japan-crimson text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hiragana (ひらがな)
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('katakana')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedType === 'katakana'
              ? 'bg-japan-crimson text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Katakana (カタカナ)
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE A: 50-SOUNDS GRID VIEW                              */}
      {/* ======================================================== */}
      {viewMode === 'grid' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-3 sm:p-6 border border-stone-200 shadow-sm overflow-x-auto">
            <div className="min-w-[320px]">
              {/* Vowel Column Headers */}
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-2 text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div>Row</div>
                <div>-a</div>
                <div>-i</div>
                <div>-u</div>
                <div>-e</div>
                <div>-o</div>
              </div>

              {/* Rows */}
              <div className="space-y-1.5 sm:space-y-2">
                {rows.map((rowName) => (
                  <div key={rowName} className="grid grid-cols-6 gap-1.5 sm:gap-2 items-center">
                    {/* Row Label */}
                    <div className="text-center font-bold text-[10px] sm:text-xs uppercase text-slate-400 bg-stone-50 py-2 sm:py-3 rounded-xl border border-stone-100">
                      {rowName.toUpperCase()}
                    </div>

                    {/* 5 Vowel Columns */}
                    {[0, 1, 2, 3, 4].map((vowelIdx) => {
                      const item = getCharInRow(rowName, vowelIdx);
                      if (!item) {
                        return (
                          <div
                            key={vowelIdx}
                            className="h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50/50 border border-dashed border-stone-200/50"
                          />
                        );
                      }

                      const isSelected = activeItem?.id === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCellClick(item)}
                          className={`h-14 sm:h-16 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-150 border active:scale-95 group ${
                            isSelected
                              ? 'bg-red-50 border-japan-crimson ring-2 ring-red-400/50 shadow-sm'
                              : 'bg-stone-50/80 hover:bg-white hover:border-red-200 border-stone-200/80 hover:shadow-sm'
                          }`}
                        >
                          <span className="font-japanese text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-japan-crimson transition-colors">
                            {item.char}
                          </span>
                          {romajiVisible && (
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600">
                              {item.romaji}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Character Detail Card Drawer */}
          {activeItem && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-stone-50 rounded-3xl border-2 border-red-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-50 border border-red-200 flex flex-col items-center justify-center shadow-inner">
                  <span className="font-japanese text-3xl sm:text-4xl font-bold text-japan-crimson">
                    {activeItem.char}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                    {activeItem.romaji}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-japan-crimson">
                      Memory Hint
                    </span>
                    <span className="text-[10px] text-slate-400 bg-stone-100 px-2 py-0.5 rounded-full">
                      {activeItem.strokeCount} strokes
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1 max-w-lg">
                    💡 {activeItem.mnemonic}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                    <span className="text-slate-400">Word:</span>
                    <span className="font-japanese font-bold text-slate-900">
                      {activeItem.exampleWord.japanese}
                    </span>
                    <span className="text-slate-500">({activeItem.exampleWord.reading})</span>
                    <span>— {activeItem.exampleWord.english}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AudioButton text={activeItem.char} size="md" label="Sound" />
                <AudioButton text={activeItem.exampleWord.japanese} size="sm" label="Word" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE B: CHART QUIZ / DRILLS MODE                         */}
      {/* ======================================================== */}
      {viewMode === 'quiz' && targetItem && (
        <div className="space-y-4 animate-fade-in max-w-md mx-auto">
          {/* Quiz Direction Selector Bar */}
          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-around text-xs font-bold">
            <button
              type="button"
              onClick={() => setQuizDirection('romaji_to_kana')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                quizDirection === 'romaji_to_kana'
                  ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              "a" ➔ [あ]
            </button>

            <button
              type="button"
              onClick={() => setQuizDirection('kana_to_romaji')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                quizDirection === 'kana_to_romaji'
                  ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              [あ] ➔ "a"
            </button>

            <button
              type="button"
              onClick={() => setQuizDirection('mixed')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                quizDirection === 'mixed'
                  ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔀 Mixed
            </button>
          </div>

          {/* Score & Streak Header */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500 font-bold">
            <span>
              Score: <strong className="text-slate-900">{score}</strong> / {totalAnswered}
            </span>
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              🔥 Streak: {streak}
            </span>
          </div>

          {/* The Question Prompt Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {currentPromptIsRomaji
                ? `Pick the Japanese character for:`
                : `What is the reading of this character?`}
            </span>

            {/* Prompt Display */}
            <div className="inline-flex flex-col items-center justify-center min-w-[130px] min-h-[130px] p-4 rounded-3xl bg-stone-50 border-2 border-stone-200/80 shadow-inner">
              {currentPromptIsRomaji ? (
                <div className="text-5xl sm:text-6xl font-black uppercase text-japan-crimson tracking-widest">
                  {targetItem.romaji}
                </div>
              ) : (
                <div className="font-japanese text-6xl sm:text-7xl font-bold text-slate-900">
                  {targetItem.char}
                </div>
              )}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => speak(targetItem.char)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Hear pronunciation"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>

            {/* 4 Answer Choice Buttons */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
              {quizOptions.map((option) => {
                const isChosen = selectedAnswer === option;
                const correctAnswer = currentPromptIsRomaji ? targetItem.char : targetItem.romaji;
                const isCorrect = option === correctAnswer;
                const hasAnswered = selectedAnswer !== null;

                let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-slate-800 border-stone-200';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-300 shadow-md font-bold';
                  } else if (isChosen) {
                    btnStyle =
                      'bg-red-50 text-red-800 border-red-400 ring-2 ring-red-300 shadow-md font-bold';
                  } else {
                    btnStyle = 'bg-stone-50 text-slate-300 border-stone-100 opacity-40';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleQuizAnswer(option)}
                    className={`h-16 sm:h-20 rounded-2xl border text-2xl font-bold transition-all duration-150 active:scale-95 flex items-center justify-center relative font-japanese ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 size={16} className="absolute right-2 text-emerald-600" />
                    )}
                    {hasAnswered && isChosen && !isCorrect && (
                      <XCircle size={16} className="absolute right-2 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Manual Skip / Next button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => generateQuestion(selectedType, quizDirection)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 py-1 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <span>Skip to Next Question</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
