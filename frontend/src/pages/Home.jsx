/**
 * Home.jsx — Book selection + entry point
 */
import { useNavigate } from 'react-router-dom'
import { BOOKS, WORDS } from '../data/words'

export default function Home({ bookId, selectBook, progressMap, stats }) {
  const nav = useNavigate()

  function handleStart() {
    if (!bookId) { alert('请先选择词书'); return }
    const words = WORDS[bookId] ?? []
    const hasNew = words.some(w => !progressMap[w.word] || progressMap[w.word].status === 'new')
    nav(hasNew ? '/test' : '/learn')
  }

  return (
    <div className="screen overflow-y-auto h-full px-5 pt-6 pb-10 fade-up">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[1.5px] uppercase text-accent mb-3">
          <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
          IELTS Smart Vocabulary
        </div>
        <h1 className="font-serif text-[clamp(34px,8vw,50px)] font-bold leading-[1.1] tracking-tight mb-3">
          学对词，<br /><em className="text-accent not-italic">拿高分</em>
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-sm">
          雅思考频 × 同义词网络 × SRS 自适应算法<br />
          只学你真正需要的词。
        </p>
      </div>

      {/* Book selection */}
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-muted mb-3">选择词书</p>
      <div className="flex flex-col gap-3 mb-8">
        {BOOKS.map(b => (
          <BookCard key={b.id} book={b}
                    selected={bookId === b.id}
                    wordCount={WORDS[b.id]?.length ?? 0}
                    onClick={() => selectBook(b.id, WORDS[b.id] ?? [])} />
        ))}
      </div>

      <button onClick={handleStart}
              className="w-full bg-accent text-bg font-bold text-[15px] py-4 rounded-full
                         active:scale-[0.97] transition-transform">
        开始学习 →
      </button>

      {/* Quick stats if returning user */}
      {bookId && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: '已掌握', value: stats.mastered, color: 'text-accent' },
            { label: '学习中', value: stats.learning, color: 'text-warn' },
            { label: '待复习', value: stats.dueNow,   color: 'text-accent2' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
              <div className={`font-serif text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[12px] text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BookCard({ book, selected, wordCount, onClick }) {
  return (
    <div onClick={onClick}
         className={`relative bg-surface border rounded-2xl p-5 cursor-pointer
                     transition-all active:scale-[0.98]
                     ${selected ? 'border-accent' : 'border-border'}`}>
      {selected && (
        <div className="absolute inset-0 rounded-2xl bg-accent/[0.04] pointer-events-none" />
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-[16px]">{book.name}</div>
        {selected
          ? <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[11px] text-bg font-bold">✓</div>
          : <div className="bg-accent text-bg text-[9px] font-bold font-mono px-2 py-1 rounded-md tracking-wide">{book.badge}</div>
        }
      </div>
      <div className="text-[13px] text-muted leading-snug mb-3">{book.desc}</div>
      <div className="flex gap-4">
        <span className="font-mono text-[12px] text-muted"><span className="text-white font-medium">{wordCount}</span> 词</span>
        <span className="font-mono text-[12px] text-muted">Band <span className="text-white font-medium">{book.level}</span></span>
      </div>
    </div>
  )
}
