/**
 * useProgress.js — Custom React hook
 *
 * Manages the user's entire learning state:
 *   - Which book is selected
 *   - Progress for every word (correct/wrong/status/next_review)
 *   - Persists to localStorage automatically
 *
 * Think of this as a mini "database" in the browser.
 * In Phase 3, we'll replace localStorage with real API calls.
 */

import { useState, useCallback, useEffect } from 'react'
import { freshProgress, applyAnswer } from '../utils/srs'

const STORAGE_KEY_BOOK     = 'tunci_book'
const STORAGE_KEY_PROGRESS = 'tunci_progress'

export function useProgress(words) {
  // ── State ──────────────────────────────────────────
  const [bookId, setBookId] = useState(
    () => localStorage.getItem(STORAGE_KEY_BOOK) || null
  )
  const [progressMap, setProgressMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // ── Auto-save to localStorage whenever progressMap changes ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressMap))
  }, [progressMap])

  useEffect(() => {
    if (bookId) localStorage.setItem(STORAGE_KEY_BOOK, bookId)
  }, [bookId])

  // ── Select a book: initialise progress for any new words ──
  const selectBook = useCallback((id, wordList) => {
    setBookId(id)
    setProgressMap(prev => {
      const next = { ...prev }
      wordList.forEach(w => {
        if (!next[w.word]) next[w.word] = freshProgress()
      })
      return next
    })
  }, [])

  // ── Record an answer (correct or wrong) ──
  const recordAnswer = useCallback((word, correct) => {
    setProgressMap(prev => ({
      ...prev,
      [word]: applyAnswer(prev[word] ?? freshProgress(), correct),
    }))
  }, [])

  // ── Reset everything ──
  const reset = useCallback(() => {
    setBookId(null)
    setProgressMap({})
    localStorage.removeItem(STORAGE_KEY_BOOK)
    localStorage.removeItem(STORAGE_KEY_PROGRESS)
  }, [])

  return { bookId, progressMap, selectBook, recordAnswer, reset }
}
