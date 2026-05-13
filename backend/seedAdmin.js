require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interno');
    const db = mongoose.connection.db;
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.collection('users').updateOne(
      { email: 'admin@interno.com' },
      { 
        $set: {
          email: 'admin@interno.com',
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          username: 'Super Admin'
        }
      },
      { upsert: true }
    );
    console.log('Admin user seeded successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
