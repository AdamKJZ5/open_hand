import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import security middleware
import {
  helmetConfig,
  generalLimiter,
  mongoSanitizeConfig,
  hppConfig,
  compressionConfig,
} from './config/security';
import logger, { logInfo, logError, logWarn } from './config/logger';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import oppRoutes from './routes/appRoutes';
import leadRoutes from './routes/leadRoutes';
import residentApplicationRoutes from './routes/residentApplicationRoutes';
import opportunityApplicationRoutes from './routes/opportunityApplicationRoutes';
import userRoutes from './routes/userRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import jobRoutes from './routes/jobRoutes';
import messageRoutes from './routes/messageRoutes';
import scheduleRoutes from './routes/scheduleRoutes';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logError(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`, new Error('Missing environment variables'));
  process.exit(1);
}

// Warn about weak JWT secret
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  logWarn('WARNING: JWT_SECRET should be at least 32 characters for security');
}

const app: Application = express();

// --- Trust proxy (for rate limiting behind reverse proxies) ---
app.set('trust proxy', 1);

// --- Security Middleware (apply BEFORE routes) ---

// Helmet - Security headers
app.use(helmetConfig);

// Compression
app.use(compressionConfig);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// MongoDB query sanitization (prevent NoSQL injection)
app.use(mongoSanitizeConfig);

// HTTP Parameter Pollution protection
app.use(hppConfig);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logWarn('CORS blocked request from origin', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logInfo('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI!;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10, // Connection pool
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logInfo('MongoDB Connected', { host: conn.connection.host });
  } catch (error) {
    logError('MongoDB Connection Failed', error as Error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  logError('MongoDB connection error', err);
});

mongoose.connection.on('disconnected', () => {
  logWarn('MongoDB disconnected');
});

connectDB();

// --- Apply general rate limiting to all routes ---
app.use('/api/', generalLimiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/resident-applications', residentApplicationRoutes);
app.use('/api/opportunity-applications', opportunityApplicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedules', scheduleRoutes);

// --- Health Check ---
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    // Simple MongoDB ping
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
    }

    const health = {
      status: dbState === 1 ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        responseTime: dbState === 1 ? 'OK' : 'ERROR',
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
      },
    };

    const statusCode = dbState === 1 ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logError('Health check failed', error as Error);
    res.status(503).json({
      status: 'DOWN',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// --- 404 Handler ---
app.use(notFoundHandler);

// --- Global Error Handler ---
app.use(globalErrorHandler);

// --- Graceful Shutdown ---
const gracefulShutdown = async (signal: string) => {
  logInfo(`${signal} received, closing server gracefully`);

  try {
    await mongoose.connection.close();
    logInfo('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logError('Error during graceful shutdown', error as Error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logError('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logError('Unhandled Rejection', new Error(reason));
  process.exit(1);
});

// --- Server Start ---
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logInfo('Server started', {
    environment: NODE_ENV,
    port: PORT,
    nodeVersion: process.version,
  });

  if (NODE_ENV === 'development') {
    logInfo(`Local: http://localhost:${PORT}`);
    logInfo(`Health Check: http://localhost:${PORT}/health`);
  }
});

// Helper function for logger (imported by logger config)
function logWarn(message: string, meta?: object) {
  logger.warn(message, meta);
}

export default app;
