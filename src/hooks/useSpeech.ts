import { useState, useEffect, useCallback } from 'react';

export function useSpeech(speed: number = 1.0) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = useCallback(
    (text: string, customRate?: number) => {
      if (!isSupported || typeof window === 'undefined') return;

      try {
        window.speechSynthesis.cancel(); // Stop any pending speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = customRate || speed;

        // Try to select a Japanese voice if available
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(
          (v) => v.lang.includes('ja') || v.lang.includes('JP') || v.name.includes('Japanese')
        );
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        setIsPlaying(false);
      }
    },
    [isSupported, speed]
  );

  return { speak, isPlaying, isSupported };
}
