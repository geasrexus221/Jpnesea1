import { ClauseType, ParsedClause, ParsedSentence } from '../types/yugioh';

const RECOGNIZED_KEYWORDS = [
  '特殊召喚',
  '召喚',
  '破壊',
  '除外',
  '墓地',
  '手札',
  'デッキ',
  'フィールド',
  '無効',
  'リリース',
  'ドロー',
  '対象',
  '守備表示',
  '攻撃表示',
  '攻撃力',
  '守備力',
  '効果',
  '魔法',
  '罠',
  'モンスター',
];

const PARTICLES = ['を', 'に', 'へ', 'から', 'まで', 'として', 'しか', 'で'];

export function parseCardText(rawText: string): ParsedSentence[] {
  if (!rawText.trim()) return [];

  // Split lines or sentences by Japanese period '。' or newline
  const rawSentences = rawText
    .split(/\n+/)
    .flatMap((line) => {
      const parts = line.split('。');
      return parts
        .map((p, idx) => (idx < parts.length - 1 ? p + '。' : p))
        .filter((p) => p.trim().length > 0);
    });

  return rawSentences.map((sentenceStr, sentenceIdx) => {
    const text = sentenceStr.trim();
    const clauses: ParsedClause[] = [];

    // 1. Check for Turn Limitation Clause (HOPT/SOPT)
    if (
      text.includes('ターンに１度') ||
      text.includes('ターンに1度') ||
      text.includes('しか使用できない') ||
      text.includes('しか発動できない')
    ) {
      clauses.push(createClause(`s${sentenceIdx}-hopt`, 'restriction', text, 'Turn Limitation (Once per turn clause)'));
      return { originalText: text, clauses };
    }

    // 2. Check for Colon & Semicolon PSCT Structure
    const hasColon = text.includes('：') || text.includes(':');
    const hasSemicolon = text.includes('；') || text.includes(';');

    const colonChar = text.includes('：') ? '：' : ':';
    const semiChar = text.includes('；') ? '；' : ';';

    if (hasColon) {
      const colonSplit = text.split(colonChar);
      const conditionPart = colonSplit[0] + colonChar;
      const rest = colonSplit.slice(1).join(colonChar);

      clauses.push(createClause(`s${sentenceIdx}-cond`, 'condition', conditionPart, 'Activation Condition (When / If)'));

      if (rest.includes(semiChar)) {
        const semiSplit = rest.split(semiChar);
        const costPart = semiSplit[0] + semiChar;
        const resolutionPart = semiSplit.slice(1).join(semiChar);

        if (costPart.trim()) {
          clauses.push(createClause(`s${sentenceIdx}-cost`, 'cost_target', costPart, 'Cost & Targeting Clause'));
        }
        if (resolutionPart.trim()) {
          clauses.push(createClause(`s${sentenceIdx}-res`, 'resolution', resolutionPart, 'Effect Resolution'));
        }
      } else {
        if (rest.trim()) {
          clauses.push(createClause(`s${sentenceIdx}-res`, 'resolution', rest, 'Effect Resolution'));
        }
      }
    } else if (hasSemicolon) {
      const semiSplit = text.split(semiChar);
      const costPart = semiSplit[0] + semiChar;
      const resolutionPart = semiSplit.slice(1).join(semiChar);

      if (costPart.trim()) {
        clauses.push(createClause(`s${sentenceIdx}-cost`, 'cost_target', costPart, 'Cost & Targeting Clause'));
      }
      if (resolutionPart.trim()) {
        clauses.push(createClause(`s${sentenceIdx}-res`, 'resolution', resolutionPart, 'Effect Resolution'));
      }
    } else {
      // Standalone sentence or flavour text
      if (text.includes('対象として発動できる') || text.includes('捨てて発動できる') || text.includes('リリースして発動できる')) {
        clauses.push(createClause(`s${sentenceIdx}-cost`, 'cost_target', text, 'Cost & Targeting Clause'));
      } else {
        clauses.push(createClause(`s${sentenceIdx}-res`, 'resolution', text, 'Effect Resolution / Text'));
      }
    }

    return {
      originalText: text,
      clauses,
    };
  });
}

function createClause(id: string, type: ClauseType, text: string, roleDescription: string): ParsedClause {
  const foundKeywords = RECOGNIZED_KEYWORDS.filter((kw) => text.includes(kw));
  const foundParticles = PARTICLES.filter((p) => {
    if (p === 'として') return text.includes('として');
    if (p === 'しか') return text.includes('しか');
    if (p === 'から') return text.includes('から');
    if (p === 'まで') return text.includes('まで');
    return text.includes(p);
  });

  return {
    id,
    type,
    text,
    roleDescription,
    particlesFound: foundKeywords.length ? foundParticles : foundParticles.slice(0, 3),
    keywordsFound: foundKeywords,
  };
}
