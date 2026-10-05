import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface ScanningHudProps {
  lang: Language;
  image: string;
  onScanComplete?: () => void;
}

export const ScanningHud: React.FC<ScanningHudProps> = ({ lang, image }) => {
  const t = translations[lang];
  const [currentStage, setCurrentStage] = useState<number>(0);

  const stages = [
    t.stage1,
    t.stage2,
    t.stage3,
    t.stage4,
    t.stage5,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col items-center justify-center p-4 select-none backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Futuristic Header */}
        <div className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{t.scanningTitle}</span>
        </div>

        {/* Viewport with Biometric Laser HUD */}
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 bg-black mb-6">
          <img
            src={image}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-85 filter contrast-110"
            referrerPolicy="no-referrer"
          />

          {/* Holographic Mesh Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>

          {/* Sweeping Laser Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan pointer-events-none"></div>

          {/* Biometric Landmark Coordinates (Points) */}
          <div className="absolute top-[28%] left-[32%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
          <div className="absolute top-[28%] right-[32%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
          <div className="absolute top-[48%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse"></div>
          <div className="absolute top-[68%] left-[40%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
          <div className="absolute top-[68%] right-[40%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
          <div className="absolute top-[82%] left-[50%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-ping"></div>

          {/* HUD Target Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Live Analysis Telemetry */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded backdrop-blur-md border border-cyan-500/20">
            <span>GEO_CONTOUR: ACTIVE</span>
            <span className="tabular-nums">{(currentStage + 1) * 20}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-4 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, (currentStage + 1) * 22)}%` }}
          ></div>
        </div>

        {/* Current Stage Prose */}
        <div className="text-center min-h-[48px]">
          <p className="text-sm font-bold text-white tracking-wide animate-pulse">
            {stages[currentStage]}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            LooksMaxxi BP Neural Engine
          </p>
        </div>
      </div>
    </div>
  );
};
