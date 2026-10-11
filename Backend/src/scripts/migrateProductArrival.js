const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('Set MONGODB_URI or MONGO_URI before running this migration.');
  if (process.env.NODE_ENV === 'production' && process.env.CONFIRM_PRODUCT_ARRIVAL_MIGRATION !== 'true') {
    throw new Error('For production, set CONFIRM_PRODUCT_ARRIVAL_MIGRATION=true after taking a database backup.');
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DATABASE || 'kings-tea' });
  const products = mongoose.connection.collection('products');
  const pending = await products.countDocuments({ isNew: { $exists: true } });
  if (process.argv.includes('--apply')) {
    const result = await products.updateMany(
      { isNew: { $exists: true } },
      [
        { $set: { newArrival: { $ifNull: ['$newArrival', '$isNew'] } } },
        { $unset: 'isNew' },
      ],
    );
    console.log(`Migrated ${result.modifiedCount} products from isNew to newArrival.`);
  } else {
    console.log(`${pending} products have the legacy isNew field. Re-run with --apply to migrate.`);
  }
};

run().catch((error) => { console.error('Product arrival migration failed:', error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
