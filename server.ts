import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import pino from 'pino';

// Initialize structured logger
export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

// Create Express application
export const app = express();

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Vite Dev Server compatibility
}));
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Standardized API Response Formatter
export const successResponse = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

export const errorResponse = (res: Response, error: string, statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error,
  });
};

// Global Request Logger Middleware
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    logger.info(`[${req.method}] ${req.originalUrl}`);
  }
  next();
});

// Import API routes (to be built)
import apiRoutes from './src/server/routes/api.js';

// API Prefix
app.use('/api/v1', apiRoutes);

// Health check endpoint (SLA Monitoring & Kubernetes readiness)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  errorResponse(res, err.message || 'Internal Server Error', 500);
});

// Vite Middleware & Static Generation 
// Note: We mount Vite middleware after API routes so Vite handles standard assets
async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve static files from dist
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const distPath = path.join(__dirname, 'dist');
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    logger.info(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
