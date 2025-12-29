
import React, { useState, useMemo } from 'react';
import { Task, TaskType } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  type: TaskType;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoSection: React.FC<Props> = ({ type, tasks, setTasks }) => {
  const [inputValue, setInputValue] = useState('');
  
  const titleMap = {
    [TaskType.DAILY]: 'Daily Rituals',
    [TaskType.WEEKLY]: 'Weekly Planning',
    [TaskType.MONTHLY]: 'Monthly Outlook'
  };

  const filteredTasks = useMemo(() => 
    tasks.filter(t => t.type === type), 
  [tasks, type]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      type: type,
      date: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight serif text-slate-900">{titleMap[type]}</h1>
          <p className="text-slate-500 mt-1">Keep track of your {type.toLowerCase()} commitments.</p>
        </div>
        <div className="flex gap-2">
            <div className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <Filter size={20} />
            </div>
        </div>
      </header>

      <form onSubmit={addTask} className="relative">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`What's on your ${type.toLowerCase()} list?`}
          className="w-full pl-6 pr-14 py-5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-lg"
        />
        <button 
          type="submit"
          className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-90 shadow-md"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 divide-y divide-slate-50">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
            >
              <div 
                onClick={() => toggleTask(task.id)}
                className="cursor-pointer"
              >
                {task.completed ? (
                  <CheckCircle2 className="text-indigo-500" size={26} />
                ) : (
                  <Circle className="text-slate-300 group-hover:text-indigo-400" size={26} />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-lg transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>{format(new Date(task.date), 'MMM do, h:mm a')}</span>
                </div>
              </div>
              <button 
                onClick={() => removeTask(task.id)}
                className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-medium">Clear lists lead to clear minds.</p>
            <p className="text-slate-300 text-sm mt-1">Add your first task above.</p>
          </div>
        )}
      </div>

      {filteredTasks.length > 0 && (
        <div className="flex justify-between items-center text-sm text-slate-400 px-4">
            <span>{filteredTasks.filter(t => t.completed).length} of {filteredTasks.length} tasks completed</span>
            <button 
                onClick={() => setTasks(prev => prev.filter(t => !(t.type === type && t.completed)))}
                className="hover:text-red-500 transition-colors"
            >
                Clear completed
            </button>
        </div>
      )}
    </div>
  );
};

export default TodoSection;
