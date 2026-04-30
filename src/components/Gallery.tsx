import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon, Trash2, FolderPlus, Camera, ChevronLeft, ChevronRight, Upload, Grid, Layout, Edit2, Check, X } from 'lucide-react';
import Masonry from 'react-masonry-css';

interface GalleryItem {
  type: string;
  title: string;
  text: string;
  emoji: string;
}

interface AlbumPhoto {
  url: string;
  caption?: string;
}

interface UserAlbum {
  id: string;
  name: string;
  description: string;
  photos: AlbumPhoto[];
  createdAt: string;
}

const galleryData: Record<'bn' | 'en', GalleryItem[]> = {
  bn: [
    { type: "heart", title: "অনন্ত ভালোবাসা", text: "তোমার হৃদয়ে যে জায়গা পেয়েছি, সেটাই আমার সবচেয়ে বড় সম্পদ। চিরকাল তোমার হয়ে থাকতে চাই। তুমি আমার ভালোবাসার শেষ ঠিকানা। 💕", emoji: "💗" },
    { type: "rose", title: "গোলাপের মতো তুমি", text: "গোলাপ ফোটার আগে কাঁটা সহ্য করে। তোমার মতো সুন্দর হতে হলে কিছু কষ্ট সহ্য করতেই হয়। তুমি আমার গোলাপ, তুমি আমার প্রিয়তম। 🌹", emoji: "🌹" },
    { type: "stars", title: "তারার নিচে তুমি", text: "রাতের আকাশের হাজার তারার মধ্যে তুমি আমার সবচেয়ে উজ্জ্বল তারা। তোমার আলোয় আমার জীবন রঙিন হয়ে ওঠে। ✨", emoji: "⭐" },
    { type: "couple", title: "দুজন একসাথে", text: "তোমার হাত ধরলে পৃথিবীর সব সমস্যা ছোট হয়ে যায়। তুমি আমার শক্তি, তুমি আমার ভরসা, তুমি আমার সবকিছু। 🤝💕", emoji: "💑" },
    { type: "moon", title: "চাঁদের কথা", text: "চাঁদ রাতে উঠে তোমাকে দেখতে। কারণ চাঁদও জানে এই পৃথিবীর সবচেয়ে সুন্দর তুমি। তুমি আমার চাঁদ। 🌙", emoji: "🌙" },
    { type: "sunset", title: "সূর্যাস্তের প্রতিজ্ঞা", text: "প্রতি সূর্যাস্তে প্রতিজ্ঞা করি — কাল সকালেও তোমাকে আরও বেশি ভালোবাসবো। এটাই আমার প্রতিদিনের প্রতিজ্ঞা। 🌅", emoji: "🌇" },
    { type: "ocean", title: "সমুদ্রের গভীরতা", text: "সমুদ্রের গভীরতা যতই হোক, আমার ভালোবাসা তার চেয়েও গভীর। তুমি ছাড়া আমার জীবন শূন্য। 🌊", emoji: "🌊" },
    { type: "rain", title: "বৃষ্টির দিনে তুমি", text: "বৃষ্টির শব্দ শুনলে তোমার কথা মনে পড়ে। তোমার সাথে বৃষ্টিতে ভিজতে চাই। তুমি আমার বৃষ্টির দিনের সঙ্গী। 🌧️", emoji: "🌧️" },
    { type: "coffee", title: "সকালের প্রথম চা", text: "তুমি আমার সকালের প্রথম চা — গরম, মিষ্টি, আর আমার দিন শুরুর সেরা অংশ। তুমি ছাড়া সকাল শুরু হয় না। ☕", emoji: "☕" },
    { type: "butterfly", title: "প্রজাপতির মতো তুমি", text: "তোমার কথা ভাবলেই পেটের মধ্যে প্রজাপতি উড়তে শুরু করে। এটাই কি ভালোবাসা? হ্যাঁ, এটাই ভালোবাসা! 🦋", emoji: "🦋" },
    { type: "book", title: "আমার প্রিয় গল্প", text: "আমাদের ভালোবাসার গল্প হাজার বইয়ের চেয়েও সুন্দর। প্রতিটা পাতায় লেখা আছে তোমার নাম। 📖💕", emoji: "📖" },
    { type: "music", title: "তোমার সুরে", text: "তোমার হাসি আমার প্রিয় সঙ্গীত। তোমার কণ্ঠ আমার প্রিয় গান। তুমি আমার সবকিছু। 🎵", emoji: "🎵" },
    { type: "phone", title: "তোমার কলের অপেক্ষায়", text: "তোমার কলের অপেক্ষায় প্রতিটা সেকেন্ড যেন এক যুগ। তোমার কণ্ঠ শুনলে পৃথিবী থেমে যায়। 📱💕", emoji: "📱" },
    { type: "ring", title: "চিরকালের প্রতিজ্ঞা", text: "এই আংটি তোমাকে দেওয়ার স্বপ্ন দেখি। চিরকাল তোমার হাত ধরে হাঁটতে চাই। তুমি আমার চিরকাল। 💍", emoji: "💍" },
    { type: "hug", title: "তোমার আলিঙ্গন", text: "তোমার আলিঙ্গনে পৃথিবীর সব কষ্ট মুছে যায়। তোমার বুকে মাথা রাখলে শান্তি পাই। তুমি আমার আশ্রয়। 🤗", emoji: "🤗" }
  ],
  en: [
    { type: "heart", title: "Infinite Love", text: "The place I have found in your heart is my greatest treasure. I want to be yours forever. You are my love's final destination. 💕", emoji: "💗" },
    { type: "rose", title: "Rose Like You", text: "A rose endures thorns before it blooms. To be as beautiful as you, one must endure some pain. You are my rose, you are my dearest. 🌹", emoji: "🌹" },
    { type: "stars", title: "You Under the Stars", text: "Among thousands of stars in the night sky, you are my brightest star. Your light colors my life. ✨", emoji: "⭐" },
    { type: "couple", title: "Together Forever", text: "When I hold your hand, all the world's problems become small. You are my strength, you are my trust, you are my everything. 🤝💕", emoji: "💑" },
    { type: "moon", title: "Moon's Tale", text: "The moon rises at night to see you. Because even the moon knows you are the most beautiful in this world. You are my moon. 🌙", emoji: "🌙" },
    { type: "sunset", title: "Sunset Promise", text: "With every sunset, I promise — tomorrow morning I will love you even more. This is my daily promise. 🌅", emoji: "🌇" },
    { type: "ocean", title: "Depth of the Ocean", text: "No matter how deep the ocean is, my love is deeper than that. Without you, my life is empty. 🌊", emoji: "🌊" },
    { type: "rain", title: "You in the Rain", text: "The sound of rain reminds me of you. I want to get wet in the rain with you. You are my rainy day companion. 🌧️", emoji: "🌧️" },
    { type: "coffee", title: "Morning Tea", text: "You are my first morning tea — warm, sweet, and the best part of starting my day. Without you, morning doesn't begin. ☕", emoji: "☕" },
    { type: "butterfly", title: "Butterfly Like You", text: "Butterflies start flying in my stomach when I think of you. Is this what love is? Yes, this is love! 🦋", emoji: "🦋" },
    { type: "book", title: "My Favorite Story", text: "Our love story is more beautiful than a thousand books. Every page is written with your name. 📖💕", emoji: "📖" },
    { type: "music", title: "In Your Tune", text: "Your smile is my favorite music. Your voice is my favorite song. You are my everything. 🎵", emoji: "🎵" },
    { type: "phone", title: "Waiting for Your Call", text: "Every second waiting for your call feels like an eternity. When I hear your voice, the world stops. 📱💕", emoji: "📱" },
    { type: "ring", title: "Promise of Forever", text: "I dream of giving you this ring. I want to walk holding your hand forever. You are my forever. 💍", emoji: "💍" },
    { type: "hug", title: "Your Embrace", text: "In your embrace, all the pain of the world disappears. When I rest my head on your chest, I find peace. You are my shelter. 🤗", emoji: "🤗" }
  ]
};

export const Gallery: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'art' | 'albums'>('art');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [albums, setAlbums] = useState<UserAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<UserAlbum | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [editingCaption, setEditingCaption] = useState('');
  const [quickEditingIndex, setQuickEditingIndex] = useState<number | null>(null);
  const [quickEditingCaption, setQuickEditingCaption] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('love_world_albums');
    if (saved) {
      try {
        setAlbums(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load albums", e);
      }
    }
  }, []);

  const saveAlbums = (updatedAlbums: UserAlbum[]) => {
    setAlbums(updatedAlbums);
    localStorage.setItem('love_world_albums', JSON.stringify(updatedAlbums));
  };

  const createAlbum = () => {
    if (!newAlbumName.trim()) return;
    const newAlbum: UserAlbum = {
      id: Date.now().toString(),
      name: newAlbumName,
      description: '',
      photos: [],
      createdAt: new Date().toISOString()
    };
    saveAlbums([...albums, newAlbum]);
    setNewAlbumName('');
    setIsCreatingAlbum(false);
  };

  const deleteAlbum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(lang === 'bn' ? "আপনি কি নিশ্চিত যে আপনি এই অ্যালবামটি মুছে ফেলতে চান?" : "Are you sure you want to delete this album?")) {
      saveAlbums(albums.filter(a => a.id !== id));
      if (selectedAlbum?.id === id) setSelectedAlbum(null);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAlbum) return;
    const files = Array.from(event.target.files || []) as File[];
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(base64Photos => {
        const newPhotos: AlbumPhoto[] = base64Photos.map(url => ({ url, caption: '' }));
        const updatedAlbums = albums.map(a => {
          if (a.id === selectedAlbum.id) {
            const updated = { ...a, photos: [...a.photos, ...newPhotos] };
            setSelectedAlbum(updated);
            return updated;
          }
          return a;
        });
        saveAlbums(updatedAlbums);
      });
    }
  };

  const deletePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedAlbum) return;
    const updatedPhotos = [...selectedAlbum.photos];
    updatedPhotos.splice(index, 1);
    const updatedAlbum = { ...selectedAlbum, photos: updatedPhotos };
    setSelectedAlbum(updatedAlbum);
    saveAlbums(albums.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
    if (selectedPhotoIndex === index) setSelectedPhotoIndex(null);
  };

  const saveCaption = () => {
    if (!selectedAlbum || selectedPhotoIndex === null) return;
    const updatedPhotos = [...selectedAlbum.photos];
    updatedPhotos[selectedPhotoIndex] = { ...updatedPhotos[selectedPhotoIndex], caption: editingCaption };
    const updatedAlbum = { ...selectedAlbum, photos: updatedPhotos };
    setSelectedAlbum(updatedAlbum);
    saveAlbums(albums.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
  };

  const saveQuickCaption = (index: number) => {
    if (!selectedAlbum) return;
    const updatedPhotos = [...selectedAlbum.photos];
    updatedPhotos[index] = { ...updatedPhotos[index], caption: quickEditingCaption };
    const updatedAlbum = { ...selectedAlbum, photos: updatedPhotos };
    setSelectedAlbum(updatedAlbum);
    saveAlbums(albums.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
    setQuickEditingIndex(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedAlbum || selectedPhotoIndex === null) return;
    
    // Auto-save caption if changed? For now just navigate.
    // Actually, it's better to let user manually save or save on navigation.
    // Let's at least clear/update the input.
    
    let newIndex = selectedPhotoIndex;
    if (direction === 'next') {
      newIndex = (selectedPhotoIndex + 1) % selectedAlbum.photos.length;
    } else {
      newIndex = (selectedPhotoIndex - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length;
    }
    
    setSelectedPhotoIndex(newIndex);
    setEditingCaption(selectedAlbum.photos[newIndex].caption || '');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') navigatePhoto('next');
      if (e.key === 'ArrowLeft') navigatePhoto('prev');
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, selectedAlbum]);

  const getArtContent = (type: string) => {
    switch(type) {
      case 'heart':
        return <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rotate-[-45deg] relative animate-pulse shadow-lg before:content-[''] before:absolute before:w-24 before:h-24 before:rounded-full before:bg-pink-400 before:top-[-48px] before:left-0 after:content-[''] after:absolute after:w-24 after:h-24 after:rounded-full after:bg-pink-500 after:top-0 after:left-[48px]" />;
      case 'rose':
        return (
          <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg animate-[roseSpin_8s_linear_infinite]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[#e91e63] to-[#ad1457] opacity-80"
                style={{ transform: `rotate(${i * 45}deg) translateX(35px)` }}
              />
            ))}
          </div>
        );
      case 'stars':
        return (
          <div className="grid grid-cols-4 gap-4 w-full h-full p-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1 bg-white rounded-full animate-pulse" 
                style={{ animationDelay: `${Math.random() * 2}s` }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-5xl">✨</div>
          </div>
        );
      case 'couple': return <div className="text-8xl">💑</div>;
      case 'moon': return <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fff9c4] to-[#ffecb3] shadow-2xl animate-pulse" />;
      case 'sunset': return <div className="text-7xl">🌅</div>;
      case 'ocean': return <div className="text-8xl flex flex-col items-center"><span>🌊</span><div className="w-32 h-1 bg-white/20 blur-sm mt-2 animate-pulse" /></div>;
      case 'rain': return <div className="text-7xl">🌧️</div>;
      case 'coffee': return <div className="text-7xl animate-bounce">☕</div>;
      case 'butterfly': return <div className="text-8xl animate-pulse">🦋</div>;
      case 'book': return <div className="text-7xl">📖</div>;
      case 'music': return <div className="text-7xl animate-bounce">🎵</div>;
      case 'phone': return <div className="text-7xl">📱</div>;
      case 'ring': return <div className="text-7xl animate-[heartbeat_1.5s_ease-in-out_infinite]">💍</div>;
      case 'hug': return <div className="text-8xl">🤗</div>;
      default: return <div className="text-5xl">💖</div>;
    }
  };

  const getArtBg = (type: string) => {
    switch(type) {
      case 'rose': return 'bg-gradient-to-b from-[#1a0a2e] to-[#4a1942]';
      case 'stars': return 'bg-gradient-to-b from-[#0d0221] to-[#240b36]';
      case 'moon': return 'bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]';
      case 'sunset': return 'bg-gradient-to-b from-[#ff512f] via-[#dd2476] to-[#8e2de2]';
      case 'ocean': return 'bg-gradient-to-b from-[#006994] to-[#001a2e]';
      case 'rain': return 'bg-gradient-to-b from-[#2c3e50] to-[#34495e]';
      case 'butterfly': return 'bg-gradient-to-br from-[#667eea] to-[#764ba2]';
      case 'music': return 'bg-gradient-to-br from-[#1db954] to-[#191414]';
      case 'ring': return 'bg-gradient-to-br from-[#ffd700] to-[#ff8c00]';
      default: return '';
    }
  };

  const t = {
    bn: {
      art: "রোমান্টিক আর্ট",
      albums: "আমাদের অ্যালবাম",
      addAlbum: "নতুন অ্যালবাম",
      albumPlaceholder: "অ্যালবামের নাম...",
      noAlbums: "এখনো কোনো অ্যালবাম নেই।",
      createBtn: "তৈরি করুন",
      backBtn: "পিছনে",
      uploadBtn: "ছবি যোগ করুন",
      emptyAlbum: "এই অ্যালবামটি খালি।",
      captionPlaceholder: "একটি ক্যাপশন লিখুন...",
      saveCaption: "সংরক্ষণ করুন",
    },
    en: {
      art: "Romantic Art",
      albums: "Our Albums",
      addAlbum: "New Album",
      albumPlaceholder: "Album name...",
      noAlbums: "No albums yet.",
      createBtn: "Create",
      backBtn: "Back",
      uploadBtn: "Add Photo",
      emptyAlbum: "This album is empty.",
      captionPlaceholder: "Write a caption...",
      saveCaption: "Save",
    }
  };

  const l = t[lang];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-5">
      {/* Tab Controls */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/10 backdrop-blur-xl p-1 rounded-2xl flex border border-white/20 shadow-2xl">
          <button
            onClick={() => { setActiveTab('art'); setSelectedAlbum(null); }}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all font-bold ${
              activeTab === 'art' ? 'bg-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
            }`}
          >
            <Layout size={18} />
            {l.art}
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all font-bold ${
              activeTab === 'albums' ? 'bg-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
            }`}
          >
            <Grid size={18} />
            {l.albums}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'art' ? (
          <motion.div
            key="art-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {galleryData[lang].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(item)}
                className="group relative h-80 rounded-[30px] overflow-hidden border-2 border-white/10 bg-white/5 cursor-pointer shadow-xl hover:border-pink-500/50 hover:shadow-pink-500/20 transition-colors duration-500"
              >
                <div className={`w-full h-full flex items-center justify-center ${getArtBg(item.type)}`}>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {getArtContent(item.type)}
                  </motion.div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 text-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="mb-2 text-pink-400 font-bold tracking-tight text-lg">
                    {item.title}
                  </div>
                  <p className="text-sm text-white/70 italic">Click to reveal secret label</p>
                </div>
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  💖
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="album-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {!selectedAlbum ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingAlbum(true)}
                  className="aspect-square rounded-[30px] border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 text-white/40 hover:text-white/80 hover:border-white/40 transition-all bg-white/5"
                >
                  <FolderPlus size={48} />
                  <span className="font-bold">{l.addAlbum}</span>
                </motion.button>

                {albums.map((album) => (
                  <motion.div
                    key={album.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedAlbum(album)}
                    className="aspect-square rounded-[30px] bg-white/10 border-2 border-white/10 relative overflow-hidden group cursor-pointer shadow-xl"
                  >
                    {album.photos.length > 0 ? (
                      <img src={album.photos[0].url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-pink-500/10">
                        <Camera size={40} className="text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h4 className="text-white font-bold truncate leading-tight">{album.name}</h4>
                          <p className="text-xs text-white/40">{album.photos.length} Photos</p>
                        </div>
                        <button 
                          onClick={(e) => deleteAlbum(album.id, e)}
                          className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedAlbum(null)}
                      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{selectedAlbum.name}</h3>
                      <p className="text-white/40">{selectedAlbum.photos.length} Photos</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all"
                  >
                    <Upload size={18} />
                    {l.uploadBtn}
                  </button>
                  <input id="photo-upload" type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>

                {selectedAlbum.photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/10 rounded-[40px]">
                    <ImageIcon size={64} className="mb-4" />
                    <p className="text-xl italic">{l.emptyAlbum}</p>
                  </div>
                ) : (
                  <Masonry
                    breakpointCols={{
                      default: 4,
                      1100: 3,
                      700: 2,
                      500: 1
                    }}
                    className="flex -ml-4 w-auto"
                    columnClassName="pl-4 bg-clip-padding"
                  >
                    {selectedAlbum.photos.map((photo, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: i * 0.05,
                          duration: 0.4,
                          ease: [0.23, 1, 0.32, 1]
                        }}
                        className="mb-4 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer border border-white/5 bg-white/5"
                      >
                        <motion.img 
                          src={photo.url} 
                          alt="" 
                          onClick={() => {
                            setSelectedPhotoIndex(i);
                            setEditingCaption(photo.caption || '');
                          }}
                          className="w-full h-auto object-cover block"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                          {quickEditingIndex === i ? (
                            <div className="bg-black/80 backdrop-blur-md rounded-xl p-2 flex gap-1 border border-white/10" onClick={e => e.stopPropagation()}>
                              <input
                                type="text"
                                autoFocus
                                value={quickEditingCaption}
                                onChange={(e) => setQuickEditingCaption(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveQuickCaption(i);
                                  if (e.key === 'Escape') setQuickEditingIndex(null);
                                }}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:ring-1 focus:ring-pink-500"
                              />
                              <button 
                                onClick={() => saveQuickCaption(i)}
                                className="p-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                              >
                                <Check size={12} />
                              </button>
                              <button 
                                onClick={() => setQuickEditingIndex(null)}
                                className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                              <div className="flex-1 min-w-0 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/5">
                                <p className="text-[10px] text-white/90 font-medium truncate">
                                  {photo.caption || (lang === 'bn' ? 'ক্যাপশন নেই' : 'No caption')}
                                </p>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickEditingIndex(i);
                                  setQuickEditingCaption(photo.caption || '');
                                }}
                                className="shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-pink-500 transition-all shadow-lg"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={(e) => deletePhoto(i, e)}
                            className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-90"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </Masonry>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popups */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[1000] p-5"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-[#1a0a2e] via-[#4a1942] to-[#893168] rounded-[25px] overflow-hidden max-w-xl w-full border-2 border-white/20 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-56 bg-white/5 flex items-center justify-center">
                {getArtContent(selected.type)}
              </div>
              <div className="p-8 text-center">
                <h3 className="font-serif text-4xl text-[#ffb3d1] mb-4">
                  {selected.emoji} {selected.title}
                </h3>
                <p className="font-sans text-lg md:text-xl text-white/95 leading-relaxed">
                  {selected.text}
                </p>
                <div className="text-2xl mt-6 mb-6 flex justify-center gap-1 animate-pulse">
                  <span>💖</span><span>💗</span><span>💖</span><span>💗</span><span>💖</span>
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className="bg-white/20 border-2 border-white/50 text-white px-12 py-3 rounded-full hover:bg-white/30 transition-all font-sans text-lg"
                >
                  Close 💕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCreatingAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1000] p-5"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a0a2e] border border-white/20 p-8 rounded-[30px] w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FolderPlus className="text-pink-400" />
                {l.addAlbum}
              </h3>
              <input
                type="text"
                autoFocus
                placeholder={l.albumPlaceholder}
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createAlbum()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white mb-6 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreatingAlbum(false)}
                  className="flex-1 py-3 text-white/60 font-bold hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createAlbum}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-500/20 transition-all"
                >
                  {l.createBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {selectedPhotoIndex !== null && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[1001] p-0 md:p-10"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center relative p-5 gap-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-50 transition-all active:scale-90"
              >
                <Plus size={24} className="rotate-45" />
              </button>

              {/* Main Viewer Area */}
              <div className="relative w-full flex-1 flex items-center justify-center group">
                {/* Previous Button */}
                <button 
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 md:left-10 w-14 h-14 bg-white/5 hover:bg-pink-500 rounded-full flex items-center justify-center text-white transition-all z-20 shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 md:group-hover:opacity-100"
                >
                  <ChevronLeft size={32} />
                </button>

                <div className="relative max-w-full max-h-[75vh] flex items-center justify-center rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10">
                  <motion.img 
                    key={selectedPhotoIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    src={selectedAlbum.photos[selectedPhotoIndex].url} 
                    alt="" 
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                </div>

                {/* Next Button */}
                <button 
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 md:right-10 w-14 h-14 bg-white/5 hover:bg-pink-500 rounded-full flex items-center justify-center text-white transition-all z-20 shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 md:group-hover:opacity-100"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Caption & Controls */}
              <div className="w-full max-w-2xl bg-white/5 backdrop-blur-3xl rounded-[35px] p-6 border border-white/10 shadow-2xl mb-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full text-center md:text-left">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Photo {selectedPhotoIndex + 1} of {selectedAlbum.photos.length}</p>
                    <input
                      type="text"
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      placeholder={l.captionPlaceholder}
                      className="w-full bg-black/40 border-b-2 border-white/10 focus:border-pink-500 px-4 py-3 text-white outline-none transition-all placeholder:italic rounded-t-xl"
                    />
                  </div>
                  <button
                    onClick={saveCaption}
                    className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 active:scale-95 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all"
                  >
                    <Layout size={18} />
                    {l.saveCaption}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

