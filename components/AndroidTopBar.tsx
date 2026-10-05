import React, { useState, useEffect } from 'react';
import { Language, SubscriptionTier, ThemeMode } from '../types';
import { translations } from '../services/i18n';

interface AndroidTopBarProps {
  lang: Language;
  streakDays: number;
  level: number;
  xp: number;
  subscription: SubscriptionTier;
  onOpenPro: () => void;
  onOpenSettings: () => void;
  theme: ThemeMode;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  lang,
  streakDays,
  level,
  xp,
  subscription,
  onOpenPro,
  onOpenSettings,
  theme,
}) => {
  const [time, setTime] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white select-none">
      {/* Android System Status Bar Emulation */}
      <div className="flex items-center justify-between px-4 pt-1.5 pb-1 text-[11px] font-medium text-slate-400 tracking-wider">
        <span className="font-mono tabular-nums">{time || '09:41'}</span>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-slate-400">5G</span>
          {/* Signal bars */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" opacity="0.3"/>
            <path d="M12 6a6 6 0 00-6 6c0 1.41.49 2.71 1.32 3.74L12 18.5l4.68-2.76A5.96 5.96 0 0018 12a6 6 0 00-6-6z"/>
          </svg>
          {/* Battery */}
          <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-cyan-400 rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 shadow-sm shadow-cyan-500/20 bg-slate-900 flex items-center justify-center">
            <img
              src="/src/assets/images/looksmaxxi_logo_icon_1791157639740.jpg"
              alt="LooksMaxxi BP Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // graceful fallback if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-cyan-400 pointer-events-none">
              BP
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                LooksMaxxi
              </span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                BP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide -mt-0.5 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner"
            title={`${streakDays} ${t.streakBadge}`}
          >
            <span className="animate-pulse">🔥</span>
            <span className="font-mono tabular-nums">{streakDays}</span>
          </div>

          {/* Level / XP */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">LVL</span>
            <span className="font-mono font-bold text-white">{level}</span>
          </div>

          {/* PRO Badge / Trigger */}
          {subscription === 'pro' ? (
            <button
              onClick={onOpenPro}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] tracking-wider uppercase shadow-sm shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-transform"
            >
              PRO
            </button>
          ) : (
            <button
              onClick={onOpenPro}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] tracking-wider uppercase hover:border-cyan-400 transition-colors"
            >
              PRO
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
