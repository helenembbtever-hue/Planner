
import React, { useState } from 'react';
import { VisionItem } from '../types';
// Add missing Trash2 icon import
import { Plus, X, Camera, ExternalLink, Image as ImageIcon, LayoutGrid, Sparkles, Trash2 } from 'lucide-react';
import { generateAffirmation } from '../services/geminiService';

interface Props {
  items: VisionItem[];
  setItems: React.Dispatch<React.SetStateAction<VisionItem[]>>;
}

const VisionBoard: React.FC<Props> = ({ items, setItems }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ imageUrl: '', caption: '', category: 'Career' });
  const [affirmation, setAffirmation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) return;

    const item: VisionItem = {
      id: crypto.randomUUID(),
      imageUrl: newItem.imageUrl,
      caption: newItem.caption,
      category: newItem.category
    };

    setItems([...items, item]);
    setNewItem({ imageUrl: '', caption: '', category: 'Career' });
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleGenerateAffirmation = async () => {
    if (items.length === 0) return;
    setIsAiLoading(true);
    const summary = items.map(i => i.caption).join(', ');
    const res = await generateAffirmation(summary);
    setAffirmation(res);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight serif text-slate-900">Vision & Manifestation</h1>
          <p className="text-slate-500 mt-1">Surround yourself with the visual energy of your dreams.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleGenerateAffirmation}
                disabled={isAiLoading || items.length === 0}
                className="bg-purple-50 text-purple-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-100 transition-all border border-purple-100 disabled:opacity-50"
            >
                <Sparkles size={20} />
                {isAiLoading ? 'Synthesizing...' : 'Vision Affirmation'}
            </button>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
                <Plus size={20} />
                Add Inspiration
            </button>
        </div>
      </header>

      {affirmation && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
            <h3 className="text-indigo-100 uppercase tracking-widest text-xs font-bold mb-2">Daily Manifestation</h3>
            <p className="text-2xl font-medium serif italic leading-relaxed">"{affirmation}"</p>
            <button onClick={() => setAffirmation('')} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg">
                <X size={20} />
            </button>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add Inspiration</h2>
                    <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={addItem} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input 
                                autoFocus
                                type="url"
                                placeholder="https://picsum.photos/..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                value={newItem.imageUrl}
                                onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600">Context/Caption</label>
                        <input 
                            type="text"
                            placeholder="What does this represent?"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            value={newItem.caption}
                            onChange={e => setNewItem({...newItem, caption: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600">Category</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                            value={newItem.category}
                            onChange={e => setNewItem({...newItem, category: e.target.value})}
                        >
                            <option>Career</option>
                            <option>Travel</option>
                            <option>Health</option>
                            <option>Relationships</option>
                            <option>Wealth</option>
                            <option>Spirituality</option>
                        </select>
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg mt-4"
                    >
                        Pin to Board
                    </button>
                </form>
            </div>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map(item => (
          <div key={item.id} className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 bg-white">
            <img 
              src={item.imageUrl} 
              alt={item.caption} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?blur=2'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white w-fit mb-2 uppercase tracking-widest border border-white/30">
                    {item.category}
                </div>
                <p className="text-white font-bold text-lg leading-tight">{item.caption}</p>
                <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-xl hover:bg-red-500 transition-all border border-white/20"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            {/* Minimal static caption for non-hover state */}
            <div className="p-4 md:hidden group-hover:hidden">
               <p className="text-slate-700 font-semibold">{item.caption}</p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-40 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid className="text-slate-200" size={40} />
            </div>
            <h2 className="text-2xl font-bold serif text-slate-800">Your Vision Awaits</h2>
            <p className="text-slate-400 mt-2 max-w-sm">Capture images that inspire you. If you can see it, you can achieve it.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Add Inspiration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionBoard;
