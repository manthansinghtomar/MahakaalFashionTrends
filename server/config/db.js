import mongoose from 'mongoose';

/**
 * Reusable database connection function placeholder.
 * MongoDB Atlas connection logic is ready to be active once configuration is completed.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB connection URI (MONGODB_URI) is missing in the environment variables.');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log('======================================');
    console.log('Database Connected Successfully');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log('======================================');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
