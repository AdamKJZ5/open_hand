import express, { Application, Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import oppRoutes from './routes/appRoutes';
import leadRoutes from './routes/leadRoutes'; // Imported
import residentApplicationRoutes from './routes/residentApplicationRoutes';
import opportunityApplicationRoutes from './routes/opportunityApplicationRoutes';
import userRoutes from './routes/userRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import jobRoutes from './routes/jobRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app: Application = express();

// --- Middleware ---
// Allow frontend from localhost and network IP for mobile access
const allowedOrigins = [
  'http://localhost:5173',
  'http://10.0.0.236:5173' // Your Mac's IP for iPhone access
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

connectDB();

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', oppRoutes);
app.use('/api/leads', leadRoutes); // Correctly mounted
app.use('/api/resident-applications', residentApplicationRoutes);
app.use('/api/opportunity-applications', opportunityApplicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/jobs', jobRoutes);

// Health Check for Deployment
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- Server Start ---
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Listen on all network interfaces (0.0.0.0) to allow iPhone access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://10.0.0.236:${PORT}`);
  console.log(`Frontend URL for iPhone: http://10.0.0.236:5173`);
});
