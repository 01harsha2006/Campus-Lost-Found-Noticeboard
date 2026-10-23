import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Campus Lost & Found API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes prefix: /api/items
app.use('/api/items', itemRoutes);

// Catch-all 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Centralized error-handling middleware
app.use(errorHandler);

// Connect to Database and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Campus Lost & Found backend listening on port ${PORT}`);
    console.log(`[Server] API endpoints available under http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;
