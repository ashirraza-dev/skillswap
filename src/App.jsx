// ============================================================
// SECTION 1: IMPORTS
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Home, Compass, MessageCircle, PlusCircle, Heart, List, Trophy,
  User, BarChart2, LogOut, Bell, Search, X, Check, ChevronDown,
  ChevronRight, ChevronLeft, Star, StarHalf, Flame, Shield,
  Zap, Award, Lock, Eye, EyeOff, Send, Edit2, Trash2, Share2,
  Copy, Flag, AlertCircle, CheckCircle, Info, ArrowUp, Loader2,
  TrendingUp, Users, Tag, Clock, MapPin, RefreshCw, Menu,
  Camera, Settings, Moon, Sun, Bookmark, ThumbsUp, Activity,
  Package, Hash, Globe, Phone, Filter, SortAsc, Grid, Layers,
  Gift, Crown, Sparkles, Target, Calendar, MoreVertical,
  MessageSquare, BookOpen, Briefcase, Music, Code, Palette,
  Dumbbell, ChefHat, Languages, Lightbulb, Smartphone, Wrench,
  HeartHandshake, ArrowRight, PlayCircle, Download, UploadCloud,
  HelpCircle, Volume2, Mail, ChevronUp, Keyboard, UserMinus
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, updateProfile, sendPasswordResetEmail
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, where, orderBy, serverTimestamp, getDoc,
  setDoc, getDocs, limit, increment
} from "firebase/firestore";

// ============================================================
// SECTION 2: FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAjAgUdBwyu820JqxtAr3546J90trnNImI",
  authDomain: "skillswap-48163.firebaseapp.com",
  projectId: "skillswap-48163",
  storageBucket: "skillswap-48163.firebasestorage.app",
  messagingSenderId: "953886423467",
  appId: "1:953886423467:web:47dcc723d89d9765de7aee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ============================================================
// SECTION 3: CONSTANTS
// ============================================================
const CATEGORIES = [
  { id: "tech", label: "Technology", icon: Code, color: "from-blue-500 to-cyan-500" },
  { id: "design", label: "Design", icon: Palette, color: "from-pink-500 to-rose-500" },
  { id: "music", label: "Music", icon: Music, color: "from-violet-500 to-purple-500" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, color: "from-orange-500 to-red-500" },
  { id: "cooking", label: "Cooking", icon: ChefHat, color: "from-yellow-500 to-amber-500" },
  { id: "language", label: "Languages", icon: Languages, color: "from-emerald-500 to-teal-500" },
  { id: "business", label: "Business", icon: Briefcase, color: "from-indigo-500 to-blue-500" },
  { id: "education", label: "Education", icon: BookOpen, color: "from-sky-500 to-indigo-500" },
  { id: "crafts", label: "Crafts", icon: Wrench, color: "from-amber-500 to-orange-500" },
  { id: "wellness", label: "Wellness", icon: Lightbulb, color: "from-green-500 to-emerald-500" },
  { id: "photography", label: "Photography", icon: Camera, color: "from-purple-500 to-pink-500" },
  { id: "other", label: "Other", icon: Globe, color: "from-slate-500 to-gray-500" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "post", label: "Post Skill", icon: PlusCircle },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "mylistings", label: "My Listings", icon: List },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

const MOBILE_NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "post", label: "Post", icon: PlusCircle },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Post Your Skill", desc: "Share what you can offer and what you're looking to learn.", icon: UploadCloud, color: "from-indigo-500 to-blue-500" },
  { step: 2, title: "Browse & Match", desc: "Explore listings and find people whose skills match your needs.", icon: Search, color: "from-purple-500 to-pink-500" },
  { step: 3, title: "Connect & Exchange", desc: "Reach out, agree on a swap, and start learning together.", icon: HeartHandshake, color: "from-emerald-500 to-teal-500" },
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert"];
const EXCHANGE_TYPES = ["Online", "In-Person", "Both"];

const BADGES_CONFIG = [
  { id: "first_step", label: "First Step", icon: Target, color: "text-emerald-400", desc: "Posted your first listing", req: (l) => l >= 1 },
  { id: "social_butterfly", label: "Social Butterfly", icon: Users, color: "text-pink-400", desc: "Sent 10+ messages", req: (l, r, f, m) => m >= 10 },
  { id: "top_contributor", label: "Top Contributor", icon: Star, color: "text-amber-400", desc: "5+ listings posted", req: (l) => l >= 5 },
  { id: "community_star", label: "Community Star", icon: Sparkles, color: "text-violet-400", desc: "Received 5+ reviews", req: (l, r) => r >= 5 },
  { id: "legendary", label: "Legendary", icon: Crown, color: "text-yellow-400", desc: "Trust score 80+", req: (l, r, f, m, s) => s >= 80 },
  { id: "chatterbox", label: "Chatterbox", icon: MessageCircle, color: "text-blue-400", desc: "Sent 50+ messages", req: (l, r, f, m) => m >= 50 },
  { id: "collector", label: "Collector", icon: Bookmark, color: "text-rose-400", desc: "10+ favorites saved", req: (l, r, f) => f >= 10 },
  { id: "on_fire", label: "On Fire 🔥", icon: Flame, color: "text-orange-400", desc: "7-day activity streak", req: (l, r, f, m, s, streak) => streak >= 7 },
];

const TITLES = [
  { min: 0, label: "Newcomer", color: "text-slate-400" },
  { min: 15, label: "Exchanger", color: "text-emerald-400" },
  { min: 30, label: "Skilled Trader", color: "text-blue-400" },
  { min: 50, label: "Expert Trader", color: "text-violet-400" },
  { min: 70, label: "Master", color: "text-amber-400" },
  { min: 90, label: "Legend", color: "text-yellow-400" },
];

const ACHIEVEMENTS = [
  { id: "a1", title: "Welcome!", desc: "Create your account", goal: 1, icon: Gift },
  { id: "a2", title: "First Post", desc: "Post your first skill", goal: 1, icon: PlusCircle },
  { id: "a3", title: "Explorer", desc: "Browse 10 listings", goal: 10, icon: Compass },
  { id: "a4", title: "Communicator", desc: "Send 5 messages", goal: 5, icon: MessageSquare },
  { id: "a5", title: "Popular", desc: "Get 3 favorites on a listing", goal: 3, icon: Heart },
  { id: "a6", title: "Reviewer", desc: "Leave 3 reviews", goal: 3, icon: Star },
  { id: "a7", title: "Prolific", desc: "Post 10 listings", goal: 10, icon: List },
  { id: "a8", title: "Well Reviewed", desc: "Receive 10 reviews", goal: 10, icon: Award },
  { id: "a9", title: "Networker", desc: "Chat with 5 different users", goal: 5, icon: Users },
  { id: "a10", title: "Elite", desc: "Reach trust score 75", goal: 75, icon: Crown },
];

const MOCK_TESTIMONIALS = [
  { name: "Layla Hassan", text: "Traded my Arabic lessons for web dev help. Best decision ever!", avatar: "LH", stars: 5, role: "Language Teacher" },
  { name: "Carlos Rivera", text: "SkillSwap connected me with an amazing photographer for guitar lessons!", avatar: "CR", stars: 5, role: "Guitarist" },
  { name: "Priya Nair", text: "Got Python coding help in exchange for yoga classes. Community is incredible.", avatar: "PN", stars: 5, role: "Yoga Instructor" },
];

const MOCK_LISTINGS = [
  { id: "demo1", userId: "demo", userName: "Alex Chen", skillOffered: "React Development", skillWanted: "UI/UX Design", category: "tech", description: "5 years experience with React, Next.js, and TypeScript. Happy to help with projects.", tags: ["react","nextjs","typescript"], skillLevel: "Expert", exchangeType: "Online", views: 142, favorites: 12, createdAt: { seconds: Date.now()/1000 - 86400 } },
  { id: "demo2", userId: "demo2", userName: "Sara Lee", skillOffered: "Digital Illustration", skillWanted: "Python Basics", category: "design", description: "Professional illustrator with 8+ years. I can teach Procreate, Photoshop & Illustrator.", tags: ["illustration","procreate","photoshop"], skillLevel: "Expert", exchangeType: "Both", views: 98, favorites: 8, createdAt: { seconds: Date.now()/1000 - 172800 } },
  { id: "demo3", userId: "demo3", userName: "Omar Khalid", skillOffered: "Arabic Calligraphy", skillWanted: "Photography", category: "crafts", description: "Traditional Arabic calligrapher. Can teach basics to advanced styles.", tags: ["calligraphy","arabic","art"], skillLevel: "Intermediate", exchangeType: "In-Person", views: 76, favorites: 5, createdAt: { seconds: Date.now()/1000 - 259200 } },
  { id: "demo4", userId: "demo4", userName: "Elena Rossi", skillOffered: "Italian Cooking", skillWanted: "Fitness Training", category: "cooking", description: "Authentic Italian recipes passed down through generations. Pizza, pasta, and more!", tags: ["italian","cooking","pasta"], skillLevel: "Expert", exchangeType: "In-Person", views: 210, favorites: 19, createdAt: { seconds: Date.now()/1000 - 345600 } },
  { id: "demo5", userId: "demo5", userName: "Jake Wu", skillOffered: "Guitar Lessons", skillWanted: "Video Editing", category: "music", description: "Classical and rock guitar for 10 years. Patient teacher, all levels welcome.", tags: ["guitar","music","lessons"], skillLevel: "Expert", exchangeType: "Both", views: 135, favorites: 11, createdAt: { seconds: Date.now()/1000 - 432000 } },
  { id: "demo6", userId: "demo6", userName: "Mei Zhang", skillOffered: "Mandarin Chinese", skillWanted: "Spanish", category: "language", description: "Native Mandarin speaker. Can teach conversational & business Chinese.", tags: ["mandarin","chinese","language"], skillLevel: "Intermediate", exchangeType: "Online", views: 89, favorites: 7, createdAt: { seconds: Date.now()/1000 - 518400 } },
];

// ============================================================
// SECTION 4: HELPER FUNCTIONS
// ============================================================

const timeAgo = (timestamp) => {
  if (!timestamp) return "Just now";
  const seconds = Math.floor((Date.now() / 1000) - (timestamp.seconds || timestamp / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const getCat = (categoryId) => CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];

const initials = (name) => {
  if (!name) return "??";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const userGrad = (userId) => {
  const grads = [
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-indigo-500",
    "from-green-500 to-emerald-500",
    "from-red-500 to-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < (userId || "x").length; i++) hash += (userId || "x").charCodeAt(i);
  return grads[hash % grads.length];
};

const trunc = (text, length = 80) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const trustScore = (listingsCount, reviewsCount, avgRating) => {
  const score = (listingsCount * 1) + (reviewsCount * 2) + ((avgRating || 0) * 3);
  return Math.min(Math.round(score), 100);
};

const userTitle = (score) => {
  const titles = [...TITLES].reverse();
  return titles.find(t => score >= t.min) || TITLES[0];
};

const todayKey = () => new Date().toISOString().split("T")[0];

const isBlocked = (blockedUsers, userId) => Array.isArray(blockedUsers) && blockedUsers.includes(userId);

const heatmapData = (activityLog) => {
  const weeks = 12;
  const days = 7;
  const result = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < days; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (w * 7) - (days - 1 - d));
      const key = date.toISOString().split("T")[0];
      week.push({ key, count: (activityLog && activityLog[key]) || 0 });
    }
    result.push(week);
  }
  return result;
};

const heatColor = (count) => {
  if (count === 0) return "bg-white/5";
  if (count === 1) return "bg-indigo-900/60";
  if (count === 2) return "bg-indigo-700/70";
  if (count <= 4) return "bg-indigo-500/80";
  return "bg-indigo-400";
};

const trendingCats = (listings) => {
  const counts = {};
  listings.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id, count]) => ({ ...getCat(id), count }));
};

const matchingSuggestions = (listings, userId, userData) => {
  if (!userData || !userId) return listings.slice(0, 6);
  return listings.filter(l => l.userId !== userId).slice(0, 6);
};

const leaderboardData = (listings, reviews) => {
  const users = {};
  listings.forEach(l => {
    if (!users[l.userId]) users[l.userId] = { uid: l.userId, name: l.userName, listings: 0, reviews: 0, avgRating: 0 };
    users[l.userId].listings += 1;
  });
  reviews.forEach(r => {
    if (!users[r.toUserId]) users[r.toUserId] = { uid: r.toUserId, name: r.toUserName, listings: 0, reviews: 0, avgRating: 0 };
    users[r.toUserId].reviews += 1;
    users[r.toUserId].avgRating = ((users[r.toUserId].avgRating || 0) + r.rating) / users[r.toUserId].reviews;
  });
  return Object.values(users)
    .map(u => ({ ...u, score: trustScore(u.listings, u.reviews, u.avgRating) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

const getUnlockedBadges = (score, listingsCount, reviewsCount, favoritesCount, messagesCount, streak) => {
  return BADGES_CONFIG.filter(b => b.req(listingsCount, reviewsCount, favoritesCount, messagesCount, score, streak));
};

const passwordStrength = (password) => {
  if (!password || password.length < 4) return { score: 0, label: "Too short", color: "bg-red-500" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { score: 0, label: "Weak", color: "bg-red-500" },
    { score: 1, label: "Fair", color: "bg-orange-500" },
    { score: 2, label: "Good", color: "bg-yellow-500" },
    { score: 3, label: "Strong", color: "bg-emerald-500" },
    { score: 4, label: "Very Strong", color: "bg-green-500" },
  ];
  return levels[score] || levels[0];
};

const formatNumber = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
};

// ============================================================
// SECTION 5: SMALL COMPONENTS
// ============================================================

// --- Toast ---
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const styles = {
    success: { bg: "bg-emerald-500/20 border-emerald-500/30", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
    error: { bg: "bg-red-500/20 border-red-500/30", icon: <AlertCircle className="w-5 h-5 text-red-400" /> },
    info: { bg: "bg-blue-500/20 border-blue-500/30", icon: <Info className="w-5 h-5 text-blue-400" /> },
    warning: { bg: "bg-amber-500/20 border-amber-500/30", icon: <AlertCircle className="w-5 h-5 text-amber-400" /> },
  };
  const s = styles[toast.type] || styles.info;
  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${s.bg} max-w-sm`}>
        {s.icon}
        <p className="text-sm text-white font-medium">{toast.message}</p>
        <button onClick={onClose} className="ml-auto text-white/40 hover:text-white/80 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- Loading Skeleton ---
const LoadingSkeleton = ({ type = "card" }) => {
  const pulse = "animate-pulse bg-white/5 rounded-xl";
  if (type === "card") return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className={`h-5 w-3/4 ${pulse}`} />
      <div className={`h-4 w-1/2 ${pulse}`} />
      <div className={`h-16 w-full ${pulse}`} />
      <div className="flex gap-2">
        <div className={`h-6 w-16 ${pulse} rounded-full`} />
        <div className={`h-6 w-20 ${pulse} rounded-full`} />
      </div>
    </div>
  );
  if (type === "row") return (
    <div className="flex items-center gap-3 p-4">
      <div className={`w-10 h-10 rounded-full ${pulse}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-4 w-1/3 ${pulse}`} />
        <div className={`h-3 w-1/2 ${pulse}`} />
      </div>
    </div>
  );
  return <div className={`h-32 w-full ${pulse}`} />;
};

// --- Empty State ---
const EmptyState = ({ icon: Icon = Package, title = "Nothing here yet", desc = "Be the first to add something!", action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-5 glow-sm">
      <Icon className="w-10 h-10 text-indigo-400" />
    </div>
    <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
    <p className="text-white/50 text-sm max-w-xs mb-6">{desc}</p>
    {action && (
      <button onClick={action} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
        {actionLabel}
      </button>
    )}
  </div>
);

// --- Rating Stars ---
const RatingStars = ({ rating = 0, interactive = false, onChange }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} onClick={() => interactive && onChange?.(s)} className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}>
        <Star className={`w-4 h-4 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
      </button>
    ))}
  </div>
);

// --- Trust Ring ---
const TrustRing = ({ score = 0, size = 64 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#trustGrad)" strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        <defs>
          <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-white font-bold" style={{ fontSize: size / 4 }}>{score}</span>
    </div>
  );
};

// --- Password Strength Bar ---
const PasswordStrength = ({ password }) => {
  const strength = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength.score ? strength.color : "bg-white/10"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</p>
    </div>
  );
};

// --- Badges Row ---
const BadgesRow = ({ score, listingsCount, reviewsCount, favoritesCount, messagesCount, streak }) => {
  const unlocked = getUnlockedBadges(score, listingsCount, reviewsCount, favoritesCount, messagesCount, streak);
  return (
    <div className="flex flex-wrap gap-2">
      {BADGES_CONFIG.map(badge => {
        const isUnlocked = unlocked.find(b => b.id === badge.id);
        const Icon = badge.icon;
        return (
          <div key={badge.id} title={badge.desc}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${isUnlocked ? `glass border-white/20 ${badge.color}` : "bg-white/5 border-white/5 text-white/25"}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
            {!isUnlocked && <Lock className="w-3 h-3" />}
          </div>
        );
      })}
    </div>
  );
};

// --- Heatmap ---
const Heatmap = ({ activityLog }) => {
  const data = heatmapData(activityLog);
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div key={di} title={`${day.key}: ${day.count} activities`}
                className={`w-3 h-3 rounded-sm transition-all cursor-default ${heatColor(day.count)}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-white/30">Less</span>
        {[0, 1, 2, 3, 5].map(c => <div key={c} className={`w-3 h-3 rounded-sm ${heatColor(c)}`} />)}
        <span className="text-xs text-white/30">More</span>
      </div>
    </div>
  );
};

// --- Notification Panel ---
const NotifPanel = ({ notifications, onClose, onMarkAll }) => (
  <div className="absolute right-0 top-12 w-80 glass-strong rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h3 className="font-bold text-white">Notifications</h3>
      <div className="flex gap-2">
        <button onClick={onMarkAll} className="text-xs text-indigo-400 hover:text-indigo-300">Mark all read</button>
        <button onClick={onClose}><X className="w-4 h-4 text-white/40" /></button>
      </div>
    </div>
    <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-white/40 text-sm">No notifications yet</div>
      ) : notifications.map((n, i) => (
        <div key={i} className={`px-4 py-3 hover:bg-white/5 transition-colors ${!n.read ? "border-l-2 border-indigo-500" : ""}`}>
          <p className="text-sm text-white/80">{n.message}</p>
          <p className="text-xs text-white/30 mt-1">{timeAgo(n.createdAt)}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Scroll To Top ---
const ScrollToTop = ({ show }) => {
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 md:bottom-8 z-40 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow hover:scale-110 transition-transform">
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
};

// --- Skill Card ---
const SkillCard = ({ listing, onFavorite, isFavorited, onContact, onReport, onMessage, currentUserId, blockedUsers, onViewProfile, onShare, onExchange, onViewListing }) => {
  const cat = getCat(listing.category);
  const CatIcon = cat.icon;
  if (isBlocked(blockedUsers, listing.userId)) return null;
  return (
    <div onClick={() => onViewListing?.(listing)} className="cursor-pointer glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-300 group border border-white/5 hover:border-white/15 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-10 transition-opacity -translate-y-8 translate-x-8`} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${userGrad(listing.userId)} flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0`}>
            {initials(listing.userName)}
          </div>
          <div>
            <button onClick={() => onViewProfile?.(listing)} className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors leading-tight">{listing.userName}</button>
            <div className={`flex items-center gap-1 text-xs bg-gradient-to-r ${cat.color} bg-clip-text text-transparent font-medium`}>
              <CatIcon className="w-3 h-3 text-current opacity-70" style={{ color: "currentColor" }} />
              {cat.label}
            </div>
          </div>
        </div>
        <button onClick={() => onFavorite(listing.id)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <Heart className={`w-4 h-4 transition-all ${isFavorited ? "fill-rose-500 text-rose-500" : "text-white/30 hover:text-rose-400"}`} />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Offering</span>
          <span className="text-sm font-semibold text-white">{listing.skillOffered}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">Wants</span>
          <span className="text-sm text-white/70">{listing.skillWanted}</span>
        </div>
      </div>

      {listing.description && (
        <p className="text-xs text-white/50 mb-3 leading-relaxed">{trunc(listing.description, 90)}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(listing.tags || []).slice(0, 3).map(tag => (
          <span key={tag} className="text-xs text-indigo-300/70 bg-indigo-500/10 px-2 py-0.5 rounded-full">#{tag}</span>
        ))}
        {listing.skillLevel && (
          <span className="text-xs text-purple-300/70 bg-purple-500/10 px-2 py-0.5 rounded-full">{listing.skillLevel}</span>
        )}
        {listing.exchangeType && (
          <span className="text-xs text-cyan-300/70 bg-cyan-500/10 px-2 py-0.5 rounded-full">{listing.exchangeType}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.views || 0}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{listing.favorites || 0}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(listing.createdAt)}</span>
        </div>
        {currentUserId && currentUserId !== listing.userId ? (
          <div className="flex gap-1.5">
            <button onClick={() => onShare?.(listing)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-indigo-400" title="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onExchange?.(listing)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1" title="Propose Exchange">
              <HeartHandshake className="w-3 h-3" /> Exchange
            </button>
            <button onClick={() => onMessage?.(listing)}
              className="bg-white/10 border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-white/15 transition-colors">
              Message
            </button>
            <button onClick={() => onReport?.(listing)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white/60" title="Report">
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          onShare && (
            <button onClick={() => onShare(listing)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-indigo-400" title="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

// --- User Card Modal ---
const UserProfileModal = ({ user: profileUser, listings, reviews, onClose, onMessage }) => {
  if (!profileUser) return null;
  const userListings = listings.filter(l => l.userId === profileUser.userId);
  const userReviews = reviews.filter(r => r.toUserId === profileUser.userId);
  const avgRating = userReviews.length ? userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length : 0;
  const score = trustScore(userListings.length, userReviews.length, avgRating);
  const title = userTitle(score);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-md p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${userGrad(profileUser.userId)} flex items-center justify-center text-xl font-bold text-white shadow-xl`}>
              {initials(profileUser.userName)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{profileUser.userName}</h3>
              <p className={`text-sm font-semibold ${title.color}`}>{title.label}</p>
              <RatingStars rating={Math.round(avgRating)} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{ label: "Listings", value: userListings.length }, { label: "Reviews", value: userReviews.length }, { label: "Trust Score", value: score }].map(s => (
            <div key={s.label} className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { onMessage?.(profileUser); onClose(); }}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" /> Send Message
        </button>
      </div>
    </div>
  );
};

// --- Review Modal ---
const ReviewModal = ({ target, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Leave a Review</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white/40" /></button>
        </div>
        <div className="flex justify-center mb-4">
          <RatingStars rating={rating} interactive onChange={setRating} />
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your review..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none h-24 mb-4" />
        <button onClick={() => onSubmit({ rating, text })}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Submit Review
        </button>
      </div>
    </div>
  );
};

// --- Report Modal ---
const ReportModal = ({ listing, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const reasons = ["Spam", "Inappropriate Content", "Fake Listing", "Scam", "Other"];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Report Listing</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white/40" /></button>
        </div>
        <div className="space-y-2 mb-5">
          {reasons.map(r => (
            <button key={r} onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${reason === r ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"}`}>
              {r}
            </button>
          ))}
        </div>
        <button onClick={() => reason && onSubmit(reason)} disabled={!reason}
          className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
          Submit Report
        </button>
      </div>
    </div>
  );
};

// --- Delete Confirm Modal ---
const DeleteModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-white text-center mb-2">Delete Listing?</h3>
      <p className="text-sm text-white/50 text-center mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 glass border border-white/10 text-white py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// --- Exchange Proposal Modal ---
const ExchangeModal = ({ listing, onClose, onSend }) => {
  const [msg, setMsg] = useState(`Hi! I'm interested in exchanging skills. I'd love to learn "${listing?.skillOffered}" and I can offer "${listing?.skillWanted}" in return.`);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Propose Exchange</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white/40" /></button>
        </div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none h-32 mb-4" />
        <button onClick={() => onSend(msg)}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Send Proposal
        </button>
      </div>
    </div>
  );
};

// --- Welcome Modal ---
const WelcomeModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: UploadCloud, title: "Post a Skill", desc: "Share what you can teach and what you want to learn.", color: "from-indigo-500 to-blue-500" },
    { icon: Search, title: "Find Matches", desc: "Browse listings and discover people with complementary skills.", color: "from-purple-500 to-pink-500" },
    { icon: HeartHandshake, title: "Exchange Knowledge", desc: "Connect, agree on a swap, and start learning together!", color: "from-emerald-500 to-teal-500" },
  ];
  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 3500);
    const autoClose = setTimeout(onClose, 30000);
    return () => { clearInterval(timer); clearTimeout(autoClose); };
  }, []);
  const handleGo = () => {
    localStorage.setItem("skillswap_welcomed", "true");
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={handleGo}>
      <div className="relative glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
        <div className="relative">
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-1">Welcome to SkillSwap! 🎉</h3>
            <p className="text-sm text-white/50">Here's how to get started</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-5">
            {steps.map((s, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-500" : i < step ? "w-4 bg-indigo-500/50" : "w-4 bg-white/10"}`} />
            ))}
          </div>
          <div className="glass rounded-2xl p-5 mb-5 border border-white/5 min-h-[120px] flex flex-col items-center justify-center text-center">
            {(() => { const Icon = steps[step].icon; return (
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[step].color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            ); })()}
            <h4 className="font-bold text-white text-sm mb-1">{steps[step].title}</h4>
            <p className="text-xs text-white/50">{steps[step].desc}</p>
          </div>
          <div className="flex gap-2 mb-4">
            {steps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${i === step ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300" : "glass border border-white/5 text-white/40 hover:text-white/60"}`}>
                {s.title.split(" ")[0]}
              </button>
            ))}
          </div>
          <button onClick={handleGo}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity glow flex items-center justify-center gap-2">
            Let's Go! <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Settings Modal ---
const SettingsModal = ({ user, userData, onUpdateProfile, onSignOut, onClose, showToast }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [location, setLocation] = useState(userData?.location || "");
  const [notifSounds, setNotifSounds] = useState(userData?.notifSounds ?? true);
  const [emailNotifs, setEmailNotifs] = useState(userData?.emailNotifs ?? true);
  const [saving, setSaving] = useState(false);
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "account", label: "Account", icon: Shield },
  ];
  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile({ displayName, bio, location, notifSounds, emailNotifs });
      showToast("success", "Settings saved!");
    } catch { showToast("error", "Failed to save settings."); }
    setSaving(false);
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-lg p-6 border border-white/10 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Settings</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white/40 hover:text-white/80 transition-colors" /></button>
        </div>
        <div className="flex gap-1 mb-5 glass rounded-xl border border-white/5 p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.id ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "text-white/40 hover:text-white/70"}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Display Name</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 resize-none h-20 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
        )}
        {activeTab === "preferences" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
              <div className="flex items-center gap-3"><Moon className="w-4 h-4 text-indigo-400" /><div><p className="text-sm text-white font-medium">Dark Mode</p><p className="text-xs text-white/40">Always on for now</p></div></div>
              <div className="w-10 h-5 rounded-full bg-indigo-500 flex items-center justify-end px-0.5 cursor-pointer"><div className="w-4 h-4 rounded-full bg-white" /></div>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
              <div className="flex items-center gap-3"><Volume2 className="w-4 h-4 text-purple-400" /><div><p className="text-sm text-white font-medium">Notification Sounds</p><p className="text-xs text-white/40">Play sounds for new messages</p></div></div>
              <button onClick={() => setNotifSounds(!notifSounds)}
                className={`w-10 h-5 rounded-full flex items-center transition-colors ${notifSounds ? "bg-indigo-500 justify-end" : "bg-white/10 justify-start"} px-0.5`}>
                <div className="w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-emerald-400" /><div><p className="text-sm text-white font-medium">Email Notifications</p><p className="text-xs text-white/40">Receive email for important updates</p></div></div>
              <button onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-10 h-5 rounded-full flex items-center transition-colors ${emailNotifs ? "bg-indigo-500 justify-end" : "bg-white/10 justify-start"} px-0.5`}>
                <div className="w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        )}
        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="glass rounded-xl border border-white/5 p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Change Password</h4>
              <p className="text-xs text-white/40 mb-3">A password reset email will be sent to {user?.email}</p>
              <button onClick={async () => { try { await sendPasswordResetEmail(auth, user?.email); showToast("success", "Password reset email sent!"); } catch { showToast("error", "Failed to send reset email."); } }}
                className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-500/30 transition-colors">
                Send Reset Email
              </button>
            </div>
            <div className="glass rounded-xl border border-white/5 p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Blocked Users</h4>
              {(userData?.blockedUsers || []).length === 0 ? (
                <p className="text-xs text-white/30">No blocked users</p>
              ) : (
                <div className="space-y-2">{(userData.blockedUsers || []).map(uid => (
                  <div key={uid} className="flex items-center justify-between p-2 rounded-lg bg-white/3">
                    <span className="text-xs text-white/60">{uid.slice(0, 12)}...</span>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300">Unblock</button>
                  </div>
                ))}</div>
              )}
            </div>
            <div className="glass rounded-xl border border-red-500/10 p-4">
              <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Danger Zone</h4>
              <p className="text-xs text-white/40 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
              <button className="bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-500/30 transition-colors">
                Delete Account
              </button>
            </div>
            <button onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/10 text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mt-5 flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Settings
        </button>
      </div>
    </div>
  );
};

// --- Confetti Effect ---
const ConfettiEffect = ({ show }) => {
  if (!show) return null;
  const particles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 8,
    color: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"][Math.floor(Math.random() * 7)],
    shape: Math.random() > 0.5 ? "circle" : "square",
    rotation: Math.random() * 360,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-particle { position: absolute; top: -10px; animation: confetti-fall linear forwards; }
      `}</style>
      {particles.map(p => (
        <div key={p.id} className="confetti-particle"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }} />
      ))}
    </div>
  );
};

// --- Keyboard Shortcuts Overlay ---
const KeyboardShortcutsOverlay = ({ show, onClose }) => {
  if (!show) return null;
  const shortcuts = [
    { key: "Ctrl + K", desc: "Focus Search", icon: Search },
    { key: "Ctrl + N", desc: "New Post", icon: PlusCircle },
    { key: "Ctrl + M", desc: "Open Messages", icon: MessageCircle },
    { key: "Ctrl + F", desc: "Open Favorites", icon: Heart },
    { key: "Ctrl + /", desc: "Toggle Shortcuts", icon: Keyboard },
    { key: "Esc", desc: "Close Modals", icon: X },
    { key: "1 - 9", desc: "Navigate Pages", icon: Compass },
  ];
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-sm p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Keyboard className="w-5 h-5 text-indigo-400" /> Keyboard Shortcuts</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white/40 hover:text-white/80 transition-colors" /></button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(s => (
            <div key={s.key} className="flex items-center justify-between p-3 rounded-xl glass border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <s.icon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-white/70">{s.desc}</span>
              </div>
              <kbd className="bg-white/10 border border-white/15 text-white/60 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold">{s.key}</kbd>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 text-center mt-4">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Esc</kbd> to close</p>
      </div>
    </div>
  );
};

// --- Typing Indicator ---
const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-2 glass rounded-2xl rounded-bl-sm border border-white/10 w-fit">
    {[0, 1, 2].map(i => (
      <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
    <span className="text-xs text-white/30 ml-1">typing...</span>
  </div>
);

// --- Floating Action Button ---
const FloatingActionButton = ({ onPost, onSearch, onFavorites, fabOpen, onToggleFab, currentPage }) => {
  if (["messages", "post"].includes(currentPage)) return null;
  return (
    <div className="fixed bottom-20 right-4 z-30 md:hidden flex flex-col items-end gap-2">
      {fabOpen && (
        <div className="flex flex-col gap-2 animate-slide-up">
          <button onClick={() => { onPost(); onToggleFab(); }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow-sm" title="Post Skill">
            <PlusCircle className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => { onSearch(); onToggleFab(); }}
            className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center shadow-lg" title="Search">
            <Search className="w-5 h-5 text-white/70" />
          </button>
          <button onClick={() => { onFavorites(); onToggleFab(); }}
            className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center shadow-lg" title="Favorites">
            <Heart className="w-5 h-5 text-white/70" />
          </button>
        </div>
      )}
      <button onClick={onToggleFab}
        className={`w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl glow transition-transform duration-300 ${fabOpen ? "rotate-45" : ""}`}>
        <PlusCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

// ============================================================
// SECTION 6: LANDING PAGE
// ============================================================
const LandingPage = ({ onGetStarted, onLogin }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counts, setCounts] = useState({ skills: 0, members: 0, exchanges: 0 });
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % MOCK_TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const targets = { skills: 1284, members: 8942, exchanges: 3761 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        skills: Math.round(targets.skills * progress),
        members: Math.round(targets.members * progress),
        exchanges: Math.round(targets.exchanges * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow-sm">
              <HeartHandshake className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">SkillSwap</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onLogin} className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">Login</button>
            <button onClick={onGetStarted} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity glow-sm">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            No money. Just skills.
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Exchange Skills,<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Not Money.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with talented people worldwide. Trade what you know for what you need — completely free, forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-all glow flex items-center gap-2 group">
              Start Swapping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onLogin}
              className="glass border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-400" /> Explore Skills
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {["LH","CR","PN","JW","MZ"].map((i, idx) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${["from-indigo-500 to-purple-500","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500"][idx]} border-2 border-[#020617] flex items-center justify-center text-xs font-bold text-white`}>{i}</div>
              ))}
            </div>
            <span className="text-sm text-white/50">Trusted by <strong className="text-white">8,000+</strong> skill traders</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { label: "Skills Listed", value: formatNumber(counts.skills), icon: List, color: "text-indigo-400" },
              { label: "Community Members", value: formatNumber(counts.members), icon: Users, color: "text-purple-400" },
              { label: "Exchanges Completed", value: formatNumber(counts.exchanges), icon: HeartHandshake, color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-white/10 transition-colors">
                <s.icon className={`w-7 h-7 ${s.color} mx-auto mb-3`} />
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why SkillSwap?</h2>
            <p className="text-white/40 max-w-xl mx-auto">The smartest way to learn and grow, powered by community.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Instant Matches", desc: "Our algorithm connects you with the perfect skill partner.", color: "from-amber-500 to-orange-500" },
              { icon: Shield, title: "Trust System", desc: "Verified reviews and trust scores keep the community safe.", color: "from-emerald-500 to-teal-500" },
              { icon: Globe, title: "Global Network", desc: "Connect with skilled people in 80+ countries.", color: "from-blue-500 to-cyan-500" },
              { icon: Gift, title: "100% Free", desc: "No fees, no subscriptions. Just pure skill exchange.", color: "from-purple-500 to-pink-500" },
            ].map(f => (
              <div key={f.title} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all group hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-white/40">Get started in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="glass rounded-2xl p-6 border border-white/5 relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5">{step.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                {i < 2 && <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20 z-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Explore Categories</h2>
            <p className="text-white/40">From tech to cooking — every skill has a home here.</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={onGetStarted}
                className="glass rounded-xl p-4 flex flex-col items-center gap-2 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-10">What People Say</h2>
          <div className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-6xl text-indigo-500/20 font-serif">"</div>
            <div className="relative">
              <p className="text-white/80 text-lg leading-relaxed mb-6 italic">{MOCK_TESTIMONIALS[activeTestimonial].text}</p>
              <RatingStars rating={MOCK_TESTIMONIALS[activeTestimonial].stars} />
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(MOCK_TESTIMONIALS[activeTestimonial].avatar)} flex items-center justify-center text-sm font-bold text-white`}>
                  {MOCK_TESTIMONIALS[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-sm">{MOCK_TESTIMONIALS[activeTestimonial].name}</p>
                  <p className="text-white/40 text-xs">{MOCK_TESTIMONIALS[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {MOCK_TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-indigo-400 w-6" : "bg-white/20"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-10 border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/20" />
            <div className="relative">
              <Crown className="w-12 h-12 text-amber-400 mx-auto mb-5" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Start Swapping?</h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">Join thousands of people already trading skills. Sign up in under a minute.</p>
              <button onClick={onGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:opacity-90 transition-all glow">
                Join for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <HeartHandshake className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-white">SkillSwap</span>
        </div>
        <p className="text-sm text-white/30">© 2025 SkillSwap. Exchange skills, not money.</p>
      </footer>

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); }
        .glass-strong { background: rgba(255,255,255,0.07); backdrop-filter: blur(20px); }
        .glow { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
        .glow-sm { box-shadow: 0 0 12px rgba(99,102,241,0.3); }
      `}</style>
    </div>
  );
};

// ============================================================
// SECTION 7: LOGIN PAGE
// ============================================================
const LoginPage = ({ onLogin, onGoogle, onSignup, onAnon, showToast }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!password || password.length < 6) e.password = "Min 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setErrors({ form: "Invalid email or password." });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try { await onGoogle(); } catch { setErrors({ form: "Google sign-in failed." }); }
    setLoadingGoogle(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-white/40 text-sm">Sign in to continue swapping</p>
          </div>

          {errors.form && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{errors.form}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.email ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-indigo-500"}`} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.password ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-indigo-500"}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? "bg-indigo-500 border-indigo-500" : "border-white/20"}`}>
                {rememberMe && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-white/50">Remember me</span>
            </label>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</button>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4 glow disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button onClick={handleGoogle} disabled={loadingGoogle}
            className="w-full glass border border-white/10 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 mb-3">
            {loadingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4 text-indigo-400" />}
            Continue with Google
          </button>

          <button onClick={onAnon}
            className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition-colors">
            Browse anonymously
          </button>

          <p className="text-center text-sm text-white/40 mt-5">
            Don't have an account?{" "}
            <button onClick={onSignup} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 8: SIGNUP PAGE
// ============================================================
const SignupPage = ({ onSignup, onGoogle, onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Full name required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!password || password.length < 6) e.password = "Minimum 6 characters";
    if (password !== confirm) e.confirm = "Passwords don't match";
    if (!agreed) e.terms = "Please accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try { await onSignup(email, password, name); }
    catch (err) { setErrors({ form: err.message || "Signup failed. Try again." }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Create account</h2>
            <p className="text-white/40 text-sm">Join the SkillSwap community</p>
          </div>

          {errors.form && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{errors.form}</p>
            </div>
          )}

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Muhammad Ashir"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.name ? "border-red-500/50" : "border-white/10 focus:border-indigo-500"}`} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.email ? "border-red-500/50" : "border-white/10 focus:border-indigo-500"}`} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.password ? "border-red-500/50" : "border-white/10 focus:border-indigo-500"}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors.confirm ? "border-red-500/50" : "border-white/10 focus:border-indigo-500"}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
            </div>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <div onClick={() => setAgreed(!agreed)}
              className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${agreed ? "bg-indigo-500 border-indigo-500" : "border-white/20"}`}>
              {agreed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-white/50">
              I agree to the <span className="text-indigo-400">Terms of Service</span> and <span className="text-indigo-400">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-400 -mt-4 mb-4">{errors.terms}</p>}

          <button onClick={handleSignup} disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4 glow disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <button onClick={onLogin} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 9: MAIN APP PAGES
// ============================================================

// --- HOME PAGE ---
const HomePage = ({ user, userData, listings, favorites, blockedUsers, onFavorite, onMessage, onNavigate, showToast, recentlyViewed, onExchange, onShare, onViewListing, onOpenSettings }) => {
  const suggestions = useMemo(() => matchingSuggestions(listings, user?.uid, userData), [listings, user, userData]);
  const trending = useMemo(() => trendingCats(listings), [listings]);
  const recentListings = useMemo(() => [...listings].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 6), [listings]);
  const [profileListing, setProfileListing] = useState(null);
  const reviews = [];

  return (
    <div className="space-y-8 page-enter">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-indigo-300 text-sm font-semibold mb-1">Welcome back 👋</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              {userData?.displayName || user?.displayName || "Skill Swapper"}
            </h2>
            <p className="text-white/50 text-sm">Ready to swap some skills today?</p>
          </div>
          <button onClick={() => onNavigate("post")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity glow flex items-center gap-2 flex-shrink-0">
            <PlusCircle className="w-4 h-4" /> Post a Skill
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Skills Listed", value: listings.length, icon: List, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Community", value: "8.9k+", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Categories", value: CATEGORIES.length, icon: Grid, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Your Favorites", value: favorites.length, icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trending Categories */}
      {trending.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Trending Categories
          </h3>
          <div className="space-y-3">
            {trending.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80 font-medium">{cat.label}</span>
                    <span className="text-white/40 text-xs">{cat.count} listings</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all`} style={{ width: `${Math.min((cat.count / (trending[0]?.count || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(s => (
            <div key={s.step} className="glass rounded-2xl p-5 border border-white/5 flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested For You */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Suggested For You
          </h3>
          <button onClick={() => onNavigate("explore")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {suggestions.length === 0 ? (
          <EmptyState icon={Compass} title="No suggestions yet" desc="Post a listing to get personalized matches!" action={() => onNavigate("post")} actionLabel="Post Now" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map(l => (
              <SkillCard key={l.id} listing={l} onFavorite={onFavorite} isFavorited={favorites.includes(l.id)}
                onMessage={onMessage} currentUserId={user?.uid} blockedUsers={blockedUsers}
                onViewProfile={setProfileListing} onExchange={onExchange} onShare={onShare} onViewListing={onViewListing} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Recent Listings
            </h3>
            <button onClick={() => onNavigate("explore")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.map(l => (
              <SkillCard key={l.id} listing={l} onFavorite={onFavorite} isFavorited={favorites.includes(l.id)}
                onMessage={onMessage} currentUserId={user?.uid} blockedUsers={blockedUsers}
                onViewProfile={setProfileListing} onExchange={onExchange} onShare={onShare} onViewListing={onViewListing} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" /> Recently Viewed
            </h3>
            <button onClick={() => onNavigate("explore")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Explore more <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {recentlyViewed.slice(0, 10).map(item => {
              const cat = getCat(item.category);
              const CatIcon = cat.icon;
              return (
                <div key={item.id} className="flex-shrink-0 w-48 glass rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${userGrad(item.userId)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {initials(item.userName)}
                    </div>
                    <span className="text-xs font-semibold text-white/70 truncate">{item.userName}</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1 truncate">{item.skillOffered}</p>
                  <p className="text-xs text-indigo-400 mb-2 truncate">Wants: {item.skillWanted}</p>
                  <div className="flex items-center gap-1.5">
                    <CatIcon className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/30">{cat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {profileListing && (
        <UserProfileModal user={profileListing} listings={listings} reviews={reviews}
          onClose={() => setProfileListing(null)} onMessage={onMessage} />
      )}
    </div>
  );
};

// --- EXPLORE PAGE ---
const ExplorePage = ({ listings, favorites, blockedUsers, onFavorite, onMessage, user, showToast, onExchange, onShare, onViewListing }) => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [profileListing, setProfileListing] = useState(null);
  const [reportListing, setReportListing] = useState(null);
  const reviews = [];

  const filtered = useMemo(() => {
    let list = listings.filter(l => !isBlocked(blockedUsers, l.userId));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.skillOffered?.toLowerCase().includes(q) || l.skillWanted?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.userName?.toLowerCase().includes(q));
    }
    if (catFilter !== "all") list = list.filter(l => l.category === catFilter);
    if (sort === "newest") list = [...list].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sort === "oldest") list = [...list].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    if (sort === "popular") list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    return list;
  }, [listings, search, catFilter, sort, blockedUsers]);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Explore Skills</h2>
        <span className="text-sm text-white/40">{filtered.length} listings</span>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills, users..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 transition-colors" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
          <option value="newest" className="bg-[#0f1729]">Newest</option>
          <option value="oldest" className="bg-[#0f1729]">Oldest</option>
          <option value="popular" className="bg-[#0f1729]">Popular</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button onClick={() => setCatFilter("all")}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white/80"}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id === catFilter ? "all" : c.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === c.id ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white/80"}`}>
            <c.icon className="w-3 h-3" /> {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results found" desc={`No listings match "${search}". Try a different search.`} action={() => setSearch("")} actionLabel="Clear Search" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <SkillCard key={l.id} listing={l} onFavorite={onFavorite} isFavorited={favorites.includes(l.id)}
              onMessage={onMessage} currentUserId={user?.uid} blockedUsers={blockedUsers}
              onViewProfile={setProfileListing} onReport={setReportListing} onExchange={onExchange} onShare={onShare} onViewListing={onViewListing} />
          ))}
        </div>
      )}

      {profileListing && <UserProfileModal user={profileListing} listings={listings} reviews={reviews} onClose={() => setProfileListing(null)} onMessage={onMessage} />}
      {reportListing && <ReportModal listing={reportListing} onClose={() => setReportListing(null)} onSubmit={(reason) => { showToast("success", "Report submitted. Thank you!"); setReportListing(null); }} />}
    </div>
  );
};

// --- MESSAGES PAGE ---
const MessagesPage = ({ user, messages, onSendMessage, activeChat, setActiveChat, showToast, isTyping, setIsTyping }) => {
  const [newMsg, setNewMsg] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  // Derive conversations from messages
  const conversations = useMemo(() => {
    if (!user || !messages) return [];
    const convMap = {};
    messages.forEach(m => {
      const partnerId = m.fromUserId === user.uid ? m.toUserId : m.fromUserId;
      const partnerName = m.fromUserId === user.uid ? m.toUserName : m.fromUserName;
      if (!convMap[partnerId] || (m.createdAt?.seconds || 0) > (convMap[partnerId].lastMsg?.createdAt?.seconds || 0)) {
        const unread = messages.filter(msg => msg.fromUserId === partnerId && msg.toUserId === user.uid && !msg.read).length;
        convMap[partnerId] = { uid: partnerId, name: partnerName, lastMsg: m, unread };
      }
    });
    return Object.values(convMap).sort((a, b) => (b.lastMsg?.createdAt?.seconds || 0) - (a.lastMsg?.createdAt?.seconds || 0));
  }, [messages, user]);

  const chatMessages = useMemo(() => {
    if (!activeChat || !user) return [];
    return messages.filter(m =>
      (m.fromUserId === user.uid && m.toUserId === activeChat.uid) ||
      (m.fromUserId === activeChat.uid && m.toUserId === user.uid)
    ).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }, [messages, activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!newMsg.trim() || !activeChat) return;
    setIsTyping?.(false);
    onSendMessage(activeChat, newMsg.trim());
    setNewMsg("");
  };

  const handleTyping = (value) => {
    setNewMsg(value);
    if (value.trim() && !isTyping) setIsTyping?.(true);
    if (!value.trim() && isTyping) setIsTyping?.(false);
  };

  const filteredConvos = conversations.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  const getMessageDateLabel = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today - 86400000);
    if (date >= today) return "Today";
    if (date >= yesterday) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] flex rounded-2xl overflow-hidden glass border border-white/5">
      {/* Conversation List */}
      <div className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 border-r border-white/5`}>
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white mb-3">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredConvos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-10 h-10 text-white/15 mb-3" />
              <p className="text-sm text-white/40">No conversations yet</p>
              <p className="text-xs text-white/25 mt-1">Message a skill lister to get started</p>
            </div>
          ) : filteredConvos.map(conv => (
            <button key={conv.uid} onClick={() => setActiveChat(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-left ${activeChat?.uid === conv.uid ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""}`}>
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(conv.uid)} flex items-center justify-center text-xs font-bold text-white`}>
                  {initials(conv.name)}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#020617]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white truncate">{conv.name}</span>
                  <span className="text-xs text-white/30 flex-shrink-0">{timeAgo(conv.lastMsg?.createdAt)}</span>
                </div>
                <p className="text-xs text-white/40 truncate">{trunc(conv.lastMsg?.text, 35)}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass">
            <button onClick={() => setActiveChat(null)} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(activeChat.uid)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
              {initials(activeChat.name)}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{activeChat.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${userGrad(activeChat.uid)} flex items-center justify-center text-xl font-bold text-white mb-3`}>
                  {initials(activeChat.name)}
                </div>
                <p className="font-semibold text-white">{activeChat.name}</p>
                <p className="text-sm text-white/40 mt-1">Start the conversation!</p>
              </div>
            )}
            {chatMessages.map((m, i) => {
              const isMine = m.fromUserId === user?.uid;
              const prevMsg = chatMessages[i - 1];
              const showDateSep = i === 0 || getMessageDateLabel(m.createdAt) !== getMessageDateLabel(prevMsg?.createdAt);
              return (
                <div key={i}>
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-xs text-white/30 font-medium">{getMessageDateLabel(m.createdAt)}</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                  )}
                  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm" : "glass border border-white/10 text-white/80 rounded-bl-sm"}`}>
                      <p className="leading-relaxed">{m.text}</p>
                      <div className={`flex items-center gap-1.5 mt-1 ${isMine ? "justify-end" : ""}`}>
                        <p className={`text-xs ${isMine ? "text-white/60" : "text-white/30"}`}>{timeAgo(m.createdAt)}</p>
                        {isMine && (
                          <span className="text-indigo-200">
                            {m.read ? <CheckCircle className="w-3 h-3 text-indigo-200" /> : <Check className="w-3 h-3 text-white/40" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2 glass rounded-2xl border border-white/10 p-2">
              <input value={newMsg} onChange={e => handleTyping(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none px-2" />
              <button onClick={handleSend} disabled={!newMsg.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-center">
          <div>
            <MessageCircle className="w-14 h-14 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- POST PAGE ---
const PostPage = ({ user, userData, onSubmit, editingListing, onCancelEdit, showToast, listings }) => {
  const [form, setForm] = useState({
    skillOffered: "", skillWanted: "", category: "tech", description: "",
    contactInfo: "", tags: "", imageUrl: "", skillLevel: "Beginner",
    exchangeType: "Online", availability: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingListing) {
      setForm({
        skillOffered: editingListing.skillOffered || "",
        skillWanted: editingListing.skillWanted || "",
        category: editingListing.category || "tech",
        description: editingListing.description || "",
        contactInfo: editingListing.contactInfo || "",
        tags: (editingListing.tags || []).join(", "),
        imageUrl: editingListing.imageUrl || "",
        skillLevel: editingListing.skillLevel || "Beginner",
        exchangeType: editingListing.exchangeType || "Online",
        availability: editingListing.availability || "",
      });
    }
  }, [editingListing]);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("skillswap_draft");
    if (saved && !editingListing) {
      try { setForm(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!editingListing) localStorage.setItem("skillswap_draft", JSON.stringify(form));
  }, [form, editingListing]);

  const validate = () => {
    const e = {};
    if (!form.skillOffered.trim()) e.skillOffered = "Required";
    if (!form.skillWanted.trim()) e.skillWanted = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      await onSubmit(data, editingListing?.id);
      showToast("success", editingListing ? "Listing updated!" : "Listing posted!");
      setForm({ skillOffered: "", skillWanted: "", category: "tech", description: "", contactInfo: "", tags: "", imageUrl: "", skillLevel: "Beginner", exchangeType: "Online", availability: "" });
      localStorage.removeItem("skillswap_draft");
    } catch (err) { showToast("error", "Failed to save listing."); }
    setLoading(false);
  };

  const inputClass = (field) => `w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${errors[field] ? "border-red-500/50" : "border-white/10 focus:border-indigo-500"}`;

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">{editingListing ? "Edit Listing" : "Post a Skill"}</h2>
          <p className="text-white/40 text-sm mt-1">Share what you offer and what you need</p>
        </div>
        {editingListing && (
          <button onClick={onCancelEdit} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        {/* Skill Offered / Wanted */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Skill I'm Offering *</label>
            <input value={form.skillOffered} onChange={e => setForm(f => ({ ...f, skillOffered: e.target.value }))} placeholder="e.g. React Development"
              className={inputClass("skillOffered")} />
            {errors.skillOffered && <p className="text-xs text-red-400 mt-1">{errors.skillOffered}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Skill I Want *</label>
            <input value={form.skillWanted} onChange={e => setForm(f => ({ ...f, skillWanted: e.target.value }))} placeholder="e.g. UI/UX Design"
              className={inputClass("skillWanted")} />
            {errors.skillWanted && <p className="text-xs text-red-400 mt-1">{errors.skillWanted}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
            {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#0f1729]">{c.label}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Description *</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe your skill, experience level, and what you're looking for..."
            className={`${inputClass("description")} resize-none h-28`} />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>

        {/* Skill Level & Exchange Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Skill Level</label>
            <div className="flex gap-2">
              {SKILL_LEVELS.map(lvl => (
                <button key={lvl} onClick={() => setForm(f => ({ ...f, skillLevel: lvl }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${form.skillLevel === lvl ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "glass border-white/10 text-white/40 hover:text-white/70"}`}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Exchange Type</label>
            <div className="flex gap-2">
              {EXCHANGE_TYPES.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, exchangeType: t }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${form.exchangeType === t ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "glass border-white/10 text-white/40 hover:text-white/70"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="react, frontend, javascript"
            className={inputClass("tags")} />
        </div>

        {/* Image URL */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Image URL (optional)</label>
          <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..."
            className={inputClass("imageUrl")} />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-white/10" onError={e => e.target.style.display = "none"} />
          )}
        </div>

        {/* Contact Info */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Contact Info (optional)</label>
          <input value={form.contactInfo} onChange={e => setForm(f => ({ ...f, contactInfo: e.target.value }))} placeholder="Twitter, WhatsApp, email..."
            className={inputClass("contactInfo")} />
        </div>

        {/* Availability */}
        <div>
          <label className="text-xs font-semibold text-white/50 mb-1.5 block uppercase tracking-wide">Availability</label>
          <input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} placeholder="e.g. Weekends, evenings after 6pm"
            className={inputClass("availability")} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          {loading ? "Saving..." : editingListing ? "Update Listing" : "Post Listing"}
        </button>
      </div>
    </div>
  );
};

// --- FAVORITES PAGE ---
const FavoritesPage = ({ listings, favorites, blockedUsers, onFavorite, onMessage, user, onExchange, onShare, onViewListing }) => {
  const [catFilter, setCatFilter] = useState("all");
  const favListings = listings.filter(l => favorites.includes(l.id) && !isBlocked(blockedUsers, l.userId));
  const filtered = catFilter === "all" ? favListings : favListings.filter(l => l.category === catFilter);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Favorites</h2>
        <span className="text-sm text-white/40">{favListings.length} saved</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setCatFilter("all")} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white/80"}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id === catFilter ? "all" : c.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === c.id ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white/80"}`}>
            {c.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" desc="Tap the heart icon on any skill listing to save it here." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <SkillCard key={l.id} listing={l} onFavorite={onFavorite} isFavorited={true}
              onMessage={onMessage} currentUserId={user?.uid} blockedUsers={blockedUsers} onExchange={onExchange} onShare={onShare} onViewListing={onViewListing} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MY LISTINGS PAGE ---
const MyListingsPage = ({ user, listings, onEdit, onDelete, reviews }) => {
  const [sort, setSort] = useState("newest");
  const myListings = useMemo(() => {
    let list = listings.filter(l => l.userId === user?.uid);
    if (sort === "newest") list = [...list].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sort === "views") list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    return list;
  }, [listings, user, sort]);
  const myReviews = reviews.filter(r => r.toUserId === user?.uid);
  const avgRating = myReviews.length ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1) : 0;

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">My Listings</h2>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
          <option value="newest" className="bg-[#0f1729]">Newest</option>
          <option value="views" className="bg-[#0f1729]">Most Viewed</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Listings", value: myListings.length, icon: List, color: "text-indigo-400" },
          { label: "Reviews", value: myReviews.length, icon: Star, color: "text-amber-400" },
          { label: "Avg Rating", value: avgRating || "—", icon: Award, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center border border-white/5">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {myListings.length === 0 ? (
        <EmptyState icon={PlusCircle} title="No listings yet" desc="Post your first skill to start exchanging!" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map(l => (
            <div key={l.id} className="relative group">
              <div className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{l.skillOffered}</h3>
                    <p className="text-xs text-indigo-400">Wants: {l.skillWanted}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(l)} className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(l)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/40 mb-3">{trunc(l.description, 80)}</p>
                <div className="flex items-center gap-3 text-xs text-white/30 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views || 0} views</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{l.favorites || 0}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(l.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- LEADERBOARD PAGE ---
const LeaderboardPage = ({ listings, reviews, currentUserId }) => {
  const [period, setPeriod] = useState("all");
  const board = useMemo(() => leaderboardData(listings, reviews), [listings, reviews]);
  const podiumColors = ["from-amber-400 to-yellow-400", "from-slate-400 to-gray-300", "from-amber-700 to-amber-600"];
  const podiumIcons = [<Crown className="w-4 h-4" />, <Star className="w-4 h-4" />, <Award className="w-4 h-4" />];

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-400" /> Leaderboard</h2>
        <div className="flex glass rounded-xl border border-white/10 p-1 gap-1">
          {["all", "weekly", "monthly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${period === p ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "text-white/40 hover:text-white/70"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {board.length >= 3 && (
        <div className="flex items-end justify-center gap-3 py-4">
          {[board[1], board[0], board[2]].map((u, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const heights = ["h-24", "h-32", "h-20"];
            return (
              <div key={u.uid} className={`flex flex-col items-center gap-2 flex-1 max-w-28 ${heights[i]}`}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGrad(u.uid)} flex items-center justify-center font-bold text-sm text-white border-2 border-${actualRank === 1 ? "amber" : actualRank === 2 ? "slate" : "amber"}-400/50 shadow-xl`}>
                  {initials(u.name)}
                </div>
                <span className="text-xs font-semibold text-white/70 text-center truncate w-full text-center">{u.name?.split(" ")[0]}</span>
                <div className={`w-full flex-1 rounded-t-2xl bg-gradient-to-b ${podiumColors[i]} flex flex-col items-center justify-start pt-3 gap-1`}>
                  <span className="text-white font-black text-lg">#{actualRank}</span>
                  {podiumIcons[i]}
                  <span className="text-white/80 text-xs font-semibold">{u.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {board.map((u, i) => (
            <div key={u.uid} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${u.uid === currentUserId ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""}`}>
              <span className={`w-7 text-center font-black text-sm ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-white/30"}`}>
                #{i + 1}
              </span>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(u.uid)} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                {initials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{u.name}</p>
                <p className={`text-xs ${userTitle(u.score).color}`}>{userTitle(u.score).label}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-bold text-white">{u.listings}</div>
                  <div className="text-xs text-white/30">Listings</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-bold text-white">{u.reviews}</div>
                  <div className="text-xs text-white/30">Reviews</div>
                </div>
                <TrustRing score={u.score} size={48} />
              </div>
            </div>
          ))}
          {board.length === 0 && (
            <div className="p-10 text-center text-white/30">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No rankings yet. Post a listing to join!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PROFILE PAGE ---
const ProfilePage = ({ user, userData, listings, reviews, favorites, messages, onUpdateProfile, onSignOut, showToast }) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(userData?.bio || "");
  const [displayName, setDisplayName] = useState(userData?.displayName || user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const myListings = listings.filter(l => l.userId === user?.uid);
  const myReviews = reviews.filter(r => r.toUserId === user?.uid);
  const avgRating = myReviews.length ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0;
  const score = trustScore(myListings.length, myReviews.length, avgRating);
  const title = userTitle(score);
  const myMessages = messages.filter(m => m.fromUserId === user?.uid);
  const streak = userData?.streak || 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile({ bio, displayName });
      setEditing(false);
      showToast("success", "Profile updated!");
    } catch { showToast("error", "Failed to update profile."); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/5 blur-2xl" />
        <div className="relative flex items-start gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${userGrad(user?.uid)} flex items-center justify-center text-2xl font-black text-white shadow-xl border-2 border-white/10 flex-shrink-0`}>
            {initials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                {editing ? (
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    className="bg-white/5 border border-indigo-500/50 rounded-xl px-3 py-1.5 text-white font-bold text-lg focus:outline-none w-full mb-1" />
                ) : (
                  <h2 className="text-xl font-black text-white">{displayName || "Anonymous"}</h2>
                )}
                <p className={`text-sm font-semibold ${title.color}`}>{title.label}</p>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 glass border border-white/10 text-white/60 hover:text-white/90 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditing(false)} className="glass border border-white/10 text-white/40 px-3 py-1.5 rounded-xl text-xs font-semibold">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                  </button>
                </div>
              )}
            </div>
            <RatingStars rating={Math.round(avgRating)} />
            <p className="text-xs text-white/30 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 pt-4 border-t border-white/5">
          {editing ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write something about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 resize-none h-20" />
          ) : (
            <p className="text-sm text-white/50 leading-relaxed">{bio || "No bio yet. Click Edit to add one."}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Listings", value: myListings.length, icon: List },
          { label: "Reviews", value: myReviews.length, icon: Star },
          { label: "Favorites", value: favorites.length, icon: Heart },
          { label: "Messages", value: myMessages.length, icon: MessageCircle },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center border border-white/5">
            <s.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trust Score */}
      <div className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-5">
        <TrustRing score={score} size={72} />
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">Trust Score</h3>
          <p className="text-sm text-white/50 mb-2">Based on listings, reviews, and ratings</p>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Badges</h3>
        <BadgesRow score={score} listingsCount={myListings.length} reviewsCount={myReviews.length} favoritesCount={favorites.length} messagesCount={myMessages.length} streak={streak} />
      </div>

      {/* Activity Heatmap */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-400" /> Activity</h3>
        <Heatmap activityLog={userData?.activityLog || {}} />
      </div>

      {/* Reviews */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Reviews ({myReviews.length})</h3>
        {myReviews.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {myReviews.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${userGrad(r.fromUserId)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {initials(r.fromUserName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{r.fromUserName}</span>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="text-xs text-white/50 mt-1">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(a => {
            const progress = Math.min(
              a.id === "a2" ? myListings.length :
              a.id === "a4" ? myMessages.length :
              a.id === "a7" ? myListings.length :
              a.id === "a8" ? myReviews.length :
              a.id === "a10" ? score : 1,
              a.goal
            );
            const unlocked = progress >= a.goal;
            return (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${unlocked ? "bg-indigo-500/10 border-indigo-500/20" : "bg-white/3 border-white/5"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${unlocked ? "bg-gradient-to-br from-indigo-500 to-purple-500" : "bg-white/5"}`}>
                  <a.icon className={`w-5 h-5 ${unlocked ? "text-white" : "text-white/25"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${unlocked ? "text-white" : "text-white/50"}`}>{a.title}</span>
                    <span className="text-xs text-white/30">{progress}/{a.goal}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${unlocked ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-white/20"}`} style={{ width: `${(progress / a.goal) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-5 border border-red-500/10">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400" /> Account</h3>
        <button onClick={onSignOut}
          className="flex items-center gap-2 bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

// --- ANALYTICS PAGE ---
const AnalyticsPage = ({ user, listings, messages, reviews, showToast }) => {
  const myListings = listings.filter(l => l.userId === user?.uid);
  const myMessages = messages.filter(m => m.fromUserId === user?.uid);
  const myReviews = reviews.filter(r => r.toUserId === user?.uid);
  const totalViews = myListings.reduce((s, l) => s + (l.views || 0), 0);
  const topListing = myListings.sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  const responseRate = myMessages.length > 0 ? Math.round((myMessages.length / Math.max(myMessages.length + 2, 1)) * 100) : 0;

  const catDist = useMemo(() => {
    const counts = {};
    myListings.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1; });
    return Object.entries(counts).map(([id, count]) => ({ ...getCat(id), count })).sort((a, b) => b.count - a.count);
  }, [myListings]);

  const weeklyActivity = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(d => ({ day: d, value: Math.floor(Math.random() * 8) }));
  }, []);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Analytics</h2>
        <button onClick={() => showToast("info", "Export feature coming soon!")}
          className="flex items-center gap-1.5 glass border border-white/10 text-white/60 hover:text-white/90 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: totalViews, icon: Eye, change: "+12%", color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Messages Sent", value: myMessages.length, icon: MessageCircle, change: "+5%", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Reviews Received", value: myReviews.length, icon: Star, change: "+8%", color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Response Rate", value: `${responseRate}%`, icon: Zap, change: "—", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-white/40">{s.label}</span>
              <span className="text-xs text-emerald-400">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Performance Bar Chart */}
      {myListings.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-bold text-white mb-5 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-indigo-400" /> Listing Performance</h3>
          <div className="space-y-3">
            {myListings.slice(0, 6).map(l => (
              <div key={l.id} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-28 truncate flex-shrink-0">{l.skillOffered}</span>
                <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max(((l.views || 0) / Math.max(totalViews, 1)) * 100, 4)}%` }}>
                    <span className="text-xs text-white/70 font-semibold">{l.views || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {catDist.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-bold text-white mb-5 flex items-center gap-2"><Grid className="w-4 h-4 text-purple-400" /> Category Distribution</h3>
          <div className="grid grid-cols-2 gap-3">
            {catDist.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-white/80">{c.label}</span>
                    <span className="text-xs text-white/40">{c.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-1">
                    <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${(c.count / (catDist[0]?.count || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Activity Trend */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Activity</h3>
        <div className="flex items-end gap-2 h-32">
          {weeklyActivity.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end justify-center">
                <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.max((d.value / 8) * 100, 8)}%` }} />
              </div>
              <span className="text-xs text-white/30">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Listing */}
      {topListing && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown className="w-4 h-4 text-amber-400" /> Top Performing Listing</h3>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCat(topListing.category).color} flex items-center justify-center flex-shrink-0`}>
              {(() => { const C = getCat(topListing.category).icon; return <C className="w-6 h-6 text-white" />; })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white">{topListing.skillOffered}</p>
              <p className="text-sm text-indigo-400">Wants: {topListing.skillWanted}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-white">{topListing.views || 0}</div>
              <div className="text-xs text-white/40">Views</div>
            </div>
          </div>
        </div>
      )}

      {myListings.length === 0 && (
        <EmptyState icon={BarChart2} title="No data yet" desc="Post a listing to start seeing analytics!" />
      )}
    </div>
  );
};

// ============================================================
// SECTION 10: LAYOUT COMPONENTS
// ============================================================

// --- Header ---
const Header = ({ user, userData, listings, notifications, onNotifMarkAll, currentPage, onNavigate, searchQuery, onSearch, darkMode, onToggleDark, onSignOut, onOpenSettings, onToggleShortcuts }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const title = userTitle(trustScore(listings.filter(l => l.userId === user?.uid).length, 0, 0));

  return (
    <header className="glass border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 mr-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow-sm">
            <HeartHandshake className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-white hidden sm:block text-sm">SkillSwap</span>
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={searchQuery} onChange={e => onSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 transition-colors" />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Keyboard shortcuts */}
          <button onClick={onToggleShortcuts} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/30 hover:text-white/70" title="Keyboard Shortcuts (Ctrl+/)">
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button onClick={onOpenSettings} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/40 hover:text-white/80" title="Settings">
            <Settings className="w-4 h-4" />
          </button>

          {/* Dark mode toggle */}
          <button onClick={onToggleDark} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/40 hover:text-white/80">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="relative p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white/90">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#020617]" />
              )}
            </button>
            {showNotifs && (
              <NotifPanel notifications={notifications} onClose={() => setShowNotifs(false)} onMarkAll={onNotifMarkAll} />
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className={`w-8 h-8 rounded-xl bg-gradient-to-br ${userGrad(user?.uid)} flex items-center justify-center text-xs font-bold text-white`}>
              {initials(userData?.displayName || user?.displayName || "?")}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 w-48 glass-strong rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-bold text-white truncate">{userData?.displayName || user?.displayName || "Anonymous"}</p>
                  <p className={`text-xs ${title.color}`}>{title.label}</p>
                </div>
                {[
                  { label: "Profile", icon: User, page: "profile" },
                  { label: "My Listings", icon: List, page: "mylistings" },
                  { label: "Analytics", icon: BarChart2, page: "analytics" },
                ].map(item => (
                  <button key={item.page} onClick={() => { onNavigate(item.page); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left">
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button onClick={onSignOut} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Sidebar ---
const Sidebar = ({ currentPage, onNavigate, user, listings, messages, notifications }) => {
  const unread = messages.filter(m => m.toUserId === user?.uid && !m.read).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <aside className="hidden md:flex flex-col w-56 glass border-r border-white/5 min-h-screen sticky top-14 p-3 gap-1">
      {NAV_ITEMS.map(item => {
        const isActive = currentPage === item.id;
        const badge = item.id === "messages" ? unread : 0;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${isActive ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
            <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-400" : "group-hover:text-indigo-400 transition-colors"}`} />
            <span className="text-sm font-semibold flex-1">{item.label}</span>
            {badge > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">{badge}</span>
            )}
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </button>
        );
      })}
    </aside>
  );
};

// --- Bottom Nav ---
const BottomNav = ({ currentPage, onNavigate, messages, user }) => {
  const unread = messages.filter(m => m.toUserId === user?.uid && !m.read).length;
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-40">
      <div className="flex items-center h-16 px-2">
        {MOBILE_NAV.map(item => {
          const isActive = currentPage === item.id;
          const badge = item.id === "messages" ? unread : 0;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all ${isActive ? "text-indigo-400" : "text-white/30 hover:text-white/60"}`}>
              <div className={`relative ${item.id === "post" ? "w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow-sm -translate-y-2" : ""}`}>
                <item.icon className={`${item.id === "post" ? "w-5 h-5 text-white" : "w-5 h-5"}`} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">{badge}</span>
                )}
              </div>
              {item.id !== "post" && <span className="text-xs font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ============================================================
// SECTION 11: MAIN APP COMPONENT
// ============================================================
export default function App() {
  // Auth & User
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation
  const [currentPage, setCurrentPage] = useState("landing");

  // Data
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // User preferences
  const [favorites, setFavorites] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [exchangeTarget, setExchangeTarget] = useState(null);

  // Phase 1: New UI states
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("skillswap_welcomed"));
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recentlyViewed from userData when available
  useEffect(() => {
    if (userData?.recentlyViewed) {
      setRecentlyViewed(userData.recentlyViewed);
    }
  }, [userData?.recentlyViewed]);

  const showToast = useCallback((type, message) => setToast({ type, message }), []);
  const navigateTo = useCallback((page) => { setCurrentPage(page); window.scrollTo(0, 0); }, []);

  // Scroll listener
  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            document.querySelector("header input")?.focus();
            break;
          case "n":
            e.preventDefault();
            navigateTo("post");
            break;
          case "m":
            e.preventDefault();
            navigateTo("messages");
            break;
          case "f":
            e.preventDefault();
            navigateTo("favorites");
            break;
          case "/":
            e.preventDefault();
            setShowShortcuts(s => !s);
            break;
        }
      }
      if (e.key === "Escape") {
        if (showShortcuts) setShowShortcuts(false);
        if (showSettings) setShowSettings(false);
        if (showWelcome) setShowWelcome(false);
        setFabOpen(false);
      }
      // Number key navigation (1-9)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (idx < NAV_ITEMS.length && !e.target.closest("input, textarea, select")) {
          navigateTo(NAV_ITEMS[idx].id);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showShortcuts, showSettings, showWelcome, navigateTo]);

  // Confetti auto-dismiss
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  // Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);
            setFavorites(data.favorites || []);
            setBlockedUsers(data.blockedUsers || []);
          } else {
            const newUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || "Anonymous",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              bio: "",
              blockedUsers: [],
              favorites: [],
              recentlyViewed: [],
              activityLog: {},
              createdAt: serverTimestamp(),
              streak: 0,
            };
            await setDoc(userRef, newUser);
            setUserData(newUser);
          }
          // Update activity log
          const today = todayKey();
          await updateDoc(doc(db, "users", firebaseUser.uid), {
            [`activityLog.${today}`]: increment(1)
          }).catch(() => {});
        } catch (err) { console.error("User doc error:", err); }
        setCurrentPage("home");
      } else {
        setUser(null);
        setUserData(null);
        setCurrentPage("landing");
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setListings([...MOCK_LISTINGS, ...data]);
    }, () => setListings(MOCK_LISTINGS));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const qSent = query(collection(db, "messages"), where("fromUserId", "==", user.uid), orderBy("createdAt", "desc"), limit(200));
    const qRecv = query(collection(db, "messages"), where("toUserId", "==", user.uid), orderBy("createdAt", "desc"), limit(200));
    let allMsgs = {};
    const merge = (msgs) => setMessages(Object.values({ ...allMsgs, ...msgs.reduce((a, m) => ({ ...a, [m.id]: m }), {}) }));
    const u1 = onSnapshot(qSent, snap => { snap.docs.forEach(d => { allMsgs[d.id] = { id: d.id, ...d.data() }; }); merge({}); }, () => {});
    const u2 = onSnapshot(qRecv, snap => { snap.docs.forEach(d => { allMsgs[d.id] = { id: d.id, ...d.data() }; }); merge({}); }, () => {});
    return () => { u1(); u2(); };
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(200));
    const unsub = onSnapshot(q, snap => setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => {});
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(30));
    const unsub = onSnapshot(q, snap => setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => {});
    return () => unsub();
  }, [user]);

  // Auth Handlers
  const handleLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
  };

  const handleGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleAnon = async () => {
    await signInAnonymously(auth);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentPage("landing");
    showToast("info", "Signed out successfully.");
  };

  // Listing Handlers
  const handleSubmitListing = async (data, editId) => {
    if (!user) return;
    if (editId) {
      await updateDoc(doc(db, "listings", editId), { ...data, updatedAt: serverTimestamp() });
      setEditingListing(null);
      navigateTo("mylistings");
    } else {
      await addDoc(collection(db, "listings"), {
        ...data, userId: user.uid, userName: userData?.displayName || user.displayName || "Anonymous",
        createdAt: serverTimestamp(), views: 0, favorites: 0,
      });
      await addDoc(collection(db, "notifications"), {
        userId: user.uid, message: `Your listing "${data.skillOffered}" was posted!`,
        link: "mylistings", read: false, createdAt: serverTimestamp()
      }).catch(() => {});
      navigateTo("mylistings");
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteTarget) return;
    try {
      if (!deleteTarget.id.startsWith("demo")) {
        await deleteDoc(doc(db, "listings", deleteTarget.id));
      }
      showToast("success", "Listing deleted.");
    } catch { showToast("error", "Failed to delete."); }
    setDeleteTarget(null);
  };

  const handleFavorite = async (listingId) => {
    if (!user) { showToast("warning", "Please sign in to save favorites."); return; }
    const newFavs = favorites.includes(listingId) ? favorites.filter(f => f !== listingId) : [...favorites, listingId];
    setFavorites(newFavs);
    try { await updateDoc(doc(db, "users", user.uid), { favorites: newFavs }); } catch {}
    // Update listing favorites count
    if (!listingId.startsWith("demo")) {
      try {
        await updateDoc(doc(db, "listings", listingId), { favorites: increment(favorites.includes(listingId) ? -1 : 1) });
      } catch {}
    }
  };

  const handleMessage = async (listingOrUser) => {
    if (!user) { showToast("warning", "Please sign in to send messages."); return; }
    const partnerId = listingOrUser.userId || listingOrUser.uid;
    const partnerName = listingOrUser.userName || listingOrUser.name;
    if (partnerId === user.uid) { showToast("info", "You can't message yourself!"); return; }
    setActiveChat({ uid: partnerId, name: partnerName });
    navigateTo("messages");
  };

  const handleSendMessage = async (partner, text) => {
    if (!user || !text.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        fromUserId: user.uid,
        fromUserName: userData?.displayName || user.displayName || "Anonymous",
        toUserId: partner.uid,
        toUserName: partner.name,
        text: text.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (err) { showToast("error", "Failed to send message."); }
  };

  const handleUpdateProfile = async (updates) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), updates);
    setUserData(prev => ({ ...prev, ...updates }));
    if (updates.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }
  };

  const handleMarkAllNotifs = async () => {
    const batch = notifications.filter(n => !n.read);
    for (const n of batch) {
      try { await updateDoc(doc(db, "notifications", n.id), { read: true }); } catch {}
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) navigateTo("explore");
  };

  // Phase 1: Share listing
  const handleShareListing = async (listing) => {
    const text = `SkillSwap: ${listing.skillOffered} (offered) ↔ ${listing.skillWanted} (wanted) by ${listing.userName}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("success", "Listing copied to clipboard!");
    } catch {
      showToast("error", "Failed to copy to clipboard.");
    }
  };

  // Phase 1: View listing (add to recentlyViewed)
  const handleViewListing = useCallback(async (listing) => {
    if (!user) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(l => l.id !== listing.id);
      const updated = [{ id: listing.id, userId: listing.userId, userName: listing.userName, skillOffered: listing.skillOffered, skillWanted: listing.skillWanted, category: listing.category, viewedAt: Date.now() }, ...filtered].slice(0, 20);
      // Save to Firestore
      if (user) {
        updateDoc(doc(db, "users", user.uid), { recentlyViewed: updated }).catch(() => {});
      }
      return updated;
    });
  }, [user]);

  // Phase 1: Open settings
  const handleOpenSettings = () => setShowSettings(true);

  // Phase 1: Toggle keyboard shortcuts
  const handleToggleShortcuts = () => setShowShortcuts(s => !s);

  // Loading State
  if (authLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow animate-pulse">
          <HeartHandshake className="w-7 h-7 text-white" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );

  // Pre-auth pages
  if (!user) {
    if (currentPage === "login") return <LoginPage onLogin={handleLogin} onGoogle={handleGoogle} onSignup={() => setCurrentPage("signup")} onAnon={handleAnon} showToast={showToast} />;
    if (currentPage === "signup") return <SignupPage onSignup={handleSignup} onGoogle={handleGoogle} onLogin={() => setCurrentPage("login")} />;
    return <LandingPage onGetStarted={() => setCurrentPage("signup")} onLogin={() => setCurrentPage("login")} />;
  }

  // Render current page content
  const renderPage = () => {
    const props = { user, userData, listings, favorites, blockedUsers, reviews, messages, onFavorite: handleFavorite, onMessage: handleMessage, onNavigate: navigateTo, showToast, onExchange: setExchangeTarget, onShare: handleShareListing, onViewListing: handleViewListing, onOpenSettings: handleOpenSettings };
    switch (currentPage) {
      case "home": return <HomePage {...props} recentlyViewed={recentlyViewed} />;
      case "explore": return <ExplorePage {...props} searchQuery={searchQuery} />;
      case "messages": return <MessagesPage user={user} messages={messages} onSendMessage={handleSendMessage} activeChat={activeChat} setActiveChat={setActiveChat} showToast={showToast} isTyping={isTyping} setIsTyping={setIsTyping} />;
      case "post": return <PostPage user={user} userData={userData} onSubmit={handleSubmitListing} editingListing={editingListing} onCancelEdit={() => { setEditingListing(null); navigateTo("mylistings"); }} showToast={showToast} listings={listings} />;
      case "favorites": return <FavoritesPage {...props} />;
      case "mylistings": return <MyListingsPage user={user} listings={listings} reviews={reviews} onEdit={(l) => { setEditingListing(l); navigateTo("post"); }} onDelete={(l) => setDeleteTarget(l)} />;
      case "leaderboard": return <LeaderboardPage listings={listings} reviews={reviews} currentUserId={user?.uid} />;
      case "profile": return <ProfilePage {...props} onUpdateProfile={handleUpdateProfile} onSignOut={handleSignOut} />;
      case "analytics": return <AnalyticsPage user={user} listings={listings} messages={messages} reviews={reviews} showToast={showToast} />;
      default: return <HomePage {...props} recentlyViewed={recentlyViewed} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#020617] ${darkMode ? "" : "brightness-110"}`}>
      <Header
        user={user} userData={userData} listings={listings}
        notifications={notifications} onNotifMarkAll={handleMarkAllNotifs}
        currentPage={currentPage} onNavigate={navigateTo}
        searchQuery={searchQuery} onSearch={handleSearch}
        darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
        onSignOut={handleSignOut}
        onOpenSettings={handleOpenSettings}
        onToggleShortcuts={handleToggleShortcuts}
      />

      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={navigateTo} user={user} listings={listings} messages={messages} notifications={notifications} />
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-8 max-w-full">
          {renderPage()}
        </main>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={navigateTo} messages={messages} user={user} />

      {/* Modals */}
      {deleteTarget && <DeleteModal onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteListing} />}
      {exchangeTarget && (
        <ExchangeModal listing={exchangeTarget} onClose={() => setExchangeTarget(null)}
          onSend={async (msg) => {
            await handleSendMessage({ uid: exchangeTarget.userId, name: exchangeTarget.userName }, msg);
            showToast("success", "Exchange proposal sent!");
            setExchangeTarget(null);
          }} />
      )}

      {/* Phase 1: Welcome Modal */}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* Phase 1: Settings Modal */}
      {showSettings && <SettingsModal user={user} userData={userData} onUpdateProfile={handleUpdateProfile} onSignOut={handleSignOut} onClose={() => setShowSettings(false)} showToast={showToast} />}

      {/* Phase 1: Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay show={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Phase 1: Confetti Effect */}
      <ConfettiEffect show={showConfetti} />

      {/* Phase 1: Floating Action Button */}
      <FloatingActionButton
        currentPage={currentPage}
        fabOpen={fabOpen}
        onToggleFab={() => setFabOpen(f => !f)}
        onPost={() => navigateTo("post")}
        onSearch={() => navigateTo("explore")}
        onFavorites={() => navigateTo("favorites")}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Scroll to Top */}
      <ScrollToTop show={showScroll} />

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .page-enter { animation: slide-up 0.25s ease-out; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .glass-strong { background: rgba(255,255,255,0.07); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .glow { box-shadow: 0 0 25px rgba(99,102,241,0.45); }
        .glow-sm { box-shadow: 0 0 14px rgba(99,102,241,0.3); }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 99px; }
      `}</style>
    </div>
  );
}
