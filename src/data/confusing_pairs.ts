import { ConfusingPair } from '../types';

export const CONFUSING_PAIRS: ConfusingPair[] = [
  // Hiragana
  {
    id: 'pair_sa_chi',
    charA: 'さ',
    charB: 'ち',
    romajiA: 'sa',
    romajiB: 'chi',
    stage: 'hiragana',
    tip: 'さ (sa) points toward the right (like a samurai sword). ち (chi) loops to the left with a big belly (like a cheerleader).'
  },
  {
    id: 'pair_re_ne_wa',
    charA: 'れ',
    charB: 'ね',
    stage: 'hiragana',
    romajiA: 're',
    romajiB: 'ne',
    tip: 'ね (ne) curls into a cat’s tail loop at the end. れ (re) flares open backward like a person resting back.'
  },
  {
    id: 'pair_ne_wa',
    charA: 'ね',
    charB: 'わ',
    stage: 'hiragana',
    romajiA: 'ne',
    romajiB: 'wa',
    tip: 'わ (wa) has a clean curved back with NO loop. ね (ne) has the little curled knot at the bottom.'
  },
  {
    id: 'pair_ro_ru',
    charA: 'ろ',
    charB: 'る',
    stage: 'hiragana',
    romajiA: 'ro',
    romajiB: 'ru',
    tip: 'る (ru) rolls up a ruby pearl inside its loop. ろ (ro) had its pearl stolen by a robber (empty loop)!'
  },
  {
    id: 'pair_ha_ho',
    charA: 'は',
    charB: 'ほ',
    stage: 'hiragana',
    romajiA: 'ha',
    romajiB: 'ho',
    tip: 'ほ (ho) wears a sun hat (top stroke covers the vertical line). は (ha) has no hat; the vertical line sticks out.'
  },

  // Katakana
  {
    id: 'pair_shi_tsu',
    charA: 'シ',
    charB: 'ツ',
    stage: 'katakana',
    romajiA: 'shi',
    romajiB: 'tsu',
    tip: 'シ (shi): The two dots are stacked vertically, and the long stroke swoops upward from bottom to top. ツ (tsu): The two dots are side-by-side, and the long stroke drops downward like rain.'
  },
  {
    id: 'pair_so_n',
    charA: 'ソ',
    charB: 'ン',
    stage: 'katakana',
    romajiA: 'so',
    romajiB: 'n',
    tip: 'ン (n): Stroke sweeps from bottom-left to top-right. ソ (so): Stroke drops from top-right to bottom-left.'
  },
  {
    id: 'pair_ku_wa',
    charA: 'ク',
    charB: 'ワ',
    stage: 'katakana',
    romajiA: 'ku',
    romajiB: 'wa',
    tip: 'ク (ku) has its top stroke cross completely to the left. ワ (wa) has an isolated left vertical peg with the top line resting on it.'
  }
];
