import { KanaItem } from '../types';

export const KATAKANA_DATA: KanaItem[] = [
  // A-Row
  {
    id: 'k_a',
    char: 'ア',
    romaji: 'a',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like an axe chopping down wood.',
    strokeCount: 2,
    exampleWord: { japanese: 'アイス', reading: 'aisu', english: 'ice cream' }
  },
  {
    id: 'k_i',
    char: 'イ',
    romaji: 'i',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like an easel for painting.',
    strokeCount: 2,
    exampleWord: { japanese: 'インク', reading: 'inku', english: 'ink' }
  },
  {
    id: 'k_u',
    char: 'ウ',
    romaji: 'u',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like a space probe flying Up into space.',
    strokeCount: 3,
    exampleWord: { japanese: 'ウェブ', reading: 'webu', english: 'web' }
  },
  {
    id: 'k_e',
    char: 'エ',
    romaji: 'e',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like a steel I-beam for an elevator.',
    strokeCount: 3,
    exampleWord: { japanese: 'エアコン', reading: 'eakon', english: 'air conditioner' }
  },
  {
    id: 'k_o',
    char: 'オ',
    romaji: 'o',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'An opera singer performing with one outstretched leg.',
    strokeCount: 3,
    exampleWord: { japanese: 'オレンジ', reading: 'orenji', english: 'orange' }
  },

  // K-Row
  {
    id: 'k_ka',
    char: 'カ',
    romaji: 'ka',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Just like Hiragana か, but sharp and angular.',
    strokeCount: 2,
    exampleWord: { japanese: 'カメラ', reading: 'kamera', english: 'camera' }
  },
  {
    id: 'k_ki',
    char: 'キ',
    romaji: 'ki',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'The top part of a skeleton key.',
    strokeCount: 3,
    exampleWord: { japanese: 'キッチン', reading: 'kicchin', english: 'kitchen' }
  },
  {
    id: 'k_ku',
    char: 'ク',
    romaji: 'ku',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'A chef’s knife cutting a cucumber.',
    strokeCount: 2,
    exampleWord: { japanese: 'クラス', reading: 'kurasu', english: 'class' }
  },
  {
    id: 'k_ke',
    char: 'ケ',
    romaji: 'ke',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Looks like the letter K with the left vertical cut off.',
    strokeCount: 3,
    exampleWord: { japanese: 'ケーキ', reading: 'keeki', english: 'cake' }
  },
  {
    id: 'k_ko',
    char: 'コ',
    romaji: 'ko',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Two sharp corners of a box.',
    strokeCount: 2,
    exampleWord: { japanese: 'コーヒー', reading: 'koohee', english: 'coffee' }
  },

  // S-Row
  {
    id: 'k_sa',
    char: 'サ',
    romaji: 'sa',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'Three sardines swimming together.',
    strokeCount: 3,
    exampleWord: { japanese: 'サラダ', reading: 'sarada', english: 'salad' }
  },
  {
    id: 'k_shi',
    char: 'シ',
    romaji: 'shi',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'She looks up toward the sky (strokes go bottom-to-top).',
    strokeCount: 3,
    exampleWord: { japanese: 'シャツ', reading: 'shatsu', english: 'shirt' }
  },
  {
    id: 'k_su',
    char: 'ス',
    romaji: 'su',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A graceful downhill skier.',
    strokeCount: 2,
    exampleWord: { japanese: 'スポーツ', reading: 'supootsu', english: 'sports' }
  },
  {
    id: 'k_se',
    char: 'セ',
    romaji: 'se',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'Almost identical to Hiragana せ.',
    strokeCount: 2,
    exampleWord: { japanese: 'セーター', reading: 'seetaa', english: 'sweater' }
  },
  {
    id: 'k_so',
    char: 'ソ',
    romaji: 'so',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A seamstress sewing downward (stroke goes top-to-bottom).',
    strokeCount: 2,
    exampleWord: { japanese: 'ソファ', reading: 'sofa', english: 'sofa' }
  },

  // T-Row
  {
    id: 'k_ta',
    char: 'タ',
    romaji: 'ta',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A delicious taco cut in half.',
    strokeCount: 3,
    exampleWord: { japanese: 'タクシー', reading: 'takushii', english: 'taxi' }
  },
  {
    id: 'k_chi',
    char: 'チ',
    romaji: 'chi',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A cheerful cheerleader with her arm up.',
    strokeCount: 3,
    exampleWord: { japanese: 'チーズ', reading: 'chiizu', english: 'cheese' }
  },
  {
    id: 'k_tsu',
    char: 'ツ',
    romaji: 'tsu',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'Two raindrops dripping downward into a puddle (vertical strokes).',
    strokeCount: 3,
    exampleWord: { japanese: 'ツアー', reading: 'tsuaa', english: 'tour' }
  },
  {
    id: 'k_te',
    char: 'テ',
    romaji: 'te',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A telephone pole antenna.',
    strokeCount: 3,
    exampleWord: { japanese: 'テレビ', reading: 'terebi', english: 'television' }
  },
  {
    id: 'k_to',
    char: 'ト',
    romaji: 'to',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A totem pole with a branch sticking out.',
    strokeCount: 2,
    exampleWord: { japanese: 'トイレ', reading: 'toire', english: 'toilet / restroom' }
  },

  // N-Row
  {
    id: 'k_na',
    char: 'ナ',
    romaji: 'na',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A sharp katana blade.',
    strokeCount: 2,
    exampleWord: { japanese: 'ナイフ', reading: 'naifu', english: 'knife' }
  },
  {
    id: 'k_ni',
    char: 'ニ',
    romaji: 'ni',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'Two needles placed horizontally (also the kanji for two 二).',
    strokeCount: 2,
    exampleWord: { japanese: 'ニュース', reading: 'nyuusu', english: 'news' }
  },
  {
    id: 'k_nu',
    char: 'ヌ',
    romaji: 'nu',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'Two chopsticks picking up noodles.',
    strokeCount: 2,
    exampleWord: { japanese: 'ヌードル', reading: 'nuudoru', english: 'noodle' }
  },
  {
    id: 'k_ne',
    char: 'ネ',
    romaji: 'ne',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A necktie hanging on a hanger.',
    strokeCount: 4,
    exampleWord: { japanese: 'ネット', reading: 'netto', english: 'internet' }
  },
  {
    id: 'k_no',
    char: 'ノ',
    romaji: 'no',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A long slope: "NO sledding down!"',
    strokeCount: 1,
    exampleWord: { japanese: 'ノート', reading: 'nooto', english: 'notebook' }
  },

  // H-Row
  {
    id: 'k_ha',
    char: 'ハ',
    romaji: 'ha',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'Two sides of a straw hut.',
    strokeCount: 2,
    exampleWord: { japanese: 'ハンバーガー', reading: 'hanbaagaa', english: 'hamburger' }
  },
  {
    id: 'k_hi',
    char: 'ヒ',
    romaji: 'hi',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'He is sitting down with his knee pointed up.',
    strokeCount: 2,
    exampleWord: { japanese: 'ヒーロー', reading: 'hiiroo', english: 'hero' }
  },
  {
    id: 'k_fu',
    char: 'フ',
    romaji: 'fu',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'An owl’s flag flying in the wind.',
    strokeCount: 1,
    exampleWord: { japanese: 'フォーク', reading: 'fooku', english: 'fork' }
  },
  {
    id: 'k_he',
    char: 'ヘ',
    romaji: 'he',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'Identical to Hiragana へ.',
    strokeCount: 1,
    exampleWord: { japanese: 'ヘリコプター', reading: 'herikoputaa', english: 'helicopter' }
  },
  {
    id: 'k_ho',
    char: 'ホ',
    romaji: 'ho',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'A holy cross with two candles.',
    strokeCount: 4,
    exampleWord: { japanese: 'ホテル', reading: 'hoteru', english: 'hotel' }
  },

  // M-Row
  {
    id: 'k_ma',
    char: 'マ',
    romaji: 'ma',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A martini glass silhouette.',
    strokeCount: 2,
    exampleWord: { japanese: 'マスク', reading: 'masuku', english: 'mask' }
  },
  {
    id: 'k_mi',
    char: 'ミ',
    romaji: 'mi',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'Three music lines or three missiles.',
    strokeCount: 3,
    exampleWord: { japanese: 'ミルク', reading: 'miruku', english: 'milk' }
  },
  {
    id: 'k_mu',
    char: 'ム',
    romaji: 'mu',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A pyramid shaped like a cow’s snout: "Moo!"',
    strokeCount: 2,
    exampleWord: { japanese: 'ムービー', reading: 'muubii', english: 'movie' }
  },
  {
    id: 'k_me',
    char: 'メ',
    romaji: 'me',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A metallic sword slashing an X.',
    strokeCount: 2,
    exampleWord: { japanese: 'メニュー', reading: 'menyuu', english: 'menu' }
  },
  {
    id: 'k_mo',
    char: 'モ',
    romaji: 'mo',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'Looks like Hiragana も with straight modern lines.',
    strokeCount: 3,
    exampleWord: { japanese: 'モデル', reading: 'moderu', english: 'model' }
  },

  // Y-Row
  {
    id: 'k_ya',
    char: 'ヤ',
    romaji: 'ya',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'Identical to Hiragana や, streamlined.',
    strokeCount: 2,
    exampleWord: { japanese: 'ヤング', reading: 'yangu', english: 'young' }
  },
  {
    id: 'k_yu',
    char: 'ユ',
    romaji: 'yu',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'Looks like the number 1 fishhook for YOU.',
    strokeCount: 2,
    exampleWord: { japanese: 'ユニフォーム', reading: 'yunifoomu', english: 'uniform' }
  },
  {
    id: 'k_yo',
    char: 'ヨ',
    romaji: 'yo',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'A toy robot yoga pose.',
    strokeCount: 3,
    exampleWord: { japanese: 'ヨーグルト', reading: 'yooguruto', english: 'yogurt' }
  },

  // R-Row
  {
    id: 'k_ra',
    char: 'ラ',
    romaji: 'ra',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A raptor running with its jaw open.',
    strokeCount: 2,
    exampleWord: { japanese: 'ラジオ', reading: 'rajio', english: 'radio' }
  },
  {
    id: 'k_ri',
    char: 'リ',
    romaji: 'ri',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'Almost identical to Hiragana り.',
    strokeCount: 2,
    exampleWord: { japanese: 'リーダー', reading: 'riidaa', english: 'leader' }
  },
  {
    id: 'k_ru',
    char: 'ル',
    romaji: 'ru',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'Two legs sprinting: "Run running!"',
    strokeCount: 2,
    exampleWord: { japanese: 'ルール', reading: 'ruuru', english: 'rule' }
  },
  {
    id: 'k_re',
    char: 'レ',
    romaji: 're',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A red checkmark.',
    strokeCount: 1,
    exampleWord: { japanese: 'レストラン', reading: 'resutoran', english: 'restaurant' }
  },
  {
    id: 'k_ro',
    char: 'ロ',
    romaji: 'ro',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A square cardboard box: "A square road sign".',
    strokeCount: 3,
    exampleWord: { japanese: 'ロボット', reading: 'robotto', english: 'robot' }
  },

  // W-Row & N
  {
    id: 'k_wa',
    char: 'ワ',
    romaji: 'wa',
    type: 'gojuon',
    row: 'wa',
    mnemonic: 'A wine glass silhouette.',
    strokeCount: 2,
    exampleWord: { japanese: 'ワイン', reading: 'wain', english: 'wine' }
  },
  {
    id: 'k_wo',
    char: 'ヲ',
    romaji: 'wo',
    type: 'gojuon',
    row: 'wa',
    mnemonic: 'A dog barking "Woof!" over a hurdle.',
    strokeCount: 3,
    exampleWord: { japanese: 'ヲタク', reading: 'wotaku', english: 'otaku' }
  },
  {
    id: 'k_n',
    char: 'ン',
    romaji: 'n',
    type: 'gojuon',
    row: 'n',
    mnemonic: 'One eye winking horizontally (stroke goes up-to-right).',
    strokeCount: 2,
    exampleWord: { japanese: 'パン', reading: 'pan', english: 'bread' }
  }
];
