import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { evaluateStrokeAccuracy, EvaluationResult } from '../../utils/strokeEvaluator';
import { getStrokeGuide } from '../../data/stroke_guides';

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
  const [showStartPoints, setShowStartPoints] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const { triggerHaptic } = useHaptics();
  const guideInfo = getStrokeGuide(character, strokeCount);

  // Auto-clear canvas whenever character prop changes!
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
      // If failed, make sure ghost guide is visible so they learn
      setShowGuide(true);
    }

    if (onEvaluationComplete) {
      onEvaluationComplete(result);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-sm ${className}`}>
      {/* Drawing Pad Frame with Genkouyoushi 4-quadrant grid */}
      <div
        className={`relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl border-2 transition-all shadow-md overflow-hidden touch-none flex items-center justify-center ${
          evaluation?.isCorrect
            ? 'border-emerald-400 ring-4 ring-emerald-100 shadow-emerald-100'
            : evaluation && !evaluation.isCorrect
            ? 'border-red-400 ring-4 ring-red-100'
            : 'border-stone-200'
        }`}
      >
        {/* Subtle Guidelines (Crosshairs dividing into 4 quadrants) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-1/2 border-b border-dashed border-red-200" />
          <div className="h-full w-1/2 border-r border-dashed border-red-200 absolute top-0 left-0" />
        </div>

        {/* Character Guide Template (Ghost Overlay) */}
        {showGuide && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-200 select-none font-japanese font-normal transition-opacity duration-300"
            style={{ fontSize: '11rem', lineHeight: 1 }}
          >
            {character}
          </div>
        )}

        {/* Numbered Starting Point Badges (Where to start drawing) */}
        {showStartPoints && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {guideInfo.startPoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute flex items-center justify-center"
                style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-600 text-white font-bold text-[11px] items-center justify-center shadow-md">
                    {pt.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
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
          className="relative z-10 w-full h-full cursor-crosshair"
        />
      </div>

      {/* Accuracy Feedback Banner (Right or Wrong Notification) */}
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

      {/* Control Actions & Grade Button */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 w-full">
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
          className={`p-2.5 rounded-2xl transition-colors ${
            showGuide ? 'bg-red-50 text-japan-crimson' : 'bg-stone-100 text-slate-500'
          }`}
          title={showGuide ? 'Hide Ghost Guide' : 'Show Ghost Guide'}
          aria-label={showGuide ? 'Hide Ghost Guide' : 'Show Ghost Guide'}
        >
          {showGuide ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <button
          type="button"
          onClick={() => setShowStartPoints(!showStartPoints)}
          className={`px-3 py-2.5 rounded-2xl text-[11px] font-bold transition-colors ${
            showStartPoints ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-slate-500'
          }`}
          title="Toggle starting point dots"
        >
          ① Start Dots: {showStartPoints ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Step by step stroke instructions */}
      <div className="mt-4 w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          How to write ({guideInfo.steps.length} strokes):
        </span>
        {guideInfo.steps.map((st, i) => (
          <div key={i} className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
            <span className="leading-relaxed">{st}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
