/**
 * WordList.jsx — Browse all words with status filter
 */
import { useState } from 'react'

const FILTERS = [
  { key: 'all',      label: '全部'   },
  { key: 'learning', label: '学习中' },
  { key: 'review',   label: '复习中' },
  { key: 'mastered', label: '已掌握' },
  { key: 'new',      label: '未学'   },
]

const STATUS_LABEL = {
  mastered: { text: '已掌握', cls: 'bg-accent/10 text-accent' },
  review:   { text: '复习中', cls: 'bg-accent2/10 text-accent2' },
  learning: { text: '学习中', cls: 'bg-warn/10 text-warn' },
  new:      { text: '未学',   cls: 'bg-surface2 text-muted border border-border' },
}

export default function WordList({ words, progressMap }) {
  const [filter, setFilter] = useState('all')

  const filtered = words.filter(w => {
    const status = progressMap[w.word]?.status ?? 'new'
    return filter === 'all' || status === filter
  })

  return (
    <div className="h-full flex flex-col px-5 pt-5 pb-4 overflow-hidden fade-up">
      <div className="mb-4">
        <div className="font-serif text-2xl font-bold">我的词库</div>
        <div className="text-[14px] text-muted mt-1">{words.length} 个词 · {filtered.length} 个显示</div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-mono
                              border transition-colors
                              ${filter === f.key
                                ? 'bg-accent/10 border-accent/40 text-accent'
                                : 'bg-surface border-border text-muted'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Word list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center text-muted pt-12 text-[14px]">这个分类暂无词汇</div>
        ) : (
          filtered.map(w => {
            const status = progressMap[w.word]?.status ?? 'new'
            const p = progressMap[w.word]
            const { text, cls } = STATUS_LABEL[status] ?? STATUS_LABEL.new
            return (
              <div key={w.word}
                   className="flex items-center justify-between bg-surface border border-border
                              rounded-xl px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px]">{w.word}</div>
                  <div className="text-[12px] text-muted truncate mt-0.5">{w.meaning}</div>
                  {p && p.status !== 'new' && (
                    <div className="text-[10px] font-mono text-border mt-1">
                      ✓{p.correct} ✗{p.wrong}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded-md flex-shrink-0 ${cls}`}>
                  {text}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
