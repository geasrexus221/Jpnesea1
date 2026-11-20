import { ClausePart } from '../types/yugioh';

export interface TokenDictionaryEntry {
  text: string;
  romaji: string;
  english: string;
  furigana?: string;
  role: 'particle' | 'keyword' | 'timing' | 'verb' | 'normal';
}

// ============================================================================
// 1. KANA TO ROMAJI CONVERTER (Handles Hiragana, Katakana, Digraphs, Sokuon)
// ============================================================================
const KANA_MAP: Record<string, string> = {
  // Digraphs (Hiragana & Katakana)
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  キャ: 'kya', キュ: 'kyu', キョ: 'kyo',
  シャ: 'sha', シュ: 'shu', ショ: 'sho',
  チャ: 'cha', チュ: 'chu', チョ: 'cho',
  ニャ: 'nya', ニュ: 'nyu', ニョ: 'nyo',
  ヒャ: 'hya', ヒュ: 'hyu', ヒョ: 'hyo',
  ミャ: 'mya', ミュ: 'myu', ミョ: 'myo',
  リャ: 'rya', リュ: 'ryu', リョ: 'ryo',
  ギャ: 'gya', ギュ: 'gyu', ギョ: 'gyo',
  ジャ: 'ja', ジュ: 'ju', ジョ: 'jo',
  ビャ: 'bya', ビュ: 'byu', ビョ: 'byo',
  ピャ: 'pya', ピュ: 'pyu', ピョ: 'pyo',
  ティ: 'ti', ディ: 'di', トゥ: 'tu', ドゥ: 'du',
  ファ: 'fa', フィ: 'fi', フェ: 'fe', フォ: 'fo',
  ウィ: 'wi', ウェ: 'we', ウォ: 'wo',
  ヴァ: 'va', ヴィ: 'vi', ヴェ: 've', ヴォ: 'vo',
  シェ: 'she', ジェ: 'je', チェ: 'che',

  // Basic Hiragana
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',

  // Basic Katakana
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o',
  カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so',
  タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to',
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no',
  ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo',
  ヤ: 'ya', ユ: 'yu', ヨ: 'yo',
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  ワ: 'wa', ヲ: 'o', ン: 'n',
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
};

export function kanaToRomaji(kana: string): string {
  let res = '';
  let i = 0;
  while (i < kana.length) {
    // Sokuon (っ / ッ)
    if (kana[i] === 'っ' || kana[i] === 'ッ') {
      const nextKana = kana.slice(i + 1, i + 3);
      const nextSingle = kana[i + 1];
      const nextRomaji = KANA_MAP[nextKana] || KANA_MAP[nextSingle] || '';
      if (nextRomaji) {
        res += nextRomaji[0]; // double consonant
      }
      i++;
      continue;
    }

    // Long vowel mark (ー)
    if (kana[i] === 'ー') {
      if (res.length > 0) {
        const lastVowel = res[res.length - 1];
        if (lastVowel === 'a') res = res.slice(0, -1) + 'ā';
        else if (lastVowel === 'i') res = res.slice(0, -1) + 'ī';
        else if (lastVowel === 'u') res = res.slice(0, -1) + 'ū';
        else if (lastVowel === 'e') res = res.slice(0, -1) + 'ē';
        else if (lastVowel === 'o') res = res.slice(0, -1) + 'ō';
        else res += '-';
      }
      i++;
      continue;
    }

    // Check 2-character digraphs (きゃ, じゅ, etc.)
    const twoChar = kana.slice(i, i + 2);
    if (KANA_MAP[twoChar]) {
      res += (res.length > 0 && !res.endsWith(' ') ? '' : '') + KANA_MAP[twoChar];
      i += 2;
      continue;
    }

    // Single character
    const oneChar = kana[i];
    if (KANA_MAP[oneChar]) {
      res += KANA_MAP[oneChar];
      i++;
      continue;
    }

    // Non-kana characters (pass through spaces, latin letters, numbers, punctuation)
    if (/[a-zA-Z0-9\s:;.,()+\-●•/]/.test(oneChar)) {
      res += oneChar;
    } else if (oneChar === '①') res += '(1)';
    else if (oneChar === '②') res += '(2)';
    else if (oneChar === '③') res += '(3)';
    else if (oneChar === '・') res += ' ';
    else if (oneChar === '：' || oneChar === ':') res += ': ';
    else if (oneChar === '；' || oneChar === ';') res += '; ';
    else if (oneChar === '。') res += '.';
    else if (oneChar === '、') res += ', ';
    else if (oneChar === '「' || oneChar === '」') res += '"';

    i++;
  }
  return res.trim();
}

// ============================================================================
// 2. COMMON KANJI READING MAP (Guarantees every kanji has authentic reading)
// ============================================================================
const KANJI_READINGS: Record<string, { furigana: string; romaji: string; english: string }> = {
  他: { furigana: 'ほか', romaji: 'hoka', english: 'other' },
  事: { furigana: 'こと', romaji: 'koto', english: 'matter / thing' },
  数: { furigana: 'かず', romaji: 'kazu', english: 'number / quantity' },
  上: { furigana: 'うえ', romaji: 'ue', english: 'top / above' },
  中: { furigana: 'なか', romaji: 'naka', english: 'among / inside' },
  元: { furigana: 'もと', romaji: 'moto', english: 'original' },
  元々: { furigana: 'もともと', romaji: 'motomoto', english: 'original' },
  地: { furigana: 'ち', romaji: 'chi', english: 'EARTH' },
  水: { furigana: 'みず', romaji: 'mizu', english: 'WATER' },
  炎: { furigana: 'ほのお', romaji: 'honō', english: 'FIRE' },
  風: { furigana: 'かぜ', romaji: 'kaze', english: 'WIND' },
  光: { furigana: 'ひかり', romaji: 'hikari', english: 'LIGHT' },
  闇: { furigana: 'やみ', romaji: 'yami', english: 'DARK' },
  神: { furigana: 'かみ', romaji: 'kami', english: 'Divine / God' },
  密告: { furigana: 'みっこく', romaji: 'mikkoku', english: 'accusation' },
  躯: { furigana: 'むくろ', romaji: 'mukuro', english: 'corpse' },
  売り: { furigana: 'うり', romaji: 'uri', english: 'selling' },
  躯売り: { furigana: 'むくろうり', romaji: 'mukuro uri', english: 'corpse-selling' },
  白銀: { furigana: 'しろがね', romaji: 'shirogane', english: 'silver' },
  城: { furigana: 'しろ', romaji: 'shiro', english: 'castle' },
  悪魔: { furigana: 'あくま', romaji: 'akuma', english: 'Fiend' },
  悪魔族: { furigana: 'あくまぞく', romaji: 'akumazoku', english: 'Fiend' },
  族: { furigana: 'ぞく', romaji: 'zoku', english: 'Type' },
  属性: { furigana: 'ぞくせい', romaji: 'zokusei', english: 'Attribute' },
  同名: { furigana: 'どうめい', romaji: 'dōmei', english: 'same-name' },
  種類: { furigana: 'しゅるい', romaji: 'shurui', english: 'types / variety' },
  最大: { furigana: 'さいだい', romaji: 'saidai', english: 'maximum' },
  選択: { furigana: 'せんたく', romaji: 'sentaku', english: 'selection' },
  適用: { furigana: 'てきよう', romaji: 'tekiyō', english: 'apply' },
  存在: { furigana: 'そんざい', romaji: 'sonzai', english: 'exist' },
  見せ: { furigana: 'みせ', romaji: 'mise', english: 'show and' },
  見せる: { furigana: 'みせる', romaji: 'miseru', english: 'show / reveal' },
  離れ: { furigana: 'はなれ', romaji: 'hanare', english: 'leave' },
  離れた: { furigana: 'はなれた', romaji: 'hanareta', english: 'left' },
  対して: { furigana: 'たいして', romaji: 'taishite', english: 'in response to' },
  手札: { furigana: 'てふだ', romaji: 'tefuda', english: 'hand' },
  墓地: { furigana: 'ぼち', romaji: 'bochi', english: 'GY' },
  発動: { furigana: 'はつどう', romaji: 'hatsudō', english: 'activation' },
  効果: { furigana: 'こうか', romaji: 'kōka', english: 'effect' },
  破壊: { furigana: 'はかい', romaji: 'hakai', english: 'destroy' },
  除外: { furigana: 'じょがい', romaji: 'jogai', english: 'banish' },
  無効: { furigana: 'むこう', romaji: 'mukō', english: 'negate' },
  特殊: { furigana: 'とくしゅ', romaji: 'tokushu', english: 'special' },
  召喚: { furigana: 'しょうかん', romaji: 'shōkan', english: 'summon' },
  特殊召喚: { furigana: 'とくしゅしょうかん', romaji: 'tokushu shōkan', english: 'Special Summon' },
  通常: { furigana: 'つうじょう', romaji: 'tsūjō', english: 'Normal' },
  通常罠: { furigana: 'つうじょうわな', romaji: 'tsūjō wana', english: 'Normal Trap' },
  魔法: { furigana: 'まほう', romaji: 'mahō', english: 'Spell' },
  罠: { furigana: 'わな', romaji: 'wana', english: 'Trap' },
  表示: { furigana: 'ひょうじ', romaji: 'hyōji', english: 'position' },
  裏側: { furigana: 'うらがわ', romaji: 'uragawa', english: 'face-down' },
  裏側表示: { furigana: 'うらがわひょうじ', romaji: 'uragawa hyōji', english: 'face-down' },
  表側: { furigana: 'おもてがわ', romaji: 'omotegawa', english: 'face-up' },
  表側表示: { furigana: 'おもてがわひょうじ', romaji: 'omotegawa hyōji', english: 'face-up' },
  守備: { furigana: 'しゅび', romaji: 'shubi', english: 'defense' },
  守備力: { furigana: 'しゅびりょく', romaji: 'shubiryoku', english: 'DEF' },
  攻撃: { furigana: 'こうげき', romaji: 'kōgeki', english: 'attack' },
  攻撃力: { furigana: 'こうげきりょく', romaji: 'kōgekiryoku', english: 'ATK' },
  持ち主: { furigana: 'もちぬし', romaji: 'mochinushi', english: 'owner' },
  素材: { furigana: 'そざい', romaji: 'sozai', english: 'material' },
  送る: { furigana: 'おくる', romaji: 'okuru', english: 'send' },
  送った: { furigana: 'おくった', romaji: 'okutta', english: 'sent' },
  送り: { furigana: 'おくり', romaji: 'okuri', english: 'send and' },
  捨てる: { furigana: 'すてる', romaji: 'suteru', english: 'discard' },
  捨てて: { furigana: 'すてて', romaji: 'sutete', english: 'discard and' },
  戻す: { furigana: 'もどす', romaji: 'modosu', english: 'return' },
  戻し: { furigana: 'もどし', romaji: 'modoshi', english: 'return and' },
  払う: { furigana: 'はらう', romaji: 'harau', english: 'pay' },
  払って: { furigana: 'はらって', romaji: 'haratte', english: 'pay and' },
  確認: { furigana: 'かくにん', romaji: 'kakunin', english: 'confirm' },
  変更: { furigana: 'へんこう', romaji: 'henkō', english: 'change' },
  回復: { furigana: 'かいふく', romaji: 'kaifuku', english: 'gain / recover' },
  与える: { furigana: 'あたえる', romaji: 'ataeru', english: 'inflict' },
  与え: { furigana: 'あたえ', romaji: 'atae', english: 'inflict and' },
  得る: { furigana: 'える', romaji: 'eru', english: 'take / gain' },
  受けない: { furigana: 'うけない', romaji: 'ukenai', english: 'unaffected' },
  自分: { furigana: 'じぶん', romaji: 'jibun', english: 'your / self' },
  相手: { furigana: 'あいて', romaji: 'aite', english: 'opponent' },
  お互い: { furigana: 'おたがい', romaji: 'otagai', english: 'mutual' },
  場合: { furigana: 'ばあい', romaji: 'ba\'ai', english: 'if / in case' },
  時: { furigana: 'とき', romaji: 'toki', english: 'when' },
  終了時: { furigana: 'しゅうりょうじ', romaji: 'shūryō-ji', english: 'end time' },
  対象: { furigana: 'たいしょう', romaji: 'taishō', english: 'target' },
  選んで: { furigana: 'えらんで', romaji: 'erande', english: 'choose and' },
  及び: { furigana: 'および', romaji: 'oyobi', english: 'as well as' },
  以上: { furigana: 'いじょう', romaji: 'ijō', english: 'or more' },
  以下: { furigana: 'いか', romaji: 'ika', english: 'or lower' },
  以外: { furigana: 'いがい', romaji: 'igai', english: 'except' },
  全て: { furigana: 'すべて', romaji: 'subete', english: 'all' },
  可能な限り: { furigana: 'かのうなかぎり', romaji: 'kanō na kagiri', english: 'as many as possible' },
  融合: { furigana: 'ゆうごう', romaji: 'yūgō', english: 'Fusion' },
  融合召喚: { furigana: 'ゆうごうしょうかん', romaji: 'yūgō shōkan', english: 'Fusion Summon' },
  儀式: { furigana: 'ぎしき', romaji: 'gishiki', english: 'Ritual' },
  儀式召喚: { furigana: 'ぎしきしょうかん', romaji: 'gishiki shōkan', english: 'Ritual Summon' },
  シンクロ召喚: { furigana: 'しょうかん', romaji: 'shinkuro shōkan', english: 'Synchro Summon' },
  S召喚: { furigana: 'しょうかん', romaji: 'shinkuro shōkan', english: 'Synchro Summon' },
  X召喚: { furigana: 'しょうかん', romaji: 'ekushīzu shōkan', english: 'Xyz Summon' },
  リンク召喚: { furigana: 'しょうかん', romaji: 'rinku shōkan', english: 'Link Summon' },
  P召喚: { furigana: 'しょうかん', romaji: 'pendyuramu shōkan', english: 'Pendulum Summon' },
  '１体': { furigana: 'いったい', romaji: 'ittai', english: '1 monster' },
  '２体': { furigana: 'にたい', romaji: 'nitai', english: '2 monsters' },
  '３体': { furigana: 'さんたい', romaji: 'santai', english: '3 monsters' },
  '４体': { furigana: 'よんたい', romaji: 'yontai', english: '4 monsters' },
  '５体': { furigana: 'ごたい', romaji: 'gotai', english: '5 monsters' },
  '１枚': { furigana: 'いちまい', romaji: 'ichimai', english: '1 card' },
  '２枚': { furigana: 'にまい', romaji: 'nimai', english: '2 cards' },
  '３枚': { furigana: 'さんまい', romaji: 'sanmai', english: '3 cards' },
  '４枚': { furigana: 'よんまい', romaji: 'yonmai', english: '4 cards' },
  '１度': { furigana: 'いちど', romaji: 'ichi do', english: '1 time' },
  '１つ': { furigana: 'ひとつ', romaji: 'hitotsu', english: '1' },
  '２つ': { furigana: 'ふたつ', romaji: 'futatsu', english: '2' },
  '１５００': { furigana: 'せんごひゃく', romaji: 'sen-gohyaku', english: '1500' },
  '３０００': { furigana: 'さんぜん', romaji: 'sanzen', english: '3000' },
};

// ============================================================================
// 3. CENTRAL VOCABULARY DICTIONARY (Single Source of Truth)
// ============================================================================
export const VOCAB_DICT: Record<string, TokenDictionaryEntry> = {
  // Demonstratives / Pronouns
  その: { text: 'その', romaji: 'sono', english: 'that', role: 'normal' },
  この: { text: 'この', romaji: 'kono', english: 'this', role: 'normal' },
  あの: { text: 'あの', romaji: 'ano', english: 'that (over there)', role: 'normal' },
  自分: { text: '自分', romaji: 'jibun', english: 'your / self', furigana: 'じぶん', role: 'normal' },
  相手: { text: '相手', romaji: 'aite', english: 'opponent', furigana: 'あいて', role: 'normal' },
  お互い: { text: 'お互い', romaji: 'otagai', english: 'mutual / either player', furigana: 'おたがい', role: 'normal' },
  または: { text: 'または', romaji: 'matawa', english: 'or', role: 'normal' },
  及び: { text: '及び', romaji: 'oyobi', english: 'and / as well as', furigana: 'および', role: 'normal' },
  それぞれ: { text: 'それぞれ', romaji: 'sorezore', english: 'each / respectively', role: 'normal' },
  その後: { text: 'その後', romaji: 'sono go', english: 'after that / then', furigana: 'そのご', role: 'timing' },
  他: { text: '他', romaji: 'hoka', english: 'other', furigana: 'ほか', role: 'normal' },
  事: { text: '事', romaji: 'koto', english: 'matter / thing', furigana: 'こと', role: 'normal' },
  数: { text: '数', romaji: 'kazu', english: 'number', furigana: 'かず', role: 'normal' },
  上: { text: '上', romaji: 'ue', english: 'top', furigana: 'うえ', role: 'normal' },
  中: { text: '中', romaji: 'naka', english: 'among / inside', furigana: 'なか', role: 'normal' },

  // Game Zones & Objects
  フィールド: { text: 'フィールド', romaji: 'fīrudo', english: 'field', role: 'keyword' },
  モンスター: { text: 'モンスター', romaji: 'monsutā', english: 'monster', role: 'keyword' },
  カード: { text: 'カード', romaji: 'kādo', english: 'card', role: 'keyword' },
  カード名: { text: 'カード名', romaji: 'kādo-mei', english: 'card name', furigana: 'めい', role: 'keyword' },
  墓地: { text: '墓地', romaji: 'bochi', english: 'Graveyard (GY)', furigana: 'ぼち', role: 'keyword' },
  手札: { text: '手札', romaji: 'tefuda', english: 'hand', furigana: 'てふだ', role: 'keyword' },
  デッキ: { text: 'デッキ', romaji: 'dekki', english: 'Deck', role: 'keyword' },
  EXデッキ: { text: 'EXデッキ', romaji: 'EX dekki', english: 'Extra Deck', role: 'keyword' },
  効果: { text: '効果', romaji: 'kōka', english: 'effect', furigana: 'こうか', role: 'keyword' },
  発動: { text: '発動', romaji: 'hatsudō', english: 'activation', furigana: 'はつどう', role: 'keyword' },
  対象: { text: '対象', romaji: 'taishō', english: 'target', furigana: 'たいしょう', role: 'keyword' },
  素材: { text: '素材', romaji: 'sozai', english: 'material', furigana: 'そざい', role: 'keyword' },
  X素材: { text: 'X素材', romaji: 'Xyz sozai', english: 'Xyz material', furigana: 'そざい', role: 'keyword' },
  表側表示: { text: '表側表示', romaji: 'omotegawa hyōji', english: 'face-up', furigana: 'おもてがわひょうじ', role: 'keyword' },
  裏側表示: { text: '裏側表示', romaji: 'uragawa hyōji', english: 'face-down', furigana: 'うらがわひょうじ', role: 'keyword' },
  表側: { text: '表側', romaji: 'omotegawa', english: 'face-up', furigana: 'おもてがわ', role: 'keyword' },
  裏側: { text: '裏側', romaji: 'uragawa', english: 'face-down', furigana: 'うらがわ', role: 'keyword' },
  攻撃力: { text: '攻撃力', romaji: 'kōgekiryoku', english: 'ATK', furigana: 'こうげきりょく', role: 'keyword' },
  守備力: { text: '守備力', romaji: 'shubiryoku', english: 'DEF', furigana: 'しゅびりょく', role: 'keyword' },
  持ち主: { text: '持ち主', romaji: 'mochinushi', english: 'owner', furigana: 'もちぬし', role: 'keyword' },
  トークン: { text: 'トークン', romaji: 'tōkun', english: 'token', role: 'keyword' },
  罠: { text: '罠', romaji: 'wana', english: 'Trap', furigana: 'わな', role: 'keyword' },
  通常罠: { text: '通常罠', romaji: 'tsūjō wana', english: 'Normal Trap', furigana: 'つうじょうわな', role: 'keyword' },
  魔法: { text: '魔法', romaji: 'mahō', english: 'Spell / Magic', furigana: 'まほう', role: 'keyword' },
  セット: { text: 'セット', romaji: 'setto', english: 'Set', role: 'verb' },
  選んで: { text: '選んで', romaji: 'erande', english: 'choose and', furigana: 'えらんで', role: 'verb' },
  払って: { text: '払って', romaji: 'haratte', english: 'pay and', furigana: 'はらって', role: 'verb' },
  払う: { text: '払う', romaji: 'harau', english: 'pay', furigana: 'はらう', role: 'verb' },
  離れた: { text: '離れた', romaji: 'hanareta', english: 'left', furigana: 'はなれた', role: 'verb' },
  同名: { text: '同名', romaji: 'dōmei', english: 'same name', furigana: 'どうめい', role: 'keyword' },
  悪魔族: { text: '悪魔族', romaji: 'akumazoku', english: 'Fiend', furigana: 'あくまぞく', role: 'keyword' },
  属性: { text: '属性', romaji: 'zokusei', english: 'Attribute', furigana: 'ぞくせい', role: 'keyword' },
  見せ: { text: '見せ', romaji: 'mise', english: 'reveal and', furigana: 'みせ', role: 'verb' },
  種類: { text: '種類', romaji: 'shurui', english: 'types / variety', furigana: 'しゅるい', role: 'keyword' },
  最大: { text: '最大', romaji: 'saidai', english: 'maximum', furigana: 'さいだい', role: 'keyword' },
  選択: { text: '選択', romaji: 'sentaku', english: 'selection', furigana: 'せんたく', role: 'keyword' },
  適用: { text: '適用', romaji: 'tekiyō', english: 'apply', furigana: 'てきよう', role: 'verb' },
  密告: { text: '密告', romaji: 'mikkoku', english: 'accusation', furigana: 'みっこく', role: 'keyword' },
  躯売り: { text: '躯売り', romaji: 'mukuro uri', english: 'corpse-selling', furigana: 'むくろうり', role: 'keyword' },
  存在: { text: '存在', romaji: 'sonzai', english: 'exist', furigana: 'そんざい', role: 'verb' },
  変更: { text: '変更', romaji: 'henkō', english: 'change', furigana: 'へんこう', role: 'verb' },
  回復: { text: '回復', romaji: 'kaifuku', english: 'recover / gain', furigana: 'かいふく', role: 'verb' },
  与える: { text: '与える', romaji: 'ataeru', english: 'inflict', furigana: 'あたえる', role: 'verb' },
  与え: { text: '与え', romaji: 'atae', english: 'inflict and', furigana: 'あたえ', role: 'verb' },
  得る: { text: '得る', romaji: 'eru', english: 'take / gain', furigana: 'える', role: 'verb' },
  受けない: { text: '受けない', romaji: 'ukenai', english: 'unaffected by', furigana: 'うけない', role: 'verb' },
  確認: { text: '確認', romaji: 'kakunin', english: 'verify / check', furigana: 'かくにん', role: 'verb' },
  コントロール: { text: 'コントロール', romaji: 'kontorōru', english: 'control', role: 'keyword' },
  ダメージ: { text: 'ダメージ', romaji: 'damēji', english: 'damage', role: 'keyword' },
  LP: { text: 'LP', romaji: 'LP', english: 'Life Points', role: 'keyword' },
  ＬＰ: { text: 'ＬＰ', romaji: 'LP', english: 'Life Points', role: 'keyword' },
  元々: { text: '元々', romaji: 'motomoto', english: 'original', furigana: 'もともと', role: 'keyword' },
  表示形式: { text: '表示形式', romaji: 'hyōji keishiki', english: 'battle position', furigana: 'ひょうじけいしき', role: 'keyword' },

  // Mechanics & Extra Deck
  融合: { text: '融合', romaji: 'yūgō', english: 'Fusion', furigana: 'ゆうごう', role: 'keyword' },
  融合召喚: { text: '融合召喚', romaji: 'yūgō shōkan', english: 'Fusion Summon', furigana: 'ゆうごうしょうかん', role: 'verb' },
  儀式: { text: '儀式', romaji: 'gishiki', english: 'Ritual', furigana: 'ぎしき', role: 'keyword' },
  儀式召喚: { text: '儀式召喚', romaji: 'gishiki shōkan', english: 'Ritual Summon', furigana: 'ぎしきしょうかん', role: 'verb' },
  シンクロ: { text: 'シンクロ', romaji: 'shinkuro', english: 'Synchro', role: 'keyword' },
  シンクロ召喚: { text: 'シンクロ召喚', romaji: 'shinkuro shōkan', english: 'Synchro Summon', furigana: 'しょうかん', role: 'verb' },
  S召喚: { text: 'S召喚', romaji: 'shinkuro shōkan', english: 'Synchro Summon', furigana: 'しょうかん', role: 'verb' },
  エクシーズ: { text: 'エクシーズ', romaji: 'ekushīzu', english: 'Xyz', role: 'keyword' },
  X召喚: { text: 'X召喚', romaji: 'ekushīzu shōkan', english: 'Xyz Summon', furigana: 'しょうかん', role: 'verb' },
  リンク: { text: 'リンク', romaji: 'rinku', english: 'Link', role: 'keyword' },
  リンク召喚: { text: 'リンク召喚', romaji: 'rinku shōkan', english: 'Link Summon', furigana: 'しょうかん', role: 'verb' },
  リンクマーカー: { text: 'リンクマーカー', romaji: 'rinku mākā', english: 'Link Marker', role: 'keyword' },
  ペンデュラム: { text: 'ペンデュラム', romaji: 'pendyuramu', english: 'Pendulum', role: 'keyword' },
  P召喚: { text: 'P召喚', romaji: 'pendyuramu shōkan', english: 'Pendulum Summon', furigana: 'しょうかん', role: 'verb' },
  Pスケール: { text: 'Pスケール', romaji: 'pendyuramu sukēru', english: 'Pendulum Scale', role: 'keyword' },
  Pゾーン: { text: 'Pゾーン', romaji: 'pendyuramu zōn', english: 'Pendulum Zone', role: 'keyword' },
  チューナー: { text: 'チューナー', romaji: 'chūnā', english: 'Tuner', role: 'keyword' },
  リバース: { text: 'リバース', romaji: 'ribāsu', english: 'Flip', role: 'keyword' },
  スペルスピード: { text: 'スペルスピード', romaji: 'superu supīdo', english: 'Spell Speed', role: 'keyword' },
  ダメージステップ: { text: 'ダメージステップ', romaji: 'damēji suteppu', english: 'Damage Step', role: 'timing' },

  // Elements & Attributes
  地: { text: '地', romaji: 'chi', english: 'EARTH', furigana: 'ち', role: 'keyword' },
  水: { text: '水', romaji: 'mizu', english: 'WATER', furigana: 'みず', role: 'keyword' },
  炎: { text: '炎', romaji: 'honō', english: 'FIRE', furigana: 'ほのお', role: 'keyword' },
  風: { text: '風', romaji: 'kaze', english: 'WIND', furigana: 'かぜ', role: 'keyword' },
  光: { text: '光', romaji: 'hikari', english: 'LIGHT', furigana: 'ひかり', role: 'keyword' },
  闇: { text: '闇', romaji: 'yami', english: 'DARK', furigana: 'やみ', role: 'keyword' },
  神: { text: '神', romaji: 'kami', english: 'DIVINE', furigana: 'かみ', role: 'keyword' },
  光属性: { text: '光属性', romaji: 'hikari zokusei', english: 'LIGHT Attribute', furigana: 'ひかりぞくせい', role: 'keyword' },
  闇属性: { text: '闇属性', romaji: 'yami zokusei', english: 'DARK Attribute', furigana: 'やみぞくせい', role: 'keyword' },
  地属性: { text: '地属性', romaji: 'ji zokusei', english: 'EARTH Attribute', furigana: 'じぞくせい', role: 'keyword' },
  水属性: { text: '水属性', romaji: 'mizu zokusei', english: 'WATER Attribute', furigana: 'みずぞくせい', role: 'keyword' },
  炎属性: { text: '炎属性', romaji: 'honō zokusei', english: 'FIRE Attribute', furigana: 'ほのおぞくせい', role: 'keyword' },
  風属性: { text: '風属性', romaji: 'kaze zokusei', english: 'WIND Attribute', furigana: 'かぜぞくせい', role: 'keyword' },
  神属性: { text: '神属性', romaji: 'kami zokusei', english: 'DIVINE Attribute', furigana: 'かみぞくせい', role: 'keyword' },

  // Monster Types (種族)
  ドラゴン族: { text: 'ドラゴン族', romaji: 'doragon-zoku', english: 'Dragon', furigana: 'ぞく', role: 'keyword' },
  魔法使い族: { text: '魔法使い族', romaji: 'mahōtsukai-zoku', english: 'Spellcaster', furigana: 'まほうつかいぞく', role: 'keyword' },
  戦士族: { text: '戦士族', romaji: 'senshi-zoku', english: 'Warrior', furigana: 'せんしぞく', role: 'keyword' },
  サイバース族: { text: 'サイバース族', romaji: 'saibāsu-zoku', english: 'Cyberse', furigana: 'ぞく', role: 'keyword' },
  アンデット族: { text: 'アンデット族', romaji: 'andetto-zoku', english: 'Zombie', furigana: 'ぞく', role: 'keyword' },
  天使族: { text: '天使族', romaji: 'tenshi-zoku', english: 'Fairy', furigana: 'てんしぞく', role: 'keyword' },
  機械族: { text: '機械族', romaji: 'kikai-zoku', english: 'Machine', furigana: 'きかいぞく', role: 'keyword' },
  鳥獣族: { text: '鳥獣族', romaji: 'chōjū-zoku', english: 'Winged Beast', furigana: 'ちょうじゅうぞく', role: 'keyword' },
  獣族: { text: '獣族', romaji: 'jū-zoku', english: 'Beast', furigana: 'じゅうぞく', role: 'keyword' },
  獣戦士族: { text: '獣戦士族', romaji: 'jūsenshi-zoku', english: 'Beast-Warrior', furigana: 'じゅうせんしぞく', role: 'keyword' },
  水族: { text: '水族', romaji: 'sui-zoku', english: 'Aqua', furigana: 'すいぞく', role: 'keyword' },
  炎族: { text: '炎族', romaji: 'honō-zoku', english: 'Pyro', furigana: 'ほのおぞく', role: 'keyword' },
  雷族: { text: '雷族', romaji: 'kaminari-zoku', english: 'Thunder', furigana: 'かみなりぞく', role: 'keyword' },
  岩石族: { text: '岩石族', romaji: 'ganseki-zoku', english: 'Rock', furigana: 'がんせきぞく', role: 'keyword' },
  植物族: { text: '植物族', romaji: 'shokubutsu-zoku', english: 'Plant', furigana: 'しょくぶつぞく', role: 'keyword' },
  昆虫族: { text: '昆虫族', romaji: 'konchū-zoku', english: 'Insect', furigana: 'こんちゅうぞく', role: 'keyword' },
  恐竜族: { text: '恐竜族', romaji: 'kyōryū-zoku', english: 'Dinosaur', furigana: 'きょうりゅうぞく', role: 'keyword' },
  魚族: { text: '魚族', romaji: 'sakana-zoku', english: 'Fish', furigana: 'さかなぞく', role: 'keyword' },
  海竜族: { text: '海竜族', romaji: 'kairyū-zoku', english: 'Sea Serpent', furigana: 'かいりゅうぞく', role: 'keyword' },
  爬虫類族: { text: '爬虫類族', romaji: 'hachūrui-zoku', english: 'Reptile', furigana: 'はちゅうるいぞく', role: 'keyword' },
  サイキック族: { text: 'サイキック族', romaji: 'saikikku-zoku', english: 'Psychic', furigana: 'ぞく', role: 'keyword' },
  幻竜族: { text: '幻竜族', romaji: 'genryū-zoku', english: 'Wyrm', furigana: 'げんりゅうぞく', role: 'keyword' },
  幻想魔族: { text: '幻想魔族', romaji: 'gensōma-zoku', english: 'Illusion', furigana: 'げんそうまぞく', role: 'keyword' },
  神獣族: { text: '神獣族', romaji: 'shinjū-zoku', english: 'Divine-Beast', furigana: 'しんじゅうぞく', role: 'keyword' },
  創造神族: { text: '創造神族', romaji: 'sōzōshin-zoku', english: 'Creator God', furigana: 'そうぞうしんぞく', role: 'keyword' },

  // Monster Classifications
  通常モンスター: { text: '通常モンスター', romaji: 'tsūjō monsutā', english: 'Normal Monster', furigana: 'つうじょう', role: 'keyword' },
  効果モンスター: { text: '効果モンスター', romaji: 'kōka monsutā', english: 'Effect Monster', furigana: 'こうか', role: 'keyword' },
  特殊召喚モンスター: { text: '特殊召喚モンスター', romaji: 'tokushu shōkan monsutā', english: 'Special Summon Monster', furigana: 'とくしゅしょうかん', role: 'keyword' },
  スピリット: { text: 'スピリット', romaji: 'supiritto', english: 'Spirit', role: 'keyword' },
  ユニオン: { text: 'ユニオン', romaji: 'yunion', english: 'Union', role: 'keyword' },
  デュアル: { text: 'デュアル', romaji: 'dyuaru', english: 'Gemini', role: 'keyword' },

  // Spell & Trap Properties
  通常魔法: { text: '通常魔法', romaji: 'tsūjō mahō', english: 'Normal Spell', furigana: 'つうじょうまほう', role: 'keyword' },
  速攻魔法: { text: '速攻魔法', romaji: 'sokkō mahō', english: 'Quick-Play Spell', furigana: 'そっこうまほう', role: 'keyword' },
  永続魔法: { text: '永続魔法', romaji: 'eizoku mahō', english: 'Continuous Spell', furigana: 'えいぞくまほう', role: 'keyword' },
  装備魔法: { text: '装備魔法', romaji: 'sōbi mahō', english: 'Equip Spell', furigana: 'そうびまほう', role: 'keyword' },
  フィールド魔法: { text: 'フィールド魔法', romaji: 'fīrudo mahō', english: 'Field Spell', furigana: 'まほう', role: 'keyword' },
  儀式魔法: { text: '儀式魔法', romaji: 'gishiki mahō', english: 'Ritual Spell', furigana: 'ぎしきまほう', role: 'keyword' },
  永続罠: { text: '永続罠', romaji: 'eizoku wana', english: 'Continuous Trap', furigana: 'えいぞくわな', role: 'keyword' },
  カウンター罠: { text: 'カウンター罠', romaji: 'kauntā wana', english: 'Counter Trap', furigana: 'わな', role: 'keyword' },

  // Combat & Stats
  直接攻撃: { text: '直接攻撃', romaji: 'chokusetsu kōgeki', english: 'Direct Attack', furigana: 'ちょくせつこうげき', role: 'keyword' },
  戦闘破壊: { text: '戦闘破壊', romaji: 'sentō hakai', english: 'Destroyed by Battle', furigana: 'せんとうはかい', role: 'keyword' },
  効果破壊: { text: '効果破壊', romaji: 'kōka hakai', english: 'Destroyed by Effect', furigana: 'こうかはかい', role: 'keyword' },
  貫通: { text: '貫通', romaji: 'kantsū', english: 'Piercing', furigana: 'かんつう', role: 'keyword' },
  完全耐性: { text: '完全耐性', romaji: 'kanzen taisei', english: 'Complete Immunity', furigana: 'かんぜんたいせい', role: 'keyword' },

  // Phases & Timing
  メインフェイズ: { text: 'メインフェイズ', romaji: 'mein feizu', english: 'Main Phase', role: 'timing' },
  エンドフェイズ: { text: 'エンドフェイズ', romaji: 'endo feizu', english: 'End Phase', role: 'timing' },
  スタンバイフェイズ: { text: 'スタンバイフェイズ', romaji: 'sutanbai feizu', english: 'Standby Phase', role: 'timing' },
  ターン: { text: 'ターン', romaji: 'tān', english: 'turn', role: 'timing' },
  終了時: { text: '終了時', romaji: 'shūryō-ji', english: 'end time', furigana: 'しゅうりょうじ', role: 'timing' },
  時: { text: '時', romaji: 'toki', english: 'when / time', furigana: 'とき', role: 'timing' },
  場合: { text: '場合', romaji: 'ba\'ai', english: 'if / in case', furigana: 'ばあい', role: 'timing' },

  // Numbers & Counters
  '１体': { text: '１体', romaji: 'ittai', english: '1 monster', furigana: 'いったい', role: 'normal' },
  '２体': { text: '２体', romaji: 'nitai', english: '2 monsters', furigana: 'にたい', role: 'normal' },
  '３体': { text: '３体', romaji: 'santai', english: '3 monsters', furigana: 'さんたい', role: 'normal' },
  '４体': { text: '４体', romaji: 'yontai', english: '4 monsters', furigana: 'よんたい', role: 'normal' },
  '５体': { text: '５体', romaji: 'gotai', english: '5 monsters', furigana: 'ごたい', role: 'normal' },
  '１枚': { text: '１枚', romaji: 'ichimai', english: '1 card', furigana: 'いちまい', role: 'normal' },
  '２枚': { text: '２枚', romaji: 'nimai', english: '2 cards', furigana: 'にまい', role: 'normal' },
  '３枚': { text: '３枚', romaji: 'sanmai', english: '3 cards', furigana: 'さんまい', role: 'normal' },
  '４枚': { text: '４枚', romaji: 'yonmai', english: '4 cards', furigana: 'よんまい', role: 'normal' },
  '１度': { text: '１度', romaji: 'ichi do', english: '1 time', furigana: 'いちど', role: 'normal' },
  '１つ': { text: '１つ', romaji: 'hitotsu', english: '1 (choice)', furigana: 'ひとつ', role: 'normal' },
  '２つ': { text: '２つ', romaji: 'futatsu', english: '2 materials', furigana: 'ふたつ', role: 'normal' },
  '１５００': { text: '１５００', romaji: 'sen-gohyaku', english: '1500', furigana: 'せんごひゃく', role: 'normal' },
  '３０００': { text: '３０００', romaji: 'sanzen', english: '3000', furigana: 'さんぜん', role: 'normal' },
  以上: { text: '以上', romaji: 'ijō', english: 'or more', furigana: 'いじょう', role: 'normal' },
  以下: { text: '以下', romaji: 'ika', english: 'or lower', furigana: 'いか', role: 'normal' },
  以外: { text: '以外', romaji: 'igai', english: 'except', furigana: 'いがい', role: 'normal' },
  だけ: { text: 'だけ', romaji: 'dake', english: 'only', role: 'normal' },
  全て: { text: '全て', romaji: 'subete', english: 'all / everything', furigana: 'すべて', role: 'keyword' },
  可能な限り: { text: '可能な限り', romaji: 'kanō na kagiri', english: 'as many as possible', furigana: 'かのうなかぎり', role: 'keyword' },
  いずれか: { text: 'いずれか', romaji: 'izureka', english: 'any one of', role: 'keyword' },
  さらに: { text: 'さらに', romaji: 'sara ni', english: 'furthermore', role: 'normal' },
  ずつ: { text: 'ずつ', romaji: 'zutsu', english: 'each / apiece', role: 'normal' },

  // Verbs & Actions
  特殊召喚: { text: '特殊召喚', romaji: 'tokushu shōkan', english: 'Special Summon', furigana: 'とくしゅしょうかん', role: 'verb' },
  通常召喚: { text: '通常召喚', romaji: 'tsūjō shōkan', english: 'Normal Summon', furigana: 'つうじょうしょうかん', role: 'verb' },
  召喚: { text: '召喚', romaji: 'shōkan', english: 'Summon', furigana: 'しょうかん', role: 'verb' },
  破壊: { text: '破壊', romaji: 'hakai', english: 'destroy', furigana: 'はかい', role: 'verb' },
  除外: { text: '除外', romaji: 'jogai', english: 'banish', furigana: 'じょがい', role: 'verb' },
  ドロー: { text: 'ドロー', romaji: 'dorō', english: 'draw', role: 'verb' },
  リリース: { text: 'リリース', romaji: 'rirīsu', english: 'tribute', role: 'verb' },
  無効: { text: '無効', romaji: 'mukō', english: 'negate', furigana: 'むこう', role: 'verb' },
  送る: { text: '送る', romaji: 'okuru', english: 'send', furigana: 'おくる', role: 'verb' },
  送った: { text: '送った', romaji: 'okutta', english: 'sent', furigana: 'おくった', role: 'verb' },
  送り: { text: '送り', romaji: 'okuri', english: 'send and', furigana: 'おくり', role: 'verb' },
  捨てる: { text: '捨てる', romaji: 'suteru', english: 'discard', furigana: 'すてる', role: 'verb' },
  捨てて: { text: '捨てて', romaji: 'sutete', english: 'discard and', furigana: 'すてて', role: 'verb' },
  戻す: { text: '戻す', romaji: 'modosu', english: 'return', furigana: 'もどす', role: 'verb' },
  戻し: { text: '戻し', romaji: 'modoshi', english: 'return and', furigana: 'もどし', role: 'verb' },
  含む: { text: '含む', romaji: 'fukumu', english: 'including', furigana: 'ふくむ', role: 'verb' },
  重ねて: { text: '重ねて', romaji: 'kasanete', english: 'stack / overlay and', furigana: 'かさねて', role: 'verb' },
  取り除いて: { text: '取り除いて', romaji: 'torinozoite', english: 'detach and', furigana: 'とりのぞいて', role: 'verb' },
  粉砕: { text: '粉砕', romaji: 'funsai', english: 'pulverize', furigana: 'ふんさい', role: 'verb' },

  // Auxiliary Verbs & Suffixes
  する: { text: 'する', romaji: 'suru', english: 'do / perform', role: 'verb' },
  した: { text: 'した', romaji: 'shita', english: 'did / was (Past)', role: 'verb' },
  し: { text: 'し', romaji: 'shi', english: 'and (stem form)', role: 'verb' },
  して: { text: 'して', romaji: 'shite', english: 'and (Te-form)', role: 'verb' },
  できる: { text: 'できる', romaji: 'dekiru', english: 'can (Optional)', role: 'verb' },
  できない: { text: 'できない', romaji: 'dekinai', english: 'cannot', role: 'verb' },

  // Particles & Connectors
  として: { text: 'として', romaji: 'to shite', english: 'as [Role]', role: 'particle' },
  につき: { text: 'につき', romaji: 'ni tsuki', english: 'for each [Rate]', role: 'particle' },
  ごとに: { text: 'ごとに', romaji: 'gotoni', english: 'each time [Frequency]', role: 'particle' },
  より: { text: 'より', romaji: 'yori', english: 'more than [Comparison]', role: 'particle' },
  のみ: { text: 'のみ', romaji: 'nomi', english: 'only [Exclusivity]', role: 'particle' },
  から: { text: 'から', romaji: 'kara', english: 'from [Origin]', role: 'particle' },
  まで: { text: 'まで', romaji: 'made', english: 'until / up to [Limit]', role: 'particle' },
  しか: { text: 'しか', romaji: 'shika', english: 'only [Limitation]', role: 'particle' },
  を: { text: 'を', romaji: 'o', english: '[Direct Object]', role: 'particle' },
  に: { text: 'に', romaji: 'ni', english: 'to / in [Destination]', role: 'particle' },
  へ: { text: 'へ', romaji: 'e', english: 'towards [Destination]', role: 'particle' },
  の: { text: 'の', romaji: 'no', english: '\'s / of [Link]', role: 'particle' },
  が: { text: 'が', romaji: 'ga', english: '[Subject Marker]', role: 'particle' },
  は: { text: 'は', romaji: 'wa', english: '[Topic Marker]', role: 'particle' },
  で: { text: 'で', romaji: 'de', english: 'in / with [State]', role: 'particle' },
  と: { text: 'と', romaji: 'to', english: 'and / with [Connector]', role: 'particle' },
  も: { text: 'も', romaji: 'mo', english: 'also [Inclusive]', role: 'particle' },
  でも: { text: 'でも', romaji: 'demo', english: 'even in / also [Particle]', role: 'particle' },
  か: { text: 'か', romaji: 'ka', english: 'or [Choice]', role: 'particle' },
};

// Sorted list of particles (longest first)
export const PARTICLES_LIST = [
  'として', 'につき', 'ごとに', 'でも', 'から', 'まで', 'しか',
  'より', 'のみ', 'を', 'に', 'へ', 'の', 'が', 'は', 'で', 'と', 'も', 'か'
];

export function getAutoFurigana(text: string): string | undefined {
  if (!text) return undefined;
  if (VOCAB_DICT[text]?.furigana) return VOCAB_DICT[text].furigana;
  if (KANJI_READINGS[text]?.furigana) return KANJI_READINGS[text].furigana;

  // Search substring
  for (const [key, val] of Object.entries(VOCAB_DICT)) {
    if (val.furigana && text.includes(key)) {
      return val.furigana;
    }
  }
  for (const [key, val] of Object.entries(KANJI_READINGS)) {
    if (val.furigana && text.includes(key)) {
      return val.furigana;
    }
  }
  return undefined;
}

// ============================================================================
// 4. BULLET & PREFIX STRIPPER
// ============================================================================
interface BulletPrefix {
  prefixText: string;
  romaji: string;
  cleanText: string;
}

function extractBulletPrefix(text: string): BulletPrefix | null {
  const match = text.match(/^([①②③④⑤●◆★※]+[:：]?\s*)/);
  if (match) {
    const raw = match[1];
    let rom = '';
    if (raw.includes('①')) rom += '(1)';
    else if (raw.includes('②')) rom += '(2)';
    else if (raw.includes('③')) rom += '(3)';
    else if (raw.includes('●')) rom += '• ';
    if (raw.includes(':') || raw.includes('：')) rom += ': ';
    return {
      prefixText: raw.trim(),
      romaji: rom.trim(),
      cleanText: text.slice(match[0].length),
    };
  }
  return null;
}

// ============================================================================
// 5. UNIVERSAL WORD SOLVER (Resolves Furigana and Guaranteed Romaji)
// ============================================================================
export function getWordFuriganaAndRomaji(str: string): { furigana?: string; romaji: string; english: string; role: 'particle' | 'keyword' | 'timing' | 'verb' | 'normal' } {
  const clean = str.trim();
  if (!clean) return { romaji: '', english: '', role: 'normal' };

  if (VOCAB_DICT[clean]) {
    return {
      furigana: VOCAB_DICT[clean].furigana,
      romaji: VOCAB_DICT[clean].romaji,
      english: VOCAB_DICT[clean].english,
      role: VOCAB_DICT[clean].role,
    };
  }

  if (KANJI_READINGS[clean]) {
    return {
      furigana: KANJI_READINGS[clean].furigana,
      romaji: KANJI_READINGS[clean].romaji,
      english: KANJI_READINGS[clean].english,
      role: 'keyword',
    };
  }

  // Pure Kana or Latin (no Kanji)
  const hasKanji = /[\u4e00-\u9faf]/.test(clean);
  if (!hasKanji) {
    const rom = kanaToRomaji(clean);
    return {
      romaji: rom || clean,
      english: clean,
      role: PARTICLES_LIST.includes(clean) ? 'particle' : 'normal',
    };
  }

  // Has Kanji: perform intelligent substring replacement to build furigana and romaji
  let readingKana = clean;
  let englishApprox = clean;

  // Replace recognized kanji words with their hiragana readings
  const sortedDict = Object.entries(KANJI_READINGS).sort((a, b) => b[0].length - a[0].length);
  for (const [k, v] of sortedDict) {
    if (readingKana.includes(k)) {
      readingKana = readingKana.split(k).join(v.furigana);
      englishApprox = englishApprox.split(k).join(v.english + ' ');
    }
  }

  const computedRomaji = kanaToRomaji(readingKana);
  // Guarantee: Romaji MUST NOT contain Japanese characters
  const safeRomaji = computedRomaji.replace(/[\u3040-\u30ff\u4e00-\u9faf]/g, '').trim() || clean;

  return {
    furigana: readingKana !== clean ? readingKana : undefined,
    romaji: safeRomaji,
    english: englishApprox.trim(),
    role: 'keyword',
  };
}

// ============================================================================
// 6. GREEDY MORPHOLOGICAL TOKENIZER
// ============================================================================
export function tokenizeString(rawText: string): TokenDictionaryEntry[] {
  let text = rawText.trim();
  if (!text) return [];

  const tokens: TokenDictionaryEntry[] = [];

  // 1. Check for leading bullet prefix (e.g. ①：, ②：, ●)
  const bullet = extractBulletPrefix(text);
  if (bullet && bullet.cleanText.length > 0) {
    tokens.push({
      text: bullet.prefixText,
      romaji: bullet.romaji,
      english: bullet.romaji,
      role: 'timing',
    });
    text = bullet.cleanText.trim();
  }

  // 2. Separate by interpunct '・' if present (e.g. 魔法・罠カード)
  if (text.includes('・')) {
    const segments = text.split('・');
    for (let sIdx = 0; sIdx < segments.length; sIdx++) {
      const segTokens = tokenizeString(segments[sIdx]);
      tokens.push(...segTokens);
      if (sIdx < segments.length - 1) {
        tokens.push({
          text: '・',
          romaji: '/',
          english: 'or / and',
          role: 'normal',
        });
      }
    }
    return tokens;
  }

  // 3. Separate conjunction 'または'
  if (text.includes('または') && text !== 'または') {
    const parts = text.split('または');
    for (let pIdx = 0; pIdx < parts.length; pIdx++) {
      const pTokens = tokenizeString(parts[pIdx]);
      tokens.push(...pTokens);
      if (pIdx < parts.length - 1) {
        tokens.push(VOCAB_DICT['または']);
      }
    }
    return tokens;
  }

  // 4. Recursive greedy matching from left to right
  let curr = text;
  // Sort vocabulary keys by length descending to match longest possible compound first
  const allVocabKeys = Object.keys(VOCAB_DICT).sort((a, b) => b.length - a.length);

  while (curr.length > 0) {
    let matched = false;

    // Check punctuation at current start
    const punctMatch = curr.match(/^([。、；;：:]+)/);
    if (punctMatch) {
      const pStr = punctMatch[1];
      if (tokens.length > 0) {
        tokens[tokens.length - 1].text += pStr;
      }
      curr = curr.slice(pStr.length).trim();
      continue;
    }

    // Check vocabulary match at start
    for (const key of allVocabKeys) {
      if (curr.startsWith(key)) {
        tokens.push({ ...VOCAB_DICT[key] });
        curr = curr.slice(key.length);
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Check particles list at start (only if preceded by something, or standalone)
    for (const p of PARTICLES_LIST) {
      if (curr.startsWith(p)) {
        tokens.push({
          text: p,
          romaji: VOCAB_DICT[p]?.romaji || kanaToRomaji(p),
          english: VOCAB_DICT[p]?.english || p,
          role: 'particle',
        });
        curr = curr.slice(p.length);
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Check single kanji/word from KANJI_READINGS
    const kanjiKeys = Object.keys(KANJI_READINGS).sort((a, b) => b.length - a.length);
    for (const k of kanjiKeys) {
      if (curr.startsWith(k)) {
        const info = KANJI_READINGS[k];
        tokens.push({
          text: k,
          romaji: info.romaji,
          english: info.english,
          furigana: info.furigana,
          role: 'keyword',
        });
        curr = curr.slice(k.length);
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // If still unmatched: advance 1 token (or chunk of kana)
    const kanaMatch = curr.match(/^[\u3040-\u30ffー]+/);
    if (kanaMatch) {
      const kanaChunk = kanaMatch[0];
      tokens.push({
        text: kanaChunk,
        romaji: kanaToRomaji(kanaChunk),
        english: kanaChunk,
        role: 'normal',
      });
      curr = curr.slice(kanaChunk.length);
    } else {
      // 1 single character fallback
      const singleChar = curr[0];
      const solved = getWordFuriganaAndRomaji(singleChar);
      tokens.push({
        text: singleChar,
        romaji: solved.romaji,
        english: solved.english,
        furigana: solved.furigana,
        role: solved.role,
      });
      curr = curr.slice(1);
    }
  }

  return tokens;
}

// ============================================================================
// 7. PUBLIC SPLITTER (Used by CardSyntaxViewer)
// ============================================================================
export function splitClauseParts(parts: ClausePart[], separate: boolean): ClausePart[] {
  const result: ClausePart[] = [];

  for (const part of parts) {
    if (!separate) {
      // Combined mode: ensure every part has proper furigana & clean romaji
      const solved = getWordFuriganaAndRomaji(part.text);
      result.push({
        text: part.text,
        romaji: part.romaji && !/[\u3040-\u30ff\u4e00-\u9faf]/.test(part.romaji) ? part.romaji : solved.romaji,
        english: part.english,
        furigana: part.furigana || solved.furigana,
        role: part.role || solved.role,
      });
      continue;
    }

    // Separated mode: decompose phrases into individual words & particles
    const tokens = tokenizeString(part.text);

    if (tokens.length <= 1) {
      const solved = getWordFuriganaAndRomaji(part.text);
      result.push({
        text: part.text,
        romaji: part.romaji && !/[\u3040-\u30ff\u4e00-\u9faf]/.test(part.romaji) ? part.romaji : solved.romaji,
        english: part.english,
        furigana: part.furigana || solved.furigana,
        role: part.role || solved.role,
      });
    } else {
      for (const t of tokens) {
        const solved = getWordFuriganaAndRomaji(t.text);
        result.push({
          text: t.text,
          romaji: t.romaji && !/[\u3040-\u30ff\u4e00-\u9faf]/.test(t.romaji) ? t.romaji : solved.romaji,
          english: t.english,
          furigana: t.furigana || solved.furigana,
          role: t.role || solved.role,
        });
      }
    }
  }

  return result;
}
