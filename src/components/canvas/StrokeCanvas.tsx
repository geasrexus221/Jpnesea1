import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { evaluateStrokeAccuracy, EvaluationResult } from '../../utils/strokeEvaluator';

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const { triggerHaptic } = useHaptics();

  // Auto-clear canvas whenever character changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    setEvaluation(null);
  }, [character]);

  // Canvas DPI initialization
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
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
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
    if (isDrawing) {
      setIsDrawing(false);
      triggerHaptic('light');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setEvaluation(null);
    triggerHaptic('light');
  };

  const handleCheckAccuracy = () => {
    const canvas = canvasRef.current;
    if (!canvas || !character) return;

    const result = evaluateStrokeAccuracy(canvas, character);
    setEvaluation(result);

    if (result.isCorrect) {
      triggerHaptic('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      triggerHaptic('error');
      setShowGuide(true);
    }

    if (onEvaluationComplete) {
      onEvaluationComplete(result);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-sm ${className}`}>
      {/* Clean Genkō yōshi 4-quadrant manuscript drawing pad */}
      <div
        className={`relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl border-2 transition-all shadow-md overflow-hidden touch-none flex items-center justify-center ${
          evaluation?.isCorrect
            ? 'border-emerald-400 ring-4 ring-emerald-100 shadow-emerald-100'
            : evaluation && !evaluation.isCorrect
            ? 'border-red-400 ring-4 ring-red-100'
            : 'border-stone-200'
        }`}
      >
        {/* Guidelines (Crosshairs dividing into 4 equal quadrants) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-1/2 border-b border-dashed border-red-200" />
          <div className="h-full w-1/2 border-r border-dashed border-red-200 absolute top-0 left-0" />
        </div>

        {/* Minimalist Ghost Character - Perfectly centered in the 4 quadrants (y=47, font-size=68px) */}
        {showGuide && (
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            <text
              x="50"
              y="47"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-200 font-japanese select-none font-normal"
              style={{ fontSize: '68px' }}
            >
              {character}
            </text>
          </svg>
        )}

        {/* HTML5 Touch / Pen / Mouse Canvas */}
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

      {/* Accuracy Feedback Banner */}
      {evaluation && (
        <div
          className={`mt-3 w-full p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
            evaluation.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {evaluation.isCorrect ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-500 shrink-0" />
            )}
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>{evaluation.isCorrect ? 'Correct!' : 'Needs Practice'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/80 font-extrabold text-[10px]">
                  {evaluation.score}% Accuracy
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{evaluation.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: Check Accuracy, Clear, and Ghost Guide Toggle */}
      <div className="mt-3.5 flex items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={handleCheckAccuracy}
          disabled={!hasDrawn}
          className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
            hasDrawn
              ? 'bg-japan-crimson hover:bg-red-700 text-white shadow-red-200'
              : 'bg-stone-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles size={15} />
          <span>Check My Drawing</span>
        </button>

        <button
          type="button"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 disabled:opacity-40 transition-colors"
          title="Clear pad"
          aria-label="Clear pad"
        >
          <RotateCcw size={16} />
        </button>

        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className={`px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            showGuide ? 'bg-red-50 text-japan-crimson' : 'bg-stone-100 text-slate-500'
          }`}
          title={showGuide ? 'Hide Ghost Guide' : 'Show Ghost Guide'}
        >
          {showGuide ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showGuide ? 'Guide: ON' : 'Guide: OFF'}</span>
        </button>
      </div>

      <div className="mt-3 text-center">
        <span className="text-xs text-slate-400">
          Standard stroke count: <strong>{strokeCount} strokes</strong> • Trace with finger or mouse
        </span>
      </div>
    </div>
  );
};
