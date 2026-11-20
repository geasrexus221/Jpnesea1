import React, { useState } from 'react';
import { CONFUSING_PAIRS } from '../../data/confusing_pairs';
import { ConfusingPair } from '../../types';
import { AudioButton } from '../ui/AudioButton';
import { Swords, CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

export const ConfusingPairs: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const [quizQuestion, setQuizQuestion] = useState<{
    targetChar: string;
    correctRomaji: string;
    options: string[];
    userAnswer: string | null;
  } | null>(null);

  const { triggerHaptic } = useHaptics();

  const filteredPairs = CONFUSING_PAIRS.filter((pair) =>
    activeStage === 'all' ? true : pair.stage === activeStage
  );

  const activePair: ConfusingPair | undefined = filteredPairs[selectedPairIndex];

  // Generate a rapid recognition drill for this pair
  const startQuiz = (pair: ConfusingPair) => {
    const isFirst = Math.random() > 0.5;
    const targetChar = isFirst ? pair.charA : pair.charB;
    const correctRomaji = isFirst ? pair.romajiA : pair.romajiB;
    const otherRomaji = isFirst ? pair.romajiB : pair.romajiA;

    setQuizQuestion({
      targetChar,
      correctRomaji,
      options: [correctRomaji, otherRomaji].sort(() => Math.random() - 0.5),
      userAnswer: null,
    });
  };

  const handleAnswer = (chosen: string) => {
    if (!quizQuestion || quizQuestion.userAnswer !== null) return;

    const isCorrect = chosen === quizQuestion.correctRomaji;
    setQuizQuestion({ ...quizQuestion, userAnswer: chosen });
    triggerHaptic(isCorrect ? 'success' : 'error');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Swords size={20} className="text-japan-crimson" />
            <span>Confusing Pairs Trainer</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Master easily mistaken look-alike characters (like さ vs ち, and the famous シ vs ツ).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex p-1 bg-stone-100 rounded-2xl">
          {(['all', 'hiragana', 'katakana'] as const).map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setActiveStage(stage);
                setSelectedPairIndex(0);
                setQuizQuestion(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeStage === stage
                  ? 'bg-japan-crimson text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Main Duel Showcase */}
      {activePair && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Head-to-head Characters */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center max-w-lg mx-auto">
            {/* Character A */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-3xl border-2 border-stone-200 shadow-sm hover:border-red-300 transition-all">
              <span className="font-japanese text-6xl sm:text-7xl font-bold text-slate-900">
                {activePair.charA}
              </span>
              <span className="text-base font-bold text-japan-crimson mt-2 uppercase tracking-widest">
                {activePair.romajiA}
              </span>
              <div className="mt-3">
                <AudioButton text={activePair.charA} size="md" label="Hear" />
              </div>
            </div>

            {/* Character B */}
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-3xl border-2 border-stone-200 shadow-sm hover:border-red-300 transition-all">
              <span className="font-japanese text-6xl sm:text-7xl font-bold text-slate-900">
                {activePair.charB}
              </span>
              <span className="text-base font-bold text-japan-crimson mt-2 uppercase tracking-widest">
                {activePair.romajiB}
              </span>
              <div className="mt-3">
                <AudioButton text={activePair.charB} size="md" label="Hear" />
              </div>
            </div>
          </div>

          {/* Distinction Secret Tip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 max-w-xl mx-auto">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800 mb-1">
              <HelpCircle size={16} />
              <span>How To Tell Them Apart</span>
            </div>
            <p className="text-sm leading-relaxed">{activePair.tip}</p>
          </div>

          {/* Quick Quiz Battle */}
          <div className="max-w-md mx-auto pt-4 border-t border-stone-100 flex flex-col items-center">
            {!quizQuestion ? (
              <button
                type="button"
                onClick={() => startQuiz(activePair)}
                className="px-6 py-3 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Test Yourself on this Pair</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="w-full space-y-4 animate-fade-in text-center">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Which reading belongs to this character?
                </p>
                <div className="font-japanese text-6xl font-bold text-slate-900">
                  {quizQuestion.targetChar}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {quizQuestion.options.map((opt) => {
                    const isChosen = quizQuestion.userAnswer === opt;
                    const isCorrectAnswer = opt === quizQuestion.correctRomaji;
                    const hasAnswered = quizQuestion.userAnswer !== null;

                    let btnClass = 'bg-stone-50 hover:bg-stone-100 text-slate-800 border-stone-200';
                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        btnClass = 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-300';
                      } else if (isChosen) {
                        btnClass = 'bg-red-50 text-red-800 border-red-400 ring-2 ring-red-300';
                      } else {
                        btnClass = 'bg-stone-50 text-slate-400 border-stone-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswer(opt)}
                        disabled={hasAnswered}
                        className={`py-3.5 px-4 rounded-2xl font-bold text-lg border transition-all active:scale-95 ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizQuestion.userAnswer !== null && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => startQuiz(activePair)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-japan-crimson hover:bg-red-50 transition-colors"
                    >
                      Try Another Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pair Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filteredPairs.map((pair, idx) => {
          const isCurrent = idx === selectedPairIndex;
          return (
            <button
              key={pair.id}
              type="button"
              onClick={() => {
                setSelectedPairIndex(idx);
                setQuizQuestion(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-red-50 border-japan-crimson ring-2 ring-red-300 shadow-sm'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div className="font-japanese text-xl font-bold text-slate-900">
                {pair.charA} <span className="text-slate-300 text-sm">vs</span> {pair.charB}
              </div>
              <div className="text-[11px] text-slate-500 uppercase mt-0.5">
                {pair.romajiA} / {pair.romajiB}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
