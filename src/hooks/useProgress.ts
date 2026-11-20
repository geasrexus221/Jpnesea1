import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'nihongo_reading_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  charMastery: {},
  streakDays: 1,
  lastStudiedDate: null,
  romajiVisible: true,
  speechSpeed: 1.0,
  autoPlayAudio: true,
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Mark a lesson as completed & update streak
  const completeLesson = (lessonId: string) => {
    const today = new Date().toISOString().split('T')[0];

    setProgress((prev) => {
      let newStreak = prev.streakDays;
      if (prev.lastStudiedDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (prev.lastStudiedDate === yesterday) {
          newStreak += 1;
        } else if (!prev.lastStudiedDate) {
          newStreak = 1;
        }
      }

      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];

      return {
        ...prev,
        completedLessons: completed,
        streakDays: newStreak,
        lastStudiedDate: today,
      };
    });
  };

  // Update mastery for a specific character (level 0 to 5)
  const updateMastery = (charId: string, delta: number) => {
    setProgress((prev) => {
      const current = prev.charMastery[charId] || 0;
      const nextLevel = Math.max(0, Math.min(5, current + delta));
      return {
        ...prev,
        charMastery: {
          ...prev.charMastery,
          [charId]: nextLevel,
        },
      };
    });
  };

  const toggleRomaji = () => {
    setProgress((prev) => ({ ...prev, romajiVisible: !prev.romajiVisible }));
  };

  const setSpeechSpeed = (speed: number) => {
    setProgress((prev) => ({ ...prev, speechSpeed: speed }));
  };

  const toggleAutoPlay = () => {
    setProgress((prev) => ({ ...prev, autoPlayAudio: !prev.autoPlayAudio }));
  };

  // Export progress as JSON string
  const exportProgress = () => {
    return JSON.stringify(progress, null, 2);
  };

  // Import progress from JSON string
  const importProgress = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON', e);
    }
    return false;
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return {
    progress,
    completeLesson,
    updateMastery,
    toggleRomaji,
    setSpeechSpeed,
    toggleAutoPlay,
    exportProgress,
    importProgress,
    resetProgress,
  };
}
