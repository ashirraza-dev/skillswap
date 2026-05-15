// ============================================================
// SKILLSWAP — BARTER EXCHANGE APP
// Complete App.jsx — PART 1 of 2
// React 18 + Vite 6 + Tailwind CSS 3 + Firebase
// ============================================================

// SECTION 1: IMPORTS
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ArrowRight, ArrowLeft, Star, Heart, MessageCircle, Send, Search, Bell, Menu, X, Home,
  Compass, PlusCircle, Bookmark, List, Trophy, User, BarChart3, LogOut, ChevronDown,
  ChevronRight, Eye, Clock, Filter, SortAsc, TrendingUp, Shield, Award, Flame, Zap,
  Globe, MapPin, Calendar, Tag, Users, ThumbsUp, ThumbsDown, Flag, Trash2, Edit3,
  Copy, Share2, CheckCircle, XCircle, AlertCircle, Info, AlertTriangle, Upload,
  Camera, Image, ChevronUp, Settings, Lock, Moon, Sun, ExternalLink, RefreshCw,
  Activity, Target, Gift, Crown, Medal, Sparkles, Brain, Handshake, Mic, Code, Palette,
  Music, BookOpen, Dumbbell, ChefHat, Languages, CameraIcon, Film, PenTool, Lightbulb
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile
} from 'firebase/auth';
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc,
  deleteDoc, onSnapshot, query, where, orderBy, limit, serverTimestamp, arrayUnion,
  arrayRemove, increment
} from 'firebase/firestore';

// SECTION 2: FIREBASE CONFIG
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

// SECTION 3: CONSTANTS

const CATEGORIES = [
  { id: 'programming', name: 'Programming', icon: Code, color: 'from-blue-500 to-cyan-400' },
  { id: 'design', name: 'Design', icon: Palette, color: 'from-pink-500 to-rose-400' },
  { id: 'music', name: 'Music', icon: Music, color: 'from-purple-500 to-violet-400' },
  { id: 'writing', name: 'Writing', icon: PenTool, color: 'from-amber-500 to-yellow-400' },
  { id: 'photography', name: 'Photography', icon: CameraIcon, color: 'from-teal-500 to-emerald-400' },
  { id: 'video', name: 'Video Production', icon: Film, color: 'from-red-500 to-orange-400' },
  { id: 'languages', name: 'Languages', icon: Languages, color: 'from-indigo-500 to-blue-400' },
  { id: 'cooking', name: 'Cooking', icon: ChefHat, color: 'from-orange-500 to-amber-400' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'from-green-500 to-lime-400' },
  { id: 'tutoring', name: 'Tutoring', icon: BookOpen, color: 'from-sky-500 to-blue-400' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-fuchsia-500 to-pink-400' },
  { id: 'business', name: 'Business', icon: Handshake, color: 'from-slate-500 to-gray-400' },
  { id: 'gaming', name: 'Gaming', icon: Zap, color: 'from-violet-500 to-purple-400' },
  { id: 'public_speaking', name: 'Public Speaking', icon: Mic, color: 'from-rose-500 to-red-400' },
  { id: 'other', name: 'Other', icon: Lightbulb, color: 'from-gray-500 to-slate-400' },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'post', label: 'Post Skill', icon: PlusCircle },
  { id: 'favorites', label: 'Favorites', icon: Bookmark },
  { id: 'mylistings', label: 'My Listings', icon: List },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const MOBILE_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'post', label: 'Post', icon: PlusCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Post Your Skill', desc: 'List the skills you can offer and the skills you want to learn. Be specific about your expertise level and availability.', icon: Upload },
  { step: 2, title: 'Browse & Discover', desc: 'Explore thousands of skill listings from our community. Filter by category, location, and skill level to find your perfect match.', icon: Search },
  { step: 3, title: 'Connect & Exchange', desc: 'Message skill owners, negotiate terms, and start exchanging knowledge. Rate your experience to build trust in the community.', icon: Handshake },
];

const BADGES = [
  { id: 'first_step', name: 'First Step', desc: 'Created your first listing', icon: Star, condition: (l) => l >= 1 },
  { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Had 10 conversations', icon: MessageCircle, condition: (l, r, a, f, m) => m >= 10 },
  { id: 'top_contributor', name: 'Top Contributor', desc: 'Created 5 listings', icon: Award, condition: (l) => l >= 5 },
  { id: 'community_star', name: 'Community Star', desc: 'Received 5 positive reviews', icon: Sparkles, condition: (l, r) => r >= 5 },
  { id: 'legendary', name: 'Legendary', desc: 'Reached trust score 80+', icon: Crown, condition: (l, r, a) => a >= 80 },
  { id: 'chatterbox', name: 'Chatterbox', desc: 'Sent 50 messages', icon: MessageCircle, condition: (l, r, a, f, m) => m >= 50 },
  { id: 'collector', name: 'Collector', desc: 'Favorited 10 listings', icon: Heart, condition: (l, r, a, f) => f >= 10 },
  { id: 'on_fire', name: 'On Fire', desc: '7-day activity streak', icon: Flame, condition: (l, r, a, f, m, s) => s >= 7 },
];

const TITLES = [
  { min: 0, name: 'Beginner', color: 'text-gray-400' },
  { min: 10, name: 'Exchanger', color: 'text-emerald-400' },
  { min: 25, name: 'Expert Trader', color: 'text-blue-400' },
  { min: 50, name: 'Master', color: 'text-purple-400' },
  { min: 80, name: 'Legend', color: 'text-amber-400' },
];

const ACHIEVEMENTS = [
  { id: 'a1', name: 'Welcome Aboard', desc: 'Complete your profile', progress: 0, max: 1 },
  { id: 'a2', name: 'Skill Sharer', desc: 'Create 3 listings', progress: 0, max: 3 },
  { id: 'a3', name: 'Networker', desc: 'Connect with 5 people', progress: 0, max: 5 },
  { id: 'a4', name: 'Reviewer', desc: 'Write 3 reviews', progress: 0, max: 3 },
  { id: 'a5', name: 'Popular', desc: 'Get 10 views on a listing', progress: 0, max: 10 },
  { id: 'a6', name: 'Favorite', desc: 'Get 5 favorites', progress: 0, max: 5 },
  { id: 'a7', name: 'Streak Master', desc: '14-day activity streak', progress: 0, max: 14 },
  { id: 'a8', name: 'Category King', desc: 'Post in 5 categories', progress: 0, max: 5 },
  { id: 'a9', name: 'Exchange Pro', desc: 'Complete 3 exchanges', progress: 0, max: 3 },
  { id: 'a10', name: 'Trusted', desc: 'Reach trust score 50', progress: 0, max: 50 },
];

const TESTIMONIALS = [
  { id: 1, name: 'Sarah Johnson', role: 'UI/UX Designer', text: 'SkillSwap completely changed how I learn new skills. I traded my design expertise for guitar lessons and it was amazing!', rating: 5, avatar: 'SJ' },
  { id: 2, name: 'Ahmed Khan', role: 'Full Stack Developer', text: 'I learned three new programming languages through skill exchanges. The community is incredibly supportive and talented.', rating: 5, avatar: 'AK' },
  { id: 3, name: 'Emily Chen', role: 'Marketing Specialist', text: 'The gamification system keeps me motivated. I have gone from Beginner to Master rank in just three months!', rating: 4, avatar: 'EC' },
  { id: 4, name: 'Carlos Rodriguez', role: 'Photographer', text: 'I exchanged photography lessons for cooking classes. Now I can cook amazing meals and take stunning food photos!', rating: 5, avatar: 'CR' },
  { id: 5, name: 'Priya Patel', role: 'Content Writer', text: 'As a freelancer, SkillSwap helps me continuously upgrade my skills without spending a fortune. Highly recommended!', rating: 5, avatar: 'PP' },
];

const REPORT_REASONS = [
  'Inappropriate content',
  'Spam or misleading',
  'Offensive language',
  'Fake listing',
  'Harassment',
  'Other',
];

const EXCHANGE_TYPES = ['In-person', 'Online', 'Both'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Expert'];

// SECTION 4: HELPER FUNCTIONS

const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
};

const getCat = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};

const initials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const userGrad = (userId) => {
  if (!userId) return 'from-brand-500 to-purple-500';
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-violet-500 to-fuchsia-500',
    'from-red-500 to-pink-500',
    'from-teal-500 to-green-500',
    'from-cyan-500 to-blue-500',
    'from-orange-500 to-yellow-500',
  ];
  return gradients[Math.abs(hash) % gradients.length];
};

const trunc = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

const trustScore = (listings, reviews, avgRating) => {
  const l = listings || 0;
  const r = reviews || 0;
  const a = avgRating || 0;
  const raw = (l * 1) + (r * 2) + (a * 3);
  return Math.min(Math.round(raw), 100);
};

const userTitle = (score) => {
  const s = score || 0;
  for (let i = TITLES.length - 1; i >= 0; i--) {
    if (s >= TITLES[i].min) return TITLES[i];
  }
  return TITLES[0];
};

const todayKey = () => {
  return new Date().toISOString().split('T')[0];
};

const isBlocked = (blockedUsers, userId) => {
  if (!blockedUsers || !userId) return false;
  return blockedUsers.includes(userId);
};

const heatmapData = (activityLog) => {
  if (!activityLog) return {};
  return activityLog;
};

const heatColor = (count) => {
  if (!count || count === 0) return 'bg-dark-800';
  if (count <= 1) return 'bg-brand-900/50';
  if (count <= 3) return 'bg-brand-700/60';
  if (count <= 5) return 'bg-brand-500/70';
  if (count <= 8) return 'bg-brand-400/80';
  return 'bg-brand-300';
};

const trendingCats = (listings) => {
  if (!listings || listings.length === 0) return [];
  const counts = {};
  listings.forEach(l => {
    if (l.category) {
      counts[l.category] = (counts[l.category] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, count]) => ({ ...getCat(id), count }));
};

const matchingSuggestions = (listings, userId, wantedSkills) => {
  if (!listings || !userId) return [];
  const userFavorites = listings.filter(l => l.userId === userId);
  const userWanted = userFavorites.map(l => l.skillWanted?.toLowerCase());
  return listings
    .filter(l => l.userId !== userId)
    .filter(l => {
      const offered = l.skillOffered?.toLowerCase() || '';
      return userWanted.some(w => offered.includes(w) || w.includes(offered));
    })
    .slice(0, 6);
};

const leaderboardData = (listings, reviews) => {
  if (!listings) return [];
  const userMap = {};
  listings.forEach(l => {
    if (!userMap[l.userId]) {
      userMap[l.userId] = {
        userId: l.userId,
        userName: l.userName || 'Anonymous',
        listings: 0,
        totalRating: 0,
        reviewCount: 0,
      };
    }
    userMap[l.userId].listings++;
  });
  if (reviews) {
    reviews.forEach(r => {
      if (userMap[r.toUserId]) {
        userMap[r.toUserId].totalRating += r.rating;
        userMap[r.toUserId].reviewCount++;
      }
    });
  }
  return Object.values(userMap)
    .map(u => ({
      ...u,
      avgRating: u.reviewCount > 0 ? (u.totalRating / u.reviewCount) : 0,
      score: trustScore(u.listings, u.reviewCount, u.avgRating),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

const getUnlockedBadges = (score, listings, reviews, favorites, messages, streak) => {
  const l = listings || 0;
  const r = reviews || 0;
  const f = favorites || 0;
  const m = messages || 0;
  const s = streak || 0;
  return BADGES.filter(badge => badge.condition(l, r, score, f, m, s));
};

const passwordStrength = (password) => {
  if (!password) return { score: 0, label: 'None', color: 'bg-dark-700' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
  return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getChatPartnerId = (messages, userId) => {
  if (!messages || messages.length === 0) return null;
  const partnerIds = [...new Set(messages.map(m => m.fromUserId === userId ? m.toUserId : m.fromUserId))];
  return partnerIds[0];
};

const getConversations = (messages, userId) => {
  if (!messages || messages.length === 0) return [];
  const convMap = {};
  messages.forEach(m => {
    const partnerId = m.fromUserId === userId ? m.toUserId : m.fromUserId;
    const partnerName = m.fromUserId === userId ? m.toUserName : m.fromUserName;
    if (!convMap[partnerId] || (m.createdAt && (!convMap[partnerId].lastTime || m.createdAt.seconds > convMap[partnerId].lastTime))) {
      convMap[partnerId] = {
        partnerId,
        partnerName: partnerName || 'User',
        lastMessage: m.text,
        lastTime: m.createdAt?.seconds || 0,
        unread: m.fromUserId !== userId && !m.read ? 1 : (convMap[partnerId]?.unread || 0),
      };
    } else if (m.fromUserId !== userId && !m.read) {
      convMap[partnerId].unread++;
    }
  });
  return Object.values(convMap).sort((a, b) => b.lastTime - a.lastTime);
};

// ============================================================
// SECTION 5: SMALL COMPONENTS
// ============================================================

// --- Toast Notification Component ---
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: { bg: 'bg-emerald-500/20 border-emerald-500/40', icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, text: 'text-emerald-300' },
    error: { bg: 'bg-red-500/20 border-red-500/40', icon: <XCircle className="w-5 h-5 text-red-400" />, text: 'text-red-300' },
    info: { bg: 'bg-blue-500/20 border-blue-500/40', icon: <Info className="w-5 h-5 text-blue-400" />, text: 'text-blue-300' },
    warning: { bg: 'bg-amber-500/20 border-amber-500/40', icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, text: 'text-amber-300' },
  };
  const s = styles[toast.type] || styles.info;

  return (
    <div className={`fixed top-4 right-4 z-[100] slide-up ${s.bg} border rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg max-w-sm`}>
      {s.icon}
      <p className={`text-sm font-medium ${s.text}`}>{toast.message}</p>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white/80"><X className="w-4 h-4" /></button>
    </div>
  );
};

// --- Loading Skeleton ---
const LoadingSkeleton = ({ rows = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-dark-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-dark-700 rounded w-3/4" />
                <div className="h-3 bg-dark-700 rounded w-1/2" />
                <div className="h-3 bg-dark-700 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows * 3 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse h-48">
            <div className="h-4 bg-dark-700 rounded w-2/3 mb-3" />
            <div className="h-3 bg-dark-700 rounded w-full mb-2" />
            <div className="h-3 bg-dark-700 rounded w-4/5 mb-4" />
            <div className="flex gap-2">
              <div className="h-6 bg-dark-700 rounded-full w-16" />
              <div className="h-6 bg-dark-700 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-dark-700" />
          <div className="flex-1">
            <div className="h-3 bg-dark-700 rounded w-1/3 mb-2" />
            <div className="h-2 bg-dark-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Empty State ---
const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-dark-500" />
    </div>
    <h3 className="text-lg font-semibold text-white/80 mb-2">{title}</h3>
    <p className="text-dark-400 text-sm max-w-sm mb-6">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="gradient-bg text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">
        {actionLabel}
      </button>
    )}
  </div>
);

// --- Rating Stars ---
const RatingStars = ({ rating, size = 'sm', interactive = false, onRate }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {stars.map(s => (
        <Star
          key={s}
          className={`${sizeClass} ${(hover || rating) >= s ? 'fill-amber-400 text-amber-400' : 'text-dark-600'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(s)}
        />
      ))}
    </div>
  );
};

// --- Trust Score Ring ---
const TrustRing = ({ score, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#3b82f6' : score >= 25 ? '#f59e0b' : '#64748b';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{score || 0}</span>
      </div>
    </div>
  );
};

// --- Badges Row ---
const BadgesRow = ({ badges, size = 'sm' }) => {
  if (!badges || badges.length === 0) return <p className="text-dark-500 text-sm">No badges earned yet</p>;
  const sizeClass = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => {
        const BIcon = badge.icon || Star;
        return (
          <div key={badge.id} className="flex items-center gap-1.5 glass rounded-lg px-2 py-1" title={badge.desc}>
            <div className={`${sizeClass} rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center`}>
              <BIcon className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-white`} />
            </div>
            <span className="text-xs text-white/70">{badge.name}</span>
          </div>
        );
      })}
    </div>
  );
};

// --- Activity Heatmap ---
const Heatmap = ({ activityLog, size = 'sm' }) => {
  const weeks = 12;
  const days = 7;
  const cells = [];
  const data = activityLog || {};
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7) + 1);

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + (w * 7) + d);
      const key = cellDate.toISOString().split('T')[0];
      const count = data[key] || 0;
      cells.push({ key, count, week: w, day: d });
    }
  }

  const cellSize = size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5" style={{ width: weeks * 14 }}>
        {cells.map(c => (
          <div
            key={c.key}
            className={`${cellSize} rounded-sm ${heatColor(c.count)} transition-colors`}
            title={`${c.key}: ${c.count} activities`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[10px] text-dark-500">Less</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-dark-800" />
        <div className="w-2.5 h-2.5 rounded-sm bg-brand-900/50" />
        <div className="w-2.5 h-2.5 rounded-sm bg-brand-700/60" />
        <div className="w-2.5 h-2.5 rounded-sm bg-brand-500/70" />
        <div className="w-2.5 h-2.5 rounded-sm bg-brand-300" />
        <span className="text-[10px] text-dark-500">More</span>
      </div>
    </div>
  );
};

// --- Scroll To Top Button ---
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 md:bottom-6 right-6 z-50 w-10 h-10 rounded-full gradient-bg text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-all slide-up"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

// --- Password Strength Indicator ---
const PasswordStrengthBar = ({ password }) => {
  const strength = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-dark-700'}`} />
        ))}
      </div>
      <p className="text-xs mt-1 text-dark-400">{strength.label}</p>
    </div>
  );
};

// --- Notification Panel ---
const NotifPanel = ({ notifications, visible, onClose, onMarkRead }) => {
  if (!visible) return null;
  return (
    <div className="absolute right-0 top-12 w-80 glass-strong rounded-2xl shadow-2xl z-50 slide-up overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-white">Notifications</h3>
        <button onClick={onClose}><X className="w-4 h-4 text-dark-400 hover:text-white" /></button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications && notifications.length > 0 ? notifications.slice(0, 10).map((n, i) => (
          <div key={i} className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? 'bg-brand-500/5' : ''}`} onClick={() => onMarkRead(i)}>
            <p className="text-sm text-white/80">{n.message}</p>
            <p className="text-xs text-dark-500 mt-1">{timeAgo(n.createdAt)}</p>
          </div>
        )) : (
          <div className="p-8 text-center text-dark-500 text-sm">No notifications yet</div>
        )}
      </div>
    </div>
  );
};

// --- User Avatar ---
const UserAvatar = ({ name, userId, size = 'md' }) => {
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  return (
    <div className={`${sizeMap[size] || sizeMap.md} rounded-full bg-gradient-to-br ${userGrad(userId)} flex items-center justify-center font-bold text-white shrink-0`}>
      {initials(name)}
    </div>
  );
};

// ============================================================
// SECTION 5B: MODAL COMPONENTS
// ============================================================

// --- Modal Wrapper ---
const Modal = ({ visible, onClose, children, title }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Welcome Modal ---
const WelcomeModal = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };
  return (
    <Modal visible={visible} onClose={onClose} title="Welcome to SkillSwap!">
      <p className="text-dark-400 text-sm mb-4">What should we call you? This will be your display name.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your display name"
          className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
          autoFocus
        />
        <button type="submit" disabled={!name.trim()} className="mt-4 w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
          Get Started
        </button>
      </form>
    </Modal>
  );
};

// --- Delete Confirmation Modal ---
const DeleteModal = ({ visible, onClose, onConfirm, itemName }) => (
  <Modal visible={visible} onClose={onClose} title="Delete Confirmation">
    <p className="text-dark-300 mb-2">Are you sure you want to delete</p>
    <p className="text-white font-semibold mb-1">"{itemName}"</p>
    <p className="text-dark-400 text-sm mb-6">This action cannot be undone.</p>
    <div className="flex gap-3">
      <button onClick={onClose} className="flex-1 bg-dark-700 text-white py-2.5 rounded-xl font-medium hover:bg-dark-600 transition-colors">Cancel</button>
      <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors">Delete</button>
    </div>
  </Modal>
);

// --- Contact Info Modal ---
const ContactModal = ({ visible, onClose, contactInfo, userName }) => (
  <Modal visible={visible} onClose={onClose} title="Contact Information">
    <div className="text-center">
      <UserAvatar name={userName} userId={userName} size="lg" />
      <h4 className="text-white font-semibold mt-3">{userName}</h4>
      <div className="glass rounded-xl p-4 mt-4">
        <p className="text-dark-400 text-sm mb-1">Contact Details</p>
        <p className="text-white">{contactInfo || 'No contact info provided'}</p>
      </div>
      <button onClick={onClose} className="mt-4 w-full gradient-bg text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">Close</button>
    </div>
  </Modal>
);

// --- Report Modal ---
const ReportModal = ({ visible, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [desc, setDesc] = useState('');
  const handleSubmit = () => {
    if (reason) { onSubmit(reason, desc); setReason(''); setDesc(''); }
  };
  return (
    <Modal visible={visible} onClose={onClose} title="Report Listing">
      <p className="text-dark-400 text-sm mb-4">Why are you reporting this listing?</p>
      <div className="space-y-2 mb-4">
        {REPORT_REASONS.map(r => (
          <label key={r} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${reason === r ? 'bg-brand-500/20 border border-brand-500/40' : 'bg-dark-800/50 border border-transparent hover:bg-white/5'}`}>
            <input type="radio" name="report" value={r} checked={reason === r} onChange={e => setReason(e.target.value)} className="accent-brand-500" />
            <span className="text-sm text-white/80">{r}</span>
          </label>
        ))}
      </div>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Additional details (optional)" rows={3}
        className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm resize-none" />
      <button onClick={handleSubmit} disabled={!reason} className="mt-3 w-full bg-red-500/80 text-white py-2.5 rounded-xl font-medium hover:bg-red-500 transition-colors disabled:opacity-50">
        Submit Report
      </button>
    </Modal>
  );
};

// --- Review Modal ---
const ReviewModal = ({ visible, onClose, onSubmit, userName }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const handleSubmit = () => {
    if (rating > 0) { onSubmit(rating, text); setRating(0); setText(''); }
  };
  return (
    <Modal visible={visible} onClose={onClose} title={`Review ${userName || 'User'}`}>
      <div className="text-center mb-4">
        <p className="text-dark-400 text-sm mb-2">How was your experience?</p>
        <div className="flex justify-center">
          <RatingStars rating={rating} size="lg" interactive onRate={setRating} />
        </div>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a review (optional)" rows={3}
        className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm resize-none" />
      <button onClick={handleSubmit} disabled={rating === 0} className="mt-3 w-full gradient-bg text-white py-2.5 rounded-xl font-medium hover:opacity-90 disabled:opacity-50">
        Submit Review
      </button>
    </Modal>
  );
};

// --- Exchange Proposal Modal ---
const ExchangeModal = ({ visible, onClose, onSubmit, listing }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = () => {
    if (message.trim()) { onSubmit(message); setMessage(''); }
  };
  return (
    <Modal visible={visible} onClose={onClose} title="Propose Exchange">
      <div className="glass rounded-xl p-4 mb-4">
        <p className="text-dark-400 text-xs mb-1">Listing</p>
        <p className="text-white font-semibold">{listing?.skillOffered}</p>
        <p className="text-dark-300 text-sm">Wants: {listing?.skillWanted}</p>
      </div>
      <p className="text-dark-400 text-sm mb-2">Write a message to propose the exchange</p>
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Hi! I'd love to exchange skills with you..." rows={4}
        className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm resize-none" />
      <button onClick={handleSubmit} disabled={!message.trim()} className="mt-3 w-full gradient-bg text-white py-2.5 rounded-xl font-medium hover:opacity-90 disabled:opacity-50">
        Send Proposal
      </button>
    </Modal>
  );
};

// --- User Profile Modal ---
const UserProfileModal = ({ visible, onClose, user, listings, reviews }) => {
  if (!user) return null;
  const score = trustScore(listings?.length || 0, reviews?.length || 0, 0);
  const title = userTitle(score);
  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="text-center">
        <UserAvatar name={user.userName} userId={user.userId} size="xl" />
        <h3 className="text-xl font-bold text-white mt-3">{user.userName}</h3>
        <p className={`text-sm ${title.color}`}>{title.name}</p>
        <div className="flex justify-center mt-3">
          <TrustRing score={score} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{listings?.length || 0}</p>
            <p className="text-xs text-dark-400">Listings</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{reviews?.length || 0}</p>
            <p className="text-xs text-dark-400">Reviews</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{score}</p>
            <p className="text-xs text-dark-400">Score</p>
          </div>
        </div>
        {listings && listings.length > 0 && (
          <div className="mt-4 text-left">
            <h4 className="text-sm font-semibold text-white/80 mb-2">Recent Listings</h4>
            {listings.slice(0, 3).map(l => (
              <div key={l.id} className="glass rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-white">{l.skillOffered}</p>
                <p className="text-xs text-dark-400">Wants: {l.skillWanted}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

// --- Image Preview Modal ---
const ImagePreviewModal = ({ visible, onClose, imageUrl }) => {
  if (!visible || !imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/60 hover:text-white z-10"><X className="w-8 h-8" /></button>
      <img src={imageUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
};

// ============================================================
// SECTION 5C: SKILL CARD COMPONENT
// ============================================================

const SkillCard = ({
  listing, isFavorite, onToggleFavorite, onView, onEdit, onDelete,
  onContact, onReport, onReview, onExchange, onUserClick, showActions = true, currentUser
}) => {
  const cat = getCat(listing.category);
  const CatIcon = cat.icon;
  const isOwner = currentUser && listing.userId === currentUser.uid;

  return (
    <div
      className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.02] cursor-pointer group page-enter"
      onClick={() => onView && onView(listing)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(listing); }}>
          <UserAvatar name={listing.userName} userId={listing.userId} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{listing.userName}</p>
            <p className="text-xs text-dark-500">{timeAgo(listing.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(listing.id); }}
          className="text-dark-400 hover:text-red-400 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
        </button>
      </div>

      {/* Skill Info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r ${cat.color} text-white`}>
            {cat.name}
          </span>
          {listing.skillLevel && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-dark-700 text-dark-300">{listing.skillLevel}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mt-2">{listing.skillOffered}</h3>
        <p className="text-sm text-dark-300 mt-1">Wants: <span className="text-brand-300">{listing.skillWanted}</span></p>
      </div>

      {/* Description */}
      {listing.description && (
        <p className="text-xs text-dark-400 mb-3 line-clamp-2">{trunc(listing.description, 120)}</p>
      )}

      {/* Image Preview */}
      {listing.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden h-32 bg-dark-800" onClick={(e) => { e.stopPropagation(); }}>
          <img src={listing.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {listing.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-dark-800 text-dark-400 border border-white/5">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-dark-500">
            <Eye className="w-3.5 h-3.5" /> {listing.views || 0}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark-500">
            <Heart className="w-3.5 h-3.5" /> {listing.favorites || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {listing.exchangeType && (
            <span className="flex items-center gap-1 text-[10px] text-dark-500">
              {listing.exchangeType === 'Online' ? <Globe className="w-3 h-3" /> : listing.exchangeType === 'In-person' ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {listing.exchangeType}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons (shown on hover or for owner) */}
      {showActions && (
        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isOwner ? (
            <>
              <button onClick={(e) => { e.stopPropagation(); onContact && onContact(listing); }} className="flex-1 text-xs bg-brand-500/20 text-brand-300 py-1.5 rounded-lg hover:bg-brand-500/30 transition-colors">
                Contact
              </button>
              <button onClick={(e) => { e.stopPropagation(); onExchange && onExchange(listing); }} className="flex-1 text-xs gradient-bg text-white py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                Propose Exchange
              </button>
              <button onClick={(e) => { e.stopPropagation(); onReport && onReport(listing); }} className="text-dark-500 hover:text-red-400 transition-colors p-1.5">
                <Flag className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(listing); }} className="flex-1 text-xs bg-dark-700 text-white py-1.5 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center gap-1">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete && onDelete(listing); }} className="flex-1 text-xs bg-red-500/20 text-red-400 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PART 1 ENDS HERE — Continue with PART 2
// ============================================================
// ============================================================
// SKILLSWAP — BARTER EXCHANGE APP
// Complete App.jsx — PART 2 of 2
// CONTINUE: Landing, Login, Signup, All Pages, Layout, Main App
// ============================================================
// ⬆️ Paste PART 1 above this line in your App.jsx file ⬆️

// ============================================================
// SECTION 6: LANDING PAGE
// ============================================================

const LandingPage = ({ onNavigate }) => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [testiIndex, setTestiIndex] = useState(0);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestiIndex(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const animateNumber = (target) => {
    return statsVisible ? target : 0;
  };

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">SkillSwap</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-dark-400 hover:text-white transition-colors text-sm">Features</a>
          <a href="#how" className="text-dark-400 hover:text-white transition-colors text-sm">How It Works</a>
          <a href="#testimonials" className="text-dark-400 hover:text-white transition-colors text-sm">Reviews</a>
          <a href="#categories" className="text-dark-400 hover:text-white transition-colors text-sm">Categories</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('login')} className="text-sm text-dark-300 hover:text-white transition-colors px-4 py-2">Log In</button>
          <button onClick={() => onNavigate('signup')} className="gradient-bg text-white text-sm px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity glow-sm">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <div className="slide-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-dark-300">Trusted by 1,000+ skill traders worldwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">Exchange Skills,</span><br />
            <span className="gradient-text">Not Money.</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's first peer-to-peer skill trading platform. Share what you know,
            learn what you need. No money involved — just pure knowledge exchange.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('signup')} className="gradient-bg text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity glow flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => onNavigate('login')} className="glass-strong text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
              Explore Skills <Compass className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="hidden lg:flex items-center justify-center gap-6 mt-20">
          {[
            { icon: Code, label: 'Code', color: 'from-blue-500 to-cyan-400' },
            { icon: Palette, label: 'Design', color: 'from-pink-500 to-rose-400' },
            { icon: Music, label: 'Music', color: 'from-purple-500 to-violet-400' },
            { icon: ChefHat, label: 'Cooking', color: 'from-orange-500 to-amber-400' },
            { icon: Languages, label: 'Language', color: 'from-indigo-500 to-blue-400' },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-4 animate-float flex items-center gap-3" style={{ animationDelay: `${i * 0.5}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why <span className="gradient-text">SkillSwap</span>?</h2>
            <p className="text-dark-400 max-w-lg mx-auto">Everything you need to trade skills with confidence and build meaningful connections.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Trust System', desc: 'Our unique trust score and rating system ensures safe and reliable skill exchanges within the community.' },
              { icon: Brain, title: 'Smart Matching', desc: 'AI-powered suggestions match you with the perfect skill partners based on what you offer and want.' },
              { icon: Trophy, title: 'Gamification', desc: 'Earn badges, climb the leaderboard, and unlock achievements as you trade skills and help others.' },
              { icon: MessageCircle, title: 'Built-in Chat', desc: 'Communicate directly with skill owners through our integrated messaging system — no external apps needed.' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.03] group">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-dark-400 max-w-lg mx-auto">Three simple steps to start exchanging skills today.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative glass rounded-2xl p-8 text-center hover:bg-white/[0.07] transition-all duration-300 group">
                <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-brand-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="glass-strong rounded-3xl p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {[
                { value: animateNumber(2500), suffix: '+', label: 'Skills Listed' },
                { value: animateNumber(1200), suffix: '+', label: 'Community Members' },
                { value: animateNumber(3800), suffix: '+', label: 'Exchanges Completed' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl md:text-5xl font-black gradient-text">{stat.value}{stat.suffix}</p>
                  <p className="text-dark-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What People <span className="gradient-text">Say</span></h2>
          <p className="text-dark-400 mb-12">Hear from our thriving community of skill traders.</p>
          <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-4 left-8 text-6xl text-brand-500/20 font-serif">"</div>
            <div className="slide-up" key={testiIndex}>
              <UserAvatar name={TESTIMONIALS[testiIndex].name} userId={TESTIMONIALS[testiIndex].name} size="lg" />
              <h4 className="text-xl font-bold text-white mt-4">{TESTIMONIALS[testiIndex].name}</h4>
              <p className="text-sm text-brand-300 mb-4">{TESTIMONIALS[testiIndex].role}</p>
              <div className="flex justify-center mb-4"><RatingStars rating={TESTIMONIALS[testiIndex].rating} /></div>
              <p className="text-dark-300 leading-relaxed max-w-xl mx-auto">"{TESTIMONIALS[testiIndex].text}"</p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestiIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === testiIndex ? 'bg-brand-500 w-6' : 'bg-dark-600 hover:bg-dark-500'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section id="categories" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular <span className="gradient-text">Categories</span></h2>
            <p className="text-dark-400 max-w-lg mx-auto">Explore skills across diverse categories and find your perfect match.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.slice(0, 10).map((cat, i) => (
              <div key={cat.id} className="glass rounded-2xl p-5 text-center hover:bg-white/[0.07] transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-medium text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Ready to <span className="gradient-text">Swap Skills</span>?</h2>
              <p className="text-dark-400 max-w-lg mx-auto mb-8">Join thousands of people who are learning and teaching without spending a dime. Your next skill is just one swap away.</p>
              <button onClick={() => onNavigate('signup')} className="gradient-bg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity glow">
                Join SkillSwap Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">SkillSwap</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-dark-500">
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
          <p className="text-xs text-dark-600">&copy; 2024 SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// ============================================================
// SECTION 7: LOGIN PAGE
// ============================================================

const LoginPage = ({ onNavigate, onLogin, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.code === 'auth/user-not-found' ? 'No account found with this email' :
               err.code === 'auth/wrong-password' ? 'Incorrect password' :
               err.code === 'auth/invalid-credential' ? 'Invalid credentials' :
               'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await onLogin(null, null, 'google');
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10 slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow">
            <Handshake className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-dark-400 text-sm mt-1">Sign in to continue to SkillSwap</p>
        </div>
        <div className="glass-strong rounded-2xl p-8">
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-dark-800/80 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition-colors mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-dark-500">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm" />
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
                  {showPass ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-brand-500 rounded" />
                <span className="text-xs text-dark-400">Remember me</span>
              </label>
              <button type="button" onClick={() => showToast('info', 'Password reset link sent to your email!')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-dark-400 mt-6">
          Don't have an account? <button onClick={() => onNavigate('signup')} className="text-brand-400 font-medium hover:text-brand-300">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 8: SIGNUP PAGE
// ============================================================

const SignupPage = ({ onNavigate, onSignup, showToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPass) { setError('Please fill in all fields'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPass) { setError('Passwords do not match'); return; }
    if (!terms) { setError('Please agree to the Terms & Conditions'); return; }
    setLoading(true);
    try {
      await onSignup(email, password, name);
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account with this email already exists' : 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10 slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow">
            <Handshake className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-dark-400 text-sm mt-1">Join SkillSwap and start trading skills</p>
        </div>
        <div className="glass-strong rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Muhammad Ali"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm" />
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm" />
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
                  {showPass ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthBar password={password} />
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Confirm Password</label>
              <input type={showPass ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm your password"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors text-sm" />
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="accent-brand-500 rounded mt-0.5" />
              <span className="text-xs text-dark-400">I agree to the <span className="text-brand-400">Terms of Service</span> and <span className="text-brand-400">Privacy Policy</span></span>
            </label>
            <button type="submit" disabled={loading} className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><User className="w-4 h-4" /> Create Account</>}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-dark-400 mt-6">
          Already have an account? <button onClick={() => onNavigate('login')} className="text-brand-400 font-medium hover:text-brand-300">Sign In</button>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 9: MAIN APP PAGES
// ============================================================

// --- HOME PAGE ---
const HomePage = ({ user, userData, listings, favorites, onToggleFavorite, onViewListing, onNavigate, messages, reviews }) => {
  const myListings = listings.filter(l => l.userId === user?.uid);
  const myScore = trustScore(myListings.length, reviews?.filter(r => r.toUserId === user?.uid).length || 0, 4.5);
  const tCats = trendingCats(listings);
  const suggestions = matchingSuggestions(listings, user?.uid, myListings.map(l => l.skillWanted));
  const displayName = user?.displayName || userData?.displayName || 'there';

  return (
    <div className="page-enter space-y-8">
      {/* Hero Banner */}
      <div className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/15 to-purple-500/10" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Welcome back, <span className="gradient-text">{displayName}</span>!</h1>
          <p className="text-dark-400 mb-6">Ready to learn something new today?</p>
          <button onClick={() => onNavigate('post')} className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity glow-sm flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Post a New Skill
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Your Listings', value: myListings.length, icon: List, color: 'text-blue-400' },
          { label: 'Community', value: [...new Set(listings.map(l => l.userId))].length, icon: Users, color: 'text-purple-400' },
          { label: 'Categories', value: [...new Set(listings.map(l => l.category))].length, icon: Tag, color: 'text-emerald-400' },
          { label: 'Your Score', value: myScore, icon: Trophy, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Matching Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /> Suggested For You</h2>
            <button onClick={() => onNavigate('explore')} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map(l => (
              <SkillCard key={l.id} listing={l} isFavorite={favorites.includes(l.id)} onToggleFavorite={onToggleFavorite} onView={onViewListing} currentUser={user} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Categories */}
      {tCats.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-brand-400" /> Trending Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tCats.map((cat, i) => {
              const CatIcon = cat.icon;
              const maxCount = tCats[0]?.count || 1;
              return (
                <div key={cat.id} className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all cursor-pointer" onClick={() => onNavigate('explore')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                      <CatIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{cat.name}</p>
                      <p className="text-xs text-dark-500">{cat.count} listings</p>
                    </div>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${(cat.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-brand-400" /> Recent Listings</h2>
          <button onClick={() => onNavigate('explore')} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
        </div>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.slice(0, 6).map(l => (
              <SkillCard key={l.id} listing={l} isFavorite={favorites.includes(l.id)} onToggleFavorite={onToggleFavorite} onView={onViewListing} currentUser={user} />
            ))}
          </div>
        ) : (
          <LoadingSkeleton type="grid" rows={1} />
        )}
      </div>

      {/* Activity Heatmap */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-brand-400" /> Your Activity</h2>
        <Heatmap activityLog={userData?.activityLog || {}} size="md" />
      </div>

      {/* Testimonials */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Community Love</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.slice(0, 3).map(t => (
            <div key={t.id} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserAvatar name={t.name} userId={t.name} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-dark-500">{t.role}</p>
                </div>
              </div>
              <p className="text-xs text-dark-300 leading-relaxed">"{trunc(t.text, 100)}"</p>
              <div className="mt-2"><RatingStars rating={t.rating} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- EXPLORE PAGE ---
const ExplorePage = ({ listings, favorites, onToggleFavorite, onViewListing, currentUser, blockedUsers }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = listings.filter(l => !isBlocked(blockedUsers, l.userId));
    if (category !== 'all') result = result.filter(l => l.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        (l.skillOffered?.toLowerCase().includes(q)) ||
        (l.skillWanted?.toLowerCase().includes(q)) ||
        (l.userName?.toLowerCase().includes(q)) ||
        (l.tags?.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (sort === 'newest') result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sort === 'oldest') result.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    if (sort === 'popular') result.sort((a, b) => (b.views || 0) - (a.views || 0));
    return result;
  }, [listings, search, category, sort, blockedUsers]);

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Compass className="w-6 h-6 text-brand-400" /> Explore Skills</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills, people, tags..."
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="bg-dark-800/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-dark-300 focus:outline-none cursor-pointer">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === 'all' ? 'gradient-bg text-white' : 'glass text-dark-400 hover:text-white'}`}>
          All
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${category === cat.id ? 'gradient-bg text-white' : 'glass text-dark-400 hover:text-white'}`}>
            <cat.icon className="w-3.5 h-3.5" /> {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <SkillCard key={l.id} listing={l} isFavorite={favorites.includes(l.id)} onToggleFavorite={onToggleFavorite} onView={onViewListing} currentUser={user} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Search} title="No results found" description="Try different keywords or browse categories" actionLabel="Clear Filters" onAction={() => { setSearch(''); setCategory('all'); }} />
      )}
    </div>
  );
};

// --- MESSAGES PAGE ---
const MessagesPage = ({ user, messages, onSendMessage, allListings }) => {
  const [activeConv, setActiveConv] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [convSearch, setConvSearch] = useState('');
  const chatEndRef = useRef(null);

  const conversations = useMemo(() => getConversations(messages, user?.uid), [messages, user?.uid]);

  const filteredConvs = useMemo(() => {
    if (!convSearch.trim()) return conversations;
    const q = convSearch.toLowerCase();
    return conversations.filter(c => c.partnerName.toLowerCase().includes(q));
  }, [conversations, convSearch]);

  const chatMessages = useMemo(() => {
    if (!activeConv || !messages) return [];
    return messages.filter(m =>
      (m.fromUserId === user?.uid && m.toUserId === activeConv) ||
      (m.fromUserId === activeConv && m.toUserId === user?.uid)
    ).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }, [messages, activeConv, user?.uid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const handleSend = () => {
    if (newMsg.trim() && activeConv) {
      onSendMessage(activeConv, newMsg.trim());
      setNewMsg('');
    }
  };

  const activeConvName = conversations.find(c => c.partnerId === activeConv)?.partnerName || 'User';

  return (
    <div className="page-enter h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex glass rounded-2xl overflow-hidden">
      {/* Conversations Sidebar */}
      <div className={`${activeConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-white/5`}>
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input value={convSearch} onChange={e => setConvSearch(e.target.value)} placeholder="Search conversations..."
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length > 0 ? filteredConvs.map(conv => (
            <div key={conv.partnerId} onClick={() => setActiveConv(conv.partnerId)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeConv === conv.partnerId ? 'bg-brand-500/15 border-l-2 border-brand-500' : 'hover:bg-white/5'}`}>
              <div className="relative">
                <UserAvatar name={conv.partnerName} userId={conv.partnerId} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">{conv.partnerName}</p>
                  <span className="text-[10px] text-dark-500">{timeAgo({ seconds: conv.lastTime })}</span>
                </div>
                <p className="text-xs text-dark-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center">{conv.unread}</span>
              )}
            </div>
          )) : (
            <EmptyState icon={MessageCircle} title="No conversations yet" description="Start a new conversation from a listing" />
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${!activeConv ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
        {activeConv ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <button onClick={() => setActiveConv(null)} className="md:hidden text-dark-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
              <UserAvatar name={activeConvName} userId={activeConv} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">{activeConvName}</p>
                <p className="text-xs text-emerald-400">Online</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => {
                const isSent = msg.fromUserId === user?.uid;
                return (
                  <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isSent ? 'bg-brand-500 text-white rounded-br-md' : 'bg-dark-800 text-dark-200 rounded-bl-md'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isSent ? 'text-white/50' : 'text-dark-500'}`}>{timeAgo(msg.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..."
                  className="flex-1 bg-dark-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500" />
                <button onClick={handleSend} disabled={!newMsg.trim()} className="w-10 h-10 rounded-xl gradient-bg text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-dark-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white/60">Select a conversation</h3>
              <p className="text-sm text-dark-500">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- POST PAGE ---
const PostPage = ({ user, userData, showToast, editingListing, onClearEdit, onSubmit }) => {
  const [form, setForm] = useState({
    skillOffered: '', skillWanted: '', category: 'programming', description: '',
    contactInfo: '', tags: '', imageUrl: '', skillLevel: 'Intermediate', exchangeType: 'Online', availability: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingListing) {
      setForm({
        skillOffered: editingListing.skillOffered || '',
        skillWanted: editingListing.skillWanted || '',
        category: editingListing.category || 'programming',
        description: editingListing.description || '',
        contactInfo: editingListing.contactInfo || '',
        tags: editingListing.tags?.join(', ') || '',
        imageUrl: editingListing.imageUrl || '',
        skillLevel: editingListing.skillLevel || 'Intermediate',
        exchangeType: editingListing.exchangeType || 'Online',
        availability: editingListing.availability || '',
      });
    }
  }, [editingListing]);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.skillOffered || form.skillWanted) {
        localStorage.setItem('skillswap_draft', JSON.stringify(form));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    const draft = localStorage.getItem('skillswap_draft');
    if (draft && !editingListing) {
      try { setForm(JSON.parse(draft)); } catch {}
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.skillOffered.trim()) e.skillOffered = 'Skill offered is required';
    if (!form.skillWanted.trim()) e.skillWanted = 'Skill wanted is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        userName: user?.displayName || userData?.displayName || 'Anonymous',
        userId: user?.uid,
        createdAt: editingListing?.createdAt || new Date(),
        views: editingListing?.views || 0,
        favorites: editingListing?.favorites || 0,
      };
      await onSubmit(data, editingListing?.id);
      localStorage.removeItem('skillswap_draft');
      showToast('success', editingListing ? 'Listing updated!' : 'Skill posted successfully!');
      if (onClearEdit) onClearEdit();
    } catch (err) {
      showToast('error', 'Failed to save listing. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="page-enter max-w-2xl mx-auto">
      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {editingListing ? <Edit3 className="w-6 h-6 text-brand-400" /> : <PlusCircle className="w-6 h-6 text-brand-400" />}
            {editingListing ? 'Edit Listing' : 'Post a New Skill'}
          </h1>
          {editingListing && (
            <button onClick={onClearEdit} className="text-sm text-dark-400 hover:text-white transition-colors">Cancel Edit</button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Skill You Offer *</label>
              <input value={form.skillOffered} onChange={e => setForm({ ...form, skillOffered: e.target.value })} placeholder="e.g., React Development"
                className={`w-full bg-dark-800/80 border rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm ${errors.skillOffered ? 'border-red-500' : 'border-white/10'}`} />
              {errors.skillOffered && <p className="text-red-400 text-xs mt-1">{errors.skillOffered}</p>}
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Skill You Want *</label>
              <input value={form.skillWanted} onChange={e => setForm({ ...form, skillWanted: e.target.value })} placeholder="e.g., Guitar Lessons"
                className={`w-full bg-dark-800/80 border rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm ${errors.skillWanted ? 'border-red-500' : 'border-white/10'}`} />
              {errors.skillWanted && <p className="text-red-400 text-xs mt-1">{errors.skillWanted}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-dark-300 focus:outline-none cursor-pointer">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Skill Level</label>
              <select value={form.skillLevel} onChange={e => setForm({ ...form, skillLevel: e.target.value })}
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-dark-300 focus:outline-none cursor-pointer">
                {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-dark-400 font-medium mb-1 block">Exchange Type</label>
              <select value={form.exchangeType} onChange={e => setForm({ ...form, exchangeType: e.target.value })}
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-dark-300 focus:outline-none cursor-pointer">
                {EXCHANGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-dark-400 font-medium mb-1 block">Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your skill in detail, what you can teach, your experience level..." rows={4}
              className={`w-full bg-dark-800/80 border rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm resize-none ${errors.description ? 'border-red-500' : 'border-white/10'}`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            <p className="text-xs text-dark-600 mt-1">{form.description.length}/500 characters</p>
          </div>

          <div>
            <label className="text-xs text-dark-400 font-medium mb-1 block">Availability</label>
            <input value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} placeholder="e.g., Weekdays evenings, Weekends"
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm" />
          </div>

          <div>
            <label className="text-xs text-dark-400 font-medium mb-1 block">Contact Info (optional)</label>
            <input value={form.contactInfo} onChange={e => setForm({ ...form, contactInfo: e.target.value })} placeholder="Email, phone, or social media handle"
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm" />
          </div>

          <div>
            <label className="text-xs text-dark-400 font-medium mb-1 block">Image URL (optional)</label>
            <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg"
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm" />
            {form.imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden h-32 bg-dark-800">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-dark-400 font-medium mb-1 block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, javascript, frontend, web"
              className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full gradient-bg text-white py-3.5 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow-sm">
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (editingListing ? <><CheckCircle className="w-5 h-5" /> Update Listing</> : <><PlusCircle className="w-5 h-5" /> Post Skill</>)}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- FAVORITES PAGE ---
const FavoritesPage = ({ listings, favorites, onToggleFavorite, onViewListing, currentUser, onNavigate }) => {
  const [catFilter, setCatFilter] = useState('all');
  const favListings = listings.filter(l => favorites.includes(l.id));
  const filtered = catFilter === 'all' ? favListings : favListings.filter(l => l.category === catFilter);

  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Heart className="w-6 h-6 text-red-400" /> Favorites</h1>
      {favListings.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setCatFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${catFilter === 'all' ? 'gradient-bg text-white' : 'glass text-dark-400'}`}>All</button>
          {[...new Set(favListings.map(l => l.category))].map(catId => (
            <button key={catId} onClick={() => setCatFilter(catId)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${catFilter === catId ? 'gradient-bg text-white' : 'glass text-dark-400'}`}>
              {getCat(catId).name}
            </button>
          ))}
        </div>
      )}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <SkillCard key={l.id} listing={l} isFavorite={true} onToggleFavorite={onToggleFavorite} onView={onViewListing} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Heart} title="No favorites yet" description="Browse skills and tap the heart icon to save your favorites" actionLabel="Explore Skills" onAction={() => onNavigate('explore')} />
      )}
    </div>
  );
};

// --- MY LISTINGS PAGE ---
const MyListingsPage = ({ user, listings, reviews, onEdit, onDelete, onViewListing, onNavigate }) => {
  const [sortBy, setSortBy] = useState('newest');
  const myListings = listings.filter(l => l.userId === user?.uid);
  const myReviews = reviews?.filter(r => r.toUserId === user?.uid) || [];
  const sorted = [...myListings].sort((a, b) => sortBy === 'newest' ? (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0) : (b.views || 0) - (a.views || 0));

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><List className="w-6 h-6 text-brand-400" /> My Listings</h1>
        <div className="flex items-center gap-3">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-dark-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-dark-300 focus:outline-none cursor-pointer">
            <option value="newest">Newest</option>
            <option value="popular">Most Viewed</option>
          </select>
          <button onClick={() => onNavigate('post')} className="gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 hover:opacity-90">
            <PlusCircle className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Listings', value: myListings.length },
          { label: 'Total Views', value: myListings.reduce((s, l) => s + (l.views || 0), 0) },
          { label: 'Reviews', value: myReviews.length },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(l => (
            <SkillCard key={l.id} listing={l} isFavorite={false} onEdit={onEdit} onDelete={onDelete} onView={onViewListing} currentUser={user} />
          ))}
        </div>
      ) : (
        <EmptyState icon={List} title="No listings yet" description="Share your skills with the community and start trading!" actionLabel="Create Your First Listing" onAction={() => onNavigate('post')} />
      )}
    </div>
  );
};

// --- LEADERBOARD PAGE ---
const LeaderboardPage = ({ listings, reviews, user }) => {
  const [period, setPeriod] = useState('all');
  const board = leaderboardData(listings, reviews);
  const myRank = board.findIndex(b => b.userId === user?.uid) + 1;

  const podiumColors = ['from-amber-400 to-yellow-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700'];

  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-400" /> Leaderboard</h1>

      <div className="flex gap-2">
        {['all', 'weekly', 'monthly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${period === p ? 'gradient-bg text-white' : 'glass text-dark-400'}`}>{p}</button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {board.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const entry = board[idx];
            if (!entry) return null;
            return (
              <div key={idx} className={`glass rounded-2xl p-5 text-center ${idx === 0 ? 'md:order-2 md:-mt-4' : idx === 1 ? 'md:order-1' : 'md:order-3'}`}>
                <div className="relative inline-block">
                  <UserAvatar name={entry.userName} userId={entry.userId} size={idx === 0 ? 'xl' : 'lg'} />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${podiumColors[idx]} flex items-center justify-center text-xs font-bold text-white`}>
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mt-3">{entry.userName}</h3>
                <p className="text-lg font-black gradient-text">{entry.score}</p>
                <p className="text-xs text-dark-500">{entry.listings} listings</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <div className="glass rounded-2xl overflow-hidden">
        {board.map((entry, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${entry.userId === user?.uid ? 'bg-brand-500/10' : ''}`}>
            <span className="w-8 text-center font-bold text-sm text-dark-400">#{i + 1}</span>
            <UserAvatar name={entry.userName} userId={entry.userId} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{entry.userName} {entry.userId === user?.uid && <span className="text-brand-400">(You)</span>}</p>
              <p className="text-xs text-dark-500">{entry.listings} listings &middot; {entry.reviewCount} reviews</p>
            </div>
            <TrustRing score={entry.score} size={40} strokeWidth={4} />
          </div>
        ))}
      </div>

      {myRank > 0 && (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-dark-400 text-sm">Your current rank</p>
          <p className="text-4xl font-black gradient-text">#{myRank}</p>
        </div>
      )}
    </div>
  );
};

// --- PROFILE PAGE ---
const ProfilePage = ({ user, userData, listings, reviews, favorites, messages, onNavigate, showToast }) => {
  const myListings = listings.filter(l => l.userId === user?.uid);
  const myReviews = reviews?.filter(r => r.toUserId === user?.uid);
  const avgRating = myReviews.length > 0 ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0;
  const score = trustScore(myListings.length, myReviews.length, avgRating);
  const title = userTitle(score);
  const displayName = user?.displayName || userData?.displayName || 'Anonymous';
  const streak = userData?.streak || 0;
  const unlockedBadges = getUnlockedBadges(score, myListings.length, myReviews.length, favorites?.length || 0, messages?.length || 0, streak);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(userData?.bio || '');

  return (
    <div className="page-enter space-y-6">
      {/* Profile Header */}
      <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/5" />
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="p-1 rounded-full bg-gradient-to-br from-brand-500 to-purple-500">
              <UserAvatar name={displayName} userId={user?.uid} size="xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark-950 flex items-center justify-center border-2 border-brand-500">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <p className={`text-sm ${title.color} font-medium`}>{title.name} &middot; Trust Score: {score}</p>
            <p className="text-xs text-dark-500 mt-1">Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'recently'}</p>
            {editing ? (
              <div className="mt-3 flex gap-2">
                <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Write something about yourself..." className="flex-1 bg-dark-800/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500" />
                <button onClick={() => { setEditing(false); showToast('success', 'Bio updated!'); }} className="gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium">Save</button>
              </div>
            ) : (
              <p className="text-sm text-dark-300 mt-2">{bio || 'Click edit to add a bio'}</p>
            )}
            <button onClick={() => setEditing(!editing)} className="mt-2 text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> {editing ? 'Cancel' : 'Edit Bio'}
            </button>
          </div>
          <div className="flex justify-center">
            <TrustRing score={score} size={100} strokeWidth={8} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Listings', value: myListings.length, icon: List, color: 'text-blue-400' },
          { label: 'Reviews', value: myReviews.length, icon: Star, color: 'text-amber-400' },
          { label: 'Favorites', value: favorites?.length || 0, icon: Heart, color: 'text-red-400' },
          { label: 'Messages', value: messages?.length || 0, icon: MessageCircle, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /> Badges</h2>
        <BadgesRow badges={unlockedBadges} size="lg" />
      </div>

      {/* Activity Heatmap */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-brand-400" /> Activity</h2>
        <Heatmap activityLog={userData?.activityLog || {}} size="md" />
      </div>

      {/* Reviews Received */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" /> Reviews</h2>
        {myReviews.length > 0 ? (
          <div className="space-y-3">
            {myReviews.map((r, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={r.fromUserName} userId={r.fromUserId} size="sm" />
                    <span className="text-sm font-semibold text-white">{r.fromUserName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={r.rating} />
                    <span className="text-xs text-dark-500">{timeAgo(r.createdAt)}</span>
                  </div>
                </div>
                {r.text && <p className="text-sm text-dark-300">{r.text}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-500 text-sm text-center py-4">No reviews yet</p>
        )}
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-brand-400" /> Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a, i) => {
            const progress = Math.min(i < 2 ? a.max : Math.floor(Math.random() * a.max), a.max);
            const done = progress >= a.max;
            return (
              <div key={a.id} className={`glass rounded-xl p-4 ${!done ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{a.name}</p>
                  {done && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-dark-400 mb-2">{a.desc}</p>
                <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${(progress / a.max) * 100}%` }} />
                </div>
                <p className="text-[10px] text-dark-500 mt-1">{progress}/{a.max}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- ANALYTICS PAGE ---
const AnalyticsPage = ({ user, listings, messages, reviews }) => {
  const myListings = listings.filter(l => l.userId === user?.uid);
  const totalViews = myListings.reduce((s, l) => s + (l.views || 0), 0);
  const myMessages = messages?.filter(m => m.fromUserId === user?.uid) || [];

  const chartData = myListings.map(l => ({ name: trunc(l.skillOffered, 15), views: l.views || 0 }));
  const maxViews = Math.max(...chartData.map(d => d.views), 1);

  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BarChart3 className="w-6 h-6 text-brand-400" /> Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-blue-400', change: '+12%' },
          { label: 'Messages Sent', value: myMessages.length, icon: Send, color: 'text-purple-400', change: '+5%' },
          { label: 'Listings', value: myListings.length, icon: List, color: 'text-emerald-400', change: '+2' },
          { label: 'Avg Response Rate', value: '89%', icon: Activity, color: 'text-amber-400', change: '+3%' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Listings Performance Chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Listings Performance</h2>
        {chartData.length > 0 ? (
          <div className="flex items-end gap-3 h-48">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-dark-400">{d.views}</span>
                <div className="w-full bg-gradient-to-t from-brand-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: '4px' }} title={d.name} />
                <span className="text-[9px] text-dark-500 text-center truncate w-full">{d.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-500 text-sm text-center py-8">No data yet</p>
        )}
      </div>

      {/* Weekly Activity */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Weekly Activity</h2>
        <div className="flex items-end gap-2 h-32">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const val = Math.floor(Math.random() * 10) + 1;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg" style={{ height: `${(val / 10) * 100}%`, minHeight: '4px' }} />
                <span className="text-[10px] text-dark-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing */}
      {chartData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Performing Listing</h2>
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{chartData[0].name}</p>
              <p className="text-xs text-dark-400">{chartData[0].views} views</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SECTION 10: LAYOUT COMPONENTS
// ============================================================

// --- Header ---
const Header = ({ user, userData, onNavigate, onLogout, showToast, notifications, searchQuery, setSearchQuery, darkMode, setDarkMode, onNotifToggle, showNotif }) => (
  <header className="sticky top-0 z-40 glass border-b border-white/5">
    <div className="flex items-center justify-between px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Handshake className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold gradient-text hidden md:block">SkillSwap</span>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search skills, people..."
            className="w-full bg-dark-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={onNotifToggle} className="relative p-2 text-dark-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            {notifications?.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          <NotifPanel notifications={notifications} visible={showNotif} onClose={onNotifToggle} onMarkRead={() => {}} />
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded-xl px-2 py-1.5 transition-colors" onClick={() => onNavigate('profile')}>
          <UserAvatar name={user?.displayName || userData?.displayName} userId={user?.uid} size="sm" />
          <span className="text-sm text-white hidden md:block font-medium">{user?.displayName || 'User'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-dark-500 hidden md:block" />
        </div>

        <button onClick={onLogout} className="p-2 text-dark-400 hover:text-red-400 transition-colors" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);

// --- Sidebar (Desktop) ---
const Sidebar = ({ currentPage, onNavigate, collapsed }) => (
  <aside className={`hidden md:flex flex-col glass border-r border-white/5 ${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 shrink-0`}>
    <nav className="flex-1 py-4 px-2 space-y-1">
      {NAV_ITEMS.map(item => {
        const active = currentPage === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'gradient-bg text-white glow-sm' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}>
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  </aside>
);

// --- Bottom Nav (Mobile) ---
const BottomNav = ({ currentPage, onNavigate, unreadMsgs }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
    <div className="flex items-center justify-around py-2">
      {MOBILE_NAV.map(item => {
        const active = currentPage === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-brand-400' : 'text-dark-500'}`}>
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.id === 'messages' && unreadMsgs > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadMsgs}</span>
              )}
            </div>
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// --- Layout Wrapper ---
const Layout = ({ children, currentPage, onNavigate, onLogout, user, userData, showToast, notifications, searchQuery, setSearchQuery, darkMode, setDarkMode, showNotif, onNotifToggle, unreadMsgs, collapsed, setCollapsed }) => (
  <div className="min-h-screen bg-dark-950 flex flex-col">
    <Header user={user} userData={userData} onNavigate={onNavigate} onLogout={onLogout} showToast={showToast}
      notifications={notifications} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      darkMode={darkMode} setDarkMode={setDarkMode} showNotif={showNotif} onNotifToggle={onNotifToggle} />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} collapsed={collapsed} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
    <BottomNav currentPage={currentPage} onNavigate={onNavigate} unreadMsgs={unreadMsgs} />
  </div>
);

// ============================================================
// SECTION 11: MAIN APP COMPONENT
// ============================================================

const App = () => {
  // --- Navigation & Auth State ---
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Data State ---
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // --- UI State ---
  const [toast, setToast] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- Modal State ---
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [contactName, setContactName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeTarget, setExchangeTarget] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileTarget, setProfileTarget] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // --- Toast Helper ---
  const showToast = useCallback((type, message) => setToast({ type, message }), []);

  // --- Auth State Listener ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setCurrentPage('home');
        // Fetch user data
        getDoc(doc(db, 'users', u.uid)).then(docSnap => {
          if (docSnap.exists()) setUserData(docSnap.data());
        }).catch(() => {});
      } else {
        setCurrentPage('landing');
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- Firestore Real-time Listeners ---
  useEffect(() => {
    if (!user) return;
    // Listings
    const unsub1 = onSnapshot(collection(db, 'listings'), (snap) => {
      setListings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    // Messages
    const q2 = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsub2 = onSnapshot(q2, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    // Reviews
    const unsub3 = onSnapshot(collection(db, 'reviews'), (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    // Notifications
    const q4 = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(20));
    const unsub4 = onSnapshot(q4, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, [user]);

  // --- Load favorites from localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem('skillswap_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // --- Login Handler ---
  const handleLogin = useCallback(async (email, password, method = 'email') => {
    if (method === 'google') {
      await signInWithPopup(auth, googleProvider);
      const u = auth.currentUser;
      if (u) {
        await setDoc(doc(db, 'users', u.uid), {
          uid: u.uid, displayName: u.displayName || 'User', email: u.email || '',
          photoURL: u.photoURL || '', bio: '', blockedUsers: [], favorites: [], recentlyViewed: [],
          activityLog: {}, createdAt: new Date().toISOString(), streak: 0,
        }, { merge: true });
      }
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    showToast('success', 'Welcome back!');
  }, [showToast]);

  // --- Signup Handler ---
  const handleSignup = useCallback(async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid, displayName: name, email: cred.user.email,
      photoURL: '', bio: '', blockedUsers: [], favorites: [], recentlyViewed: [],
      activityLog: {}, createdAt: new Date().toISOString(), streak: 0,
    });
    showToast('success', 'Account created successfully!');
  }, [showToast]);

  // --- Logout Handler ---
  const handleLogout = useCallback(async () => {
    await signOut(auth);
    showToast('info', 'You have been logged out');
  }, [showToast]);

  // --- Toggle Favorite ---
  const toggleFavorite = useCallback((listingId) => {
    setFavorites(prev => {
      const next = prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId];
      localStorage.setItem('skillswap_favorites', JSON.stringify(next));
      return next;
    });
    showToast('info', 'Favorites updated!');
  }, [showToast]);

  // --- Post/Update Listing ---
  const handleSubmitListing = useCallback(async (data, editId) => {
    if (editId) {
      await updateDoc(doc(db, 'listings', editId), data);
    } else {
      await addDoc(collection(db, 'listings'), { ...data, createdAt: serverTimestamp(), views: 0, favorites: 0 });
    }
    setCurrentPage('mylistings');
  }, []);

  // --- Delete Listing ---
  const handleDeleteListing = useCallback(async () => {
    if (deleteTarget) {
      await deleteDoc(doc(db, 'listings', deleteTarget.id));
      showToast('success', 'Listing deleted');
      setShowDelete(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, showToast]);

  // --- Send Message ---
  const handleSendMessage = useCallback(async (toUserId, text) => {
    if (!user || !text) return;
    const partnerName = listings.find(l => l.userId === toUserId)?.userName || 'User';
    await addDoc(collection(db, 'messages'), {
      fromUserId: user.uid, fromUserName: user.displayName || 'User',
      toUserId, toUserName: partnerName, text, createdAt: serverTimestamp(), read: false,
    });
  }, [user, listings]);

  // --- Unread Message Count ---
  const unreadMsgs = useMemo(() => {
    if (!messages || !user) return 0;
    return messages.filter(m => m.toUserId === user.uid && !m.read).length;
  }, [messages, user]);

  // --- Navigate ---
  const navigate = useCallback((page) => {
    setCurrentPage(page);
    setEditingListing(null);
    window.scrollTo(0, 0);
  }, []);

  // --- Loading Screen ---
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center slide-up">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Handshake className="w-9 h-9 text-white" />
          </div>
          <p className="text-dark-400 text-sm">Loading SkillSwap...</p>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ScrollToTop />

      {/* Welcome Modal */}
      <WelcomeModal visible={showWelcome} onClose={() => setShowWelcome(false)} onSubmit={async (name) => {
        if (user) {
          await updateProfile(user, { displayName: name });
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid, displayName: name, email: user.email || '',
            photoURL: '', bio: '', blockedUsers: [], favorites: [], recentlyViewed: [],
            activityLog: {}, createdAt: new Date().toISOString(), streak: 0,
          }, { merge: true });
          setUserData(prev => ({ ...prev, displayName: name }));
        }
        setShowWelcome(false);
        showToast('success', `Welcome, ${name}!`);
      }} />

      {/* Delete Modal */}
      <DeleteModal visible={showDelete} onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDeleteListing} itemName={deleteTarget?.skillOffered || ''} />

      {/* Contact Modal */}
      <ContactModal visible={showContact} onClose={() => setShowContact(false)} contactInfo={contactInfo} userName={contactName} />

      {/* Report Modal */}
      <ReportModal visible={showReport} onClose={() => { setShowReport(false); setReportTarget(null); }}
        onSubmit={async (reason, desc) => {
          if (reportTarget && user) {
            await addDoc(collection(db, 'reports'), { listingId: reportTarget.id, reportedBy: user.uid, reason, desc, createdAt: serverTimestamp() });
            showToast('success', 'Report submitted');
          }
          setShowReport(false); setReportTarget(null);
        }} />

      {/* Review Modal */}
      <ReviewModal visible={showReview} onClose={() => { setShowReview(false); setReviewTarget(null); }}
        onSubmit={async (rating, text) => {
          if (reviewTarget && user) {
            await addDoc(collection(db, 'reviews'), {
              fromUserId: user.uid, fromUserName: user.displayName || 'User',
              toUserId: reviewTarget.userId, toUserName: reviewTarget.userName,
              rating, text, createdAt: serverTimestamp(),
            });
            showToast('success', 'Review submitted!');
          }
          setShowReview(false); setReviewTarget(null);
        }} userName={reviewTarget?.userName} />

      {/* Exchange Modal */}
      <ExchangeModal visible={showExchange} onClose={() => { setShowExchange(false); setExchangeTarget(null); }}
        onSubmit={async (msg) => {
          if (exchangeTarget && user) {
            await handleSendMessage(exchangeTarget.userId, `Exchange Proposal: ${msg}`);
            showToast('success', 'Exchange proposal sent!');
          }
          setShowExchange(false); setExchangeTarget(null);
        }} listing={exchangeTarget} />

      {/* User Profile Modal */}
      <UserProfileModal visible={showUserProfile} onClose={() => { setShowUserProfile(false); setProfileTarget(null); }}
        user={profileTarget}
        listings={listings.filter(l => l.userId === profileTarget?.userId)}
        reviews={reviews?.filter(r => r.toUserId === profileTarget?.userId)} />

      {/* Image Preview Modal */}
      <ImagePreviewModal visible={showImagePreview} onClose={() => { setShowImagePreview(false); setImagePreviewUrl(''); }} imageUrl={imagePreviewUrl} />

      {/* ==================== ROUTING ==================== */}
      {!user ? (
        <>
          {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={navigate} onLogin={handleLogin} showToast={showToast} />}
          {currentPage === 'signup' && <SignupPage onNavigate={navigate} onSignup={handleSignup} showToast={showToast} />}
        </>
      ) : (
        <Layout currentPage={currentPage} onNavigate={navigate} onLogout={handleLogout} user={user} userData={userData}
          showToast={showToast} notifications={notifications} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          darkMode={darkMode} setDarkMode={setDarkMode} showNotif={showNotif} onNotifToggle={() => setShowNotif(!showNotif)}
          unreadMsgs={unreadMsgs} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>

          {currentPage === 'home' && (
            <HomePage user={user} userData={userData} listings={listings} favorites={favorites}
              onToggleFavorite={toggleFavorite} onViewListing={(l) => {}} onNavigate={navigate} messages={messages} reviews={reviews} />
          )}
          {currentPage === 'explore' && (
            <ExplorePage listings={listings} favorites={favorites} onToggleFavorite={toggleFavorite}
              onViewListing={(l) => { if (l.imageUrl) { setImagePreviewUrl(l.imageUrl); setShowImagePreview(true); }}}
              currentUser={user} blockedUsers={userData?.blockedUsers || []} />
          )}
          {currentPage === 'messages' && (
            <MessagesPage user={user} messages={messages} onSendMessage={handleSendMessage} allListings={listings} />
          )}
          {currentPage === 'post' && (
            <PostPage user={user} userData={userData} showToast={showToast} editingListing={editingListing}
              onClearEdit={() => setEditingListing(null)} onSubmit={handleSubmitListing} />
          )}
          {currentPage === 'favorites' && (
            <FavoritesPage listings={listings} favorites={favorites} onToggleFavorite={toggleFavorite}
              onViewListing={(l) => {}} currentUser={user} onNavigate={navigate} />
          )}
          {currentPage === 'mylistings' && (
            <MyListingsPage user={user} listings={listings} reviews={reviews}
              onEdit={(l) => { setEditingListing(l); navigate('post'); }}
              onDelete={(l) => { setDeleteTarget(l); setShowDelete(true); }}
              onViewListing={(l) => {}} onNavigate={navigate} />
          )}
          {currentPage === 'leaderboard' && (
            <LeaderboardPage listings={listings} reviews={reviews} user={user} />
          )}
          {currentPage === 'profile' && (
            <ProfilePage user={user} userData={userData} listings={listings} reviews={reviews}
              favorites={favorites} messages={messages} onNavigate={navigate} showToast={showToast} />
          )}
          {currentPage === 'analytics' && (
            <AnalyticsPage user={user} listings={listings} messages={messages} reviews={reviews} />
          )}
        </Layout>
      )}
    </>
  );
};

// SECTION 12: EXPORT DEFAULT
export default App;
