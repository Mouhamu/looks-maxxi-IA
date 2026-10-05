import React from 'react';
import { AnalysisResult, DailyMission, Language, NavigationTab, User } from '../types';
import { translations } from '../services/i18n';

interface HomeDashboardProps {
  lang: Language;
  user: User;
  latestAnalysis: AnalysisResult | null;
  dailyMissions: DailyMission[];
  onToggleMission: (id: string) => void;
  onStartAnalysis: () => void;
  onViewAnalysis: (analysis: AnalysisResult) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenPro: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  lang,
  user,
  latestAnalysis,
  dailyMissions,
  onToggleMission,
  onStartAnalysis,
  onViewAnalysis,
  onNavigateTab,
  onOpenPro,
}) => {
  const t = translations[lang];

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t.greetingMorning
      : hour < 18
      ? t.greetingAfternoon
      : t.greetingEvening;

  return (
    <div className="w-full max-w-md mx-auto pb-24 text-white animate-fade-in px-4">
      {/* Top Welcome Lockup */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block">
            {greeting}, {user.name} 👋
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            {t.homeHeadline}
          </h2>
        </div>
      </div>

      {/* Primary Hero CTA: Analyze My Face */}
      <div className="relative rounded-3xl overflow-hidden mb-5 border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-5 shadow-2xl shadow-cyan-950/50 group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              AI Vision Engine
            </span>
            <span className="text-[10px] text-slate-400">
              Biometric Facial Mapping
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white mb-2 leading-tight">
            Comprehensive Facial & Grooming Analysis
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-xs">
            Scan your facial geometry, haircut harmony, optical frame fit, and personalized grooming routines.
          </p>

          <button
            onClick={onStartAnalysis}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-600 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">⚡</span>
            <span>{t.btnAnalyzeMyFace}</span>
            <span className="text-sm font-bold">→</span>
          </button>
        </div>

        {/* Decorative background glow node */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none"></div>
      </div>

      {/* Latest Analysis Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>📊</span>
            <span>{t.latestAnalysis}</span>
          </span>
          {latestAnalysis && (
            <button
              onClick={() => onViewAnalysis(latestAnalysis)}
              className="text-xs text-cyan-400 font-bold hover:underline"
            >
              View Blueprint →
            </button>
          )}
        </div>

        {latestAnalysis ? (
          <div
            onClick={() => onViewAnalysis(latestAnalysis)}
            className="flex items-center gap-3.5 cursor-pointer p-1 rounded-2xl hover:bg-slate-850 transition-colors"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-black">
              <img
                src={latestAnalysis.image}
                alt="Latest selfie"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-bold text-center text-cyan-300 py-0.5">
                {latestAnalysis.faceProfile.faceShape}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-white">
                  {latestAnalysis.faceProfile.faceShape} Facial Profile
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mb-1">
                Top cut: {latestAnalysis.hair.suggestedStyles?.[0] || 'Textured Crop'}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-cyan-400 font-bold">
                  Score: {latestAnalysis.scores.presentationScore}/100
                </span>
                <span className="text-slate-500">
                  {new Date(latestAnalysis.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-2xl block mb-1">🔍</span>
            <p className="text-xs text-slate-400 mb-3">
              {t.noAnalysisYet}
            </p>
            <button
              onClick={onStartAnalysis}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors"
            >
              Start First Scan
            </button>
          </div>
        )}
      </div>

      {/* Daily Missions Gamification Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🎯</span>
              <span>{t.dailyMissions}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.dailyMissionsSubtitle}
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            +{dailyMissions.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0)} XP
          </span>
        </div>

        <div className="space-y-2">
          {dailyMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => onToggleMission(mission.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                mission.completed
                  ? 'bg-slate-950/70 border-emerald-500/30 opacity-75'
                  : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                    mission.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {mission.completed && '✓'}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      mission.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {mission.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                    {mission.description}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300">
                +{mission.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Grid */}
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
        {t.quickActions}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <button
          onClick={() => onNavigateTab('style-lab')}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center flex flex-col items-center justify-center transition-colors min-h-[76px] touch-press"
        >
          <span className="text-xl mb-1">💈</span>
          <span className="text-xs font-bold text-white">{t.actionStyleLab}</span>
        </button>

        <button
          onClick={() => onNavigateTab('routine')}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center flex flex-col items-center justify-center transition-colors min-h-[76px] touch-press"
        >
          <span className="text-xl mb-1">⚡</span>
          <span className="text-xs font-bold text-white">{t.routineTitle || 'Daily Routine'}</span>
        </button>

        <button
          onClick={() => onNavigateTab('coach')}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center flex flex-col items-center justify-center transition-colors min-h-[76px] touch-press"
        >
          <span className="text-xl mb-1">🤖</span>
          <span className="text-xs font-bold text-white">{t.actionCoach}</span>
        </button>

        <button
          onClick={() => onNavigateTab('progress')}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center flex flex-col items-center justify-center transition-colors min-h-[76px] touch-press"
        >
          <span className="text-xl mb-1">📈</span>
          <span className="text-xs font-bold text-white">{t.navProgress}</span>
        </button>
      </div>

      {/* PRO Upgrade Card Banner */}
      {user.subscription !== 'pro' && (
        <div
          onClick={onOpenPro}
          className="rounded-3xl p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-900/30 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition-colors shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm">
              PRO
            </div>
            <div>
              <span className="text-xs font-black text-white block">
                {t.proUpgradeBanner}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {t.proUpgradeSubtitle}
              </span>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-bold">Explore →</span>
        </div>
      )}
    </div>
  );
};
