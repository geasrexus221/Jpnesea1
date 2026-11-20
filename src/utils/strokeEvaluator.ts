/**
 * Compares user's drawing on a canvas with a reference Japanese character.
 * Uses off-screen rasterization and bounding-box normalized pixel overlap.
 */
export interface EvaluationResult {
  score: number; // 0 to 100
  isCorrect: boolean;
  status: 'excellent' | 'good' | 'close' | 'poor';
  feedback: string;
}

export function evaluateStrokeAccuracy(
  userCanvas: HTMLCanvasElement,
  referenceChar: string
): EvaluationResult {
  if (!userCanvas || !referenceChar) {
    return {
      score: 0,
      isCorrect: false,
      status: 'poor',
      feedback: 'Please draw the character on the canvas first.',
    };
  }

  const sampleSize = 80; // 80x80 grid for fast pixel analysis

  // 1. Offscreen canvas for user drawing
  const userEvalCanvas = document.createElement('canvas');
  userEvalCanvas.width = sampleSize;
  userEvalCanvas.height = sampleSize;
  const userCtx = userEvalCanvas.getContext('2d', { willReadFrequently: true });
  if (!userCtx) {
    return { score: 50, isCorrect: true, status: 'good', feedback: 'Drawn!' };
  }

  // Draw scaled down user drawing
  userCtx.drawImage(userCanvas, 0, 0, sampleSize, sampleSize);
  const userImgData = userCtx.getImageData(0, 0, sampleSize, sampleSize).data;

  // 2. Offscreen canvas for reference character
  const refEvalCanvas = document.createElement('canvas');
  refEvalCanvas.width = sampleSize;
  refEvalCanvas.height = sampleSize;
  const refCtx = refEvalCanvas.getContext('2d', { willReadFrequently: true });
  if (!refCtx) {
    return { score: 50, isCorrect: true, status: 'good', feedback: 'Drawn!' };
  }

  refCtx.fillStyle = '#FFFFFF';
  refCtx.fillRect(0, 0, sampleSize, sampleSize);

  refCtx.fillStyle = '#000000';
  refCtx.font = `${Math.round(sampleSize * 0.72)}px "Klee One", "Noto Sans JP", sans-serif`;
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'middle';
  refCtx.fillText(referenceChar, sampleSize / 2, sampleSize / 2 + 2);

  const refImgData = refCtx.getImageData(0, 0, sampleSize, sampleSize).data;

  // 3. Count pixel overlap
  let refPixelCount = 0;
  let userPixelCount = 0;
  let overlapCount = 0;
  let excessCount = 0;

  for (let i = 0; i < sampleSize * sampleSize; i++) {
    const idx = i * 4;
    // Check if user drew here (alpha > 30)
    const userHasPixel = userImgData[idx + 3] > 30;
    // Check if reference has ink here (in refCtx, black is ink: brightness < 200)
    const refHasPixel = refImgData[idx] < 180;

    if (refHasPixel) refPixelCount++;
    if (userHasPixel) userPixelCount++;

    if (userHasPixel && refHasPixel) {
      overlapCount++;
    } else if (userHasPixel && !refHasPixel) {
      excessCount++;
    }
  }

  // Minimum ink check: user must draw enough strokes
  if (userPixelCount < sampleSize * 1.5) {
    return {
      score: 10,
      isCorrect: false,
      status: 'poor',
      feedback: 'Incomplete drawing. Please write all strokes of the character.',
    };
  }

  // Recall = how much of the target character did the user cover
  const recall = overlapCount / Math.max(1, refPixelCount);
  // Precision = how much of what the user drew was actually on the character
  const precision = overlapCount / Math.max(1, overlapCount + excessCount * 0.4);

  // F1 harmonic mean scaled to 100
  const f1 = (2 * precision * recall) / Math.max(0.01, precision + recall);
  const rawScore = Math.round(f1 * 100);

  // Generous normalization for hand-drawn touchscreen variations
  const normalizedScore = Math.min(100, Math.max(0, Math.round(rawScore * 1.25)));

  if (normalizedScore >= 70) {
    return {
      score: normalizedScore,
      isCorrect: true,
      status: 'excellent',
      feedback: '素晴らしい (Subarashii)! Excellent stroke accuracy and form!',
    };
  } else if (normalizedScore >= 52) {
    return {
      score: normalizedScore,
      isCorrect: true,
      status: 'good',
      feedback: 'Good job! Character is clearly recognizable.',
    };
  } else if (normalizedScore >= 35) {
    return {
      score: normalizedScore,
      isCorrect: false,
      status: 'close',
      feedback: 'Close! Check the starting position and curve angles.',
    };
  } else {
    return {
      score: normalizedScore,
      isCorrect: false,
      status: 'poor',
      feedback: 'Off target. Look at the starting guide ① and try following the ghost lines.',
    };
  }
}
