require('dotenv').config();
const mongoose = require('mongoose');

const resetAdmin = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Import User model
    const User = require('./src/models/UserModel');

    // Delete all admin users
    const deleteResult = await User.deleteMany({ role: { $in: ['super_admin', 'admin'] } });
    console.log('Deleted admins:', deleteResult.deletedCount);

    // Create fresh admin - Mongoose pre-save hook will hash the password
    const admin = await User.create({
      email: 'razatosif@gmail.com',
      name: 'Super Admin',
      password: 'raza123',
      role: 'super_admin',
      emailVerified: true
    });
    console.log('Admin created:', admin.email, admin.role);

    // Verify password works
    const verifyUser = await User.findOne({ email: 'razatosif@gmail.com' }).select('+password');
    const isMatch = await verifyUser.comparePassword('raza123');
    console.log('Password verification:', isMatch ? 'SUCCESS - Password matches!' : 'FAILED - Password does not match');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();