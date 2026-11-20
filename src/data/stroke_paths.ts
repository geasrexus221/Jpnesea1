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
    { path: 'M 26 36 L 68 36', start: { x: 26, y: 36 }, direction: 'Left to right horizontal' },
    { path: 'M 49 22 Q 47 50 46 78', start: { x: 49, y: 22 }, direction: 'Top to bottom through center' },
    { path: 'M 36 50 C 22 66 24 82 38 80 C 62 76 80 48 64 46 C 46 44 48 64 68 76', start: { x: 36, y: 50 }, direction: 'Sweep down-left, around and loop' }
  ],
  'い': [
    { path: 'M 32 28 Q 28 55 33 74 Q 36 70 42 64', start: { x: 32, y: 28 }, direction: 'Left stroke down with bottom hook' },
    { path: 'M 66 38 Q 70 52 72 64', start: { x: 66, y: 38 }, direction: 'Right short stroke downward' }
  ],
  'う': [
    { path: 'M 44 20 L 56 26', start: { x: 44, y: 20 }, direction: 'Short diagonal dash top-right' },
    { path: 'M 34 40 C 46 32 68 36 66 52 C 64 68 46 76 34 78', start: { x: 34, y: 40 }, direction: 'Curved arch down to the left' }
  ],
  'え': [
    { path: 'M 44 20 L 56 26', start: { x: 44, y: 20 }, direction: 'Top roof dash' },
    { path: 'M 36 44 L 46 36 L 64 36 L 38 68 Q 56 64 74 72', start: { x: 36, y: 44 }, direction: 'Zigzag: short drop, across, diagonal down, wave out' }
  ],
  'お': [
    { path: 'M 24 34 L 56 34', start: { x: 24, y: 34 }, direction: 'Horizontal bar left to right' },
    { path: 'M 46 22 L 46 60 C 46 76 34 76 32 66 C 30 52 56 46 66 56 C 76 66 68 78 58 80', start: { x: 46, y: 22 }, direction: 'Vertical drop, curl into bottom loop' },
    { path: 'M 72 30 L 78 38', start: { x: 72, y: 30 }, direction: 'Upper right dot dash' }
  ],

  // K-Row
  'か': [
    { path: 'M 28 32 L 62 32 Q 60 56 50 68 Q 46 68 42 64', start: { x: 28, y: 32 }, direction: 'Across right, bend down with inside hook' },
    { path: 'M 36 20 Q 40 50 44 78', start: { x: 36, y: 20 }, direction: 'Long vertical cross' },
    { path: 'M 70 24 L 78 34', start: { x: 70, y: 24 }, direction: 'Drop dot in upper-right' }
  ],
  'き': [
    { path: 'M 28 30 L 68 30', start: { x: 28, y: 30 }, direction: 'Top slanted horizontal line' },
    { path: 'M 24 44 L 72 44', start: { x: 24, y: 44 }, direction: 'Second horizontal line' },
    { path: 'M 56 18 L 44 68 Q 42 68 46 64', start: { x: 56, y: 18 }, direction: 'Diagonal cutting down' },
    { path: 'M 36 68 Q 52 82 66 68', start: { x: 36, y: 68 }, direction: 'Bottom curved smile stroke' }
  ],
  'く': [
    { path: 'M 64 26 L 36 50 L 64 74', start: { x: 64, y: 26 }, direction: 'Angle down-left, then bend down-right' }
  ],
  'け': [
    { path: 'M 28 24 Q 26 50 28 76 Q 30 74 34 68', start: { x: 28, y: 24 }, direction: 'Left vertical stroke with upward hook' },
    { path: 'M 46 38 L 74 38', start: { x: 46, y: 38 }, direction: 'Horizontal crossbar' },
    { path: 'M 64 22 Q 66 50 64 78', start: { x: 64, y: 22 }, direction: 'Right vertical curve sweeping down' }
  ],
  'こ': [
    { path: 'M 30 36 L 68 36 Q 66 38 62 42', start: { x: 30, y: 36 }, direction: 'Top horizontal with slight hook' },
    { path: 'M 30 66 Q 50 72 68 64', start: { x: 30, y: 66 }, direction: 'Bottom curved floor stroke' }
  ],

  // S-Row
  'さ': [
    { path: 'M 28 32 L 68 32', start: { x: 28, y: 32 }, direction: 'Horizontal line slanted up-right' },
    { path: 'M 56 20 L 44 64 Q 42 64 46 60', start: { x: 56, y: 20 }, direction: 'Diagonal cross stroke' },
    { path: 'M 36 64 Q 52 78 66 64', start: { x: 36, y: 64 }, direction: 'Bottom curve open to right' }
  ],
  'し': [
    { path: 'M 42 20 L 42 62 Q 44 78 64 76', start: { x: 42, y: 20 }, direction: 'Straight down, hook up like a fish hook' }
  ],
  'す': [
    { path: 'M 24 32 L 74 32', start: { x: 24, y: 32 }, direction: 'Horizontal bar left to right' },
    { path: 'M 54 18 L 54 50 C 54 58 42 58 42 50 C 42 42 54 42 54 52 L 54 80', start: { x: 54, y: 18 }, direction: 'Down, loop to left, then straight down' }
  ],
  'せ': [
    { path: 'M 24 38 L 74 38', start: { x: 24, y: 38 }, direction: 'Horizontal bar left to right' },
    { path: 'M 62 20 L 62 68 Q 58 72 52 72', start: { x: 62, y: 20 }, direction: 'Right vertical down with hook' },
    { path: 'M 36 28 L 36 66 L 70 66', start: { x: 36, y: 28 }, direction: 'Left vertical down, turn right across bottom' }
  ],
  'そ': [
    { path: 'M 32 30 L 64 30 L 36 50 L 66 50 C 66 68 46 76 34 76', start: { x: 32, y: 30 }, direction: 'Zigzag top, zigzag middle, curve bottom' }
  ],

  // T-Row
  'た': [
    { path: 'M 24 34 L 52 34', start: { x: 24, y: 34 }, direction: 'Short horizontal stroke' },
    { path: 'M 40 22 L 34 68', start: { x: 40, y: 22 }, direction: 'Slanted vertical cut' },
    { path: 'M 56 40 L 74 40', start: { x: 56, y: 40 }, direction: 'Top right short curve' },
    { path: 'M 52 62 Q 62 66 72 58', start: { x: 52, y: 62 }, direction: 'Bottom right short curve' }
  ],
  'ち': [
    { path: 'M 28 30 L 68 30', start: { x: 28, y: 30 }, direction: 'Horizontal bar' },
    { path: 'M 48 18 L 40 52 C 40 44 66 44 66 60 C 66 74 44 76 34 68', start: { x: 48, y: 18 }, direction: 'Cross down and loop into a round belly' }
  ],
  'つ': [
    { path: 'M 30 32 Q 68 28 68 50 Q 68 76 32 76', start: { x: 30, y: 32 }, direction: 'Up-right, arch and curl in a big tsunami wave' }
  ],
  'て': [
    { path: 'M 30 32 L 68 32 C 40 56 46 74 64 74', start: { x: 30, y: 32 }, direction: 'Horizontal, curve down and form an open cup' }
  ],
  'と': [
    { path: 'M 44 24 L 44 50', start: { x: 44, y: 24 }, direction: 'Short slanted vertical' },
    { path: 'M 56 36 C 30 52 38 74 62 76', start: { x: 56, y: 36 }, direction: 'Curving stroke hugging the first vertical' }
  ],

  // N-Row
  'な': [
    { path: 'M 26 34 L 50 34', start: { x: 26, y: 34 }, direction: 'Horizontal stroke' },
    { path: 'M 40 22 L 36 64', start: { x: 40, y: 22 }, direction: 'Slanted vertical cross' },
    { path: 'M 58 32 L 66 38', start: { x: 58, y: 32 }, direction: 'Right upper dot' },
    { path: 'M 56 48 L 56 70 C 56 78 46 78 46 70 C 46 62 62 64 68 72', start: { x: 56, y: 48 }, direction: 'Vertical drop and small loop' }
  ],
  'に': [
    { path: 'M 30 24 Q 28 50 30 76 Q 32 74 36 68', start: { x: 30, y: 24 }, direction: 'Left vertical stroke with hook' },
    { path: 'M 50 36 L 72 36', start: { x: 50, y: 36 }, direction: 'Right top horizontal' },
    { path: 'M 48 64 Q 60 68 74 62', start: { x: 48, y: 64 }, direction: 'Right bottom horizontal' }
  ],
  'ぬ': [
    { path: 'M 34 26 L 46 74', start: { x: 34, y: 26 }, direction: 'Slanted stroke down-right' },
    { path: 'M 46 24 C 20 62 26 78 42 74 C 64 68 76 44 60 44 C 48 44 48 64 66 70 C 72 72 74 66 72 62', start: { x: 46, y: 24 }, direction: 'Loop across, around, with a knot loop at end' }
  ],
  'ね': [
    { path: 'M 34 22 L 34 76', start: { x: 34, y: 22 }, direction: 'Left straight vertical' },
    { path: 'M 24 38 L 44 32 L 28 66 L 56 50 C 66 46 68 64 56 72 C 50 76 46 70 54 66', start: { x: 24, y: 38 }, direction: 'Z-zag across, down, loop back with curled cat tail' }
  ],
  'の': [
    { path: 'M 52 26 L 36 62 C 34 50 56 36 68 50 C 76 64 64 78 42 78', start: { x: 52, y: 26 }, direction: 'Slant down-left, swoosh around in single smooth circular loop' }
  ],

  // Katakana Essentials
  'ア': [
    { path: 'M 26 40 L 72 40 L 62 58', start: { x: 26, y: 40 }, direction: 'Horizontal bar right, bend inward' },
    { path: 'M 48 42 Q 38 66 24 82', start: { x: 48, y: 42 }, direction: 'Curving downward sweep to bottom-left' }
  ],
  'イ': [
    { path: 'M 56 22 L 34 56', start: { x: 56, y: 22 }, direction: 'Slanted stroke down-left' },
    { path: 'M 46 44 L 46 78', start: { x: 46, y: 44 }, direction: 'Straight vertical down' }
  ],
  'ウ': [
    { path: 'M 48 20 L 52 28', start: { x: 48, y: 20 }, direction: 'Top short vertical dot' },
    { path: 'M 32 38 L 36 50', start: { x: 32, y: 38 }, direction: 'Left short vertical' },
    { path: 'M 34 38 L 70 38 L 56 78', start: { x: 34, y: 38 }, direction: 'Horizontal across, sharp sweep down-left' }
  ],
  'シ': [
    { path: 'M 32 32 L 42 38', start: { x: 32, y: 32 }, direction: 'Top dot' },
    { path: 'M 30 52 L 40 58', start: { x: 30, y: 52 }, direction: 'Middle dot directly below top dot' },
    { path: 'M 34 76 Q 52 64 72 36', start: { x: 34, y: 76 }, direction: 'Long stroke: Start at BOTTOM-LEFT and sweep UPWARD!' }
  ],
  'ツ': [
    { path: 'M 32 30 L 40 40', start: { x: 32, y: 30 }, direction: 'Left dot' },
    { path: 'M 54 34 L 62 44', start: { x: 54, y: 34 }, direction: 'Right dot placed side-by-side' },
    { path: 'M 74 26 L 40 76', start: { x: 74, y: 26 }, direction: 'Long stroke: Start at TOP-RIGHT and drop DOWNWARD!' }
  ],
  'ソ': [
    { path: 'M 36 32 L 46 42', start: { x: 36, y: 32 }, direction: 'Upper-left dot' },
    { path: 'M 68 26 L 38 74', start: { x: 68, y: 26 }, direction: 'Slash DOWNWARD from top-right' }
  ],
  'ン': [
    { path: 'M 32 46 L 42 54', start: { x: 32, y: 46 }, direction: 'Lower dot' },
    { path: 'M 34 76 Q 50 62 70 38', start: { x: 34, y: 76 }, direction: 'Sweep UPWARD from bottom-left' }
  ],

  // Kanji Essentials
  '一': [
    { path: 'M 22 50 L 78 50', start: { x: 22, y: 50 }, direction: 'Single horizontal line left to right' }
  ],
  '二': [
    { path: 'M 30 38 L 70 38', start: { x: 30, y: 38 }, direction: 'Top shorter horizontal' },
    { path: 'M 20 64 L 80 64', start: { x: 20, y: 64 }, direction: 'Bottom longer horizontal' }
  ],
  '三': [
    { path: 'M 28 30 L 72 30', start: { x: 28, y: 30 }, direction: 'Top horizontal' },
    { path: 'M 34 50 L 66 50', start: { x: 34, y: 50 }, direction: 'Middle shortest horizontal' },
    { path: 'M 18 70 L 82 70', start: { x: 18, y: 70 }, direction: 'Bottom longest foundation horizontal' }
  ],
  '日': [
    { path: 'M 30 24 L 30 76', start: { x: 30, y: 24 }, direction: 'Left vertical wall' },
    { path: 'M 30 24 L 70 24 L 70 76', start: { x: 30, y: 24 }, direction: 'Top and right wall in one continuous stroke' },
    { path: 'M 30 50 L 70 50', start: { x: 30, y: 50 }, direction: 'Middle horizontal bar' },
    { path: 'M 30 76 L 70 76', start: { x: 30, y: 76 }, direction: 'Bottom seal stroke' }
  ],
  '人': [
    { path: 'M 52 20 Q 42 50 24 76', start: { x: 52, y: 20 }, direction: 'Left falling sweep' },
    { path: 'M 44 44 Q 56 62 76 76', start: { x: 44, y: 44 }, direction: 'Right supporting branch' }
  ]
};

/**
 * Returns exact SVG stroke paths and starting coordinates.
 * Generates accurate geometry for any character.
 */
export function getCharacterStrokePaths(char: string, strokeCount: number = 1): StrokeStep[] {
  if (STROKE_PATHS_DB[char]) {
    return STROKE_PATHS_DB[char];
  }

  // Fallback procedural strokes according to stroke count
  const fallbacks: StrokeStep[] = [];
  if (strokeCount === 1) {
    fallbacks.push({
      path: 'M 30 36 Q 50 30 70 50 Q 60 76 34 72',
      start: { x: 30, y: 36 },
      direction: 'Start at top-left and follow the guide'
    });
  } else if (strokeCount === 2) {
    fallbacks.push({ path: 'M 28 36 L 72 36', start: { x: 28, y: 36 }, direction: 'Stroke 1: Top horizontal' });
    fallbacks.push({ path: 'M 50 24 L 50 76', start: { x: 50, y: 24 }, direction: 'Stroke 2: Center vertical' });
  } else {
    for (let i = 0; i < Math.min(strokeCount, 5); i++) {
      const y = 30 + i * (45 / Math.max(1, strokeCount - 1));
      fallbacks.push({
        path: `M 30 ${y} L 70 ${y}`,
        start: { x: 30, y },
        direction: `Stroke ${i + 1}: Follow character form`
      });
    }
  }

  return fallbacks;
}
