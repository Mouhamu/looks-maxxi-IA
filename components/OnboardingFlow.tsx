import React, { useState } from 'react';
import { GoalCategory, Language } from '../types';
import { translations } from '../services/i18n';

interface OnboardingFlowProps {
  lang: Language;
  onFinish: (selectedGoals: GoalCategory[]) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ lang, onFinish }) => {
  const t = translations[lang];
  const [step, setStep] = useState<number>(0);
  const [selectedGoals, setSelectedGoals] = useState<GoalCategory[]>([
    'grooming',
    'hairstyle',
    'skincare',
  ]);

  const slides = [
    {
      title: t.onboardingTitle1,
      desc: t.onboardingDesc1,
      image: '/src/assets/images/looksmaxxi_logo_icon_1791157639740.jpg',
      badge: 'LooksMaxxi BP',
    },
    {
      title: t.onboardingTitle2,
      desc: t.onboardingDesc2,
      image: '/src/assets/images/biometric_face_scan_1791157675063.jpg',
      badge: 'Biometric Vision',
    },
    {
      title: t.onboardingTitle3,
      desc: t.onboardingDesc3,
      image: '/src/assets/images/onboarding_portrait_1791157653881.jpg',
      badge: 'Actionable Blueprint',
    },
    {
      title: t.onboardingTitle4,
      desc: t.onboardingDesc4,
      image: '/src/assets/images/style_lab_essentials_1791157664827.jpg',
      badge: 'Daily Evolution',
    },
  ];

  const goalsList: { id: GoalCategory; label: string; icon: string }[] = [
    { id: 'grooming', label: t.goalGrooming, icon: '✂️' },
    { id: 'hairstyle', label: t.goalHairstyle, icon: '💈' },
    { id: 'skincare', label: t.goalSkincare, icon: '✨' },
    { id: 'style', label: t.goalStyle, icon: '👔' },
    { id: 'photo', label: t.goalPhoto, icon: '📸' },
    { id: 'presentation', label: t.goalPresentation, icon: '💎' },
  ];

  const toggleGoal = (goal: GoalCategory) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onFinish(selectedGoals);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-y-auto">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between p-4 max-w-md mx-auto w-full">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-xs font-black tracking-widest uppercase text-slate-300">
            LooksMaxxi BP
          </span>
        </div>
        {step < 4 && (
          <button
            onClick={() => setStep(4)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg"
          >
            {t.btnSkip}
          </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full py-4">
        {step < 4 ? (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            {/* Visual Anchor */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden mb-6 border border-slate-800 shadow-2xl shadow-cyan-950/40 bg-slate-900 group">
              <img
                src={slides[step].image}
                alt={slides[step].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-cyan-500/20 backdrop-blur-md">
                  {slides[step].badge}
                </span>
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-2xl font-black tracking-tight text-white mb-3 text-balance">
              {slides[step].title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {slides[step].desc}
            </p>
          </div>
        ) : (
          /* Step 5: Goal Selection */
          <div className="w-full animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                {t.onboardingGoalTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.onboardingGoalSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {goalsList.map((item) => {
                const isSelected = selectedGoals.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleGoal(item.id)}
                    className={`min-h-[58px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="flex-1">
                      <span className={`text-xs block font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-slate-950 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 max-w-md mx-auto w-full">
        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>{step === 4 ? t.btnGetStarted : t.btnContinue}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
