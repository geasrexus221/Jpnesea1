export type CardType = 'monster' | 'spell' | 'trap';
export type MonsterSubtype = 'normal' | 'effect' | 'fusion' | 'synchro' | 'xyz' | 'link';

export type ClauseType = 'condition' | 'cost_target' | 'resolution' | 'restriction' | 'lore';

export interface ClausePart {
  text: string;
  romaji: string;
  english: string;
  furigana?: string;
  role?: 'particle' | 'keyword' | 'timing' | 'verb' | 'normal';
}

export interface CardClause {
  id: string;
  clauseType: ClauseType;
  label: string;
  japanese: string;
  romaji: string;
  english: string;
  grammarNote: string;
  parts: ClausePart[];
}

export interface GrammarHighlight {
  term: string;
  reading: string;
  meaning: string;
  explanation: string;
}

export interface YugiohCard {
  id: string;
  nameJapanese: string;
  nameReading: string;
  nameEnglish: string;
  cardType: CardType;
  subtype?: MonsterSubtype;
  attribute?: 'LIGHT' | 'DARK' | 'WATER' | 'FIRE' | 'EARTH' | 'WIND';
  typeOrProperty: string; // e.g. "通常魔法", "速攻魔法", "アンデット族 / チューナー / 効果"
  levelOrRank?: number;
  atk?: number;
  def?: number;
  fullJapanese: string;
  englishEffect: string;
  clauses: CardClause[];
  grammarBreakdownHighlights: GrammarHighlight[];
}

export interface YugiohTerm {
  id: string;
  term: string;
  reading: string;
  romaji: string;
  english: string;
  category: 'action' | 'psct' | 'zone' | 'particle';
  description: string;
  cardExample: string;
  exampleMeaning: string;
}

export interface ParsedClause {
  id: string;
  type: ClauseType;
  text: string;
  roleDescription: string;
  particlesFound: string[];
  keywordsFound: string[];
}

export interface ParsedSentence {
  originalText: string;
  clauses: ParsedClause[];
}
