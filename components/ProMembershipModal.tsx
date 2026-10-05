import React from 'react';
import { Language, SubscriptionTier } from '../types';
import { translations } from '../services/i18n';

interface ProMembershipModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionTier;
  onToggleSubscription: (newTier: SubscriptionTier) => void;
}

export const ProMembershipModal: React.FC<ProMembershipModalProps> = ({
  lang,
  isOpen,
  onClose,
  subscription,
  onToggleSubscription,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const isPro = subscription === 'pro';

  const features = [
    { name: 'Deep Biometric Contour Scan', free: 'Basic (5 Metrics)', pro: 'Full (16 Deep Metrics)' },
    { name: 'BP AI Coach Conversations', free: '5 prompts / day', pro: 'Unlimited Interactive' },
    { name: 'Style Lab Haircut & Frame Matcher', free: 'Basic Filters', pro: 'Full Access & Custom Filters' },
    { name: 'Before / After Evolution Slider', free: 'Last 2 Scans', pro: 'Full Unlimited History' },
    { name: 'Personalized Daily Evolution Plan', free: 'Standard Routine', pro: 'Dynamic Habit Algorithm' },
    { name: 'High-Res Biometric PDF Export', free: 'Text Summary', pro: 'Full Architectural Report' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
        >
          ✕
        </button>

        {/* PRO Badge Lockup */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-black text-xs tracking-wider uppercase mb-2">
            <span>✨</span>
            <span>LooksMaxxi BP PRO</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white mb-1">
            Accelerate Your Evolution
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t.proUpgradeSubtitle}
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-5 overflow-hidden">
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Capability</span>
            <span className="text-center">Free</span>
            <span className="text-center text-amber-400">PRO</span>
          </div>
          <div className="divide-y divide-slate-850">
            {features.map((f, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 py-2 text-xs items-center">
                <span className="text-slate-300 font-medium text-[11px] leading-tight">{f.name}</span>
                <span className="text-center text-slate-500 text-[10px]">{f.free}</span>
                <span className="text-center text-amber-300 font-bold text-[10px]">{f.pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing / Demo Simulation Notice */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl mb-5 text-center">
          <span className="text-[10px] text-amber-300/90 font-mono block mb-1">
            DEMO SANDBOX SIMULATION
          </span>
          <p className="text-xs text-slate-300">
            Toggle your PRO status instantly to experience unrestricted access. No real card required.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onToggleSubscription(isPro ? 'free' : 'pro');
          }}
          className={`w-full h-12 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-[0.98] ${
            isPro
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-yellow-500/30 hover:brightness-110'
          }`}
        >
          {isPro ? 'Switch to Free Tier' : 'Activate PRO Demo Experience'}
        </button>

        <p className="text-[10px] text-slate-500 text-center mt-3">
          Respectful AI • Safe Recommendations • Instant Data Erasure
        </p>
      </div>
    </div>
  );
};
