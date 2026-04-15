import dotenv from 'dotenv';
import connectDB, { sequelize } from './config/db';
import app from './app';

// Load env before using
dotenv.config();

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Sync database tables
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', (error as Error).message);
    process.exit(1);
  }
};

startServer();
