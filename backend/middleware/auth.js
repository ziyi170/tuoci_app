/**
 * auth.js middleware — protects routes that require login
 *
 * Usage: router.get('/protected', authMiddleware, handler)
 *
 * Reads the Authorization header: "Bearer <token>"
 * Verifies the JWT and attaches req.userId for downstream handlers.
 */
const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
