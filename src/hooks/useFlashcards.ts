import { useState, useEffect, useCallback } from 'react';
import {
  FlashcardItem,
  FlashcardDeckId,
  FlashcardRating,
  FlashcardStudyMode,
  FlashcardProgress,
} from '../types/flashcard';
import { getDeckCards, ALL_FLASHCARDS } from '../data/flashcardDecks';

const FLASHCARD_STORAGE_KEY = 'nihongo_flashcards_progress_v1';

const DEFAULT_PROGRESS: FlashcardProgress = {
  masteredIds: [],
  trickyIds: [],
  starredIds: [],
  totalReviewed: 0,
};

export function useFlashcards() {
  const [progress, setProgress] = useState<FlashcardProgress>(() => {
    try {
      const saved = localStorage.getItem(FLASHCARD_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load flashcard progress', e);
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save flashcard progress', e);
    }
  }, [progress]);

  // Session State
  const [activeDeckId, setActiveDeckId] = useState<FlashcardDeckId | null>(null);
  const [sessionCards, setSessionCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<FlashcardStudyMode>('jp_to_en');
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Session Ratings Breakdown
  const [sessionStats, setSessionStats] = useState({
    easy: 0,
    hard: 0,
    again: 0,
  });

  // Start a new session for a deck
  const startSession = useCallback(
    (deckId: FlashcardDeckId, shuffle: boolean = true, limit?: number) => {
      let cards = getDeckCards(deckId, progress.trickyIds, progress.starredIds);

      if (shuffle) {
        cards = [...cards].sort(() => Math.random() - 0.5);
      }
      if (limit && limit > 0) {
        cards = cards.slice(0, limit);
      }

      setActiveDeckId(deckId);
      setSessionCards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      setSessionStats({ easy: 0, hard: 0, again: 0 });
    },
    [progress.trickyIds, progress.starredIds]
  );

  // Toggle star/bookmark on a card
  const toggleStar = useCallback((cardId: string) => {
    setProgress((prev) => {
      const isStarred = prev.starredIds.includes(cardId);
      return {
        ...prev,
        starredIds: isStarred
          ? prev.starredIds.filter((id) => id !== cardId)
          : [...prev.starredIds, cardId],
      };
    });
  }, []);

  // Handle 3-Button Rating (Again / Hard / Easy)
  const rateCard = useCallback(
    (rating: FlashcardRating) => {
      if (sessionCards.length === 0 || currentIndex >= sessionCards.length) return;

      const currentCard = sessionCards[currentIndex];

      // Update session statistics
      setSessionStats((prev) => ({
        ...prev,
        [rating]: prev[rating] + 1,
      }));

      // Update persistent progress
      setProgress((prev) => {
        let newMastered = [...prev.masteredIds];
        let newTricky = [...prev.trickyIds];

        if (rating === 'easy') {
          if (!newMastered.includes(currentCard.id)) {
            newMastered.push(currentCard.id);
          }
          // Remove from tricky if mastered easily
          newTricky = newTricky.filter((id) => id !== currentCard.id);
        } else if (rating === 'again' || rating === 'hard') {
          if (!newTricky.includes(currentCard.id)) {
            newTricky.push(currentCard.id);
          }
        }

        return {
          ...prev,
          masteredIds: newMastered,
          trickyIds: newTricky,
          totalReviewed: prev.totalReviewed + 1,
        };
      });

      // Active Queue Logic:
      // If "again", append this card to the end of the current session queue!
      let updatedCards = [...sessionCards];
      if (rating === 'again') {
        updatedCards.push(currentCard);
        setSessionCards(updatedCards);
      }

      // Advance to next card
      if (currentIndex + 1 < updatedCards.length) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setSessionCompleted(true);
      }
    },
    [sessionCards, currentIndex]
  );

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const exitSession = useCallback(() => {
    setActiveDeckId(null);
    setSessionCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, []);

  const currentCard = sessionCards[currentIndex] || null;

  return {
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
  };
}
