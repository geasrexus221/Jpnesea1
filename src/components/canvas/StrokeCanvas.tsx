import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Play, CheckCircle2, AlertCircle, Undo2, Sparkles } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { evaluateStrokeAccuracy, EvaluationResult } from '../../utils/strokeEvaluator';
import { getCharacterStrokePaths, StrokeStep } from '../../data/stroke_paths';

interface StrokeCanvasProps {
  character: string;
  strokeCount?: number;
  className?: string;
  onEvaluationComplete?: (result: EvaluationResult) => void;
}

export const StrokeCanvas: React.FC<StrokeCanvasProps> = ({
  character,
  strokeCount = 1,
  className = '',
  onEvaluationComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Progressive drawing state (Option 3)
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState<number>(0);
  const [userStrokeCount, setUserStrokeCount] = useState<number>(0);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Demo animation state (Option 2)
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoActiveStroke, setDemoActiveStroke] = useState<number>(-1);

  const { triggerHaptic } = useHaptics();
  const strokes: StrokeStep[] = getCharacterStrokePaths(character, strokeCount);
  const totalStrokes = strokes.length;
  const isCharacterComplete = userStrokeCount >= totalStrokes;

  // Auto-reset when character changes
  useEffect(() => {
    resetCanvas();
  }, [character]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setCurrentStrokeIdx(0);
    setUserStrokeCount(0);
    setStrokeHistory([]);
    setEvaluation(null);
    setIsDemoPlaying(false);
    setDemoActiveStroke(-1);
  };

  // Initialize Canvas DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#181B1F';
  }, []);

  // Save canvas snapshot for undo support
  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev, snap]);
  };

  const undoLastStroke = () => {
    if (strokeHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokeHistory];
    newHistory.pop(); // remove current state

    if (newHistory.length > 0) {
      const previousState = newHistory[newHistory.length - 1];
      ctx.putImageData(previousState, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setStrokeHistory(newHistory);
    setUserStrokeCount((prev) => Math.max(0, prev - 1));
    setCurrentStrokeIdx((prev) => Math.max(0, prev - 1));
    setEvaluation(null);
    triggerHaptic('light');
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDemoPlaying) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Snapshot before this new stroke begins
    saveSnapshot();

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isDemoPlaying) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const nextCount = userStrokeCount + 1;
    setUserStrokeCount(nextCount);
    triggerHaptic('light');

    if (nextCount < totalStrokes) {
      // Advance to next stroke!
      setCurrentStrokeIdx(nextCount);
    } else {
      // Completed all strokes! Evaluate full drawing
      triggerEvaluation();
    }
  };

  const triggerEvaluation = () => {
    const canvas = canvasRef.current;
    if (!canvas || !character) return;

    const result = evaluateStrokeAccuracy(canvas, character);
    setEvaluation(result);

    if (result.isCorrect) {
      triggerHaptic('success');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
      });
    } else {
      triggerHaptic('error');
    }

    if (onEvaluationComplete) {
      onEvaluationComplete(result);
    }
  };

  // Option 2: Animated Preview / Demo
  const playStrokeDemo = () => {
    if (isDemoPlaying) return;
    resetCanvas();
    setIsDemoPlaying(true);

    let step = 0;
    setDemoActiveStroke(0);

    const interval = setInterval(() => {
      step++;
      if (step < totalStrokes) {
        setDemoActiveStroke(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDemoPlaying(false);
          setDemoActiveStroke(-1);
          resetCanvas(); // Clear demo so user can write!
        }, 800);
      }
    }, 700);
  };

  const activeStrokeInfo = strokes[currentStrokeIdx] || strokes[0];

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-sm ${className}`}>
      {/* 4-Quadrant Canvas Container */}
      <div
        className={`relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl border-2 transition-all shadow-md overflow-hidden touch-none flex items-center justify-center ${
          evaluation?.isCorrect
            ? 'border-emerald-400 ring-4 ring-emerald-100 shadow-emerald-100'
            : evaluation && !evaluation.isCorrect
            ? 'border-amber-400 ring-4 ring-amber-100'
            : 'border-stone-200'
        }`}
      >
        {/* Genkō yōshi Crosshairs (Dividing into 4 balanced quadrants) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-1/2 border-b border-dashed border-red-200" />
          <div className="h-full w-1/2 border-r border-dashed border-red-200 absolute top-0 left-0" />
        </div>

        {/* Option 2 & 3: Clean, Progressive SVG Guide (Zero Clutter!) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Subtle Overall Watermark Outline (12% opacity so you see full proportion without clutter) */}
          <text
            x="50"
            y="57"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-900 select-none font-japanese font-normal opacity-10"
            style={{ fontSize: '78px' }}
          >
            {character}
          </text>

          {/* Option 2: Demo Mode Animation */}
          {isDemoPlaying && (
            <>
              {strokes.map((st, i) => {
                if (i > demoActiveStroke) return null;
                const isCurrentAnimating = i === demoActiveStroke;
                return (
                  <path
                    key={i}
                    d={st.path}
                    fill="none"
                    stroke={isCurrentAnimating ? '#C9171E' : '#475569'}
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isCurrentAnimating ? 'animate-pulse' : ''}
                    opacity={isCurrentAnimating ? 1 : 0.6}
                  />
                );
              })}
            </>
          )}

          {/* Option 3: Progressive Stroke-by-Stroke Mode */}
          {!isDemoPlaying && !isCharacterComplete && activeStrokeInfo && (
            <g>
              {/* Highlight ONLY the current stroke shape */}
              <path
                d={activeStrokeInfo.path}
                fill="none"
                stroke="#C9171E"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.32"
              />

              {/* Single Subtle "Start Here" Glowing Ripple */}
              <circle
                cx={activeStrokeInfo.start.x}
                cy={activeStrokeInfo.start.y}
                r="6"
                className="fill-red-500 opacity-20 animate-ping"
              />
              <circle
                cx={activeStrokeInfo.start.x}
                cy={activeStrokeInfo.start.y}
                r="4.5"
                className="fill-japan-crimson stroke-white stroke-2"
              />
              <text
                x={activeStrokeInfo.start.x}
                y={activeStrokeInfo.start.y + 0.3}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FFFFFF"
                fontSize="4.5"
                fontWeight="bold"
              >
                {currentStrokeIdx + 1}
              </text>
            </g>
          )}
        </svg>

        {/* HTML5 Touch / Mouse Drawing Surface */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-20 w-full h-full cursor-crosshair"
        />
      </div>

      {/* Progressive Step Timeline (Option 3 - Clean step-by-step indicator) */}
      <div className="mt-3.5 w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {isCharacterComplete ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> All Strokes Drawn!
              </span>
            ) : (
              <span>
                Draw Stroke {currentStrokeIdx + 1} of {totalStrokes}
              </span>
            )}
          </span>

          <span className="text-[11px] font-semibold text-japan-crimson">
            {!isCharacterComplete && activeStrokeInfo?.direction}
          </span>
        </div>

        {/* Step Segment Pills */}
        <div className="flex gap-1.5 w-full">
          {strokes.map((_, idx) => {
            const isFinished = idx < userStrokeCount;
            const isCurrent = idx === currentStrokeIdx && !isCharacterComplete;
            return (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isFinished
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-japan-crimson ring-2 ring-red-200 animate-pulse'
                    : 'bg-stone-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Accuracy Feedback Banner */}
      {evaluation && (
        <div
          className={`mt-3 w-full p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
            evaluation.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {evaluation.isCorrect ? (
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
            )}
            <div>
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <span>{evaluation.isCorrect ? 'Well Done!' : 'Keep Practicing'}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/80 font-extrabold text-[11px]">
                  {evaluation.score}% Match
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{evaluation.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: Demo, Undo, Reset */}
      <div className="mt-3.5 flex items-center justify-between gap-2 w-full">
        {/* Option 2: Play Demo Button */}
        <button
          type="button"
          onClick={playStrokeDemo}
          disabled={isDemoPlaying}
          className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
            isDemoPlaying
              ? 'bg-red-100 text-japan-crimson cursor-wait'
              : 'bg-stone-100 hover:bg-stone-200 text-slate-800'
          }`}
        >
          <Play size={14} className={isDemoPlaying ? 'animate-spin' : 'fill-current'} />
          <span>{isDemoPlaying ? 'Showing Demo...' : 'Watch Demo'}</span>
        </button>

        {/* Undo Last Stroke */}
        <button
          type="button"
          onClick={undoLastStroke}
          disabled={userStrokeCount === 0 || isDemoPlaying}
          className="py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 disabled:opacity-40 text-xs font-bold transition-all flex items-center gap-1"
          title="Undo last stroke"
        >
          <Undo2 size={15} />
          <span>Undo</span>
        </button>

        {/* Clear & Restart Pad */}
        <button
          type="button"
          onClick={resetCanvas}
          disabled={userStrokeCount === 0 && !evaluation}
          className="py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 disabled:opacity-40 text-xs font-bold transition-all flex items-center gap-1"
          title="Restart character"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
