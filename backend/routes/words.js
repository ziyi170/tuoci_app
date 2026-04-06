/**
 * backend/routes/words.js
 *
 * GET  /api/words/:bookId          — 获取词书全部单词（前端渲染卡片用）
 * GET  /api/words/:bookId/list     — 只返回 word 字段列表（轻量）
 * POST /api/words/ai/:word         — 按需生成 AI 扩展内容，全局缓存
 *
 * 核心设计：
 *   用户第一次点"AI 生成" → 调 OpenAI → 结果写入 Word 文档的 ai_* 字段
 *   之后任何用户看同一个词 → 直接返回数据库里缓存的内容，不再花钱
 */
const router = require('express').Router()
const OpenAI = require('openai')
const Word   = require('../models/Word')
const auth   = require('../middleware/auth')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── GET 词书全部单词 ─────────────────────────────────────────────────────
// 不需要登录（词书是公开内容）
router.get('/:bookId', async (req, res) => {
  try {
    const words = await Word.find(
      { bookId: req.params.bookId },
      // 只返回前端需要的字段，减小响应体积
      'word phonetic meaning freq band synonyms example ai_generated'
    ).sort({ freq: -1 }) // high freq 排前面

    res.json({ words, count: words.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST AI 按需生成（带全局缓存）────────────────────────────────────────
// 需要登录（防止滥用）
router.post('/ai/:word', auth, async (req, res) => {
  const { word } = req.params

  try {
    // ① 先查数据库缓存
    const cached = await Word.findOne({ word })

    if (cached?.ai_generated) {
      // 命中缓存 → 直接返回，0 费用
      return res.json({
        word,
        ai_sentences:  cached.ai_sentences,
        ai_synonyms:   cached.ai_synonyms,
        ai_paraphrase: cached.ai_paraphrase,
        from_cache:    true,   // 方便前端 debug/展示
      })
    }

    // ② 没有缓存 → 调 OpenAI
    const prompt = buildAIPrompt(word, cached?.meaning ?? '')

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',   // 用最便宜的模型，质量够用
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  600,
      temperature: 0.6,
    })

    const raw  = completion.choices[0].message.content.trim()
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw })
    }

    // ③ 写入数据库（全局缓存，其他用户也受益）
    await Word.findOneAndUpdate(
      { word },
      {
        $set: {
          ai_generated:  true,
          ai_sentences:  data.sentences  ?? [],
          ai_synonyms:   data.synonyms   ?? [],
          ai_paraphrase: data.paraphrase ?? '',
        }
      },
      { upsert: false }  // 词必须已存在（由 seed 脚本创建）
    )

    // ④ 返回给用户
    res.json({
      word,
      ai_sentences:  data.sentences,
      ai_synonyms:   data.synonyms,
      ai_paraphrase: data.paraphrase,
      from_cache:    false,
    })

  } catch (err) {
    console.error('AI route error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Prompt 构建 ──────────────────────────────────────────────────────────
function buildAIPrompt(word, meaning) {
  return `
You are an expert IELTS writing tutor. For the word "${word}"${meaning ? ` (${meaning})` : ''}, generate:

1. Two formal IELTS writing example sentences (band 7+, 15–25 words each, different contexts)
2. Three near-synonyms, each with a one-sentence note on usage difference (max 15 words per note)
3. One paraphrase exercise: write a sentence using "${word}" that students must rewrite with a synonym

Respond ONLY in this exact JSON. No markdown, no extra text:
{
  "sentences": [
    "First IELTS example sentence here.",
    "Second IELTS example sentence here."
  ],
  "synonyms": [
    { "word": "synonym1", "difference": "Usage difference note." },
    { "word": "synonym2", "difference": "Usage difference note." },
    { "word": "synonym3", "difference": "Usage difference note." }
  ],
  "paraphrase": "Original sentence using the target word."
}
`.trim()
}

module.exports = router
