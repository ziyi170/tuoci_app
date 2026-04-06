/**
 * AnswerButtons.jsx — Know / Don't know buttons
 */
export default function AnswerButtons({ onCorrect, onWrong, label = ['✓ 记住了', '✗ 没记住'] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button onClick={onCorrect}
              className="rounded-2xl py-5 text-[15px] font-semibold
                         bg-accent/10 text-accent border border-accent/25
                         active:scale-95 transition-transform flex flex-col items-center gap-1">
        {label[0]}
        <span className="text-[10px] font-mono opacity-50">Space / →</span>
      </button>
      <button onClick={onWrong}
              className="rounded-2xl py-5 text-[15px] font-semibold
                         bg-danger/[0.08] text-danger border border-danger/20
                         active:scale-95 transition-transform flex flex-col items-center gap-1">
        {label[1]}
        <span className="text-[10px] font-mono opacity-50">←</span>
      </button>
    </div>
  )
}
