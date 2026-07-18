import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Error: MONGODB_URI environment variable is missing in server/.env');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully.');

    const email = 'admin@mahakaal.com';
    const password = 'adminpassword';

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log(`==================================================`);
      console.log(`⚠️ Admin already registered in this database:`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: [Your pre-configured password]`);
      console.log(`==================================================`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create default superadmin
    console.log('Creating default superadmin...');
    await Admin.create({
      fullName: 'Mahakaal Admin',
      email,
      password, // Hashes automatically in Admin schema pre-save hook
      role: 'superadmin',
      permissions: ['all'],
      isActive: true,
    });

    console.log(`==================================================`);
    console.log(`🚀 Administrator Seeded Successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`==================================================`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding admin account failed:', error);
    process.exit(1);
  }
};

seedAdmin();
