import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

export const NetworkStatus: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = {
    bn: {
      offlineTitle: "কোনো ইন্টারনেট কানেকশন নেই!",
      offlineSub: "অনুগ্রহ করে ওয়াইফাই বা মোবাইল ডাটা কানেক্ট করুন। আপনার পরিবর্তনগুলো তখন ড্রাইভের সাথে সিনক্রোনাইজ হবে।",
      onlineBack: "ইন্টারনেট কানেকশন ফিরে এসেছে!",
      syncing: "গুগল ড্রাইভের সাথে সিনক্রোনাইজ করা হচ্ছে...",
    },
    en: {
      offlineTitle: "No Internet Connection!",
      offlineSub: "Please connect to WiFi or mobile data. Your changes will then be synchronized with Google Drive.",
      onlineBack: "You're back online!",
      syncing: "Synchronizing with Google Drive...",
    }
  };

  const l = t[lang];

  return (
    <>
      {/* Permanent Overlay when offline */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/10 border border-white/20 p-10 rounded-[40px] max-w-sm shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <WifiOff className="text-red-500 animate-pulse" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{l.offlineTitle}</h2>
              <p className="text-white/70 leading-relaxed">{l.offlineSub}</p>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-yellow-400 text-sm font-medium">
                <AlertTriangle size={16} />
                <span>Waiting for network...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporary notification when coming back online */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
          >
            <Wifi size={20} />
            <span>{l.onlineBack}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
