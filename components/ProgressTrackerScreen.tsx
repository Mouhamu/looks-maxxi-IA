import React, { useState } from 'react';
import { Achievement, AnalysisResult, Language } from '../types';
import { translations } from '../services/i18n';

interface ProgressTrackerScreenProps {
  lang: Language;
  analyses: AnalysisResult[];
  achievements: Achievement[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  onDeleteAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
}

export const ProgressTrackerScreen: React.FC<ProgressTrackerScreenProps> = ({
  lang,
  analyses,
  achievements,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNewAnalysis,
}) => {
  const t = translations[lang];
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const hasMultiple = analyses.length >= 2;
  const beforePhoto = analyses[analyses.length - 1]?.image;
  const afterPhoto = analyses[0]?.image;

  return (
    <div className="w-full max-w-md mx-auto pb-24 text-white animate-fade-in px-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-black text-white tracking-tight">
          {t.progressTitle}
        </h3>
        <p className="text-xs text-slate-400">
          {t.progressSubtitle}
        </p>
      </div>

      {/* Before / After Comparative Split Slider */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>⚡</span>
            <span>{t.beforeAfterSlider}</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">
            {hasMultiple ? 'Interactive Slider' : 'Requires 2+ Scans'}
          </span>
        </div>

        {hasMultiple ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 select-none bg-black">
            {/* Background Image (After - Latest) */}
            <img
              src={afterPhoto}
              alt="Latest Scan"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Latest
            </span>

            {/* Foreground Image Clipped (Before - Baseline) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforePhoto}
                alt="Baseline Scan"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700">
                Baseline
              </span>
            </div>

            {/* Slider Dividing Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-cyan-500/50">
                ↔
              </div>
            </div>

            {/* Invisible Range Input for Smooth Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-2xl bg-slate-950 border border-dashed border-slate-800 flex flex-col items-center justify-center p-5 text-center">
            <span className="text-3xl mb-2">📸</span>
            <p className="text-xs text-slate-400 mb-3 max-w-xs">
              {t.noHistoryYet}
            </p>
            <button
              onClick={onNewAnalysis}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Capture New Scan
            </button>
          </div>
        )}

        {hasMultiple && (
          <p className="text-[11px] text-slate-400 text-center mt-2">
            {t.dragSliderNotice}
          </p>
        )}
      </div>

      {/* Evolution Timeline */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.evolutionTimeline} ({analyses.length})
          </h4>
          <button
            onClick={onNewAnalysis}
            className="text-xs font-bold text-cyan-400 hover:underline"
          >
            + Add Scan
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <p className="text-xs text-slate-400 mb-3">{t.noAnalysisYet}</p>
            <button
              onClick={onNewAnalysis}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              {t.btnAnalyzeMyFace}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {analyses.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectAnalysis(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-850"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt="Scan thumbnail"
                    className="w-13 h-13 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {item.faceProfile.faceShape} Face Blueprint
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-400 font-mono block">
                      {item.scores.presentationScore}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">
                      Presentation
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnalysis(item.id);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 flex items-center justify-center text-xs transition-colors"
                    title="Delete Scan"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gamification: Achievements Section */}
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          {t.achievementsTitle}
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-slate-900 border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{ach.icon}</span>
                {ach.unlocked ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    {ach.progress}/{ach.max}
                  </span>
                )}
              </div>
              <h5 className="text-xs font-bold text-white mb-0.5">{ach.title}</h5>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
