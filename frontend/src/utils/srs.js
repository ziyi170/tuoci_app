/**
 * srs.js — Spaced Repetition System (simplified SM-2)
 *
 * This is the "brain" of the app.
 * Every scheduling decision flows through these pure functions.
 */

const MAX_TODAY   = 20   // max words per learning session
const MAX_REVIEW  = 30   // max words per review session
const MASTERED_AT = 5    // correct answers needed to "master" a word

/**
 * Create a fresh progress record for a word the user hasn't seen yet.
 */
export function freshProgress() {
  return {
    status:      'new',   // new | learning | review | mastered
    correct:     0,
    wrong:       0,
    next_review: null,
  }
}

/**
 * Calculate the next review date after answering.
 *
 * Correct: interval doubles each time (1d → 2d → 4d → 8d → 16d …)
 * Wrong:   review again in 12 hours
 */
export function nextReview(correct, correctCount) {
  const days = correct ? Math.pow(2, Math.min(correctCount, 7)) : 0.5
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * Update a progress record after the user answers.
 * Returns a NEW object (never mutates).
 */
export function applyAnswer(progress, correct) {
  const newCorrect = progress.correct + (correct ? 1 : 0)
  const newWrong   = progress.wrong   + (correct ? 0 : 1)

  const status =
    newCorrect >= MASTERED_AT
      ? 'mastered'
      : correct
      ? 'review'
      : 'learning'

  return {
    ...progress,
    correct:     newCorrect,
    wrong:       newWrong,
    status,
    next_review: nextReview(correct, newCorrect),
  }
}

/**
 * Score a word for today's session.
 * Higher score = higher priority = shown first.
 *
 * Factors:
 *   - Overdue for review → big bonus
 *   - Many wrong answers → higher priority
 *   - Status: learning > review > new
 */
function scoreWord(word, progress) {
  const today = new Date()
  let score = (progress.wrong * 2) - progress.correct

  if (progress.next_review && new Date(progress.next_review) <= today) {
    score += 5  // overdue bonus
  }
  if (progress.status === 'learning') score += 3
  if (progress.status === 'new')      score += 1

  return { ...word, _progress: progress, _score: score }
}

/**
 * Build today's learning queue from a word list + user progress map.
 * Returns up to MAX_TODAY words, sorted by priority.
 */
export function buildLearnQueue(words, progressMap) {
  return words
    .map(w => {
      const p = progressMap[w.word] ?? freshProgress()
      if (p.status === 'mastered') return null
      return scoreWord(w, p)
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_TODAY)
}

/**
 * Build the review queue: words where next_review <= now.
 */
export function buildReviewQueue(words, progressMap) {
  const now = new Date()
  return words
    .map(w => {
      const p = progressMap[w.word]
      if (!p || p.status === 'new' || p.status === 'mastered') return null
      if (!p.next_review || new Date(p.next_review) > now) return null
      return { ...w, _progress: p }
    })
    .filter(Boolean)
    .slice(0, MAX_REVIEW)
}

/**
 * Compute summary statistics from a word list + progress map.
 */
export function computeStats(words, progressMap) {
  const total    = words.length
  const mastered = words.filter(w => progressMap[w.word]?.status === 'mastered').length
  const learning = words.filter(w => ['learning', 'review'].includes(progressMap[w.word]?.status)).length
  const unseen   = words.filter(w => !progressMap[w.word] || progressMap[w.word].status === 'new').length
  const dueNow   = buildReviewQueue(words, progressMap).length

  return { total, mastered, learning, unseen, dueNow }
}
