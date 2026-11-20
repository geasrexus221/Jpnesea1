export interface StrokeGuideInfo {
  startPoints: { x: number; y: number; label: string }[];
  steps: string[];
}

export const STROKE_GUIDES: Record<string, StrokeGuideInfo> = {
  // Hiragana Vowels
  'あ': {
    startPoints: [
      { x: 32, y: 28, label: '①' },
      { x: 50, y: 18, label: '②' },
      { x: 38, y: 48, label: '③' },
    ],
    steps: [
      '① Short horizontal bar: Draw left to right near the top.',
      '② Vertical curved stroke: Pierce down through the center.',
      '③ Looping body: Start from bottom-left, sweep up and around in a big loop.',
    ],
  },
  'い': {
    startPoints: [
      { x: 30, y: 24, label: '①' },
      { x: 68, y: 34, label: '②' },
    ],
    steps: [
      '① Left long stroke: Curve downward and flick slightly upward at the end.',
      '② Right short stroke: Shorter curved stroke on the right side.',
    ],
  },
  'う': {
    startPoints: [
      { x: 48, y: 20, label: '①' },
      { x: 32, y: 42, label: '②' },
    ],
    steps: [
      '① Top accent dash: Short diagonal stroke from top-left to bottom-right.',
      '② Main curve: Start on the left, loop across top-right, and curve down like a backward C.',
    ],
  },
  'え': {
    startPoints: [
      { x: 48, y: 20, label: '①' },
      { x: 32, y: 44, label: '②' },
    ],
    steps: [
      '① Top roof dash: Short diagonal stroke at top-center.',
      '② Continuous zigzag: Short vertical drop, rise up to the right, drop diagonally down-left, and surf out with a wave.',
    ],
  },
  'お': {
    startPoints: [
      { x: 26, y: 32, label: '①' },
      { x: 50, y: 20, label: '②' },
      { x: 74, y: 32, label: '③' },
    ],
    steps: [
      '① Short horizontal line at top-left.',
      '② Vertical stroke down, looping around the bottom into a wide circle.',
      '③ Upper right dot placed last.',
    ],
  },

  // K-Row
  'か': {
    startPoints: [
      { x: 32, y: 30, label: '①' },
      { x: 36, y: 20, label: '②' },
      { x: 70, y: 24, label: '③' },
    ],
    steps: [
      '① Main hook: Horizontal right, bend downward with an inward hook.',
      '② Curved vertical stroke crossing through.',
      '③ Flying drop dot placed in upper-right.',
    ],
  },
  'き': {
    startPoints: [
      { x: 30, y: 28, label: '①' },
      { x: 28, y: 42, label: '②' },
      { x: 54, y: 18, label: '③' },
      { x: 38, y: 72, label: '④' },
    ],
    steps: [
      '① Top slanted horizontal line.',
      '② Second parallel horizontal line.',
      '③ Diagonal stroke cutting down through both lines.',
      '④ Bottom detached curved smile stroke.',
    ],
  },
  'く': {
    startPoints: [{ x: 62, y: 26, label: '①' }],
    steps: [
      '① Single stroke: Slant down-left like a bird beak (<), then bend down-right.',
    ],
  },
  'け': {
    startPoints: [
      { x: 28, y: 24, label: '①' },
      { x: 48, y: 36, label: '②' },
      { x: 68, y: 22, label: '③' },
    ],
    steps: [
      '① Left vertical stroke with upward hook at the bottom.',
      '② Right horizontal crossbar.',
      '③ Right vertical stroke sweeping gracefully down.',
    ],
  },
  'こ': {
    startPoints: [
      { x: 32, y: 34, label: '①' },
      { x: 30, y: 66, label: '②' },
    ],
    steps: [
      '① Top horizontal stroke: Left to right with slight downward hook.',
      '② Bottom curved horizontal floor stroke.',
    ],
  },

  // S-Row
  'さ': {
    startPoints: [
      { x: 30, y: 32, label: '①' },
      { x: 58, y: 22, label: '②' },
      { x: 38, y: 68, label: '③' },
    ],
    steps: [
      '① Slanted horizontal stroke (left to right).',
      '② Diagonal line cutting down and hooking slightly.',
      '③ Bottom curved loop pointing right.',
    ],
  },
  'し': {
    startPoints: [{ x: 42, y: 20, label: '①' }],
    steps: [
      '① Single continuous stroke: Straight down from top, then curl upward like a fish hook.',
    ],
  },
  'す': {
    startPoints: [
      { x: 26, y: 32, label: '①' },
      { x: 56, y: 18, label: '②' },
    ],
    steps: [
      '① Horizontal line (left to right).',
      '② Vertical drop: Cut through horizontal, form a loop on the left, and sweep straight down.',
    ],
  },

  // T-Row
  'た': {
    startPoints: [
      { x: 24, y: 34, label: '①' },
      { x: 44, y: 24, label: '②' },
      { x: 56, y: 44, label: '③' },
      { x: 52, y: 66, label: '④' },
    ],
    steps: [
      '① Left horizontal stroke.',
      '② Slanted vertical crossing stroke.',
      '③ Top small right horizontal curve.',
      '④ Bottom small right horizontal curve.',
    ],
  },
  'ち': {
    startPoints: [
      { x: 30, y: 30, label: '①' },
      { x: 48, y: 18, label: '②' },
    ],
    steps: [
      '① Slanted horizontal bar.',
      '② Vertical drop through the bar, curving into a big belly on the right.',
    ],
  },
  'つ': {
    startPoints: [{ x: 30, y: 32, label: '①' }],
    steps: [
      '① Single stroke: Short rise to the right, sweeping in a big tsunami wave curve down and left.',
    ],
  },

  // Katakana highlights
  'シ': {
    startPoints: [
      { x: 30, y: 30, label: '①' },
      { x: 28, y: 50, label: '②' },
      { x: 36, y: 78, label: '③' },
    ],
    steps: [
      '① Top short dot.',
      '② Middle short dot (stacked vertically below dot 1).',
      '③ Long stroke: Start at BOTTOM-LEFT and sweep UPWARD toward top-right.',
    ],
  },
  'ツ': {
    startPoints: [
      { x: 32, y: 28, label: '①' },
      { x: 54, y: 32, label: '②' },
      { x: 74, y: 24, label: '③' },
    ],
    steps: [
      '① Left raindrop dot.',
      '② Right raindrop dot (positioned horizontally next to dot 1).',
      '③ Long stroke: Start at TOP-RIGHT and slash DOWNWARD like falling rain.',
    ],
  },
  'ソ': {
    startPoints: [
      { x: 34, y: 32, label: '①' },
      { x: 72, y: 24, label: '②' },
    ],
    steps: [
      '① Top-left diagonal dot.',
      '② Long stroke: Starts at top-right and drops DOWNWARD to bottom-left.',
    ],
  },
  'ン': {
    startPoints: [
      { x: 30, y: 46, label: '①' },
      { x: 36, y: 78, label: '②' },
    ],
    steps: [
      '① Lower diagonal dot.',
      '② Long stroke: Starts at bottom-left and sweeps UPWARD to top-right.',
    ],
  },

  // Kanji highlights
  '一': {
    startPoints: [{ x: 20, y: 50, label: '①' }],
    steps: ['① Single steady horizontal stroke from left to right.'],
  },
  '二': {
    startPoints: [
      { x: 30, y: 36, label: '①' },
      { x: 18, y: 64, label: '②' },
    ],
    steps: [
      '① Shorter top horizontal stroke (left to right).',
      '② Longer bottom foundation horizontal stroke (left to right).',
    ],
  },
  '三': {
    startPoints: [
      { x: 26, y: 28, label: '①' },
      { x: 32, y: 50, label: '②' },
      { x: 16, y: 72, label: '③' },
    ],
    steps: [
      '① Top horizontal stroke.',
      '② Middle shortest horizontal stroke.',
      '③ Bottom longest horizontal stroke.',
    ],
  },
  '日': {
    startPoints: [
      { x: 28, y: 22, label: '①' },
      { x: 30, y: 24, label: '②' },
      { x: 30, y: 52, label: '③' },
      { x: 28, y: 80, label: '④' },
    ],
    steps: [
      '① Left vertical wall (top to bottom).',
      '② Top and right corner wall in one continuous stroke.',
      '③ Middle horizontal window bar.',
      '④ Bottom seal stroke (close the room last!).',
    ],
  },
};

/**
 * Returns stroke starting points and step instructions for any character.
 * Falls back to universal stroke order defaults if not specifically defined.
 */
export function getStrokeGuide(character: string, strokeCount: number = 1): StrokeGuideInfo {
  if (STROKE_GUIDES[character]) {
    return STROKE_GUIDES[character];
  }

  // Universal fallback start points based on standard stroke order
  const startPoints = [];
  if (strokeCount >= 1) startPoints.push({ x: 30, y: 26, label: '①' });
  if (strokeCount >= 2) startPoints.push({ x: 52, y: 22, label: '②' });
  if (strokeCount >= 3) startPoints.push({ x: 36, y: 62, label: '③' });
  if (strokeCount >= 4) startPoints.push({ x: 68, y: 64, label: '④' });

  const steps = [
    `① Start near the top-left indicator and follow the ghost stroke.`,
    strokeCount > 1 ? `② Proceed from top to bottom, left to right.` : '',
    strokeCount > 2 ? `③ Complete the remaining ${strokeCount - 2} strokes.` : '',
  ].filter(Boolean);

  return { startPoints, steps };
}
