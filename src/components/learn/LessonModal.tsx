import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lesson, KanaItem, KanjiItem } from '../../types';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KANJI_N5_DATA } from '../../data/kanji_n5';
import { AudioButton } from '../ui/AudioButton';
import { StrokeCanvas } from '../canvas/StrokeCanvas';
import { X, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSpeech } from '../../hooks/useSpeech';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
  speed?: number;
}

type StepMode = 'learn' | 'quiz' | 'canvas' | 'finish';

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  onClose,
  onComplete,
  speed = 1.0,
}) => {
  const [currentStep, setCurrentStep] = useState<StepMode>('learn');
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const { triggerHaptic } = useHaptics();
  const { speak } = useSpeech(speed);

  // Collect the items for this lesson
  const allItems = [...HIRAGANA_DATA, ...KATAKANA_DATA, ...KANJI_N5_DATA];
  const lessonItems = lesson.characterIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as (KanaItem | KanjiItem)[];

  const currentItem = lessonItems[itemIndex];

  // Helper type guard
  const isKana = (item: KanaItem | KanjiItem): item is KanaItem => {
    return 'romaji' in item;
  };

  const getDisplayText = (item: KanaItem | KanjiItem) => {
    return isKana(item) ? item.char : item.kanji;
  };

  const getSubText = (item: KanaItem | KanjiItem) => {
    return isKana(item) ? item.romaji : item.meanings.join(', ');
  };

  // Generate 4 randomized multiple choice options for quiz
  const generateQuizOptions = () => {
    if (!currentItem) return [];
    const correct = getSubText(currentItem);
    const pool = allItems
      .filter((i) => i.id !== currentItem.id)
      .map((i) => getSubText(i));
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  };

  const [quizOptions, setQuizOptions] = useState<string[]>(generateQuizOptions);

  const handleNextItem = () => {
    if (itemIndex < lessonItems.length - 1) {
      setItemIndex(itemIndex + 1);
      setSelectedQuizOption(null);
      // Auto-pronounce next item
      const next = lessonItems[itemIndex + 1];
      if (next) speak(getDisplayText(next));
    } else {
      // Transition to next mode
      if (currentStep === 'learn') {
        setCurrentStep('quiz');
        setItemIndex(0);
        setSelectedQuizOption(null);
      } else if (currentStep === 'quiz') {
        setCurrentStep('canvas');
        setItemIndex(0);
      } else if (currentStep === 'canvas') {
        // Complete!
        setCurrentStep('finish');
        triggerHaptic('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        onComplete(lesson.id);
      }
    }
  };

  const handleQuizAnswer = (chosen: string) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(chosen);

    const isCorrect = chosen === getSubText(currentItem);
    if (isCorrect) {
      triggerHaptic('success');
      setQuizScore((prev) => prev + 1);
    } else {
      triggerHaptic('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{lesson.title}</h3>
            <span className="text-[11px] font-semibold text-japan-crimson uppercase tracking-wider">
              {currentStep.toUpperCase()} STEP ({itemIndex + 1}/{lessonItems.length})
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center">
          {currentItem && currentStep === 'learn' && (
            <div className="w-full flex flex-col items-center text-center space-y-6 animate-fade-in">
              {/* Giant Character Card */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white border-2 border-stone-200 shadow-md flex flex-col items-center justify-center relative group">
                <span className="font-japanese text-7xl sm:text-8xl font-bold text-slate-900">
                  {getDisplayText(currentItem)}
                </span>
                <div className="absolute bottom-2 right-2">
                  <AudioButton text={getDisplayText(currentItem)} size="sm" />
                </div>
              </div>

              {/* Reading / Meaning */}
              <div>
                <span className="text-2xl font-bold uppercase tracking-widest text-japan-crimson">
                  {getSubText(currentItem)}
                </span>
                {isKana(currentItem) && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentItem.strokeCount} strokes
                  </p>
                )}
              </div>

              {/* Mnemonic Memory Hook */}
              {isKana(currentItem) && (
                <div className="w-full max-w-md p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
                  <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1">
                    <Sparkles size={14} /> Memory Trick
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 mt-1 font-medium">
                    {currentItem.mnemonic}
                  </p>
                </div>
              )}

              {/* Example Word */}
              {isKana(currentItem) && currentItem.exampleWord && (
                <div className="w-full max-w-md p-3.5 rounded-2xl bg-white border border-stone-200 text-xs flex items-center justify-between text-slate-700">
                  <div>
                    <span className="text-slate-400">Used in: </span>
                    <strong className="font-japanese text-base text-slate-900 ml-1">
                      {currentItem.exampleWord.japanese}
                    </strong>
                    <span className="text-slate-500 ml-1">({currentItem.exampleWord.reading})</span>
                  </div>
                  <span className="font-semibold text-japan-crimson">
                    {currentItem.exampleWord.english}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Quiz Recall */}
          {currentItem && currentStep === 'quiz' && (
            <div className="w-full flex flex-col items-center text-center space-y-6 animate-fade-in">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select the correct reading / meaning
              </span>

              <div className="w-36 h-36 rounded-3xl bg-white border-2 border-stone-200 shadow-md flex items-center justify-center">
                <span className="font-japanese text-6xl font-bold text-slate-900">
                  {getDisplayText(currentItem)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {quizOptions.map((opt) => {
                  const isSelected = selectedQuizOption === opt;
                  const isCorrect = opt === getSubText(currentItem);
                  const hasAnswered = selectedQuizOption !== null;

                  let colorStyle = 'bg-white border-stone-200 text-slate-800 hover:border-red-300';
                  if (hasAnswered) {
                    if (isCorrect) {
                      colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-300';
                    } else if (isSelected) {
                      colorStyle = 'bg-red-50 text-red-800 border-red-400 ring-2 ring-red-300';
                    } else {
                      colorStyle = 'bg-stone-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`p-4 rounded-2xl border font-bold text-base transition-all active:scale-95 ${colorStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Finger Drawing Pad (Android & Mobile Delight) */}
          {currentItem && currentStep === 'canvas' && (
            <div className="w-full flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="text-xs font-medium text-slate-500">
                Trace the strokes with your finger or mouse to build muscle memory!
              </div>

              <StrokeCanvas character={getDisplayText(currentItem)} />

              <div className="text-sm font-bold text-slate-800">
                {getDisplayText(currentItem)} —{' '}
                <span className="text-japan-crimson uppercase">{getSubText(currentItem)}</span>
              </div>
            </div>
          )}

          {/* Finish Screen */}
          {currentStep === 'finish' && (
            <div className="w-full flex flex-col items-center text-center space-y-5 animate-scale-up py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={44} />
              </div>

              <h4 className="text-2xl font-bold text-slate-900">Lesson Mastered!</h4>
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Quiz Score: {quizScore} / {lessonItems.length} Correct
              </p>
              <p className="text-sm text-slate-600 max-w-sm">
                Awesome work! You have finished <strong>{lesson.title}</strong> and added these
                characters to your active reading memory.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-xs py-3.5 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Continue Curriculum
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        {currentStep !== 'finish' && (
          <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (itemIndex > 0) {
                  setItemIndex(itemIndex - 1);
                }
              }}
              disabled={itemIndex === 0}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <ArrowLeft size={20} />
            </button>

            <button
              type="button"
              onClick={handleNextItem}
              className="px-6 py-2.5 rounded-2xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{itemIndex === lessonItems.length - 1 ? 'Next Step' : 'Next Item'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
