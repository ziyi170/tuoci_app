/**
 * backend/models/Word.js
 *
 * 存储完整的单词卡片数据。
 *
 * 设计原则（来自项目文档）：
 * - 基础字段（word / meaning / freq / band / synonyms / example）
 *   由 seed.js 脚本批量生成后写入，之后永久不变。
 * - AI 扩展字段（ai_sentences / ai_synonyms / ai_paraphrase）
 *   在用户第一次点击"AI 生成"时按需生成并写入，
 *   之后所有用户共享同一份缓存，不再重复调用 OpenAI。
 */
const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  // ── 基础词卡（seed 脚本写入，离线生成）──────────────────────────
  bookId:    { type: String, required: true, index: true },   // 'core' | 'academic'
  word:      { type: String, required: true },
  phonetic:  { type: String, default: '' },
  meaning:   { type: String, required: true },               // 中文释义
  freq:      { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  band:      { type: String, default: '6-7' },               // IELTS band 范围
  synonyms:  [String],                                       // 基础同义词列表
  example:   { type: String, default: '' },                  // 精选 IELTS 例句

  // ── AI 扩展内容（按需生成，全局缓存）────────────────────────────
  ai_generated: { type: Boolean, default: false },           // 是否已生成过
  ai_sentences: [String],                                    // 2 个高质量 IELTS 例句
  ai_synonyms: [                                             // 同义词 + 用法区别
    {
      word:       String,
      difference: String,   // 和原词的语气/场景区别
    }
  ],
  ai_paraphrase: { type: String, default: '' },              // 改写练习题

  createdAt: { type: Date, default: Date.now },
})

// 复合唯一索引：同一词书里单词不重复
wordSchema.index({ bookId: 1, word: 1 }, { unique: true })

module.exports = mongoose.model('Word', wordSchema)
