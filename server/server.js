import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables config
dotenv.config();

// Establish database connection placeholder
connectDB();

// Determine Port configuration
const PORT = process.env.PORT || 5000;

// Listen on configured port
const server = app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`👉 API endpoint: http://localhost:${PORT}`);
  console.log('==================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
