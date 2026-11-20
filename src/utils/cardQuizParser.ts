import { kanaToRomaji } from './particleSplitter';

export type TokenType = 'hiragana' | 'katakana' | 'kanji' | 'symbol';

export interface QuizToken {
  id: string;
  char: string; // The character or compound (e.g. 'こ', 'の', 'カ', 'ド', '名')
  romaji: string; // Correct romaji reading (e.g. 'ko', 'no', 'ka', 'do', 'mei')
  furigana?: string; // Furigana shown above if kanji (e.g. 'めい')
  type: TokenType;
  isPunctuation?: boolean; // Punctuation/symbols auto-skipped in quiz
}

// Common Kanji Readings Map for Card Texts
const KANJI_QUIZ_MAP: Record<string, { furigana: string; romaji: string }> = {
  名: { furigana: 'めい', romaji: 'mei' },
  効: { furigana: 'こう', romaji: 'kō' },
  果: { furigana: 'か', romaji: 'ka' },
  度: { furigana: 'ど', romaji: 'do' },
  使: { furigana: 'し', romaji: 'shi' },
  用: { furigana: 'よう', romaji: 'yō' },
  発: { furigana: 'はつ', romaji: 'hatsu' },
  動: { furigana: 'どう', romaji: 'dō' },
  対: { furigana: 'たい', romaji: 'tai' },
  自: { furigana: 'じ', romaji: 'ji' },
  分: { furigana: 'ぶん', romaji: 'bun' },
  通: { furigana: 'つう', romaji: 'tsū' },
  常: { furigana: 'じょう', romaji: 'jō' },
  罠: { furigana: 'わな', romaji: 'wana' },
  魔: { furigana: 'ま', romaji: 'ma' },
  法: { furigana: 'ほう', romaji: 'hō' },
  相: { furigana: 'あい', romaji: 'ai' },
  手: { furigana: 'て', romaji: 'te' },
  札: { furigana: 'ふだ', romaji: 'fuda' },
  墓: { furigana: 'ぼ', romaji: 'bo' },
  地: { furigana: 'ち', romaji: 'chi' },
  象: { furigana: 'しょう', romaji: 'shō' },
  破: { furigana: 'は', romaji: 'ha' },
  壊: { furigana: 'かい', romaji: 'kai' },
  除: { furigana: 'じょ', romaji: 'jo' },
  外: { furigana: 'がい', romaji: 'gai' },
  無: { furigana: 'む', romaji: 'mu' },
  特: { furigana: 'とく', romaji: 'toku' },
  殊: { furigana: 'しゅ', romaji: 'shu' },
  召: { furigana: 'しょう', romaji: 'shō' },
  喚: { furigana: 'かん', romaji: 'kan' },
  表: { furigana: 'ひょう', romaji: 'hyō' },
  示: { furigana: 'じ', romaji: 'ji' },
  裏: { furigana: 'うら', romaji: 'ura' },
  側: { furigana: 'がわ', romaji: 'gawa' },
  守: { furigana: 'しゅ', romaji: 'shu' },
  備: { furigana: 'び', romaji: 'bi' },
  攻: { furigana: 'こう', romaji: 'kō' },
  撃: { furigana: 'げき', romaji: 'geki' },
  力: { furigana: 'りょく', romaji: 'ryoku' },
  送: { furigana: 'おく', romaji: 'oku' },
  捨: { furigana: 'す', romaji: 'su' },
  戻: { furigana: 'もど', romaji: 'modo' },
  離: { furigana: 'はな', romaji: 'hana' },
  場: { furigana: 'ば', romaji: 'ba' },
  合: { furigana: 'あい', romaji: 'ai' },
  時: { furigana: 'とき', romaji: 'toki' },
  選: { furigana: 'えら', romaji: 'era' },
  見: { furigana: 'み', romaji: 'mi' },
  払: { furigana: 'はら', romaji: 'hara' },
  他: { furigana: 'ほか', romaji: 'hoka' },
  事: { furigana: 'こと', romaji: 'koto' },
  数: { furigana: 'かず', romaji: 'kazu' },
  上: { furigana: 'うえ', romaji: 'ue' },
  中: { furigana: 'なか', romaji: 'naka' },
  同: { furigana: 'どう', romaji: 'dō' },
  種: { furigana: 'しゅ', romaji: 'shu' },
  類: { furigana: 'るい', romaji: 'rui' },
  最: { furigana: 'さい', romaji: 'sai' },
  大: { furigana: 'だい', romaji: 'dai' },
  適: { furigana: 'てき', romaji: 'teki' },
  存: { furigana: 'そん', romaji: 'son' },
  在: { furigana: 'ざい', romaji: 'zai' },
  密: { furigana: 'みっ', romaji: 'mīk' },
  告: { furigana: 'こく', romaji: 'koku' },
  躯: { furigana: 'むくろ', romaji: 'mukuro' },
  売: { furigana: 'う', romaji: 'u' },
  白: { furigana: 'しろ', romaji: 'shiro' },
  銀: { furigana: 'がね', romaji: 'gane' },
  城: { furigana: 'しろ', romaji: 'shiro' },
  悪: { furigana: 'あく', romaji: 'aku' },
  族: { furigana: 'ぞく', romaji: 'zoku' },
  属: { furigana: 'ぞく', romaji: 'zoku' },
  性: { furigana: 'せい', romaji: 'sei' },
  水: { furigana: 'みず', romaji: 'mizu' },
  炎: { furigana: 'ほのお', romaji: 'honō' },
  風: { furigana: 'かぜ', romaji: 'kaze' },
  光: { furigana: 'ひかり', romaji: 'hikari' },
  闇: { furigana: 'やみ', romaji: 'yami' },
  神: { furigana: 'かみ', romaji: 'kami' },
  死: { furigana: 'し', romaji: 'shi' },
  者: { furigana: 'しゃ', romaji: 'sha' },
  蘇: { furigana: 'そ', romaji: 'so' },
  生: { furigana: 'せい', romaji: 'sei' },
  強: { furigana: 'ごう', romaji: 'gō' },
  欲: { furigana: 'よく', romaji: 'yoku' },
  壺: { furigana: 'つぼ', romaji: 'tsubo' },
  雷: { furigana: 'いかずち', romaji: 'ikazuchi' },
  灰: { furigana: 'はい', romaji: 'hai' },
  流: { furigana: 'りゅ', romaji: 'ryu' },
  青: { furigana: 'あお', romaji: 'ao' },
  眼: { furigana: 'がん', romaji: 'gan' },
  龍: { furigana: 'りゅう', romaji: 'ryū' },
  原: { furigana: 'げん', romaji: 'gen' },
  始: { furigana: 'し', romaji: 'shi' },
  命: { furigana: 'めい', romaji: 'mei' },
  態: { furigana: 'たい', romaji: 'tai' },
  霆: { furigana: 'てい', romaji: 'tei' },
  號: { furigana: 'ごう', romaji: 'gō' },
  聖: { furigana: 'せい', romaji: 'sei' },
  縛: { furigana: 'ばく', romaji: 'baku' },
  穴: { furigana: 'あな', romaji: 'ana' },
  指: { furigana: 'し', romaji: 'shi' },
  定: { furigana: 'めい', romaji: 'mei' },
  冥: { furigana: 'めい', romaji: 'mei' },
  王: { furigana: 'おう', romaji: 'ō' },
  結: { furigana: 'けっ', romaji: 'kē' },
  界: { furigana: 'かい', romaji: 'kai' },
  波: { furigana: 'は', romaji: 'ha' },
  持: { furigana: 'も', romaji: 'mo' },
  主: { furigana: 'ぬし', romaji: 'nushi' },
  含: { furigana: 'ふく', romaji: 'fuku' },
  重: { furigana: 'かさ', romaji: 'kasa' },
  取: { furigana: 'と', romaji: 'to' },
  確: { furigana: 'かく', romaji: 'kaku' },
  認: { furigana: 'にん', romaji: 'nin' },
  変: { furigana: 'へん', romaji: 'hen' },
  更: { furigana: 'こう', romaji: 'kō' },
  回: { furigana: 'かい', romaji: 'kai' },
  復: { furigana: 'ふく', romaji: 'fuku' },
  与: { furigana: 'あた', romaji: 'ata' },
  得: { furigana: 'え', romaji: 'e' },
  受: { furigana: 'う', romaji: 'u' },
  以: { furigana: 'い', romaji: 'i' },
  限: { furigana: 'かぎ', romaji: 'kagi' },
};

// Check character sets
export function getCharType(ch: string): TokenType {
  if (/^[\u3040-\u309f]$/.test(ch)) return 'hiragana';
  if (/^[\u30a0-\u30ffー]$/.test(ch)) return 'katakana';
  if (/^[\u4e00-\u9faf]$/.test(ch)) return 'kanji';
  return 'symbol';
}

// Convert sentence into quiz tokens
export function parseCardTextToQuizTokens(text: string): QuizToken[] {
  const tokens: QuizToken[] = [];
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const type = getCharType(ch);

    // 1. Punctuation, symbols, numbers (auto-skipped in quiz)
    if (type === 'symbol' || /[0-9０-９①②③④⑤●◆★・：:；;。、「」（）()++\-\s]/.test(ch)) {
      tokens.push({
        id: `t_${i}`,
        char: ch,
        romaji: ch,
        type: 'symbol',
        isPunctuation: true,
      });
      i++;
      continue;
    }

    // 2. Kanji
    if (type === 'kanji') {
      const info = KANJI_QUIZ_MAP[ch];
      const furigana = info ? info.furigana : 'かんじ';
      const romaji = info ? info.romaji : kanaToRomaji(furigana);

      tokens.push({
        id: `t_${i}`,
        char: ch,
        romaji,
        furigana,
        type: 'kanji',
      });
      i++;
      continue;
    }

    // 3. Hiragana
    if (type === 'hiragana') {
      // Check for digraph (small ya, yu, yo, a, i, u, e, o)
      const next = text[i + 1] || '';
      if (/^[ゃゅょぁぃぅぇぉ]$/.test(next)) {
        const digraph = ch + next;
        const romaji = kanaToRomaji(digraph);
        tokens.push({
          id: `t_${i}`,
          char: digraph,
          romaji,
          type: 'hiragana',
        });
        i += 2;
        continue;
      }

      // Standalone particle 'は' pronounced 'wa'
      let romaji = kanaToRomaji(ch);
      if (ch === 'は') {
        const prev = text[i - 1] || '';
        const nxt = text[i + 1] || '';
        // If surrounded by word boundaries or punctuation, it's particle 'wa'
        if (/[たドス果てれどるいうん]/.test(prev) && /[\s、。そま相相手こ発]/.test(nxt)) {
          romaji = 'wa';
        }
      }

      tokens.push({
        id: `t_${i}`,
        char: ch,
        romaji,
        type: 'hiragana',
      });
      i++;
      continue;
    }

    // 4. Katakana
    if (type === 'katakana') {
      const next = text[i + 1] || '';
      // Check for Katakana digraph (e.g. ティ, シェ, チュ, ヴァ)
      if (/^[ァィゥェォャュョ]$/.test(next)) {
        const digraph = ch + next;
        const romaji = kanaToRomaji(digraph);
        tokens.push({
          id: `t_${i}`,
          char: digraph,
          romaji,
          type: 'katakana',
        });
        i += 2;
        continue;
      }

      // Check if followed by long vowel 'ー' (e.g. カー, ター)
      if (next === 'ー') {
        const combo = ch + next;
        const romaji = kanaToRomaji(combo);
        tokens.push({
          id: `t_${i}`,
          char: combo,
          romaji,
          type: 'katakana',
        });
        i += 2;
        continue;
      }

      const romaji = kanaToRomaji(ch);
      tokens.push({
        id: `t_${i}`,
        char: ch,
        romaji,
        type: 'katakana',
      });
      i++;
      continue;
    }

    // Default fallback
    tokens.push({
      id: `t_${i}`,
      char: ch,
      romaji: ch,
      type: 'symbol',
      isPunctuation: true,
    });
    i++;
  }

  return tokens;
}

// ============================================================================
// DYNAMIC DISTRACTOR GENERATOR (Produces 6 Distinct Options with Identical Letter Count)
// ============================================================================
const CANDIDATES_BY_LENGTH: Record<number, string[]> = {
  1: ['a', 'i', 'u', 'e', 'o', 'n'],
  2: [
    'ka', 'ki', 'ku', 'ke', 'ko',
    'sa', 'su', 'se', 'so',
    'ta', 'te', 'to',
    'na', 'ni', 'nu', 'ne', 'no',
    'ha', 'hi', 'fu', 'he', 'ho',
    'ma', 'mi', 'mu', 'me', 'mo',
    'ya', 'yu', 'yo',
    'ra', 'ri', 'ru', 're', 'ro',
    'wa', 'wo',
    'ga', 'gi', 'gu', 'ge', 'go',
    'za', 'ji', 'zu', 'ze', 'zo',
    'da', 'de', 'do',
    'ba', 'bi', 'bu', 'be', 'bo',
    'pa', 'pi', 'pu', 'pe', 'po',
    'kō', 'dō', 'tō', 'sō', 'hō', 'mō', 'rō', 'gō', 'zō', 'bō', 'pō',
    'kā', 'tā', 'sā', 'hā', 'mā', 'rā', 'gā', 'dā', 'bā', 'pā',
    'yū', 'fū', 'jū', 'rū', 'chū', 'shū', 'ryū', 'kyū', 'gyū', 'byū', 'pyū',
  ],
  3: [
    'shi', 'chi', 'tsu',
    'kya', 'kyu', 'kyo',
    'sha', 'shu', 'sho',
    'cha', 'chu', 'cho',
    'nya', 'nyu', 'nyo',
    'hya', 'hyu', 'hyo',
    'mya', 'myu', 'myo',
    'rya', 'ryu', 'ryo',
    'gya', 'gyu', 'gyo',
    'bya', 'byu', 'byo',
    'pya', 'pyu', 'pyo',
    'mei', 'kai', 'tai', 'sai', 'dai', 'bai', 'pai', 'mai', 'rai', 'gai', 'zai',
    'kan', 'san', 'dan', 'ban', 'pan', 'man', 'ran', 'gan', 'zan', 'nan', 'tan', 'han',
    'sen', 'ken', 'gen', 'den', 'ben', 'pen', 'men', 'ren', 'zen',
    'kin', 'gin', 'rin', 'min', 'nin', 'bin', 'pin',
    'hon', 'mon', 'ron', 'gon', 'bon', 'pon', 'son', 'ton', 'don', 'non', 'kon',
    'kun', 'bun', 'pun', 'gun', 'jun', 'sun',
    'tān', 'rān',
  ],
  4: [
    'fuda', 'wana', 'mahō', 'teki', 'kami', 'kaze', 'mizu', 'yami', 'zoku',
    'toku', 'koku', 'haku', 'geki', 'hoka', 'koto', 'kazu', 'demo', 'dake',
    'kara', 'made', 'sono', 'kono', 'shiki', 'akai', 'aoi', 'kuro',
    'shiro', 'hana', 'nami', 'sora', 'yama', 'kawa', 'mori', 'tomo', 'naka',
    'ryok', 'suto', 'kura', 'shur',
  ],
  5: [
    'hatsu', 'shiyō', 'hakai', 'jogai', 'mukō', 'bochi', 'dekki', 'aite',
    'jibun', 'furī', 'setto', 'tōkun', 'dorō', 'sute', 'modos', 'tsūjō',
    'hikari', 'ryūko',
  ],
  6: [
    'shōkan', 'tefuda', 'rirīsu', 'funsai', 'sonzai', 'taishō', 'henkō',
    'kaifuk', 'ataeru', 'kōgeki', 'shubir',
  ],
};

export function generateDistractors(correctRomaji: string): string[] {
  const targetLen = correctRomaji.length;
  const pool = (CANDIDATES_BY_LENGTH[targetLen] || []).filter((r) => r !== correctRomaji);
  const distractors = new Set<string>();

  // 1. Prioritize candidates that share ending vowel or letter
  if (pool.length > 0) {
    const lastChar = correctRomaji.slice(-1);
    const sameVowel = pool.filter((r) => r.endsWith(lastChar));
    for (const item of sameVowel) {
      if (distractors.size >= 3) break;
      distractors.add(item);
    }

    // 2. Prioritize candidates that share starting consonant
    if (correctRomaji.length >= 2) {
      const firstChar = correctRomaji[0];
      const sameConsonant = pool.filter((r) => r.startsWith(firstChar));
      for (const item of sameConsonant) {
        if (distractors.size >= 4) break;
        distractors.add(item);
      }
    }

    // 3. Fill remaining from the exact same length pool
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    for (const item of shuffledPool) {
      if (distractors.size >= 5) break;
      distractors.add(item);
    }
  }

  // Fallback for rare lengths: generate synthetic candidates of identical length
  let fallbackCounter = 0;
  const vowels = ['a', 'i', 'u', 'e', 'o'];
  const consonants = ['k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p'];

  while (distractors.size < 5 && fallbackCounter < 20) {
    fallbackCounter++;
    // Mutate a letter in correctRomaji while preserving exact length
    const chars = correctRomaji.split('');
    const mutateIdx = fallbackCounter % chars.length;
    if (vowels.includes(chars[mutateIdx])) {
      chars[mutateIdx] = vowels[(vowels.indexOf(chars[mutateIdx]) + 1) % vowels.length];
    } else if (consonants.includes(chars[mutateIdx])) {
      chars[mutateIdx] = consonants[(consonants.indexOf(chars[mutateIdx]) + 1) % consonants.length];
    } else {
      chars[mutateIdx] = vowels[fallbackCounter % vowels.length];
    }
    const synthetic = chars.join('');
    if (synthetic !== correctRomaji && synthetic.length === targetLen) {
      distractors.add(synthetic);
    }
  }

  // Combine 5 distractors + 1 correct answer = 6 options
  const options = Array.from(distractors).slice(0, 5);
  options.push(correctRomaji);

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}
