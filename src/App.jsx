// ============================================
// BARTER EXCHANGE APP — ENHANCED ULTRA PREMIUM
// ALL features in ONE FILE: App.jsx
// Only update this file to add/modify features.
// Other files (main.jsx, index.css) stay the same.
// ============================================

// ============================================
// SECTION 1: IMPORTS
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Home, Search, PlusCircle, Layers, User, X, Check, Edit2, Trash2,
  MessageCircle, Clock, ChevronRight, Sparkles, ArrowRight,
  Menu, LogOut, AlertCircle, Info, CheckCircle, Loader2,
  Send, Mail, Phone, Globe, BookOpen, Briefcase, Camera,
  Music, Heart, PenTool, Code, TrendingUp, Zap, Shield,
  Award, Users, FolderOpen, ExternalLink, Copy, RefreshCw,
  Star, Flag, Bell, Sun, Moon, Trophy, Target, Flame,
  Lock, Eye, Share2, Hash, BarChart3, Activity, Crown,
  ChevronDown, Bookmark, MessageSquare, Ban
} from 'lucide-react'
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp,
  getDocs, where, limit, setDoc, getDoc, writeBatch
} from 'firebase/firestore'
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'firebase/auth'

// ============================================
// SECTION 2: FIREBASE CONFIG
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyAjAgUdBwyu820JqxtAr3546J90trnNImI",
  authDomain: "skillswap-48163.firebaseapp.com",
  projectId: "skillswap-48163",
  storageBucket: "skillswap-48163.firebasestorage.app",
  messagingSenderId: "953886423467",
  appId: "1:953886423467:web:47dcc723d89d9765de7aee"
}
const fbApp = initializeApp(firebaseConfig)
const db = getFirestore(fbApp)
const auth = getAuth(fbApp)

// ============================================
// SECTION 3: CONSTANTS
// ============================================
const CATEGORIES = [
  { id: 'design', label: 'Design & Creative', icon: PenTool, color: 'from-pink-500 to-rose-500' },
  { id: 'programming', label: 'Programming & Tech', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { id: 'business', label: 'Business & Marketing', icon: Briefcase, color: 'from-amber-500 to-orange-500' },
  { id: 'language', label: 'Language & Translation', icon: Globe, color: 'from-emerald-500 to-teal-500' },
  { id: 'music', label: 'Music & Audio', icon: Music, color: 'from-violet-500 to-purple-500' },
  { id: 'education', label: 'Education & Tutoring', icon: BookOpen, color: 'from-sky-500 to-blue-500' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, color: 'from-red-500 to-pink-500' },
  { id: 'photography', label: 'Photography & Video', icon: Camera, color: 'from-indigo-500 to-violet-500' },
  { id: 'writing', label: 'Writing & Content', icon: PenTool, color: 'from-teal-500 to-emerald-500' },
  { id: 'other', label: 'Other', icon: FolderOpen, color: 'from-slate-500 to-gray-500' },
]
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'post', label: 'Post', icon: PlusCircle },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'my-listings', label: 'My Listings', icon: Layers },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
]
const MOBILE_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'post', label: 'Post', icon: PlusCircle },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
]
const HOW_IT_WORKS = [
  { step: 1, title: 'Post Your Skill', description: 'Share what you can offer and what you want to learn in return.', icon: PlusCircle, gradient: 'from-emerald-500 to-teal-500' },
  { step: 2, title: 'Browse & Discover', description: 'Explore skills from people around the world. Filter by category.', icon: Search, gradient: 'from-blue-500 to-indigo-500' },
  { step: 3, title: 'Connect & Exchange', description: 'Contact the person, arrange the exchange, and start learning.', icon: MessageCircle, gradient: 'from-violet-500 to-purple-500' },
]
const BADGES = [
  { id: 'first_post', name: 'First Step', desc: 'Posted your first listing', icon: Sparkles, color: 'from-amber-400 to-yellow-500' },
  { id: 'social', name: 'Social Butterfly', desc: 'Received 3+ reviews', icon: Users, color: 'from-pink-400 to-rose-500' },
  { id: 'contributor', name: 'Top Contributor', desc: 'Posted 10+ listings', icon: Award, color: 'from-blue-400 to-cyan-500' },
  { id: 'trusted', name: 'Community Star', desc: 'Trust score 50+', icon: Star, color: 'from-emerald-400 to-teal-500' },
  { id: 'legend', name: 'Legendary', desc: 'Trust score 90+', icon: Crown, color: 'from-purple-400 to-fuchsia-500' },
  { id: 'messenger', name: 'Chatterbox', desc: 'Sent 20+ messages', icon: MessageCircle, color: 'from-sky-400 to-blue-500' },
  { id: 'collector', name: 'Collector', desc: 'Favorited 10+ listings', icon: Heart, color: 'from-red-400 to-pink-500' },
  { id: 'active', name: 'On Fire', desc: '7-day activity streak', icon: Flame, color: 'from-orange-400 to-red-500' },
]
const TITLES = [
  { min: 0, max: 10, label: 'Beginner', color: 'text-gray-400' },
  { min: 11, max: 30, label: 'Exchanger', color: 'text-blue-400' },
  { min: 31, max: 60, label: 'Expert Trader', color: 'text-purple-400' },
  { min: 61, max: 90, label: 'Master', color: 'text-amber-400' },
  { min: 91, max: 200, label: 'Legend', color: 'text-yellow-400' },
]
const ACHIEVEMENTS = [
  { id: 'first_listing', name: 'Getting Started', desc: 'Post your first skill listing', icon: PlusCircle, need: 'listings', count: 1 },
  { id: 'five_listings', name: 'Active Trader', desc: 'Post 5 skill listings', icon: Layers, need: 'listings', count: 5 },
  { id: 'ten_listings', name: 'Power Poster', desc: 'Post 10 skill listings', icon: TrendingUp, need: 'listings', count: 10 },
  { id: 'first_review', name: 'First Feedback', desc: 'Receive your first review', icon: Star, need: 'reviews', count: 1 },
  { id: 'five_reviews', name: 'Well Reviewed', desc: 'Receive 5 reviews', icon: Award, need: 'reviews', count: 5 },
  { id: 'ten_reviews', name: 'Community Favorite', desc: 'Receive 10 reviews', icon: Heart, need: 'reviews', count: 10 },
  { id: 'ten_favorites', name: 'Taste Hunter', desc: 'Save 10 favorites', icon: Target, need: 'favorites', count: 10 },
  { id: 'trust_50', name: 'Trusted Member', desc: 'Reach trust score of 50', icon: Shield, need: 'trust', count: 50 },
  { id: 'trust_100', name: 'Legendary Status', desc: 'Reach trust score of 100', icon: Crown, need: 'trust', count: 100 },
  { id: 'all_categories', name: 'Explorer', desc: 'Post in all 10 categories', icon: Globe, need: 'categories', count: 10 },
]

// ============================================
// SECTION 4: HELPERS
// ============================================
const timeAgo = (ts) => {
  if (!ts) return 'Just now'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  const dy = Math.floor(h / 24)
  if (dy < 30) return dy + 'd ago'
  return Math.floor(dy / 30) + 'mo ago'
}
const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[9]
const initials = (n) => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'
const userGrad = (uid) => {
  const g = ['from-indigo-500 to-purple-500','from-blue-500 to-cyan-500','from-emerald-500 to-teal-500','from-rose-500 to-pink-500','from-amber-500 to-orange-500','from-violet-500 to-fuchsia-500']
  if (!uid) return g[0]
  return g[uid.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % g.length]
}
const trunc = (t, l) => (!t || t.length <= l) ? t : t.slice(0, l) + '...'
const trustScore = (lc, rc, ar) => Math.min(100, Math.round(lc * 1 + rc * 2 + ar * 3))
const userTitle = (s) => TITLES.find(t => s >= t.min && s <= t.max) || TITLES[0]
const todayKey = () => new Date().toISOString().split('T')[0]
const isBlocked = (bl, uid) => bl && bl.includes(uid)
const heatmapData = (log) => {
  const w = []; const td = new Date()
  for (let i = 11; i >= 0; i--) { const wk = []; for (let d = 0; d < 7; d++) { const dt = new Date(td); dt.setDate(dt.getDate() - (i * 7 + (6 - d))); const k = dt.toISOString().split('T')[0]; wk.push({ date: k, count: (log && log[k]) || 0 }) } w.push(wk) }
  return w
}
const heatColor = (c) => c === 0 ? 'bg-white/5' : c === 1 ? 'bg-emerald-500/30' : c === 2 ? 'bg-emerald-500/50' : c <= 4 ? 'bg-emerald-500/70' : 'bg-emerald-500'
const trendingCats = (listings) => {
  const ct = {}; listings.forEach(l => { ct[l.category] = (ct[l.category] || 0) + 1 })
  return Object.entries(ct).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id, count]) => ({ ...getCat(id), count }))
}
const matchingSuggestions = (listings, uid) => {
  const my = listings.filter(l => l.userId === uid).map(l => l.skillOffered.toLowerCase())
  return listings.filter(l => l.userId !== uid && my.some(s => l.skillWanted.toLowerCase().includes(s) || s.includes(l.skillWanted.toLowerCase()))).slice(0, 6)
}
const leaderboardData = (listings, reviews) => {
  const us = {}
  listings.forEach(l => { if (!us[l.userId]) us[l.userId] = { userId: l.userId, userName: l.userName, lc: 0, rc: 0, tr: 0 }; us[l.userId].lc++ })
  reviews.forEach(r => { if (us[r.toUserId]) { us[r.toUserId].rc++; us[r.toUserId].tr += r.rating } })
  return Object.values(us).map(u => ({ ...u, avg: u.rc > 0 ? (u.tr / u.rc).toFixed(1) : '0', score: trustScore(u.lc, u.rc, u.rc > 0 ? u.tr / u.rc : 0) })).sort((a, b) => b.score - a.score).slice(0, 10)
}
const getUnlockedBadges = (score, lc, rc, fc, msgCount, streak) => {
  const u = []
  if (lc >= 1) u.push(BADGES[0]); if (rc >= 3) u.push(BADGES[1]); if (lc >= 10) u.push(BADGES[2])
  if (score >= 50) u.push(BADGES[3]); if (score >= 90) u.push(BADGES[4])
  if (msgCount >= 20) u.push(BADGES[5]); if (fc >= 10) u.push(BADGES[6]); if (streak >= 7) u.push(BADGES[7])
  return u
}

// ============================================
// SECTION 5: SMALL COMPONENTS
// ============================================
const Toast = ({ toast, onClose }) => {
  useEffect(() => { if (!toast) return; const t = setTimeout(() => onClose(), 3000); return () => clearTimeout(t) }, [toast, onClose])
  if (!toast) return null
  const st = { success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', error: 'bg-red-500/20 border-red-500/30 text-red-300', info: 'bg-blue-500/20 border-blue-500/30 text-blue-300', warning: 'bg-amber-500/20 border-amber-500/30 text-amber-300' }
  const ic = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertCircle }
  const Icon = ic[toast.type] || Info
  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-up">
      <div className={`glass rounded-xl px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md border ${st[toast.type] || st.info}`}>
        <Icon size={20} /><span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={onClose} className="hover:bg-white/10 rounded-lg p-1"><X size={16} /></button>
      </div>
    </div>
  )
}
const WelcomeModal = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState(''), [err, setErr] = useState('')
  const go = (e) => { e.preventDefault(); if (!name.trim() || name.trim().length < 2) { setErr('Name must be at least 2 characters'); return } onSubmit(name.trim()); setName(''); setErr('') }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full animate-slide-up">
        <div className="text-center mb-6"><div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow"><Sparkles className="text-white" size={32} /></div><h2 className="text-2xl font-bold text-white mb-2">Welcome to Barter Exchange</h2><p className="text-gray-400">Enter your name to get started. No email or password needed.</p></div>
        <form onSubmit={go}><div className="mb-4"><input type="text" value={name} onChange={(e) => { setName(e.target.value); setErr('') }} placeholder="Your display name" className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all" autoFocus />{err && <p className="text-red-400 text-sm mt-2">{err}</p>}</div><button type="submit" className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity glow">Get Started</button></form>
      </div>
    </div>
  )
}
const DeleteModal = ({ isOpen, listing, onConfirm, onCancel }) => {
  if (!isOpen || !listing) return null
  return (<div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"><div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up"><div className="text-center mb-6"><div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-400" size={24} /></div><h3 className="text-xl font-bold text-white mb-2">Delete Listing?</h3><p className="text-gray-400">Are you sure you want to delete <span className="text-white font-medium">"{listing.skillOffered}"</span>?</p></div><div className="flex gap-3"><button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10">Cancel</button><button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 border border-red-500/30">Delete</button></div></div></div>)
}
const ContactModal = ({ isOpen, listing, onClose }) => {
  if (!isOpen || !listing) return null
  return (<div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"><div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-white">Contact Information</h3><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} className="text-gray-400" /></button></div><div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5"><div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGrad(listing.userId)} flex items-center justify-center`}><span className="text-white font-bold text-sm">{initials(listing.userName)}</span></div><div><p className="text-white font-semibold">{listing.userName}</p><p className="text-gray-400 text-sm">Listing Owner</p></div></div><div className="space-y-4 mb-6"><div className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" /><div><p className="text-gray-400 text-sm">Offers</p><p className="text-white font-medium">{listing.skillOffered}</p></div></div><div className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" /><div><p className="text-gray-400 text-sm">Wants</p><p className="text-white font-medium">{listing.skillWanted}</p></div></div></div>{listing.contactInfo ? <div className="p-4 rounded-xl bg-white/5 border border-white/10"><p className="text-gray-400 text-sm mb-2">Contact Details</p><p className="text-white font-medium break-all">{listing.contactInfo}</p></div> : <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"><p className="text-gray-400">No contact information provided.</p></div>}</div></div>)
}
const ReportModal = ({ isOpen, listing, onClose, onReport }) => {
  const [reason, setReason] = useState(''), [custom, setCustom] = useState('')
  const reasons = ['Inappropriate content', 'Spam or misleading', 'Fake listing', 'Harassment', 'Other']
  if (!isOpen) return null
  const go = () => { const r = reason === 'Other' ? custom : reason; if (r.trim()) { onReport(listing, r.trim()); setReason(''); setCustom('') } }
  return (<div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"><div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Flag size={20} className="text-amber-400" /> Report Listing</h3><button onClick={() => { onClose(); setReason(''); setCustom('') }} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} className="text-gray-400" /></button></div><div className="space-y-2 mb-4">{reasons.map(r => (<button key={r} onClick={() => setReason(r)} className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${reason === r ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'}`}>{r}</button>))}</div>{reason === 'Other' && <textarea value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Please explain..." rows={3} className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 resize-none mb-4" />}<div className="flex gap-3"><button onClick={() => { onClose(); setReason(''); setCustom('') }} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10">Cancel</button><button onClick={go} disabled={!reason || (reason === 'Other' && !custom.trim())} className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-300 font-medium hover:bg-amber-500/30 border border-amber-500/30 disabled:opacity-40">Report</button></div></div></div>)
}
const ReviewModal = ({ isOpen, targetUser, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0), [text, setText] = useState('')
  if (!isOpen) return null
  const go = () => { if (rating > 0) { onSubmit(targetUser.userId, rating, text.trim()); setRating(0); setText('') } }
  return (<div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"><div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Star size={20} className="text-amber-400" /> Write a Review</h3><button onClick={() => { onClose(); setRating(0); setText('') }} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} className="text-gray-400" /></button></div><div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5"><div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(targetUser.userId)} flex items-center justify-center`}><span className="text-white font-bold text-sm">{initials(targetUser.userName)}</span></div><span className="text-white font-medium">{targetUser.userName}</span></div><div className="mb-4"><p className="text-gray-400 text-sm mb-2">Your Rating</p><div className="flex gap-2">{[1,2,3,4,5].map(s => (<button key={s} onClick={() => setRating(s)} className="p-1 hover:scale-110 transition-transform"><Star size={28} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} /></button>))}</div></div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience (optional)..." rows={3} className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 resize-none mb-4" /><div className="flex gap-3"><button onClick={() => { onClose(); setRating(0); setText('') }} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10">Cancel</button><button onClick={go} disabled={rating === 0} className="flex-1 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 disabled:opacity-40 glow">Submit Review</button></div></div></div>)
}
const RatingStars = ({ rating, count }) => (
  <div className="flex items-center gap-1.5"><div className="flex">{[1,2,3,4,5].map(s => (<Star key={s} size={14} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />))}</div>{count !== undefined && <span className="text-xs text-gray-500">({count})</span>}</div>
)
const TrustRing = ({ score, sz = 80 }) => {
  const r = (sz - 8) / 2, c = 2 * Math.PI * r, p = (score / 100) * c
  const col = score >= 90 ? '#eab308' : score >= 50 ? '#10b981' : score >= 20 ? '#6366f1' : '#6b7280'
  return (<div className="relative inline-flex items-center justify-center" style={{ width: sz, height: sz }}><svg width={sz} height={sz} className="transform -rotate-90"><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" /><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth="4" strokeDasharray={c} strokeDashoffset={c - p} strokeLinecap="round" className="transition-all duration-1000" /></svg><span className="absolute text-lg font-bold text-white">{score}</span></div>)
}
const BadgesRow = ({ badges }) => {
  if (!badges || !badges.length) return null
  return (<div className="flex flex-wrap gap-2">{badges.map(b => { const I = b.icon; return (<div key={b.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10" title={b.desc}><div className={`w-5 h-5 rounded-md bg-gradient-to-br ${b.color} flex items-center justify-center`}><I size={12} className="text-white" /></div><span className="text-xs text-gray-300">{b.name}</span></div>) })}</div>)
}
const Heatmap = ({ log }) => {
  const w = heatmapData(log)
  return (<div className="flex gap-1 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>{w.map((wk, wi) => (<div key={wi} className="flex flex-col gap-1">{wk.map((d, di) => (<div key={di} className={`w-3 h-3 rounded-sm ${heatColor(d.count)}`} title={`${d.date}: ${d.count} actions`} />))}</div>))}</div>)
}
const LoadingSkeleton = ({ count = 6 }) => (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: count }).map((_, i) => (<div key={i} className="glass rounded-2xl p-5 animate-pulse"><div className="flex items-center justify-between mb-4"><div className="h-6 w-20 bg-white/10 rounded-full" /><div className="h-4 w-12 bg-white/10 rounded" /></div><div className="h-5 w-3/4 bg-white/10 rounded mb-2" /><div className="h-5 w-1/2 bg-white/10 rounded mb-4" /><div className="h-16 bg-white/5 rounded-lg mb-4" /><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/10" /><div className="h-4 w-24 bg-white/10 rounded" /></div></div>))}</div>)
const EmptyState = ({ icon: Icon, title, desc, actionLabel, onAction }) => (<div className="flex flex-col items-center justify-center py-16 text-center"><div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4"><Icon size={32} className="text-gray-500" /></div><h3 className="text-xl font-semibold text-white mb-2">{title}</h3><p className="text-gray-400 max-w-sm mb-6">{desc}</p>{actionLabel && onAction && <button onClick={onAction} className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90">{actionLabel}</button>}</div>)
const NotifPanel = ({ isOpen, notifs, onClose, onRead, onNav }) => {
  const ref = useRef(null)
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }; if (isOpen) document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [isOpen, onClose])
  if (!isOpen) return null
  const ur = notifs.filter(n => !n.read).length
  return (<div ref={ref} className="absolute top-full right-0 mt-2 w-80 glass-strong rounded-2xl border border-white/10 overflow-hidden animate-slide-up z-50"><div className="p-4 border-b border-white/10 flex items-center justify-between"><h3 className="font-bold text-white">Notifications</h3>{ur > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-from/20 text-brand-from">{ur} new</span>}</div><div className="max-h-80 overflow-y-auto">{notifs.length > 0 ? notifs.slice(0, 10).map(n => (<button key={n.id} onClick={() => { onRead(n.id); if (n.link) onNav(n.link) }} className={`w-full text-left p-3 hover:bg-white/5 border-b border-white/5 last:border-0 ${!n.read ? 'bg-white/[0.03]' : ''}`}><p className="text-sm text-white">{n.message}</p><p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p></button>)) : <p className="p-4 text-center text-gray-500 text-sm">No notifications yet</p>}</div></div>)
}

// Skill Card — Enhanced with favorites, tags, share, report, message
const SkillCard = ({ listing, uid, onEdit, onDelete, onContact, onFav, onReport, onMsg, onShare, onUser, isFav, showAct = true }) => {
  const cat = getCat(listing.category), CI = cat.icon, own = uid && listing.userId === uid
  return (<div className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cat.color} text-white`}><CI size={12} />{cat.label}</span>
      <div className="flex items-center gap-1">
        {!own && isFav !== undefined && <button onClick={() => onFav && onFav(listing)} className="p-1.5 rounded-lg hover:bg-white/10" title="Favorite"><Heart size={16} className={isFav ? 'text-red-400 fill-red-400' : 'text-gray-500'} /></button>}
        <button onClick={() => onShare && onShare(listing)} className="p-1.5 rounded-lg hover:bg-white/10" title="Copy Link"><Share2 size={14} className="text-gray-500" /></button>
        <span className="text-gray-500 text-xs flex items-center gap-1 ml-1"><Clock size={12} />{timeAgo(listing.createdAt)}</span>
      </div>
    </div>
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" /><span className="text-gray-400 text-sm">I Offer</span><span className="text-white font-semibold text-sm">{listing.skillOffered}</span></div>
      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" /><span className="text-gray-400 text-sm">I Want</span><span className="text-white font-semibold text-sm">{listing.skillWanted}</span></div>
    </div>
    {listing.description && <p className="text-gray-400 text-sm line-clamp-2 mb-3">{listing.description}</p>}
    {listing.tags && listing.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mb-3">{listing.tags.slice(0, 3).map((t, i) => (<span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-xs flex items-center gap-1"><Hash size={10} />{t}</span>))}{listing.tags.length > 3 && <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-xs">+{listing.tags.length - 3}</span>}</div>}
    {listing.contactInfo && <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 mb-3"><p className="text-gray-500 text-xs flex items-center gap-1.5"><Mail size={12} />{trunc(listing.contactInfo, 40)}</p></div>}
    <div className="flex items-center justify-between pt-3 border-t border-white/5">
      <button onClick={() => onUser && onUser(listing)} className="flex items-center gap-2.5 hover:opacity-80 transition-all">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(listing.userId)} flex items-center justify-center`}><span className="text-white font-bold text-xs">{initials(listing.userName)}</span></div>
        <div><span className="text-gray-300 text-sm font-medium block">{listing.userName}</span></div>
      </button>
      {showAct && <div className="flex items-center gap-1.5">{own ? (<><button onClick={() => onEdit && onEdit(listing)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10" title="Edit"><Edit2 size={16} /></button><button onClick={() => onDelete && onDelete(listing)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 size={16} /></button></>) : (<><button onClick={() => onMsg && onMsg(listing)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-brand-from hover:bg-white/10" title="Message"><MessageCircle size={16} /></button><button onClick={() => onContact && onContact(listing)} className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium flex items-center gap-1.5"><MessageCircle size={14} />Contact</button><button onClick={() => onReport && onReport(listing)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10" title="Report"><Flag size={14} /></button></>)}</div>}
    </div>
  </div>)
}

// ============================================
// SECTION 6: PAGE COMPONENTS
// ============================================

// --- HOME PAGE ---
const HomePage = ({ listings, userName, uid, onNav, stats, favorites, recentlyViewed, blockedUsers }) => {
  const recent = listings.filter(l => !isBlocked(blockedUsers, l.userId)).slice(0, 3)
  const trending = trendingCats(listings)
  const suggested = uid ? matchingSuggestions(listings.filter(l => !isBlocked(blockedUsers, l.userId)), uid) : []
  const maxCatCount = trending.length > 0 ? trending[0].count : 1
  const viewedListings = recentlyViewed ? listings.filter(l => recentlyViewed.includes(l.id)).slice(0, 3) : []

  return (<div className="space-y-10 pb-8">
    <section className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-dark-800 to-purple-900/40" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="relative px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4"><span className="gradient-text">Barter Exchange</span></h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">Exchange Skills, Not Money.</p>
        {userName && <p className="text-gray-400 mb-8">Welcome back, {userName}!</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onNav('explore')} className="px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 glow flex items-center justify-center gap-2"><Search size={18} />Explore Skills</button>
          <button onClick={() => onNav('post')} className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 border border-white/10 flex items-center justify-center gap-2"><PlusCircle size={18} />Post Your Skill</button>
        </div>
      </div>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[{ label: 'Skills Listed', value: stats.totalListings, icon: Zap }, { label: 'Community', value: stats.uniqueUsers, icon: Users }, { label: 'Categories', value: stats.totalCategories, icon: FolderOpen }].map(s => (
        <div key={s.label} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.07] transition-all"><div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3"><s.icon size={24} className="text-brand-from" /></div><p className="text-3xl font-bold text-white mb-1">{s.value}</p><p className="text-gray-400 text-sm">{s.label}</p></div>
      ))}
    </section>
    {suggested.length > 0 && <section>
      <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles size={20} className="text-amber-400" />Suggested For You</h2></div>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>{suggested.map(l => (<div key={l.id} className="glass rounded-2xl p-4 min-w-[280px] hover:bg-white/[0.07] transition-all"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getCat(l.category).color} text-white mb-2`}>{getCat(l.category).label}</span><p className="text-white font-semibold text-sm">Offers: {l.skillOffered}</p><p className="text-gray-400 text-sm">Wants: {l.skillWanted}</p><p className="text-gray-500 text-xs mt-2">{l.userName}</p></div>))}</div>
    </section>}
    {trending.length > 0 && <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-emerald-400" />Trending Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">{trending.map(t => { const CI = t.icon; return (<div key={t.id} className="glass rounded-xl p-4 hover:bg-white/[0.07] transition-all"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}><CI size={16} className="text-white" /></div><span className="text-sm text-white font-medium">{t.label}</span></div><span className="text-xs text-gray-400">{t.count} listings</span></div><div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all`} style={{ width: (t.count / maxCatCount * 100) + '%' }} /></div></div>) })}</div>
    </section>}
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{HOW_IT_WORKS.map(item => (<div key={item.step} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.07] group"><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}><item.icon className="text-white" size={28} /></div><div className="text-xs font-bold text-brand-from mb-2">Step {item.step}</div><h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3><p className="text-gray-400 text-sm">{item.description}</p></div>))}</div>
    </section>
    {viewedListings.length > 0 && <section><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Eye size={20} className="text-blue-400" />Recently Viewed</h2></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{viewedListings.map(l => (<SkillCard key={l.id} listing={l} uid={uid} onUser={() => {}} />))}</div></section>}
    <section>
      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Recent Listings</h2><button onClick={() => onNav('explore')} className="text-brand-from hover:text-brand-to text-sm font-medium flex items-center gap-1">View All<ChevronRight size={16} /></button></div>
      {recent.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{recent.map(l => (<SkillCard key={l.id} listing={l} uid={uid} onUser={() => {}} />))}</div> : <EmptyState icon={FolderOpen} title="No listings yet" desc="Be the first to post a skill!" actionLabel="Post a Skill" onAction={() => onNav('post')} />}
    </section>
  </div>)
}

// --- EXPLORE PAGE ---
const ExplorePage = ({ listings, loading, uid, onEdit, onDelete, onContact, onFav, onReport, onMsg, onShare, onUser, favIds, blockedUsers }) => {
  const [search, setSearch] = useState(''), [cat, setCat] = useState('all'), [sort, setSort] = useState('newest')
  const filtered = listings.filter(l => {
    if (isBlocked(blockedUsers, l.userId)) return false
    const q = search.toLowerCase()
    const ms = !q || l.skillOffered.toLowerCase().includes(q) || l.skillWanted.toLowerCase().includes(q) || l.userName.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q)) || (l.tags && l.tags.some(t => t.toLowerCase().includes(q)))
    return ms && (cat === 'all' || l.category === cat)
  }).sort((a, b) => {
    if (sort === 'oldest') return ((a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
    return ((b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  })
  return (<div className="space-y-6">
    <div className="flex items-center gap-3 mb-2"><Search className="text-brand-from" size={28} /><h1 className="text-2xl md:text-3xl font-bold text-white">Explore Skills</h1></div>
    <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills, people, tags..." className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all" />{search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg"><X size={18} className="text-gray-500" /></button>}</div>
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}><button onClick={() => setCat('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${cat === 'all' ? 'gradient-bg text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>All</button>{CATEGORIES.map(c => (<button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${cat === c.id ? 'gradient-bg text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>{c.label}</button>))}</div>
    <div className="flex items-center justify-between"><p className="text-gray-400 text-sm">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p><select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none"><option value="newest" className="bg-dark-800">Newest</option><option value="oldest" className="bg-dark-800">Oldest</option></select></div>
    {loading ? <LoadingSkeleton /> : filtered.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(l => (<SkillCard key={l.id} listing={l} uid={uid} onEdit={onEdit} onDelete={onDelete} onContact={onContact} onFav={onFav} onReport={onReport} onMsg={onMsg} onShare={onShare} onUser={onUser} isFav={favIds && favIds.includes(l.id)} />))}</div> : <EmptyState icon={Search} title="No listings found" desc={search || cat !== 'all' ? "Try adjusting your search or filters." : "No skills posted yet. Be the first!"} />}
  </div>)
}

// --- POST PAGE (with draft auto-save, tags, real-time validation, duplicate detection) ---
const PostPage = ({ uid, userName, editing, onSubmit, onCancel, toast, existingListings }) => {
  const [form, setForm] = useState({ skillOffered: '', skillWanted: '', category: '', description: '', contactInfo: '', tags: '' })
  const [errors, setErrors] = useState({}), [submitting, setSubmitting] = useState(false), [draftSaved, setDraftSaved] = useState(false), [duplicate, setDuplicate] = useState(null)

  useEffect(() => {
    if (editing) { setForm({ skillOffered: editing.skillOffered || '', skillWanted: editing.skillWanted || '', category: editing.category || '', description: editing.description || '', contactInfo: editing.contactInfo || '', tags: (editing.tags || []).join(', ') }); return }
    const saved = localStorage.getItem('barterDraft')
    if (saved) { try { const d = JSON.parse(saved); setForm(d) } catch (e) {} }
  }, [editing])

  // Draft auto-save every 3 seconds
  useEffect(() => {
    if (editing) return
    const iv = setInterval(() => {
      const hasContent = form.skillOffered || form.skillWanted || form.category || form.description
      if (hasContent) { localStorage.setItem('barterDraft', JSON.stringify(form)); setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2000) }
    }, 3000)
    return () => clearInterval(iv)
  }, [form, editing])

  // Duplicate detection
  useEffect(() => {
    if (!uid || !form.skillOffered || !form.skillWanted || editing) { setDuplicate(null); return }
    const dup = existingListings.find(l => l.userId === uid && l.id !== editing?.id && l.skillOffered.toLowerCase() === form.skillOffered.trim().toLowerCase() && l.skillWanted.toLowerCase() === form.skillWanted.trim().toLowerCase())
    setDuplicate(dup || null)
  }, [form.skillOffered, form.skillWanted, uid, existingListings, editing])

  // Real-time validation
  const fieldState = (field, val) => {
    if (!val) return 'neutral'
    if (field === 'skillOffered' || field === 'skillWanted') return val.trim().length >= 3 ? 'valid' : 'invalid'
    if (field === 'category') return val ? 'valid' : 'invalid'
    return 'neutral'
  }
  const fieldColor = (s) => s === 'valid' ? 'border-emerald-500/50' : s === 'invalid' ? 'border-red-500/50' : 'border-white/10'

  const validate = () => {
    const e = {}
    if (!form.skillOffered.trim() || form.skillOffered.trim().length < 3) e.skillOffered = 'At least 3 characters'
    if (!form.skillWanted.trim() || form.skillWanted.trim().length < 3) e.skillWanted = 'At least 3 characters'
    if (!form.category) e.category = 'Please select a category'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => { e.preventDefault(); if (!validate()) return; setSubmitting(true); try { const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []; await onSubmit({ ...form, tags, userId: uid, userName }); if (!editing) { setForm({ skillOffered: '', skillWanted: '', category: '', description: '', contactInfo: '', tags: '' }); localStorage.removeItem('barterDraft') } } catch (err) { toast({ type: 'error', message: err.message || 'Something went wrong' }) } finally { setSubmitting(false) } }

  const inp = (f, v) => `w-full px-4 py-3 rounded-xl bg-dark-800/50 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${fieldColor(fieldState(f, v))} ${errors[f] ? 'border-red-500/50' : 'focus:border-brand-from/50 focus:ring-brand-from/20'}`
  const isEdit = !!editing

  return (<div className="max-w-2xl mx-auto">
    <div className="flex items-center gap-3 mb-6">{isEdit ? <Edit2 className="text-brand-from" size={28} /> : <PlusCircle className="text-brand-from" size={28} />}<h1 className="text-2xl md:text-3xl font-bold text-white">{isEdit ? 'Edit Listing' : 'Post Your Skill'}</h1></div>
    {duplicate && <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-2"><AlertCircle size={16} />You have a similar listing: <span className="font-medium text-white">"{duplicate.skillOffered}"</span></div>}
    {draftSaved && !isEdit && <div className="mb-4 flex items-center gap-1 text-xs text-gray-500"><CheckCircle size={12} className="text-emerald-400" />Draft auto-saved</div>}
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6">
      <div><label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><div className="w-2 h-2 rounded-full bg-emerald-400" />Skill You Offer *</label><input type="text" value={form.skillOffered} onChange={(e) => { setForm({ ...form, skillOffered: e.target.value }); if (errors.skillOffered) setErrors({ ...errors, skillOffered: '' }) }} placeholder="e.g., Logo Design, Web Development..." className={inp('skillOffered', form.skillOffered)} /><div className="flex justify-between mt-1"><p className="text-red-400 text-xs">{errors.skillOffered}</p><p className={`text-xs ${fieldState('skillOffered', form.skillOffered) === 'valid' ? 'text-emerald-400' : fieldState('skillOffered', form.skillOffered) === 'invalid' ? 'text-red-400' : 'text-gray-600'}`}>{form.skillOffered.length}/3 min</p></div></div>
      <div><label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><div className="w-2 h-2 rounded-full bg-blue-400" />Skill You Want *</label><input type="text" value={form.skillWanted} onChange={(e) => { setForm({ ...form, skillWanted: e.target.value }); if (errors.skillWanted) setErrors({ ...errors, skillWanted: '' }) }} placeholder="e.g., Mobile App Help, English..." className={inp('skillWanted', form.skillWanted)} /><div className="flex justify-between mt-1"><p className="text-red-400 text-xs">{errors.skillWanted}</p><p className={`text-xs ${fieldState('skillWanted', form.skillWanted) === 'valid' ? 'text-emerald-400' : fieldState('skillWanted', form.skillWanted) === 'invalid' ? 'text-red-400' : 'text-gray-600'}`}>{form.skillWanted.length}/3 min</p></div></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-2">Category *</label><select value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); if (errors.category) setErrors({ ...errors, category: '' }) }} className={inp('category', form.category) + ' appearance-none'} style={{ backgroundImage: 'none' }}><option value="" className="bg-dark-800">Select a category...</option>{CATEGORIES.map(c => (<option key={c.id} value={c.id} className="bg-dark-800">{c.label}</option>))}</select>{errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}</div>
      <div><label className="block text-sm font-medium text-gray-300 mb-2">Tags (optional, comma-separated)</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g., logo, branding, vector" className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your skill, experience, availability..." rows={4} className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all resize-none" /></div>
      <div><label className="block text-sm font-medium text-gray-300 mb-2">Contact Info (optional)</label><input type="text" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} placeholder="e.g., WhatsApp: 0312-xxxxxxx, email..." className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all" /><p className="text-gray-500 text-xs mt-2">Visible to everyone</p></div>
      <div className="flex gap-3 pt-2"><button type="submit" disabled={submitting} className="flex-1 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 glow disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Loader2 size={18} className="animate-spin" />}{isEdit ? 'Update Listing' : 'Post Skill'}</button>{isEdit && <button type="button" onClick={onCancel} className="px-6 py-3.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10">Cancel</button>}</div>
    </form>
  </div>)
}

// --- MY LISTINGS PAGE ---
const MyListingsPage = ({ listings, uid, onEdit, onDelete, onContact, onNav, onShare }) => (
  <div className="space-y-6"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Layers className="text-brand-from" size={28} /><div><h1 className="text-2xl md:text-3xl font-bold text-white">My Listings</h1><p className="text-gray-400 text-sm">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p></div></div><button onClick={() => onNav('post')} className="px-4 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90 flex items-center gap-2"><PlusCircle size={18} /><span className="hidden sm:inline">New</span></button></div>{listings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{listings.map(l => (<SkillCard key={l.id} listing={l} uid={uid} onEdit={onEdit} onDelete={onDelete} onContact={onContact} onShare={onShare} />))}</div> : <EmptyState icon={Layers} title="No listings yet" desc="Post your first skill to get started!" actionLabel="Post a Skill" onAction={() => onNav('post')} />}</div>)

// --- FAVORITES PAGE ---
const FavoritesPage = ({ listings, favIds, onFav, onUser }) => {
  const favListings = listings.filter(l => favIds && favIds.includes(l.id))
  return (<div className="space-y-6"><div className="flex items-center gap-3"><Heart className="text-red-400" size={28} /><div><h1 className="text-2xl md:text-3xl font-bold text-white">My Favorites</h1><p className="text-gray-400 text-sm">{favListings.length} saved</p></div></div>{favListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{favListings.map(l => (<SkillCard key={l.id} listing={l} onFav={onFav} isFav={true} onUser={onUser} />))}</div> : <EmptyState icon={Heart} title="No favorites yet" desc="Save listings you like by tapping the heart icon!" actionLabel="Explore Skills" onAction={() => {}} />}</div>)
}

// --- LEADERBOARD PAGE ---
const LeaderboardPage = ({ listings, reviews, onUser }) => {
  const data = leaderboardData(listings, reviews)
  const medals = ['from-amber-400 to-yellow-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-amber-600']
  const rankIcons = [Crown, Medal, Medal]
  return (<div className="space-y-6"><div className="flex items-center gap-3"><Trophy className="text-amber-400" size={28} /><h1 className="text-2xl md:text-3xl font-bold text-white">Leaderboard</h1></div><div className="max-w-2xl mx-auto space-y-3">{data.length > 0 ? data.map((u, i) => { const RI = rankIcons[i] || Users; return (<div key={u.userId} onClick={() => onUser && onUser(u)} className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.07] transition-all cursor-pointer"><div className={`w-10 h-10 rounded-full bg-gradient-to-br ${i < 3 ? medals[i] : 'from-gray-600 to-gray-700'} flex items-center justify-center text-white font-bold shrink-0`}>{i < 3 ? <RI size={20} className="text-white" /> : <span className="text-sm">{i + 1}</span>}</div><div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(u.userId)} flex items-center justify-center shrink-0`}><span className="text-white font-bold text-xs">{initials(u.userName)}</span></div><div className="flex-1 min-w-0"><p className="text-white font-semibold truncate">{u.userName}</p><p className="text-gray-500 text-xs">{u.lc} listings · {u.avg} avg rating</p></div><div className="text-right"><p className="text-xl font-bold text-white">{u.score}</p><p className="text-xs text-gray-500">Trust Score</p></div></div>) }) : <EmptyState icon={Trophy} title="No data yet" desc="Leaderboard will populate as users post skills." />}</div></div>)
}

// --- ACHIEVEMENTS PAGE ---
const AchievementsPage = ({ myStats }) => {
  const { lc, rc, fc, score } = myStats
  return (<div className="space-y-6"><div className="flex items-center gap-3"><Award className="text-amber-400" size={28} /><h1 className="text-2xl md:text-3xl font-bold text-white">Achievements</h1></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{ACHIEVEMENTS.map(a => { const AI = a.icon; let current = 0, unlocked = false; if (a.need === 'listings') { current = lc; unlocked = lc >= a.count } else if (a.need === 'reviews') { current = rc; unlocked = rc >= a.count } else if (a.need === 'favorites') { current = fc; unlocked = fc >= a.count } else if (a.need === 'trust') { current = score; unlocked = score >= a.count } else if (a.need === 'categories') { unlocked = false; current = 0 }; const pct = Math.min(100, (current / a.count) * 100); return (<div key={a.id} className={`glass rounded-2xl p-5 transition-all ${unlocked ? 'border border-amber-500/30' : ''}`}><div className="flex items-center gap-3 mb-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${unlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-white/5'}`}><AI size={20} className={unlocked ? 'text-white' : 'text-gray-500'} /></div><div className="flex-1"><p className={`text-sm font-semibold ${unlocked ? 'text-white' : 'text-gray-400'}`}>{a.name}</p><p className="text-xs text-gray-500">{a.desc}</p></div>{unlocked && <CheckCircle size={18} className="text-amber-400 shrink-0" />}</div><div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${unlocked ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-white/10'}`} style={{ width: pct + '%' }} /></div><p className="text-xs text-gray-500 mt-1">{current}/{a.count}</p></div>) })}</div></div>)
}

// --- MESSAGES PAGE (with real-time chat) ---
const MessagesPage = ({ uid, userName, listings, onToast, blockedUsers }) => {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [chatTarget, setChatTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEnd = useRef(null)

  // Listen to chats
  useEffect(() => {
    if (!uid) return
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => c.participants && c.participants.includes(uid))
      setChats(data); setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [uid])

  // Listen to messages for active chat
  useEffect(() => {
    if (!activeChat) { setMessages([]); return }
    const q = query(collection(db, 'chats', activeChat, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => { setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100) })
    return () => unsub()
  }, [activeChat])

  const openChat = async (targetListing) => {
    if (isBlocked(blockedUsers, targetListing.userId)) { onToast({ type: 'error', message: 'Cannot message this user' }); return }
    setChatTarget(targetListing)
    const existing = chats.find(c => c.participants && c.participants.includes(uid) && c.participants.includes(targetListing.userId))
    if (existing) { setActiveChat(existing.id); return }
    // Create new chat
    const chatId = [uid, targetListing.userId].sort().join('_')
    try {
      await setDoc(doc(db, 'chats', chatId), {
        participants: [uid, targetListing.userId],
        participantNames: { [uid]: userName, [targetListing.userId]: targetListing.userName },
        lastMessage: '', updatedAt: serverTimestamp(), createdAt: serverTimestamp()
      })
      setActiveChat(chatId)
    } catch (e) { onToast({ type: 'error', message: 'Could not start chat' }) }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.trim() || !activeChat || !uid) return
    const msg = newMsg.trim(); setNewMsg('')
    try {
      await addDoc(collection(db, 'chats', activeChat, 'messages'), { senderId: uid, senderName: userName, text: msg, createdAt: serverTimestamp() })
      await updateDoc(doc(db, 'chats', activeChat), { lastMessage: msg, updatedAt: serverTimestamp() })
      // Track activity
      const log = JSON.parse(localStorage.getItem('barterActivity') || '{}'); const k = todayKey(); log[k] = (log[k] || 0) + 1; localStorage.setItem('barterActivity', JSON.stringify(log))
    } catch (e) { onToast({ type: 'error', message: 'Failed to send' }) }
  }

  const getOtherName = (chat) => {
    if (!chat || !chat.participantNames) return 'Unknown'
    const otherId = chat.participants.find(p => p !== uid)
    return chat.participantNames[otherId] || 'Unknown'
  }
  const getOtherId = (chat) => chat && chat.participants ? chat.participants.find(p => p !== uid) : null

  // Individual chat view
  if (activeChat) {
    const chat = chats.find(c => c.id === activeChat)
    return (<div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="flex items-center gap-3 pb-4 border-b border-white/10"><button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/10 rounded-lg"><ArrowRight size={20} className="text-gray-400 rotate-180" /></button><div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(getOtherId(chat))} flex items-center justify-center`}><span className="text-white font-bold text-xs">{initials(getOtherName(chat))}</span></div><span className="text-white font-medium">{getOtherName(chat)}</span></div>
      <div className="flex-1 overflow-y-auto py-4 space-y-3">{messages.map(m => (<div key={m.id} className={`flex ${m.senderId === uid ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.senderId === uid ? 'gradient-bg text-white rounded-br-md' : 'bg-white/10 text-gray-200 rounded-bl-md'}`}><p>{m.text}</p><p className={`text-[10px] mt-1 ${m.senderId === uid ? 'text-white/60' : 'text-gray-500'}`}>{timeAgo(m.createdAt)}</p></div></div>))}<div ref={messagesEnd} /></div>
      <form onSubmit={sendMessage} className="flex gap-2 pt-4 border-t border-white/10"><input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20" /><button type="submit" disabled={!newMsg.trim()} className="px-4 py-3 rounded-xl gradient-bg text-white hover:opacity-90 disabled:opacity-40"><Send size={18} /></button></form>
    </div>)
  }

  // Chat list view
  return (<div className="space-y-6">
    <div className="flex items-center gap-3"><MessageCircle className="text-brand-from" size={28} /><h1 className="text-2xl md:text-3xl font-bold text-white">Messages</h1></div>
    {loading ? <LoadingSkeleton count={3} /> : chats.length > 0 ? <div className="max-w-2xl mx-auto space-y-2">{chats.map(c => (<button key={c.id} onClick={() => setActiveChat(c.id)} className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-all text-left"><div className={`w-11 h-11 rounded-full bg-gradient-to-br ${userGrad(getOtherId(c))} flex items-center justify-center shrink-0`}><span className="text-white font-bold text-sm">{initials(getOtherName(c))}</span></div><div className="flex-1 min-w-0"><p className="text-white font-medium">{getOtherName(c)}</p><p className="text-gray-500 text-sm truncate">{c.lastMessage || 'No messages yet'}</p></div><span className="text-xs text-gray-600 shrink-0">{timeAgo(c.updatedAt)}</span></button>))}</div> : <EmptyState icon={MessageCircle} title="No conversations" desc="Start a chat by messaging someone from their listing!" />}
  </div>)
}

// --- PROFILE PAGE (Enhanced with trust score, badges, heatmap, blocked users) ---
const ProfilePage = ({ userName, uid, listings, reviews, onUpdateName, onReset, onToast, favCount, blockedUsers, setBlockedUsers, onNav }) => {
  const [editName, setEditName] = useState(false), [newName, setNewName] = useState(userName), [nameErr, setNameErr] = useState('')
  const [showBlocked, setShowBlocked] = useState(false)
  const myLc = listings.filter(l => l.userId === uid).length
  const myReviews = reviews.filter(r => r.toUserId === uid)
  const avgRating = myReviews.length > 0 ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length : 0
  const score = trustScore(myLc, myReviews.length, avgRating)
  const title = userTitle(score)
  const badges = getUnlockedBadges(score, myLc, myReviews.length, favCount, 0, 0)
  const activityLog = JSON.parse(localStorage.getItem('barterActivity') || '{}')

  const saveName = () => { if (!newName.trim() || newName.trim().length < 2) { setNameErr('Min 2 characters'); return } onUpdateName(newName.trim()); setEditName(false); setNameErr('') }
  const cancelName = () => { setNewName(userName); setEditName(false); setNameErr('') }
  const unblock = (bid) => { const nb = blockedUsers.filter(b => b !== bid); setBlockedUsers(nb); onToast({ type: 'info', message: 'User unblocked' }) }

  return (<div className="max-w-lg mx-auto space-y-6">
    <div className="glass rounded-2xl p-8 text-center">
      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${userGrad(uid)} flex items-center justify-center mx-auto mb-4 glow`}><span className="text-white font-bold text-2xl">{initials(userName)}</span></div>
      {editName ? <div className="space-y-3 mb-4"><input type="text" value={newName} onChange={(e) => { setNewName(e.target.value); setNameErr('') }} className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/10 text-white text-center focus:outline-none focus:border-brand-from/50" autoFocus />{nameErr && <p className="text-red-400 text-sm">{nameErr}</p>}<div className="flex justify-center gap-2"><button onClick={saveName} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300"><Check size={18} /></button><button onClick={cancelName} className="p-2 rounded-lg bg-white/5 text-gray-400"><X size={18} /></button></div></div>
      : <div className="mb-4"><h2 className="text-2xl font-bold text-white mb-1">{userName}</h2><span className={`text-sm font-medium ${title.color}`}>{title.label}</span><br/><button onClick={() => setEditName(true)} className="text-brand-from hover:text-brand-to text-sm font-medium flex items-center gap-1 mx-auto mt-1"><Edit2 size={14} />Edit name</button></div>}
      {badges.length > 0 && <div className="flex justify-center"><BadgesRow badges={badges} /></div>}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="glass rounded-2xl p-5 text-center"><TrustRing score={score} /><p className="text-xs text-gray-400 mt-2">Trust Score</p></div>
      <div className="glass rounded-2xl p-5 text-center"><p className="text-3xl font-bold text-white">{myLc}</p><p className="text-gray-400 text-sm">My Listings</p><div className="mt-2"><RatingStars rating={avgRating} count={myReviews.length} /></div></div>
    </div>

    <div className="glass rounded-2xl p-5"><h3 className="text-sm font-semibold text-gray-400 mb-3">Activity (Last 12 Weeks)</h3><Heatmap log={activityLog} /></div>

    <div className="glass rounded-2xl p-5"><h3 className="text-sm font-semibold text-gray-400 mb-3">My Reviews ({myReviews.length})</h3>{myReviews.length > 0 ? <div className="space-y-3 max-h-60 overflow-y-auto">{myReviews.slice(0, 10).map(r => (<div key={r.id} className="p-3 rounded-xl bg-white/5"><div className="flex items-center justify-between mb-1"><span className="text-white text-sm font-medium">{r.fromName || 'Anonymous'}</span><RatingStars rating={r.rating} /></div>{r.text && <p className="text-gray-400 text-sm">{r.text}</p>}</div>))}</div> : <p className="text-gray-500 text-sm">No reviews yet</p>}</div>

    <div className="glass rounded-2xl p-6 space-y-4"><h3 className="text-lg font-semibold text-white">Account Info</h3><div className="space-y-3"><div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-400 text-sm">User ID</span><span className="text-gray-300 text-sm font-mono">{trunc(uid, 16)}</span></div><div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-400 text-sm">Platform</span><span className="text-gray-300 text-sm">Barter Exchange v2.0</span></div><div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-400 text-sm">Database</span><span className="text-gray-300 text-sm">Firebase Firestore</span></div></div></div>

    <div className="flex gap-3">
      <button onClick={() => onNav('achievements')} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2"><Award size={18} />Achievements</button>
      <button onClick={() => setShowBlocked(!showBlocked)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2"><Ban size={18} />Blocked ({(blockedUsers || []).length})</button>
    </div>
    {showBlocked && <div className="glass rounded-2xl p-4"><h4 className="text-sm font-semibold text-gray-400 mb-3">Blocked Users</h4>{blockedUsers && blockedUsers.length > 0 ? <div className="space-y-2">{blockedUsers.map(bid => { const u = listings.find(l => l.userId === bid); return u ? (<div key={bid} className="flex items-center justify-between p-2 rounded-xl bg-white/5"><span className="text-white text-sm">{u.userName}</span><button onClick={() => unblock(bid)} className="text-xs text-red-400 hover:text-red-300">Unblock</button></div>) : null })}</div> : <p className="text-gray-500 text-sm">No blocked users</p>}</div>}

    <button onClick={onReset} className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center gap-2"><RefreshCw size={18} />Reset Account</button>
  </div>)
}

// --- PUBLIC USER PROFILE PAGE ---
const UserProfilePage = ({ targetUserId, listings, reviews, uid, onMsg, onBlock, onReview, onBack, blockedUsers }) => {
  const [showReview, setShowReview] = useState(false)
  const userListings = listings.filter(l => l.userId === targetUserId)
  const userReviews = reviews.filter(r => r.toUserId === targetUserId)
  const avgRating = userReviews.length > 0 ? userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length : 0
  const score = trustScore(userListings.length, userReviews.length, avgRating)
  const title = userTitle(score)
  const badges = getUnlockedBadges(score, userListings.length, userReviews.length, 0, 0, 0)
  const targetUser = userListings[0] || reviews.find(r => r.toUserId === targetUserId)
  const isBlocked = blockedUsers && blockedUsers.includes(targetUserId)
  const name = targetUser ? (targetUser.userName || (userReviews[0] && userReviews[0].toName)) : 'Unknown User'
  const isSelf = uid === targetUserId

  return (<div className="max-w-2xl mx-auto space-y-6">
    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm"><ArrowRight size={16} className="rotate-180" />Back</button>
    <div className="glass rounded-2xl p-8 text-center">
      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${userGrad(targetUserId)} flex items-center justify-center mx-auto mb-4 glow`}><span className="text-white font-bold text-2xl">{initials(name)}</span></div>
      <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
      <span className={`text-sm font-medium ${title.color}`}>{title.label}</span>
      {badges.length > 0 && <div className="flex justify-center mt-3"><BadgesRow badges={badges} /></div>}
      <div className="flex justify-center gap-6 mt-4"><div className="text-center"><TrustRing score={score} sz={60} /><p className="text-xs text-gray-400 mt-1">Trust</p></div><div className="text-center"><p className="text-2xl font-bold text-white">{userListings.length}</p><p className="text-xs text-gray-400">Listings</p></div><div className="text-center"><RatingStars rating={avgRating} count={userReviews.length} /><p className="text-xs text-gray-400 mt-1">Rating</p></div></div>
      {!isSelf && <div className="flex justify-center gap-3 mt-6"><button onClick={() => onMsg && onMsg(targetUser)} className="px-5 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90 flex items-center gap-2"><MessageCircle size={16} />Message</button><button onClick={() => setShowReview(true)} className="px-5 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 flex items-center gap-2"><Star size={16} />Review</button><button onClick={() => onBlock && onBlock(targetUserId)} className={`px-5 py-2.5 rounded-xl font-medium border flex items-center gap-2 ${isBlocked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-white/10'}`}><Ban size={16} />{isBlocked ? 'Unblock' : 'Block'}</button></div>}
    </div>
    {userReviews.length > 0 && <div className="glass rounded-2xl p-5"><h3 className="text-sm font-semibold text-gray-400 mb-3">Reviews ({userReviews.length})</h3><div className="space-y-3 max-h-60 overflow-y-auto">{userReviews.map(r => (<div key={r.id} className="p-3 rounded-xl bg-white/5"><div className="flex items-center justify-between mb-1"><span className="text-white text-sm font-medium">{r.fromName || 'Anonymous'}</span><RatingStars rating={r.rating} /></div>{r.text && <p className="text-gray-400 text-sm">{r.text}</p>}</div>))}</div></div>}
    <div><h3 className="text-lg font-bold text-white mb-4">Their Listings ({userListings.length})</h3>{userListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{userListings.map(l => (<SkillCard key={l.id} listing={l} />))}</div> : <p className="text-gray-500 text-sm">No listings yet</p>}</div>
    {targetUser && <ReviewModal isOpen={showReview} targetUser={{ userId: targetUserId, userName: name }} onClose={() => setShowReview(false)} onSubmit={onReview} />}
  </div>)
}

// ============================================
// SECTION 7: MAIN APP COMPONENT
// ============================================
const App = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [contactTarget, setContactTarget] = useState(null)
  const [reportTarget, setReportTarget] = useState(null)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [stats, setStats] = useState({ totalListings: 0, uniqueUsers: 0, totalCategories: CATEGORIES.length })
  const [theme, setTheme] = useState(() => localStorage.getItem('barterTheme') || 'dark')
  const [notifs, setNotifs] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [targetProfile, setTargetProfile] = useState(null)
  const [blockedUsers, setBlockedUsers] = useState(() => { try { return JSON.parse(localStorage.getItem('barterBlocked') || '[]') } catch { return [] } })
  const [recentlyViewed, setRecentlyViewed] = useState(() => { try { return JSON.parse(localStorage.getItem('barterRecent') || '[]') } catch { return [] } })
  const msgPageRef = useRef(null)

  // Persist theme, blocked, recent
  useEffect(() => { localStorage.setItem('barterTheme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('barterBlocked', JSON.stringify(blockedUsers)) }, [blockedUsers])
  useEffect(() => { localStorage.setItem('barterRecent', JSON.stringify(recentlyViewed.slice(0, 30))) }, [recentlyViewed])

  // Auth
  useEffect(() => {
    const stored = localStorage.getItem('barterUserName')
    if (stored) setUserName(stored)
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { setUser(u); if (!stored) setShowWelcome(true) }
      else { try { await signInAnonymously(auth) } catch (e) { console.error(e) } }
    })
    return () => unsub()
  }, [])

  // Listings listener
  useEffect(() => {
    if (!user) return; setLoading(true)
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setListings(data)
      setStats({ totalListings: data.length, uniqueUsers: new Set(data.map(l => l.userId)).size, totalCategories: CATEGORIES.length })
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [user])

  // Reviews listener
  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')), (snap) => { setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))) })
    return () => unsub()
  }, [user])

  // Favorites listener
  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(query(collection(db, 'favorites'), where('userId', '==', user.uid)), (snap) => { setFavorites(snap.docs.map(d => d.data())) })
    return () => unsub()
  }, [user])

  // Notifications listener
  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(query(collection(db, 'notifications'), where('toUserId', '==', user.uid), orderBy('createdAt', 'desc'), limit(20)), (snap) => { setNotifs(snap.docs.map(d => ({ id: d.id, ...d.data() }))) })
    return () => unsub()
  }, [user])

  const favIds = favorites.map(f => f.listingId)
  const handleToast = (t) => setToast(t)

  // Navigation
  const nav = (tab) => { setActiveTab(tab); setEditing(null); setTargetProfile(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // Handlers
  const handleName = (name) => { localStorage.setItem('barterUserName', name); setUserName(name); setShowWelcome(false); setToast({ type: 'success', message: `Welcome, ${name}!` }) }

  const handleCreate = async (data) => {
    await addDoc(collection(db, 'listings'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    setToast({ type: 'success', message: 'Skill posted!' }); nav('my-listings')
    // Activity log
    const log = JSON.parse(localStorage.getItem('barterActivity') || '{}'); const k = todayKey(); log[k] = (log[k] || 0) + 1; localStorage.setItem('barterActivity', JSON.stringify(log))
  }
  const handleUpdate = async (data) => {
    if (!editing) return
    await updateDoc(doc(db, 'listings', editing.id), { ...data, updatedAt: serverTimestamp() })
    setEditing(null); setToast({ type: 'success', message: 'Listing updated!' }); nav('my-listings')
  }
  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteDoc(doc(db, 'listings', deleteTarget.id)); setToast({ type: 'success', message: 'Deleted!' }) } catch { setToast({ type: 'error', message: 'Failed to delete' }) }
    setDeleteTarget(null)
  }
  const handleEditClick = (l) => { setEditing(l); nav('post') }
  const handleCancelEdit = () => { setEditing(null); nav('my-listings') }

  // Favorites
  const handleFav = async (listing) => {
    if (!user) return
    const existing = favorites.find(f => f.listingId === listing.id)
    if (existing) {
      try { const q = query(collection(db, 'favorites'), where('userId', '==', user.uid), where('listingId', '==', listing.id))
        const snap = await getDocs(q); const batch = writeBatch(db); snap.docs.forEach(d => batch.delete(d.ref)); await batch.commit()
        setToast({ type: 'info', message: 'Removed from favorites' })
      } catch { setToast({ type: 'error', message: 'Failed' }) }
    } else {
      try { await addDoc(collection(db, 'favorites'), { userId: user.uid, listingId: listing.id, userName: listing.userName, skillOffered: listing.skillOffered, createdAt: serverTimestamp() })
        setToast({ type: 'success', message: 'Added to favorites!' })
      } catch { setToast({ type: 'error', message: 'Failed' }) }
    }
  }

  // Reviews
  const handleReview = async (toUserId, rating, text) => {
    if (!user) return
    try { await addDoc(collection(db, 'reviews'), { fromUserId: user.uid, fromName: userName, toUserId, rating, text, createdAt: serverTimestamp() })
      setToast({ type: 'success', message: 'Review submitted!' }); setReviewTarget(null)
    } catch { setToast({ type: 'error', message: 'Failed' }) }
  }

  // Reports
  const handleReport = async (listing, reason) => {
    if (!user) return
    try { await addDoc(collection(db, 'reports'), { listingId: listing.id, listingOwner: listing.userId, reporterId: user.uid, reporterName: userName, reason, createdAt: serverTimestamp() })
      setToast({ type: 'info', message: 'Report submitted' }); setReportTarget(null)
    } catch { setToast({ type: 'error', message: 'Failed' }) }
  }

  // Share
  const handleShare = (listing) => {
    const url = window.location.origin + '?listing=' + listing.id
    navigator.clipboard.writeText(url).then(() => setToast({ type: 'success', message: 'Link copied!' })).catch(() => setToast({ type: 'info', message: 'Could not copy link' }))
  }

  // View user profile
  const handleViewUser = (listing) => {
    setTargetProfile(listing)
    if (!recentlyViewed.includes(listing.id)) {
      const rv = [listing.id, ...recentlyViewed.filter(id => id !== listing.id)].slice(0, 30)
      setRecentlyViewed(rv)
    }
  }

  // Block user
  const handleBlock = (targetUid) => {
    if (blockedUsers.includes(targetUid)) {
      setBlockedUsers(blockedUsers.filter(b => b !== targetUid))
      setToast({ type: 'info', message: 'User unblocked' })
    } else {
      setBlockedUsers([...blockedUsers, targetUid])
      setToast({ type: 'warning', message: 'User blocked' })
    }
  }

  // Message from listing
  const handleMessage = (listing) => {
    nav('messages')
    setTimeout(() => {
      if (msgPageRef.current && msgPageRef.current.openChat) {
        msgPageRef.current.openChat(listing)
      }
    }, 500)
  }

  // Mark notification read
  const markRead = async (id) => {
    try { await updateDoc(doc(db, 'notifications', id), { read: true }) } catch {}
  }

  // Render pages
  const renderPage = () => {
    if (targetProfile) return <UserProfilePage targetUserId={targetProfile.userId} listings={listings} reviews={reviews} uid={user?.uid} onMsg={handleMessage} onBlock={handleBlock} onReview={handleReview} onBack={() => setTargetProfile(null)} blockedUsers={blockedUsers} />
    switch (activeTab) {
      case 'home': return <HomePage listings={listings} userName={userName} uid={user?.uid} onNav={nav} stats={stats} favorites={favorites} recentlyViewed={recentlyViewed} blockedUsers={blockedUsers} />
      case 'explore': return <ExplorePage listings={listings} loading={loading} uid={user?.uid} onEdit={handleEditClick} onDelete={setDeleteTarget} onContact={setContactTarget} onFav={handleFav} onReport={setReportTarget} onMsg={handleMessage} onShare={handleShare} onUser={handleViewUser} favIds={favIds} blockedUsers={blockedUsers} />
      case 'post': return <PostPage uid={user?.uid} userName={userName} editing={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={handleCancelEdit} toast={handleToast} existingListings={listings} />
      case 'my-listings': return <MyListingsPage listings={listings.filter(l => l.userId === user?.uid)} uid={user?.uid} onEdit={handleEditClick} onDelete={setDeleteTarget} onContact={setContactTarget} onNav={nav} onShare={handleShare} />
      case 'favorites': return <FavoritesPage listings={listings} favIds={favIds} onFav={handleFav} onUser={handleViewUser} />
      case 'messages': return <MessagesPage ref={msgPageRef} uid={user?.uid} userName={userName} listings={listings} onToast={handleToast} blockedUsers={blockedUsers} />
      case 'leaderboard': return <LeaderboardPage listings={listings} reviews={reviews} onUser={handleViewUser} />
      case 'achievements': return <AchievementsPage myStats={{ lc: listings.filter(l => l.userId === user?.uid).length, rc: reviews.filter(r => r.toUserId === user?.uid).length, fc: favorites.length, score: trustScore(listings.filter(l => l.userId === user?.uid).length, reviews.filter(r => r.toUserId === user?.uid).length, reviews.filter(r => r.toUserId === user?.uid).length > 0 ? reviews.filter(r => r.toUserId === user?.uid).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.toUserId === user?.uid).length : 0) }} />
      case 'profile': return <ProfilePage userName={userName} uid={user?.uid} listings={listings} reviews={reviews} onUpdateName={(n) => { localStorage.setItem('barterUserName', n); setUserName(n); setToast({ type: 'success', message: 'Name updated!' }) }} onReset={() => { localStorage.removeItem('barterUserName'); setUserName(''); setShowWelcome(true); setToast({ type: 'info', message: 'Account reset' }) }} onToast={handleToast} favCount={favorites.length} blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers} onNav={nav} />
      default: return <HomePage listings={listings} userName={userName} uid={user?.uid} onNav={nav} stats={stats} favorites={favorites} recentlyViewed={recentlyViewed} blockedUsers={blockedUsers} />
    }
  }

  const unreadNotifs = notifs.filter(n => !n.read).length

  // ============================================
  // SECTION 8: MAIN LAYOUT
  // ============================================
  return (<div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50 text-dark-800' : 'bg-dark-900 text-gray-300'}`}>
    <Toast toast={toast} onClose={() => setToast(null)} />
    <WelcomeModal isOpen={showWelcome} onSubmit={handleName} />
    <DeleteModal isOpen={!!deleteTarget} listing={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    <ContactModal isOpen={!!contactTarget} listing={contactTarget} onClose={() => setContactTarget(null)} />
    <ReportModal isOpen={!!reportTarget} listing={reportTarget} onClose={() => setReportTarget(null)} onReport={handleReport} />
    {reviewTarget && <ReviewModal isOpen={true} targetUser={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={handleReview} />}

    {/* Header */}
    <header className={`fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 md:px-6 ${theme === 'light' ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm' : 'glass-strong'}`}>
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg"><Menu size={20} className="text-white" /></button>
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center"><ArrowRight className="text-white" size={16} /></div><span className="text-lg font-bold gradient-text hidden sm:inline">Barter Exchange</span></div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'} transition-colors`}>{theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}</button>
        <div className="relative"><button onClick={() => setShowNotifs(!showNotifs)} className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'} transition-colors relative`}><Bell size={20} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />{unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{unreadNotifs > 9 ? '9+' : unreadNotifs}</span>}</button><NotifPanel isOpen={showNotifs} notifs={notifs} onClose={() => setShowNotifs(false)} onRead={markRead} onNav={nav} /></div>
        {userName && <div className="flex items-center gap-2"><span className={`text-sm hidden md:inline ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{userName}</span><div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(user?.uid)} flex items-center justify-center`}><span className="text-white font-bold text-xs">{initials(userName)}</span></div></div>}
      </div>
    </header>

    {/* Sidebar */}
    <aside className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 hidden lg:flex flex-col ${theme === 'light' ? 'bg-white/80 backdrop-blur-lg border-r border-gray-200' : 'glass-strong'} ${sidebarOpen ? 'w-64' : 'w-20'} border-r border-white/5`} onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)}>
      <nav className="flex-1 py-4 px-3 space-y-1">{NAV_ITEMS.map(item => { const Icon = item.icon; const isActive = activeTab === item.id && !targetProfile; return (<button key={item.id} onClick={() => nav(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20' : (theme === 'light' ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-800' : 'text-gray-400 hover:bg-white/5 hover:text-white')}`}><Icon size={22} className="shrink-0" /><span className={`font-medium whitespace-nowrap transition-all ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span></button>) })}</nav>
      <div className="p-3"><div className={`rounded-xl p-3 ${theme === 'light' ? 'bg-gray-50' : 'glass'} text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}><Sparkles size={16} className="mb-1 text-brand-from" />{sidebarOpen && <p>Barter Exchange v2.0 — Ultra Premium</p>}</div></div>
    </aside>

    {/* Content */}
    <main className="pt-16 min-h-screen lg:ml-20 pb-20 lg:pb-6 transition-all">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">{loading && !listings.length ? <LoadingSkeleton /> : renderPage()}</div>
    </main>

    {/* Mobile Nav */}
    <nav className={`fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-around lg:hidden ${theme === 'light' ? 'bg-white/90 backdrop-blur-lg border-t border-gray-200' : 'glass-strong'}`}>
      {MOBILE_NAV.map(item => { const Icon = item.icon; const isActive = activeTab === item.id && !targetProfile; const isCenter = item.id === 'post'; return (<button key={item.id} onClick={() => nav(item.id)} className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${isCenter ? '-mt-4' : ''} ${isActive ? 'text-brand-from' : (theme === 'light' ? 'text-gray-400' : 'text-gray-500')}`}><div className={`${isCenter ? 'w-12 h-12 -mt-1 rounded-2xl gradient-bg flex items-center justify-center glow-sm shadow-lg' : 'p-1 rounded-lg ' + (isActive ? 'bg-brand-from/20' : '')}`}><Icon size={isCenter ? 22 : 20} className={isCenter ? 'text-white' : ''} /></div><span className={`text-[10px] font-medium ${isCenter ? 'text-brand-from' : ''}`}>{item.label}</span></button>) })}
    </nav>
  </div>)
}

export default App
