import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface AudioButtonProps {
  text: string;
  speed?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  speed = 1.0,
  size = 'md',
  className = '',
  label,
}) => {
  const { speak, isPlaying, isSupported } = useSpeech(speed);

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, speed);
      }}
      disabled={isPlaying}
      title={`Listen: "${text}"`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 active:scale-90 ${
        isPlaying
          ? 'bg-red-100 text-japan-crimson ring-2 ring-red-400'
          : 'bg-japan-paper/80 hover:bg-red-50 text-slate-700 hover:text-japan-crimson border border-slate-200 shadow-sm'
      } ${sizeClasses[size]} ${className}`}
      aria-label={label || `Play audio for ${text}`}
    >
      {isPlaying ? (
        <Volume2 size={iconSizes[size]} className="animate-pulse text-japan-crimson" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
      {label && <span className="font-medium text-xs">{label}</span>}
    </button>
  );
};
