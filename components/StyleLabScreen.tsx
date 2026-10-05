import React, { useState } from 'react';
import { Language, StyleItem } from '../types';
import { translations } from '../services/i18n';
import { initialStyleItems } from '../services/initialData';

interface StyleLabScreenProps {
  lang: Language;
  onBookmarkItem?: (item: StyleItem) => void;
  bookmarkedIds?: string[];
}

export const StyleLabScreen: React.FC<StyleLabScreenProps> = ({
  lang,
  onBookmarkItem,
  bookmarkedIds = [],
}) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<'hair' | 'beard' | 'glasses' | 'style'>('hair');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<StyleItem | null>(null);

  const categories: { id: 'hair' | 'beard' | 'glasses' | 'style'; label: string; icon: string }[] = [
    { id: 'hair', label: t.filterHair, icon: '💈' },
    { id: 'beard', label: t.filterBeard, icon: '✂️' },
    { id: 'glasses', label: t.filterGlasses, icon: '👓' },
    { id: 'style', label: t.filterStyle, icon: '👔' },
  ];

  const categoryItems = initialStyleItems.filter((i) => i.category === activeCategory);

  // Extract unique tags for category
  const allTags = ['All', ...Array.from(new Set(categoryItems.flatMap((i) => i.tags)))];

  const filteredItems = selectedTag === 'All'
    ? categoryItems
    : categoryItems.filter((i) => i.tags.includes(selectedTag));

  return (
    <div className="w-full max-w-md mx-auto pb-24 text-white animate-fade-in px-4">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden mb-5 border border-slate-800 bg-slate-900 p-5 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
              {t.styleLabTitle}
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mb-1">
            Personal Aesthetic Lab
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.styleLabSubtitle}
          </p>
        </div>
      </div>

      {/* Main Categories Pill/Segmented Bar */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedTag('All');
              }}
              className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-[10px] mt-0.5 truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tag Sub-filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isBookmarked = bookmarkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-850 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase font-mono">
                    {item.compatibilityTag}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Upkeep: <strong className="text-white">{item.maintenance}</strong>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBookmarkItem) onBookmarkItem(item);
                      }}
                      className={`text-sm p-1 rounded-md hover:scale-110 transition-transform ${
                        isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={t.btnSaveFavorite}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">{item.name}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {item.whyItWorks}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1 text-slate-400">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded text-[10px] text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  Explore Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Details Bottom Sheet / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                {selectedItem.category.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-black text-white mb-2">
              {selectedItem.name}
            </h3>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-4 space-y-1.5 text-xs text-slate-300">
              <p>
                <strong className="text-cyan-400">{t.compatibilityTag}:</strong> {selectedItem.compatibilityTag}
              </p>
              <p>
                <strong className="text-white">{t.maintenanceLevel}:</strong> {selectedItem.maintenance}
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300 mb-6">
              <div>
                <h5 className="font-bold text-white mb-1">{t.sectionWhy}</h5>
                <p className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  {selectedItem.whyItWorks}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-white mb-1">{t.sectionHow}</h5>
                <p className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  {selectedItem.howToTry}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onBookmarkItem) onBookmarkItem(selectedItem);
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  bookmarkedIds.includes(selectedItem.id)
                    ? 'bg-amber-950 border border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <span>{bookmarkedIds.includes(selectedItem.id) ? '★ Bookmarked' : '☆ Bookmark Look'}</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="py-3 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
