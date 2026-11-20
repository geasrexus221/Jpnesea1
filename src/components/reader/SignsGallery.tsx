import React, { useState } from 'react';
import { REAL_WORLD_SIGNS } from '../../data/signs';
import { SignItem } from '../../types';
import { AudioButton } from '../ui/AudioButton';
import { Compass, Sparkles, MapPin, Coffee, Utensils, AlertTriangle } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export const SignsGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectSign, setInspectSign] = useState<SignItem | null>(null);
  const { speak } = useSpeech();

  const categories = [
    { id: 'all', label: 'All Signs' },
    { id: 'station', label: 'Train & Subway' },
    { id: 'street', label: 'Streets' },
    { id: 'shop', label: 'Shops & Izakaya' },
    { id: 'vending', label: 'Vending Machines' },
  ];

  const filteredSigns = REAL_WORLD_SIGNS.filter((sign) =>
    selectedCategory === 'all' ? true : sign.category === selectedCategory
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass size={20} className="text-japan-crimson" />
            <span>Reading in the Wild</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real Japanese signs, station gates, and vending machines you can read right now.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-japan-crimson text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signs Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSigns.map((sign) => {
          return (
            <div
              key={sign.id}
              onClick={() => {
                speak(sign.signJapanese);
                setInspectSign(sign);
              }}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Visual Simulated Sign Plate */}
              <div
                className={`bg-gradient-to-r ${sign.bgTheme} p-6 text-white flex flex-col items-center justify-center relative shadow-inner`}
              >
                <div className="font-japanese text-4xl sm:text-5xl font-bold tracking-wider text-center drop-shadow-md group-hover:scale-105 transition-transform">
                  {sign.signJapanese}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/90 mt-2 px-3 py-0.5 rounded-full bg-black/20 backdrop-blur-sm">
                  {sign.signReading}
                </div>
              </div>

              {/* Translation & Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">{sign.signEnglish}</span>
                    <AudioButton text={sign.signJapanese} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sign.description}</p>
                </div>

                {/* Vocabulary Pill breakdown */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {sign.breakdown.map((part, pIdx) => (
                    <span
                      key={pIdx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl bg-stone-100 text-slate-700"
                    >
                      <strong className="font-japanese font-bold text-japan-crimson">
                        {part.word}
                      </strong>
                      <span className="text-slate-400">({part.reading})</span>
                      <span className="font-medium text-slate-600">={part.meaning}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal on click */}
      {inspectSign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-scale-up">
            <div
              className={`bg-gradient-to-r ${inspectSign.bgTheme} p-8 rounded-2xl text-white text-center shadow-md mb-4`}
            >
              <div className="font-japanese text-5xl font-bold tracking-widest">
                {inspectSign.signJapanese}
              </div>
              <div className="text-sm font-semibold tracking-wider text-white/90 mt-2">
                {inspectSign.signReading}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{inspectSign.signEnglish}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {inspectSign.description}
            </p>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Character Breakdown:
              </span>
              {inspectSign.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-japanese font-bold text-base text-slate-900">
                      {item.word}
                    </span>
                    <span className="text-slate-500 font-medium">{item.reading}</span>
                  </div>
                  <span className="text-slate-700 font-semibold">{item.meaning}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <AudioButton text={inspectSign.signJapanese} size="lg" label="Play Japanese" />
              <button
                type="button"
                onClick={() => setInspectSign(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
