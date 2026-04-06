/**
 * VocabCard.jsx — The main learning card
 *
 * Props:
 *   word      — word object from data/words.js
 *   revealed  — boolean: show or hide the answer side
 *   flash     — null | 'correct' | 'wrong' (brief animation)
 */

export default function VocabCard({ word, revealed, flash }) {
  if (!word) return null

  const flashClass = flash === 'correct' ? 'flash-correct'
                   : flash === 'wrong'   ? 'flash-wrong'
                   : ''

  return (
    <div className={`relative bg-surface border border-border rounded-3xl
                     p-8 flex flex-col items-center gap-3 text-center
                     min-h-[280px] justify-center overflow-hidden ${flashClass}`}>

      {/* Subtle top-right glow */}
      <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px]
                      rounded-full bg-accent/5 pointer-events-none" />

      {/* Frequency tag */}
      <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-accent/70">
        {word.freq.toUpperCase()} FREQ · Band {word.band}
      </div>

      {/* The word */}
      <div className="font-serif text-[clamp(40px,10vw,56px)] font-bold leading-none tracking-tight">
        {word.word}
      </div>

      {/* Phonetic */}
      <div className="font-mono text-[15px] text-muted font-light">
        {word.phonetic}
      </div>

      {/* Revealed: meaning + synonyms + example */}
      {revealed && (
        <div className="flex flex-col items-center gap-3 w-full reveal-in">
          <div className="text-[19px] text-muted font-light">{word.meaning}</div>

          <div className="flex gap-2 flex-wrap justify-center">
            {word.synonyms.map(s => (
              <span key={s}
                    className="bg-accent2/[0.08] border border-accent2/20
                               text-accent2 px-3 py-1 rounded-full text-[12px] font-mono">
                {s}
              </span>
            ))}
          </div>

          <div className="text-[13px] text-muted italic leading-relaxed
                          border-l-2 border-border pl-3 text-left w-full max-w-sm mt-1">
            {word.example}
          </div>
        </div>
      )}
    </div>
  )
}
