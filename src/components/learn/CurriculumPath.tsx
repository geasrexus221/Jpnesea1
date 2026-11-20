import React from 'react';
import { LESSONS } from '../../data/lessons';
import { Lesson, StageType } from '../../types';
import { CheckCircle2, Lock, Play, Sparkles } from 'lucide-react';

interface CurriculumPathProps {
  completedLessons: string[];
  onSelectLesson: (lesson: Lesson) => void;
  activeStageFilter?: StageType;
}

export const CurriculumPath: React.FC<CurriculumPathProps> = ({
  completedLessons,
  onSelectLesson,
}) => {
  const stages: { type: StageType; label: string; badge: string; color: string }[] = [
    { type: 'hiragana', label: 'Stage 1: Hiragana Masterclass', badge: 'Foundations', color: 'bg-blue-500' },
    { type: 'katakana', label: 'Stage 2: Katakana Masterclass', badge: 'Loanwords', color: 'bg-indigo-500' },
    { type: 'kanji', label: 'Stage 3: Essential N5 Kanji', badge: 'Characters', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-12 max-w-3xl mx-auto pb-16">
      {stages.map((stage) => {
        const stageLessons = LESSONS.filter((l) => l.stage === stage.type);

        return (
          <div key={stage.type} className="space-y-4">
            {/* Stage Section Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{stage.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Step-by-step units designed for progressive learning
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-slate-600">
                {stage.badge}
              </span>
            </div>

            {/* Lesson Cards Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stageLessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                // First lesson is always unlocked; others unlocked if previous is completed
                const prevLesson = stageLessons[idx - 1];
                const isUnlocked =
                  lesson.unlockedByDefault ||
                  (prevLesson ? completedLessons.includes(prevLesson.id) : true) ||
                  isCompleted;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectLesson(lesson);
                      }
                    }}
                    className={`relative p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                      !isUnlocked
                        ? 'bg-stone-50/70 border-stone-200 text-slate-400 cursor-not-allowed opacity-75'
                        : isCompleted
                        ? 'bg-white border-emerald-200 shadow-sm hover:shadow-md cursor-pointer ring-1 ring-emerald-100'
                        : 'bg-white border-stone-200 hover:border-japan-crimson hover:shadow-md cursor-pointer pulse-ring-active'
                    }`}
                  >
                    <div>
                      {/* Top status marker */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Unit {idx + 1}
                        </span>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-japan-crimson bg-red-50 px-2 py-0.5 rounded-full">
                            <Play size={12} className="fill-current" /> Start
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Lock size={12} /> Locked
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-slate-900 leading-tight">
                        {lesson.title}
                      </h4>
                      <p className="text-xs font-medium text-japan-crimson mt-0.5">
                        {lesson.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Bottom character pills preview */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {lesson.characterIds.length} items
                      </span>
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                          isCompleted
                            ? 'text-slate-600 bg-stone-100 hover:bg-stone-200'
                            : isUnlocked
                            ? 'text-white bg-japan-crimson hover:bg-red-700 shadow-sm'
                            : 'text-slate-300'
                        }`}
                      >
                        {isCompleted ? 'Review' : 'Learn'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
