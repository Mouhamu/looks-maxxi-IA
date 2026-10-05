import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { calculateTier } from '../services/tierService';

interface PersonalHistoryGraphProps {
  analyses: AnalysisResult[];
  onSelectScan?: (analysis: AnalysisResult) => void;
}

export const PersonalHistoryGraph: React.FC<PersonalHistoryGraphProps> = ({
  analyses,
  onSelectScan,
}) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Sort chronological (oldest to newest)
  const history = [...analyses].sort((a, b) => a.timestamp - b.timestamp);

  if (history.length === 0) {
    return null;
  }

  // Graph dimensions
  const width = 340;
  const height = 160;
  const paddingX = 35;
  const paddingY = 25;

  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // X & Y scalers
  const getX = (index: number) => {
    if (history.length === 1) return paddingX + graphWidth / 2;
    return paddingX + (index / (history.length - 1)) * graphWidth;
  };

  const getY = (score: number) => {
    // 0 to 100
    const clamped = Math.max(0, Math.min(100, score));
    return paddingY + graphHeight - (clamped / 100) * graphHeight;
  };

  // Build SVG path
  const points = history.map((item, idx) => ({
    x: getX(idx),
    y: getY(item.scores.presentationScore),
    score: item.scores.presentationScore,
    tier: calculateTier(item.scores.presentationScore).tier,
    item,
  }));

  const linePath = points.length === 1
    ? `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`
    : points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  const areaPath = points.length === 1
    ? ''
    : `${linePath} L ${points[points.length - 1].x} ${paddingY + graphHeight} L ${points[0].x} ${paddingY + graphHeight} Z`;

  // Tier threshold lines (30, 50, 70, 90)
  const tierLines = [
    { score: 30, label: 'SUB5' },
    { score: 50, label: 'MTN' },
    { score: 70, label: 'CHAD' },
    { score: 90, label: 'ADAM' },
  ];

  const activePoint = selectedPointIndex !== null ? points[selectedPointIndex] : points[points.length - 1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            Evolution Trajectory
          </span>
          <h4 className="text-xs font-bold text-white">Score & Tier Progression</h4>
        </div>
        {activePoint && (
          <div className="text-right">
            <span className="text-sm font-black text-cyan-400 font-mono">
              {activePoint.score}/100
            </span>
            <span className="text-[10px] font-bold text-slate-400 block">
              {activePoint.tier}
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="historyAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="historyLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Tier milestone horizontal reference lines */}
          {tierLines.map((t, i) => {
            const y = getY(t.score);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingX - 4}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] fill-slate-400 font-mono"
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#historyAreaGrad)" />
          )}

          {/* Connecting Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#historyLineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isSelected = selectedPointIndex === idx || (selectedPointIndex === null && idx === points.length - 1);
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedPointIndex(idx);
                  if (onSelectScan) onSelectScan(p.item);
                }}
              >
                {/* Hit area */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                {/* Outer Glow Ring if selected */}
                {isSelected && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}

                {/* Core Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? '5' : '3.5'}
                  fill={isSelected ? '#22d3ee' : '#cbd5e1'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono px-1">
        <span>Oldest</span>
        <span>Tap any node to view scan</span>
        <span>Latest</span>
      </div>
    </div>
  );
};
