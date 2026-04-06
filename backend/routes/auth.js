/**
 * routes/auth.js
 *
 * POST /api/auth/register  — create account
 * POST /api/auth/login     — get JWT token
 * GET  /api/auth/me        — get current user (requires token)
 */
const router  = require('express').Router()
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')
const auth    = require('../middleware/auth')

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// ── Register ────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: '请填写邮箱和密码' })
    if (password.length < 6)  return res.status(400).json({ error: '密码至少6位' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: '该邮箱已注册' })

    const user  = await User.create({ email, password })
    const token = signToken(user._id)

    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ── Login ───────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: '请填写邮箱和密码' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: '邮箱或密码错误' })

    const ok = await user.comparePassword(password)
    if (!ok) return res.status(401).json({ error: '邮箱或密码错误' })

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ── Get current user ────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: '服务器错误' })
  }
})

module.exports = router
