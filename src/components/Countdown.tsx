import React, { useState, useEffect } from 'react';

const DATES = {
  mim: { month: 5, day: 15, year: 2010 }, // June 15
  awal: { month: 8, day: 6, year: 2000 }, // September 6
  anniversary: { month: 7, day: 1, year: 2025 }, // August 1
};

const texts = {
  bn: {
    nextAnni: "পরবর্তী বার্ষিকী",
    together: "একসাথে কাটানো সময়",
    days: "দিন", hours: "ঘন্টা", minutes: "মিনিট", seconds: "সেকেন্ড",
    mimName: "মিমের জন্মদিন", awalName: "আওয়ালের জন্মদিন",
    age: "বয়স",
    quote: '"ভালোবাসা মানে একে অপরের দিকে তাকানো নয়, ভালোবাসা মানে একসাথে একই দিকে তাকানো।"',
    author: "— আন্তোয়ান দে সেন্ত-এক্সুপেরি"
  },
  en: {
    nextAnni: "Next Anniversary",
    together: "Time Together",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    mimName: "Mim's Birthday", awalName: "Awal's Birthday",
    age: "Age",
    quote: '"Love does not consist in gazing at each other, but in looking outward together in the same direction."',
    author: "— Antoine de Saint-Exupéry"
  }
};

export const Countdown: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: any }>({
    mim: {}, awal: {}, anni: {}, together: {}
  });

  const getNextOccurrence = (month: number, day: number) => {
    const now = new Date();
    let next = new Date(now.getFullYear(), month, day);
    if (next < now) next = new Date(now.getFullYear() + 1, month, day);
    return next;
  };

  const getAge = (year: number, month: number, day: number) => {
    const now = new Date();
    let age = now.getFullYear() - year;
    const hasHad = now.getMonth() > month || (now.getMonth() === month && now.getDate() >= day);
    if (!hasHad) age--;
    return age;
  };

  const calculateDiff = (target: Date) => {
    const diff = target.getTime() - new Date().getTime();
    if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };

  const calculatePast = (start: Date) => {
    const diff = new Date().getTime() - start.getTime();
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft({
        mim: calculateDiff(getNextOccurrence(DATES.mim.month, DATES.mim.day)),
        awal: calculateDiff(getNextOccurrence(DATES.awal.month, DATES.awal.day)),
        anni: calculateDiff(getNextOccurrence(DATES.anniversary.month, DATES.anniversary.day)),
        together: calculatePast(new Date(2025, 8, 1)), // Sep 1, 2025
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = texts[lang];

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <div className="text-center mb-10">
        <h2 className="font-serif text-5xl text-white mb-4 drop-shadow-[0_0_20px_rgba(255,105,180,0.6)]">
          Our Special Dates
        </h2>
        <p className="text-white/70 italic text-lg">Every moment with you is precious ⏳💕</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { name: t.mimName, icon: '🎂', date: 'June 15, 2010', age: getAge(DATES.mim.year, DATES.mim.month, DATES.mim.day), cd: timeLeft.mim },
          { name: t.awalName, icon: '🎉', date: 'September 6, 2000', age: getAge(DATES.awal.year, DATES.awal.month, DATES.awal.day), cd: timeLeft.awal },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15 shadow-xl text-center">
            <div className="text-5xl mb-3 animate-bounce">{item.icon}</div>
            <div className="font-serif text-3xl text-[#ffb3d1] mb-1.5">{item.name}</div>
            <div className="text-sm text-white/60 mb-4">{item.date}</div>
            <div className="text-2xl font-bold text-yellow-400 mb-6 drop-shadow-md">{t.age}: {item.age}</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: t.days, val: item.cd.days },
                { label: t.hours, val: item.cd.hours },
                { label: t.minutes.slice(0, 3), val: item.cd.minutes },
                { label: t.seconds.slice(0, 3), val: item.cd.seconds },
              ].map((part, j) => (
                <div key={j} className="bg-gradient-to-br from-pink-500/30 to-pink-700/30 rounded-xl py-3 border border-white/20">
                  <div className="text-2xl font-bold text-white shadow-pink-500/50">{String(part.val || 0).padStart(2, '0')}</div>
                  <div className="text-[10px] text-white/70 mt-1 uppercase tracking-wider">{part.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/15 shadow-xl text-center mb-8">
        <div className="font-serif text-3xl text-[#ffb3d1] mb-2">{t.nextAnni}</div>
        <div className="text-sm text-white/60 mb-6 italic">Coming soon...</div>
        <div className="flex justify-center flex-wrap gap-4 max-w-lg mx-auto">
          {[
            { label: t.days, val: timeLeft.anni.days },
            { label: t.hours, val: timeLeft.anni.hours },
            { label: t.minutes, val: timeLeft.anni.minutes },
            { label: t.seconds, val: timeLeft.anni.seconds },
          ].map((part, i) => (
            <div key={i} className="bg-gradient-to-br from-pink-500/30 to-rose-600/30 rounded-2xl p-5 border border-white/20 min-w-[100px] flex-1">
              <div className="text-4xl font-bold text-white drop-shadow-lg">{String(part.val || 0).padStart(2, '0')}</div>
              <div className="text-xs text-white/70 mt-2 uppercase font-medium">{part.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/15 shadow-xl text-center">
        <h3 className="font-serif text-3xl text-[#ffb3d1] mb-6">{t.together}</h3>
        <div className="flex justify-center flex-wrap gap-4 max-w-lg mx-auto mb-10">
          {[
            { label: t.days, val: timeLeft.together.days },
            { label: t.hours, val: timeLeft.together.hours },
            { label: t.minutes, val: timeLeft.together.minutes },
            { label: t.seconds, val: timeLeft.together.seconds },
          ].map((part, i) => (
            <div key={i} className="bg-gradient-to-br from-yellow-500/30 to-purple-600/30 rounded-2xl p-5 border border-white/20 min-w-[100px] flex-1">
              <div className="text-4xl font-bold text-white drop-shadow-lg">{part.val || 0}</div>
              <div className="text-xs text-white/70 mt-2 uppercase font-medium">{part.label}</div>
            </div>
          ))}
        </div>
        <div className="max-w-xl mx-auto italic text-white/80 text-xl leading-relaxed">
          {t.quote}
          <span className="block mt-4 text-[#ffb3d1] font-serif text-2xl font-normal">{t.author}</span>
        </div>
      </div>
    </div>
  );
};
