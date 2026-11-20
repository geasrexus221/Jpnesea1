export type FlashcardDeckId = 'hiragana' | 'katakana' | 'kanji_n5' | 'yugioh' | 'tricky';

export type FlashcardRating = 'again' | 'hard' | 'easy';

export type FlashcardStudyMode = 'jp_to_en' | 'en_to_jp';

export interface FlashcardItem {
  id: string;
  deckId: 'hiragana' | 'katakana' | 'kanji_n5' | 'yugioh';
  prompt: string;         // e.g. "あ", "水", "墓地へ送る"
  reading: string;        // e.g. "あ", "みず", "ぼちへおくる"
  romaji: string;         // e.g. "a", "mizu", "bochi e okuru"
  english: string;        // e.g. "Ah (sound)", "Water", "Send to the GY"
  categoryTag: string;    // e.g. "Gojuon", "Nature / N5", "Action / PSCT"
  detail?: string;        // Mnemonic, Radical/Strokes, or PSCT rule
  example?: {
    japanese: string;
    reading?: string;
    english: string;
  };
}

export interface FlashcardDeckInfo {
  id: FlashcardDeckId;
  title: string;
  japaneseTitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  themeColor: string;
}

export interface FlashcardProgress {
  masteredIds: string[];
  trickyIds: string[];
  starredIds: string[];
  totalReviewed: number;
}
