import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  setDoc, 
  doc, 
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, MessageSquare, Loader2, Smile, Bell, BellOff, Smartphone, LogIn, LogOut, Trash2 } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  timestamp: Timestamp;
}

interface TypingUser {
  id: string;
  userName: string;
  isTyping: boolean;
}

export const Chat: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastNotification, setLastNotification] = useState<{ name: string, text: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstLoad = useRef(true);

  const t = {
    bn: {
      title: "লাইভ চ্যাটরুম",
      placeholder: "আপনার বার্তা লিখুন...",
      typing: "টাইপ করছেন...",
      joinAs: "নাম সেট করুন:",
      send: "পাঠান",
      welcome: "আমাদের চ্যাটে আপনাকে স্বাগতম! আপনার অনুভূতি শেয়ার করুন সবার সাথে।",
      smsAlert: "নতুন মেসেজ এসেছে",
      enableNotify: "নোটিফিকেশন",
      loginTitle: "চ্যাট রুমে প্রবেশ করুন",
      loginSub: "সবার সাথে কথা বলতে গুগল দিয়ে লগইন করুন",
      googleBtn: "গুগল দিয়ে লগইন",
      logging: "কাজ চলছে...",
      deleteConfirm: "মুছে ফেলতে চান?",
      yes: "হ্যাঁ",
      cancel: "না"
    },
    en: {
      title: "Live Chatroom",
      placeholder: "Type your message...",
      typing: "is typing...",
      joinAs: "Chat as:",
      send: "Send",
      welcome: "Welcome to our live chat! Share your feelings with everyone instantly.",
      smsAlert: "NEW SMS UPDATE",
      enableNotify: "Notify Me",
      loginTitle: "Join the Chatroom",
      loginSub: "Sign in with Google to start chatting with others instantly.",
      googleBtn: "Sign in with Google",
      logging: "Logging in...",
      deleteConfirm: "Delete message?",
      yes: "Yes",
      cancel: "Cancel"
    }
  };

  const l = t[lang];

  useEffect(() => {
    notificationAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    notificationAudioRef.current.volume = 0.4;

    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setAuthLoading(false);
      if (u) {
        setUser(u);
        const storedName = localStorage.getItem('chat_username') || u.displayName || `User_${u.uid.slice(0, 4)}`;
        setUserName(storedName);
        setAuthError(null);
      } else {
        setUser(null);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const messagesQuery = query(
      collection(db, 'chat_messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      
      if (!isFirstLoad.current && msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.senderId !== auth.currentUser?.uid) {
          triggerNotification(lastMsg.senderName, lastMsg.text);
        }
      }
      
      setMessages(msgs);
      isFirstLoad.current = false;
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (err) => {
      if (auth.currentUser) handleFirestoreError(err, OperationType.LIST, 'chat_messages');
    });

    const typingQuery = collection(db, 'typing_status');
    const unsubTyping = onSnapshot(typingQuery, (snapshot) => {
      const now = Date.now();
      const users = snapshot.docs
        .map(d => {
          const data = d.data();
          const lastUpdated = data.lastUpdated?.toDate?.()?.getTime?.() || 0;
          return { id: d.id, ...data, lastUpdatedTime: lastUpdated } as TypingUser & { lastUpdatedTime: number };
        })
        .filter(u => {
          const isRecent = (now - u.lastUpdatedTime) < 10000;
          return u.isTyping && u.id !== user.uid && isRecent;
        });
      setTypingUsers(users);
    }, (err) => {
      if (auth.currentUser) handleFirestoreError(err, OperationType.LIST, 'typing_status');
    });

    const handleUnload = () => updateTypingStatus(false);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      unsubMessages();
      unsubTyping();
      window.removeEventListener('beforeunload', handleUnload);
      updateTypingStatus(false);
    };
  }, [user, userName]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        setAuthError(lang === 'bn' 
          ? `এই ডোমেইনটি (${domain}) Firebase এ অনুমোদিত নয়। অনুগ্রহ করে Firebase কনসোলে গিয়ে 'Authorized Domains' লিস্টে এটি যোগ করুন।` 
          : `This domain (${domain}) is not authorized in Firebase. Please add it to your Firebase Console under Authentication > Settings > Authorized Domains.`);
      } else {
        setAuthError(err.message);
      }
    }
  };

  const updateTypingStatus = async (typing: boolean) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, 'typing_status', auth.currentUser.uid), {
        isTyping: typing,
        userName: userName,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (err) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 3000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const textToSend = inputText;
    setInputText('');
    setIsTyping(false);
    updateTypingStatus(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      await addDoc(collection(db, 'chat_messages'), {
        text: textToSend,
        senderId: user.uid,
        senderName: userName,
        senderPhoto: user.photoURL || null,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'chat_messages');
    }
  };

  const deleteMessage = async (msgId: string) => {
    try {
      await deleteDoc(doc(db, 'chat_messages', msgId));
      setConfirmDeleteId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'chat_messages');
    }
  };

  const triggerNotification = (name: string, text: string) => {
    notificationAudioRef.current?.play().catch(() => {});
    if (notificationsEnabled && document.visibilityState === 'hidden') {
      new Notification(`Message from ${name}`, { body: text, icon: '/favicon.ico' });
    }
    setLastNotification({ name, text });
    setTimeout(() => setLastNotification(null), 5000);
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white gap-4">
        <Loader2 className="animate-spin text-pink-500" size={40} />
        <p className="font-bold opacity-50">{l.logging}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto mt-20 p-8 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-pink-500">
          <MessageSquare size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 font-serif">{l.loginTitle}</h2>
        <p className="text-white/50 mb-8 text-sm leading-relaxed">{l.loginSub}</p>
        {authError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs mb-6 text-left space-y-2">
            <p className="font-bold">{lang === 'bn' ? 'লগইন সমস্যা:' : 'Login Error:'}</p>
            <p>{authError}</p>
            <div className="pt-2 border-t border-red-500/20 mt-2">
              <p className="font-bold mb-1 underline">{lang === 'bn' ? 'কিভাবে সমাধান করবেন:' : 'How to fix:'}</p>
              <ul className="list-disc ml-4 space-y-1 opacity-80">
                <li>{lang === 'bn' ? 'Firebase Console এ যান' : 'Go to Firebase Console'}</li>
                <li>{lang === 'bn' ? 'Authentication > Settings > Authorized Domains এ যান' : 'Go to Authentication > Settings > Authorized Domains'}</li>
                <li>{lang === 'bn' ? 'বর্তমান ডোমেইনটি যোগ করুন' : 'Add the current domain to the list'}</li>
                <li>{lang === 'bn' ? 'GCP Console এ OAuth Consent Screen চেক করুন' : 'Check OAuth Consent Screen in GCP Console'}</li>
              </ul>
            </div>
          </div>
        )}
        <button onClick={handleGoogleLogin} className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl active:scale-95">
          <LogIn size={20} /> {l.googleBtn}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 md:px-0 relative">
      <AnimatePresence>
        {lastNotification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md pointer-events-none">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[30px] p-4 shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shrink-0"><Smartphone className="text-white" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-pink-400 font-black tracking-widest">{l.smsAlert}</p>
                <p className="text-white font-bold text-sm truncate">{lastNotification.name}</p>
                <p className="text-white/60 text-xs truncate">{lastNotification.text}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl flex flex-col h-[70vh] overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20"><MessageSquare className="text-white" /></div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{l.title}</h2>
              <p className="text-xs text-white/40 font-mono flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />ONLINE</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleNotifications} className={`p-3 rounded-2xl transition-all ${notificationsEnabled ? 'text-pink-500 bg-pink-500/10' : 'text-white/20 bg-white/5'}`}>
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
            <button onClick={() => signOut(auth)} className="p-3 text-white/40 hover:text-white transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="text-center py-10 opacity-30 italic text-sm">{l.welcome}</div>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-2 ${msg.senderId === user.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.senderId !== user.uid && (
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden shrink-0 border border-white/10">
                    {msg.senderPhoto ? (
                      <img src={msg.senderPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40">
                        {msg.senderName.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
                <div className={`flex flex-col max-w-[80%] ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                  {msg.senderId !== user.uid && <span className="text-[10px] font-bold text-pink-400 mb-1 ml-1">{msg.senderName}</span>}
                  <div className="relative group/msg">
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-md ${msg.senderId === user.uid ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white/10 text-white border border-white/10 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    
                    {msg.senderId === user.uid && (
                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center">
                        <AnimatePresence mode="wait">
                          {confirmDeleteId === msg.id ? (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-1 flex items-center gap-1 shadow-2xl"
                            >
                              <button 
                                onClick={() => deleteMessage(msg.id)}
                                className="px-2 py-1 text-[8px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                {l.yes}
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-[8px] font-bold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                              >
                                {l.cancel}
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              onClick={() => setConfirmDeleteId(msg.id)}
                              className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] text-white/30 mt-1 ${msg.senderId === user.uid ? 'mr-1' : 'ml-1'}`}>{msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {msg.senderId === user.uid && (
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 overflow-hidden shrink-0 border border-pink-500/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-pink-500">
                        {userName.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/40 text-xs italic ml-2">
                {typingUsers[0].userName} {l.typing}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        <form onSubmit={sendMessage} className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
          <input type="text" value={inputText} onChange={handleInputChange} placeholder={l.placeholder} className="flex-1 bg-black/30 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-pink-500/50" />
          <button type="submit" disabled={!inputText.trim()} className="bg-pink-500 text-white px-6 rounded-2xl font-bold hover:bg-pink-600 active:scale-95 transition-all"><Send size={20} /></button>
        </form>
      </div>
    </div>
  );
};
