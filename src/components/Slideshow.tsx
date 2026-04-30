import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'My Heart Beats For You',
    bg: 'linear-gradient(135deg, #ff6b9d, #c44569)',
    content: (
      <div className="relative w-32 h-32 bg-white rotate-[-45deg] animate-[heartBeat_1.5s_ease-in-out_infinite] shadow-[0_0_40px_rgba(255,255,255,0.5)] before:content-[''] before:absolute before:w-32 before:h-32 before:rounded-full before:bg-white before:top-[-64px] before:left-0 after:content-[''] after:absolute after:w-32 after:h-32 after:rounded-full after:bg-white after:top-0 after:left-[64px]" />
    ),
  },
  {
    id: 2,
    title: 'My Beautiful Rose',
    bg: 'linear-gradient(135deg, #1a0a2e, #4a1942)',
    content: (
      <div className="relative w-20 h-20 bg-gradient-to-br from-[#ff1744] to-[#c2185b] rounded-full shadow-[0_0_50px_rgba(255,23,68,0.6)] animate-[roseSpin_6s_linear_infinite]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-15 h-15 rounded-full bg-gradient-to-br from-[#e91e63] to-[#ad1457] opacity-80"
            style={{ transform: `rotate(${i * 45}deg) translateX(45px)` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 3,
    title: "You're My Brightest Star",
    bg: 'linear-gradient(180deg, #0d0221, #240b36)',
    content: (
      <div className="relative flex items-center justify-center text-6xl">
        <span>✨</span>
        <div className="absolute top-[20%] left-[15%] text-2xl animate-pulse">⭐</div>
        <div className="absolute top-[30%] right-[20%] text-3xl animate-pulse delay-75">⭐</div>
        <div className="absolute bottom-[25%] left-[25%] text-2xl animate-pulse delay-150">⭐</div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'My Moonlight',
    bg: 'linear-gradient(180deg, #0f0c29, #302b63)',
    content: (
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fff9c4] to-[#ffecb3] shadow-[0_0_60px_rgba(255,236,179,0.8)] animate-[moonPulse_3s_ease-in-out_infinite_alternate]" />
    ),
  },
  {
    id: 5,
    title: 'Every Sunset With You',
    bg: 'linear-gradient(180deg, #ff512f, #dd2476, #8e2de2)',
    content: <div className="text-8xl">🌅</div>,
  },
  {
    id: 6,
    title: 'Together Forever',
    bg: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    content: <div className="text-8xl">💑</div>,
  },
  {
    id: 7,
    title: 'Butterflies For You',
    bg: 'linear-gradient(135deg, #667eea, #764ba2)',
    content: (
      <div className="flex items-center gap-1.5">
        <div className="w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#ff6b9d] to-[#c44569] animate-wing-flap" />
        <div className="w-3 h-3 bg-gradient-to-br from-[#ff6b9d] to-[#c44569] rounded-full" />
        <div className="w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#ff6b9d] to-[#c44569] animate-wing-flap delay-75 scale-x-[-1]" />
      </div>
    ),
  },
  {
    id: 8,
    title: 'My Morning Coffee',
    bg: 'linear-gradient(135deg, #6f4e37, #a0522d)',
    content: (
      <div className="relative w-20 h-15 bg-gradient-to-b from-white to-[#f5f5f5] rounded-b-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] before:content-[''] before:absolute before:right-[-20px] before:top-[10px] before:w-[25px] before:h-[30px] before:border-[5px] before:border-white before:rounded-r-[20px] before:border-l-0">
        <div className="absolute top-[-20px] left-[20px] w-2 h-5 bg-white/40 rounded-full animate-steam-rise" />
        <div className="absolute top-[-20px] left-[35px] w-2 h-5 bg-white/40 rounded-full animate-steam-rise delay-500" />
        <div className="absolute top-[-20px] left-[50px] w-2 h-5 bg-white/40 rounded-full animate-steam-rise delay-1000" />
      </div>
    ),
  },
];

export const Slideshow: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full max-w-lg mx-auto mb-9 relative rounded-[25px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(255,105,180,0.3)] border-2 border-white/20">
      <div className="h-80 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: slides[index].bg }}
          >
            {slides[index].content}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-7 text-center">
              <h4 className="font-serif text-2xl text-[#ffb3d1] drop-shadow-[0_0_10px_rgba(255,179,209,0.5)]">
                {slides[index].title}
              </h4>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute top-1/2 left-2.5 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-pink-500/40 transition-all z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2.5 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-pink-500/40 transition-all z-10"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 border border-white/30 ${
              i === index ? 'bg-[#ff6b9d] shadow-[0_0_10px_rgba(255,107,157,0.8)] scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
