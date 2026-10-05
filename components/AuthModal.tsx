import React, { useState } from 'react';
import { Language, User } from '../types';
import { translations } from '../services/i18n';

interface AuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = translations[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setMessage(`A password reset link has been dispatched to ${email || 'your email'}.`);
      setTimeout(() => {
        setMode('login');
        setMessage(null);
      }, 3000);
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || (email ? email.split('@')[0] : 'Evolution Pioneer'),
      email: email || 'user@looksmaxxi.bp',
      isGuest: false,
      createdAt: Date.now(),
      subscription: 'free',
      goals: ['grooming', 'hairstyle', 'skincare'],
      level: 1,
      xp: 120,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    onSuccess(newUser);
    onClose();
  };

  const handleGuest = () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      name: 'Guest Pioneer',
      isGuest: true,
      createdAt: Date.now(),
      subscription: 'free',
      goals: ['grooming', 'hairstyle', 'skincare'],
      level: 1,
      xp: 50,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    onSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
        >
          ✕
        </button>

        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl font-black text-cyan-400">BP</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            {mode === 'login'
              ? t.authWelcomeBack
              : mode === 'register'
              ? t.authCreateAccount
              : 'Reset Credentials'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'forgot'
              ? 'Enter your email to receive recovery instructions.'
              : t.tagline}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs leading-relaxed text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  {t.passwordLabel}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {t.btnForgotPassword}
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-cyan-500/25 active:scale-[0.98] transition-all"
          >
            {mode === 'login'
              ? t.btnLogin
              : mode === 'register'
              ? t.btnRegister
              : 'Dispatch Reset Link'}
          </button>
        </form>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Or
          </span>
        </div>

        {/* Continue as Guest Button */}
        <button
          onClick={handleGuest}
          className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>👤</span>
          <span>{t.btnContinueGuest}</span>
        </button>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              New to LooksMaxxi BP?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-cyan-400 font-bold hover:underline"
              >
                {t.btnRegister}
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                {t.btnLogin}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
