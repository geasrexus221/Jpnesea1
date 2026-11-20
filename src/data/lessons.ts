import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // Hiragana Path
  {
    id: 'h_lesson_1',
    stage: 'hiragana',
    title: 'Hiragana Vowels',
    subtitle: 'The 5 Foundation Sounds',
    description: 'Learn the primary vowel sounds of Japanese: A, I, U, E, O.',
    characterIds: ['h_a', 'h_i', 'h_u', 'h_e', 'h_o'],
    unlockedByDefault: true
  },
  {
    id: 'h_lesson_2',
    stage: 'hiragana',
    title: 'The K-Row',
    subtitle: 'Ka, Ki, Ku, Ke, Ko',
    description: 'Sharp crisp consonant sounds combined with the 5 vowels.',
    characterIds: ['h_ka', 'h_ki', 'h_ku', 'h_ke', 'h_ko']
  },
  {
    id: 'h_lesson_3',
    stage: 'hiragana',
    title: 'The S-Row',
    subtitle: 'Sa, Shi, Su, Se, So',
    description: 'Watch out for し (shi), which uses "sh" instead of "si"!',
    characterIds: ['h_sa', 'h_shi', 'h_su', 'h_se', 'h_so']
  },
  {
    id: 'h_lesson_4',
    stage: 'hiragana',
    title: 'The T-Row',
    subtitle: 'Ta, Chi, Tsu, Te, To',
    description: 'Includes the two unique sounds ち (chi) and つ (tsu).',
    characterIds: ['h_ta', 'h_chi', 'h_tsu', 'h_te', 'h_to']
  },
  {
    id: 'h_lesson_5',
    stage: 'hiragana',
    title: 'The N-Row',
    subtitle: 'Na, Ni, Nu, Ne, No',
    description: 'Smooth nasal sounds used in many core grammatical particles.',
    characterIds: ['h_na', 'h_ni', 'h_nu', 'h_ne', 'h_no']
  },
  {
    id: 'h_lesson_6',
    stage: 'hiragana',
    title: 'The H-Row',
    subtitle: 'Ha, Hi, Fu, He, Ho',
    description: 'Notice ふ (fu), pronounced with soft air blown through relaxed lips.',
    characterIds: ['h_ha', 'h_hi', 'h_fu', 'h_he', 'h_ho']
  },
  {
    id: 'h_lesson_7',
    stage: 'hiragana',
    title: 'The M-Row',
    subtitle: 'Ma, Mi, Mu, Me, Mo',
    description: 'Gentle humming syllables common in everyday greetings.',
    characterIds: ['h_ma', 'h_mi', 'h_mu', 'h_me', 'h_mo']
  },
  {
    id: 'h_lesson_8',
    stage: 'hiragana',
    title: 'The Y & R Rows',
    subtitle: 'Ya, Yu, Yo & Ra, Ri, Ru, Re, Ro',
    description: 'Japanese R is a gentle tap of the tongue on the roof of the mouth.',
    characterIds: ['h_ya', 'h_yu', 'h_yo', 'h_ra', 'h_ri', 'h_ru', 'h_re', 'h_ro']
  },
  {
    id: 'h_lesson_9',
    stage: 'hiragana',
    title: 'The W-Row & N',
    subtitle: 'Wa, Wo, and N',
    description: 'The final characters! を (wo) is used purely as an object particle.',
    characterIds: ['h_wa', 'h_wo', 'h_n']
  },
  {
    id: 'h_lesson_10',
    stage: 'hiragana',
    title: 'Dakuten (Voiced Sounds)',
    subtitle: 'Ga, Za, Da, Ba, Pa',
    description: 'Add ten-ten (") or maru (°) to turn sounds voiced (G, Z, D, B, P).',
    characterIds: ['h_ga', 'h_za', 'h_da', 'h_ba', 'h_pa']
  },

  // Katakana Path
  {
    id: 'k_lesson_1',
    stage: 'katakana',
    title: 'Katakana Vowels',
    subtitle: 'ア, イ, ウ, エ, オ',
    description: 'The 5 base Katakana vowels used for foreign words and brand names.',
    characterIds: ['k_a', 'k_i', 'k_u', 'k_e', 'k_o']
  },
  {
    id: 'k_lesson_2',
    stage: 'katakana',
    title: 'K-Row & S-Row',
    subtitle: 'カ〜コ, サ〜ソ',
    description: 'Learn Katakana K & S rows and practice reading menu words.',
    characterIds: ['k_ka', 'k_ki', 'k_ku', 'k_ke', 'k_ko', 'k_sa', 'k_shi', 'k_su', 'k_se', 'k_so']
  },
  {
    id: 'k_lesson_3',
    stage: 'katakana',
    title: 'T-Row & N-Row',
    subtitle: 'タ〜ト, ナ〜ノ',
    description: 'Master crucial characters like タ (ta) and ト (to) in words like テキスト.',
    characterIds: ['k_ta', 'k_chi', 'k_tsu', 'k_te', 'k_to', 'k_na', 'k_ni', 'k_nu', 'k_ne', 'k_no']
  },
  {
    id: 'k_lesson_4',
    stage: 'katakana',
    title: 'H, M, Y, R, W & N',
    subtitle: 'The Rest of Katakana',
    description: 'Complete the Katakana syllabary and start reading foreign loanwords.',
    characterIds: ['k_ha', 'k_hi', 'k_fu', 'k_he', 'k_ho', 'k_ma', 'k_mi', 'k_mu', 'k_me', 'k_mo', 'k_ya', 'k_yu', 'k_yo', 'k_ra', 'k_ri', 'k_ru', 'k_re', 'k_ro', 'k_wa', 'k_n']
  },

  // Kanji Path
  {
    id: 'kj_lesson_1',
    stage: 'kanji',
    title: 'Numbers 1 to 5',
    subtitle: '一, 二, 三, 四, 五',
    description: 'The foundation of Japanese counting and prices.',
    characterIds: ['kj_ichi', 'kj_ni', 'kj_san', 'kj_yon', 'kj_go']
  },
  {
    id: 'kj_lesson_2',
    stage: 'kanji',
    title: 'Days & Nature Elements',
    subtitle: '日, 月, 火, 水, 木',
    description: 'Essential for days of the week and Japanese calendar reading.',
    characterIds: ['kj_nichi', 'kj_getsu', 'kj_hi', 'kj_mizu', 'kj_ki']
  },
  {
    id: 'kj_lesson_3',
    stage: 'kanji',
    title: 'People & Society',
    subtitle: '人, 男, 女',
    description: 'Recognize gender markers on restrooms and references to people.',
    characterIds: ['kj_hito', 'kj_otoko', 'kj_onna']
  },
  {
    id: 'kj_lesson_4',
    stage: 'kanji',
    title: 'Directions',
    subtitle: '上, 下, 左, 右',
    description: 'Navigate streets and signs: up, down, left, and right.',
    characterIds: ['kj_ue', 'kj_shita', 'kj_hidari', 'kj_migi']
  },
  {
    id: 'kj_lesson_5',
    stage: 'kanji',
    title: 'Essential Daily Verbs',
    subtitle: '行, 来, 見, 食, 飲',
    description: 'The most frequent verbs in the Japanese language: go, come, see, eat, drink.',
    characterIds: ['kj_iku', 'kj_kuru', 'kj_miru', 'kj_taberu', 'kj_nomu']
  }
];
