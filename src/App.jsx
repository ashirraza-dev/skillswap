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
  Award, Users, FolderOpen, ExternalLink, Copy, RefreshCw
} from 'lucide-react'
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp,
  getDocs, where
} from 'firebase/firestore'
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'firebase/auth'

// ============================================
// SECTION 2: FIREBASE CONFIG
// ============================================
// Replace these placeholder values with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAjAgUdBwyu820JqxtAr3546J90trnNImI",
  authDomain: "skillswap-48163.firebaseapp.com",
  projectId: "skillswap-48163",
  storageBucket: "skillswap-48163.firebasestorage.app",
  messagingSenderId: "953886423467",
  appId: "1:953886423467:web:47dcc723d89d9765de7aee"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const listingsCollection = collection(db, 'listings')

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
  { id: 'post', label: 'Post', icon: PlusCircle },
  { id: 'my-listings', label: 'My Listings', icon: Layers },
  { id: 'profile', label: 'Profile', icon: User },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Post Your Skill',
    description: 'Share what you can offer and what you want to learn in return.',
    icon: PlusCircle,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    step: 2,
    title: 'Browse & Discover',
    description: 'Explore skills from people around the world. Filter by category.',
    icon: Search,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    step: 3,
    title: 'Connect & Exchange',
    description: 'Contact the person, arrange the exchange, and start learning.',
    icon: MessageCircle,
    gradient: 'from-violet-500 to-purple-500'
  }
]

// ============================================
// SECTION 4: HELPERS
// ============================================

/**
 * Format a Firestore timestamp to a relative time string (e.g., "2h ago")
 */
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

/**
 * Get category details by ID
 */
const getCategory = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1]
}

/**
 * Get user initials from name
 */
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

/**
 * Generate a consistent gradient for a user based on their ID
 */
const getUserGradient = (userId) => {
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-violet-500 to-fuchsia-500',
  ]
  if (!userId) return gradients[0]
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
  return gradients[index]
}

/**
 * Truncate text with ellipsis
 */
const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// ============================================
// SECTION 5: SMALL COMPONENTS
// ============================================

/**
 * Toast Notification Component
 * Displays temporary notifications at the top-right of the screen
 */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => onClose(), 3000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const styles = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/20 border-red-500/30 text-red-300',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const Icon = icons[toast.type] || Info

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-up">
      <div className={`glass rounded-xl px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md border ${styles[toast.type]}`}>
        <Icon size={20} />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={onClose} className="hover:bg-white/10 rounded-lg p-1 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

/**
 * Welcome/Name Modal Component
 * Shown on first visit to collect the user's display name
 */
const WelcomeModal = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    onSubmit(name.trim())
    setName('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Barter Exchange</h2>
          <p className="text-gray-400">Enter your name to get started. No email or password needed.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="Your display name"
              className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity glow"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * Delete Confirmation Modal Component
 */
const DeleteModal = ({ isOpen, listing, onConfirm, onCancel }) => {
  if (!isOpen || !listing) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Listing?</h3>
          <p className="text-gray-400">
            Are you sure you want to delete <span className="text-white font-medium">"{listing.skillOffered}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Contact Info Modal Component
 */
const ContactModal = ({ isOpen, listing, onClose }) => {
  if (!isOpen || !listing) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Contact Information</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getUserGradient(listing.userId)} flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">{getInitials(listing.userName)}</span>
          </div>
          <div>
            <p className="text-white font-semibold">{listing.userName}</p>
            <p className="text-gray-400 text-sm">Listing Owner</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
            <div>
              <p className="text-gray-400 text-sm">Offers</p>
              <p className="text-white font-medium">{listing.skillOffered}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
            <div>
              <p className="text-gray-400 text-sm">Wants</p>
              <p className="text-white font-medium">{listing.skillWanted}</p>
            </div>
          </div>
        </div>

        {listing.contactInfo ? (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Contact Details</p>
            <p className="text-white font-medium break-all">{listing.contactInfo}</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-gray-400">No contact information provided.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Loading Skeleton Component
 * Animated placeholder cards shown while data loads
 */
const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="h-4 w-12 bg-white/10 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
          <div className="h-5 w-1/2 bg-white/10 rounded mb-4" />
          <div className="h-16 bg-white/5 rounded-lg mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Empty State Component
 * Reusable centered message for empty results
 */
const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Skill Card Component
 * Reusable listing card used across multiple pages
 */
const SkillCard = ({ listing, currentUserId, onEdit, onDelete, onContact, showActions = true }) => {
  const category = getCategory(listing.category)
  const CategoryIcon = category.icon
  const isOwner = currentUserId && listing.userId === currentUserId

  return (
    <div className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-300 group">
      {/* Header: Category badge + time */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}>
          <CategoryIcon size={12} />
          {category.label}
        </span>
        <span className="text-gray-500 text-xs flex items-center gap-1">
          <Clock size={12} />
          {formatTimeAgo(listing.createdAt)}
        </span>
      </div>

      {/* Skills */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-gray-400 text-sm">I Offer</span>
          <span className="text-white font-semibold text-sm">{listing.skillOffered}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <span className="text-gray-400 text-sm">I Want</span>
          <span className="text-white font-semibold text-sm">{listing.skillWanted}</span>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{listing.description}</p>
      )}

      {/* Contact info preview */}
      {listing.contactInfo && (
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 mb-4">
          <p className="text-gray-500 text-xs flex items-center gap-1.5">
            <Mail size={12} />
            {truncate(listing.contactInfo, 40)}
          </p>
        </div>
      )}

      {/* Footer: User + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getUserGradient(listing.userId)} flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">{getInitials(listing.userName)}</span>
          </div>
          <span className="text-gray-300 text-sm font-medium">{listing.userName}</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <button
                  onClick={() => onEdit(listing)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(listing)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => onContact(listing)}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5"
              >
                <MessageCircle size={14} />
                Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION 6: PAGE COMPONENTS
// ============================================

/**
 * Home Page Component
 * Landing page with hero, stats, how it works, and recent listings
 */
const HomePage = ({ listings, userName, onNavigate, stats }) => {
  const recentListings = listings.slice(0, 3)

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-dark-800 to-purple-900/40" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />

        <div className="relative px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Barter Exchange</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">
            Exchange Skills, Not Money.
          </p>
          {userName && (
            <p className="text-gray-400 mb-8">Welcome back, {userName}!</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('explore')}
              className="px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity glow flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Explore Skills
            </button>
            <button
              onClick={() => onNavigate('post')}
              className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} />
              Post Your Skill
            </button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Skills Listed', value: stats.totalListings, icon: Zap },
          { label: 'Community', value: stats.uniqueUsers, icon: Users },
          { label: 'Categories', value: stats.totalCategories, icon: FolderOpen },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.07] transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <stat.icon size={24} className="text-brand-from" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.07] transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="text-white" size={28} />
              </div>
              <div className="text-xs font-bold text-brand-from mb-2">Step {item.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Listings</h2>
          <button
            onClick={() => onNavigate('explore')}
            className="text-brand-from hover:text-brand-to text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        {recentListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.map(listing => (
              <SkillCard
                key={listing.id}
                listing={listing}
                onEdit={() => {}}
                onDelete={() => {}}
                onContact={() => {}}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No listings yet"
            description="Be the first to post a skill and start the community!"
            actionLabel="Post a Skill"
            onAction={() => onNavigate('post')}
          />
        )}
      </section>
    </div>
  )
}

/**
 * Explore Page Component
 * Search, filter, and browse all skill listings
 */
const ExplorePage = ({ listings, loading, currentUserId, onEdit, onDelete, onContact }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery ||
      listing.skillOffered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.skillWanted.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <Search className="text-brand-from" size={28} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Explore Skills</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills, people, categories..."
          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'gradient-bg text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'gradient-bg text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-gray-400 text-sm">
        {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
      </p>

      {/* Listings Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map(listing => (
            <SkillCard
              key={listing.id}
              listing={listing}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onContact={onContact}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No listings found"
          description={searchQuery || activeCategory !== 'all'
            ? "Try adjusting your search or filters."
            : "No skills have been posted yet. Be the first!"}
        />
      )}
    </div>
  )
}

/**
 * Post/Edit Page Component
 * Form for creating or editing a skill listing
 */
const PostPage = ({ userId, userName, editingListing, onSubmit, onCancel, setToast }) => {
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    category: '',
    description: '',
    contactInfo: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill form when editing
  useEffect(() => {
    if (editingListing) {
      setFormData({
        skillOffered: editingListing.skillOffered || '',
        skillWanted: editingListing.skillWanted || '',
        category: editingListing.category || '',
        description: editingListing.description || '',
        contactInfo: editingListing.contactInfo || '',
      })
    }
  }, [editingListing])

  const validate = () => {
    const newErrors = {}
    if (!formData.skillOffered.trim() || formData.skillOffered.trim().length < 3) {
      newErrors.skillOffered = 'Skill offered must be at least 3 characters'
    }
    if (!formData.skillWanted.trim() || formData.skillWanted.trim().length < 3) {
      newErrors.skillWanted = 'Skill wanted must be at least 3 characters'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        userId,
        userName,
      })

      if (!editingListing) {
        setFormData({ skillOffered: '', skillWanted: '', category: '', description: '', contactInfo: '' })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = !!editingListing

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        {isEditing ? <Edit2 className="text-brand-from" size={28} /> : <PlusCircle className="text-brand-from" size={28} />}
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {isEditing ? 'Edit Listing' : 'Post Your Skill'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6">
        {/* Skill Offered */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Skill You Offer *
          </label>
          <input
            type="text"
            value={formData.skillOffered}
            onChange={(e) => setFormData({ ...formData, skillOffered: e.target.value })}
            placeholder="e.g., Logo Design, Web Development, Guitar Lessons..."
            className={`w-full px-4 py-3 rounded-xl bg-dark-800/50 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.skillOffered ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-from/50 focus:ring-brand-from/20'
            }`}
          />
          {errors.skillOffered && <p className="text-red-400 text-sm mt-2">{errors.skillOffered}</p>}
        </div>

        {/* Skill Wanted */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            Skill You Want *
          </label>
          <input
            type="text"
            value={formData.skillWanted}
            onChange={(e) => setFormData({ ...formData, skillWanted: e.target.value })}
            placeholder="e.g., Mobile App Help, English Speaking, Photography..."
            className={`w-full px-4 py-3 rounded-xl bg-dark-800/50 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.skillWanted ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-from/50 focus:ring-brand-from/20'
            }`}
          />
          {errors.skillWanted && <p className="text-red-400 text-sm mt-2">{errors.skillWanted}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-dark-800/50 border text-white focus:outline-none focus:ring-2 transition-all appearance-none ${
              errors.category ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-brand-from/50 focus:ring-brand-from/20'
            }`}
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-dark-800">Select a category...</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-dark-800">{cat.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-sm mt-2">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your skill, experience level, availability, or any other details..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all resize-none"
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contact Info (optional)</label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            placeholder="e.g., WhatsApp: 0312-xxxxxxx, email, Discord..."
            className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20 transition-all"
          />
          <p className="text-gray-500 text-xs mt-2">This will be visible to everyone who views your listing.</p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {isEditing ? 'Update Listing' : 'Post Skill'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/**
 * My Listings Page Component
 * Shows only the current user's listings
 */
const MyListingsPage = ({ listings, currentUserId, onEdit, onDelete, onContact, onNavigate }) => {
  const myListings = listings.filter(l => l.userId === currentUserId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="text-brand-from" size={28} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Listings</h1>
            <p className="text-gray-400 text-sm">{myListings.length} listing{myListings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('post')}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>

      {/* Listings Grid */}
      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map(listing => (
            <SkillCard
              key={listing.id}
              listing={listing}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onContact={onContact}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No listings yet"
          description="You haven't posted any skills yet. Start by creating your first listing!"
          actionLabel="Post Your First Skill"
          onAction={() => onNavigate('post')}
        />
      )}
    </div>
  )
}

/**
 * Profile Page Component
 * User profile with stats and account settings
 */
const ProfilePage = ({ userName, userId, listings, onUpdateName, onResetAccount }) => {
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(userName)
  const [nameError, setNameError] = useState('')

  const myListingsCount = listings.filter(l => l.userId === userId).length

  const handleSaveName = () => {
    if (!newName.trim() || newName.trim().length < 2) {
      setNameError('Name must be at least 2 characters')
      return
    }
    onUpdateName(newName.trim())
    setEditingName(false)
    setNameError('')
  }

  const handleCancelEdit = () => {
    setNewName(userName)
    setEditingName(false)
    setNameError('')
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Profile Card */}
      <div className="glass rounded-2xl p-8 text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getUserGradient(userId)} flex items-center justify-center mx-auto mb-4 glow`}>
          <span className="text-white font-bold text-2xl">{getInitials(userName)}</span>
        </div>

        {editingName ? (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNameError('') }}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/10 text-white text-center focus:outline-none focus:border-brand-from/50 focus:ring-2 focus:ring-brand-from/20"
              autoFocus
            />
            {nameError && <p className="text-red-400 text-sm">{nameError}</p>}
            <div className="flex justify-center gap-2">
              <button
                onClick={handleSaveName}
                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
            <button
              onClick={() => setEditingName(true)}
              className="text-brand-from hover:text-brand-to text-sm font-medium flex items-center gap-1 mx-auto transition-colors"
            >
              <Edit2 size={14} />
              Edit name
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-white mb-1">{myListingsCount}</p>
          <p className="text-gray-400 text-sm">My Listings</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-gray-400 text-sm">Exchanges</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400 text-sm">User ID</span>
            <span className="text-gray-300 text-sm font-mono">{truncate(userId, 16)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-400 text-sm">Platform</span>
            <span className="text-gray-300 text-sm">Barter Exchange v1.0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-sm">Database</span>
            <span className="text-gray-300 text-sm">Firebase Firestore</span>
          </div>
        </div>
      </div>

      {/* Reset Account */}
      <button
        onClick={onResetAccount}
        className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center justify-center gap-2"
      >
        <RefreshCw size={18} />
        Reset Account
      </button>
    </div>
  )
}

// ============================================
// SECTION 7: MAIN APP COMPONENT
// ============================================

/**
 * Main App Component
 * Handles authentication, routing, state management, and layout
 */
const App = () => {
  // State
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [editingListing, setEditingListing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [contactTarget, setContactTarget] = useState(null)
  const [stats, setStats] = useState({ totalListings: 0, uniqueUsers: 0, totalCategories: CATEGORIES.length })

  // Refs
  const unsubscribeRef = useRef(null)

  // ============================================
  // AUTHENTICATION
  // ============================================

  useEffect(() => {
    // Check for existing user name
    const storedName = localStorage.getItem('barterUserName')
    if (storedName) {
      setUserName(storedName)
    }

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        if (!storedName) {
          setShowWelcomeModal(true)
        }
      } else {
        // Sign in anonymously
        try {
          await signInAnonymously(auth)
        } catch (error) {
          console.error('Anonymous auth failed:', error)
          setToast({ type: 'error', message: 'Authentication failed. Please refresh.' })
        }
      }
    })

    return () => unsubscribeAuth()
  }, [])

  // ============================================
  // FIRESTORE REAL-TIME LISTENERS
  // ============================================

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const q = query(listingsCollection, orderBy('createdAt', 'desc'))

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setListings(data)

      // Calculate stats
      const uniqueUserIds = new Set(data.map(l => l.userId))
      setStats({
        totalListings: data.length,
        uniqueUsers: uniqueUserIds.size,
        totalCategories: CATEGORIES.length
      })

      setLoading(false)
    }, (error) => {
      console.error('Firestore error:', error)
      setLoading(false)
      setToast({ type: 'error', message: 'Failed to load listings. Check your connection.' })
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [user])

  // ============================================
  // HANDLERS
  // ============================================

  const handleNameSubmit = (name) => {
    localStorage.setItem('barterUserName', name)
    setUserName(name)
    setShowWelcomeModal(false)
    setToast({ type: 'success', message: `Welcome, ${name}!` })
  }

  const handleCreateListing = async (data) => {
    await addDoc(listingsCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    setToast({ type: 'success', message: 'Skill posted successfully!' })
    setActiveTab('my-listings')
  }

  const handleUpdateListing = async (data) => {
    if (!editingListing) return
    const docRef = doc(db, 'listings', editingListing.id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    setEditingListing(null)
    setToast({ type: 'success', message: 'Listing updated successfully!' })
    setActiveTab('my-listings')
  }

  const handleDeleteListing = async () => {
    if (!deleteTarget) return
    try {
      await deleteDoc(doc(db, 'listings', deleteTarget.id))
      setToast({ type: 'success', message: 'Listing deleted successfully!' })
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to delete listing.' })
    }
    setDeleteTarget(null)
  }

  const handleEditClick = (listing) => {
    setEditingListing(listing)
    setActiveTab('post')
  }

  const handleCancelEdit = () => {
    setEditingListing(null)
    setActiveTab('my-listings')
  }

  const handleContactClick = (listing) => {
    setContactTarget(listing)
  }

  const handleUpdateName = (newName) => {
    localStorage.setItem('barterUserName', newName)
    setUserName(newName)
    setToast({ type: 'success', message: 'Name updated successfully!' })
  }

  const handleResetAccount = () => {
    localStorage.removeItem('barterUserName')
    setUserName('')
    setShowWelcomeModal(true)
    setToast({ type: 'info', message: 'Account reset. Please enter your name again.' })
  }

  const handleNavigate = (tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage listings={listings} userName={userName} onNavigate={handleNavigate} stats={stats} />
      case 'explore':
        return (
          <ExplorePage
            listings={listings}
            loading={loading}
            currentUserId={user?.uid}
            onEdit={handleEditClick}
            onDelete={setDeleteTarget}
            onContact={handleContactClick}
          />
        )
      case 'post':
        return (
          <PostPage
            userId={user?.uid}
            userName={userName}
            editingListing={editingListing}
            onSubmit={editingListing ? handleUpdateListing : handleCreateListing}
            onCancel={handleCancelEdit}
            setToast={setToast}
          />
        )
      case 'my-listings':
        return (
          <MyListingsPage
            listings={listings}
            currentUserId={user?.uid}
            onEdit={handleEditClick}
            onDelete={setDeleteTarget}
            onContact={handleContactClick}
            onNavigate={handleNavigate}
          />
        )
      case 'profile':
        return (
          <ProfilePage
            userName={userName}
            userId={user?.uid || ''}
            listings={listings}
            onUpdateName={handleUpdateName}
            onResetAccount={handleResetAccount}
          />
        )
      default:
        return <HomePage listings={listings} userName={userName} onNavigate={handleNavigate} stats={stats} />
    }
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-dark-900 text-gray-300">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcomeModal} onSubmit={handleNameSubmit} />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        listing={deleteTarget}
        onConfirm={handleDeleteListing}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Contact Info Modal */}
      <ContactModal
        isOpen={!!contactTarget}
        listing={contactTarget}
        onClose={() => setContactTarget(null)}
      />

      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <RefreshCw size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:inline">Barter Exchange</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userName && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm hidden md:inline">{userName}</span>
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getUserGradient(user?.uid)} flex items-center justify-center`}>
                <span className="text-white font-bold text-xs">{getInitials(userName)}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Left Sidebar (Desktop) */}
      <aside
        className={`fixed left-0 top-16 bottom-0 glass-strong z-40 transition-all duration-300 hidden lg:flex flex-col ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={22} className="shrink-0" />
                <span className={`font-medium whitespace-nowrap transition-all ${sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`pt-16 min-h-screen transition-all ${
        'lg:ml-20'
      }`}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
          {renderPage()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 glass-strong z-50 flex items-center justify-around lg:hidden">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                isActive ? 'text-brand-from' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Mobile bottom padding for nav */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}

export default App
