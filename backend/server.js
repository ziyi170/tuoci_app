/**
 * server.js — Express app entry point
 *
 * Connects to MongoDB, registers routes, starts the server.
 */
require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const mongoose  = require('mongoose')

const authRoutes     = require('./routes/auth')
const wordsRoutes    = require('./routes/words')
const progressRoutes = require('./routes/progress')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }))
app.use(express.json())

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/words',    wordsRoutes)
app.use('/api/progress', progressRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }))

// ── Database connection ─────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
