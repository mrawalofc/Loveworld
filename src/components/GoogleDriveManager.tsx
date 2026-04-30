import React, { useRef } from 'react';
import { Database, Download, Upload, Smartphone } from 'lucide-react';

export const GoogleDriveManager: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getAllLocalStorageData = () => {
    const allData: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) allData[key] = localStorage.getItem(key);
    }
    return allData;
  };

  const handleDownloadBackup = () => {
    const allData = getAllLocalStorageData();
    const blob = new Blob([JSON.stringify({ data: allData, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love_world_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm(lang === 'bn' ? "এটি আপনার বর্তমান লোকাল ডেটা ওভাররাইট করবে। আপনি কি নিশ্চিত?" : "This will overwrite your current local data. Are you sure?")) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        const data = backup.data;
        if (data && typeof data === 'object') {
          Object.keys(data).forEach(key => {
            const value = data[key];
            if (value !== null) {
              localStorage.setItem(key, value);
            }
          });
          window.location.reload();
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        alert(lang === 'bn' ? "ভুল ফাইল ফরমেট!" : "Invalid file format!");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const t = {
    bn: {
      title: "ডেটা ব্যাকআপ (লোকাল)",
      localBackup: "ডিভাইস ব্যাকআপ",
      download: "ব্যাকআপ ডাউনলোড করুন",
      upload: "ব্যাকআপ ইম্পোর্ট করুন",
      security: "*আপনার ডেটা অত্যন্ত গোপনীয় এবং আপনার নিজস্ব ডিভাইসে সংরক্ষিত থাকে।"
    },
    en: {
      title: "Data Backup (Local)",
      localBackup: "Device Backup",
      download: "Download Backup",
      upload: "Import Backup File",
      security: "*Your data is private and stored only on your own device."
    }
  };

  const l = t[lang];

  return (
    <div className="w-full max-w-sm mx-auto mt-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-white/40 mb-2">
          <Database size={16} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{l.title}</span>
        </div>
      </div>

      <div className="text-left">
        {/* Local Device Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-pink-500/20 group-hover:text-pink-500/40 transition-colors">
            <Smartphone size={80} strokeWidth={1} />
          </div>

          <h4 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            {l.localBackup}
          </h4>

          <div className="space-y-3">
            <button
              onClick={handleDownloadBackup}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg active:scale-95"
            >
              <Download size={20} />
              {l.download}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 border border-white/10"
            >
              <Upload size={20} />
              {l.upload}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportBackup} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>
      </div>
      
      <p className="max-w-md mx-auto text-[10px] text-white/30 text-center leading-relaxed">
        {l.security}
      </p>
    </div>
  );
};

