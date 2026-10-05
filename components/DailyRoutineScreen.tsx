import React, { useState } from 'react';
import { Language, RoutineTask } from '../types';
import { translations } from '../services/i18n';

interface DailyRoutineScreenProps {
  lang: Language;
  tasks: RoutineTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, timeOfDay: 'morning' | 'evening', category: any) => void;
  streakDays: number;
}

export const DailyRoutineScreen: React.FC<DailyRoutineScreenProps> = ({
  lang,
  tasks,
  onToggleTask,
  onAddTask,
  streakDays,
}) => {
  const t = translations[lang];
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<'morning' | 'evening'>('morning');

  const morningTasks = tasks.filter((t) => t.timeOfDay === 'morning');
  const eveningTasks = tasks.filter((t) => t.timeOfDay === 'evening');

  const morningCompleted = morningTasks.filter((t) => t.completed).length;
  const eveningCompleted = eveningTasks.filter((t) => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newTime, 'grooming');
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-24 text-white animate-fade-in px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {t.routineTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.streakNotice}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
        >
          + {t.btnAddTask}
        </button>
      </div>

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-900/20 border border-amber-500/30 rounded-3xl p-4 mb-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{streakDays}</span>
              <span className="text-xs font-bold text-amber-300">Days Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Consistency builds aesthetic foundation.
            </p>
          </div>
        </div>
      </div>

      {/* Morning Ritual Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">☀️</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.morningRoutine}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {morningCompleted}/{morningTasks.length} Done
          </span>
        </div>

        <div className="space-y-2">
          {morningTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-950/70 border-emerald-500/30 opacity-75'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  {task.completed && '✓'}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      task.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {task.subtitle}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">+10 XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evening Recovery Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🌙</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.eveningRoutine}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {eveningCompleted}/{eveningTasks.length} Done
          </span>
        </div>

        <div className="space-y-2">
          {eveningTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-950/70 border-emerald-500/30 opacity-75'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  {task.completed && '✓'}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      task.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {task.subtitle}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">+10 XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl">
            <h4 className="text-base font-bold mb-1">Create Daily Habit</h4>
            <p className="text-xs text-slate-400 mb-4">
              Add a personalized grooming, skincare, or styling habit to your routine.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Eyebrow brushing & grooming"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Time of Day
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTime('morning')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      newTime === 'morning'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ☀️ Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTime('evening')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      newTime === 'evening'
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    🌙 Evening
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
