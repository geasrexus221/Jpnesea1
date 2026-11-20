export type StageType = 'hiragana' | 'katakana' | 'kanji' | 'reader' | 'confusing';

export interface ExampleWord {
  japanese: string;
  reading: string;
  english: string;
}

export interface KanaItem {
  id: string;
  char: string;
  romaji: string;
  type: 'gojuon' | 'dakuten' | 'handakuten' | 'yoon';
  row: string; // 'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'
  mnemonic: string;
  strokeCount: number;
  exampleWord: ExampleWord;
}

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface KanjiItem {
  id: string;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
  radicals: string;
  examples: KanjiExample[];
  level: 'N5';
}

export interface SignBreakdown {
  word: string;
  reading: string;
  meaning: string;
}

export interface SignItem {
  id: string;
  signJapanese: string;
  signReading: string;
  signEnglish: string;
  category: 'station' | 'street' | 'shop' | 'vending';
  bgTheme: string;
  description: string;
  breakdown: SignBreakdown[];
}

export interface ConfusingPair {
  id: string;
  charA: string;
  charB: string;
  romajiA: string;
  romajiB: string;
  stage: 'hiragana' | 'katakana';
  tip: string;
}

export interface Lesson {
  id: string;
  stage: StageType;
  title: string;
  subtitle: string;
  description: string;
  characterIds: string[];
  unlockedByDefault?: boolean;
}

export interface UserProgress {
  completedLessons: string[];
  charMastery: Record<string, number>; // character id -> mastery level (0 to 5)
  streakDays: number;
  lastStudiedDate: string | null;
  romajiVisible: boolean;
  speechSpeed: number; // 0.75 or 1.0
  autoPlayAudio: boolean;
}
