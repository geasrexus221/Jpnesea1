export interface StrokeRule {
  id: string;
  ruleNumber: number;
  title: string;
  titleJapanese: string;
  description: string;
  exampleChars: { char: string; romaji: string; explanation: string }[];
  proTip: string;
}

export const STROKE_RULES: StrokeRule[] = [
  {
    id: 'rule_top_to_bottom',
    ruleNumber: 1,
    title: 'Top to Bottom',
    titleJapanese: '上から下へ',
    description: 'When strokes are stacked vertically, always draw the top strokes first and work your way downward.',
    exampleChars: [
      { char: '三', romaji: 'san (3)', explanation: 'Draw the top horizontal stroke first, middle second, bottom stroke last.' },
      { char: '言', romaji: 'gen / koto', explanation: 'Start with the top dot/dash, then horizontal lines, then the mouth box below.' },
      { char: '工', romaji: 'kou', explanation: 'Top roof line, then central vertical, then bottom foundation line.' }
    ],
    proTip: 'In Hiragana, characters like う (u) and え (e) always start with the short top dash before the main body.'
  },
  {
    id: 'rule_left_to_right',
    ruleNumber: 2,
    title: 'Left to Right',
    titleJapanese: '左から右へ',
    description: 'When strokes or radicals are positioned side by side, always start from the left and move to the right.',
    exampleChars: [
      { char: '川', romaji: 'kawa (river)', explanation: 'Draw the leftmost curved vertical, then middle short vertical, then right long vertical.' },
      { char: '州', romaji: 'shuu (state)', explanation: 'Work column by column from left to right.' },
      { char: 'い', romaji: 'i (Hiragana)', explanation: 'Draw the left stroke first with its hook, then the right shorter stroke.' }
    ],
    proTip: 'Compound Kanji made of two halves (like 休 or 語) almost always have the left radical drawn entirely before the right half.'
  },
  {
    id: 'rule_horizontal_first',
    ruleNumber: 3,
    title: 'Horizontal Before Vertical',
    titleJapanese: '横が先、縦が後',
    description: 'When a horizontal stroke crosses a vertical stroke, write the horizontal stroke first.',
    exampleChars: [
      { char: '十', romaji: 'juu (10)', explanation: 'Draw the horizontal crossbar (一) first, then cut through with the vertical stroke (丨).' },
      { char: '七', romaji: 'nana (7)', explanation: 'Horizontal line first, then the curved vertical hook.' },
      { char: '木', romaji: 'ki (tree)', explanation: 'Horizontal bar first, vertical trunk second, then diagonal branches.' }
    ],
    proTip: 'Notice the exception in characters like 田 or 中, where an enclosing frame or piercing stroke has its own priority.'
  },
  {
    id: 'rule_middle_first',
    ruleNumber: 4,
    title: 'Center Before Sides (Symmetrical Characters)',
    titleJapanese: '中が先、両脇が後',
    description: 'When a character has a dominant central vertical line flanked by symmetrical wings or dots, draw the center first.',
    exampleChars: [
      { char: '小', romaji: 'shou / chiisai (small)', explanation: 'Draw the center hooked line first, then left dot, then right dot.' },
      { char: '水', romaji: 'mizu (water)', explanation: 'Center vertical with hook first, left horizontal-hook second, right sweeping strokes last.' },
      { char: '山', romaji: 'yama (mountain)', explanation: 'Tall center peak first, then bottom corner stroke, then right stroke.' }
    ],
    proTip: 'Drawing the center vertical first anchors the symmetry of the whole character on the page.'
  },
  {
    id: 'rule_outside_in_close_last',
    ruleNumber: 5,
    title: 'Enclosure: Frame First, Fill Inside, Seal Bottom Last',
    titleJapanese: '外側から中、最後に閉じる',
    description: 'When a box or room encloses contents, build the left and top-right walls first, draw what goes inside, and finally close the floor.',
    exampleChars: [
      { char: '日', romaji: 'nichi / hi (sun)', explanation: 'Left vertical, then top-right corner, then middle dividing line, and close bottom last.' },
      { char: '四', romaji: 'yon / shi (4)', explanation: 'Outer box (left, then top-right), draw the two inner curved legs, then seal bottom line.' },
      { char: '国', romaji: 'kuni (country)', explanation: 'Outer box, write the inner jade character (玉), then close the floor line.' }
    ],
    proTip: 'Never close the bottom line until everything inside the room is completely drawn!'
  },
  {
    id: 'rule_dots_last',
    ruleNumber: 6,
    title: 'Minor Dots & Bottom Crossing Strokes Come Last',
    titleJapanese: '点や貫通線は最後',
    description: 'Accompanying punctuation-like dots, ten-ten marks, or a long stroke that pierces all the way through are usually drawn last.',
    exampleChars: [
      { char: '犬', romaji: 'inu (dog)', explanation: 'Draw the character for big (大), and add the upper-right dog ear dot last.' },
      { char: '玉', romaji: 'tama (gem)', explanation: 'Draw the king character (王), then add the jewel dot in the bottom right.' },
      { char: '中', romaji: 'naka (middle)', explanation: 'Draw the entire box (口) first, then pierce straight down through the center last.' }
    ],
    proTip: 'In Hiragana, the Dakuten ten-ten (") and Handakuten (°) are always placed after the character is finished.'
  }
];
