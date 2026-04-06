/**
 * Learn.jsx — Main learning session
 *
 * Uses the SRS-sorted learnQueue from App.jsx.
 * Each card: tap to reveal → mark correct/wrong → SRS updates → next card
 * When queue is done → show summary screen
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import VocabCard    from '../components/VocabCard'
import AnswerButtons from '../components/AnswerButtons'
import ProgressBar  from '../components/ProgressBar'

export default function Learn({ learnQueue, reviewQueue, stats, recordAnswer }) {
  const nav = useNavigate()

  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [flash,    setFlash]    = useState(null)
  const [sessionOk,  setSessionOk]  = useState(0)
  const [sessionNo,  setSessionNo]  = useState(0)
  const [done,     setDone]     = useState(false)

  // Snapshot the queue at mount so it doesn't shift under us mid-session
  const queue = useRef(learnQueue).current
  const word  = queue[idx]

  function advance() {
    setFlash(null); setRevealed(false)
    if (idx + 1 >= queue.length) { setDone(true); return }
    setIdx(i => i + 1)
  }

  function handleCorrect() {
    recordAnswer(word.word, true)
    setFlash('correct'); setSessionOk(n => n + 1)
    setTimeout(advance, 320)
  }

  function handleWrong() {
    recordAnswer(word.word, false)
    setFlash('wrong'); setSessionNo(n => n + 1)
    setTimeout(advance, 320)
  }

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (done) return
      if ((e.key === ' ' || e.key === 'Enter') && !revealed) { e.preventDefault(); setRevealed(true) }
      else if (e.key === 'ArrowRight' && revealed) handleCorrect()
      else if (e.key === 'ArrowLeft'  && revealed) handleWrong()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, done, word])

  // ── Empty state ──
  if (queue.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center fade-up">
        <div className="text-5xl mb-4">✨</div>
        <div className="font-serif text-2xl font-bold mb-2">今日学习完成！</div>
        <div className="text-muted text-[14px] mb-6">
          {reviewQueue.length > 0 ? `还有 ${reviewQueue.length} 个词待复习` : '今天全部搞定，明天继续！'}
        </div>
        {reviewQueue.length > 0 && (
          <button onClick={() => nav('/review')}
                  className="bg-accent text-bg font-bold px-8 py-3 rounded-full active:scale-95">
            去复习 →
          </button>
        )}
      </div>
    )
  }

  // ── Done summary ──
  if (done) {
    const acc = sessionOk + sessionNo > 0
      ? Math.round(sessionOk / (sessionOk + sessionNo) * 100) : 0
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center fade-up">
        <div className="text-6xl mb-4">{acc >= 70 ? '🎉' : '💪'}</div>
        <div className="font-serif text-[28px] font-bold mb-2">本轮完成！</div>
        <div className="text-muted text-[14px] mb-6">
          正确率 {acc}% · 答对 {sessionOk} 答错 {sessionNo}
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
          {[
            { label: '已掌握', val: stats.mastered, cls: 'text-accent' },
            { label: '今日复习', val: reviewQueue.length, cls: 'text-accent2' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
              <div className={`font-serif text-3xl font-bold ${s.cls}`}>{s.val}</div>
              <div className="text-[12px] text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => nav('/review')}
                  className="bg-accent text-bg font-bold px-6 py-3 rounded-full active:scale-95">
            去复习
          </button>
          <button onClick={() => nav('/stats')}
                  className="bg-surface border border-border text-white px-6 py-3 rounded-full active:scale-95">
            查看统计
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col px-5 pt-5 pb-6 gap-4 overflow-hidden fade-up">
      {/* Phase chip */}
      <div className="flex items-center gap-2 bg-surface border border-border
                      self-start px-4 py-1.5 rounded-full font-mono text-[10px]
                      tracking-wide uppercase text-muted">
        <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
        智能推荐学习
      </div>

      <ProgressBar current={idx} total={queue.length}
                   rightLabel={reviewQueue.length > 0 ? `${reviewQueue.length} 词待复习` : undefined} />

      <VocabCard word={word} revealed={revealed} flash={flash} />

      <div className="mt-auto">
        {!revealed ? (
          <button onClick={() => setRevealed(true)}
                  className="w-full border border-dashed border-border/60 text-muted
                             rounded-full py-3 text-[13px] active:text-white transition-colors">
            👁 显示释义
          </button>
        ) : (
          <AnswerButtons onCorrect={handleCorrect} onWrong={handleWrong} />
        )}
        <p className="text-center text-[10px] text-border mt-3 font-mono hidden md:block">
          Space 翻牌 · ← 没记住 · → 记住了
        </p>
      </div>
    </div>
  )
}
