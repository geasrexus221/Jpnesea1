import React from 'react';
import { X, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import { STROKE_RULES } from '../../data/stroke_rules';

interface StrokeRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StrokeRulesModal: React.FC<StrokeRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-japan-crimson">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                The 6 Universal Stroke Order Rules
              </h3>
              <p className="text-xs text-slate-500">筆順の基本原則 (Hitsujun no Gensoku)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rules Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-amber-950">
            💡 <strong>Why stroke order matters:</strong> Drawing strokes in the correct sequence gives your handwriting balanced proportions and natural flow. Learn these 6 rules, and you will be able to guess the stroke order of 95% of all Japanese characters!
          </p>

          <div className="space-y-4">
            {STROKE_RULES.map((rule) => (
              <div
                key={rule.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3"
              >
                {/* Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-japan-crimson text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {rule.ruleNumber}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{rule.title}</h4>
                  </div>
                  <span className="text-xs font-japanese font-medium text-slate-400">
                    {rule.titleJapanese}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>

                {/* Example Characters Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {rule.exampleChars.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5"
                    >
                      <span className="font-japanese text-3xl font-bold text-slate-900 leading-none">
                        {item.char}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-japan-crimson uppercase">
                          {item.romaji}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro Tip */}
                <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <Lightbulb size={13} className="text-emerald-600 shrink-0" />
                  <span>{rule.proTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-japan-crimson hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm"
          >
            Got It! Return to Writing Gym
          </button>
        </div>
      </div>
    </div>
  );
};
