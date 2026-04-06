/**
 * routes/ai.js
 *
 * POST /api/ai/generate
 * Body: { word }
 *
 * Returns AI-generated content for a word:
 *   - 2 IELTS-style example sentences
 *   - 3 synonyms with usage differences
 *   - 1 paraphrase exercise
 *
 * Results are cached in MongoDB — each word is only generated ONCE.
 * This keeps API costs near zero.
 */
const router    = require('express').Router()
const OpenAI    = require('openai')
const WordCache = require('../models/WordCache')
const auth      = require('../middleware/auth')

router.use(auth)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post('/generate', async (req, res) => {
  try {
    const { word } = req.body
    if (!word) return res.status(400).json({ error: 'word is required' })

    // Check cache first
    const cached = await WordCache.findOne({ word })
    if (cached) return res.json({ word, ...cached.toObject(), fromCache: true })

    // Call OpenAI
    const prompt = `
You are an IELTS writing expert. For the word "${word}", provide:
1. Two formal IELTS writing example sentences (band 7+ level)
2. Three synonyms with a one-sentence note on usage difference
3. One paraphrase exercise: a sentence using "${word}" that the student must rewrite using a synonym

Respond ONLY in this exact JSON format, no markdown:
{
  "sentences": ["sentence1", "sentence2"],
  "synonyms": [
    { "word": "synonym1", "difference": "usage note" },
    { "word": "synonym2", "difference": "usage note" },
    { "word": "synonym3", "difference": "usage note" }
  ],
  "paraphrase": "Original sentence using ${word}."
}
`.trim()

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  500,
      temperature: 0.7,
    })

    const raw  = completion.choices[0].message.content
    const data = JSON.parse(raw)

    // Save to cache
    const cache = await WordCache.create({ word, ...data })
    res.json({ word, ...data, fromCache: false })
  } catch (err) {
    console.error('AI generate error:', err)
    res.status(500).json({ error: 'AI generation failed' })
  }
})

module.exports = router
