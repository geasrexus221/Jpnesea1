import { ClausePart } from '../types/yugioh';

interface ParticleMatch {
  particle: string;
  romaji: string;
  english: string;
}

const PARTICLES_LIST: ParticleMatch[] = [
  { particle: 'として', romaji: 'to shite', english: 'as [Role]' },
  { particle: 'から', romaji: 'kara', english: 'from [Origin]' },
  { particle: 'まで', romaji: 'made', english: 'until / up to [Limit]' },
  { particle: 'しか', romaji: 'shika', english: 'only [Restriction]' },
  { particle: 'を', romaji: 'o', english: '[Object Marker]' },
  { particle: 'に', romaji: 'ni', english: 'to / at [Destination]' },
  { particle: 'へ', romaji: 'e', english: 'towards [Destination]' },
  { particle: 'の', romaji: 'no', english: '\'s / of [Link]' },
  { particle: 'が', romaji: 'ga', english: '[Subject Marker]' },
  { particle: 'は', romaji: 'wa', english: '[Topic Marker]' },
  { particle: 'で', romaji: 'de', english: 'in / with [State]' },
  { particle: 'と', romaji: 'to', english: 'and / with [Connector]' },
];

export function splitClauseParts(parts: ClausePart[], separate: boolean): ClausePart[] {
  if (!separate) return parts;

  const result: ClausePart[] = [];

  for (const part of parts) {
    // If the part is already just a standalone particle or very short, keep it
    if (part.role === 'particle' && part.text.length <= 3 && !part.text.includes('モンスター') && !part.text.includes('カード')) {
      result.push(part);
      continue;
    }

    // Check if the part text ends with punctuation like '、', '：', '；'
    let textToMatch = part.text;
    let trailingPunctuation = '';
    const lastChar = textToMatch.slice(-1);
    if (['、', '：', '；', ':', ';', '。'].includes(lastChar)) {
      trailingPunctuation = lastChar;
      textToMatch = textToMatch.slice(0, -1);
    }

    let matched: ParticleMatch | null = null;
    for (const p of PARTICLES_LIST) {
      if (textToMatch.endsWith(p.particle) && textToMatch.length > p.particle.length) {
        matched = p;
        break;
      }
    }

    if (!matched) {
      // No detachable particle at the end, keep original
      result.push(part);
      continue;
    }

    // Split root text and particle
    const rootText = textToMatch.slice(0, -matched.particle.length);
    const particleText = matched.particle + trailingPunctuation;

    // Split Romaji
    let rootRomaji = part.romaji;
    let particleRomaji = matched.romaji + (trailingPunctuation ? trailingPunctuation : '');
    const cleanRomaji = part.romaji.trim();
    if (cleanRomaji.endsWith(matched.romaji)) {
      rootRomaji = cleanRomaji.slice(0, -matched.romaji.length).trim();
    } else {
      // Fallback: search last word
      const words = cleanRomaji.split(' ');
      if (words.length > 1 && words[words.length - 1].toLowerCase() === matched.romaji.toLowerCase()) {
        rootRomaji = words.slice(0, -1).join(' ');
      }
    }

    // Clean English gloss for root
    let rootEnglish = part.english;
    rootEnglish = rootEnglish
      .replace(/\s*\(Obj\)/i, '')
      .replace(/\s*\(Dest\)/i, '')
      .replace(/\s*\(Origin\)/i, '')
      .replace(/\s*\(Subject\)/i, '')
      .replace(/\s*\(Topic\)/i, '')
      .replace(/\s*\(Counter\)/i, '')
      .replace(/\s*\(Loc\)/i, '')
      .replace(/\s*\(State\)/i, '')
      .replace(/\s*\(Link\)/i, '')
      .trim();

    if (matched.particle === 'の' && rootEnglish.endsWith("'s")) {
      rootEnglish = rootEnglish.slice(0, -2).trim();
    }
    if (matched.particle === 'から' && rootEnglish.toLowerCase().startsWith('from ')) {
      rootEnglish = rootEnglish.slice(5).trim();
    }
    if (matched.particle === 'に' && rootEnglish.toLowerCase().startsWith('to ')) {
      rootEnglish = rootEnglish.slice(3).trim();
    }
    if (matched.particle === 'として' && rootEnglish.toLowerCase().startsWith('as ')) {
      rootEnglish = rootEnglish.slice(3).trim();
    }

    // Root Part
    result.push({
      text: rootText,
      romaji: rootRomaji,
      english: rootEnglish,
      furigana: part.furigana, // preserve furigana on the root
      role: part.role === 'particle' ? 'keyword' : part.role || 'normal',
    });

    // Separated Particle Part
    result.push({
      text: particleText,
      romaji: particleRomaji,
      english: matched.english,
      role: 'particle',
    });
  }

  return result;
}
