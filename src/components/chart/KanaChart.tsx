import React, { useState, useEffect, useRef } from 'react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KanaItem } from '../../types';
import { AudioButton } from '../ui/AudioButton';
import {
  Grid,
  Sparkles,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useHaptics } from '../../hooks/useHaptics';

interface KanaChartProps {
  romajiVisible: boolean;
  onSelectCharacter?: (item: KanaItem) => void;
}

type QuizDirection = 'romaji_to_kana' | 'kana_to_romaji' | 'mixed';

interface RowOption {
  id: string;
  name: string;
  hiraganaSample: string;
  katakanaSample: string;
}

const ROW_CONFIG: RowOption[] = [
  { id: 'a', name: 'A-Row (Vowels)', hiraganaSample: 'あ い う え お', katakanaSample: 'ア イ ウ エ オ' },
  { id: 'ka', name: 'Ka-Row', hiraganaSample: 'か き く け こ', katakanaSample: 'カ キ ク ケ コ' },
  { id: 'sa', name: 'Sa-Row', hiraganaSample: 'さ し す せ そ', katakanaSample: 'サ シ ス セ ソ' },
  { id: 'ta', name: 'Ta-Row', hiraganaSample: 'た ち つ て と', katakanaSample: 'タ チ ツ テ ト' },
  { id: 'na', name: 'Na-Row', hiraganaSample: 'な に ぬ ね の', katakanaSample: 'ナ ニ ヌ ネ ノ' },
  { id: 'ha', name: 'Ha-Row', hiraganaSample: 'は ひ ふ へ ほ', katakanaSample: 'ハ ヒ フ ヘ ホ' },
  { id: 'ma', name: 'Ma-Row', hiraganaSample: 'ま み む め も', katakanaSample: 'マ ミ ム メ モ' },
  { id: 'ya', name: 'Ya-Row', hiraganaSample: 'や ゆ よ', katakanaSample: 'ヤ ユ ヨ' },
  { id: 'ra', name: 'Ra-Row', hiraganaSample: 'ら り る れ ろ', katakanaSample: 'ラ リ ル レ ロ' },
  { id: 'wa', name: 'Wa/N-Row', hiraganaSample: 'わ を ん', katakanaSample: 'ワ ヲ ン' },
];

export const KanaChart: React.FC<KanaChartProps> = ({ romajiVisible, onSelectCharacter }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'quiz'>('grid');
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [activeItem, setActiveItem] = useState<KanaItem | null>(null);

  // Multi-select row filter state (defaults to all rows)
  const [selectedRows, setSelectedRows] = useState<string[]>(ROW_CONFIG.map((r) => r.id));
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Quiz State
  const [quizDirection, setQuizDirection] = useState<QuizDirection>('romaji_to_kana');
  const [targetItem, setTargetItem] = useState<KanaItem | null>(null);
  const [quizOptionItems, setQuizOptionItems] = useState<KanaItem[]>([]);
  const [currentPromptIsRomaji, setCurrentPromptIsRomaji] = useState<boolean>(true);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Generate question using only the selected rows pool
  const generateQuestion = (
    type = selectedType,
    dir = quizDirection,
    activeRows = selectedRows
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const allGojuon = type === 'hiragana' ? HIRAGANA_DATA.filter((i) => i.type === 'gojuon') : KATAKANA_DATA;
    // Filter pool strictly to characters belonging to selected rows
    let pool = allGojuon.filter((i) => activeRows.includes(i.row));
    if (pool.length === 0) {
      pool = allGojuon;
    }

    const randomItem = pool[Math.floor(Math.random() * pool.length)];

    let isRomajiPrompt = true;
    if (dir === 'kana_to_romaji') {
      isRomajiPrompt = false;
    } else if (dir === 'mixed') {
      isRomajiPrompt = Math.random() > 0.5;
    }

    setTargetItem(randomItem);
    setCurrentPromptIsRomaji(isRomajiPrompt);
    setSelectedAnswerId(null);

    // Pick distractors preferably from the filtered pool
    let distractorPool = pool.filter((i) => i.id !== randomItem.id);
    if (distractorPool.length < 3) {
      // Fallback to other characters if selected pool is very small (e.g. 1 row)
      distractorPool = allGojuon.filter((i) => i.id !== randomItem.id);
    }

    const distractors = distractorPool.sort(() => Math.random() - 0.5).slice(0, 3);
    const shuffled = [randomItem, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptionItems(shuffled);
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuestion(selectedType, quizDirection, selectedRows);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [viewMode, selectedType, quizDirection, selectedRows]);

  const handleQuizAnswer = (item: KanaItem) => {
    if (!targetItem || selectedAnswerId !== null) return;
    setSelectedAnswerId(item.id);

    const isCorrect = item.id === targetItem.id;
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      triggerHaptic('success');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      speak(targetItem.char);
    } else {
      triggerHaptic('error');
      setStreak(0);
      speak(item.char);
    }

    timerRef.current = setTimeout(() => {
      generateQuestion(selectedType, quizDirection, selectedRows);
    }, 2400);
  };

  // Row Filter Helpers
  const toggleRow = (rowId: string) => {
    triggerHaptic('light');
    if (selectedRows.includes(rowId)) {
      if (selectedRows.length === 1) return; // Keep at least 1 row selected
      setSelectedRows(selectedRows.filter((r) => r !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const selectAllRows = () => {
    triggerHaptic('light');
    setSelectedRows(ROW_CONFIG.map((r) => r.id));
  };

  const selectOnlyVowels = () => {
    triggerHaptic('light');
    setSelectedRows(['a']);
  };

  // Get active characters count
  const activeCharCount = (
    selectedType === 'hiragana' ? HIRAGANA_DATA.filter((i) => i.type === 'gojuon') : KATAKANA_DATA
  ).filter((i) => selectedRows.includes(i.row)).length;

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
              {viewMode === 'grid' ? '50-Sounds Master Chart' : 'Kana Recognition Quiz'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {viewMode === 'grid'
                ? '五十音図 — Tap any character for audio & mnemonics'
                : 'Customizable row drill with dual per-answer reveals'}
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
      {/* MODE B: CHART QUIZ WITH POP-UP ROW FILTER & DUAL REVEALS */}
      {/* ======================================================== */}
      {viewMode === 'quiz' && targetItem && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in max-w-md mx-auto">
          {/* Quiz Top Action Bar: Direction Switcher & Clean Pop-up Filter Button */}
          <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-2">
            {/* Direction Selector */}
            <div className="flex p-0.5 bg-stone-100 rounded-xl text-xs font-bold flex-1">
              <button
                type="button"
                onClick={() => setQuizDirection('romaji_to_kana')}
                className={`flex-1 py-1 px-2 rounded-lg transition-all ${
                  quizDirection === 'romaji_to_kana'
                    ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                a ➔ [あ]
              </button>
              <button
                type="button"
                onClick={() => setQuizDirection('kana_to_romaji')}
                className={`flex-1 py-1 px-2 rounded-lg transition-all ${
                  quizDirection === 'kana_to_romaji'
                    ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [あ] ➔ a
              </button>
              <button
                type="button"
                onClick={() => setQuizDirection('mixed')}
                className={`py-1 px-2.5 rounded-lg transition-all ${
                  quizDirection === 'mixed'
                    ? 'bg-red-50 text-japan-crimson border border-red-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔀 Mixed
              </button>
            </div>

            {/* Pop-up Filter Settings Button (No scrollable clutter!) */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Open Row Filter Settings"
            >
              <SlidersHorizontal size={13} className="text-japan-crimson" />
              <span>
                Rows ({selectedRows.length === ROW_CONFIG.length ? 'All' : `${selectedRows.length}`})
              </span>
            </button>
          </div>

          {/* Active Row Scope Indicator & Score Header */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500 font-bold">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="text-slate-600 hover:text-japan-crimson text-[11px] underline flex items-center gap-1"
            >
              <span>
                {selectedRows.length === ROW_CONFIG.length
                  ? 'Practicing All Rows (46)'
                  : `Testing: ${selectedRows.map((r) => r.toUpperCase()).join(', ')} (${activeCharCount} chars)`}
              </span>
            </button>
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              🔥 Streak: {streak}
            </span>
          </div>

          {/* The Question Prompt Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {currentPromptIsRomaji
                ? `Pick the Japanese character for:`
                : `What is the reading of this character?`}
            </span>

            {/* Prompt Display */}
            <div className="inline-flex flex-col items-center justify-center min-w-[120px] min-h-[120px] p-4 rounded-3xl bg-stone-50 border-2 border-stone-200/80 shadow-inner">
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

            {/* 4 Answer Choice Buttons (WITH PER-ANSWER REVEAL) */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-1">
              {quizOptionItems.map((item) => {
                const isChosen = selectedAnswerId === item.id;
                const isCorrect = item.id === targetItem.id;
                const hasAnswered = selectedAnswerId !== null;

                let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-slate-800 border-stone-200';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-50 text-emerald-950 border-emerald-400 ring-2 ring-emerald-300 shadow-md font-bold';
                  } else if (isChosen) {
                    btnStyle =
                      'bg-red-50 text-red-950 border-red-400 ring-2 ring-red-300 shadow-md font-bold';
                  } else {
                    btnStyle = 'bg-stone-50/70 text-slate-600 border-stone-200 opacity-80';
                  }
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleQuizAnswer(item)}
                    className={`h-20 sm:h-22 rounded-2xl border transition-all duration-200 active:scale-95 flex flex-col items-center justify-center relative p-2 ${btnStyle}`}
                  >
                    {!hasAnswered ? (
                      <span
                        className={
                          currentPromptIsRomaji
                            ? 'font-japanese text-3xl font-bold'
                            : 'text-2xl font-black uppercase'
                        }
                      >
                        {currentPromptIsRomaji ? item.char : item.romaji}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center animate-fade-in">
                        <span className="font-japanese text-2xl sm:text-3xl font-bold leading-tight">
                          {item.char}
                        </span>
                        <span
                          className={`text-xs font-black uppercase tracking-wider mt-0.5 px-2 py-0.2 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-200/80 text-emerald-900'
                              : isChosen
                              ? 'bg-red-200/80 text-red-900'
                              : 'bg-stone-200/70 text-slate-600'
                          }`}
                        >
                          {item.romaji}
                        </span>
                      </div>
                    )}

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 size={16} className="absolute top-2 right-2 text-emerald-600" />
                    )}
                    {hasAnswered && isChosen && !isCorrect && (
                      <XCircle size={16} className="absolute top-2 right-2 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback / Advance Action */}
            <div className="pt-2">
              {selectedAnswerId !== null ? (
                <button
                  type="button"
                  onClick={() => generateQuestion(selectedType, quizDirection, selectedRows)}
                  className="py-2.5 px-6 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 mx-auto animate-scale-up"
                >
                  <span>Next Question</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => generateQuestion(selectedType, quizDirection, selectedRows)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700 py-1 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  <span>Skip Question</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POP-UP SETTINGS MODAL: MULTI-SELECT ROW FILTER           */}
      {/* ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-japan-crimson" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Row Filter Settings ({selectedType.toUpperCase()})
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Toggle multiple rows to practice (e.g. Ka + Ha)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Presets */}
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllRows}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-slate-700 hover:bg-stone-100 transition-colors"
                >
                  Select All (10 Rows)
                </button>
                <button
                  type="button"
                  onClick={selectOnlyVowels}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-slate-700 hover:bg-stone-100 transition-colors"
                >
                  Only Vowels (A-Row)
                </button>
              </div>
              <span className="text-[11px] text-japan-crimson font-semibold">
                {activeCharCount} characters selected
              </span>
            </div>

            {/* Grid of Toggleable Rows (2 Columns) */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROW_CONFIG.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                const sample = selectedType === 'hiragana' ? row.hiraganaSample : row.katakanaSample;

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => toggleRow(row.id)}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50 border-japan-crimson ring-2 ring-red-300 shadow-sm'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-slate-600 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected
                              ? 'bg-japan-crimson text-white'
                              : 'bg-stone-200 text-slate-500'
                          }`}
                        >
                          {isSelected ? <Check size={10} /> : ''}
                        </span>
                        <span>{row.name}</span>
                      </div>
                      <div className="font-japanese text-sm font-semibold text-slate-600 mt-1 pl-5">
                        {sample}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Apply & Start Practice ({activeCharCount} Chars)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
