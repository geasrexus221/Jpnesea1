import React, { useState } from 'react';
import { Eye, EyeOff, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { AudioButton } from '../ui/AudioButton';
import { useSpeech } from '../../hooks/useSpeech';

interface SentenceWord {
  surface: string;
  reading: string;
  meaning: string;
  isKanji: boolean;
}

interface GradedSentence {
  id: string;
  japanese: string;
  english: string;
  level: string;
  words: SentenceWord[];
}

const BEGINNER_SENTENCES: GradedSentence[] = [
  {
    id: 's_1',
    japanese: 'わたし は がくせい です。',
    english: 'I am a student.',
    level: 'Absolute Beginner (Hiragana)',
    words: [
      { surface: 'わたし', reading: 'watashi', meaning: 'I / me', isKanji: false },
      { surface: 'は', reading: 'wa', meaning: 'topic marker particle', isKanji: false },
      { surface: 'がくせい', reading: 'gakusei', meaning: 'student', isKanji: false },
      { surface: 'です', reading: 'desu', meaning: 'am / is / are (polite copula)', isKanji: false },
    ],
  },
  {
    id: 's_2',
    japanese: 'みず を のみます。',
    english: 'I drink water.',
    level: 'Absolute Beginner (Hiragana)',
    words: [
      { surface: 'みず', reading: 'mizu', meaning: 'water', isKanji: false },
      { surface: 'を', reading: 'o (wo)', meaning: 'direct object marker particle', isKanji: false },
      { surface: 'のみます', reading: 'nomimasu', meaning: 'to drink (polite)', isKanji: false },
    ],
  },
  {
    id: 's_3',
    japanese: 'これ は にほん の おちゃ です。',
    english: 'This is Japanese green tea.',
    level: 'Beginner (Hiragana)',
    words: [
      { surface: 'これ', reading: 'kore', meaning: 'this (thing near speaker)', isKanji: false },
      { surface: 'は', reading: 'wa', meaning: 'topic particle', isKanji: false },
      { surface: 'にほん', reading: 'nihon', meaning: 'Japan', isKanji: false },
      { surface: 'の', reading: 'no', meaning: 'possessive / modifier particle', isKanji: false },
      { surface: 'おちゃ', reading: 'ocha', meaning: 'green tea', isKanji: false },
      { surface: 'です', reading: 'desu', meaning: 'is', isKanji: false },
    ],
  },
  {
    id: 's_4',
    japanese: '日本 に 行きます。',
    english: 'I am going to Japan.',
    level: 'N5 Kanji Practice',
    words: [
      { surface: '日本', reading: 'にほん (nihon)', meaning: 'Japan', isKanji: true },
      { surface: 'に', reading: 'ni', meaning: 'direction / destination particle', isKanji: false },
      { surface: '行きます', reading: 'いきます (ikimasu)', meaning: 'to go (polite)', isKanji: true },
    ],
  },
  {
    id: 's_5',
    japanese: 'ごはん を たべます。',
    english: 'I eat a meal / rice.',
    level: 'Beginner Sentence',
    words: [
      { surface: 'ごはん', reading: 'gohan', meaning: 'rice / meal', isKanji: false },
      { surface: 'を', reading: 'o', meaning: 'object particle', isKanji: false },
      { surface: 'たべます', reading: 'tabemasu', meaning: 'to eat (polite)', isKanji: false },
    ],
  },
  {
    id: 's_6',
    japanese: '駅 の 出口 は どこ ですか？',
    english: 'Where is the station exit?',
    level: 'N5 Kanji & Signs',
    words: [
      { surface: '駅', reading: 'えき (eki)', meaning: 'train station', isKanji: true },
      { surface: 'の', reading: 'no', meaning: 'possessive particle', isKanji: false },
      { surface: '出口', reading: 'でぐち (deguchi)', meaning: 'exit', isKanji: true },
      { surface: 'は', reading: 'wa', meaning: 'topic marker', isKanji: false },
      { surface: 'どこ', reading: 'doko', meaning: 'where', isKanji: false },
      { surface: 'ですか', reading: 'desu ka', meaning: 'is it? (question particle)', isKanji: false },
    ],
  },
];

export const GradedReader: React.FC = () => {
  const [showFurigana, setShowFurigana] = useState(true);
  const [activeWord, setActiveWord] = useState<SentenceWord | null>(null);
  const { speak } = useSpeech();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header with Furigana Toggle */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-japan-crimson" />
            <span>Graded Sentence Reader</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Read real Japanese sentences. Tap any word to see its reading, grammar role, and definition.
          </p>
        </div>

        {/* Furigana master switch */}
        <button
          type="button"
          onClick={() => setShowFurigana(!showFurigana)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
            showFurigana
              ? 'bg-red-50 text-japan-crimson border-red-200 shadow-sm'
              : 'bg-stone-100 text-slate-600 border-stone-200'
          }`}
        >
          {showFurigana ? <Eye size={16} /> : <EyeOff size={16} />}
          <span>{showFurigana ? 'Furigana: ON' : 'Furigana: HIDDEN'}</span>
        </button>
      </div>

      {/* Sentences List */}
      <div className="space-y-4">
        {BEGINNER_SENTENCES.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Level Tag & Audio Trigger */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-japan-crimson bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Lesson {idx + 1} • {item.level}
              </span>
              <AudioButton text={item.japanese} size="sm" label="Read Sentence" />
            </div>

            {/* Interactive Japanese Sentence Display */}
            <div className="flex flex-wrap items-end gap-x-2.5 gap-y-3 py-2 font-japanese text-2xl sm:text-3xl font-medium text-slate-900">
              {item.words.map((word, wIdx) => {
                const isInspected = activeWord?.surface === word.surface;
                return (
                  <button
                    key={wIdx}
                    type="button"
                    onClick={() => {
                      speak(word.surface);
                      setActiveWord(word);
                    }}
                    className={`inline-flex flex-col items-center group cursor-pointer transition-all rounded-xl px-1.5 py-0.5 ${
                      isInspected
                        ? 'bg-red-100 text-japan-crimson ring-2 ring-red-300'
                        : 'hover:bg-stone-100'
                    }`}
                  >
                    {/* Furigana Reading Aid */}
                    <span
                      className={`text-[12px] font-sans font-normal text-slate-500 transition-opacity ${
                        showFurigana || isInspected ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {word.reading}
                    </span>
                    {/* Japanese Word */}
                    <span className="leading-tight">{word.surface}</span>
                  </button>
                );
              })}
            </div>

            {/* English Meaning */}
            <div className="text-sm text-slate-600 font-sans border-t border-stone-100 pt-3 flex items-center justify-between">
              <span>{item.english}</span>
              <span className="text-xs text-slate-400">Tap word for breakdown</span>
            </div>
          </div>
        ))}
      </div>

      {/* Word Inspector Drawer/Banner */}
      {activeWord && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 max-w-lg mx-auto bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl z-50 flex items-center justify-between gap-4 animate-slide-up border border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-japanese text-2xl font-bold text-white">
                {activeWord.surface}
              </span>
              <span className="text-xs font-medium text-red-300">{activeWord.reading}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-sans">{activeWord.meaning}</p>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton text={activeWord.surface} size="sm" />
            <button
              type="button"
              onClick={() => setActiveWord(null)}
              className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
