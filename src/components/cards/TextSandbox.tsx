import React, { useState } from 'react';
import { parseCardText } from '../../utils/cardTextParser';
import { ParsedSentence, ClauseType } from '../../types/yugioh';
import { Sparkles, Terminal, Copy, Check, RefreshCw } from 'lucide-react';

const PRESETS = [
  {
    name: 'Ash Blossom (灰流うらら)',
    text: 'このカード名のエフェクトは１ターンに１度しか使用できない。相手の効果が発動した時、このカードを手札から捨てて発動できる。その効果を無効にする。',
  },
  {
    name: 'Accesscode Talker (アクセスコード・トーカー)',
    text: 'このカードの効果の発動に対して相手は効果を発動できない。自分の墓地からリンクモンスター１体を除外して発動できる。相手フィールドのカード１枚を破壊する。',
  },
  {
    name: 'Called by the Grave (墓穴の指名者)',
    text: '相手の墓地のモンスター１体を対象として発動できる。そのモンスターを除外する。次のターンの終了時まで、その効果は無効化される。',
  },
  {
    name: 'Dark Ruler No More (冥王結界波)',
    text: '相手フィールドの全ての表側表示モンスターの効果をターン終了時まで無効にする。このカードの発動に対して、相手はモンスターの効果を発動できない。',
  },
];

export const TextSandbox: React.FC = () => {
  const [inputText, setInputText] = useState<string>(PRESETS[0].text);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedSentences: ParsedSentence[] = parseCardText(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getClauseStyle = (type: ClauseType) => {
    switch (type) {
      case 'condition':
        return {
          border: 'border-blue-300 bg-blue-50/50',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          title: 'Condition Timing (条件)',
        };
      case 'cost_target':
        return {
          border: 'border-amber-300 bg-amber-50/50',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          title: 'Cost & Targeting (コスト・対象)',
        };
      case 'resolution':
        return {
          border: 'border-emerald-300 bg-emerald-50/50',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          title: 'Effect Resolution (効果処理)',
        };
      case 'restriction':
        return {
          border: 'border-purple-300 bg-purple-50/50',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          title: 'Turn Limitation (ターン1制限)',
        };
      default:
        return {
          border: 'border-stone-200 bg-white',
          badge: 'bg-stone-100 text-stone-700 border-stone-200',
          title: 'Card Text',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Introduction banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm flex items-start gap-3">
        <Terminal className="text-amber-400 mt-0.5 shrink-0" size={20} />
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-300">
            Card Text PSCT Analyzer (構文解析器)
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Paste any Japanese Yu-Gi-Oh card text from booster pack reveals, Master Duel, or OCG databases. The parser detects activation colons (`：`), cost semicolons (`；`), particles (`を/に/から`), and action verbs.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Quick Sample Presets:
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(p.text)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-stone-100 border border-stone-200 text-slate-700 whitespace-nowrap active:scale-95 transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste Japanese Yu-Gi-Oh card text here (日本語のカードテキストを貼り付け)..."
          rows={4}
          className="w-full p-3.5 rounded-2xl bg-white border border-stone-300 focus:border-japan-crimson focus:ring-2 focus:ring-red-100 font-japanese text-sm sm:text-base leading-relaxed text-slate-900 placeholder:text-slate-400 shadow-inner resize-y transition-all"
        />

        <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors text-xs flex items-center gap-1"
            title="Copy text"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={() => setInputText('')}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors text-xs flex items-center gap-1"
            title="Clear text"
          >
            <RefreshCw size={14} />
            <span className="text-[10px]">Clear</span>
          </button>
        </div>
      </div>

      {/* Live Parsed Output */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles size={14} className="text-japan-crimson" />
          <span>Parsed Clauses & Syntax Structure</span>
        </h3>

        {parsedSentences.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-stone-300">
            Paste or type card text above to see the grammatical breakdown.
          </div>
        ) : (
          parsedSentences.map((sent, sIdx) => (
            <div key={sIdx} className="space-y-2">
              {sent.clauses.map((clause) => {
                const style = getClauseStyle(clause.type);
                return (
                  <div
                    key={clause.id}
                    className={`p-3.5 rounded-2xl border ${style.border} shadow-xs space-y-2 transition-all`}
                  >
                    {/* Clause Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}
                      >
                        {style.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {clause.roleDescription}
                      </span>
                    </div>

                    {/* Raw Clause Text */}
                    <div className="font-japanese text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                      {clause.text}
                    </div>

                    {/* Detected Particles & Keywords Pills */}
                    {(clause.particlesFound.length > 0 || clause.keywordsFound.length > 0) && (
                      <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold mr-1">Found:</span>
                        {clause.particlesFound.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold"
                          >
                            助詞: {p}
                          </span>
                        ))}
                        {clause.keywordsFound.map((kw, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold"
                          >
                            用語: {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
