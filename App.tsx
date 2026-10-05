import React, { useState, useEffect, useCallback } from 'react';
import {
  Achievement,
  AnalysisResult,
  DailyMission,
  GoalCategory,
  Language,
  NavigationTab,
  RoutineTask,
  StyleItem,
  SubscriptionTier,
  ThemeMode,
  User,
} from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { isRTL, translations } from './services/i18n';
import { analyzeFaceWithAI } from './services/aiAnalysisService';
import {
  initialAchievements,
  initialDailyMissions,
  initialRoutineTasks,
} from './services/initialData';

import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AuthModal } from './components/AuthModal';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { ScanningHud } from './components/ScanningHud';
import { HomeDashboard } from './components/HomeDashboard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { StyleLabScreen } from './components/StyleLabScreen';
import { CoachScreen } from './components/CoachScreen';
import { ProgressTrackerScreen } from './components/ProgressTrackerScreen';
import { DailyRoutineScreen } from './components/DailyRoutineScreen';
import { ProMembershipModal } from './components/ProMembershipModal';
import { SettingsScreen } from './components/SettingsScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

const defaultGuestUser: User = {
  id: 'guest_user_1',
  name: 'Aesthetic Pioneer',
  email: 'pioneer@looksmaxxi.bp',
  isGuest: true,
  createdAt: Date.now(),
  subscription: 'free',
  goals: ['grooming', 'hairstyle', 'skincare'],
  level: 1,
  xp: 75,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const App: React.FC = () => {
  // Persistent State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>(
    'bp_has_completed_onboarding',
    false
  );
  const [user, setUser] = useLocalStorage<User>('bp_current_user', defaultGuestUser);
  const [analyses, setAnalyses] = useLocalStorage<AnalysisResult[]>('bp_analyses_history', []);
  const [dailyMissions, setDailyMissions] = useLocalStorage<DailyMission[]>(
    'bp_daily_missions',
    initialDailyMissions
  );
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'bp_achievements',
    initialAchievements
  );
  const [routineTasks, setRoutineTasks] = useLocalStorage<RoutineTask[]>(
    'bp_routine_tasks',
    initialRoutineTasks
  );
  const [bookmarkedStyleIds, setBookmarkedStyleIds] = useLocalStorage<string[]>(
    'bp_bookmarked_styles',
    ['sh_1', 'sg_1']
  );
  const [lang, setLang] = useLocalStorage<Language>('bp_language', 'en');
  const [theme, setTheme] = useLocalStorage<ThemeMode>('bp_theme', 'dark');

  // Runtime View States
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    analyses.length > 0 ? analyses[0] : null
  );
  const [isViewingResults, setIsViewingResults] = useState<boolean>(false);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningImage, setScanningImage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [coachTopicContext, setCoachTopicContext] = useState<string | undefined>(undefined);

  // Update document language & direction
  useEffect(() => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Finish Onboarding
  const handleFinishOnboarding = (goals: GoalCategory[]) => {
    setUser((prev) => ({ ...prev, goals }));
    setHasCompletedOnboarding(true);
  };

  // Trigger Capture
  const handleStartAnalysis = () => {
    setIsCaptureModalOpen(true);
  };

  // Confirm photo from camera/gallery
  const handleConfirmPhoto = async (dataUrl: string, mimeType: string) => {
    setIsCaptureModalOpen(false);
    setScanningImage(dataUrl);
    setIsScanning(true);

    try {
      const result = await analyzeFaceWithAI(dataUrl, mimeType, user.goals);

      // Award XP & Level calculation
      const gainedXP = 120;
      setUser((prev) => {
        const newXP = prev.xp + gainedXP;
        const newLevel = Math.floor(newXP / 200) + 1;
        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          streakDays: prev.streakDays + 1,
        };
      });

      // Update achievements
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach_1') return { ...ach, unlocked: true, progress: 1 };
          if (ach.id === 'ach_4') {
            const nextProgress = Math.min(ach.max, ach.progress + 1);
            return { ...ach, progress: nextProgress, unlocked: nextProgress >= ach.max };
          }
          return ach;
        })
      );

      // Save analysis
      setAnalyses((prev) => [result, ...prev]);
      setCurrentAnalysis(result);

      // Allow cinematic scan to complete smoothly
      setTimeout(() => {
        setIsScanning(false);
        setIsViewingResults(true);
      }, 3500);
    } catch (err) {
      console.error('Analysis error:', err);
      setIsScanning(false);
    }
  };

  // Toggle mission completion
  const handleToggleMission = (id: string) => {
    setDailyMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = !m.completed;
          if (next) {
            setUser((u) => ({ ...u, xp: u.xp + m.xp }));
          }
          return { ...m, completed: next };
        }
        return m;
      })
    );
  };

  // Routine toggle
  const handleToggleRoutineTask = (id: string) => {
    setRoutineTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            setUser((u) => ({ ...u, xp: u.xp + 10 }));
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  // Add recommendation to routine
  const handleAddRecommendationToRoutine = (taskTitle: string) => {
    const newTask: RoutineTask = {
      id: `custom_${Date.now()}`,
      title: taskTitle,
      subtitle: 'Generated from your biometric blueprint',
      timeOfDay: 'morning',
      completed: false,
      category: 'grooming',
    };
    setRoutineTasks((prev) => [newTask, ...prev]);
  };

  // Add custom habit to routine
  const handleAddCustomHabit = (
    title: string,
    timeOfDay: 'morning' | 'evening',
    category: any
  ) => {
    const newTask: RoutineTask = {
      id: `habit_${Date.now()}`,
      title,
      subtitle: 'Personal self-improvement habit',
      timeOfDay,
      completed: false,
      category,
    };
    setRoutineTasks((prev) => [newTask, ...prev]);
  };

  // Bookmark / Unbookmark Style Item
  const handleBookmarkStyleItem = (item: StyleItem) => {
    setBookmarkedStyleIds((prev) => {
      const exists = prev.includes(item.id);
      const updated = exists ? prev.filter((id) => id !== item.id) : [...prev, item.id];

      // Update achievements
      if (!exists && updated.length >= 3) {
        setAchievements((achList) =>
          achList.map((a) => (a.id === 'ach_3' ? { ...a, unlocked: true, progress: 3 } : a))
        );
      }
      return updated;
    });
  };

  // Delete analysis
  const handleDeleteAnalysis = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(analyses.find((a) => a.id !== id) || null);
    }
  };

  // Delete all history
  const handleClearAllHistory = () => {
    setAnalyses([]);
    setCurrentAnalysis(null);
    setIsViewingResults(false);
  };

  // Delete Account
  const handleDeleteAccount = () => {
    setUser(defaultGuestUser);
    setAnalyses([]);
    setCurrentAnalysis(null);
    setHasCompletedOnboarding(false);
    setIsViewingResults(false);
  };

  // Subscription toggle (Demo simulation)
  const handleToggleSubscription = (newTier: SubscriptionTier) => {
    setUser((prev) => ({ ...prev, subscription: newTier }));
  };

  // Open coach with direct question context
  const handleOpenCoachWithContext = (topic: string) => {
    setCoachTopicContext(topic);
    setIsViewingResults(false);
    setCurrentTab('coach');
  };

  // Tab switch
  const handleSelectTab = (tab: NavigationTab) => {
    setIsViewingResults(false);
    setCurrentTab(tab);
  };

  // If user hasn't completed onboarding, show onboarding flow
  if (!hasCompletedOnboarding) {
    return (
      <div className="bg-slate-950 text-white min-h-screen">
        <OnboardingFlow lang={lang} onFinish={handleFinishOnboarding} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'}`}>
        {/* Android Top Status Bar & App Bar */}
      <AndroidTopBar
        lang={lang}
        streakDays={user.streakDays}
        level={user.level}
        xp={user.xp}
        subscription={user.subscription}
        onOpenPro={() => setIsProModalOpen(true)}
        onOpenSettings={() => setCurrentTab('profile')}
        theme={theme}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-3">
        {/* If viewing a full analysis blueprint */}
        {isViewingResults && currentAnalysis ? (
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsViewingResults(false)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                Blueprint #{currentAnalysis.id.slice(-6)}
              </span>
            </div>
            <ResultsDashboard
              result={currentAnalysis}
              previousResult={analyses.find((a) => a.id !== currentAnalysis.id) || null}
              allAnalyses={analyses}
              lang={lang}
              onNewAnalysis={handleStartAnalysis}
              onAddToRoutine={handleAddRecommendationToRoutine}
              onOpenCoachWithContext={handleOpenCoachWithContext}
            />
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeDashboard
                lang={lang}
                user={user}
                latestAnalysis={analyses.length > 0 ? analyses[0] : null}
                dailyMissions={dailyMissions}
                onToggleMission={handleToggleMission}
                onStartAnalysis={handleStartAnalysis}
                onViewAnalysis={(a) => {
                  setCurrentAnalysis(a);
                  setIsViewingResults(true);
                }}
                onNavigateTab={handleSelectTab}
                onOpenPro={() => setIsProModalOpen(true)}
              />
            )}

            {currentTab === 'style-lab' && (
              <StyleLabScreen
                lang={lang}
                onBookmarkItem={handleBookmarkStyleItem}
                bookmarkedIds={bookmarkedStyleIds}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressTrackerScreen
                lang={lang}
                analyses={analyses}
                achievements={achievements}
                onSelectAnalysis={(a) => {
                  setCurrentAnalysis(a);
                  setIsViewingResults(true);
                }}
                onDeleteAnalysis={handleDeleteAnalysis}
                onNewAnalysis={handleStartAnalysis}
              />
            )}

            {currentTab === 'coach' && (
              <CoachScreen
                lang={lang}
                latestAnalysis={analyses.length > 0 ? analyses[0] : null}
                initialTopic={coachTopicContext}
              />
            )}

            {currentTab === 'profile' && (
              <SettingsScreen
                lang={lang}
                onSetLang={setLang}
                theme={theme}
                onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                user={user}
                onUpdateGoals={(goals) => setUser((prev) => ({ ...prev, goals }))}
                onClearHistory={handleClearAllHistory}
                onDeleteAccount={handleDeleteAccount}
                onLogout={() => setIsAuthModalOpen(true)}
              />
            )}

            {currentTab === 'routine' && (
              <DailyRoutineScreen
                lang={lang}
                tasks={routineTasks}
                onToggleTask={handleToggleRoutineTask}
                onAddTask={handleAddCustomHabit}
                streakDays={user.streakDays}
              />
            )}
          </>
        )}
      </main>

      {/* Android Bottom Navigation */}
      {!isViewingResults && (
        <AndroidBottomNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          lang={lang}
        />
      )}

      {/* Modals & Scanning HUD */}
      {isCaptureModalOpen && (
        <PhotoCaptureModal
          lang={lang}
          isOpen={isCaptureModalOpen}
          onClose={() => setIsCaptureModalOpen(false)}
          onConfirmPhoto={handleConfirmPhoto}
        />
      )}

      {isScanning && scanningImage && (
        <ScanningHud
          lang={lang}
          image={scanningImage}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          lang={lang}
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(u) => setUser(u)}
        />
      )}

      {isProModalOpen && (
        <ProMembershipModal
          lang={lang}
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
          subscription={user.subscription}
          onToggleSubscription={handleToggleSubscription}
        />
      )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
