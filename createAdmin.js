require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) {
      console.log('Admin user already exists:', existingUser.username);
      return;
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({ username: 'admin', password: hashedPassword, role: 'admin' });
    await user.save();
    console.log('Admin user created: username=admin, password=admin123');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();