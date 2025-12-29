
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Sun, 
  CalendarRange, 
  CalendarDays, 
  Target, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Menu, 
  X,
  ChevronRight,
  Plus,
  Trash2,
  BrainCircuit
} from 'lucide-react';
import { Task, TaskType, Habit, Goal, JournalEntry, VisionItem, View } from './types';
import Dashboard from './components/Dashboard';
import TodoSection from './components/TodoSection';
import HabitTracker from './components/HabitTracker';
import GoalManager from './components/GoalManager';
import VisionBoard from './components/VisionBoard';
import Journal from './components/Journal';
import CalendarView from './components/CalendarView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence logic
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('zenith_tasks') || '[]'));
  const [habits, setHabits] = useState<Habit[]>(() => JSON.parse(localStorage.getItem('zenith_habits') || '[]'));
  const [goals, setGoals] = useState<Goal[]>(() => JSON.parse(localStorage.getItem('zenith_goals') || '[]'));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => JSON.parse(localStorage.getItem('zenith_journal') || '[]'));
  const [visionItems, setVisionItems] = useState<VisionItem[]>(() => JSON.parse(localStorage.getItem('zenith_vision') || '[]'));

  useEffect(() => {
    localStorage.setItem('zenith_tasks', JSON.stringify(tasks));
    localStorage.setItem('zenith_habits', JSON.stringify(habits));
    localStorage.setItem('zenith_goals', JSON.stringify(goals));
    localStorage.setItem('zenith_journal', JSON.stringify(journalEntries));
    localStorage.setItem('zenith_vision', JSON.stringify(visionItems));
  }, [tasks, habits, goals, journalEntries, visionItems]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily', label: 'Daily Tasks', icon: Sun },
    { id: 'weekly', label: 'Weekly Plan', icon: CalendarRange },
    { id: 'monthly', label: 'Monthly Goals', icon: CalendarDays },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'habits', label: 'Habit Tracker', icon: CheckCircle2 },
    { id: 'goals', label: 'My Goals', icon: Target },
    { id: 'vision', label: 'Vision Board', icon: Sparkles },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard tasks={tasks} habits={habits} goals={goals} journalEntries={journalEntries} visionItems={visionItems} setActiveView={setActiveView} setTasks={setTasks} />;
      case 'daily': return <TodoSection type={TaskType.DAILY} tasks={tasks} setTasks={setTasks} />;
      case 'weekly': return <TodoSection type={TaskType.WEEKLY} tasks={tasks} setTasks={setTasks} />;
      case 'monthly': return <TodoSection type={TaskType.MONTHLY} tasks={tasks} setTasks={setTasks} />;
      case 'calendar': return <CalendarView tasks={tasks} />;
      case 'habits': return <HabitTracker habits={habits} setHabits={setHabits} />;
      case 'goals': return <GoalManager goals={goals} setGoals={setGoals} />;
      case 'vision': return <VisionBoard items={visionItems} setItems={setVisionItems} />;
      case 'journal': return <Journal entries={journalEntries} setEntries={setJournalEntries} />;
      default: return <Dashboard tasks={tasks} habits={habits} goals={goals} journalEntries={journalEntries} visionItems={visionItems} setActiveView={setActiveView} setTasks={setTasks} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'} 
        transition-all duration-300 ease-in-out
        bg-white border-r border-slate-200 flex flex-col z-40
      `}>
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <BrainCircuit size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight serif">Zenith</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                ${activeView === item.id 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-indigo-600' : 'text-slate-400'} />
              {isSidebarOpen && <span>{item.label}</span>}
              {activeView === item.id && isSidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">User Name</p>
                <p className="text-xs text-slate-400 truncate">Premium Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
