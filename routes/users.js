// Run in a Node script or MongoDB shell
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('your_mongodb_uri');

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10); // Password: admin123
  const user = new User({ username: 'admin', password: hashedPassword });
  await user.save();
  console.log('Admin user created');
};

createAdmin().then(() => mongoose.disconnect());