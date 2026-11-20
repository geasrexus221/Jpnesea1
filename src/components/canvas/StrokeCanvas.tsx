import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Navigation } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { evaluateStrokeAccuracy, EvaluationResult } from '../../utils/strokeEvaluator';
import { getCharacterStrokePaths } from '../../data/stroke_paths';

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
  const [showArrows, setShowArrows] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const { triggerHaptic } = useHaptics();
  const strokes = getCharacterStrokePaths(character, strokeCount);

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
      // If failed, make sure guide and arrows are visible
      setShowGuide(true);
      setShowArrows(true);
    }

    if (onEvaluationComplete) {
      onEvaluationComplete(result);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-sm ${className}`}>
      {/* Drawing Pad Frame with Genkō yōshi 4-quadrant grid */}
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

        {/* Unified SVG Vector Layer (Ghost character + Stroke paths + Starting badges + Directional arrows) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            {/* Arrowhead marker pointing exactly in stroke tangent direction */}
            <marker
              id="stroke-arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 1, 6 3.5, 0 6" fill="#047857" />
            </marker>
          </defs>

          {/* 1. Exactly Centered Ghost Reference Character */}
          {showGuide && (
            <text
              x="50"
              y="57"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-200 font-japanese select-none font-normal"
              style={{ fontSize: '78px' }}
            >
              {character}
            </text>
          )}

          {/* 2. Directional Stroke Paths with Arrowheads & Numbered Starting Dots */}
          {showArrows &&
            strokes.map((stroke, idx) => (
              <g key={idx}>
                {/* Dashed directional vector line ending with an arrowhead */}
                <path
                  d={stroke.path}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.8"
                  strokeDasharray="4 3"
                  markerEnd="url(#stroke-arrowhead)"
                  opacity="0.9"
                />

                {/* Starting badge (Sitting precisely at stroke start point!) */}
                <circle
                  cx={stroke.start.x}
                  cy={stroke.start.y}
                  r="4.8"
                  fill="#047857"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
                <text
                  x={stroke.start.x}
                  y={stroke.start.y + 0.3}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FFFFFF"
                  fontSize="5.5"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>
              </g>
            ))}
        </svg>

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

      {/* Action Buttons: Check Accuracy & Tools */}
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
          onClick={() => setShowArrows(!showArrows)}
          className={`px-3 py-2.5 rounded-2xl text-[11px] font-bold transition-colors flex items-center gap-1 ${
            showArrows
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-stone-100 text-slate-500'
          }`}
          title="Toggle arrows and starting dots"
        >
          <Navigation size={12} className={showArrows ? 'text-emerald-600' : 'text-slate-400'} />
          <span>Arrows: {showArrows ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Step by step stroke instructions */}
      <div className="mt-4 w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Stroke Order ({strokes.length} strokes):
        </span>
        {strokes.map((st, i) => (
          <div key={i} className="text-xs text-slate-700 font-medium flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="leading-relaxed">{st.direction}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
