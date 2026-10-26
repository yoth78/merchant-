import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { seedInitialData } from './database/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// Initialize seed data on start
seedInitialData();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Marketplace API
app.use('/api', apiRouter);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Marketplace API] Server running on http://localhost:${PORT}`);
});
