
import React, { useState } from 'react';
import { Habit } from '../types';
import { format, subDays, isSameDay, startOfWeek, addDays } from 'date-fns';
import { Plus, Trash2, Check, Flame, Award } from 'lucide-react';

interface Props {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitTracker: React.FC<Props> = ({ habits, setHabits }) => {
  const [newHabitName, setNewHabitName] = useState('');
  
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
  const today = format(new Date(), 'yyyy-MM-dd');

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-purple-500', 'bg-cyan-500'];
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      history: [],
      color: colors[habits.length % colors.length]
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleDate = (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const hasDate = h.history.includes(dateStr);
        return {
          ...h,
          history: hasDate 
            ? h.history.filter(d => d !== dateStr) 
            : [...h.history, dateStr]
        };
      }
      return h;
    }));
  };

  const calculateStreak = (history: string[]) => {
    let streak = 0;
    let curr = new Date();
    while (history.includes(format(curr, 'yyyy-MM-dd'))) {
      streak++;
      curr = subDays(curr, 1);
    }
    return streak;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight serif text-slate-900">Consistency is Key</h1>
          <p className="text-slate-500 mt-1">Tiny habits lead to transformative change.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
              <Award size={20} />
              Elite Performer
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="p-6 text-left font-bold text-slate-400 text-xs uppercase tracking-widest min-w-[200px]">Habit</th>
                    {last7Days.map(date => (
                      <th key={date.toString()} className="p-4 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium">{format(date, 'EEE')}</span>
                          <span className={`text-sm font-bold mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full mx-auto ${isSameDay(date, new Date()) ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                            {format(date, 'd')}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="p-6 text-center font-bold text-slate-400 text-xs uppercase tracking-widest">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {habits.map(habit => (
                    <tr key={habit.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700">{habit.name}</span>
                            <button 
                                onClick={() => setHabits(habits.filter(h => h.id !== habit.id))}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </td>
                      {last7Days.map(date => {
                        const isCompleted = habit.history.includes(format(date, 'yyyy-MM-dd'));
                        return (
                          <td key={date.toString()} className="p-4 text-center">
                            <button
                              onClick={() => toggleDate(habit.id, date)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? `${habit.color} text-white scale-110 shadow-lg` 
                                  : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {isCompleted && <Check size={20} />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                           <Flame size={20} fill="currentColor" />
                           {calculateStreak(habit.history)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {habits.length === 0 && (
                    <tr>
                        <td colSpan={9} className="p-20 text-center text-slate-400 italic">
                            No habits being tracked. Add one to start your streak!
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold mb-4">Add New Habit</h3>
                <form onSubmit={addHabit} className="space-y-4">
                    <input 
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="e.g. Read 20 mins"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <button 
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        Create Habit
                    </button>
                </form>
            </div>

            <div className="bg-indigo-50 p-6 rounded-3xl">
                <h3 className="font-bold text-indigo-900 mb-2">Pro Tip</h3>
                <p className="text-indigo-700 text-sm leading-relaxed">
                    Start with habits so small they're impossible to fail. Floss one tooth, read one page, walk for two minutes. Consistency beats intensity.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
