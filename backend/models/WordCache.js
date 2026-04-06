/**
 * WordCache.js — Caches AI-generated content per word
 *
 * Key design decision from the project spec:
 * "Generate once → save to DB → reuse forever"
 * This keeps OpenAI API costs near zero.
 */
const mongoose = require('mongoose')

const wordCacheSchema = new mongoose.Schema({
  word:       { type: String, required: true, unique: true },
  sentences:  [String],      // 2 IELTS-style example sentences
  synonyms:   [{ word: String, difference: String }],  // synonym + usage note
  paraphrase: String,        // one paraphrase exercise
  createdAt:  { type: Date, default: Date.now },
})

module.exports = mongoose.model('WordCache', wordCacheSchema)
