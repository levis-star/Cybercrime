import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import awarenessRoutes from './routes/awarenessRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((origin) => origin.trim());

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'cybercrime-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/awareness', awarenessRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/chatbot', chatbotRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
