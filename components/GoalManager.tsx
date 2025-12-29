
import React, { useState } from 'react';
import { Goal } from '../types';
import { Plus, Target, Calendar, Sparkles, MoreHorizontal, Trash2 } from 'lucide-react';
import { suggestGoalBreakdown } from '../services/geminiService';

interface Props {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalManager: React.FC<Props> = ({ goals, setGoals }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', deadline: '', category: 'Personal' });
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      description: newGoal.description,
      deadline: newGoal.deadline,
      progress: 0,
      category: newGoal.category
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', deadline: '', category: 'Personal' });
    setIsAdding(false);
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g));
  };

  const handleAiAssistance = async (goal: Goal) => {
    setAiLoading(goal.id);
    const suggestion = await suggestGoalBreakdown(goal.title);
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, description: g.description + '\n\nAI Suggested Steps:\n' + suggestion } : g));
    setAiLoading(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight serif text-slate-900">Mission Control</h1>
          <p className="text-slate-500 mt-1">Design your future with clarity and purpose.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          New Goal
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6">New Objective</h2>
          <form onSubmit={addGoal} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Goal Title</label>
              <input 
                autoFocus
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="What do you want to achieve?"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Category</label>
                    <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={newGoal.category}
                        onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                    >
                        <option>Personal</option>
                        <option>Career</option>
                        <option>Health</option>
                        <option>Wealth</option>
                        <option>Social</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Target Deadline</label>
                    <input 
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newGoal.deadline}
                        onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Details (Optional)</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                placeholder="Why is this important? How will you track it?"
                value={newGoal.description}
                onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                {goal.category}
              </div>
              <button 
                onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}
                className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{goal.title}</h3>
            <p className="text-slate-500 text-sm mb-6 whitespace-pre-wrap">{goal.description || 'No description provided.'}</p>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <Calendar size={16} />
              <span>Target: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-400">Progress</span>
                <span className="text-indigo-600">{goal.progress}%</span>
              </div>
              <input 
                type="range"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={goal.progress}
                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => handleAiAssistance(goal)}
                  disabled={!!aiLoading}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {aiLoading === goal.id ? 'Thinking...' : 'AI Breakdown'}
                </button>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-400">
                    +3
                  </div>
                </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-32 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                <Target className="text-slate-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Aim High</h3>
            <p className="text-slate-300 mt-2">The only limit is your imagination.</p>
            <button 
               onClick={() => setIsAdding(true)}
               className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              Add your first goal &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalManager;
