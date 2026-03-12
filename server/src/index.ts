import { createApp } from './app'
import dotenv from 'dotenv'

dotenv.config()

const app = createApp()
const PORT = process.env.PORT || 3001

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes placeholder
app.get('/api', (_req, res) => {
  res.json({ message: 'Timekeeping API' })
})

// Error handling middleware
app.use((err: Error, _req: import('express').Request, res: import('express').Response, _next: import('express').NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
