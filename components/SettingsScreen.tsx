import React, { useState } from 'react';
import { GoalCategory, Language, ThemeMode, User } from '../types';
import { translations, isRTL } from '../services/i18n';
import { ContactSocialMediaSection } from './ContactSocialMediaSection';

interface SettingsScreenProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  user: User;
  onUpdateGoals: (goals: GoalCategory[]) => void;
  onClearHistory: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  lang,
  onSetLang,
  theme,
  onToggleTheme,
  user,
  onUpdateGoals,
  onClearHistory,
  onDeleteAccount,
  onLogout,
}) => {
  const t = translations[lang] || translations.en;
  const rtl = isRTL(lang);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [photoReminders, setPhotoReminders] = useState<boolean>(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [confirmClearHistory, setConfirmClearHistory] = useState<boolean>(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState<boolean>(false);

  const availableGoals: { id: GoalCategory; label: string; icon: string }[] = [
    { id: 'grooming', label: t.goalGrooming, icon: '✂️' },
    { id: 'hairstyle', label: t.goalHairstyle, icon: '💈' },
    { id: 'skincare', label: t.goalSkincare, icon: '✨' },
    { id: 'style', label: t.goalStyle, icon: '👔' },
    { id: 'photo', label: t.goalPhoto, icon: '📸' },
    { id: 'presentation', label: t.goalPresentation, icon: '💎' },
  ];

  const handleToggleGoal = (goal: GoalCategory) => {
    if (user.goals.includes(goal)) {
      if (user.goals.length > 1) {
        onUpdateGoals(user.goals.filter((g) => g !== goal));
      }
    } else {
      onUpdateGoals([...user.goals, goal]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-28 text-white animate-fade-in px-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-black text-white tracking-tight">
          {t.settingsTitle}
        </h3>
        <p className="text-xs text-slate-400">
          Personalize your preferences, localization, and support.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xl font-black text-slate-950">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{user.name}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {user.subscription}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email || 'Guest Explorer'}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Level {user.level} · {user.xp} XP · {user.streakDays} Day Streak 🔥
            </p>
          </div>
        </div>

        {/* Goals Selector */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Your Optimization Focus
        </span>
        <div className="grid grid-cols-2 gap-2">
          {availableGoals.map((g) => {
            const isSelected = user.goals.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => handleToggleGoal(g.id)}
                className={`py-2 px-3 rounded-xl border text-left rtl:text-right text-xs font-semibold flex items-center gap-2 transition-all touch-press ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{g.icon}</span>
                <span className="truncate">{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selector (EN, AR, FR, ES) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
          {t.languageSection}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'en', label: 'English', flag: '🇬🇧' },
            { id: 'ar', label: 'العربية (RTL)', flag: '🇸🇦' },
            { id: 'fr', label: 'Français', flag: '🇫🇷' },
            { id: 'es', label: 'Español', flag: '🇪🇸' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => onSetLang(l.id as Language)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 touch-press ${
                lang === l.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm">{l.flag}</span>
              <span className="text-[11px] truncate max-w-full">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contact & Social Media Section (In Profile/Settings) */}
      <div className="mb-5">
        <ContactSocialMediaSection lang={lang} />
      </div>

      {/* Help & Support Shortcut Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-base">
              💡
            </div>
            <div>
              <h4 className="text-xs font-bold text-white block">
                {t.helpSection}
              </h4>
              <p className="text-[11px] text-slate-400">
                FAQ, usage guides & direct developer contact
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-colors touch-press"
          >
            Open →
          </button>
        </div>
      </div>

      {/* Notifications & Reminders */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
          {t.notificationsSection}
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Daily Habit Reminders</span>
              <span className="text-[10px] text-slate-400">AM/PM ritual check-in notifications</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Progress Scan Reminders</span>
              <span className="text-[10px] text-slate-400">Monthly evolution photo alert</span>
            </div>
            <input
              type="checkbox"
              checked={photoReminders}
              onChange={(e) => setPhotoReminders(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
          {t.privacySection}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {t.deleteDataNotice}
        </p>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => setConfirmClearHistory(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold transition-colors text-left rtl:text-right flex items-center justify-between touch-press"
          >
            <span>{t.btnDeleteHistory}</span>
            <span>🗑</span>
          </button>

          <button
            onClick={() => setConfirmDeleteAccount(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-rose-400 text-xs font-bold transition-colors text-left rtl:text-right flex items-center justify-between touch-press"
          >
            <span>{t.btnDeleteAccount}</span>
            <span>⚠️</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="hover:text-cyan-400 transition-colors"
          >
            {t.privacyPolicy}
          </button>
          <span>·</span>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:text-cyan-400 transition-colors"
          >
            {t.termsOfService}
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 touch-press"
      >
        <span>🚪</span>
        <span>{t.btnLogout}</span>
      </button>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                  Support Center
                </span>
                <h4 className="text-base font-black text-white">{t.helpSection}</h4>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center touch-press"
              >
                ✕
              </button>
            </div>

            {/* Quick FAQ accordion items */}
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed mb-6">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-white block mb-0.5">How does the AI analyze my photo?</strong>
                <span>
                  The vision algorithm calculates vertical facial thirds, mandibular contours, and hairline framing against geometric proportions to recommend flattering haircuts and frames.
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-white block mb-0.5">Are my selfies permanently stored?</strong>
                <span>
                  No. Photos remain local on your device memory. You can wipe your entire archive anytime in the Privacy Center.
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-white block mb-0.5">How do I improve my scan scores?</strong>
                <span>
                  Maintain consistent morning skincare, schedule regular haircut taper cleanups, and follow daily routine habits.
                </span>
              </div>
            </div>

            {/* Contact & Social Media Section inside Help & Support */}
            <div className="mb-4">
              <ContactSocialMediaSection lang={lang} />
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors touch-press"
            >
              Close Support
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {confirmClearHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
            <h4 className="text-base font-bold mb-2">Delete Analysis Archive?</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              All past selfies, scores, and comparative progress data will be permanently wiped from local memory.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmClearHistory(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 touch-press"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClearHistory(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white touch-press"
              >
                Confirm Erase
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
            <h4 className="text-base font-bold mb-2 text-rose-400">Delete Account & Wipe Data</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              This will completely remove your account, profile, streak, daily missions, and analyses.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmDeleteAccount(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 touch-press"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAccount();
                  setConfirmDeleteAccount(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white touch-press"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white max-h-[80vh] overflow-y-auto">
            <h4 className="text-base font-bold mb-2 text-cyan-400">Privacy Policy</h4>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed mb-4">
              <p>LooksMaxxi BP is built with privacy at its foundation.</p>
              <p>• <strong>Photos:</strong> Your selfie images are processed strictly for real-time facial proportion estimation and styling recommendations.</p>
              <p>• <strong>No Public Exposure:</strong> Photos are never displayed publicly, sold to advertisers, or shared with third-party brokers.</p>
              <p>• <strong>Control:</strong> You retain complete ownership and can delete individual analyses or your entire account at any moment.</p>
            </div>
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs touch-press"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white max-h-[80vh] overflow-y-auto">
            <h4 className="text-base font-bold mb-2 text-cyan-400">Terms of Service</h4>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed mb-4">
              <p>• <strong>Aesthetic Suggestions Only:</strong> LooksMaxxi BP provides styling, grooming, and haircut guidance. It does not provide medical diagnoses or medical advice.</p>
              <p>• <strong>Health & Wellbeing:</strong> Never engage in extreme dieting, starvation, or unsafe self-modification. We advocate for balanced grooming, hygiene, and self-confidence.</p>
              <p>• <strong>Age:</strong> You must be at least 16 years old to use this application.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs touch-press"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
