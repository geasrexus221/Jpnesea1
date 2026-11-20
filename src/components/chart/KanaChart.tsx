import React, { useState } from 'react';
import { HIRAGANA_DATA } from '../../data/hiragana';
import { KATAKANA_DATA } from '../../data/katakana';
import { KanaItem } from '../../types';
import { AudioButton } from '../ui/AudioButton';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface KanaChartProps {
  romajiVisible: boolean;
  onSelectCharacter?: (item: KanaItem) => void;
}

export const KanaChart: React.FC<KanaChartProps> = ({ romajiVisible, onSelectCharacter }) => {
  const [selectedType, setSelectedType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [activeItem, setActiveItem] = useState<KanaItem | null>(null);
  const { speak } = useSpeech();

  const currentDataset = selectedType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  // Filter to 46 standard gojuon
  const gojuonItems = currentDataset.filter((item) => item.type === 'gojuon');
  const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];

  const getCharInRow = (row: string, vowelIndex: number) => {
    const vowels = ['a', 'i', 'u', 'e', 'o'];
    const targetVowel = vowels[vowelIndex];

    if (row === 'n') {
      return vowelIndex === 0 ? gojuonItems.find((i) => i.row === 'n') : null;
    }
    if (row === 'ya') {
      if (vowelIndex === 0) return gojuonItems.find((i) => i.id.endsWith('ya'));
      if (vowelIndex === 2) return gojuonItems.find((i) => i.id.endsWith('yu'));
      if (vowelIndex === 4) return gojuonItems.find((i) => i.id.endsWith('yo'));
      return null;
    }
    if (row === 'wa') {
      if (vowelIndex === 0) return gojuonItems.find((i) => i.id.endsWith('wa'));
      if (vowelIndex === 4) return gojuonItems.find((i) => i.id.endsWith('wo'));
      return null;
    }

    return gojuonItems.find((i) => i.row === row && i.romaji.endsWith(targetVowel));
  };

  const handleCellClick = (item: KanaItem) => {
    speak(item.char);
    setActiveItem(item);
    if (onSelectCharacter) {
      onSelectCharacter(item);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Chart Header & Sub-selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>50-Sounds Master Chart</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-slate-600 font-normal">
              五十音図 (Gojūon)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap any character to hear pronunciation and see mnemonic details.
          </p>
        </div>

        {/* Script Switcher Tabs */}
        <div className="flex p-1 bg-stone-100 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedType('hiragana')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedType === 'hiragana'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hiragana (ひらがな)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('katakana')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedType === 'katakana'
                ? 'bg-japan-crimson text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katakana (カタカナ)
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-3xl p-3 sm:p-6 border border-stone-200 shadow-sm overflow-x-auto">
        <div className="min-w-[340px]">
          {/* Vowel Column Headers */}
          <div className="grid grid-cols-6 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div>Row</div>
            <div>-a</div>
            <div>-i</div>
            <div>-u</div>
            <div>-e</div>
            <div>-o</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {rows.map((rowName) => (
              <div key={rowName} className="grid grid-cols-6 gap-2 items-center">
                {/* Row Label */}
                <div className="text-center font-bold text-xs uppercase text-slate-400 bg-stone-50 py-3 rounded-xl border border-stone-100">
                  {rowName.toUpperCase()}
                </div>

                {/* 5 Vowel Columns */}
                {[0, 1, 2, 3, 4].map((vowelIdx) => {
                  const item = getCharInRow(rowName, vowelIdx);
                  if (!item) {
                    return (
                      <div
                        key={vowelIdx}
                        className="h-16 rounded-2xl bg-stone-50/50 border border-dashed border-stone-200/60"
                      />
                    );
                  }

                  const isSelected = activeItem?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCellClick(item)}
                      className={`h-16 flex flex-col items-center justify-center rounded-2xl transition-all duration-150 border active:scale-95 group ${
                        isSelected
                          ? 'bg-red-50 border-japan-crimson ring-2 ring-red-400/50 shadow-sm'
                          : 'bg-stone-50/80 hover:bg-white hover:border-red-200 border-stone-200/80 hover:shadow-md'
                      }`}
                    >
                      <span className="font-japanese text-2xl font-bold text-slate-800 group-hover:text-japan-crimson transition-colors">
                        {item.char}
                      </span>
                      {romajiVisible && (
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
                          {item.romaji}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Character Detail Card Drawer */}
      {activeItem && (
        <div className="p-5 bg-gradient-to-br from-white to-stone-50 rounded-3xl border-2 border-red-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex flex-col items-center justify-center shadow-inner">
              <span className="font-japanese text-4xl font-bold text-japan-crimson">
                {activeItem.char}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase mt-0.5">
                {activeItem.romaji}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-japan-crimson">
                  Memory Hint (Mnemonic)
                </span>
                <span className="text-[10px] text-slate-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {activeItem.strokeCount} strokes
                </span>
              </div>
              <p className="text-sm font-medium text-slate-800 mt-1 max-w-lg">
                💡 {activeItem.mnemonic}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="text-slate-400">Example Word:</span>
                <span className="font-japanese font-bold text-slate-900">
                  {activeItem.exampleWord.japanese}
                </span>
                <span className="text-slate-500">({activeItem.exampleWord.reading})</span>
                <span>— {activeItem.exampleWord.english}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AudioButton text={activeItem.char} size="lg" label="Pronounce" />
            <AudioButton text={activeItem.exampleWord.japanese} size="md" label="Listen Word" />
          </div>
        </div>
      )}
    </div>
  );
};
