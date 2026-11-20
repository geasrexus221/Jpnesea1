import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Volume2, Eye, Sliders } from 'lucide-react';
import { UserProgress } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onToggleRomaji: () => void;
  onSetSpeed: (speed: number) => void;
  onExport: () => string;
  onImport: (jsonStr: string) => boolean;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onToggleRomaji,
  onSetSpeed,
  onExport,
  onImport,
  onReset,
}) => {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportDownload = () => {
    const dataStr = onExport();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nihongo_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const success = onImport(importText.trim());
    if (success) {
      setImportStatus('Progress imported successfully!');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1000);
    } else {
      setImportStatus('Invalid backup file. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-scale-up space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-japan-crimson" />
            <h3 className="text-lg font-bold text-slate-900">App Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Study Preferences */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Study Preferences
          </h4>

          {/* Romaji Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Eye size={16} className="text-slate-500" />
                <span>Show Romaji (English Letters)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Turn off to force reading Japanese characters directly
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleRomaji}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                progress.romajiVisible ? 'bg-japan-crimson' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
                  progress.romajiVisible ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Audio Speech Speed */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Volume2 size={16} className="text-slate-500" />
                <span>Audio Playback Speed</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Slow down for clear pronunciation</p>
            </div>
            <div className="flex bg-stone-200/80 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => onSetSpeed(0.75)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  progress.speechSpeed === 0.75
                    ? 'bg-japan-crimson text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                0.75x
              </button>
              <button
                type="button"
                onClick={() => onSetSpeed(1.0)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  progress.speechSpeed === 1.0
                    ? 'bg-japan-crimson text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                1.0x
              </button>
            </div>
          </div>
        </div>

        {/* Sync & Backup (Sync between Phone & Desktop) */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sync Progress (Phone & Desktop)
          </h4>
          <p className="text-xs text-slate-500">
            Export a backup file on your PC and import it on your phone to keep your streak and lessons in sync.
          </p>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportDownload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                Export Backup
              </button>
            </div>

            <div className="pt-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Or paste backup JSON here..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importText.trim()}
                className="mt-1.5 w-full py-2 px-3 rounded-xl bg-japan-crimson hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Upload size={14} />
                Apply Imported Data
              </button>
            </div>
          </div>
          {importStatus && <p className="text-xs text-emerald-600 font-bold">{importStatus}</p>}
        </div>

        {/* Danger Zone: Reset */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all your learning progress?')) {
                onReset();
                onClose();
              }
            }}
            className="w-full text-center text-xs font-medium text-red-500 hover:text-red-700 py-1"
          >
            Reset All Progress Data
          </button>
        </div>
      </div>
    </div>
  );
};
