import express, {Application, Request, Response, NextFunction } from 'express';
<<<<<<< Updated upstream
import dotenv from 'gotenv';
import cars from 'cors';
import mongoose from 'mogoose';
import authRoutes from './routes/authRoutes';
=======
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
>>>>>>> Stashed changes

dotenv.config();

const app: Application = express();

<<<<<<< Updated upstream
app.use('/api/auth', authRoutes);
app.use(cors());
=======
app.use(cors({
  origin: 'http://localhost:5173'
}));
>>>>>>> Stashed changes
app.use(express.json());

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch(error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

connectDB();

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: UP, message: 'Server is healthy' })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
