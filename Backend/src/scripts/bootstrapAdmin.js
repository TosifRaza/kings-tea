const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/UserModel');

const bootstrapAdmin = async () => {
  const { MONGODB_URI, MONGO_URI, MONGODB_DATABASE, BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD } = process.env;
  const mongoUri = MONGODB_URI || MONGO_URI;

  if (!mongoUri || !BOOTSTRAP_ADMIN_NAME || !BOOTSTRAP_ADMIN_EMAIL || !BOOTSTRAP_ADMIN_PASSWORD) {
    throw new Error('Set the database URI and BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD in Backend/.env.');
  }
  if (BOOTSTRAP_ADMIN_PASSWORD.length < 12) {
    throw new Error('The bootstrap administrator password must be at least 12 characters.');
  }

  await mongoose.connect(mongoUri, { dbName: MONGODB_DATABASE || 'kings-tea' });
  const existingSuperAdmin = await User.exists({ role: 'super_admin' });
  if (existingSuperAdmin) {
    throw new Error('A super administrator already exists; bootstrap is one-time and made no changes.');
  }

  await User.create({
    name: BOOTSTRAP_ADMIN_NAME.trim(),
    email: BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase(),
    password: BOOTSTRAP_ADMIN_PASSWORD,
    role: 'super_admin',
  });
  console.log('Initial super administrator created. Remove the bootstrap credentials from the environment after setup.');
};

bootstrapAdmin()
  .catch((error) => {
    console.error(error.message || 'Administrator bootstrap failed.');
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
