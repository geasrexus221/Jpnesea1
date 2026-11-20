import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Flame,
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KANJI_N5_DATA } from '../../data/kanji_n5';
import { KanaItem, KanjiItem } from '../../types';
import { useSpeech } from '../../hooks/useSpeech';
import { useHaptics } from '../../hooks/useHaptics';

export type ExamType = 'hiragana' | 'katakana' | 'kanji' | 'all';

interface QuizQuestion {
  id: string;
  type: 'char_to_reading' | 'reading_to_char' | 'audio_to_char' | 'word_meaning';
  prompt: string;
  targetDisplay: string;
  audioText: string;
  correctAnswer: string;
  options: string[];
  characterItem: KanaItem | KanjiItem;
}

interface QuizMistake {
  questionPrompt: string;
  targetChar: string;
  correctAnswer: string;
  userAnswer: string;
  audioText: string;
  mnemonic?: string;
}

export const SurvivalQuiz: React.FC = () => {
  const [examType, setExamType] = useState<ExamType>('hiragana');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);

  const { speak } = useSpeech();
  const { triggerHaptic } = useHaptics();

  // Helper type check
  const isKana = (item: KanaItem | KanjiItem): item is KanaItem => {
    return 'romaji' in item;
  };

  const getCharDisplay = (item: KanaItem | KanjiItem) => (isKana(item) ? item.char : item.kanji);
  const getRomajiDisplay = (item: KanaItem | KanjiItem) =>
    isKana(item) ? item.romaji : item.meanings[0];

  // Generate 10 randomized exam questions
  const generateExam = (type: ExamType): QuizQuestion[] => {
    let pool: (KanaItem | KanjiItem)[] = [];
    if (type === 'hiragana') {
      pool = HIRAGANA_DATA.filter((i) => i.type === 'gojuon');
    } else if (type === 'katakana') {
      pool = KATAKANA_DATA;
    } else if (type === 'kanji') {
      pool = KANJI_N5_DATA;
    } else {
      pool = [...HIRAGANA_DATA.filter((i) => i.type === 'gojuon'), ...KATAKANA_DATA, ...KANJI_N5_DATA];
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    return selected.map((item, idx) => {
      // Pick random question format
      const qTypes: QuizQuestion['type'][] = ['char_to_reading', 'reading_to_char', 'audio_to_char'];
      if (isKana(item) && item.exampleWord) {
        qTypes.push('word_meaning');
      }
      const chosenType = qTypes[Math.floor(Math.random() * qTypes.length)];

      const char = getCharDisplay(item);
      const romaji = getRomajiDisplay(item);

      let prompt = '';
      let targetDisplay = '';
      let correctAnswer = '';
      let distractorPool: string[] = [];

      if (chosenType === 'char_to_reading') {
        prompt = 'What is the reading of this character?';
        targetDisplay = char;
        correctAnswer = romaji;
        distractorPool = pool
          .filter((i) => getCharDisplay(i) !== char)
          .map((i) => getRomajiDisplay(i));
      } else if (chosenType === 'reading_to_char') {
        prompt = `Which character is pronounced "${romaji}"?`;
        targetDisplay = romaji;
        correctAnswer = char;
        distractorPool = pool
          .filter((i) => getCharDisplay(i) !== char)
          .map((i) => getCharDisplay(i));
      } else if (chosenType === 'audio_to_char') {
        prompt = 'Listen to the sound. Pick the matching character:';
        targetDisplay = '🔊';
        correctAnswer = char;
        distractorPool = pool
          .filter((i) => getCharDisplay(i) !== char)
          .map((i) => getCharDisplay(i));
      } else {
        // word_meaning
        const word = (item as KanaItem).exampleWord;
        prompt = `What does the word "${word.japanese}" mean?`;
        targetDisplay = word.japanese;
        correctAnswer = word.english;
        distractorPool = HIRAGANA_DATA.filter((i) => i.exampleWord && i.id !== item.id).map(
          (i) => i.exampleWord.english
        );
      }

      const distractors = [...new Set(distractorPool)]
        .filter((d) => d !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id: `q_${idx}_${item.id}`,
        type: chosenType,
        prompt,
        targetDisplay,
        audioText: char,
        correctAnswer,
        options,
        characterItem: item,
      };
    });
  };

  const startExam = (type: ExamType) => {
    const newQuestions = generateExam(type);
    setQuestions(newQuestions);
    setExamType(type);
    setCurrentIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setMistakes([]);
    setSelectedOption(null);
    setIsAnswering(false);
    setGameState('playing');

    // Auto-play audio if first question is audio-based
    if (newQuestions[0] && newQuestions[0].type === 'audio_to_char') {
      setTimeout(() => speak(newQuestions[0].audioText), 300);
    }
  };

  const currentQ = questions[currentIndex];

  // Auto-play audio when an audio question appears
  useEffect(() => {
    if (gameState === 'playing' && currentQ && currentQ.type === 'audio_to_char') {
      speak(currentQ.audioText);
    }
  }, [currentIndex, gameState]);

  const handleSelectAnswer = (option: string) => {
    if (isAnswering || selectedOption !== null || !currentQ) return;

    setSelectedOption(option);
    setIsAnswering(true);

    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      triggerHaptic('success');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      triggerHaptic('error');
      setStreak(0);
      const nextLives = lives - 1;
      setLives(nextLives);

      // Record mistake for review
      setMistakes((prev) => [
        ...prev,
        {
          questionPrompt: currentQ.prompt,
          targetChar: getCharDisplay(currentQ.characterItem),
          correctAnswer: currentQ.correctAnswer,
          userAnswer: option,
          audioText: currentQ.audioText,
          mnemonic: isKana(currentQ.characterItem)
            ? currentQ.characterItem.mnemonic
            : undefined,
        },
      ]);
    }

    // Advance to next question after 1.2s delay
    setTimeout(() => {
      const nextLives = isCorrect ? lives : lives - 1;

      // Fail condition: 0 lives remaining
      if (nextLives <= 0) {
        setGameState('result');
        return;
      }

      // Finish condition: reached end of exam
      if (currentIndex + 1 >= questions.length) {
        setGameState('result');
        if (score + (isCorrect ? 1 : 0) >= 7) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
        return;
      }

      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswering(false);
    }, 1200);
  };

  // Keyboard shortcut listener on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !currentQ || isAnswering) return;
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (keyMap[e.key] !== undefined && currentQ.options[keyMap[e.key]]) {
        handleSelectAnswer(currentQ.options[keyMap[e.key]]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQ, isAnswering]);

  // Determine Rank
  const getRank = (finalScore: number, finalLives: number) => {
    if (finalLives === 0 || finalScore < 7) return { rank: 'FAILED', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (finalScore === 10 && finalLives === 3) return { rank: 'RANK S (PERFECT)', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-300' };
    if (finalScore >= 9) return { rank: 'RANK A (EXCELLENT)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
    return { rank: 'RANK B (PASSED)', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' };
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* SCREEN 1: EXAM MENU & SELECTION */}
      {gameState === 'menu' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-japan-crimson shadow-sm">
            <Trophy size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Survival Quiz Exam</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Test your Japanese reading retention with real stakes! You have <strong>3 Lives (❤️❤️❤️)</strong>. Lose them all and it's Game Over.
            </p>
          </div>

          {/* Exam Type Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              { id: 'hiragana' as ExamType, title: 'Hiragana Exam', desc: '46 Native phonetic characters & sounds', badge: 'Beginner' },
              { id: 'katakana' as ExamType, title: 'Katakana Exam', desc: 'Foreign loanwords & sharp angles', badge: 'Essential' },
              { id: 'kanji' as ExamType, title: 'N5 Kanji Exam', desc: 'Numbers, directions, people & days', badge: 'JLPT N5' },
              { id: 'all' as ExamType, title: 'Ultimate Blitz', desc: 'Mixed challenge across all categories', badge: 'Master' },
            ].map((exam) => (
              <button
                key={exam.id}
                type="button"
                onClick={() => setExamType(exam.id)}
                className={`p-4 rounded-2xl border transition-all active:scale-95 text-left flex flex-col justify-between ${
                  examType === exam.id
                    ? 'bg-red-50 border-japan-crimson ring-2 ring-red-400/50 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{exam.title}</span>
                    <span className="text-[10px] font-semibold text-japan-crimson px-2 py-0.5 rounded-full bg-white border border-red-100">
                      {exam.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{exam.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => startExam(examType)}
              className="w-full py-4 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Start Survival Exam (10 Questions)</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: ACTIVE EXAM ARENA */}
      {gameState === 'playing' && currentQ && (
        <div className="space-y-4 animate-fade-in">
          {/* Top Status Bar: Progress, Lives & Streak */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
            {/* Lives / Hearts */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  size={22}
                  className={`transition-all duration-300 ${
                    heartIndex <= lives
                      ? 'text-red-500 fill-red-500 scale-100'
                      : 'text-stone-300 scale-75 opacity-40'
                  }`}
                />
              ))}
            </div>

            {/* Question Counter */}
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Flame size={14} className="fill-amber-500 text-amber-500" />
              <span>{streak}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {currentQ.prompt}
            </p>

            {/* Big Target Character / Sound Box */}
            <div className="relative inline-flex items-center justify-center min-w-[140px] min-h-[140px] p-6 rounded-3xl bg-stone-50 border-2 border-stone-200/80 shadow-inner">
              {currentQ.type === 'audio_to_char' ? (
                <button
                  type="button"
                  onClick={() => speak(currentQ.audioText)}
                  className="flex flex-col items-center justify-center gap-2 text-japan-crimson hover:scale-105 active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 text-japan-crimson flex items-center justify-center shadow-md animate-pulse">
                    <Volume2 size={32} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Tap to Replay Sound</span>
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-japanese text-6xl sm:text-7xl font-bold text-slate-900">
                    {currentQ.targetDisplay}
                  </span>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => speak(currentQ.audioText)}
                      className="p-1.5 rounded-full hover:bg-stone-200 text-slate-400 hover:text-slate-700"
                      title="Hear audio"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Multiple Choice Option Buttons */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {currentQ.options.map((option, oIdx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.correctAnswer;
                const hasAnswered = selectedOption !== null;

                let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-800';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-300 shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 text-red-800 border-red-400 ring-2 ring-red-300 shadow-md';
                  } else {
                    btnStyle = 'bg-stone-50 text-slate-300 border-stone-100 opacity-40';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectAnswer(option)}
                    className={`py-4 px-3 rounded-2xl border font-bold text-lg sm:text-xl transition-all duration-150 active:scale-95 relative flex items-center justify-center ${btnStyle}`}
                  >
                    <span className="font-japanese">{option}</span>
                    <span className="hidden md:inline absolute top-1.5 left-2 text-[10px] text-slate-400">
                      {oIdx + 1}
                    </span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 size={18} className="absolute right-2.5 text-emerald-600" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle size={18} className="absolute right-2.5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: RESULT SCREEN (PASS / FAIL) */}
      {gameState === 'result' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-6 animate-scale-up">
          {lives === 0 ? (
            /* FAILED SCREEN */
            <div className="space-y-3">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
                <ShieldAlert size={44} />
              </div>
              <h3 className="text-2xl font-bold text-red-600">EXAM FAILED (不合格)</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You ran out of lives! Japanese requires repetition and mistakes are proof that you are learning. Review what you missed below.
              </p>
            </div>
          ) : (
            /* PASSED SCREEN */
            <div className="space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Trophy size={44} />
              </div>
              <h3 className="text-2xl font-bold text-emerald-700">EXAM PASSED (合格)!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Congratulations! You survived the exam with lives to spare.
              </p>
            </div>
          )}

          {/* Score & Rank Badge */}
          {(() => {
            const rankInfo = getRank(score, lives);
            return (
              <div className={`p-4 rounded-2xl border ${rankInfo.bg} max-w-sm mx-auto space-y-1`}>
                <span className={`text-xs font-extrabold uppercase tracking-widest ${rankInfo.color}`}>
                  {rankInfo.rank}
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {score} / {questions.length} Correct
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1 pt-1">
                  <span>Remaining Lives:</span>
                  {[1, 2, 3].map((h) => (
                    <Heart
                      key={h}
                      size={14}
                      className={h <= lives ? 'text-red-500 fill-red-500' : 'text-stone-300'}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* MISTAKE BREAKDOWN LIST (LEARN FROM FAILING) */}
          {mistakes.length > 0 && (
            <div className="text-left space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Mistakes Review ({mistakes.length})
                </span>
                <span className="text-[11px] text-slate-500">Listen & memorize</span>
              </div>

              <div className="space-y-2">
                {mistakes.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-japanese text-3xl font-bold text-slate-900">
                        {m.targetChar}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800">
                          Correct: <span className="text-emerald-700">{m.correctAnswer}</span>
                        </div>
                        <div className="text-[11px] text-red-500">
                          You chose: <span className="line-through">{m.userAnswer}</span>
                        </div>
                        {m.mnemonic && (
                          <p className="text-[10px] text-slate-500 mt-0.5">💡 {m.mnemonic}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => speak(m.audioText)}
                      className="p-2 rounded-xl bg-white hover:bg-stone-100 text-slate-600 shadow-sm border border-stone-200"
                      title="Listen"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => startExam(examType)}
              className="flex-1 py-3 px-4 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              <span>Retry Exam</span>
            </button>

            <button
              type="button"
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs transition-all active:scale-95"
            >
              Back to Exam Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
