import React from 'react';
import { Language } from '../types';
import { translations, isRTL } from '../services/i18n';

interface ContactSocialMediaSectionProps {
  lang: Language;
}

export const ContactSocialMediaSection: React.FC<ContactSocialMediaSectionProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const rtl = isRTL(lang);

  const socialLinks = [
    {
      id: 'telegram',
      name: 'Telegram',
      handle: '@zexxta',
      actionText: t.contactTelegram,
      url: 'https://t.me/zexxta',
      iconColor: 'from-sky-400 to-blue-600',
      borderColor: 'hover:border-sky-500/50',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@hebal.mohammed',
      actionText: t.contactInstagram,
      url: 'https://www.instagram.com/hebal.mohammed',
      iconColor: 'from-pink-500 via-rose-500 to-amber-500',
      borderColor: 'hover:border-pink-500/50',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="mb-3.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-cyan-400 text-sm">💬</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {t.contactSection}
          </h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.contactSubtitle}
        </p>
      </div>

      <div className="space-y-2.5">
        {socialLinks.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 ${item.borderColor} transition-all touch-press hover:bg-slate-850 group`}
          >
            <div className="flex items-center gap-3">
              {/* Platform Icon Badge */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.iconColor} flex items-center justify-center shrink-0 shadow-md shadow-slate-950/50 group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </div>

              {/* Account Handle & Action Text */}
              <div className="text-left rtl:text-right">
                <span className="text-xs font-black text-white block group-hover:text-cyan-300 transition-colors">
                  {item.handle}
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  {item.actionText}
                </span>
              </div>
            </div>

            {/* Directional Action Arrow (Mirrored in RTL) */}
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-cyan-500/40 group-hover:bg-slate-800 transition-colors shrink-0">
              <svg
                className={`w-3.5 h-3.5 transition-transform ${rtl ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
