import React, { useState, useEffect, useMemo, useRef } from 'react';
import { YUGIOH_CARDS } from '../../data/yugioh_cards';
import { CardSelectorModal } from './CardSelectorModal';
import {
  parseCardTextToQuizTokens,
  generateDistractors,
  QuizToken,
} from '../../utils/cardQuizParser';
import {
  Search,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  CheckCircle2,
  Palette,
  ChevronDown,
  Flame,
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import confetti from 'canvas-confetti';

export const CardReadingQuiz: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>(YUGIOH_CARDS[0].id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // User preferences (All defaulted to FALSE as requested)
  const [colorHintEnabled, setColorHintEnabled] = useState<boolean>(false); // Defaults to OFF
  const [translationEnabled, setTranslationEnabled] = useState<boolean>(false); // Defaults to OFF
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false); // Defaults to OFF

  // Card reference
  const currentCard = useMemo(
    () => YUGIOH_CARDS.find((c) => c.id === selectedCardId) || YUGIOH_CARDS[0],
    [selectedCardId]
  );

  // Parse all tokens from full card text
  const tokens = useMemo(
    () => parseCardTextToQuizTokens(currentCard.fullJapanese),
    [currentCard]
  );

  // Find index of first testable character
  const getNextTestableIndex = (startIndex: number): number => {
    for (let idx = startIndex; idx < tokens.length; idx++) {
      if (!tokens[idx].isPunctuation) {
        return idx;
      }
    }
    return tokens.length; // all done!
  };

  const [currentIndex, setCurrentIndex] = useState<number>(() => getNextTestableIndex(0));
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const { speak } = useSpeech();
  const textScrollRef = useRef<HTMLDivElement>(null);

  // Reset quiz when card changes
  useEffect(() => {
    const firstIdx = getNextTestableIndex(0);
    setCurrentIndex(firstIdx);
    setStreak(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [selectedCardId, tokens]);

  // Current active token
  const currentToken: QuizToken | undefined = tokens[currentIndex];

  // Generate 6 options whenever current active token changes
  useEffect(() => {
    if (currentToken && !currentToken.isPunctuation) {
      const generated = generateDistractors(currentToken.romaji);
      setOptions(generated);
      setSelectedOption(null);
      setIsCorrect(null);
    } else if (currentIndex >= tokens.length && tokens.length > 0) {
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [currentIndex, currentToken, tokens.length]);

  // Handle answer click
  const handleSelectOption = (opt: string) => {
    if (!currentToken || selectedOption !== null) return;

    setSelectedOption(opt);
    const correct = opt === currentToken.romaji;
    setIsCorrect(correct);
    setTotalAnswered((prev) => prev + 1);

    if (correct) {
      setTotalCorrect((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      // Only pronounce audio if soundEnabled toggle is turned ON!
      if (soundEnabled) {
        speak(currentToken.char);
      }

      // Advance after a brief pleasant pause
      setTimeout(() => {
        const nextIdx = getNextTestableIndex(currentIndex + 1);
        if (nextIdx >= tokens.length) {
          setIsCompleted(true);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } else {
          setCurrentIndex(nextIdx);
        }
      }, 550);
    } else {
      setStreak(0);
      // Allow retry after short shake
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  // Color classes helper based on character type
  const getTokenColorClass = (token: QuizToken, isActive: boolean, isPast: boolean) => {
    if (isActive) {
      return 'ring-2 ring-japan-crimson bg-red-100 text-japan-crimson font-black scale-110 z-10';
    }
    if (isPast) {
      return 'text-slate-400 font-medium';
    }
    if (!colorHintEnabled) {
      return 'text-slate-800 font-semibold';
    }

    switch (token.type) {
      case 'hiragana':
        return 'text-indigo-600 font-semibold';
      case 'katakana':
        return 'text-amber-700 font-semibold';
      case 'kanji':
        return 'text-rose-600 font-bold';
      default:
        return 'text-slate-400 font-normal';
    }
  };

  const getSpotlightColorStyle = (token: QuizToken) => {
    if (!colorHintEnabled) return 'border-stone-300 text-slate-900 bg-white';
    switch (token.type) {
      case 'hiragana':
        return 'border-indigo-300 text-indigo-700 bg-indigo-50/40';
      case 'katakana':
        return 'border-amber-300 text-amber-800 bg-amber-50/40';
      case 'kanji':
        return 'border-rose-300 text-rose-700 bg-red-50/40';
      default:
        return 'border-stone-300 text-slate-900 bg-white';
    }
  };

  const handleRestart = () => {
    const firstIdx = getNextTestableIndex(0);
    setCurrentIndex(firstIdx);
    setStreak(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="space-y-3 max-w-2xl mx-auto animate-fade-in">
      {/* 1. Header Control Strip: Card Picker, Streak, Translation, Color Hint, Sound, Reset */}
      <div className="flex items-center justify-between gap-1.5 p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all truncate"
        >
          <Search size={12} className="text-amber-300 shrink-0" />
          <span className="truncate">{currentCard.nameJapanese}</span>
          <ChevronDown size={12} className="text-slate-400 shrink-0" />
        </button>

        {/* Toggles Strip */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Streak indicator */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
            <Flame size={12} className="text-amber-500 fill-amber-500" />
            <span>{streak}</span>
          </div>

          {/* Translation Toggle (Default OFF) */}
          <button
            type="button"
            onClick={() => setTranslationEnabled(!translationEnabled)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              translationEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                : 'bg-stone-100 text-slate-500 border-stone-200 hover:text-slate-800'
            }`}
            title="Toggle English Translation (Defaults to OFF)"
          >
            <Languages size={12} />
            <span className="hidden sm:inline">English</span>
          </button>

          {/* Color Hint Switch (Default OFF) */}
          <button
            type="button"
            onClick={() => setColorHintEnabled(!colorHintEnabled)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              colorHintEnabled
                ? 'bg-rose-50 text-japan-crimson border-red-200 font-bold'
                : 'bg-stone-100 text-slate-500 border-stone-200 hover:text-slate-800'
            }`}
            title="Toggle character type coloring (Hiragana/Katakana/Kanji - Defaults to OFF)"
          >
            <Palette size={12} />
            <span className="hidden sm:inline">Color</span>
          </button>

          {/* Sound Toggle (Default OFF) */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                : 'bg-stone-100 text-slate-500 border-stone-200 hover:text-slate-800'
            }`}
            title={soundEnabled ? 'Sound is ON (Tap to Mute)' : 'Sound is OFF (Tap to Unmute)'}
          >
            {soundEnabled ? (
              <Volume2 size={12} className="text-emerald-600" />
            ) : (
              <VolumeX size={12} className="text-slate-400" />
            )}
            <span className="hidden sm:inline">Audio</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-stone-100 transition-colors"
            title="Restart current card"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted ? (
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm text-center space-y-3 animate-scale-up">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-japanese">
            カード読了！(Card Completed!)
          </h2>
          <p className="text-xs text-slate-600">
            Accuracy:{' '}
            <span className="font-bold text-emerald-600">
              {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 100}%
            </span>{' '}
            • Total Characters: {totalCorrect}
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              Read Again
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              Choose Next Card
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 2. TOP: Full Card Text (Sentence Canvas with Spotlight Highlight) */}
          <div className="p-3 sm:p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Card Reading Context (本文)</span>
              <span>
                {Math.min(currentIndex + 1, tokens.length)} / {tokens.length}
              </span>
            </div>

            {/* Scrollable text container with flowing ruby */}
            <div
              ref={textScrollRef}
              className="flex flex-wrap items-baseline gap-x-0.5 gap-y-2 p-2 rounded-lg bg-stone-50/80 border border-stone-200/60 leading-relaxed max-h-36 overflow-y-auto"
            >
              {tokens.map((token, idx) => {
                const isActive = idx === currentIndex;
                const isPast = idx < currentIndex && !token.isPunctuation;
                const colorClass = getTokenColorClass(token, isActive, isPast);

                return (
                  <span
                    key={token.id || idx}
                    className={`inline-flex flex-col items-center px-0.5 py-0 rounded transition-all duration-150 ${colorClass}`}
                  >
                    {/* Ruby Furigana on top if Kanji */}
                    {token.furigana ? (
                      <span className="text-[9px] font-japanese font-semibold leading-none text-japan-crimson">
                        {token.furigana}
                      </span>
                    ) : (
                      <span className="text-[9px] leading-none opacity-0 select-none">-</span>
                    )}

                    {/* Character */}
                    <span className="font-japanese text-base sm:text-lg leading-tight">
                      {token.char}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Optional English Translation Display (Toggled ON/OFF) */}
            {translationEnabled && (
              <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200/70 text-xs text-slate-700 leading-relaxed animate-fade-in">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-0.5">
                  Official English Text:
                </div>
                <p className="font-medium text-slate-800 text-[11px] sm:text-xs">
                  {currentCard.englishEffect}
                </p>
              </div>
            )}
          </div>

          {/* 3. MIDDLE: Large Spotlight Character Square */}
          {currentToken && (
            <div className="flex flex-col items-center justify-center my-1">
              <div
                onClick={() => {
                  if (soundEnabled) speak(currentToken.char);
                }}
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 shadow-sm flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95 ${getSpotlightColorStyle(
                  currentToken
                )}`}
                title={soundEnabled ? 'Tap to hear pronunciation' : 'Sound is OFF (Tap speaker to unmute)'}
              >
                {/* Audio icon in corner (interactive) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentToken.char);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-japan-crimson hover:bg-red-50 transition-colors"
                  title="Play pronunciation"
                >
                  {soundEnabled ? (
                    <Volume2 size={16} className="text-emerald-600" />
                  ) : (
                    <VolumeX size={16} className="text-slate-400" />
                  )}
                </button>

                {/* Furigana on top if Kanji */}
                {currentToken.furigana ? (
                  <span className="text-xs sm:text-sm font-bold font-japanese text-japan-crimson tracking-tight mb-0.5 animate-fade-in">
                    {currentToken.furigana}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm leading-none opacity-0 select-none">
                    -
                  </span>
                )}

                {/* Big Character in Center */}
                <span className="font-japanese text-4xl sm:text-5xl font-black leading-none drop-shadow-2xs">
                  {currentToken.char}
                </span>

                {/* Character Type Tag badge at bottom - ONLY shown when colorHintEnabled is ON! */}
                {colorHintEnabled && (
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1.5 animate-fade-in">
                    {currentToken.type === 'hiragana' && 'Hiragana (ひらがな)'}
                    {currentToken.type === 'katakana' && 'Katakana (カタカナ)'}
                    {currentToken.type === 'kanji' && 'Kanji (漢字)'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 4. BOTTOM: 6 Possible Answer Buttons (3x2 Grid with identical letter counts) */}
          <div className="space-y-1.5">
            <div className="text-center text-[11px] font-medium text-slate-500">
              Guess the Romaji reading:
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-md mx-auto w-full">
              {options.map((opt) => {
                const isSelected = selectedOption === opt;
                let btnStyle =
                  'bg-white text-slate-800 border-stone-200 hover:border-japan-crimson hover:bg-red-50/30';

                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-95 shadow-sm'
                    : 'bg-rose-500 text-white border-rose-600 animate-shake';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null && isCorrect === true}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-3 sm:py-3.5 rounded-xl border text-sm sm:text-base font-bold shadow-2xs transition-all active:scale-95 duration-150 ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Card Selector Modal */}
      <CardSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCardId={selectedCardId}
        onSelectCard={(id) => setSelectedCardId(id)}
      />
    </div>
  );
};
