import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import compression from 'compression'

export function createApp() {
  const app = express()

  // Security middleware
  app.use(helmet())
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }))

  // Compression middleware
  app.use(compression())

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  return app
}
