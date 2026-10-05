import React, { useState } from 'react';
import { TierData } from '../services/tierService';

interface LevelUpPlanModalProps {
  tierData: TierData;
  isOpen: boolean;
  onClose: () => void;
  topImprovementAreas: string[];
}

export const LevelUpPlanModal: React.FC<LevelUpPlanModalProps> = ({
  tierData,
  isOpen,
  onClose,
  topImprovementAreas,
}) => {
  if (!isOpen) return null;

  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  const toggleTask = (index: number) => {
    setCheckedTasks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const actionableTasks = [
    {
      title: 'Mandibular & Neckline Clean-Up',
      points: '+2 Pts',
      desc: 'Shave below 1cm above Adam’s apple and maintain 3mm uniform stubble or clean shave.',
    },
    {
      title: 'Hairstyle Contour Refresh',
      points: '+3 Pts',
      desc: 'Ask your barber for low taper sides with textured length on top to balance cranial thirds.',
    },
    {
      title: 'Daily AM Barrier & SPF 50',
      points: '+2 Pts',
      desc: 'Apply gentle cleanser, hydration serum, and broad-spectrum sunscreen every morning.',
    },
    {
      title: 'Photometric Angle Alignment',
      points: '+2 Pts',
      desc: 'Take progress selfies at 60cm distance, eye level, facing diffused window daylight.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                Tier Progression Roadmap
              </span>
              <h4 className="text-base font-black text-white">Level Up Evolution Plan</h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center touch-press"
          >
            ✕
          </button>
        </div>

        {/* Current vs Next Tier Target Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Current Tier
            </span>
            <span className={`text-lg font-black font-mono block ${tierData.badgeText}`}>
              {tierData.tier}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Score: {tierData.score}/100
            </span>
          </div>

          <div className="text-center px-3">
            <span className="text-sm font-bold text-cyan-400">→</span>
            {tierData.nextTier ? (
              <span className="text-[11px] font-bold text-amber-300 block bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 mt-1 font-mono">
                +{tierData.pointsNeeded} pts
              </span>
            ) : (
              <span className="text-[10px] font-bold text-cyan-300 block font-mono">MAX TIER</span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Next Tier
            </span>
            <span className="text-lg font-black font-mono text-cyan-300 block">
              {tierData.nextTier || 'MAXED'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Target: {tierData.nextTier ? `${tierData.score + tierData.pointsNeeded}` : '100'}
            </span>
          </div>
        </div>

        {/* Progress Bar within Current Bracket */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Tier Bracket Progress</span>
            <span className="text-cyan-400 font-bold">{tierData.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${tierData.progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Strategic Level Up Guidance */}
        <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl mb-4 text-xs text-slate-300 leading-relaxed">
          <span className="text-cyan-300 font-bold block mb-1">Tier Strategic Focus:</span>
          <p>{tierData.levelUpAdvice}</p>
        </div>

        {/* Top 3 Improvement Focus Areas */}
        {topImprovementAreas.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Top 3 Priority Focus Areas
            </span>
            <div className="space-y-1.5">
              {topImprovementAreas.slice(0, 3).map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Checkable Tasks to Gain Points */}
        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Actionable Point Builders
          </span>
          <div className="space-y-2">
            {actionableTasks.map((task, idx) => {
              const isChecked = !!checkedTasks[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleTask(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 touch-press ${
                    isChecked
                      ? 'bg-slate-950/60 border-emerald-500/40 opacity-75'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center text-xs shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isChecked && '✓'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-xs font-bold ${
                          isChecked ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {task.points}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {task.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethical / Respectful Disclosure */}
        <p className="text-[10px] text-slate-500 text-center leading-tight mb-4">
          Tiers are gamified progress markers for personal grooming and styling discipline. They do not measure inherent human value or social standing.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all touch-press"
        >
          Got It, Let’s Level Up
        </button>
      </div>
    </div>
  );
};
