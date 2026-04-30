import React from 'react';
import { Home, Mail, Image, FileText, Timer, Users, HelpCircle, Sparkles, MessageSquare, Clock } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
}

const labels = {
  bn: {
    home: 'হোম',
    messages: 'মেসেজ',
    chat: 'লাইভ চ্যাট',
    gallery: 'গ্যালারি',
    letter: 'চিঠি',
    countdown: 'কাউন্টডাউন',
    family: 'ফ্যামিলি',
    designer: 'ডিজাইনার',
    'public-info': 'ফরম',
    quiz: 'কুইজ',
  },
  en: {
    home: 'Home',
    messages: 'Messages',
    chat: 'Live Chat',
    gallery: 'Gallery',
    letter: 'Letter',
    countdown: 'Countdown',
    family: 'Family',
    designer: 'Designer',
    'public-info': 'Form',
    quiz: 'Quiz',
  }
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang }) => {
  const l = labels[lang];
  const links = [
    { id: 'home', label: l.home, icon: <Home size={16} /> },
    { id: 'messages', label: l.messages, icon: <Mail size={16} /> },
    { id: 'chat', label: l.chat, icon: <MessageSquare size={16} /> },
    { id: 'gallery', label: l.gallery, icon: <Image size={16} /> },
    { id: 'letter', label: l.letter, icon: <FileText size={16} /> },
    { id: 'countdown', label: l.countdown, icon: <Timer size={16} /> },
    { id: 'moments', label: lang === 'bn' ? 'মুহূর্ত' : 'Moments', icon: <Clock size={16} /> },
    { id: 'designer', label: l.designer, icon: <Sparkles size={16} /> },
    { id: 'family', label: l.family, icon: <Users size={16} /> },
    { id: 'public-info', label: l['public-info'], icon: <FileText size={16} /> },
    { id: 'quiz', label: l.quiz, icon: <HelpCircle size={16} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[200] bg-black/25 backdrop-blur-md border-b border-white/10 px-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <button
          onClick={() => setActiveTab('home')}
          className="font-serif text-2xl text-white drop-shadow-[0_0_15px_rgba(255,105,180,0.8)] bg-transparent border-none cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
        >
          💕 Love World
        </button>
        <div className="hidden lg:flex gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs xl:text-sm font-sans transition-all duration-300 border-none cursor-pointer ${
                activeTab === link.id
                  ? 'bg-pink-500/40 text-white font-semibold shadow-lg shadow-pink-500/20'
                  : 'bg-transparent text-white/70 hover:bg-white/15 hover:text-white'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
        
        {/* Mobile quick icons */}
        <div className="flex lg:hidden gap-1">
          {links.slice(0, 5).map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`p-2.5 rounded-full transition-all border-none ${
                activeTab === link.id ? 'bg-pink-500/40 text-white' : 'text-white/60 hover:bg-white/10'
              }`}
            >
              {link.icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
