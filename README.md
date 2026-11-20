# 日本語を読む (Nihongo wo Yomu) — Japanese Reading Practice Web App

A clean, responsive, offline-capable Japanese learning web application designed for complete beginners to learn how to read Japanese from scratch.

Hosted 100% free on **GitHub Pages** with zero backend or database required.

---

## 🌟 Key Features

1. **Predefined Step-by-Step Curriculum**
   * **Stage 1: Hiragana Masterclass** (Vowels, K-Row, S-Row... through Dakuten and combinations) with mnemonics, stroke counts, and audio.
   * **Stage 2: Katakana Masterclass** (Phonetic syllabary + modern foreign loanwords).
   * **Stage 3: Essential JLPT N5 Kanji** (Numbers, Dates/Time, People, Directions, and core Daily Verbs).
   * **Stage 4: Graded Reader** (Simple sentences with toggleable Furigana and tap-to-inspect grammar breakdown).

2. **Adaptive Mobile vs. Desktop UI**
   * **Phone / Android**: App-like bottom navigation bar, touch-friendly tap targets, finger-drawing stroke canvas with guidelines, and subtle Android haptic feedback (`navigator.vibrate`).
   * **Desktop**: Wide sidebar navigation, split views, and full keyboard-accessible controls.

3. **Specialized Beginner Tools**
   * **"Confusing Pairs" Battle Trainer**: Targeted drills for notoriously tricky pairs like `さ (sa)` vs `ち (chi)`, and `シ (shi)` vs `ツ (tsu)`.
   * **50-Sounds Master Chart**: Instant audio pronunciation and stroke order guides on tap.
   * **Reading in the Wild**: Practical street signs, train station gates (`入口`, `出口`, `改札口`), convenience store items, and vending machine labels (`つめたい` / `あたたかい`).
   * **Finger-Writing Canvas**: Draw character strokes on screen with optional ghost guideline overlay and clear/undo pad.
   * **Native Audio Pronunciation**: Built-in speech synthesis (`SpeechSynthesisUtterance('ja-JP')`) with 0.75x slow speed toggle.

4. **100% Client-Side & Offline-Ready**
   * All progress, streaks, and unlocked lessons persist in browser `localStorage`.
   * **Export / Import Backup**: Sync your progress between PC and phone with one click.
   * **PWA Enabled**: Add to your Android home screen as a standalone offline app.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (GitHub Pages)
npm run build
```

---

## 📦 Deployment to GitHub Pages

This repository is pre-configured with a GitHub Actions workflow in `.github/workflows/deploy.yml`:

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Japanese Reading web app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. GitHub Actions will automatically build and publish your app!
