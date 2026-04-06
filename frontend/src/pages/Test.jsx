/**
 * Test.jsx — Phase 1:快速筛词
 *
 * Shows every NEW word once and asks: "认识？"
 * Correct  → status = 'mastered' (skip in learning)
 * Wrong    → status = 'learning' (prioritise in learning)
 *
 * After all words are screened → redirect to /learn
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import VocabCard    from '../components/VocabCard'
import ProgressBar  from '../components/ProgressBar'

export default function Test({ words, progressMap, recordAnswer }) {
  const nav = useNavigate()

  // Only test NEW words
  const queue = words.filter(w => !progressMap[w.word] || progressMap[w.word].status === 'new')

  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [flash,    setFlash]    = useState(null)

  const word = queue[idx]

  // ── When queue is empty, move to learning ──
  useEffect(() => {
    if (queue.length === 0) nav('/learn', { replace: true })
  }, [queue.length, nav])

  function advance() {
    setFlash(null)
    setRevealed(false)
    setIdx(i => i + 1)
  }

  function markKnow() {
    recordAnswer(word.word, true)   // true = correct
    setFlash('correct')
    setTimeout(advance, 320)
  }

  function markDontKnow() {
    recordAnswer(word.word, false)  // false = wrong
    setFlash('wrong')
    setTimeout(advance, 320)
  }

  // ── Keyboard shortcuts ──
  useEffect(() => {
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter')      { e.preventDefault(); setRevealed(true) }
      else if (e.key === 'ArrowRight' && revealed)  markKnow()
      else if (e.key === 'ArrowLeft'  && revealed)  markDontKnow()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, word])

  if (!word) return null

  return (
    <div className="h-full flex flex-col px-5 pt-5 pb-6 overflow-hidden fade-up">
      {/* Phase chip */}
      <div className="flex items-center gap-2 bg-surface border border-border
                      self-start px-4 py-1.5 rounded-full font-mono text-[10px]
                      tracking-wide uppercase text-muted mb-4">
        <span className="w-2 h-2 rounded-full bg-warn" />
        Phase 1 · 快速筛词
      </div>

      <ProgressBar current={idx} total={queue.length}
                   rightLabel={`${Math.round(idx / queue.length * 100)}%`} />

      <VocabCard word={word} revealed={revealed} flash={flash} />

      <div className="mt-4">
        {!revealed ? (
          <button onClick={() => setRevealed(true)}
                  className="w-full border border-dashed border-border/60 text-muted
                             rounded-full py-3 text-[13px] active:text-white transition-colors">
            👁 查看释义
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={markDontKnow}
                    className="rounded-2xl py-5 text-[15px] font-semibold
                               bg-danger/[0.08] text-danger border border-danger/20
                               active:scale-95 transition-transform">
              ✗ 不认识
            </button>
            <button onClick={markKnow}
                    className="rounded-2xl py-5 text-[15px] font-semibold
                               bg-accent/10 text-accent border border-accent/25
                               active:scale-95 transition-transform">
              ✓ 认识
            </button>
          </div>
        )}
      </div>

      <button onClick={() => nav('/learn')}
              className="mt-3 text-center text-[13px] text-muted/60 w-full py-2">
        跳过筛词，直接开始
      </button>
    </div>
  )
}
