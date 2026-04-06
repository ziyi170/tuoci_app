/**
 * backend/scripts/seed.js
 *
 * 一次性批量生成词库脚本。
 *
 * 做什么：
 *   1. 读取 wordlist.json 里的单词列表
 *   2. 对每个单词调一次 OpenAI（gpt-4o-mini，便宜）
 *   3. 把完整词卡数据存进 MongoDB 的 words 集合
 *   4. 已存在的词自动跳过（幂等，可以重跑）
 *
 * 怎么跑：
 *   cd backend
 *   node scripts/seed.js
 *
 * 注意：
 *   - 只需要跑一次。之后前端从 API 读，不再依赖本地 words.js。
 *   - 60 个词大约消耗 $0.02–$0.05（gpt-4o-mini 极便宜）。
 *   - 有速率限制保护（每秒最多 3 个请求）。
 */

require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const OpenAI   = require('openai')
const Word     = require('../models/Word')

// ── 你的完整单词列表（直接在这里维护，或单独放 wordlist.json）──────────
const WORD_LIST = {
  core: [
    { word:'increase',       phonetic:'/ɪnˈkriːs/',          meaning:'增加；上升',        freq:'high',   band:'6-7' },
    { word:'significant',    phonetic:'/sɪɡˈnɪfɪkənt/',     meaning:'重大的；显著的',     freq:'high',   band:'6-7' },
    { word:'decline',        phonetic:'/dɪˈklaɪn/',          meaning:'下降；减少',         freq:'high',   band:'6-7' },
    { word:'diverse',        phonetic:'/daɪˈvɜːs/',          meaning:'多样的；各异的',     freq:'high',   band:'6-7' },
    { word:'implement',      phonetic:'/ˈɪmplɪment/',        meaning:'实施；执行',         freq:'high',   band:'6-8' },
    { word:'sustain',        phonetic:'/səˈsteɪn/',          meaning:'维持；支撑',         freq:'high',   band:'6-8' },
    { word:'contribute',     phonetic:'/kənˈtrɪbjuːt/',     meaning:'贡献；促成',         freq:'high',   band:'6-7' },
    { word:'achieve',        phonetic:'/əˈtʃiːv/',           meaning:'实现；达到',         freq:'high',   band:'5-7' },
    { word:'challenge',      phonetic:'/ˈtʃælɪndʒ/',        meaning:'挑战；难题',         freq:'high',   band:'5-7' },
    { word:'impact',         phonetic:'/ˈɪmpækt/',           meaning:'影响；冲击',         freq:'high',   band:'6-7' },
    { word:'emerge',         phonetic:'/ɪˈmɜːdʒ/',           meaning:'出现；显现',         freq:'high',   band:'6-8' },
    { word:'policy',         phonetic:'/ˈpɒlɪsi/',           meaning:'政策；方针',         freq:'high',   band:'5-7' },
    { word:'adopt',          phonetic:'/əˈdɒpt/',            meaning:'采纳；采用',         freq:'high',   band:'6-7' },
    { word:'fundamental',    phonetic:'/ˌfʌndəˈmentl/',     meaning:'基本的；根本的',     freq:'high',   band:'6-8' },
    { word:'global',         phonetic:'/ˈɡləʊbl/',           meaning:'全球的',             freq:'high',   band:'5-6' },
    { word:'assess',         phonetic:'/əˈses/',              meaning:'评估；评价',         freq:'high',   band:'6-7' },
    { word:'consequence',    phonetic:'/ˈkɒnsɪkwəns/',      meaning:'后果；结果',         freq:'high',   band:'6-7' },
    { word:'generate',       phonetic:'/ˈdʒenəreɪt/',       meaning:'产生；引发',         freq:'high',   band:'6-7' },
    { word:'benefit',        phonetic:'/ˈbenɪfɪt/',          meaning:'好处；受益',         freq:'high',   band:'5-6' },
    { word:'trend',          phonetic:'/trend/',              meaning:'趋势；走向',         freq:'high',   band:'5-7' },
    { word:'evolve',         phonetic:'/ɪˈvɒlv/',            meaning:'演变；进化',         freq:'high',   band:'6-8' },
    { word:'advocate',       phonetic:'/ˈædvəkeɪt/',        meaning:'倡导；支持者',       freq:'high',   band:'6-8' },
    { word:'indicate',       phonetic:'/ˈɪndɪkeɪt/',        meaning:'表明；显示',         freq:'high',   band:'6-7' },
    { word:'establish',      phonetic:'/ɪˈstæblɪʃ/',        meaning:'建立；确立',         freq:'high',   band:'6-7' },
    { word:'enhance',        phonetic:'/ɪnˈhɑːns/',          meaning:'提升；增强',         freq:'high',   band:'6-8' },
    { word:'sector',         phonetic:'/ˈsektə/',             meaning:'行业；领域',         freq:'high',   band:'6-7' },
    { word:'restrict',       phonetic:'/rɪˈstrɪkt/',         meaning:'限制；约束',         freq:'high',   band:'6-7' },
    { word:'propose',        phonetic:'/prəˈpəʊz/',          meaning:'提议；建议',         freq:'high',   band:'6-7' },
    { word:'resource',       phonetic:'/rɪˈzɔːs/',           meaning:'资源',               freq:'high',   band:'5-7' },
    { word:'infrastructure', phonetic:'/ˈɪnfrəˌstrʌktʃə/', meaning:'基础设施',           freq:'high',   band:'6-8' },
    { word:'phenomenon',     phonetic:'/fɪˈnɒmɪnən/',       meaning:'现象',               freq:'high',   band:'6-8' },
    { word:'integrate',      phonetic:'/ˈɪntɪɡreɪt/',       meaning:'整合；融合',         freq:'high',   band:'6-8' },
    { word:'initiative',     phonetic:'/ɪˈnɪʃətɪv/',        meaning:'主动性；倡议',       freq:'high',   band:'6-8' },
    { word:'attribute',      phonetic:'/əˈtrɪbjuːt/',       meaning:'归因于',             freq:'high',   band:'6-8' },
    { word:'regulate',       phonetic:'/ˈreɡjʊleɪt/',       meaning:'监管；调节',         freq:'high',   band:'6-7' },
    { word:'perceive',       phonetic:'/pəˈsiːv/',           meaning:'感知；认为',         freq:'high',   band:'6-8' },
    { word:'inequality',     phonetic:'/ˌɪnɪˈkwɒlɪti/',    meaning:'不平等；差距',       freq:'high',   band:'6-8' },
    { word:'consumption',    phonetic:'/kənˈsʌmpʃən/',      meaning:'消费；消耗',         freq:'high',   band:'6-7' },
    { word:'urban',          phonetic:'/ˈɜːbən/',            meaning:'城市的',             freq:'high',   band:'5-7' },
    { word:'innovation',     phonetic:'/ˌɪnəˈveɪʃən/',     meaning:'创新；革新',         freq:'high',   band:'6-8' },
  ],
  academic: [
    { word:'proliferate',  phonetic:'/prəˈlɪfəreɪt/',  meaning:'激增；扩散',         freq:'medium', band:'7-9' },
    { word:'exacerbate',   phonetic:'/ɪɡˈzæsəbeɪt/',  meaning:'加剧；使恶化',       freq:'medium', band:'7-9' },
    { word:'mitigate',     phonetic:'/ˈmɪtɪɡeɪt/',    meaning:'减轻；缓解',         freq:'medium', band:'7-9' },
    { word:'profound',     phonetic:'/prəˈfaʊnd/',     meaning:'深刻的；重大的',     freq:'medium', band:'7-9' },
    { word:'undermine',    phonetic:'/ˌʌndəˈmaɪn/',   meaning:'削弱；动摇',         freq:'medium', band:'7-9' },
    { word:'paramount',    phonetic:'/ˈpærəmaʊnt/',   meaning:'最重要的；首要的',   freq:'medium', band:'7-9' },
    { word:'contentious',  phonetic:'/kənˈtenʃəs/',   meaning:'有争议的',           freq:'medium', band:'7-9' },
    { word:'inevitable',   phonetic:'/ɪnˈevɪtəbl/',   meaning:'不可避免的',         freq:'medium', band:'7-8' },
    { word:'perpetuate',   phonetic:'/pəˈpetʃueɪt/',  meaning:'使永久；延续',       freq:'medium', band:'7-9' },
    { word:'disparity',    phonetic:'/dɪˈspærɪti/',   meaning:'差距；悬殊',         freq:'medium', band:'7-9' },
    { word:'alleviate',    phonetic:'/əˈliːvieɪt/',   meaning:'减轻；缓和',         freq:'medium', band:'7-8' },
    { word:'facilitate',   phonetic:'/fəˈsɪlɪteɪt/',  meaning:'促进；便利化',       freq:'medium', band:'7-8' },
    { word:'scrutinise',   phonetic:'/ˈskruːtɪnaɪz/',meaning:'仔细审查',           freq:'medium', band:'7-9' },
    { word:'empirical',    phonetic:'/ɪmˈpɪrɪkl/',    meaning:'基于实证的',         freq:'medium', band:'7-9' },
    { word:'polarise',     phonetic:'/ˈpəʊlɪraɪz/',  meaning:'使两极分化',         freq:'medium', band:'7-9' },
    { word:'pragmatic',    phonetic:'/præɡˈmætɪk/',   meaning:'务实的',             freq:'medium', band:'7-9' },
    { word:'culminate',    phonetic:'/ˈkʌlmɪneɪt/',  meaning:'以…告终',           freq:'medium', band:'7-9' },
    { word:'cohesive',     phonetic:'/kəʊˈhiːsɪv/',  meaning:'有凝聚力的',         freq:'medium', band:'7-9' },
    { word:'deteriorate',  phonetic:'/dɪˈtɪərɪəreɪt/',meaning:'恶化；变质',        freq:'medium', band:'7-8' },
    { word:'ambiguous',    phonetic:'/æmˈbɪɡjuəs/',  meaning:'模棱两可的',         freq:'medium', band:'7-9' },
  ],
}

// ── OpenAI prompt（生成词卡全部内容）─────────────────────────────────────
function buildPrompt(word, meaning) {
  return `
You are an expert IELTS writing tutor. For the English word "${word}" (Chinese: ${meaning}), generate:

1. Three near-synonyms with a concise usage-difference note (one sentence each, max 15 words)
2. One high-quality IELTS writing example sentence (band 7+, formal academic style, 15–25 words)

Respond ONLY in this exact JSON format. No markdown, no extra text:
{
  "synonyms": [
    { "word": "synonym1", "difference": "one-sentence usage note" },
    { "word": "synonym2", "difference": "one-sentence usage note" },
    { "word": "synonym3", "difference": "one-sentence usage note" }
  ],
  "example": "One formal IELTS example sentence here."
}
`.trim()
}

// ── 速率限制：每秒最多 3 个请求（OpenAI 免费层限制）────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function generateWordCard(openai, wordEntry) {
  const prompt = buildPrompt(wordEntry.word, wordEntry.meaning)
  const res = await openai.chat.completions.create({
    model:       'gpt-4o-mini',
    messages:    [{ role: 'user', content: prompt }],
    max_tokens:  400,
    temperature: 0.5,   // 低温度 = 更稳定、更准确
  })

  const raw  = res.choices[0].message.content.trim()
  const data = JSON.parse(raw)

  return {
    synonyms: data.synonyms.map(s => s.word),        // 基础同义词列表
    example:  data.example,                           // 精选例句
    // AI 扩展字段同步写入，免得之后还要再调一次
    ai_synonyms:   data.synonyms,                     // 带用法区别的完整版本
    ai_sentences:  [data.example],                    // 扩展例句（种子阶段先存1句）
    ai_generated:  true,
  }
}

// ── 主逻辑 ────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🔗 Connecting to MongoDB...')
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected\n')

  const openai     = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  let created = 0
  let skipped = 0
  let failed  = 0

  for (const [bookId, words] of Object.entries(WORD_LIST)) {
    console.log(`\n📚 Book: ${bookId} (${words.length} words)`)
    console.log('─'.repeat(50))

    for (let i = 0; i < words.length; i++) {
      const entry = words[i]

      // 幂等检查：已存在则跳过
      const exists = await Word.findOne({ bookId, word: entry.word })
      if (exists) {
        console.log(`  ⏭  [${i+1}/${words.length}] ${entry.word} — already exists, skipping`)
        skipped++
        continue
      }

      try {
        process.stdout.write(`  ⏳ [${i+1}/${words.length}] ${entry.word} ... `)
        const aiData = await generateWordCard(openai, entry)

        await Word.create({ bookId, ...entry, ...aiData })
        console.log(`✓  (syns: ${aiData.synonyms.join(', ')})`)
        created++

        // 速率限制：每个词之间等 350ms（约每秒 2.8 个请求）
        await sleep(350)

      } catch (err) {
        console.log(`✗  ERROR: ${err.message}`)
        failed++
        // 失败后等 2 秒再继续（可能是速率限制）
        await sleep(2000)
      }
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`✅ Done!  Created: ${created}  Skipped: ${skipped}  Failed: ${failed}`)
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
