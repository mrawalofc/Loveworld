import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Heart, Star, Camera, Coffee, MapPin, 
  Sparkles, Plus, Trash2, Edit2, X, Save 
} from 'lucide-react';

interface MomentData {
  id: string;
  date: string;
  titleBN: string;
  titleEN: string;
  descriptionBN: string;
  descriptionEN: string;
  iconId: string;
  color: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  coffee: <Coffee size={24} />,
  calendar: <Calendar size={24} />,
  star: <Star size={24} />,
  mapPin: <MapPin size={24} />,
  camera: <Camera size={24} />,
  heart: <Heart size={24} />,
  sparkles: <Sparkles size={24} />
};

const COLORS = [
  "from-pink-500 to-rose-400",
  "from-blue-500 to-indigo-400",
  "from-yellow-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-purple-500 to-indigo-400",
  "from-red-500 to-pink-500"
];

const DEFAULT_MOMENTS: MomentData[] = [
  {
    id: '1',
    date: "September 1, 2024",
    titleBN: "আমাদের প্রথম দেখা",
    titleEN: "Our First Meeting",
    descriptionBN: "সেই দিনটি ছিল অসাধারণ। তোমার সাথে প্রথম দেখা হওয়ার মুহূর্তটি আমি কখনোই ভুলবো না।",
    descriptionEN: "That day was extraordinary. I will never forget the moment I first saw you.",
    iconId: 'coffee',
    color: "from-pink-500 to-rose-400"
  },
  {
    id: '2',
    date: "October 15, 2024",
    titleBN: "প্রথম ডেট",
    titleEN: "First Date",
    descriptionBN: "আমরা কত কথা বলেছিলাম! পার্কের সেই বিকেলটি ছিল জাদুকরী।",
    descriptionEN: "We talked so much! That afternoon in the park was magical.",
    iconId: 'calendar',
    color: "from-blue-500 to-indigo-400"
  }
];

export const Moments: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [moments, setMoments] = useState<MomentData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MomentData>>({});

  useEffect(() => {
    const saved = localStorage.getItem('love_world_moments');
    if (saved) {
      try {
        setMoments(JSON.parse(saved));
      } catch (e) {
        setMoments(DEFAULT_MOMENTS);
      }
    } else {
      setMoments(DEFAULT_MOMENTS);
      localStorage.setItem('love_world_moments', JSON.stringify(DEFAULT_MOMENTS));
    }
  }, []);

  const saveMoments = (newMoments: MomentData[]) => {
    setMoments(newMoments);
    localStorage.setItem('love_world_moments', JSON.stringify(newMoments));
  };

  const handleAdd = () => {
    setFormData({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      titleBN: '',
      titleEN: '',
      descriptionBN: '',
      descriptionEN: '',
      iconId: 'heart',
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    setEditingId('new');
    setIsEditing(true);
  };

  const handleEdit = (moment: MomentData) => {
    setFormData(moment);
    setEditingId(moment.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(lang === 'bn' ? 'আপনি কি এটি মুছে ফেলতে চান?' : 'Do you want to delete this?')) {
      saveMoments(moments.filter(m => m.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.titleBN || !formData.titleEN || !formData.date) return;

    if (editingId === 'new') {
      saveMoments([...moments, formData as MomentData]);
    } else {
      saveMoments(moments.map(m => m.id === editingId ? (formData as MomentData) : m));
    }
    setIsEditing(false);
    setEditingId(null);
  };

  const t = {
    bn: {
      title: "আমাদের সোনালী সময়",
      subtitle: "স্মৃতিগুলো আমাদের হৃদয়ে চিরকাল অমলিন থাকবে ✨",
      more: "আরো মুহূর্ত আসছে...",
      add: "নতুন মুহূর্ত যোগ করুন",
      edit: "সম্পাদনা",
      delete: "মুছে ফেলুন",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল",
      date: "তারিখ",
      titleBN: "শিরোনাম (বাংলা)",
      titleEN: "Title (English)",
      descBN: "বিবরণ (বাংলা)",
      descEN: "Description (English)",
      icon: "আইকন",
      color: "রঙ"
    },
    en: {
      title: "Our Moments Time",
      subtitle: "Memories that stay in our hearts forever ✨",
      more: "MORE MOMENTS TO COME...",
      add: "Add New Moment",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      date: "Date",
      titleBN: "Title (Bengali)",
      titleEN: "Title (English)",
      descBN: "Description (Bengali)",
      descEN: "Description (English)",
      icon: "Icon",
      color: "Color"
    }
  };

  const l = t[lang];

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center mb-24 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-7xl text-white mb-6 drop-shadow-[0_0_30px_rgba(255,105,180,0.4)]"
        >
          {l.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 italic text-xl md:text-2xl mb-10"
        >
          {l.subtitle}
        </motion.p>
        
        <button 
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          {l.add}
        </button>
      </div>

      <div className="relative">
        {/* Modern Timeline Line */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />

        <div className="space-y-24">
          {moments.map((moment, i) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col md:flex-row items-center gap-12 relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Content Card */}
              <div className="flex-1 w-full">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.01 }}
                  className={`relative bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 border border-white/10 shadow-2xl overflow-hidden group ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,105,180,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className={`flex items-center gap-3 mb-6 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs font-black text-pink-400 uppercase tracking-[0.2em] bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20">
                      {moment.date}
                    </span>
                    <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(moment)} 
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title={l.edit}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(moment.id, e)} 
                        className="p-2 rounded-full bg-red-500/20 hover:bg-red-500 text-white transition-colors"
                        title={l.delete}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 group-hover:text-pink-100 transition-colors">
                    {lang === 'bn' ? moment.titleBN : moment.titleEN}
                  </h3>
                  
                  <p className="text-white/50 text-lg leading-relaxed italic font-light">
                    {lang === 'bn' ? moment.descriptionBN : moment.descriptionEN}
                  </p>
                </motion.div>
              </div>

              {/* Central Icon Junction */}
              <div className="relative z-10 shrink-0">
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${moment.color} flex items-center justify-center text-white border-4 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative`}
                >
                  <div className="absolute inset-0 rounded-full animate-ping bg-white/10 opacity-20" />
                  {ICON_MAP[moment.iconId] || <Heart size={24} />}
                </motion.div>
                
                {/* Connecting Line for Mobile */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-24 bg-white/5 md:hidden" />
              </div>

              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditing(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-neutral-900 border border-white/10 rounded-[40px] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif text-white">
                  {editingId === 'new' ? l.add : l.edit}
                </h3>
                <button onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-white/50 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.date}</label>
                  <input 
                    type="text"
                    value={formData.date || ''}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    placeholder="e.g. September 1, 2024"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.titleBN}</label>
                    <input 
                      type="text"
                      value={formData.titleBN || ''}
                      onChange={e => setFormData({...formData, titleBN: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.titleEN}</label>
                    <input 
                      type="text"
                      value={formData.titleEN || ''}
                      onChange={e => setFormData({...formData, titleEN: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.descBN}</label>
                  <textarea 
                    value={formData.descriptionBN || ''}
                    onChange={e => setFormData({...formData, descriptionBN: e.target.value})}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.descEN}</label>
                  <textarea 
                    value={formData.descriptionEN || ''}
                    onChange={e => setFormData({...formData, descriptionEN: e.target.value})}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.icon}</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(ICON_MAP).map(key => (
                      <button
                        key={key}
                        onClick={() => setFormData({...formData, iconId: key})}
                        className={`p-4 rounded-2xl border transition-all ${formData.iconId === key ? 'bg-pink-500 border-pink-400 text-white scale-110 shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/20'}`}
                      >
                        {ICON_MAP[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{l.color}</label>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData({...formData, color})}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} border-4 transition-all ${formData.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    onClick={handleSave}
                    className="flex-[2] bg-pink-500 hover:bg-pink-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-lg active:scale-95"
                  >
                    <Save size={20} />
                    {l.save}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all border border-white/10 active:scale-95"
                  >
                    {l.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-40 text-center relative z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-6xl mb-8 filter drop-shadow-[0_0_20px_rgba(255,105,180,0.6)]"
        >
          ❤️
        </motion.div>
        <p className="text-white/20 text-sm font-black tracking-[0.5em] uppercase">
          {l.more}
        </p>
      </div>
    </div>
  );
};
