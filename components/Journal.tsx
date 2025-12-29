
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { BookOpen, Sparkles, Smile, Cloud, Frown, Save, Trash2, Calendar, Search } from 'lucide-react';
import { generateJournalPrompt } from '../services/geminiService';
import { format } from 'date-fns';

interface Props {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const Journal: React.FC<Props> = ({ entries, setEntries }) => {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeEntry = entries.find(e => e.id === activeEntryId);

  useEffect(() => {
    if (activeEntry) {
      setTitle(activeEntry.title);
      setContent(activeEntry.content);
      setMood(activeEntry.mood);
    } else {
      setTitle('');
      setContent('');
      setMood('Neutral');
    }
  }, [activeEntryId, entries]);

  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      title: 'New Entry',
      content: '',
      mood: 'Neutral'
    };
    setEntries([newEntry, ...entries]);
    setActiveEntryId(newEntry.id);
  };

  const saveEntry = () => {
    if (!activeEntryId) return;
    setEntries(prev => prev.map(e => e.id === activeEntryId ? { ...e, title, content, mood } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (activeEntryId === id) setActiveEntryId(null);
  };

  const handleGetPrompt = async () => {
    setIsAiLoading(true);
    const prompt = await generateJournalPrompt();
    setAiPrompt(prompt);
    setIsAiLoading(false);
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Sidebar - Entry List */}
      <div className="lg:col-span-4 flex flex-col space-y-4 h-full">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold serif">Archive</h1>
          <button 
            onClick={createNewEntry}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Save size={20} />
          </button>
        </header>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id}
              onClick={() => setActiveEntryId(entry.id)}
              className={`
                p-4 rounded-2xl border cursor-pointer transition-all group
                ${activeEntryId === entry.id 
                  ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' 
                  : 'bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className={`font-bold truncate ${activeEntryId === entry.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                {entry.title || 'Untitled'}
              </h3>
              <p className="text-slate-400 text-xs mt-1 truncate">{entry.content || 'Start writing...'}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-semibold text-slate-500">
                   {entry.mood}
                </div>
              </div>
            </div>
          ))}
          {filteredEntries.length === 0 && (
             <div className="text-center py-20 text-slate-300 italic">No entries found.</div>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {activeEntryId ? (
          <div className="flex-1 flex flex-col">
            <header className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <input 
                  type="text"
                  placeholder="Entry Title..."
                  className="w-full text-2xl font-bold serif text-slate-800 focus:outline-none placeholder:text-slate-200"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={saveEntry}
                />
                <div className="flex items-center gap-2 text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                  <Calendar size={12} />
                  {format(new Date(activeEntry!.date), 'MMMM do, yyyy - h:mm a')}
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex bg-slate-50 rounded-xl p-1">
                    {['Happy', 'Neutral', 'Sad'].map(m => (
                        <button 
                            key={m}
                            onClick={() => { setMood(m); saveEntry(); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mood === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {m === 'Happy' && <Smile size={16} />}
                            {m === 'Neutral' && <Cloud size={16} />}
                            {m === 'Sad' && <Frown size={16} />}
                        </button>
                    ))}
                 </div>
              </div>
            </header>

            <div className="flex-1 relative p-8">
              <textarea 
                className="w-full h-full text-slate-700 leading-relaxed focus:outline-none resize-none placeholder:text-slate-100 text-lg"
                placeholder="Pour your thoughts onto the page..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onBlur={saveEntry}
              />
              
              <div className="absolute bottom-8 right-8 left-8">
                {aiPrompt ? (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <Sparkles className="text-indigo-600 mt-1 shrink-0" size={18} />
                    <div className="flex-1">
                      <p className="text-indigo-800 text-sm font-medium">{aiPrompt}</p>
                      <button 
                        onClick={() => { setAiPrompt(''); handleGetPrompt(); }}
                        className="text-xs text-indigo-500 font-bold mt-1 hover:underline"
                      >
                        Try another
                      </button>
                    </div>
                    <button onClick={() => setAiPrompt('')} className="text-indigo-300 hover:text-indigo-500">
                        <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGetPrompt}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                  >
                    <Sparkles size={16} />
                    {isAiLoading ? 'Summoning ideas...' : 'Get AI Prompt'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/30">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <BookOpen className="text-slate-200" size={48} />
            </div>
            <h2 className="text-2xl font-bold serif text-slate-800">Your Story Begins Here</h2>
            <p className="text-slate-400 mt-2 max-w-sm">Select an entry from the sidebar or start a fresh page to document your journey.</p>
            <button 
              onClick={createNewEntry}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Start Journaling
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
