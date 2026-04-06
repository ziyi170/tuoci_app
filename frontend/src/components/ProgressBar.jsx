export default function ProgressBar({ current, total, rightLabel }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-[12px] text-muted">
          <span className="text-white font-medium">{current}</span> / {total}
        </span>
        <span className="font-mono text-[12px] text-accent2">{rightLabel || `${pct}%`}</span>
      </div>
      <div className="h-[3px] bg-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500 ease-out"
             style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #63d4e0, #a8e063)' }} />
      </div>
    </div>
  )
}
