/**
 * Review.jsx — SRS review session
 * Shows all words whose next_review date has passed.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import VocabCard     from '../components/VocabCard'
import AnswerButtons  from '../components/AnswerButtons'
import ProgressBar   from '../components/ProgressBar'

export default function Review({ reviewQueue, recordAnswer }) {
  const nav = useNavigate()

  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [flash,    setFlash]    = useState(null)

  const queue = useRef(reviewQueue).current
  const word  = queue[idx]

  function advance() {
    setFlash(null); setRevealed(false)
    setIdx(i => i + 1)
  }

  function handleCorrect() {
    recordAnswer(word.word, true)
    setFlash('correct')
    setTimeout(advance, 320)
  }
  function handleWrong() {
    recordAnswer(word.word, false)
    setFlash('wrong')
    setTimeout(advance, 320)
  }

  useEffect(() => {
    function onKey(e) {
      if (!word) return
      if ((e.key === ' ' || e.key === 'Enter') && !revealed) { e.preventDefault(); setRevealed(true) }
      else if (e.key === 'ArrowRight' && revealed) handleCorrect()
      else if (e.key === 'ArrowLeft'  && revealed) handleWrong()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, word])

  // Empty
  if (queue.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center fade-up">
        <div className="text-5xl mb-4">🎉</div>
        <div className="font-serif text-2xl font-bold mb-2">今日复习完成！</div>
        <div className="text-muted text-[14px] mb-6">明天还有更多词等着你，保持节奏！</div>
        <button onClick={() => nav('/learn')}
                className="bg-accent text-bg font-bold px-8 py-3 rounded-full active:scale-95">
          回到学习
        </button>
      </div>
    )
  }

  // All done
  if (idx >= queue.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center fade-up">
        <div className="text-5xl mb-4">✅</div>
        <div className="font-serif text-2xl font-bold mb-2">本轮复习完成！</div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => nav('/learn')}
                  className="bg-accent text-bg font-bold px-6 py-3 rounded-full active:scale-95">
            继续学习
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
      <div className="flex items-center gap-2 bg-surface border border-border
                      self-start px-4 py-1.5 rounded-full font-mono text-[10px]
                      tracking-wide uppercase text-muted">
        <span className="w-2 h-2 rounded-full bg-accent2 dot-pulse" />
        SRS 复习队列
      </div>

      <ProgressBar current={idx} total={queue.length} />

      <VocabCard word={word} revealed={revealed} flash={flash} />

      <div className="mt-auto">
        {!revealed ? (
          <button onClick={() => setRevealed(true)}
                  className="w-full border border-dashed border-border/60 text-muted
                             rounded-full py-3 text-[13px] active:text-white transition-colors">
            👁 显示释义
          </button>
        ) : (
          <AnswerButtons onCorrect={handleCorrect} onWrong={handleWrong}
                         label={['✓ 记住了', '✗ 忘了']} />
        )}
      </div>
    </div>
  )
}
