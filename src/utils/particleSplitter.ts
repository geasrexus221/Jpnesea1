import { ClausePart } from '../types/yugioh';

export interface TokenDictionaryEntry {
  text: string;
  romaji: string;
  english: string;
  furigana?: string;
  role: 'particle' | 'keyword' | 'timing' | 'verb' | 'normal';
}

export const VOCAB_DICT: Record<string, TokenDictionaryEntry> = {
  // Demonstratives / Pronouns
  'その': { text: 'その', romaji: 'sono', english: 'that', role: 'normal' },
  'この': { text: 'この', romaji: 'kono', english: 'this', role: 'normal' },
  'あの': { text: 'あの', romaji: 'ano', english: 'that (over there)', role: 'normal' },
  '自分': { text: '自分', romaji: 'jibun', english: 'your / self', furigana: 'じぶん', role: 'normal' },
  '相手': { text: '相手', romaji: 'aite', english: 'opponent', furigana: 'あいて', role: 'normal' },
  'お互い': { text: 'お互い', romaji: 'otagai', english: 'mutual / either player', furigana: 'おたがい', role: 'normal' },
  'または': { text: 'または', romaji: 'matawa', english: 'or', role: 'normal' },
  '及び': { text: '及び', romaji: 'oyobi', english: 'and / as well as', furigana: 'および', role: 'normal' },
  'それぞれ': { text: 'それぞれ', romaji: 'sorezore', english: 'each / respectively', role: 'normal' },
  'その後': { text: 'その後', romaji: 'sono go', english: 'after that / then', furigana: 'そのご', role: 'timing' },

  // Game Zones & Objects
  'フィールド': { text: 'フィールド', romaji: 'fīrudo', english: 'field', role: 'keyword' },
  'モンスター': { text: 'モンスター', romaji: 'monsutā', english: 'monster', role: 'keyword' },
  'カード': { text: 'カード', romaji: 'kādo', english: 'card', role: 'keyword' },
  'カード名': { text: 'カード名', romaji: 'kādo-mei', english: 'card name', furigana: 'めい', role: 'keyword' },
  '墓地': { text: '墓地', romaji: 'bochi', english: 'Graveyard (GY)', furigana: 'ぼち', role: 'keyword' },
  '手札': { text: '手札', romaji: 'tefuda', english: 'hand', furigana: 'てふだ', role: 'keyword' },
  'デッキ': { text: 'デッキ', romaji: 'dekki', english: 'Deck', role: 'keyword' },
  'EXデッキ': { text: 'EXデッキ', romaji: 'EX dekki', english: 'Extra Deck', role: 'keyword' },
  '効果': { text: '効果', romaji: 'kōka', english: 'effect', furigana: 'こうか', role: 'keyword' },
  '発動': { text: '発動', romaji: 'hatsudō', english: 'activation', furigana: 'はつどう', role: 'keyword' },
  '対象': { text: '対象', romaji: 'taishō', english: 'target', furigana: 'たいしょう', role: 'keyword' },
  '素材': { text: '素材', romaji: 'sozai', english: 'material', furigana: 'そざい', role: 'keyword' },
  'X素材': { text: 'X素材', romaji: 'Xyz sozai', english: 'Xyz material', furigana: 'そざい', role: 'keyword' },
  '表側表示': { text: '表側表示', romaji: 'omotegawa hyōji', english: 'face-up', furigana: 'おもてがわひょうじ', role: 'keyword' },
  '裏側表示': { text: '裏側表示', romaji: 'uragawa hyōji', english: 'face-down', furigana: 'うらがわひょうじ', role: 'keyword' },
  '攻撃力': { text: '攻撃力', romaji: 'kōgekiryoku', english: 'ATK', furigana: 'こうげきりょく', role: 'keyword' },
  '守備力': { text: '守備力', romaji: 'shubiryoku', english: 'DEF', furigana: 'しゅびりょく', role: 'keyword' },
  '持ち主': { text: '持ち主', romaji: 'mochinushi', english: 'owner', furigana: 'もちぬし', role: 'keyword' },
  'トークン': { text: 'トークン', romaji: 'tōkun', english: 'token', role: 'keyword' },
  '罠': { text: '罠', romaji: 'wana', english: 'Trap', furigana: 'わな', role: 'keyword' },
  '通常罠': { text: '通常罠', romaji: 'tsūjō wana', english: 'Normal Trap', furigana: 'つうじょうわな', role: 'keyword' },
  '魔法': { text: '魔法', romaji: 'mahō', english: 'Spell / Magic', furigana: 'まほう', role: 'keyword' },
  'セット': { text: 'セット', romaji: 'setto', english: 'Set', role: 'verb' },
  '選んで': { text: '選んで', romaji: 'erande', english: 'choose and', furigana: 'えらんで', role: 'verb' },
  '払って': { text: '払って', romaji: 'haratte', english: 'pay and', furigana: 'はらって', role: 'verb' },
  '離れた': { text: '離れた', romaji: 'hanareta', english: 'left', furigana: 'はなれた', role: 'verb' },
  '同名': { text: '同名', romaji: 'dōmei', english: 'same name', furigana: 'どうめい', role: 'keyword' },
  '悪魔族': { text: '悪魔族', romaji: 'akumazoku', english: 'Fiend', furigana: 'あくまぞく', role: 'keyword' },
  '属性': { text: '属性', romaji: 'zokusei', english: 'Attribute', furigana: 'ぞくせい', role: 'keyword' },
  '見せ': { text: '見せ', romaji: 'mise', english: 'reveal and', furigana: 'みせ', role: 'verb' },
  '種類': { text: '種類', romaji: 'shurui', english: 'types / variety', furigana: 'しゅるい', role: 'keyword' },
  '最大': { text: '最大', romaji: 'saidai', english: 'maximum', furigana: 'さいだい', role: 'keyword' },
  '選択': { text: '選択', romaji: 'sentaku', english: 'selection', furigana: 'せんたく', role: 'keyword' },
  '適用': { text: '適用', romaji: 'tekiyō', english: 'apply', furigana: 'てきよう', role: 'verb' },
  '密告': { text: '密告', romaji: 'mikkoku', english: 'accusation', furigana: 'みっこく', role: 'keyword' },
  '躯売り': { text: '躯売り', romaji: 'mukuro uri', english: 'corpse-selling', furigana: 'むくろうり', role: 'keyword' },

  // Phases & Timing
  'メインフェイズ': { text: 'メインフェイズ', romaji: 'mein feizu', english: 'Main Phase', role: 'timing' },
  'エンドフェイズ': { text: 'エンドフェイズ', romaji: 'endo feizu', english: 'End Phase', role: 'timing' },
  'スタンバイフェイズ': { text: 'スタンバイフェイズ', romaji: 'sutanbai feizu', english: 'Standby Phase', role: 'timing' },
  'ターン': { text: 'ターン', romaji: 'tān', english: 'turn', role: 'timing' },
  '終了時': { text: '終了時', romaji: 'shūryō-ji', english: 'end time', furigana: 'しゅうりょうじ', role: 'timing' },
  '時': { text: '時', romaji: 'toki', english: 'when / time', furigana: 'とき', role: 'timing' },
  '場合': { text: '場合', romaji: 'ba\'ai', english: 'if / in case', furigana: 'ばあい', role: 'timing' },

  // Numbers & Counters
  '１体': { text: '１体', romaji: 'ittai', english: '1 monster', furigana: 'いったい', role: 'normal' },
  '２体': { text: '２体', romaji: 'nitai', english: '2 monsters', furigana: 'にたい', role: 'normal' },
  '５体': { text: '５体', romaji: 'gotai', english: '5 monsters', furigana: 'ごたい', role: 'normal' },
  '１枚': { text: '１枚', romaji: 'ichimai', english: '1 card', furigana: 'いちまい', role: 'normal' },
  '２枚': { text: '２枚', romaji: 'nimai', english: '2 cards', furigana: 'にまい', role: 'normal' },
  '１度': { text: '１度', romaji: 'ichi do', english: '1 time', furigana: 'いちど', role: 'normal' },
  '２つ': { text: '２つ', romaji: 'futatsu', english: '2 materials', role: 'normal' },
  '以上': { text: '以上', romaji: 'ijō', english: 'or more', furigana: 'いじょう', role: 'normal' },
  '以下': { text: '以下', romaji: 'ika', english: 'or lower', furigana: 'いか', role: 'normal' },
  'だけ': { text: 'だけ', romaji: 'dake', english: 'only', role: 'normal' },
  '全て': { text: '全て', romaji: 'subete', english: 'all / everything', furigana: 'すべて', role: 'keyword' },
  '可能な限り': { text: '可能な限り', romaji: 'kanō na kagiri', english: 'as many as possible', furigana: 'かのうなかぎり', role: 'keyword' },
  'いずれか': { text: 'いずれか', romaji: 'izureka', english: 'any one of', role: 'keyword' },

  // Verbs & Actions
  '特殊召喚': { text: '特殊召喚', romaji: 'tokushu shōkan', english: 'Special Summon', furigana: 'とくしゅしょうかん', role: 'verb' },
  '召喚': { text: '召喚', romaji: 'shōkan', english: 'Summon', furigana: 'しょうかん', role: 'verb' },
  '破壊': { text: '破壊', romaji: 'hakai', english: 'destroy', furigana: 'はかい', role: 'verb' },
  '除外': { text: '除外', romaji: 'jogai', english: 'banish', furigana: 'じょがい', role: 'verb' },
  'ドロー': { text: 'ドロー', romaji: 'dorō', english: 'draw', role: 'verb' },
  'リリース': { text: 'リリース', romaji: 'rirīsu', english: 'tribute', role: 'verb' },
  '無効': { text: '無効', romaji: 'mukō', english: 'negate', furigana: 'むこう', role: 'verb' },
  '送る': { text: '送る', romaji: 'okuru', english: 'send', furigana: 'おくる', role: 'verb' },
  '送り': { text: '送り', romaji: 'okuri', english: 'send and', furigana: 'おくり', role: 'verb' },
  '捨てる': { text: '捨てる', romaji: 'suteru', english: 'discard', furigana: 'すてる', role: 'verb' },
  '捨てて': { text: '捨てて', romaji: 'sutete', english: 'discard and', furigana: 'すてて', role: 'verb' },
  '戻す': { text: '戻す', romaji: 'modosu', english: 'return', furigana: 'もどす', role: 'verb' },
  '戻し': { text: '戻し', romaji: 'modoshi', english: 'return and', furigana: 'もどし', role: 'verb' },
  '含む': { text: '含む', romaji: 'fukumu', english: 'including', furigana: 'ふくむ', role: 'verb' },
  '重ねて': { text: '重ねて', romaji: 'kasanete', english: 'stack / overlay and', furigana: 'かさねて', role: 'verb' },
  '取り除いて': { text: '取り除いて', romaji: 'torinozoite', english: 'detach and', furigana: 'とりのぞいて', role: 'verb' },
  '粉砕': { text: '粉砕', romaji: 'funsai', english: 'pulverize', furigana: 'ふんさい', role: 'verb' },

  // Auxiliary Verbs & Suffixes
  'する': { text: 'する', romaji: 'suru', english: 'do / perform', role: 'verb' },
  'した': { text: 'した', romaji: 'shita', english: 'did / was', role: 'verb' },
  'し': { text: 'し', romaji: 'shi', english: 'and (stem form)', role: 'verb' },
  'して': { text: 'して', romaji: 'shite', english: 'and (Te-form)', role: 'verb' },
  'できる': { text: 'できる', romaji: 'dekiru', english: 'can (Optional)', role: 'verb' },
  'できない': { text: 'できない', romaji: 'dekinai', english: 'cannot', role: 'verb' },

  // Particles
  'として': { text: 'として', romaji: 'to shite', english: 'as [Role]', role: 'particle' },
  'から': { text: 'から', romaji: 'kara', english: 'from [Origin]', role: 'particle' },
  'まで': { text: 'まで', romaji: 'made', english: 'until / up to [Limit]', role: 'particle' },
  'しか': { text: 'しか', romaji: 'shika', english: 'only [Limitation]', role: 'particle' },
  'を': { text: 'を', romaji: 'o', english: '[Direct Object]', role: 'particle' },
  'に': { text: 'に', romaji: 'ni', english: 'to / in [Destination]', role: 'particle' },
  'へ': { text: 'へ', romaji: 'e', english: 'towards [Destination]', role: 'particle' },
  'の': { text: 'の', romaji: 'no', english: '\'s / of [Link]', role: 'particle' },
  'が': { text: 'が', romaji: 'ga', english: '[Subject Marker]', role: 'particle' },
  'は': { text: 'は', romaji: 'wa', english: '[Topic Marker]', role: 'particle' },
  'で': { text: 'で', romaji: 'de', english: 'in / with [State]', role: 'particle' },
  'と': { text: 'と', romaji: 'to', english: 'and / with [Connector]', role: 'particle' },
};

const PARTICLES_ORDER = ['として', 'から', 'まで', 'しか', 'を', 'に', 'へ', 'の', 'が', 'は', 'で', 'と'];
const PREFIXES = ['その', 'この', 'あの', '自分', '相手', 'お互いの', 'お互い'];
const VERB_SUFFIXES = ['できる', 'できない', 'する', 'した', 'して', 'し'];

function tokenizeString(rawText: string): TokenDictionaryEntry[] {
  let text = rawText.trim();
  if (!text) return [];

  let trailingPunct = '';
  if (text.endsWith('。') || text.endsWith('、') || text.endsWith('；') || text.endsWith('：') || text.endsWith(';') || text.endsWith(':')) {
    trailingPunct = text.slice(-1);
    text = text.slice(0, -1);
  }

  // 1. Direct match in dictionary
  if (VOCAB_DICT[text]) {
    const entry = { ...VOCAB_DICT[text] };
    if (trailingPunct) entry.text += trailingPunct;
    return [entry];
  }

  // 2. Conjunction 'または'
  if (text.includes('または') && text !== 'または') {
    const parts = text.split('または');
    const left = tokenizeString(parts[0]);
    const mid = tokenizeString('または');
    const right = tokenizeString(parts.slice(1).join('または'));
    return [...left, ...mid, ...right];
  }

  // 3. Known prefixes: その, この, 自分, 相手
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix) && text.length > prefix.length) {
      const pEntry = VOCAB_DICT[prefix] || { text: prefix, romaji: prefix, english: prefix, role: 'normal' as const };
      const restTokens = tokenizeString(text.slice(prefix.length));
      return [pEntry, ...restTokens];
    }
  }

  // 4. Known particles at the end: を, に, から, の, etc.
  for (const p of PARTICLES_ORDER) {
    if (text.endsWith(p) && text.length > p.length) {
      const stem = text.slice(0, -p.length);
      const stemTokens = tokenizeString(stem);
      const pEntry = { ...VOCAB_DICT[p] };
      if (trailingPunct) pEntry.text += trailingPunct;
      return [...stemTokens, pEntry];
    }
  }

  // 5. Counters: モンスター１体 -> モンスター + １体; カード１枚 -> カード + １枚
  const counters = ['１体', '２体', '５体', '１枚', '２枚', '１度', '２つ'];
  for (const c of counters) {
    if (text.endsWith(c) && text.length > c.length) {
      const stem = text.slice(0, -c.length);
      const stemTokens = tokenizeString(stem);
      const cEntry = { ...VOCAB_DICT[c] };
      if (trailingPunct) cEntry.text += trailingPunct;
      return [...stemTokens, cEntry];
    }
  }

  // 6. Action verb + suffix: 特殊召喚する -> 特殊召喚 + する; 発動できる -> 発動 + できる
  for (const vs of VERB_SUFFIXES) {
    if (text.endsWith(vs) && text.length > vs.length) {
      const stem = text.slice(0, -vs.length);
      const stemTokens = tokenizeString(stem);
      const vsEntry = { ...VOCAB_DICT[vs] };
      if (trailingPunct) vsEntry.text += trailingPunct;
      return [...stemTokens, vsEntry];
    }
  }

  // Fallback: return as single unit with trailing punctuation restored
  return [
    {
      text: text + trailingPunct,
      romaji: text,
      english: text,
      role: 'normal',
    },
  ];
}

export function splitClauseParts(parts: ClausePart[], separate: boolean): ClausePart[] {
  if (!separate) return parts;

  const result: ClausePart[] = [];

  for (const part of parts) {
    const tokens = tokenizeString(part.text);

    if (tokens.length <= 1) {
      // Single token or couldn't split further, preserve original part metadata
      result.push(part);
    } else {
      // Decomposed into multiple individual words!
      for (const t of tokens) {
        result.push({
          text: t.text,
          romaji: t.romaji,
          english: t.english,
          furigana: t.furigana,
          role: t.role,
        });
      }
    }
  }

  return result;
}
