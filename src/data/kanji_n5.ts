import { KanjiItem } from '../types';

export const KANJI_N5_DATA: KanjiItem[] = [
  // Numbers
  {
    id: 'kj_ichi',
    kanji: '一',
    meanings: ['one'],
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと', 'ひと.つ'],
    strokeCount: 1,
    radicals: '一',
    level: 'N5',
    examples: [
      { word: '一つ', reading: 'ひとつ', meaning: 'one (thing)' },
      { word: '一人', reading: 'ひとり', meaning: 'one person / alone' },
      { word: '一日', reading: 'ついたち', meaning: 'first day of the month' }
    ]
  },
  {
    id: 'kj_ni',
    kanji: '二',
    meanings: ['two'],
    onyomi: ['ニ'],
    kunyomi: ['ふた', 'ふた.つ'],
    strokeCount: 2,
    radicals: '二',
    level: 'N5',
    examples: [
      { word: '二つ', reading: 'ふたつ', meaning: 'two (things)' },
      { word: '二人', reading: 'ふたり', meaning: 'two people' },
      { word: '二月', reading: 'にがつ', meaning: 'February' }
    ]
  },
  {
    id: 'kj_san',
    kanji: '三',
    meanings: ['three'],
    onyomi: ['サン'],
    kunyomi: ['み', 'み.つ', 'みっ.つ'],
    strokeCount: 3,
    radicals: '一',
    level: 'N5',
    examples: [
      { word: '三つ', reading: 'みっつ', meaning: 'three (things)' },
      { word: '三人', reading: 'さんにん', meaning: 'three people' },
      { word: '三月', reading: 'さんがつ', meaning: 'March' }
    ]
  },
  {
    id: 'kj_yon',
    kanji: '四',
    meanings: ['four'],
    onyomi: ['シ'],
    kunyomi: ['よ', 'よ.つ', 'よっ.つ', 'よん'],
    strokeCount: 5,
    radicals: '囗',
    level: 'N5',
    examples: [
      { word: '四つ', reading: 'よっつ', meaning: 'four (things)' },
      { word: '四人', reading: 'よにん', meaning: 'four people' },
      { word: '四季', reading: 'しき', meaning: 'four seasons' }
    ]
  },
  {
    id: 'kj_go',
    kanji: '五',
    meanings: ['five'],
    onyomi: ['ゴ'],
    kunyomi: ['いつ', 'いつ.つ'],
    strokeCount: 4,
    radicals: '二',
    level: 'N5',
    examples: [
      { word: '五つ', reading: 'いつつ', meaning: 'five (things)' },
      { word: '五月', reading: 'ごがつ', meaning: 'May' }
    ]
  },

  // Time & Nature
  {
    id: 'kj_nichi',
    kanji: '日',
    meanings: ['day', 'sun', 'Japan'],
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    strokeCount: 4,
    radicals: '日',
    level: 'N5',
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Japan' },
      { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' },
      { word: '毎日', reading: 'まいにち', meaning: 'every day' }
    ]
  },
  {
    id: 'kj_getsu',
    kanji: '月',
    meanings: ['month', 'moon'],
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    strokeCount: 4,
    radicals: '月',
    level: 'N5',
    examples: [
      { word: '月曜日', reading: 'げつようび', meaning: 'Monday' },
      { word: '今月', reading: 'こんげつ', meaning: 'this month' },
      { word: '月', reading: 'つき', meaning: 'moon' }
    ]
  },
  {
    id: 'kj_mizu',
    kanji: '水',
    meanings: ['water'],
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    strokeCount: 4,
    radicals: '水',
    level: 'N5',
    examples: [
      { word: '水', reading: 'みず', meaning: 'water' },
      { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' },
      { word: '水泳', reading: 'すいえい', meaning: 'swimming' }
    ]
  },
  {
    id: 'kj_hi',
    kanji: '火',
    meanings: ['fire'],
    onyomi: ['カ'],
    kunyomi: ['ひ', '-び'],
    strokeCount: 4,
    radicals: '火',
    level: 'N5',
    examples: [
      { word: '火', reading: 'ひ', meaning: 'fire' },
      { word: '火曜日', reading: 'かようび', meaning: 'Tuesday' },
      { word: '花火', reading: 'はなび', meaning: 'fireworks' }
    ]
  },
  {
    id: 'kj_ki',
    kanji: '木',
    meanings: ['tree', 'wood'],
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ-'],
    strokeCount: 4,
    radicals: '木',
    level: 'N5',
    examples: [
      { word: '木', reading: 'き', meaning: 'tree' },
      { word: '木曜日', reading: 'もくようび', meaning: 'Thursday' }
    ]
  },

  // People & Relations
  {
    id: 'kj_hito',
    kanji: '人',
    meanings: ['person'],
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    strokeCount: 2,
    radicals: '人',
    level: 'N5',
    examples: [
      { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
      { word: 'この人', reading: 'このひと', meaning: 'this person' },
      { word: '大人', reading: 'おとな', meaning: 'adult' }
    ]
  },
  {
    id: 'kj_otoko',
    kanji: '男',
    meanings: ['male', 'man'],
    onyomi: ['ダン', 'ナン'],
    kunyomi: ['おとこ', 'お'],
    strokeCount: 7,
    radicals: '田',
    level: 'N5',
    examples: [
      { word: '男の人', reading: 'おとこのひと', meaning: 'man' },
      { word: '男の子', reading: 'おとこのこ', meaning: 'boy' }
    ]
  },
  {
    id: 'kj_onna',
    kanji: '女',
    meanings: ['female', 'woman'],
    onyomi: ['ジョ', 'ニョ'],
    kunyomi: ['おんな', 'め'],
    strokeCount: 3,
    radicals: '女',
    level: 'N5',
    examples: [
      { word: '女の人', reading: 'おんなのひと', meaning: 'woman' },
      { word: '女の子', reading: 'おんなのこ', meaning: 'girl' }
    ]
  },

  // Places & Directions
  {
    id: 'kj_ue',
    kanji: '上',
    meanings: ['above', 'up'],
    onyomi: ['ジョウ'],
    kunyomi: ['うえ', 'あ.がる', 'のぼ.る'],
    strokeCount: 3,
    radicals: '一',
    level: 'N5',
    examples: [
      { word: 'テーブルの上', reading: 'テーブルのうえ', meaning: 'on top of the table' },
      { word: '上手', reading: 'じょうず', meaning: 'skillful' }
    ]
  },
  {
    id: 'kj_shita',
    kanji: '下',
    meanings: ['below', 'down'],
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'さ.がる', 'くだ.る'],
    strokeCount: 3,
    radicals: '一',
    level: 'N5',
    examples: [
      { word: '下', reading: 'した', meaning: 'below / under' },
      { word: '下手', reading: 'へた', meaning: 'clumsy / unskillful' },
      { word: '地下鉄', reading: 'ちかてつ', meaning: 'subway' }
    ]
  },
  {
    id: 'kj_migi',
    kanji: '右',
    meanings: ['right'],
    onyomi: ['ウ', 'ユウ'],
    kunyomi: ['みぎ'],
    strokeCount: 5,
    radicals: '口',
    level: 'N5',
    examples: [
      { word: '右', reading: 'みぎ', meaning: 'right' },
      { word: '右手', reading: 'みぎて', meaning: 'right hand' }
    ]
  },
  {
    id: 'kj_hidari',
    kanji: '左',
    meanings: ['left'],
    onyomi: ['サ'],
    kunyomi: ['ひだり'],
    strokeCount: 5,
    radicals: '工',
    level: 'N5',
    examples: [
      { word: '左', reading: 'ひだり', meaning: 'left' },
      { word: '左手', reading: 'ひだりて', meaning: 'left hand' }
    ]
  },

  // Basic Verbs
  {
    id: 'kj_iku',
    kanji: '行',
    meanings: ['go', 'conduct'],
    onyomi: ['コウ', 'ギョウ'],
    kunyomi: ['い.く', 'ゆ.く', 'おこな.う'],
    strokeCount: 6,
    radicals: '行',
    level: 'N5',
    examples: [
      { word: '行く', reading: 'いく', meaning: 'to go' },
      { word: '銀行', reading: 'ぎんこう', meaning: 'bank' }
    ]
  },
  {
    id: 'kj_kuru',
    kanji: '来',
    meanings: ['come', 'next'],
    onyomi: ['ライ'],
    kunyomi: ['く.る', 'き.たる'],
    strokeCount: 7,
    radicals: '木',
    level: 'N5',
    examples: [
      { word: '来る', reading: 'くる', meaning: 'to come' },
      { word: '来年', reading: 'らいねん', meaning: 'next year' },
      { word: '来週', reading: 'らいしゅう', meaning: 'next week' }
    ]
  },
  {
    id: 'kj_miru',
    kanji: '見',
    meanings: ['see', 'look'],
    onyomi: ['ケン'],
    kunyomi: ['み.る', 'み.える', 'み.せる'],
    strokeCount: 7,
    radicals: '見',
    level: 'N5',
    examples: [
      { word: '見る', reading: 'みる', meaning: 'to see / watch' },
      { word: '見せる', reading: 'みせる', meaning: 'to show' },
      { word: '意見', reading: 'いけん', meaning: 'opinion' }
    ]
  },
  {
    id: 'kj_taberu',
    kanji: '食',
    meanings: ['eat', 'food'],
    onyomi: ['ショク'],
    kunyomi: ['た.べる', 'く.う'],
    strokeCount: 9,
    radicals: '食',
    level: 'N5',
    examples: [
      { word: '食べる', reading: 'たべる', meaning: 'to eat' },
      { word: '食事', reading: 'しょくじ', meaning: 'meal' },
      { word: '食堂', reading: 'しょくどう', meaning: 'cafeteria / dining hall' }
    ]
  },
  {
    id: 'kj_nomu',
    kanji: '飲',
    meanings: ['drink'],
    onyomi: ['イン'],
    kunyomi: ['の.む'],
    strokeCount: 12,
    radicals: '食',
    level: 'N5',
    examples: [
      { word: '飲む', reading: 'のむ', meaning: 'to drink' },
      { word: '飲み物', reading: 'のみもの', meaning: 'beverage / drink' }
    ]
  }
];
