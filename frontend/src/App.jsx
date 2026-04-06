/**
 * App.jsx — Root component
 *
 * Handles:
 *   1. Global state (book selection, progress)
 *   2. React Router routes
 *   3. Shared layout (top nav + bottom tab bar)
 */

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { BOOKS, WORDS } from './data/words'
import { useProgress } from './hooks/useProgress'
import { computeStats, buildLearnQueue, buildReviewQueue } from './utils/srs'

// Pages
import Home    from './pages/Home'
import Test    from './pages/Test'
import Learn   from './pages/Learn'
import Review  from './pages/Review'
import WordList from './pages/WordList'
import Stats   from './pages/Stats'

export default function App() {
  const location = useNavigate ? useNavigate() : null
  const loc      = useLocation()

  // ── Current word list ──────────────────────────
  // We'll derive this from selected book
  const { bookId, progressMap, selectBook, recordAnswer, reset } = useProgress()

  const words  = bookId ? (WORDS[bookId] ?? []) : []
  const book   = BOOKS.find(b => b.id === bookId)

  // ── Derived queues (memoised so they don't recalculate on every render) ──
  const learnQueue  = useMemo(() => buildLearnQueue(words, progressMap),  [words, progressMap])
  const reviewQueue = useMemo(() => buildReviewQueue(words, progressMap), [words, progressMap])
  const stats       = useMemo(() => computeStats(words, progressMap),     [words, progressMap])

  // ── Shared props passed to every page ──
  const shared = { words, book, bookId, progressMap, learnQueue, reviewQueue, stats, recordAnswer, selectBook, reset }

  // ── Tab bar visibility ──
  const showTabs = bookId && !['/'].includes(loc.pathname) && !loc.pathname.startsWith('/test')

  return (
    <div className="flex flex-col h-full bg-bg overflow-hidden relative">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb   absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px]
                        bg-accent top-[-150px] right-[-150px]" />
        <div className="orb-b absolute w-[420px] h-[420px] rounded-full opacity-[0.06] blur-[100px]
                        bg-accent2 bottom-[-100px] left-[-100px]" />
      </div>

      {/* Top nav */}
      <TopNav stats={stats} showStats={!!bookId} />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <Routes>
          <Route path="/"        element={<Home   {...shared} />} />
          <Route path="/test"    element={<Test   {...shared} />} />
          <Route path="/learn"   element={<Learn  {...shared} />} />
          <Route path="/review"  element={<Review {...shared} />} />
          <Route path="/words"   element={<WordList {...shared} />} />
          <Route path="/stats"   element={<Stats  {...shared} />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom tab bar */}
      {showTabs && <TabBar />}
    </div>
  )
}

// ── Top navigation bar ────────────────────────────────────────────────────
function TopNav({ stats, showStats }) {
  return (
    <nav className="relative z-50 flex items-center justify-between
                    px-5 bg-bg/90 backdrop-blur-xl border-b border-border flex-shrink-0"
         style={{ height: 56, paddingTop: 'var(--sat)' }}>
      <span className="font-serif font-bold text-xl text-accent tracking-tight">
        拓词<span className="text-muted font-normal text-sm ml-1">· IELTS</span>
      </span>
      {showStats && (
        <div className="flex gap-2">
          <Pill label="今日" value={stats.learnQueue ?? 0} />
          <Pill label="掌握" value={stats.mastered} />
        </div>
      )}
    </nav>
  )
}

function Pill({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-full px-3 py-1
                    text-[11px] font-mono text-muted whitespace-nowrap">
      {label} <span className="text-accent font-medium">{value}</span>
    </div>
  )
}

// ── Bottom tab bar ────────────────────────────────────────────────────────
function TabBar() {
  const loc = useLocation()
  const tabs = [
    { to: '/learn',  icon: '📖', label: '学习'  },
    { to: '/review', icon: '🔁', label: '复习'  },
    { to: '/words',  icon: '📋', label: '词库'  },
    { to: '/stats',  icon: '📊', label: '统计'  },
  ]
  return (
    <nav className="relative z-50 flex items-center justify-around
                    bg-bg/95 backdrop-blur-xl border-t border-border flex-shrink-0"
         style={{ height: 68, paddingBottom: 'var(--sab)' }}>
      {tabs.map(t => <Tab key={t.to} {...t} active={loc.pathname === t.to} />)}
    </nav>
  )
}

function Tab({ to, icon, label, active }) {
  const nav = useNavigate()
  return (
    <button onClick={() => nav(to)}
            className={`flex flex-col items-center gap-1 flex-1 py-2 text-[9px]
                        font-mono tracking-wide uppercase transition-colors
                        ${active ? 'text-accent' : 'text-muted'}`}>
      <span className={`text-[22px] leading-none transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
      </span>
      {label}
    </button>
  )
}
