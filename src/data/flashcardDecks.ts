import { FlashcardItem, FlashcardDeckId, FlashcardDeckInfo } from '../types/flashcard';
import { HIRAGANA_DATA } from './hiragana';
import { KATAKANA_DATA } from './katakana';
import { KANJI_N5_DATA } from './kanji_n5';
import { YUGIOH_TERMS } from './yugioh_terms';

export const FLASHCARD_DECKS_META: FlashcardDeckInfo[] = [
  {
    id: 'hiragana',
    title: 'Hiragana Deck',
    japaneseTitle: 'ひらがな 単語帳',
    description: '46 Gojuon + Dakuten & Handakuten with mnemonics',
    badge: '71 Cards',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconName: 'Sparkles',
    themeColor: 'from-rose-50/50 to-white hover:border-rose-300',
  },
  {
    id: 'katakana',
    title: 'Katakana Deck',
    japaneseTitle: 'カタカナ 単語帳',
    description: 'Foreign loanwords & angular phonetic alphabet',
    badge: '71 Cards',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconName: 'Flame',
    themeColor: 'from-amber-50/50 to-white hover:border-amber-300',
  },
  {
    id: 'kanji_n5',
    title: 'N5 Kanji & Vocab',
    japaneseTitle: '漢字 N5 単語帳',
    description: 'Core JLPT N5 kanji with Onyomi, Kunyomi & compounds',
    badge: '40+ Kanji',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconName: 'BookOpen',
    themeColor: 'from-indigo-50/50 to-white hover:border-indigo-300',
  },
  {
    id: 'yugioh',
    title: 'Duelist OCG Vocab',
    japaneseTitle: '遊戯王 決闘語彙',
    description: 'Official card game terminology, PSCT verbs & rulings',
    badge: '60+ Terms',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconName: 'Swords',
    themeColor: 'from-stone-900/90 to-stone-950 text-white hover:border-amber-500',
  },
  {
    id: 'tricky',
    title: 'Tricky & Starred',
    japaneseTitle: '復習ノート (苦手克服)',
    description: 'Cards you marked as Again / Hard or bookmarked for review',
    badge: 'SRS Review',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconName: 'Star',
    themeColor: 'from-purple-50/50 to-white hover:border-purple-300',
  },
];

// 1. Transform Hiragana
const hiraganaCards: FlashcardItem[] = HIRAGANA_DATA.map((h) => ({
  id: `fc_${h.id}`,
  deckId: 'hiragana',
  prompt: h.char,
  reading: h.char,
  romaji: h.romaji,
  english: `${h.romaji.toUpperCase()} (sound)`,
  categoryTag: h.type === 'gojuon' ? '五十音 (Basic)' : h.type === 'dakuten' ? '濁点 (Dakuten)' : '半濁点 (Handakuten)',
  detail: h.mnemonic,
  example: {
    japanese: h.exampleWord.japanese,
    reading: h.exampleWord.reading,
    english: h.exampleWord.english,
  },
}));

// 2. Transform Katakana
const katakanaCards: FlashcardItem[] = KATAKANA_DATA.map((k) => ({
  id: `fc_${k.id}`,
  deckId: 'katakana',
  prompt: k.char,
  reading: k.char,
  romaji: k.romaji,
  english: `${k.romaji.toUpperCase()} (sound)`,
  categoryTag: k.type === 'gojuon' ? '五十音 (Basic)' : k.type === 'dakuten' ? '濁点 (Dakuten)' : '半濁点 (Handakuten)',
  detail: k.mnemonic,
  example: {
    japanese: k.exampleWord.japanese,
    reading: k.exampleWord.reading,
    english: k.exampleWord.english,
  },
}));

// 3. Transform Kanji N5
const kanjiCards: FlashcardItem[] = KANJI_N5_DATA.map((kj) => {
  const on = kj.onyomi.join(', ');
  const kun = kj.kunyomi.join(', ');
  const detailParts: string[] = [];
  if (on) detailParts.push(`音読み (On): ${on}`);
  if (kun) detailParts.push(`訓読み (Kun): ${kun}`);
  if (kj.radicals) detailParts.push(`部首 (Radical): ${kj.radicals}`);
  if (kj.strokeCount) detailParts.push(`画数 (Strokes): ${kj.strokeCount}`);

  const primaryExample = kj.examples && kj.examples.length > 0 ? kj.examples[0] : undefined;

  return {
    id: `fc_${kj.id}`,
    deckId: 'kanji_n5',
    prompt: kj.kanji,
    reading: kj.onyomi[0] || kj.kunyomi[0] || kj.kanji,
    romaji: kj.meanings[0] || '',
    english: kj.meanings.join(', '),
    categoryTag: `Kanji ${kj.level || 'N5'}`,
    detail: detailParts.join(' | '),
    example: primaryExample
      ? {
          japanese: primaryExample.word,
          reading: primaryExample.reading,
          english: primaryExample.meaning,
        }
      : undefined,
  };
});

// 4. Transform Yu-Gi-Oh Terms
const yugiohCards: FlashcardItem[] = YUGIOH_TERMS.map((term) => {
  const categoryLabels: Record<string, string> = {
    particle: '助詞 (Particle)',
    action: '処理動詞 (Action Verb)',
    psct: '構文規則 (PSCT Ruling)',
    zone: '場所 (Zone)',
    mechanic: '特殊召喚 (Mechanic)',
    type: '種族 (Monster Type)',
    attribute: '属性 (Attribute)',
    property: '魔法・罠分類 (Property)',
    combat: '戦闘・値 (Combat & Stat)',
  };

  return {
    id: `fc_${term.id}`,
    deckId: 'yugioh',
    prompt: term.term,
    reading: term.reading,
    romaji: term.romaji,
    english: term.english,
    categoryTag: categoryLabels[term.category] || term.category,
    detail: term.description,
    example: term.cardExample
      ? {
          japanese: term.cardExample,
          reading: term.reading,
          english: term.exampleMeaning || '',
        }
      : undefined,
  };
});

// Master lookup
export const ALL_FLASHCARDS: FlashcardItem[] = [
  ...hiraganaCards,
  ...katakanaCards,
  ...kanjiCards,
  ...yugiohCards,
];

export const FLASHCARDS_BY_DECK: Record<Exclude<FlashcardDeckId, 'tricky'>, FlashcardItem[]> = {
  hiragana: hiraganaCards,
  katakana: katakanaCards,
  kanji_n5: kanjiCards,
  yugioh: yugiohCards,
};

export function getDeckCards(
  deckId: FlashcardDeckId,
  trickyIds: string[],
  starredIds: string[]
): FlashcardItem[] {
  if (deckId === 'tricky') {
    const combinedSet = new Set([...trickyIds, ...starredIds]);
    const matched = ALL_FLASHCARDS.filter((c) => combinedSet.has(c.id));
    // If tricky pool is empty, provide a small introductory sample
    if (matched.length === 0) {
      return ALL_FLASHCARDS.slice(0, 10);
    }
    return matched;
  }
  return FLASHCARDS_BY_DECK[deckId] || [];
}
