
import React, { useMemo } from 'react';
import { Task, Habit, Goal, JournalEntry, VisionItem, TaskType, View } from '../types';
import { format } from 'date-fns';
// Add missing icons: Target, Sparkles, BookOpen
import { CheckCircle2, Circle, TrendingUp, Calendar, Quote, Plus, Target, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  visionItems: VisionItem[];
  setActiveView: (view: View) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Dashboard: React.FC<Props> = ({ tasks, habits, goals, journalEntries, visionItems, setActiveView, setTasks }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = useMemo(() => tasks.filter(t => t.type === TaskType.DAILY && t.date.startsWith(today)), [tasks, today]);
  
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = todayTasks.length > 0 
    ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight serif text-slate-900">Welcome, Radiant Soul.</h1>
          <p className="text-slate-500 mt-2 text-lg">Today is {format(new Date(), 'EEEE, MMMM do')}.</p>
        </div>
        <button 
          onClick={() => setActiveView('daily')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          New Daily Task
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Focus Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <CheckCircle2 className="text-indigo-600" />
              Daily Focus
            </h2>
            <div className="text-sm font-medium text-slate-500">
              {progress}% Complete
            </div>
          </div>
          
          <div className="h-2 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-emerald-500 fill-emerald-50" size={24} />
                  ) : (
                    <Circle className="text-slate-300 group-hover:text-indigo-500" size={24} />
                  )}
                  <span className={`text-lg ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.text}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No tasks planned for today yet.</p>
                <button 
                   onClick={() => setActiveView('daily')}
                   className="text-indigo-600 font-medium mt-2 hover:underline"
                >
                  Get started &rarr;
                </button>
              </div>
            )}
            {todayTasks.length > 5 && (
              <button onClick={() => setActiveView('daily')} className="text-indigo-600 font-medium text-sm mt-4 hover:underline">
                See {todayTasks.length - 5} more items...
              </button>
            )}
          </div>
        </div>

        {/* Stats & Quick Links */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={24} />
              <h3 className="font-semibold text-lg">Current Streaks</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">12</span>
              <span className="mb-2 opacity-80">Days Active</span>
            </div>
            <div className="mt-8 pt-6 border-t border-indigo-500/30 flex justify-between">
               <div>
                 <p className="text-indigo-100 text-xs uppercase tracking-wider">Completed</p>
                 <p className="font-bold text-xl">142</p>
               </div>
               <div>
                 <p className="text-indigo-100 text-xs uppercase tracking-wider">Habits Hit</p>
                 <p className="font-bold text-xl">88%</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Quote size={18} className="text-indigo-600" />
              Daily Affirmation
            </h3>
            <p className="text-slate-600 italic leading-relaxed">
              "Focus on the step in front of you, not the whole staircase. Success is built on consistent, small actions."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          onClick={() => setActiveView('habits')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-all"
        >
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-bold">Habit Tracker</h4>
          <p className="text-slate-500 text-sm mt-1">{habits.length} habits tracking</p>
        </div>

        <div 
          onClick={() => setActiveView('goals')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-all"
        >
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl w-fit mb-4">
            <Target size={24} />
          </div>
          <h4 className="font-bold">Active Goals</h4>
          <p className="text-slate-500 text-sm mt-1">{goals.filter(g => g.progress < 100).length} goals in progress</p>
        </div>

        <div 
          onClick={() => setActiveView('vision')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-all"
        >
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl w-fit mb-4">
            <Sparkles size={24} />
          </div>
          <h4 className="font-bold">Vision Board</h4>
          <p className="text-slate-500 text-sm mt-1">{visionItems.length} focus areas</p>
        </div>

        <div 
          onClick={() => setActiveView('journal')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-all"
        >
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit mb-4">
            <BookOpen size={24} />
          </div>
          <h4 className="font-bold">Journal</h4>
          <p className="text-slate-500 text-sm mt-1">{journalEntries.length} entries written</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
