import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import User from './models/User.js';
import Song from './models/Song.js';
import { errorHandler } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
  allowedOrigins: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

}));
app.use(express.json());  // Parse JSON payloads

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
