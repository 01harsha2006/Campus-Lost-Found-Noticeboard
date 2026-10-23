import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_lost_found';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Atlas connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at "${mongoURI}": ${error.message}`);
    console.warn('[Database Notice] If using MongoDB Atlas, verify that:');
    console.warn('  1. Your database password replaces <db_password> in server/.env');
    console.warn('  2. Network Access in MongoDB Atlas allows IP 0.0.0.0/0 (or your current IP)');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
