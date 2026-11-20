# AI Agent & Developer Guidelines: Japanese Language Learning App

> **Notice for all future AI agents and contributors**:
> This document is the **single source of truth** and permanent memory for this repository.
> When updating, maintaining, or adding features—especially adding new Yu-Gi-Oh cards to the Duelist Card Lab—you **MUST** strictly follow the conventions and specifications established in this guide.

---

## 1. Project Overview & Architecture

- **Goal**: An offline-first, mobile-friendly Japanese learning web application with an authentic real-world focus (Hiragana, Katakana, Dakuten/Handakuten, Kanji, authentic Street Signs, Graded Readers, and an in-depth Yu-Gi-Oh OCG Grammar Lab).
- **Hosting & Target**: Static Single-Page Application (SPA) built for GitHub Pages.
- **Tech Stack**:
  - **Framework**: React 18 + Vite 5 + TypeScript 5
  - **Styling**: Tailwind CSS 3 + custom Japanese fonts & color palette (`japan-crimson: #bc002d`, `japan-gold`, `japan-ink`)
  - **Icons**: Lucide React
  - **Audio/Speech**: HTML5 Web Speech API (`SpeechSynthesisUtterance` with `ja-JP` voice fallback)
  - **Gamification**: `canvas-confetti` + local storage persistent progress (`useProgress.ts`)
- **Key Constraints**:
  - No external backend or database. All state is local (LocalStorage) and all datasets are statically typed TypeScript files in `src/data/`.
  - Must remain lightning-fast, offline-capable, and responsive on mobile viewports.

---

## 2. Complete Module Catalog (Zero Feature Omission)

The application consists of 9 core interactive modules accessible from `MainMenuHub.tsx` and the navigation system:

| # | Module | Core Component(s) | Primary Purpose & Features |
|---|--------|-------------------|----------------------------|
| 1 | **Main Menu Hub** | `src/components/home/MainMenuHub.tsx` | Central launchpad. 3 primary category rows (Kana & Basics, Reading & Realia, Drills & Quizzes) + featured banner for Duelist Lab. |
| 2 | **Curriculum Path** | `src/components/learn/CurriculumPath.tsx`, `LessonModal.tsx` | Step-by-step sequential learning road: Kana -> Basic Vocab -> Kanji N5. Tracks completion stars & audio examples. |
| 3 | **Interactive Kana Charts** | `src/components/chart/KanaChart.tsx` | Complete phonetic tables: **Gojuon** (46 basic sounds), **Dakuten** (濁点: が, ざ, だ [including **ど/ド (do)**], ば), and **Handakuten** (半濁点: ぱ). Features multi-row filter quiz, sound toggles, and audio buttons. |
| 4 | **Stroke Writing Gym** | `src/components/writing/WritingGym.tsx`, `StrokeCanvas.tsx` | Canvas handwriting practice with traditional 4-quadrant grid, SVG stroke order demonstrations, stroke evaluation, and accuracy scoring. |
| 5 | **Confusing Pairs Drills** | `src/components/drills/ConfusingPairs.tsx` | Visual discrimination trainer for lookalike kana (シ vs ツ, ソ vs ン, れ vs わ vs ね, etc.). |
| 6 | **Quiz Arena & Survival** | `src/components/quiz/QuizArena.tsx`, `SurvivalQuiz.tsx` | Rapid-fire multiple choice drills, survival challenge with 3 lives, streak counters, and timer. |
| 7 | **Street Signs Gallery** | `src/components/reader/SignsGallery.tsx` | Real-world authentic Japanese signs (Subway, Danger, Warnings, Shop labels) with interactive furigana toggles and vocabulary breakdowns. |
| 8 | **Graded Reader** | `src/components/reader/GradedReader.tsx` | Authentic short stories with furigana toggle, per-sentence speech pronunciation, and comprehension checks. |
| 9 | **Duelist Card Lab (遊戯王)** | `src/components/cards/DuelistLab.tsx` | Yu-Gi-Oh Official Card Game (OCG) Japanese grammar laboratory. Card Decrypter, Clause Breakdown, Full Text & Romaji Interlinear Reader, Terminology Dictionary, and Syntax Sandbox. |

---

## 3. Duelist Card Lab: Critical Rules & Standards

### Rule 1: "Full Text & Romaji" Interlinear Reader
- **DO NOT split or separate words** in the "Full Text & Romaji" view!
- In `CardInspector.tsx`, the `activeView === 'fulltext'` view renders an authentic interlinear 3-layer ruby stack:
  1. **Top layer**: Furigana reading in crimson text (e.g. `ぼち`). Automatically derived from `part.furigana` or matched against `VOCAB_DICT`.
  2. **Middle layer**: Natural combined Japanese text chunk (e.g. `墓地の`, `モンスター１体を`). **Never separate words/particles here!**
  3. **Bottom layer**: Natural Romaji reading in indigo text (e.g. `bochi no`, `monsutā ittai o`).
- Clicking any word chunk plays audio pronunciation using `speak(part.text)`.

### Rule 2: "Clause Breakdown" Tab vs "Full Text & Romaji" Tab
- **Clause Breakdown Tab (`CardSyntaxViewer.tsx`)**:
  - Displays clauses classified by PSCT roles: `Condition (条件)`, `Cost / Target (コスト・対象)`, `Resolution (効果処理)`, `Turn Limit (ターン制限)`.
  - Has the **"Separate Words & Particles (助詞分離)"** toggle switch.
  - When the toggle is **ON**, it dynamically tokenizes phrases into individual words and particles (e.g., separating `墓地の` into `墓地` + `の`, or `自分フィールドに` into `自分` + `フィールド` + `に`) using `splitClauseParts()` in `src/utils/particleSplitter.ts`.
- **Full Text & Romaji Tab (`CardInspector.tsx`)**:
  - Always uses `clause.parts` directly as authored in `yugioh_cards.ts`. No splitting!

### Rule 3: Maintain Compact Mobile-First UI (No Large Banners)
- **Do NOT restore the large red title banner** at the top of `DuelistLab.tsx`. The user explicitly asked for it to be removed to maximize screen real estate on mobile devices.
- Keep UI paddings compact (`p-2`, `p-2.5`, `p-3`), buttons tidy, and avoid vertical clutter.
- Card selection must always use the modal (`CardSelectorModal.tsx`), which provides instant search and filter tabs (Monster, Spell, Trap) rather than an unwieldy horizontal scrollbar.

### Rule 4: Central Vocabulary Dictionary (`VOCAB_DICT`)
- Located in `src/utils/particleSplitter.ts`.
- `VOCAB_DICT` acts as the single dictionary for:
  1. Auto-furigana generation on cards.
  2. Romaji conversion.
  3. Part of speech and syntax role classification (`particle`, `keyword`, `timing`, `verb`, `normal`).
  4. Morphological particle separation.
- **Whenever you add new cards with new terms or kanji**, you **MUST** register those words in `VOCAB_DICT`.

---

## 4. Step-by-Step Protocol: Adding a New Yu-Gi-Oh Card

When the user asks to add new Yu-Gi-Oh cards, follow this exact checklist:

### Step 1: Gather Card Data
1. **Card Identity**: English name, Japanese name (Kanji/Kana), and official Hiragana reading (`nameReading`).
2. **Card Type**: `spell` | `trap` | `monster` (with `subtype`: `normal`, `effect`, `fusion`, `synchro`, `xyz`, `link`).
3. **Card Property / Type**: e.g., `"通常罠 (Normal Trap)"`, `"速攻魔法 (Quick-Play Spell)"`, `"アンデット族 / 効果"`.
4. **Official Japanese PSCT**: The exact text from official OCG printings.
5. **Official English TCG Text**: The exact official English translation.

### Step 2: Clause Segmentation in `src/data/yugioh_cards.ts`
Break the card into logical PSCT clauses using the `clauses` array:
- `condition`: Activation conditions (e.g. `〜場合:`, `〜時:`).
- `cost_target`: Costs paid at activation and targeting (e.g. `〜を対象として発動できる。`, `〜を墓地へ送って発動できる。`).
- `resolution`: What happens when the effect resolves (e.g. `〜を破壊する。`, `〜を手札に加える。`).
- `restriction`: "You can only use this effect once per turn" (`このカード名の効果は１ターンに１度しか使用できない。`).

### Step 3: Clause Parts Formatting (Combined Natural Units)
Format each `parts` item inside a clause as a cohesive phrase chunk with particles attached:
```typescript
{
  text: '墓地の',          // Natural Japanese chunk
  romaji: 'bochi no',     // Accurate Romaji
  english: "Graveyard's",  // Phrase translation
  furigana: 'ぼち',        // Kanji reading (if contains kanji)
  role: 'keyword'         // 'particle' | 'keyword' | 'timing' | 'verb' | 'normal'
}
```
**Important**: Do NOT separate particles inside `parts` in `yugioh_cards.ts`. Keep `墓地の`, `モンスター１体を`, `手札から`, etc., combined. The token splitter will handle separating them in the syntax viewer when the user toggles that feature.

### Step 4: Grammar Breakdown Highlights
Provide 2 to 4 educational highlights (`grammarBreakdownHighlights`):
```typescript
grammarBreakdownHighlights: [
  {
    term: '対象として',
    reading: 'たいしょうとして (taishō to shite)',
    meaning: 'As target',
    explanation: 'Indicates targeting at activation in official Japanese PSCT.'
  }
]
```

### Step 5: Update `VOCAB_DICT` in `src/utils/particleSplitter.ts`
If the card introduces new nouns, verbs, or keywords (e.g., `除外`, `無効`, `裏側守備表示`), register them in `VOCAB_DICT`:
```typescript
'密告': { text: '密告', romaji: 'mikkoku', english: 'accusation', furigana: 'みっこく', role: 'keyword' },
```

### Step 6: Verify Build
Run the TypeScript and Vite build:
```powershell
npm run build
```
Verify that there are 0 TypeScript errors.

---

## 5. Japanese Linguistics & Phonetics Reference

### Dakuten & Handakuten (Voiced Sounds)
- **Gojuon (五十音)**: 46 basic syllables (A, Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa/N).
- **Dakuten (濁点 / ゛ "tenten")**: Voices voiceless consonants:
  - `か (ka) -> が (ga)`
  - `さ (sa) -> ざ (za)`
  - `た (ta) -> だ (da)`: Includes **だ (da), ぢ (ji), づ (zu), で (de), ど (do)**
  - `は (ha) -> ば (ba)`
- **Handakuten (半濁点 / ゜ "maru")**: Turns H-row into P-sounds:
  - `は (ha) -> ぱ (pa), ぴ (pi), ぷ (pu), ぺ (pe), ぽ (po)`
- **Location in App**: In `KanaChart.tsx`, users switch between tabs: `Gojuon (五十音)`, `Dakuten (濁点)`, and `Handakuten (半濁点)`.

### Yu-Gi-Oh PSCT Grammar Structure & Crucial Rulings
- `[Activation Condition (条件)] : [Cost / Targeting (コスト・対象)] ; [Effect Resolution (効果処理)] 。`
- **Condition Marker**: `〜時:` (When...), `〜場合:` (If...).
- **Cost / Targeting Marker**: `〜を対象として発動できる。` (Targeting), `〜をリリースして発動できる。` (Tribute cost).
- **Resolution**: Ends in action verbs like `破壊する` (destroy), `手札に加える` (add to hand), `特殊召喚する` (special summon).
- **The 4 PSCT Conjunctions**:
  1. `〜し、〜する` ("...and if you do, ..."): Simultaneous timing; Event B requires Event A to succeed.
  2. `〜その後、〜する` ("...and if you do, then..."): Sequential timing! Event B happens AFTER Event A. Causes optional "When... you can (〜時、できる)" triggers on Event A to **miss timing (タイミングを逃す)**.
  3. `〜と同時に〜する` ("...and at the same time..."): Both events happen simultaneously; neither requires the other to succeed.
  4. `〜または〜` ("...also / or..."): Alternative choices.
- **Critical Rulings & Word Distinctions**:
  - `墓地へ送る` (Send to GY) vs `捨てる` (Discard) vs `破壊する` (Destroy): Dropping from hand is "discarding" (triggers Dark World); "send to GY" triggers neither discard nor destroy conditions.
  - `対象として` (Targets at activation) vs `選んで` (Chooses non-targeting at resolution, bypassing target immunity).
  - `使用できない` (Cannot use - burns turn attempt even if activation is negated) vs `発動できない` (Cannot activate - can retry with another copy if activation is negated).
- **Terminology Categories (`TermCategoryType`)**:
  - `'particle'` (助詞)
  - `'action'` (動詞・処理)
  - `'psct'` (構文規則・タイミング)
  - `'zone'` (場所・ゾーン)
  - `'mechanic'` (召喚法・特殊分類: 融合, シンクロ, エクシーズ, リンク, ペンデュラム, チューナー, リバース)

---

## 6. Development & Tooling Commands

### Shell & Script Execution (Windows PowerShell)
- **PowerShell Command Separator**: PowerShell 5.1 on Windows does **NOT** support `&&`. Always use `;` to chain commands:
  ```powershell
  # Correct:
  npm run build; git status

  # Incorrect (fails on PowerShell):
  npm run build && git status
  ```
- **Git Commits & Windows Sandbox**:
  When committing changes, git file locking in the sandbox will fail with `index.lock: Permission denied`. Always run `git commit` commands with `BypassSandbox: true`:
  ```powershell
  git add src/data/yugioh_cards.ts src/utils/particleSplitter.ts
  git commit -m "feat(cards): add new card"
  ```

---

## 7. Current Roster of Cards in Duelist Lab (Total: 16)

1. **Monster Reborn (死者蘇生)** - Normal Spell
2. **Pot of Greed (強欲な壺)** - Normal Spell
3. **Ash Blossom & Joyous Spring (灰流うらら)** - Effect Monster / Tuner
4. **Raigeki (サンダー・ボルト)** - Normal Spell
5. **Effect Veiler (エフェクト・ヴェーラー)** - Effect Monster / Tuner
6. **Blue-Eyes White Dragon (青眼の白龍)** - Normal Monster
7. **Baronne de Fleur (フルール・ド・バロネス)** - Synchro Monster
8. **Nibiru, the Primal Being (原始生命態ニビル)** - Effect Monster
9. **S:P Little Knight (S:Pリトルナイト)** - Link Monster
10. **Divine Arsenal AA-ZEUS - Sky Thunder (天霆號アーゼウス)** - Xyz Monster
11. **Lovely Labrynth of the Silver Castle (白銀の城のラビュリンス)** - Effect Monster
12. **Trap Trick (トラップトリック)** - Normal Trap
13. **Trap Holic (トラップ・ホリック)** - Normal Trap
14. **Elemental Burst (エレメンタル・バースト)** - Normal Trap
15. **Crow, the Carrion Cutpurse (躯売りのカラス)** - Normal Monster
16. **Solemn Accusation (神の密告)** - Counter Trap

*Note: Whenever you add more cards, append them to this list to maintain a complete historical inventory.*
