/**
 * routes/progress.js
 *
 * GET  /api/progress/:bookId        — fetch all progress for a book
 * POST /api/progress/answer         — record one answer (updates SRS)
 * POST /api/progress/bulk           — sync local progress on first login
 * GET  /api/progress/:bookId/today  — get today's learning queue
 */
const router   = require('express').Router()
const Progress = require('../models/Progress')
const auth     = require('../middleware/auth')

// All progress routes require authentication
router.use(auth)

// ── SRS helpers ─────────────────────────────────────────────────────────
function nextReviewDate(correct, correctCount) {
  const days = correct ? Math.pow(2, Math.min(correctCount, 7)) : 0.5
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

function newStatus(correct, correctCount) {
  if (correctCount >= 5) return 'mastered'
  return correct ? 'review' : 'learning'
}

// ── GET all progress for a book ─────────────────────────────────────────
router.get('/:bookId', async (req, res) => {
  try {
    const records = await Progress.find({
      userId: req.userId,
      bookId: req.params.bookId,
    })
    res.json({ progress: records })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST record one answer ───────────────────────────────────────────────
// Body: { bookId, word, correct }
router.post('/answer', async (req, res) => {
  try {
    const { bookId, word, correct } = req.body
    if (!bookId || !word || correct === undefined) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // Upsert: create if new, update if exists
    const doc = await Progress.findOneAndUpdate(
      { userId: req.userId, word },
      [
        {
          $set: {
            bookId,
            correct:  { $add: ['$correct', correct ? 1 : 0] },
            wrong:    { $add: ['$wrong',   correct ? 0 : 1] },
            // Re-compute status and next_review based on new correct count
            // (simplified — full SM-2 would go here)
            updatedAt: new Date(),
          },
        },
      ],
      { upsert: true, new: true }
    )

    // Compute derived fields separately (pipeline upsert can't reference updated fields)
    doc.status      = newStatus(correct, doc.correct)
    doc.next_review = nextReviewDate(correct, doc.correct)
    await doc.save()

    res.json({ progress: doc })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST bulk sync (push localStorage → server on first login) ───────────
// Body: { bookId, records: [{ word, status, correct, wrong, next_review }] }
router.post('/bulk', async (req, res) => {
  try {
    const { bookId, records } = req.body
    if (!bookId || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    const ops = records.map(r => ({
      updateOne: {
        filter: { userId: req.userId, word: r.word },
        update: { $setOnInsert: { userId: req.userId, bookId, ...r } },
        upsert: true,
      },
    }))

    await Progress.bulkWrite(ops)
    res.json({ synced: records.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET today's learning queue ───────────────────────────────────────────
router.get('/:bookId/today', async (req, res) => {
  try {
    const due = await Progress.find({
      userId:      req.userId,
      bookId:      req.params.bookId,
      status:      { $ne: 'mastered' },
      $or: [
        { next_review: { $lte: new Date() } },
        { status: 'new' },
      ],
    }).limit(20)
    res.json({ words: due.map(d => d.word) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
