import { KanaItem } from '../types';

export const HIRAGANA_DATA: KanaItem[] = [
  // A-Row (Vowels)
  {
    id: 'h_a',
    char: 'あ',
    romaji: 'a',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like an apple with a stem on top.',
    strokeCount: 3,
    exampleWord: { japanese: 'あさ', reading: 'asa', english: 'morning' }
  },
  {
    id: 'h_i',
    char: 'い',
    romaji: 'i',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like two eel fish swimming side by side.',
    strokeCount: 2,
    exampleWord: { japanese: 'いぬ', reading: 'inu', english: 'dog' }
  },
  {
    id: 'h_u',
    char: 'う',
    romaji: 'u',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like someone getting punched in the gut: "OOF!"',
    strokeCount: 2,
    exampleWord: { japanese: 'うみ', reading: 'umi', english: 'sea / ocean' }
  },
  {
    id: 'h_e',
    char: 'え',
    romaji: 'e',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like an exotic energetic bird running fast.',
    strokeCount: 2,
    exampleWord: { japanese: 'えき', reading: 'eki', english: 'station' }
  },
  {
    id: 'h_o',
    char: 'お',
    romaji: 'o',
    type: 'gojuon',
    row: 'a',
    mnemonic: 'Looks like a golfer shouting "FORE!" after a swing.',
    strokeCount: 3,
    exampleWord: { japanese: 'おちゃ', reading: 'ocha', english: 'green tea' }
  },

  // K-Row
  {
    id: 'h_ka',
    char: 'か',
    romaji: 'ka',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Looks like a kite flying with a gust of wind.',
    strokeCount: 3,
    exampleWord: { japanese: 'かさ', reading: 'kasa', english: 'umbrella' }
  },
  {
    id: 'h_ki',
    char: 'き',
    romaji: 'ki',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Looks like a classic brass key.',
    strokeCount: 4,
    exampleWord: { japanese: 'き', reading: 'ki', english: 'tree' }
  },
  {
    id: 'h_ku',
    char: 'く',
    romaji: 'ku',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Looks like a bird’s open cuckoo beak: "KU-KU!"',
    strokeCount: 1,
    exampleWord: { japanese: 'くるま', reading: 'kuruma', english: 'car' }
  },
  {
    id: 'h_ke',
    char: 'け',
    romaji: 'ke',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Looks like the upright side of a wooden keg.',
    strokeCount: 3,
    exampleWord: { japanese: 'けさ', reading: 'kesa', english: 'this morning' }
  },
  {
    id: 'h_ko',
    char: 'こ',
    romaji: 'ko',
    type: 'gojuon',
    row: 'ka',
    mnemonic: 'Two swimming koi fish facing each other.',
    strokeCount: 2,
    exampleWord: { japanese: 'こども', reading: 'kodomo', english: 'child' }
  },

  // S-Row
  {
    id: 'h_sa',
    char: 'さ',
    romaji: 'sa',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A samurai raising his wooden training sword.',
    strokeCount: 3,
    exampleWord: { japanese: 'さくら', reading: 'sakura', english: 'cherry blossom' }
  },
  {
    id: 'h_shi',
    char: 'し',
    romaji: 'shi',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A fishing hook dipped into the sea (shi).',
    strokeCount: 1,
    exampleWord: { japanese: 'しろ', reading: 'shiro', english: 'white' }
  },
  {
    id: 'h_su',
    char: 'す',
    romaji: 'su',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A spiral straw slurping delicious soup.',
    strokeCount: 2,
    exampleWord: { japanese: 'すし', reading: 'sushi', english: 'sushi' }
  },
  {
    id: 'h_se',
    char: 'せ',
    romaji: 'se',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A sunset horizon over two peaceful hills.',
    strokeCount: 3,
    exampleWord: { japanese: 'せんせい', reading: 'sensei', english: 'teacher' }
  },
  {
    id: 'h_so',
    char: 'そ',
    romaji: 'so',
    type: 'gojuon',
    row: 'sa',
    mnemonic: 'A zigzag sewing needle stitch.',
    strokeCount: 1,
    exampleWord: { japanese: 'そら', reading: 'sora', english: 'sky' }
  },

  // T-Row
  {
    id: 'h_ta',
    char: 'た',
    romaji: 'ta',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'Spells out English "ta" combined together.',
    strokeCount: 4,
    exampleWord: { japanese: 'たべる', reading: 'taberu', english: 'to eat' }
  },
  {
    id: 'h_chi',
    char: 'ち',
    romaji: 'chi',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A cheerleader waving her pom-pom.',
    strokeCount: 2,
    exampleWord: { japanese: 'ちず', reading: 'chizu', english: 'map' }
  },
  {
    id: 'h_tsu',
    char: 'つ',
    romaji: 'tsu',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A gigantic tsunami wave curling over.',
    strokeCount: 1,
    exampleWord: { japanese: 'つき', reading: 'tsuki', english: 'moon' }
  },
  {
    id: 'h_te',
    char: 'て',
    romaji: 'te',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A dog wagging its curved tail.',
    strokeCount: 1,
    exampleWord: { japanese: 'て', reading: 'te', english: 'hand' }
  },
  {
    id: 'h_to',
    char: 'と',
    romaji: 'to',
    type: 'gojuon',
    row: 'ta',
    mnemonic: 'A splinter sticking right into a big toe.',
    strokeCount: 2,
    exampleWord: { japanese: 'ともだち', reading: 'tomodachi', english: 'friend' }
  },

  // N-Row
  {
    id: 'h_na',
    char: 'な',
    romaji: 'na',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A nun kneeling and praying before a cross.',
    strokeCount: 4,
    exampleWord: { japanese: 'なつ', reading: 'natsu', english: 'summer' }
  },
  {
    id: 'h_ni',
    char: 'に',
    romaji: 'ni',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A needle piercing through two threads.',
    strokeCount: 3,
    exampleWord: { japanese: 'にほん', reading: 'nihon', english: 'Japan' }
  },
  {
    id: 'h_nu',
    char: 'ぬ',
    romaji: 'nu',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'Chopsticks curling up delicious noodles with a loop.',
    strokeCount: 2,
    exampleWord: { japanese: 'いぬ', reading: 'inu', english: 'dog' }
  },
  {
    id: 'h_ne',
    char: 'ね',
    romaji: 'ne',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A cat (neko) curled up with its curly tail.',
    strokeCount: 2,
    exampleWord: { japanese: 'ねこ', reading: 'neko', english: 'cat' }
  },
  {
    id: 'h_no',
    char: 'の',
    romaji: 'no',
    type: 'gojuon',
    row: 'na',
    mnemonic: 'A "NO ENTER" circular traffic sign.',
    strokeCount: 1,
    exampleWord: { japanese: 'のみもの', reading: 'nomimono', english: 'beverage / drink' }
  },

  // H-Row
  {
    id: 'h_ha',
    char: 'は',
    romaji: 'ha',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'A hockey stick next to a player laughing: "Ha ha!"',
    strokeCount: 3,
    exampleWord: { japanese: 'はな', reading: 'hana', english: 'flower / nose' }
  },
  {
    id: 'h_hi',
    char: 'ひ',
    romaji: 'hi',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'He is smiling wide with a happy face: "Hi!"',
    strokeCount: 1,
    exampleWord: { japanese: 'ひと', reading: 'hito', english: 'person' }
  },
  {
    id: 'h_fu',
    char: 'ふ',
    romaji: 'fu',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'Mount Fuji standing proud with flying birds.',
    strokeCount: 4,
    exampleWord: { japanese: 'ふね', reading: 'fune', english: 'boat / ship' }
  },
  {
    id: 'h_he',
    char: 'へ',
    romaji: 'he',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'Pointing up to Mount Everest: "Head up the hill!"',
    strokeCount: 1,
    exampleWord: { japanese: 'へや', reading: 'heya', english: 'room' }
  },
  {
    id: 'h_ho',
    char: 'ほ',
    romaji: 'ho',
    type: 'gojuon',
    row: 'ha',
    mnemonic: 'A hot horse wearing a sun hat.',
    strokeCount: 4,
    exampleWord: { japanese: 'ほん', reading: 'hon', english: 'book' }
  },

  // M-Row
  {
    id: 'h_ma',
    char: 'ま',
    romaji: 'ma',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A magic mast on a ship.',
    strokeCount: 3,
    exampleWord: { japanese: 'まち', reading: 'machi', english: 'town / city' }
  },
  {
    id: 'h_mi',
    char: 'み',
    romaji: 'mi',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'Looks like the number 21 (lucky twenty-one for me).',
    strokeCount: 2,
    exampleWord: { japanese: 'みず', reading: 'mizu', english: 'water' }
  },
  {
    id: 'h_mu',
    char: 'む',
    romaji: 'mu',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A cow with horns saying "Muuu!"',
    strokeCount: 3,
    exampleWord: { japanese: 'むし', reading: 'mushi', english: 'insect / bug' }
  },
  {
    id: 'h_me',
    char: 'め',
    romaji: 'me',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'An eye (me) with an eyebrow.',
    strokeCount: 2,
    exampleWord: { japanese: 'め', reading: 'me', english: 'eye' }
  },
  {
    id: 'h_mo',
    char: 'も',
    romaji: 'mo',
    type: 'gojuon',
    row: 'ma',
    mnemonic: 'A fish hook catching more and more worms.',
    strokeCount: 3,
    exampleWord: { japanese: 'もり', reading: 'mori', english: 'forest' }
  },

  // Y-Row
  {
    id: 'h_ya',
    char: 'や',
    romaji: 'ya',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'A yak with long fluffy horns.',
    strokeCount: 3,
    exampleWord: { japanese: 'やま', reading: 'yama', english: 'mountain' }
  },
  {
    id: 'h_yu',
    char: 'ゆ',
    romaji: 'yu',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'A hot tub releasing soothing steam (yu = hot water).',
    strokeCount: 2,
    exampleWord: { japanese: 'ゆき', reading: 'yuki', english: 'snow' }
  },
  {
    id: 'h_yo',
    char: 'よ',
    romaji: 'yo',
    type: 'gojuon',
    row: 'ya',
    mnemonic: 'A toy yo-yo hanging from a finger.',
    strokeCount: 2,
    exampleWord: { japanese: 'よる', reading: 'yoru', english: 'night' }
  },

  // R-Row
  {
    id: 'h_ra',
    char: 'ら',
    romaji: 'ra',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A rabbit sitting upright on its hind legs.',
    strokeCount: 2,
    exampleWord: { japanese: 'らいしゅう', reading: 'raishuu', english: 'next week' }
  },
  {
    id: 'h_ri',
    char: 'り',
    romaji: 'ri',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'Two reeds swaying by the riverbank.',
    strokeCount: 2,
    exampleWord: { japanese: 'りんご', reading: 'ringo', english: 'apple' }
  },
  {
    id: 'h_ru',
    char: 'る',
    romaji: 'ru',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A roller loop with a shiny pearl inside.',
    strokeCount: 1,
    exampleWord: { japanese: 'るす', reading: 'rusu', english: 'away from home' }
  },
  {
    id: 'h_re',
    char: 'れ',
    romaji: 're',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A person resting against an armchair.',
    strokeCount: 2,
    exampleWord: { japanese: 'れきし', reading: 'rekishi', english: 'history' }
  },
  {
    id: 'h_ro',
    char: 'ろ',
    romaji: 'ro',
    type: 'gojuon',
    row: 'ra',
    mnemonic: 'A robber stole the pearl from the loop!',
    strokeCount: 1,
    exampleWord: { japanese: 'ろうそく', reading: 'rousoku', english: 'candle' }
  },

  // W-Row & N
  {
    id: 'h_wa',
    char: 'わ',
    romaji: 'wa',
    type: 'gojuon',
    row: 'wa',
    mnemonic: 'A swan flapping its graceful wings: "WA!"',
    strokeCount: 2,
    exampleWord: { japanese: 'わたし', reading: 'watashi', english: 'I / me' }
  },
  {
    id: 'h_wo',
    char: 'を',
    romaji: 'wo',
    type: 'gojuon',
    row: 'wa',
    mnemonic: 'An Olympic cheerleader jumping with excitement.',
    strokeCount: 3,
    exampleWord: { japanese: 'みずをのむ', reading: 'mizu o nomu', english: 'drink water' }
  },
  {
    id: 'h_n',
    char: 'ん',
    romaji: 'n',
    type: 'gojuon',
    row: 'n',
    mnemonic: 'Looks like the lowercase cursive English "n".',
    strokeCount: 1,
    exampleWord: { japanese: 'にほん', reading: 'nihon', english: 'Japan' }
  },

  // Dakuten (G, Z, D, B)
  { id: 'h_ga', char: 'が', romaji: 'ga', type: 'dakuten', row: 'ga', mnemonic: 'Ka with two little voiced marks.', strokeCount: 5, exampleWord: { japanese: 'がっこう', reading: 'gakkou', english: 'school' } },
  { id: 'h_gi', char: 'ぎ', romaji: 'gi', type: 'dakuten', row: 'ga', mnemonic: 'Ki voiced with ten-ten.', strokeCount: 6, exampleWord: { japanese: 'ぎんこう', reading: 'ginkou', english: 'bank' } },
  { id: 'h_gu', char: 'ぐ', romaji: 'gu', type: 'dakuten', row: 'ga', mnemonic: 'Ku voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'ぐあい', reading: 'guai', english: 'condition' } },
  { id: 'h_ge', char: 'げ', romaji: 'ge', type: 'dakuten', row: 'ga', mnemonic: 'Ke voiced with ten-ten.', strokeCount: 5, exampleWord: { japanese: 'げんき', reading: 'genki', english: 'energetic' } },
  { id: 'h_go', char: 'ご', romaji: 'go', type: 'dakuten', row: 'ga', mnemonic: 'Ko voiced with ten-ten.', strokeCount: 4, exampleWord: { japanese: 'ごはん', reading: 'gohan', english: 'rice / meal' } },

  { id: 'h_za', char: 'ざ', romaji: 'za', type: 'dakuten', row: 'za', mnemonic: 'Sa voiced with ten-ten.', strokeCount: 5, exampleWord: { japanese: 'ざっし', reading: 'zasshi', english: 'magazine' } },
  { id: 'h_ji', char: 'じ', romaji: 'ji', type: 'dakuten', row: 'za', mnemonic: 'Shi voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'じかん', reading: 'jikan', english: 'time' } },
  { id: 'h_zu', char: 'ず', romaji: 'zu', type: 'dakuten', row: 'za', mnemonic: 'Su voiced with ten-ten.', strokeCount: 4, exampleWord: { japanese: 'ちず', reading: 'chizu', english: 'map' } },
  { id: 'h_ze', char: 'ぜ', romaji: 'ze', type: 'dakuten', row: 'za', mnemonic: 'Se voiced with ten-ten.', strokeCount: 5, exampleWord: { japanese: 'ぜんぶ', reading: 'zenbu', english: 'everything' } },
  { id: 'h_zo', char: 'ぞ', romaji: 'zo', type: 'dakuten', row: 'za', mnemonic: 'So voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'かぞく', reading: 'kazoku', english: 'family' } },

  { id: 'h_da', char: 'だ', romaji: 'da', type: 'dakuten', row: 'da', mnemonic: 'Ta voiced with ten-ten.', strokeCount: 6, exampleWord: { japanese: 'だいがく', reading: 'daigaku', english: 'university' } },
  { id: 'h_dji', char: 'ぢ', romaji: 'ji', type: 'dakuten', row: 'da', mnemonic: 'Chi voiced with ten-ten.', strokeCount: 4, exampleWord: { japanese: 'はなぢ', reading: 'hanaji', english: 'nosebleed' } },
  { id: 'h_dzu', char: 'づ', romaji: 'zu', type: 'dakuten', row: 'da', mnemonic: 'Tsu voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'つづく', reading: 'tsuzuku', english: 'to continue' } },
  { id: 'h_de', char: 'で', romaji: 'de', type: 'dakuten', row: 'da', mnemonic: 'Te voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'でんしゃ', reading: 'densha', english: 'train' } },
  { id: 'h_do', char: 'ど', romaji: 'do', type: 'dakuten', row: 'da', mnemonic: 'To voiced with ten-ten.', strokeCount: 4, exampleWord: { japanese: 'どこ', reading: 'doko', english: 'where' } },

  { id: 'h_ba', char: 'ば', romaji: 'ba', type: 'dakuten', row: 'ba', mnemonic: 'Ha voiced with ten-ten.', strokeCount: 5, exampleWord: { japanese: 'ばんごう', reading: 'bangou', english: 'number' } },
  { id: 'h_bi', char: 'び', romaji: 'bi', type: 'dakuten', row: 'ba', mnemonic: 'Hi voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'びょういん', reading: 'byouin', english: 'hospital' } },
  { id: 'h_bu', char: 'ぶ', romaji: 'bu', type: 'dakuten', row: 'ba', mnemonic: 'Fu voiced with ten-ten.', strokeCount: 6, exampleWord: { japanese: 'ぶんか', reading: 'bunka', english: 'culture' } },
  { id: 'h_be', char: 'べ', romaji: 'be', type: 'dakuten', row: 'ba', mnemonic: 'He voiced with ten-ten.', strokeCount: 3, exampleWord: { japanese: 'べんきょう', reading: 'benkyou', english: 'study' } },
  { id: 'h_bo', char: 'ぼ', romaji: 'bo', type: 'dakuten', row: 'ba', mnemonic: 'Ho voiced with ten-ten.', strokeCount: 6, exampleWord: { japanese: 'ぼうし', reading: 'boushi', english: 'hat' } },

  // Handakuten (P)
  { id: 'h_pa', char: 'ぱ', romaji: 'pa', type: 'handakuten', row: 'pa', mnemonic: 'Ha with a little pop circle.', strokeCount: 4, exampleWord: { japanese: 'パン', reading: 'pan', english: 'bread' } },
  { id: 'h_pi', char: 'ぴ', romaji: 'pi', type: 'handakuten', row: 'pa', mnemonic: 'Hi with a little pop circle.', strokeCount: 2, exampleWord: { japanese: 'ぴかぴか', reading: 'pikapika', english: 'sparkling' } },
  { id: 'h_pu', char: 'ぷ', romaji: 'pu', type: 'handakuten', row: 'pa', mnemonic: 'Fu with a little pop circle.', strokeCount: 5, exampleWord: { japanese: 'ぷるぷる', reading: 'purupuru', english: 'jiggly' } },
  { id: 'h_pe', char: 'ぺ', romaji: 'pe', type: 'handakuten', row: 'pa', mnemonic: 'He with a little pop circle.', strokeCount: 2, exampleWord: { japanese: 'ぺこぺこ', reading: 'pekopeko', english: 'hungry' } },
  { id: 'h_po', char: 'ぽ', romaji: 'po', type: 'handakuten', row: 'pa', mnemonic: 'Ho with a little pop circle.', strokeCount: 5, exampleWord: { japanese: 'ぽかぽか', reading: 'pokapoka', english: 'warm and pleasant' } }
];
