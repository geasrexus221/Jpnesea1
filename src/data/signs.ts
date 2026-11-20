import { SignItem } from '../types';

export const REAL_WORLD_SIGNS: SignItem[] = [
  {
    id: 'sign_iriguchi',
    signJapanese: '入口',
    signReading: 'いりぐち (iriguchi)',
    signEnglish: 'Entrance',
    category: 'station',
    bgTheme: 'from-blue-600 to-blue-800',
    description: 'Found at every train station, shopping mall, and building door.',
    breakdown: [
      { word: '入', reading: 'いり (iri)', meaning: 'enter / enter into' },
      { word: '口', reading: 'ぐち (guchi / kuchi)', meaning: 'mouth / opening / doorway' }
    ]
  },
  {
    id: 'sign_deguchi',
    signJapanese: '出口',
    signReading: 'でぐち (deguchi)',
    signEnglish: 'Exit',
    category: 'station',
    bgTheme: 'from-amber-600 to-amber-800',
    description: 'Look for this sign when leaving subway platforms or department stores.',
    breakdown: [
      { word: '出', reading: 'で (de)', meaning: 'exit / go out' },
      { word: '口', reading: 'ぐち (guchi)', meaning: 'doorway / opening' }
    ]
  },
  {
    id: 'sign_hijouguchi',
    signJapanese: '非常口',
    signReading: 'ひじょうぐち (hijouguchi)',
    signEnglish: 'Emergency Exit',
    category: 'station',
    bgTheme: 'from-emerald-600 to-green-800',
    description: 'The famous green running-man emergency exit sign in all Japanese facilities.',
    breakdown: [
      { word: '非常', reading: 'ひじょう (hijou)', meaning: 'emergency / extraordinary' },
      { word: '口', reading: 'ぐち (guchi)', meaning: 'exit / opening' }
    ]
  },
  {
    id: 'sign_kaisatsuguchi',
    signJapanese: '改札口',
    signReading: 'かいさつぐち (kaisatsuguchi)',
    signEnglish: 'Ticket Gate',
    category: 'station',
    bgTheme: 'from-indigo-600 to-indigo-900',
    description: 'Where you tap your Suica or Pasmo transit card to board the train.',
    breakdown: [
      { word: '改札', reading: 'かいさつ (kaisatsu)', meaning: 'ticket inspection' },
      { word: '口', reading: 'ぐち (guchi)', meaning: 'gate / entrance' }
    ]
  },
  {
    id: 'sign_tomare',
    signJapanese: '止まれ',
    signReading: 'とまれ (tomare)',
    signEnglish: 'STOP',
    category: 'street',
    bgTheme: 'from-red-600 to-red-800',
    description: 'Inverted red triangle road sign painted directly on Japanese streets.',
    breakdown: [
      { word: '止まる', reading: 'とまる (tomaru)', meaning: 'to stop' },
      { word: 'れ', reading: 're', meaning: 'imperative command ending' }
    ]
  },
  {
    id: 'sign_toire',
    signJapanese: 'トイレ',
    signReading: 'といれ (toire)',
    signEnglish: 'Restroom / Toilet',
    category: 'shop',
    bgTheme: 'from-cyan-600 to-cyan-800',
    description: 'Katakana loanword from the English word "toilet".',
    breakdown: [
      { word: 'トイレ', reading: 'toire', meaning: 'toilet / washroom' }
    ]
  },
  {
    id: 'sign_tsumetai',
    signJapanese: 'つめたい',
    signReading: 'つめたい (tsumetai)',
    signEnglish: 'Cold (Beverage)',
    category: 'vending',
    bgTheme: 'from-sky-500 to-blue-700',
    description: 'The blue button label on Japanese vending machines indicating chilled drinks.',
    breakdown: [
      { word: '冷たい', reading: 'つめたい (tsumetai)', meaning: 'cold to the touch / chilled' }
    ]
  },
  {
    id: 'sign_atatakai',
    signJapanese: 'あたたかい',
    signReading: 'あたたかい (atatakai)',
    signEnglish: 'Hot (Beverage)',
    category: 'vending',
    bgTheme: 'from-rose-500 to-red-700',
    description: 'The red/orange button label on Japanese vending machines for piping hot canned coffee and tea in winter.',
    breakdown: [
      { word: '温かい', reading: 'あたたかい (atatakai)', meaning: 'warm / hot' }
    ]
  },
  {
    id: 'sign_eigyouchuu',
    signJapanese: '営業中',
    signReading: 'えいぎょうちゅう (eigyouchuu)',
    signEnglish: 'Open for Business',
    category: 'shop',
    bgTheme: 'from-emerald-700 to-teal-900',
    description: 'Wooden plate hung outside ramen shops and izakayas when they are open.',
    breakdown: [
      { word: '営業', reading: 'えいぎょう (eigyou)', meaning: 'business / operation' },
      { word: '中', reading: 'ちゅう (chuu)', meaning: 'in progress / currently' }
    ]
  },
  {
    id: 'sign_junbichuu',
    signJapanese: '準備中',
    signReading: 'じゅんびちゅう (junbichuu)',
    signEnglish: 'Preparing / Currently Closed',
    category: 'shop',
    bgTheme: 'from-zinc-700 to-zinc-900',
    description: 'Sign flipped when the restaurant is prepping food before opening.',
    breakdown: [
      { word: '準備', reading: 'じゅんび (junbi)', meaning: 'preparation' },
      { word: '中', reading: 'ちゅう (chuu)', meaning: 'in the middle of' }
    ]
  }
];
