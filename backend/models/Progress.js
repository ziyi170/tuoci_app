/**
 * Progress.js — stores one record per (user, word) pair
 *
 * This is the heart of the SRS system.
 * Every time a user answers a word, this document is updated.
 */
const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId:      { type: String, required: true },   // 'core' | 'academic'
  word:        { type: String, required: true },
  status:      { type: String, enum: ['new','learning','review','mastered'], default: 'new' },
  correct:     { type: Number, default: 0 },
  wrong:       { type: Number, default: 0 },
  next_review: { type: Date,   default: null },
  updatedAt:   { type: Date,   default: Date.now },
})

// Compound unique index: one progress doc per user + word
progressSchema.index({ userId: 1, word: 1 }, { unique: true })
// Query index: for fetching today's due words efficiently
progressSchema.index({ userId: 1, bookId: 1, status: 1, next_review: 1 })

module.exports = mongoose.model('Progress', progressSchema)
