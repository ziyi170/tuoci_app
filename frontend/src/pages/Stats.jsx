/**
 * Stats.jsx — Learning statistics + settings
 */
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Stats({ stats, book, reset }) {
  const nav = useNavigate()

  const chartData = [
    { name: '已掌握', value: stats.mastered, color: '#a8e063' },
    { name: '学习中', value: stats.learning, color: '#e0c463' },
    { name: '未学',   value: stats.unseen,   color: '#27272f' },
    { name: '待复习', value: stats.dueNow,   color: '#63d4e0' },
  ]

  function handleReset() {
    if (!confirm('确定要重置所有学习进度吗？此操作不可撤销。')) return
    reset()
    nav('/')
  }

  return (
    <div className="h-full overflow-y-auto px-5 pt-5 pb-10 fade-up">
      <div className="font-serif text-2xl font-bold mb-1">学习统计</div>
      <div className="text-[14px] text-muted mb-5">
        {book ? `当前词书：${book.name}` : '未选择词书'}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: '已掌握', value: stats.mastered, cls: 'text-accent'  },
          { label: '学习中', value: stats.learning, cls: 'text-warn'    },
          { label: '今日复习', value: stats.dueNow, cls: 'text-accent2' },
          { label: '词书总词', value: stats.total,  cls: 'text-white'   },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
            <div className={`font-serif text-[36px] font-bold leading-none mb-1 ${s.cls}`}>
              {s.value}
            </div>
            <div className="text-[12px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted mb-4">
          词汇状态分布
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} barSize={32} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tick={{ fill: '#9b9aab', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9b9aab', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181d', border: '1px solid #27272f', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#eeeae4' }}
              itemStyle={{ color: '#9b9aab' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress overview bar */}
      {stats.total > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
          <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted mb-3">
            整体进度
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-700"
                 style={{ width: `${Math.round(stats.mastered / stats.total * 100)}%` }} />
          </div>
          <div className="text-[12px] text-muted mt-2 font-mono">
            {Math.round(stats.mastered / stats.total * 100)}% 掌握率
          </div>
        </div>
      )}

      {/* Settings panel */}
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-muted mb-2">设置</div>
      <div className="bg-surface border border-border rounded-2xl divide-y divide-border mb-6">
        {[
          { label: '当前词书',   value: book?.name ?? '—' },
          { label: '每日新词上限', value: '20' },
          { label: 'SRS 算法',    value: 'SM-2' },
          { label: '版本',        value: 'v1.0.0' },
        ].map(s => (
          <div key={s.label} className="flex justify-between items-center px-4 py-3.5">
            <div className="text-[14px]">{s.label}</div>
            <div className="font-mono text-[13px] text-accent">{s.value}</div>
          </div>
        ))}
      </div>

      <button onClick={handleReset}
              className="w-full bg-danger/10 text-danger border border-danger/25
                         font-semibold py-4 rounded-full active:scale-[0.97] transition-transform">
        ⚠ 重置所有进度
      </button>
    </div>
  )
}
