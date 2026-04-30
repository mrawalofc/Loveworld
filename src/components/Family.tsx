import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, RotateCcw, Save, Users, Calendar, Clock, Star } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthday: string;
  createdAt: number;
}

const STORAGE_KEY = 'loveCountdown_familyMembers';

const relations = [
  'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter',
  'Husband', 'Wife', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Other'
];

const texts = {
  bn: {
    title: "পরিবারের জন্মদিন",
    subtitle: "প্রতিটি প্রিয় পরিবারের সদস্যের ট্র্যাক রাখুন 🎂👨‍👩‍👧‍👦",
    formTitle: "✨ পরিবারের সদস্য যোগ করুন",
    lblName: "নাম", lblRelation: "সম্পর্ক", lblBirthday: "জন্মদিন",
    btnAdd: "➕ যোগ করুন", btnClear: "মুছুন", btnUpdate: "💾 আপডেট",
    statsTitle: "পরিবারের সারাংশ",
    totalMembers: "মোট সদস্য", upcoming: "আসন্ন জন্মদিন", thisMonth: "এই মাসে",
    age: "বয়স", days: "দিন", hours: "ঘন্টা", minutes: "মিনিট", seconds: "সেকেন্ড",
    min: "মি.", sec: "সে.", empty: "কোনো সদস্য যোগ করা হয়নি। উপরের ফর্ম ব্যবহার করে পরিবারের সদস্য যোগ করুন!",
    saved: "সংরক্ষিত!",
    formInfo: "👫 সদস্যদের তথ্য দিন",
    nextBday: "পরবর্তী জন্মদিন",
    daysLeft: "দিন বাকি",
    happyBday: "শুভ জন্মদিন!",
    isToday: "আজ জন্মদিন!",
    relationMap: {
      Father: "বাবা", Mother: "মা", Brother: "ভাই", Sister: "বোন",
      Son: "ছেলে", Daughter: "মেয়ে", Husband: "স্বামী", Wife: "স্ত্রী",
      Grandfather: "দাদা/নানা", Grandmother: "দাদী/নানী",
      Uncle: "চাচা/মামা", Aunt: "চাচী/মামী", Cousin: "কাজিন", Other: "অন্যান্য"
    }
  },
  en: {
    title: "Family Birthdays",
    subtitle: "Keep track of every precious family member 🎂👨‍👩‍👧‍👦",
    formTitle: "✨ Add Family Member",
    lblName: "Name", lblRelation: "Relationship", lblBirthday: "Birthday",
    btnAdd: "➕ Add Member", btnClear: "Clear", btnUpdate: "💾 Update",
    statsTitle: "Family Overview",
    totalMembers: "Total Members", upcoming: "Upcoming Birthdays", thisMonth: "This Month",
    age: "Age", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    min: "Min", sec: "Sec", empty: "No members added yet. Use the form above to add family members!",
    saved: "Saved!",
    formInfo: "👫 Add Members Information",
    nextBday: "Next Birthday",
    daysLeft: "days left",
    happyBday: "Happy Birthday!",
    isToday: "Birthday Today!",
    relationMap: {
      Father: "Father", Mother: "Mother", Brother: "Brother", Sister: "Sister",
      Son: "Son", Daughter: "Daughter", Husband: "Husband", Wife: "Wife",
      Grandfather: "Grandfather", Grandmother: "Grandmother",
      Uncle: "Uncle", Aunt: "Aunt", Cousin: "Cousin", Other: "Other"
    }
  }
};

const getRelationIcon = (relation: string) => {
  const icons: Record<string, string> = {
    Father: '👨', Mother: '👩', Brother: '👦', Sister: '👧',
    Son: '👶', Daughter: '👧', Husband: '🤵', Wife: '👰',
    Grandfather: '👴', Grandmother: '👵', Uncle: '👨', Aunt: '👩',
    Cousin: '🧑', Other: '👤'
  };
  return icons[relation] || '👤';
};

export const Family: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formData, setFormData] = useState({ name: '', relation: 'Father', birthday: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, thisMonth: 0 });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    updateStats();
  }, [members]);

  const updateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    
    let upcoming = 0;
    let thisMonth = 0;

    members.forEach(m => {
      const bday = new Date(m.birthday);
      if (bday.getMonth() === currentMonth) thisMonth++;

      let next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
      if (next < today) next = new Date(today.getFullYear() + 1, bday.getMonth(), bday.getDate());
      
      const daysLeft = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) upcoming++;
    });

    setStats({ total: members.length, upcoming, thisMonth });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthday) return;

    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? { ...m, ...formData } : m));
      setEditingId(null);
    } else {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        ...formData,
        createdAt: Date.now()
      };
      setMembers([...members, newMember]);
    }
    setFormData({ name: '', relation: 'Father', birthday: '' });
  };

  const deleteMember = (id: string) => {
    if (window.confirm('Are you sure?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const editMember = (m: FamilyMember) => {
    setFormData({ name: m.name, relation: m.relation, birthday: m.birthday });
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAge = (bdayStr: string) => {
    const today = new Date();
    const bday = new Date(bdayStr);
    let age = today.getFullYear() - bday.getFullYear();
    const hasHad = today.getMonth() > bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate() >= bday.getDate());
    if (!hasHad) age--;
    return age;
  };

  const getNextBdayStatus = (bdayStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bdayDate = new Date(bdayStr);
    
    const isToday = today.getMonth() === bdayDate.getMonth() && today.getDate() === bdayDate.getDate();
    
    let next = new Date(today.getFullYear(), bdayDate.getMonth(), bdayDate.getDate());
    if (next < today) next = new Date(today.getFullYear() + 1, bdayDate.getMonth(), bdayDate.getDate());
    
    return { next, isToday };
  };

  const getCountdown = (target: Date) => {
    const diff = target.getTime() - now.getTime();
    if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, finished: false };
  };

  const t = texts[lang];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-5 relative z-10">
      <div className="text-center mb-16 space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-6xl md:text-7xl text-white drop-shadow-[0_0_25px_rgba(255,105,180,0.6)]"
        >
          {t.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 italic text-xl"
        >
          {t.subtitle}
        </motion.p>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/20 shadow-2xl mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-pink-500/10 pointer-events-none">
          <Star size={120} strokeWidth={1} />
        </div>

        <h3 className="font-serif text-3xl text-pink-300 mb-8 text-center flex items-center justify-center gap-3">
          {t.formTitle}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> {t.lblName}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium"
              placeholder="Full Name"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Star size={14} /> {t.lblRelation}
            </label>
            <div className="relative">
              <select
                value={formData.relation}
                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none cursor-pointer"
              >
                {relations.map(r => (
                  <option key={r} value={r} className="bg-gray-900 text-white">
                    {(t.relationMap as any)[r] || r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> {t.lblBirthday}
            </label>
            <input
              type="date"
              value={formData.birthday}
              onChange={e => setFormData({ ...formData, birthday: e.target.value })}
              className="bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all cursor-pointer"
            />
          </div>

          <div className="md:col-span-3 flex justify-center gap-6 mt-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all flex items-center gap-3"
            >
              {editingId ? <Save size={20} /> : <Plus size={20} />}
              {editingId ? t.btnUpdate : t.btnAdd}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={() => { setFormData({ name: '', relation: 'Father', birthday: '' }); setEditingId(null); }}
              className="bg-white/5 text-white border border-white/10 px-12 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <RotateCcw size={20} /> {t.btnClear}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Stats Dashboard */}
      <div className="bg-white/5 backdrop-blur-xl rounded-[35px] p-10 border border-white/10 shadow-2xl mb-16 relative overflow-hidden group">
        <h3 className="font-serif text-3xl text-pink-200 mb-8 text-center">{t.statsTitle}</h3>
        <div className="flex flex-wrap justify-around gap-12 text-center relative z-10">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">{stats.total}</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-3">{t.totalMembers}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-6xl font-black text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">{stats.upcoming}</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-3">{t.upcoming}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-6xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{stats.thisMonth}</div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-3">{t.thisMonth}</div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {members.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="col-span-full text-center py-32 text-white italic text-2xl"
            >
              {t.empty}
            </motion.div>
          ) : (
            members.slice().reverse().map((m, i) => {
              const { next: nextBday, isToday } = getNextBdayStatus(m.birthday);
              const cd = getCountdown(nextBday);
              const age = getAge(m.birthday);
              const nextBdayStr = nextBday.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              
              return (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                  className={`bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 text-center relative group hover:bg-white/10 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 ${isToday ? 'ring-4 ring-pink-500/50' : ''}`}
                >
                  {isToday && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-4 py-1 rounded-full shadow-lg"
                    >
                      {t.isToday}
                    </motion.div>
                  )}

                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500 block">
                    {getRelationIcon(m.relation)}
                  </div>
                  
                  <div className="font-serif text-3xl text-pink-200 mb-2">{m.name}</div>
                  <div className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
                    {(t.relationMap as any)[m.relation] || m.relation}
                  </div>

                  <div className="bg-white/5 rounded-3xl p-4 mb-6 border border-white/5">
                    <div className="text-xs text-white/40 uppercase font-black mb-1">{t.nextBday}</div>
                    <div className="text-pink-400 font-bold">{isToday ? t.happyBday : nextBdayStr}</div>
                  </div>

                  <div className="text-4xl font-black text-yellow-400 mb-8 drop-shadow-md">
                    {t.age}: {age}
                  </div>

                  <div className={`bg-gradient-to-br transition-all duration-500 ${isToday ? 'from-yellow-400/20 to-pink-500/20' : 'from-pink-500/20 to-purple-500/20'} rounded-[30px] p-4 border border-white/10 mb-8 flex justify-center items-center gap-2`}>
                    <span className="text-2xl font-black text-white">
                      {isToday ? '0' : cd.days}
                    </span>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t.daysLeft}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-8">
                    {[
                      { val: isToday ? 0 : cd.days, label: t.days },
                      { val: isToday ? 0 : cd.hours, label: t.hours },
                      { val: isToday ? 0 : cd.minutes, label: t.min },
                      { val: isToday ? 0 : cd.seconds, label: t.sec }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-black/20 rounded-2xl p-3 border border-white/5">
                        <motion.div 
                          key={`${m.id}-${idx}-${item.val}`}
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-xl font-black text-white"
                        >
                          {String(item.val).padStart(2, '0')}
                        </motion.div>
                        <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => editMember(m)}
                      className="bg-emerald-500/80 text-white p-3.5 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteMember(m.id)}
                      className="bg-rose-500/80 text-white p-3.5 rounded-2xl hover:bg-rose-500 transition-all shadow-xl shadow-rose-500/20"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
