import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  Swords,
  Star,
  RotateCw,
  Volume2,
  Check,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  Shuffle,
  ChevronRight,
  Trophy,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSpeech } from '../../hooks/useSpeech';
import { FLASHCARD_DECKS_META } from '../../data/flashcardDecks';
import { FlashcardDeckId, FlashcardStudyMode } from '../../types/flashcard';

interface FlashcardStudioProps {
  onBackToMenu?: () => void;
}

export const FlashcardStudio: React.FC<FlashcardStudioProps> = ({ onBackToMenu }) => {
  const {
    progress,
    activeDeckId,
    sessionCards,
    currentCard,
    currentIndex,
    isFlipped,
    studyMode,
    autoPlayAudio,
    sessionCompleted,
    sessionStats,
    startSession,
    flipCard,
    rateCard,
    toggleStar,
    setStudyMode,
    setAutoPlayAudio,
    exitSession,
  } = useFlashcards();

  const { speak } = useSpeech();
  const [deckSizeLimit, setDeckSizeLimit] = useState<number>(20);
  const [isShuffle, setIsShuffle] = useState<boolean>(true);

  // Trigger confetti when session is completed
  useEffect(() => {
    if (sessionCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [sessionCompleted]);

  // Auto-play audio when flipped if enabled
  useEffect(() => {
    if (isFlipped && autoPlayAudio && currentCard) {
      speak(currentCard.reading || currentCard.prompt);
    }
  }, [isFlipped, autoPlayAudio, currentCard, speak]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeDeckId || sessionCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        flipCard();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          rateCard('again');
        } else if (e.key === '2') {
          e.preventDefault();
          rateCard('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          rateCard('easy');
        }
      }

      if (e.key === 'r' || e.key === 'R') {
        if (currentCard) {
          speak(isFlipped ? (currentCard.reading || currentCard.prompt) : currentCard.prompt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeckId, sessionCompleted, isFlipped, flipCard, rateCard, currentCard, speak]);

  const activeMeta = activeDeckId
    ? FLASHCARD_DECKS_META.find((d) => d.id === activeDeckId)
    : null;

  const isCurrentCardStarred = currentCard
    ? progress.starredIds.includes(currentCard.id)
    : false;

  // =========================================================================
  // 1. SESSION COMPLETED SCREEN
  // =========================================================================
  if (sessionCompleted && activeMeta) {
    const totalRated = sessionStats.easy + sessionStats.hard + sessionStats.again;
    const accuracy = totalRated > 0 ? Math.round((sessionStats.easy / totalRated) * 100) : 100;

    return (
      <div className="max-w-md mx-auto space-y-5 animate-fade-in py-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
          <Trophy size={32} />
        </div>

        <div className="space-y-1">
          <span className="font-japanese text-sm text-japan-crimson font-bold">
            大変よくできました！
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Deck Session Complete!
          </h2>
          <p className="text-xs text-slate-500">
            Great job! You have strengthened your neural pathways with active recall.
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-3 gap-2 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-lg font-black text-emerald-700">{sessionStats.easy}</div>
            <div className="text-[10px] font-bold text-emerald-600">Easy (覚えた)</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-lg font-black text-amber-700">{sessionStats.hard}</div>
            <div className="text-[10px] font-bold text-amber-600">Hard (難しい)</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-lg font-black text-rose-700">{sessionStats.again}</div>
            <div className="text-[10px] font-bold text-rose-600">Again (もう一度)</div>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-stone-100 py-1.5 px-3 rounded-full inline-block">
          Immediate Recall Rate: <span className="font-bold text-japan-crimson">{accuracy}%</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {sessionStats.again + sessionStats.hard > 0 && (
            <button
              type="button"
              onClick={() => startSession('tricky', true)}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <RotateCcw size={15} />
              <span>Review Tricky Cards ({sessionStats.again + sessionStats.hard})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => startSession(activeMeta.id, isShuffle, deckSizeLimit)}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RotateCw size={15} />
            <span>Study This Deck Again</span>
          </button>

          <button
            type="button"
            onClick={exitSession}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-xs transition-all active:scale-98"
          >
            Back to Deck Studio
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ACTIVE FLASHCARD STUDY SESSION
  // =========================================================================
  if (activeDeckId && currentCard) {
    const progressPercent = Math.round(((currentIndex + 1) / sessionCards.length) * 100);

    return (
      <div className="max-w-md mx-auto space-y-3 sm:space-y-4 animate-fade-in pb-10">
        {/* Top Session Navigation Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={exitSession}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Decks</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {currentIndex + 1} / {sessionCards.length}
            </span>
            <button
              type="button"
              onClick={() => toggleStar(currentCard.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isCurrentCardStarred
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'bg-white border-stone-200 text-stone-400 hover:text-amber-500'
              }`}
              title="Bookmark card to Starred Deck"
            >
              <Star size={14} className={isCurrentCardStarred ? 'fill-amber-400' : ''} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-japan-crimson to-rose-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3D TACTILE FLIP CARD CONTAINER */}
        <div className="perspective-1000 w-full min-h-[300px] sm:min-h-[340px]">
          <div
            onClick={flipCard}
            className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-3xl cursor-pointer transition-transform duration-500 transform-style-3d shadow-md hover:shadow-lg ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* ----------------- CARD FRONT ----------------- */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between select-none">
              {/* Card Top: Category & Speak Button */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 border border-stone-200 uppercase tracking-wider">
                  {currentCard.categoryTag}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentCard.prompt);
                  }}
                  className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-500 hover:text-japan-crimson transition-colors"
                  title="Listen to Japanese pronunciation (Key: R)"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* Card Center: Prompt Display */}
              <div className="py-4 text-center my-auto">
                {studyMode === 'jp_to_en' ? (
                  <div className="space-y-2">
                    <div className="font-japanese text-5xl sm:text-6xl font-bold text-slate-900 tracking-wide">
                      {currentCard.prompt}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      What is the reading and meaning?
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 px-2 leading-snug">
                      {currentCard.english}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      What is the Japanese term & reading?
                    </div>
                  </div>
                )}
              </div>

              {/* Card Bottom: Flip Prompt */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-stone-400 text-xs font-semibold">
                <RotateCw size={13} className="animate-spin-slow" />
                <span>Tap card or press Space to reveal</span>
              </div>
            </div>

            {/* ----------------- CARD BACK ----------------- */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-stone-50 to-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between select-none">
              {/* Top: Category & Audio */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-japan-crimson border border-red-200">
                  {currentCard.categoryTag}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentCard.reading || currentCard.prompt);
                  }}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-japan-crimson transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Pronounce reading (Key: R)"
                >
                  <Volume2 size={15} />
                  <span className="text-[10px]">Play</span>
                </button>
              </div>

              {/* Center: Full Answer Breakdown */}
              <div className="my-auto py-2 space-y-2.5 text-center">
                {/* Japanese Glyph & Furigana */}
                <div>
                  <div className="font-japanese text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                    {currentCard.prompt}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="font-japanese text-sm font-bold text-japan-crimson">
                      {currentCard.reading}
                    </span>
                    {currentCard.romaji && (
                      <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
                        {currentCard.romaji}
                      </span>
                    )}
                  </div>
                </div>

                {/* English Translation */}
                <div className="text-base sm:text-lg font-black text-slate-900 border-t border-b border-stone-100 py-1.5 px-1">
                  {currentCard.english}
                </div>

                {/* Educational Details / Mnemonic / Examples */}
                {currentCard.detail && (
                  <p className="text-[11px] text-slate-600 bg-stone-100/70 p-2 rounded-xl text-left leading-relaxed">
                    💡 <span className="font-medium">{currentCard.detail}</span>
                  </p>
                )}

                {/* Example sentence or word */}
                {currentCard.example && (
                  <div className="text-left bg-blue-50/60 border border-blue-100 p-2 rounded-xl space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-japanese text-xs font-bold text-blue-950">
                        {currentCard.example.japanese}
                      </span>
                      {currentCard.example.reading && (
                        <span className="text-[10px] text-blue-700 font-mono">
                          {currentCard.example.reading}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-blue-800">
                      {currentCard.example.english}
                    </div>
                  </div>
                )}
              </div>

              {/* Back Card Bottom Hint */}
              <div className="text-center text-[10px] text-stone-400 font-medium pt-1">
                Rate your recall below to advance
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3-BUTTON RATING CONTROLS (AGAIN / HARD / EASY) */}
        {/* ================================================================= */}
        <div className="pt-1">
          {!isFlipped ? (
            <button
              type="button"
              onClick={flipCard}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-japan-crimson to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <RotateCw size={16} />
              <span>Show Answer (めくる)</span>
              <span className="text-[10px] opacity-75 font-mono ml-1">[Space]</span>
            </button>
          ) : (
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-2">
                {/* 1. AGAIN (RED) */}
                <button
                  type="button"
                  onClick={() => rateCard('again')}
                  className="py-3 px-2 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-300 text-rose-800 font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 group"
                >
                  <div className="flex items-center gap-1">
                    <RotateCcw size={14} className="text-rose-600 group-hover:rotate-[-45deg] transition-transform" />
                    <span>Again</span>
                  </div>
                  <span className="text-[9px] text-rose-500 font-normal">Repeat card [1]</span>
                </button>

                {/* 2. HARD (AMBER) */}
                <button
                  type="button"
                  onClick={() => rateCard('hard')}
                  className="py-3 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-300 text-amber-900 font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95"
                >
                  <div className="flex items-center gap-1">
                    <AlertCircle size={14} className="text-amber-600" />
                    <span>Hard</span>
                  </div>
                  <span className="text-[9px] text-amber-600 font-normal">Tricky [2]</span>
                </button>

                {/* 3. EASY (EMERALD) */}
                <button
                  type="button"
                  onClick={() => rateCard('easy')}
                  className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border-2 border-emerald-400 text-emerald-900 font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 group"
                >
                  <div className="flex items-center gap-1">
                    <Check size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Easy</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-normal">Mastered [3]</span>
                </button>
              </div>

              <div className="text-center text-[10px] text-slate-400">
                Keyboard shortcuts: <kbd className="px-1 py-0.5 bg-stone-100 rounded text-slate-600 font-mono">1</kbd> Again · <kbd className="px-1 py-0.5 bg-stone-100 rounded text-slate-600 font-mono">2</kbd> Hard · <kbd className="px-1 py-0.5 bg-stone-100 rounded text-slate-600 font-mono">3</kbd> Easy · <kbd className="px-1 py-0.5 bg-stone-100 rounded text-slate-600 font-mono">R</kbd> Sound
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN DECK SELECTION HUB
  // =========================================================================
  const getDeckIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={20} className="text-rose-500" />;
      case 'Flame':
        return <Flame size={20} className="text-amber-500" />;
      case 'BookOpen':
        return <BookOpen size={20} className="text-indigo-500" />;
      case 'Swords':
        return <Swords size={20} className="text-amber-400" />;
      case 'Star':
        return <Star size={20} className="text-purple-500 fill-purple-400" />;
      default:
        return <Sparkles size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in pb-12">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-4 text-white shadow-md border border-purple-500/20">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Sparkles size={14} />
              <span>Active Recall & Spaced Repetition</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Flashcard Studio</span>
              <span className="font-japanese font-normal text-xs text-purple-200">
                (単語帳・フラッシュカード)
              </span>
            </h1>
            <p className="text-[11px] text-slate-300 max-w-sm">
              Train active retrieval from memory. Flip 3D cards, rate your recall, and conquer tricky terms.
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg font-black text-amber-300">
              {progress.totalReviewed}
            </div>
            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
              Reviewed
            </div>
          </div>
        </div>

        {/* Global Quick Preference Toggles */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Mode Switch: JP -> EN or EN -> JP */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setStudyMode('jp_to_en')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                studyMode === 'jp_to_en'
                  ? 'bg-japan-crimson text-white shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🇯🇵 Read (JP → EN)
            </button>
            <button
              type="button"
              onClick={() => setStudyMode('en_to_jp')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                studyMode === 'en_to_jp'
                  ? 'bg-japan-crimson text-white shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🇬🇧 Recall (EN → JP)
            </button>
          </div>

          {/* Quick Audio & Shuffle Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                autoPlayAudio
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:text-stone-200'
              }`}
              title="Auto-play sound when card is flipped"
            >
              <Volume2 size={12} />
              <span>Sound: {autoPlayAudio ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                isShuffle
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:text-stone-200'
              }`}
              title="Shuffle card order"
            >
              <Shuffle size={12} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Session Size Selector Bar */}
      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200/90 shadow-sm text-xs">
        <span className="text-[11px] font-semibold text-slate-500">Session Batch Size:</span>
        <div className="flex items-center gap-1">
          {[10, 20, 50, 0].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setDeckSizeLimit(size)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                deckSizeLimit === size
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {size === 0 ? 'All' : `${size} Cards`}
            </button>
          ))}
        </div>
      </div>

      {/* Available Decks Grid */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Choose a Deck to Study
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FLASHCARD_DECKS_META.map((deck) => {
            const isDark = deck.id === 'yugioh';
            const isTricky = deck.id === 'tricky';
            const trickyCount = progress.trickyIds.length + progress.starredIds.length;

            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => startSession(deck.id, isShuffle, deckSizeLimit)}
                className={`p-3.5 rounded-2xl border transition-all duration-150 active:scale-98 text-left flex flex-col justify-between group shadow-sm bg-gradient-to-br ${deck.themeColor} ${
                  isDark
                    ? 'border-amber-900/40 text-white'
                    : 'border-stone-200/90 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between w-full">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                        isDark ? 'bg-amber-400/20 text-amber-400' : 'bg-white'
                      }`}
                    >
                      {getDeckIcon(deck.iconName)}
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        isTricky && trickyCount > 0
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : deck.badgeColor
                      }`}
                    >
                      {isTricky ? `${trickyCount} Cards` : deck.badge}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div
                      className={`font-japanese text-[10px] font-medium leading-none ${
                        isDark ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {deck.japaneseTitle}
                    </div>
                    <div
                      className={`font-bold text-sm leading-tight mt-1 transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-amber-300'
                          : 'text-slate-900 group-hover:text-japan-crimson'
                      }`}
                    >
                      {deck.title}
                    </div>
                    <div
                      className={`text-[10px] mt-1 line-clamp-2 ${
                        isDark ? 'text-stone-300' : 'text-slate-500'
                      }`}
                    >
                      {deck.description}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/40 flex items-center justify-between text-xs font-bold">
                  <span
                    className={`text-[10px] ${
                      isDark ? 'text-amber-300' : 'text-japan-crimson'
                    }`}
                  >
                    Start Drill
                  </span>
                  <div
                    className={`p-1 rounded-lg transition-transform group-hover:translate-x-0.5 ${
                      isDark ? 'bg-white/10 text-amber-300' : 'bg-stone-100 text-slate-600'
                    }`}
                  >
                    <ChevronRight size={13} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
