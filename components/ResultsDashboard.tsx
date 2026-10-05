import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, Language } from '../types';
import { translations } from '../services/i18n';
import { calculateTier, compareTiers, TierData } from '../services/tierService';
import { LevelUpPlanModal } from './LevelUpPlanModal';
import { PersonalHistoryGraph } from './PersonalHistoryGraph';

interface ResultsDashboardProps {
  result: AnalysisResult;
  previousResult?: AnalysisResult | null;
  allAnalyses?: AnalysisResult[];
  lang: Language;
  onNewAnalysis: () => void;
  onAddToRoutine?: (taskTitle: string) => void;
  onOpenCoachWithContext?: (topic: string) => void;
}

// Gentle haptic feedback helper
const triggerHaptic = (pattern: number | number[] = 10) => {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Unsupported or silent devices
  }
};

// Animated Score Ring with Live Count-Up
const ScoreRing: React.FC<{ score: number; label: string; tierColor: string }> = ({
  score,
  label,
  tierColor,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const [strokeOffset, setStrokeOffset] = useState(circumference);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1100;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayScore(Math.round(score * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    const timer = setTimeout(() => {
      const targetOffset = circumference - (score / 100) * circumference;
      setStrokeOffset(targetOffset);
    }, 120);

    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl pointer-events-none animate-pulse-slow"></div>

      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#1e293b"
          strokeWidth="7"
          fill="transparent"
        />

        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="url(#scoreRingGradient)"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
        <span className="text-2xl font-black text-white font-mono tracking-tight leading-none">
          {displayScore}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};

// Loading Skeleton Placeholder
const ResultsSkeleton: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-slate-800 animate-shimmer shrink-0"></div>
      <div className="flex-1 space-y-2.5">
        <div className="w-20 h-4 bg-slate-800 rounded-md animate-shimmer"></div>
        <div className="w-36 h-6 bg-slate-800 rounded-md animate-shimmer"></div>
        <div className="w-full h-3 bg-slate-800 rounded-md animate-shimmer"></div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 h-20 flex flex-col justify-between">
          <div className="w-6 h-4 bg-slate-800 rounded animate-shimmer"></div>
          <div className="w-12 h-3 bg-slate-800 rounded animate-shimmer"></div>
          <div className="w-full h-1 bg-slate-800 rounded animate-shimmer"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  previousResult,
  allAnalyses = [],
  lang,
  onNewAnalysis,
  onAddToRoutine,
  onOpenCoachWithContext,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<
    'overview' | 'face' | 'hair' | 'grooming' | 'glasses' | 'skincare' | 'photo' | 'plan' | 'history'
  >('overview');

  // Modals & States
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showFullReportModal, setShowFullReportModal] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [addedRoutineTasks, setAddedRoutineTasks] = useState<Record<string, boolean>>({});

  // Pull-to-refresh
  const [pullY, setPullY] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safety fallback
  if (!result || !result.scores || !result.faceProfile) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center text-white my-8 animate-fade-in">
        <span className="text-3xl block mb-2">⚠️</span>
        <h4 className="text-lg font-bold mb-1">Analysis Blueprint Incomplete</h4>
        <p className="text-xs text-slate-400 mb-4">
          The requested biometric analysis record could not be formatted properly.
        </p>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs touch-press"
        >
          Capture New Analysis
        </button>
      </div>
    );
  }

  const {
    scores,
    faceProfile,
    hair,
    grooming,
    glasses,
    skincare,
    photoQuality,
    recommendations,
    actionPlan,
  } = result;

  // Calculate Tier classification
  const tierData: TierData = calculateTier(scores.presentationScore);

  // Previous comparison
  const comparison = previousResult
    ? compareTiers(previousResult.scores.presentationScore, scores.presentationScore)
    : null;

  // Top 3 improvement areas
  const topImprovementAreas = recommendations.map((r) => r.title).slice(0, 3);

  const scoreItems = [
    { label: t.scoreGrooming, value: scores.groomingScore, icon: '✂️' },
    { label: t.scoreHair, value: scores.hairCompatibility, icon: '💈' },
    { label: t.scoreStyle, value: scores.styleCompatibility, icon: '👔' },
    { label: t.scorePhoto, value: scores.photoQuality, icon: '📸' },
    { label: t.scoreRoutine, value: scores.routineConsistency, icon: '⚡' },
    { label: t.scorePresentation, value: scores.presentationScore, icon: '💎' },
  ];

  // Pull to refresh gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      if (diff > 0) {
        setPullY(Math.min(diff * 0.45, 80));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullY >= 50) {
      setIsRefreshing(true);
      triggerHaptic([15, 30]);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullY(0);
        triggerHaptic(10);
      }, 750);
    } else {
      setPullY(0);
    }
    touchStartY.current = 0;
  };

  const handleAddRoutine = (title: string, id: string) => {
    triggerHaptic(15);
    setAddedRoutineTasks((prev) => ({ ...prev, [id]: true }));
    if (onAddToRoutine) onAddToRoutine(title);
  };

  const handleSaveAnalysis = () => {
    triggerHaptic([12, 24]);
    setIsSaved(true);
    setSaveToast(t.reportSavedNotification || 'Analysis saved to your blueprint archive.');
    setTimeout(() => setSaveToast(null), 3200);
  };

  const handleCopyFullReport = () => {
    triggerHaptic(15);
    const summary = [
      `=== LOOKSMAXXI BP BIOMETRIC REPORT ===`,
      `ID: ${result.id}`,
      `Date: ${new Date(result.timestamp).toLocaleDateString()}`,
      `Score: ${scores.presentationScore}/100`,
      `Tier: ${tierData.tier} (${tierData.title})`,
      `Next Tier: ${tierData.nextTier || 'MAX TIER'} (+${tierData.pointsNeeded} pts needed)`,
      `Face Shape: ${faceProfile.faceShape}`,
      `Grooming: ${scores.groomingScore} | Hair Fit: ${scores.hairCompatibility} | Style: ${scores.styleCompatibility}`,
      ``,
      `--- TOP 3 IMPROVEMENT FOCUS AREAS ---`,
      ...topImprovementAreas.map((area, i) => `${i + 1}. ${area}`),
      ``,
      `--- TOP RECOMMENDATIONS ---`,
      ...recommendations.map((r, i) => `${i + 1}. [${r.category}] ${r.title} (${r.priority} Priority)\n   Why: ${r.why}\n   How: ${r.how}`),
      ``,
      `--- EVOLUTION PLAN ---`,
      `Today: ${actionPlan.today.join('; ')}`,
      `This Week: ${actionPlan.thisWeek.join('; ')}`,
      `This Month: ${actionPlan.thisMonth.join('; ')}`,
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setSaveToast('Full report copied to clipboard.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-md mx-auto pb-36 text-white animate-fade-in relative scroll-smooth"
    >
      {/* Pull To Refresh Indicator */}
      {pullY > 0 && (
        <div
          className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-cyan-400 transition-all duration-150 overflow-hidden"
          style={{ height: `${pullY}px`, opacity: pullY / 50 }}
        >
          <span className={`text-base ${isRefreshing ? 'animate-spin' : ''}`}>
            {pullY >= 50 ? '⚡' : '↓'}
          </span>
          <span>{isRefreshing ? 'Recalibrating Biometrics...' : pullY >= 50 ? 'Release to Refresh' : 'Pull to Refresh'}</span>
        </div>
      )}

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto p-3 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 shadow-2xl backdrop-blur-xl text-cyan-200 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-cyan-400 p-1">
            ✕
          </button>
        </div>
      )}

      {/* DEMO DATA Banner if mock engine was used */}
      {result.isMock && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>DEMO DATA · SIMULATION ENGINE</span>
          </span>
          <span className="text-slate-500 font-sans">Deterministic Fallback</span>
        </div>
      )}

      {/* Render Skeletons when pulling to refresh */}
      {isRefreshing ? (
        <ResultsSkeleton />
      ) : (
        <>
          {/* Previous Scan Comparison Transition Banner (if user has previous scan) */}
          {comparison && (
            <div className="mb-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg animate-card-enter">
              <div className="flex items-center gap-2">
                <span className="text-sm">📈</span>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Personal Progression Comparison
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mt-0.5">
                    <span className="text-slate-400">
                      {previousResult?.scores.presentationScore} ({comparison.prevTier})
                    </span>
                    <span className="text-cyan-400">→</span>
                    <span className="text-white">
                      {scores.presentationScore} ({comparison.currTier})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                    comparison.scoreDiff >= 0
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {comparison.scoreDiff >= 0 ? `+${comparison.scoreDiff}` : comparison.scoreDiff} pts
                </span>
                {comparison.leveledUp && (
                  <span className="block text-[9px] font-bold text-cyan-300 mt-1 uppercase tracking-wider animate-pulse">
                    ⚡ Tier Level Up!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* PROMINENT TIER & SCORE HERO CARD */}
          <div
            className={`relative rounded-3xl p-5 mb-4 shadow-2xl overflow-hidden border ${tierData.badgeBorder} bg-slate-900 group animate-card-enter ${tierData.badgeGlow}`}
            style={{ animationDelay: '0ms' }}
          >
            {/* Soft Ambient Moving Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-indigo-950/40 animate-gradient-flow pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header Label */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                    Your LooksMaxxi BP Tier
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {faceProfile.faceShape} Profile
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 mb-4">
                {/* Score Ring with Live Count-Up */}
                <div
                  className="cursor-pointer touch-press"
                  onClick={() => {
                    triggerHaptic();
                    setShowScoreModal(true);
                  }}
                  title="View score details"
                >
                  <ScoreRing
                    score={scores.presentationScore}
                    label="Score"
                    tierColor={tierData.badgeText}
                  />
                </div>

                {/* Prominent Tier Badge & Status */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                      {scores.presentationScore}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </div>

                  {/* Tier Badge */}
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-sm font-black tracking-wider uppercase font-mono border ${tierData.badgeBg} ${tierData.badgeBorder} ${tierData.badgeText} shadow-md`}
                    >
                      {tierData.tier}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 truncate">
                      {tierData.title}
                    </span>
                  </div>

                  {/* Next Tier & Points Needed */}
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Next Tier</span>
                      <span className="text-cyan-300 font-bold">
                        {tierData.nextTier || 'Apex Tier'}
                      </span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-slate-400 block text-[10px] uppercase">Points Needed</span>
                      <span className="text-amber-300 font-bold">
                        {tierData.nextTier ? `+${tierData.pointsNeeded} pts` : 'Maxed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress towards next tier bar */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>Progress toward {tierData.nextTier || 'Apex'}</span>
                  <span className="text-cyan-400 font-bold">{tierData.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${tierData.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons: "Level Up" Button */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic([12, 24]);
                    setShowLevelUpModal(true);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 touch-press flex items-center justify-center gap-1.5"
                >
                  <span>🚀</span>
                  <span>Level Up Plan</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab('history');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 touch-press flex items-center gap-1"
                >
                  <span>📈</span>
                  <span>History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Top 3 Improvement Focus Areas Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 mb-4 shadow-xl animate-card-enter" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Top 3 Elevation Focus Areas</span>
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">Target Points</span>
            </div>

            <div className="space-y-2">
              {topImprovementAreas.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-medium">{item}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 ml-2">
                    +{idx === 0 ? '3' : '2'} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Metrics 6-Grid with Micro Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 mb-4 animate-card-enter" style={{ animationDelay: '100ms' }}>
            {scoreItems.map((item, idx) => {
              const val = item.value || 85;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-2.5 text-center flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs font-black text-white font-mono">{val}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate block text-left">
                      {item.label}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, val)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Smooth Horizontal Category Tab Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar animate-card-enter" style={{ animationDelay: '150ms' }}>
            {[
              { id: 'overview', label: t.tabSummary },
              { id: 'history', label: 'History Graph' },
              { id: 'face', label: t.tabFace },
              { id: 'hair', label: t.tabHair },
              { id: 'grooming', label: t.tabGrooming },
              { id: 'glasses', label: t.tabGlasses },
              { id: 'skincare', label: t.tabSkincare },
              { id: 'photo', label: t.tabPhoto },
              { id: 'plan', label: t.tabActionPlan },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-press shrink-0 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 glow-cyan-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Panel: History Graph */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-fade-in">
              <PersonalHistoryGraph
                analyses={allAnalyses.length > 0 ? allAnalyses : [result]}
              />
            </div>
          )}

          {/* Tab Panel: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3.5">
              {/* Facial Blueprint Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 shadow-xl animate-card-enter" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span>📐</span>
                    <span>Structural Harmony Observation</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Biometric Mesh</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                    <span className="text-white font-bold block mb-0.5">Mandibular Presentation</span>
                    <p>{faceProfile.jawlineChin}</p>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                    <span className="text-white font-bold block mb-0.5">Hairline & Forehead Framing</span>
                    <p>{faceProfile.foreheadHairline}</p>
                  </div>
                </div>
              </div>

              {/* Sequential Priority Recommendations List */}
              <div className="flex items-center justify-between mt-5 mb-2 px-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Personalized Recommendations
                </h4>
                <span className="text-[10px] font-mono text-cyan-400">
                  {recommendations.length} Suggestions
                </span>
              </div>

              {recommendations.map((rec, index) => {
                const isAdded = addedRoutineTasks[rec.id];
                const isHigh = rec.priority === 'HIGH';
                return (
                  <div
                    key={rec.id}
                    className={`bg-slate-900 border rounded-2xl p-4 transition-all animate-card-enter ${
                      isHigh ? 'border-cyan-500/40 glow-cyan-sm' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    style={{ animationDelay: `${260 + index * 60}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                        {rec.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          rec.priority === 'HIGH'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : rec.priority === 'MEDIUM'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rec.priority === 'HIGH'
                          ? t.priorityHigh
                          : rec.priority === 'MEDIUM'
                          ? t.priorityMedium
                          : t.priorityLow}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white mb-1.5">{rec.title}</h5>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-3.5 leading-relaxed">
                      <p>
                        <span className="text-slate-400 font-medium">{t.sectionWhy}: </span>
                        {rec.why}
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">{t.sectionHow}: </span>
                        {rec.how}
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">{t.sectionMaintenance}: </span>
                        <span className="text-cyan-400 font-semibold">{rec.maintenance}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
                      <button
                        onClick={() => handleAddRoutine(rec.title, rec.id)}
                        disabled={isAdded}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all touch-press flex items-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{isAdded ? '✓' : '+'}</span>
                        <span>{isAdded ? 'Added to Routine' : t.btnAddToRoutine}</span>
                      </button>

                      {onOpenCoachWithContext && (
                        <button
                          onClick={() => {
                            triggerHaptic(10);
                            onOpenCoachWithContext(rec.title);
                          }}
                          className="text-xs text-cyan-400 hover:underline font-semibold touch-press"
                        >
                          Ask BP Coach →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Face Tab */}
          {activeTab === 'face' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📐</span>
                  <h4 className="text-sm font-bold text-white">Estimated Facial Geometry</h4>
                </div>
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Face Shape Classification</span>
                    <p>{faceProfile.faceShape} contours.</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Proportions & Thirds</span>
                    <p>{faceProfile.proportions}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Symmetry Observations</span>
                    <p>{faceProfile.symmetryNotes}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Jawline & Neck Transition</span>
                    <p>{faceProfile.jawlineChin}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hair & Beard Tab */}
          {activeTab === 'hair' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span>💈</span>
                  <span>Hairstyle Compatibility</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">{hair.compatibility}</p>

                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                  Recommended Cuts
                </span>
                <div className="space-y-2 mb-5">
                  {hair.suggestedStyles?.map((style, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white flex items-center justify-between"
                    >
                      <span>{style}</span>
                      <span className="text-cyan-400 text-[10px] font-mono">Recommended</span>
                    </div>
                  ))}
                </div>

                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span>✂️</span>
                  <span>Beard & Facial Hair Strategy</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {grooming.beardCompatibility}
                </p>
              </div>
            </div>
          )}

          {/* Grooming Tab */}
          {activeTab === 'grooming' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>✂️</span>
                  <span>Grooming & Presentation</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-1">Eyebrow Framing</span>
                    <p>{grooming.eyebrowSuggestions}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-1">Neckline Lineup & Tidiness</span>
                    <p>{grooming.generalPresentation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Glasses Tab */}
          {activeTab === 'glasses' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>👓</span>
                  <span>Optical Frame Harmony</span>
                </h4>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                  Top Frame Geometries
                </span>
                <div className="space-y-2 mb-4">
                  {glasses.recommendedFrames?.map((frame, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                    >
                      {frame}
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <p>
                    <strong className="text-white">Proportions:</strong> {glasses.frameProportions}
                  </p>
                  <p>
                    <strong className="text-white">Style Finishes:</strong> {glasses.styleCompatibility}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skincare Tab */}
          {activeTab === 'skincare' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-2">Skin Appearance Guidance</h4>
                <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {skincare.visibleAppearance}
                </p>

                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  ☀️ Morning Routine (AM)
                </span>
                <div className="space-y-1.5 mb-4">
                  {skincare.morningRoutine?.map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {step}
                    </div>
                  ))}
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                  🌙 Evening Routine (PM)
                </span>
                <div className="space-y-1.5 mb-4">
                  {skincare.eveningRoutine?.map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {step}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 italic">
                  💧 {skincare.hydrationAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Photo Quality Tab */}
          {activeTab === 'photo' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>📸</span>
                  <span>Photometric Quality Evaluation</span>
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Lighting</span>
                    <p>{photoQuality.lighting}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Camera Angle</span>
                    <p>{photoQuality.angle}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Focal Distance</span>
                    <p>{photoQuality.distance}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">Sharpness</span>
                    <p>{photoQuality.sharpness}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Plan Tab */}
          {activeTab === 'plan' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span>🚀</span>
                  <span>Evolution Action Plan</span>
                </h4>

                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                    Today
                  </span>
                  <div className="space-y-2">
                    {actionPlan.today?.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700"
                      >
                        <input type="checkbox" className="mt-0.5 rounded text-cyan-500 focus:ring-0" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                    This Week
                  </span>
                  <div className="space-y-2">
                    {actionPlan.thisWeek?.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700"
                      >
                        <input type="checkbox" className="mt-0.5 rounded text-indigo-500 focus:ring-0" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">
                    This Month
                  </span>
                  <div className="space-y-2">
                    {actionPlan.thisMonth?.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700"
                      >
                        <input type="checkbox" className="mt-0.5 rounded text-purple-500 focus:ring-0" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Score Explanation Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold text-cyan-400">
                Tier & Score Breakdown
              </h4>
              <button
                onClick={() => setShowScoreModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Tiers are gamified progress markers for personal grooming, haircut harmony, and styling discipline. They do not measure human worth or social status.
            </p>
            <div className="space-y-2 text-xs text-slate-400 mb-5 font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>0–29: SUB3</span>
                <span className="text-slate-500">Foundational</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>30–39: SUB5</span>
                <span className="text-amber-400">Developing</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>40–49: LTN</span>
                <span className="text-blue-400">Approaching Harmony</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>50–59: MTN</span>
                <span className="text-cyan-400">Balanced Standard</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>60–69: HTN</span>
                <span className="text-indigo-400">High Refinement</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>70–89: CHAD</span>
                <span className="text-yellow-400">Peak Harmony</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>90–100: TRUE ADAM</span>
                <span className="text-cyan-300">Apex Master</span>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                setShowScoreModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs touch-press"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Level Up Personalized Plan Modal */}
      {showLevelUpModal && (
        <LevelUpPlanModal
          tierData={tierData}
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          topImprovementAreas={topImprovementAreas}
        />
      )}

      {/* Full Report Modal */}
      {showFullReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                  LooksMaxxi BP Blueprint
                </span>
                <h4 className="text-base font-black text-white">Full Biometric Report</h4>
              </div>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center touch-press"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed mb-6">
              {/* Executive Tier & Summary */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Tier</span>
                  <span className={`text-base font-black font-mono ${tierData.badgeText}`}>
                    {tierData.tier} ({tierData.title})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Presentation Score</span>
                  <span className="text-base font-black text-cyan-400 font-mono">{scores.presentationScore}/100</span>
                </div>
              </div>

              {/* Proportions & Hair */}
              <div>
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 text-cyan-400">
                  Facial Proportions
                </h5>
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  {faceProfile.proportions}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 text-indigo-400">
                  Hairstyle & Barber Specification
                </h5>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <p><strong>Observed Category:</strong> {hair.currentCategory}</p>
                  <p><strong>Primary Recommended Cut:</strong> {hair.suggestedStyles?.[0]}</p>
                  <p><strong>Styling Tip:</strong> {hair.compatibility}</p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 text-amber-400">
                  Optical Frames
                </h5>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <p><strong>Recommended Geometries:</strong> {glasses.recommendedFrames?.join(', ')}</p>
                  <p><strong>Proportions:</strong> {glasses.frameProportions}</p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 text-emerald-400">
                  Action Plan Roadmap
                </h5>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                  <p><strong>Today:</strong> {actionPlan.today?.join(' • ')}</p>
                  <p><strong>This Week:</strong> {actionPlan.thisWeek?.join(' • ')}</p>
                  <p><strong>This Month:</strong> {actionPlan.thisMonth?.join(' • ')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleCopyFullReport}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors touch-press flex items-center justify-center gap-1.5"
              >
                <span>📄</span>
                <span>Copy Full Report</span>
              </button>
              <button
                onClick={() => setShowFullReportModal(false)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs touch-press"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2.5 safe-area-bottom shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Button 1: Save Analysis */}
          <button
            onClick={handleSaveAnalysis}
            className={`flex-1 h-12 rounded-xl text-xs font-bold transition-all touch-press flex items-center justify-center gap-1.5 border ${
              isSaved
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <span className="text-sm">{isSaved ? '✓' : '💾'}</span>
            <span className="truncate">{isSaved ? 'Saved' : 'Save Analysis'}</span>
          </button>

          {/* Button 2: View Full Report (Primary CTA) */}
          <button
            onClick={() => {
              triggerHaptic([10, 20]);
              setShowFullReportModal(true);
            }}
            className="flex-[1.3] h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all touch-press flex items-center justify-center gap-1.5 glow-cyan-sm"
          >
            <span className="text-sm">📄</span>
            <span className="truncate">View Full Report</span>
          </button>

          {/* Button 3: Analyze Again */}
          <button
            onClick={() => {
              triggerHaptic(10);
              onNewAnalysis();
            }}
            className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-300 font-bold text-xs transition-all touch-press flex items-center justify-center gap-1.5"
          >
            <span className="text-sm">↺</span>
            <span className="truncate">Analyze Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
