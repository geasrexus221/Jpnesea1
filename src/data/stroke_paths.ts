export interface StrokeStep {
  path: string; // SVG path data in 0 0 100 100 coordinates
  start: { x: number; y: number }; // Exact starting point of the stroke
  direction: string; // Direction description
}

export interface CharacterStrokeData {
  char: string;
  strokes: StrokeStep[];
}

export const STROKE_PATHS_DB: Record<string, StrokeStep[]> = {
  // Hiragana Vowels
  'あ': [
    { path: 'M 28 38 L 72 38', start: { x: 28, y: 38 }, direction: 'Stroke 1: Left to right horizontal bar' },
    { path: 'M 50 24 Q 48 52 47 80', start: { x: 50, y: 24 }, direction: 'Stroke 2: Top to bottom through center' },
    { path: 'M 38 52 C 24 68 26 84 40 82 C 64 78 82 50 66 48 C 48 46 50 66 70 78', start: { x: 38, y: 52 }, direction: 'Stroke 3: Sweep down-left, around and loop' }
  ],
  'い': [
    { path: 'M 32 32 Q 28 58 33 76 Q 36 72 42 66', start: { x: 32, y: 32 }, direction: 'Stroke 1: Left stroke down with bottom hook' },
    { path: 'M 66 42 Q 70 54 72 66', start: { x: 66, y: 42 }, direction: 'Stroke 2: Right short stroke downward' }
  ],
  'う': [
    { path: 'M 44 24 L 56 30', start: { x: 44, y: 24 }, direction: 'Stroke 1: Short diagonal dash top-right' },
    { path: 'M 34 44 C 46 36 68 40 66 56 C 64 72 46 80 34 82', start: { x: 34, y: 44 }, direction: 'Stroke 2: Curved arch down to the left' }
  ],
  'え': [
    { path: 'M 44 24 L 56 30', start: { x: 44, y: 24 }, direction: 'Stroke 1: Top roof dash' },
    { path: 'M 36 48 L 46 40 L 64 40 L 38 72 Q 56 68 74 76', start: { x: 36, y: 48 }, direction: 'Stroke 2: Zigzag: short drop, across, diagonal down, wave out' }
  ],
  'お': [
    { path: 'M 24 38 L 56 38', start: { x: 24, y: 38 }, direction: 'Stroke 1: Horizontal bar left to right' },
    { path: 'M 46 26 L 46 64 C 46 80 34 80 32 70 C 30 56 56 50 66 60 C 76 70 68 82 58 84', start: { x: 46, y: 26 }, direction: 'Stroke 2: Vertical drop, curl into bottom loop' },
    { path: 'M 72 34 L 78 42', start: { x: 72, y: 34 }, direction: 'Stroke 3: Upper right dot dash' }
  ],

  // K-Row
  'か': [
    { path: 'M 28 36 L 62 36 Q 60 60 50 72 Q 46 72 42 68', start: { x: 28, y: 36 }, direction: 'Stroke 1: Across right, bend down with inside hook' },
    { path: 'M 36 24 Q 40 54 44 82', start: { x: 36, y: 24 }, direction: 'Stroke 2: Long vertical cross' },
    { path: 'M 70 28 L 78 38', start: { x: 70, y: 28 }, direction: 'Stroke 3: Drop dot in upper-right' }
  ],
  'き': [
    { path: 'M 28 34 L 68 34', start: { x: 28, y: 34 }, direction: 'Stroke 1: Top slanted horizontal line' },
    { path: 'M 24 48 L 72 48', start: { x: 24, y: 48 }, direction: 'Stroke 2: Second horizontal line' },
    { path: 'M 56 22 L 44 72 Q 42 72 46 68', start: { x: 56, y: 22 }, direction: 'Stroke 3: Diagonal cutting down' },
    { path: 'M 36 72 Q 52 86 66 72', start: { x: 36, y: 72 }, direction: 'Stroke 4: Bottom curved smile stroke' }
  ],
  'く': [
    { path: 'M 64 30 L 36 54 L 64 78', start: { x: 64, y: 30 }, direction: 'Stroke 1: Angle down-left, then bend down-right' }
  ],
  'け': [
    { path: 'M 28 28 Q 26 54 28 80 Q 30 78 34 72', start: { x: 28, y: 28 }, direction: 'Stroke 1: Left vertical stroke with upward hook' },
    { path: 'M 46 42 L 74 42', start: { x: 46, y: 42 }, direction: 'Stroke 2: Horizontal crossbar' },
    { path: 'M 64 26 Q 66 54 64 82', start: { x: 64, y: 26 }, direction: 'Stroke 3: Right vertical curve sweeping down' }
  ],
  'こ': [
    { path: 'M 30 40 L 68 40 Q 66 42 62 46', start: { x: 30, y: 40 }, direction: 'Stroke 1: Top horizontal with slight hook' },
    { path: 'M 30 70 Q 50 76 68 68', start: { x: 30, y: 70 }, direction: 'Stroke 2: Bottom curved floor stroke' }
  ],

  // Katakana Essentials
  // Exact alignment for Katakana ア: Horizontal bar at y = 46, vertical drop at x = 48
  'ア': [
    { path: 'M 28 46 L 68 46 L 58 64', start: { x: 28, y: 46 }, direction: 'Stroke 1: Horizontal bar left to right, bend sharply down-left' },
    { path: 'M 48 46 Q 40 68 30 88', start: { x: 48, y: 46 }, direction: 'Stroke 2: Curved sweep down to bottom-left' }
  ],
  'イ': [
    { path: 'M 58 26 L 36 60', start: { x: 58, y: 26 }, direction: 'Stroke 1: Slanted stroke down-left' },
    { path: 'M 46 48 L 46 82', start: { x: 46, y: 48 }, direction: 'Stroke 2: Straight vertical down' }
  ],
  'ウ': [
    { path: 'M 48 24 L 52 32', start: { x: 48, y: 24 }, direction: 'Stroke 1: Top short vertical dot' },
    { path: 'M 32 42 L 36 54', start: { x: 32, y: 42 }, direction: 'Stroke 2: Left short vertical' },
    { path: 'M 34 42 L 70 42 L 56 82', start: { x: 34, y: 42 }, direction: 'Stroke 3: Horizontal across, sharp sweep down-left' }
  ],
  'エ': [
    { path: 'M 32 32 L 68 32', start: { x: 32, y: 32 }, direction: 'Stroke 1: Top horizontal roof' },
    { path: 'M 50 32 L 50 72', start: { x: 50, y: 32 }, direction: 'Stroke 2: Center vertical' },
    { path: 'M 24 72 L 76 72', start: { x: 24, y: 72 }, direction: 'Stroke 3: Bottom horizontal foundation' }
  ],
  'オ': [
    { path: 'M 24 40 L 76 40', start: { x: 24, y: 40 }, direction: 'Stroke 1: Long horizontal bar' },
    { path: 'M 50 24 L 50 68 Q 48 78 40 76', start: { x: 50, y: 24 }, direction: 'Stroke 2: Center vertical with left hook' },
    { path: 'M 46 44 L 28 72', start: { x: 46, y: 44 }, direction: 'Stroke 3: Slanted leg to bottom-left' }
  ],
  'カ': [
    { path: 'M 30 36 L 68 36 L 62 58 Q 58 64 52 64', start: { x: 30, y: 36 }, direction: 'Stroke 1: Across right, hook down-left' },
    { path: 'M 46 24 Q 44 54 34 80', start: { x: 46, y: 24 }, direction: 'Stroke 2: Sweeping diagonal down-left' }
  ],
  'シ': [
    { path: 'M 32 36 L 42 42', start: { x: 32, y: 36 }, direction: 'Stroke 1: Top dot' },
    { path: 'M 30 56 L 40 62', start: { x: 30, y: 56 }, direction: 'Stroke 2: Middle dot directly below dot 1' },
    { path: 'M 34 80 Q 52 68 72 40', start: { x: 34, y: 80 }, direction: 'Stroke 3: Long stroke: Start at BOTTOM-LEFT and sweep UPWARD!' }
  ],
  'ツ': [
    { path: 'M 32 34 L 40 44', start: { x: 32, y: 34 }, direction: 'Stroke 1: Left dot' },
    { path: 'M 54 38 L 62 48', start: { x: 54, y: 38 }, direction: 'Stroke 2: Right dot placed side-by-side' },
    { path: 'M 74 30 L 40 80', start: { x: 74, y: 30 }, direction: 'Stroke 3: Long stroke: Start at TOP-RIGHT and drop DOWNWARD!' }
  ],
  'ソ': [
    { path: 'M 36 36 L 46 46', start: { x: 36, y: 36 }, direction: 'Stroke 1: Upper-left dot' },
    { path: 'M 68 30 L 38 78', start: { x: 68, y: 30 }, direction: 'Stroke 2: Slash DOWNWARD from top-right' }
  ],
  'ン': [
    { path: 'M 32 50 L 42 58', start: { x: 32, y: 50 }, direction: 'Stroke 1: Lower dot' },
    { path: 'M 34 80 Q 50 66 70 42', start: { x: 34, y: 80 }, direction: 'Stroke 2: Sweep UPWARD from bottom-left' }
  ],

  // Kanji Essentials
  '一': [
    { path: 'M 22 52 L 78 52', start: { x: 22, y: 52 }, direction: 'Stroke 1: Single horizontal line left to right' }
  ],
  '二': [
    { path: 'M 30 40 L 70 40', start: { x: 30, y: 40 }, direction: 'Stroke 1: Top shorter horizontal' },
    { path: 'M 20 66 L 80 66', start: { x: 20, y: 66 }, direction: 'Stroke 2: Bottom longer horizontal' }
  ],
  '三': [
    { path: 'M 28 32 L 72 32', start: { x: 28, y: 32 }, direction: 'Stroke 1: Top horizontal' },
    { path: 'M 34 52 L 66 52', start: { x: 34, y: 52 }, direction: 'Stroke 2: Middle shortest horizontal' },
    { path: 'M 18 72 L 82 72', start: { x: 18, y: 72 }, direction: 'Stroke 3: Bottom longest foundation horizontal' }
  ],
  '日': [
    { path: 'M 30 26 L 30 78', start: { x: 30, y: 26 }, direction: 'Stroke 1: Left vertical wall' },
    { path: 'M 30 26 L 70 26 L 70 78', start: { x: 30, y: 26 }, direction: 'Stroke 2: Top and right wall in one continuous stroke' },
    { path: 'M 30 52 L 70 52', start: { x: 30, y: 52 }, direction: 'Stroke 3: Middle horizontal bar' },
    { path: 'M 30 78 L 70 78', start: { x: 30, y: 78 }, direction: 'Stroke 4: Bottom seal stroke' }
  ],
  '人': [
    { path: 'M 52 22 Q 42 52 24 78', start: { x: 52, y: 22 }, direction: 'Stroke 1: Left falling sweep' },
    { path: 'M 44 46 Q 56 64 76 78', start: { x: 44, y: 46 }, direction: 'Stroke 2: Right supporting branch' }
  ]
};

/**
 * Returns exact SVG stroke paths and starting coordinates.
 */
export function getCharacterStrokePaths(char: string, strokeCount: number = 1): StrokeStep[] {
  if (STROKE_PATHS_DB[char]) {
    return STROKE_PATHS_DB[char];
  }

  // Fallback procedural strokes according to stroke count
  const fallbacks: StrokeStep[] = [];
  if (strokeCount === 1) {
    fallbacks.push({
      path: 'M 30 40 Q 50 34 70 54 Q 60 80 34 76',
      start: { x: 30, y: 40 },
      direction: 'Stroke 1: Start at top-left and follow the guide'
    });
  } else if (strokeCount === 2) {
    fallbacks.push({ path: 'M 28 40 L 72 40', start: { x: 28, y: 40 }, direction: 'Stroke 1: Top horizontal' });
    fallbacks.push({ path: 'M 50 28 L 50 80', start: { x: 50, y: 28 }, direction: 'Stroke 2: Center vertical' });
  } else {
    for (let i = 0; i < Math.min(strokeCount, 5); i++) {
      const y = 34 + i * (44 / Math.max(1, strokeCount - 1));
      fallbacks.push({
        path: `M 30 ${y} L 70 ${y}`,
        start: { x: 30, y },
        direction: `Stroke ${i + 1}: Follow character form`
      });
    }
  }

  return fallbacks;
}
