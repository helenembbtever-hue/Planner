
import React, { useState } from 'react';
import { Task } from '../types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Circle } from 'lucide-react';

interface Props {
  tasks: Task[];
}

const CalendarView: React.FC<Props> = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(t => isSameDay(new Date(t.date), day));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight serif text-slate-900">Time Landscape</h1>
          <p className="text-slate-500 mt-1">Visualize your rhythm across the weeks.</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="px-6 font-bold text-lg serif min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 h-[700px]">
          {days.map((day, idx) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div 
                key={idx} 
                className={`
                  p-3 border-r border-b border-slate-50 flex flex-col gap-2 transition-colors
                  ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`
                    text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-indigo-600 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                        {dayTasks.length}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                        key={task.id} 
                        className={`text-[10px] px-2 py-1 rounded truncate flex items-center gap-1.5 ${task.completed ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50/50 text-indigo-700'}`}
                    >
                        <div className={`w-1 h-1 rounded-full ${task.completed ? 'bg-slate-300' : 'bg-indigo-500'}`} />
                        {task.text}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-slate-400 pl-2">
                        + {dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
