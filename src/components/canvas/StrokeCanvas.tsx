import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

interface StrokeCanvasProps {
  character: string;
  className?: string;
}

export const StrokeCanvas: React.FC<StrokeCanvasProps> = ({ character, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const { triggerHaptic } = useHaptics();

  // Resize canvas based on client display
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use devicePixelRatio for super crisp lines on mobile screens
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
    triggerHaptic('light');
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Drawing Pad Frame */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden touch-none flex items-center justify-center">
        {/* Subtle Guidelines (Crosshairs like traditional genkouyoushi manuscript paper) */}
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

      {/* Control Actions */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1.5 transition-colors"
        >
          {showGuide ? <EyeOff size={14} /> : <Eye size={14} />}
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </button>

        <button
          type="button"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
            hasDrawn
              ? 'bg-red-50 text-japan-crimson hover:bg-red-100'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <RotateCcw size={14} />
          Clear Pad
        </button>
      </div>
    </div>
  );
};
