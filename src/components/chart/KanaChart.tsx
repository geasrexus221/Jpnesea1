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
type SoundCategory = 'gojuon' | 'dakuten' | 'handakuten';

interface RowOption {
  id: string;
  name: string;
  category: SoundCategory;
  hiraganaSample: string;
  katakanaSample: string;
}

const ALL_ROW_CONFIG: RowOption[] = [
  // 50-Sounds (Gojuon)
  { id: 'a', name: 'A-Row (Vowels)', category: 'gojuon', hiraganaSample: 'あ い う え お', katakanaSample: 'ア イ ウ エ オ' },
  { id: 'ka', name: 'Ka-Row', category: 'gojuon', hiraganaSample: 'か き く け こ', katakanaSample: 'カ キ ク ケ コ' },
  { id: 'sa', name: 'Sa-Row', category: 'gojuon', hiraganaSample: 'さ し す せ そ', katakanaSample: 'サ シ ス セ ソ' },
  { id: 'ta', name: 'Ta-Row', category: 'gojuon', hiraganaSample: 'た ち つ て と', katakanaSample: 'タ チ ツ テ ト' },
  { id: 'na', name: 'Na-Row', category: 'gojuon', hiraganaSample: 'な に ぬ ね の', katakanaSample: 'ナ ニ ヌ ネ ノ' },
  { id: 'ha', name: 'Ha-Row', category: 'gojuon', hiraganaSample: 'は ひ ふ へ ほ', katakanaSample: 'ハ ヒ フ ヘ ホ' },
  { id: 'ma', name: 'Ma-Row', category: 'gojuon', hiraganaSample: 'ま み む め も', katakanaSample: 'マ ミ ム メ モ' },
  { id: 'ya', name: 'Ya-Row', category: 'gojuon', hiraganaSample: 'や ゆ よ', katakanaSample: 'ヤ ユ ヨ' },
  { id: 'ra', name: 'Ra-Row', category: 'gojuon', hiraganaSample: 'ら り る れ ろ', katakanaSample: 'ラ リ ル レ ロ' },
  { id: 'wa', name: 'Wa/N-Row', category: 'gojuon', hiraganaSample: 'わ を ん', katakanaSample: 'ワ ヲ ン' },
  // Voiced Dots (Dakuten: G, Z, D, B)
  { id: 'ga', name: 'Ga-Row (Voiced G)', category: 'dakuten', hiraganaSample: 'が ぎ ぐ げ ご', katakanaSample: 'ガ ギ グ ゲ ゴ' },
  { id: 'za', name: 'Za-Row (Voiced Z)', category: 'dakuten', hiraganaSample: 'ざ じ ず ぜ ぞ', katakanaSample: 'ザ ジ ズ ゼ ゾ' },
  { id: 'da', name: 'Da-Row (Voiced D: ど/ド)', category: 'dakuten', hiraganaSample: 'だ ぢ づ で ど', katakanaSample: 'ダ ヂ ヅ デ ド' },
  { id: 'ba', name: 'Ba-Row (Voiced B)', category: 'dakuten', hiraganaSample: 'ば び ぶ べ ぼ', katakanaSample: 'バ ビ ブ ベ ボ' },
  // Half-Voiced Circles (Handakuten: P)
  { id: 'pa', name: 'Pa-Row (Half-Voiced P)', category: 'handakuten', hiraganaSample: 'ぱ ぴ ぷ ぺ ぽ', katakanaSample: 'パ ピ プ ペ ポ' },
];

export const KanaChart: React.FC<KanaChartProps> = ({ romajiVisible, onSelectCharacter }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'quiz'>('grid');
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [soundCategory, setSoundCategory] = useState<SoundCategory>('gojuon');
  const [activeItem, setActiveItem] = useState<KanaItem | null>(null);

  // Multi-select row filter state (defaults to all gojuon rows)
  const [selectedRows, setSelectedRows] = useState<string[]>(
    ALL_ROW_CONFIG.filter((r) => r.category === 'gojuon').map((r) => r.id)
  );
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

  const currentRows =
    soundCategory === 'gojuon'
      ? ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n']
      : soundCategory === 'dakuten'
      ? ['ga', 'za', 'da', 'ba']
      : ['pa'];

  // Helper to fetch character in a row
  const getCharInRow = (row: string, vowelIndex: number) => {
    const vowels = ['a', 'i', 'u', 'e', 'o'];
    const targetVowel = vowels[vowelIndex];

    if (soundCategory === 'gojuon') {
      const gojuonItems = currentDataset.filter((item) => item.type === 'gojuon');
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
    }

    if (soundCategory === 'dakuten') {
      const dakutenItems = currentDataset.filter((item) => item.type === 'dakuten');
      if (row === 'da') {
        if (vowelIndex === 0) return dakutenItems.find((i) => i.id.endsWith('_da'));
        if (vowelIndex === 1) return dakutenItems.find((i) => i.id.endsWith('_dji'));
        if (vowelIndex === 2) return dakutenItems.find((i) => i.id.endsWith('_dzu'));
        if (vowelIndex === 3) return dakutenItems.find((i) => i.id.endsWith('_de'));
        if (vowelIndex === 4) return dakutenItems.find((i) => i.id.endsWith('_do')); // ど / ド (do) is here!
      }
      if (row === 'za') {
        if (vowelIndex === 1) return dakutenItems.find((i) => i.id.endsWith('_ji'));
      }
      return dakutenItems.find((i) => i.row === row && i.romaji.endsWith(targetVowel));
    }

    if (soundCategory === 'handakuten') {
      const handakutenItems = currentDataset.filter((item) => item.type === 'handakuten');
      return handakutenItems.find((i) => i.row === 'pa' && i.romaji.endsWith(targetVowel));
    }

    return null;
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

    const allItems = type === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    let pool = allItems.filter((i) => activeRows.includes(i.row));
    if (pool.length === 0) {
      pool = allItems.filter((i) => i.type === 'gojuon');
    }

    // Pick random target
    const randomIndex = Math.floor(Math.random() * pool.length);
    const correctItem = pool[randomIndex];

    // Pick 3 random distractors
    const otherPool = allItems.filter((i) => i.id !== correctItem.id);
    const shuffledOthers = [...otherPool].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3);

    // Shuffle 4 options
    const options = [correctItem, ...distractors].sort(() => 0.5 - Math.random());

    // Determine direction for mixed
    const isRomajiPrompt = dir === 'mixed' ? Math.random() > 0.5 : dir === 'romaji_to_kana';

    setTargetItem(correctItem);
    setQuizOptionItems(options);
    setCurrentPromptIsRomaji(isRomajiPrompt);
    setSelectedAnswerId(null);
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuestion();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [viewMode, selectedType, quizDirection]);

  const handleAnswer = (chosenItem: KanaItem) => {
    if (selectedAnswerId !== null || !targetItem) return;

    setSelectedAnswerId(chosenItem.id);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = chosenItem.id === targetItem.id;

    if (isCorrect) {
      triggerHaptic('success');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      speak(targetItem.char);
    } else {
      triggerHaptic('error');
      setStreak(0);
    }
  };

  const toggleRow = (rowId: string) => {
    triggerHaptic('light');
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== rowId);
      }
      return [...prev, rowId];
    });
  };

  const selectAllRows = () => {
    triggerHaptic('light');
    setSelectedRows(ALL_ROW_CONFIG.map((r) => r.id));
  };

  const selectOnlyVowels = () => {
    triggerHaptic('light');
    setSelectedRows(['a']);
  };

  // Get active characters count
  const activeCharCount = (
    selectedType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA
  ).filter((i) => selectedRows.includes(i.row)).length;

  return (
    <div className="space-y-3.5 sm:space-y-5 max-w-4xl mx-auto pb-12">
      {/* 1. Master View Mode Selector: Grid vs Chart Quiz */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-japan-crimson">
            {viewMode === 'grid' ? <Grid size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {viewMode === 'grid' ? 'Kana Sound Charts (五十音・濁点)' : 'Kana Recognition Quiz'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {viewMode === 'grid'
                ? 'Tap any character for audio, romaji & mnemonics'
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

      {/* 3. SOUND CATEGORY TABS: Basic (Gojuon) vs Voiced (Dakuten) vs Half-Voiced (Handakuten) */}
      {viewMode === 'grid' && (
        <div className="flex p-1 bg-stone-100 rounded-xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setSoundCategory('gojuon')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              soundCategory === 'gojuon'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Basic (五十音)
          </button>
          <button
            type="button"
            onClick={() => setSoundCategory('dakuten')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              soundCategory === 'dakuten'
                ? 'bg-white text-japan-crimson shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voiced (濁点: ど, が)
          </button>
          <button
            type="button"
            onClick={() => setSoundCategory('handakuten')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              soundCategory === 'handakuten'
                ? 'bg-white text-japan-crimson shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Half-Voiced (半濁点: ぽ)
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE A: 50-SOUNDS / DAKUTEN GRID VIEW                     */}
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
                {currentRows.map((rowName) => (
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
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-md animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center font-japanese text-3xl font-bold text-japan-crimson shadow-inner">
                  {activeItem.char}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{activeItem.romaji}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-full bg-stone-100">
                      {activeItem.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic max-w-md">"{activeItem.mnemonic}"</p>
                  <p className="text-[11px] text-slate-400">
                    Example: <span className="font-japanese text-slate-800 font-bold">{activeItem.exampleWord.japanese}</span> ({activeItem.exampleWord.reading}) — {activeItem.exampleWord.english}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AudioButton text={activeItem.char} />
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE B: PRACTICE QUIZ ARENA                              */}
      {/* ======================================================== */}
      {viewMode === 'quiz' && (
        <div className="space-y-3.5 animate-fade-in max-w-xl mx-auto">
          {/* Quiz Top Action Bar: Settings Pop-Up Button + Score */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              <SlidersHorizontal size={13} className="text-amber-300" />
              <span>Filter Rows ({selectedRows.length})</span>
            </button>

            <div className="text-xs font-semibold text-slate-600">
              Score: <span className="text-japan-crimson font-bold">{score}</span> / {totalAnswered}
              {streak > 1 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                  🔥 {streak} Streak
                </span>
              )}
            </div>
          </div>

          {/* Quiz Question Card */}
          {targetItem && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm text-center space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {currentPromptIsRomaji ? 'Identify Character' : 'Identify Romaji Sound'}
                </span>
                <div className="font-japanese text-4xl sm:text-5xl font-black text-slate-900 mt-1">
                  {currentPromptIsRomaji ? targetItem.romaji : targetItem.char}
                </div>
              </div>

              {/* 4 Answer Choice Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {quizOptionItems.map((option) => {
                  const isSelected = selectedAnswerId === option.id;
                  const hasAnswered = selectedAnswerId !== null;
                  const isCorrect = option.id === targetItem.id;

                  let btnStyle = 'bg-stone-50 border-stone-200 text-slate-800 hover:bg-stone-100';
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-300';
                    } else {
                      btnStyle = 'opacity-50 border-stone-200 bg-stone-50';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleAnswer(option)}
                      className={`p-3.5 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center relative ${btnStyle}`}
                    >
                      <span className="font-japanese text-2xl font-bold">
                        {currentPromptIsRomaji ? option.char : option.romaji}
                      </span>

                      {/* Reveal secondary information once answered */}
                      {hasAnswered && (
                        <span className="text-[11px] font-sans text-slate-500 mt-0.5">
                          {currentPromptIsRomaji ? option.romaji : option.char}
                        </span>
                      )}

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 size={16} className="absolute top-2 right-2 text-emerald-600" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle size={16} className="absolute top-2 right-2 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Action */}
              <div className="pt-2">
                {selectedAnswerId !== null ? (
                  <button
                    type="button"
                    onClick={() => generateQuestion(selectedType, quizDirection, selectedRows)}
                    className="py-2 px-6 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 mx-auto"
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
          )}
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
                    Toggle multiple rows to practice (including Voiced Dakuten!)
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
                  Select All
                </button>
                <button
                  type="button"
                  onClick={selectOnlyVowels}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-slate-700 hover:bg-stone-100 transition-colors"
                >
                  Only Vowels
                </button>
              </div>
              <span className="text-[11px] text-japan-crimson font-semibold">
                {activeCharCount} characters selected
              </span>
            </div>

            {/* Grid of Toggleable Rows (2 Columns) */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_ROW_CONFIG.map((row) => {
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
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.category !== 'gojuon' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                            {row.category === 'dakuten' ? '濁点' : '半濁点'}
                          </span>
                        )}
                      </div>
                      <div className="font-japanese text-sm font-semibold text-slate-500 mt-0.5">
                        {sample}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-japan-crimson border-japan-crimson text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-stone-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsFilterModalOpen(false);
                  generateQuestion(selectedType, quizDirection, selectedRows);
                }}
                className="px-5 py-2 rounded-xl bg-japan-crimson text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Apply & Practice ({activeCharCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
