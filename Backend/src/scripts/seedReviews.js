const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const reviewSeedData = require('../data/reviewSeedData');

const getSeedUserId = (productSlug, reviewerName) => {
  const hexId = crypto
    .createHash('sha256')
    .update(`kings-tea-demo-review:${productSlug}:${reviewerName}`)
    .digest('hex')
    .slice(0, 24);
  return new mongoose.Types.ObjectId(hexId);
};

const seedReviews = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('Set MONGODB_URI or MONGO_URI in Backend/.env before seeding reviews.');
  const uriMatch = mongoUri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/i);
  if (!uriMatch) throw new Error('MONGODB_URI or MONGO_URI is not a valid MongoDB connection string.');
  const databaseHosts = uriMatch[1].split(',').map((entry) => entry.replace(/:\d+$/, '').replace(/^\[|\]$/g, '').toLowerCase());
  const isLocalDatabase = databaseHosts.every((host) => ['localhost', '127.0.0.1', '::1'].includes(host));
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_DEMO_REVIEW_SEED !== 'true' || !isLocalDatabase) {
    throw new Error('Sample reviews are limited to an explicitly enabled local development database.');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DATABASE || 'kings-tea',
  });

  let createdOrUpdated = 0;
  let missingProducts = 0;
  const aggregateRows = [];

  for (const productSeed of reviewSeedData) {
    const product = await Product.findOne({ slug: productSeed.productSlug }).select('_id slug');
    if (!product) {
      missingProducts += 1;
      console.warn(`Skipping ${productSeed.productSlug}: product not found.`);
      continue;
    }

    for (const sample of productSeed.reviews) {
      const userId = getSeedUserId(productSeed.productSlug, sample.reviewerName);
      const createdAt = new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000);
      await Review.findOneAndUpdate(
        { userId, productId: product._id },
        {
          $set: {
            reviewerName: sample.reviewerName,
            rating: sample.rating,
            title: sample.title,
            comment: sample.comment,
            verified: false,
            approved: true,
            isSeeded: true,
            createdAt,
          },
          $setOnInsert: { userId, productId: product._id },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      );
      createdOrUpdated += 1;
    }

    const [stats] = await Review.aggregate([
      { $match: { productId: product._id, approved: true } },
      { $group: { _id: '$productId', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats) {
      await Product.updateOne(
        { _id: product._id },
        { $set: { rating: Math.round(stats.average * 10) / 10, reviewCount: stats.count } },
      );
      aggregateRows.push({ name: product.slug, reviewCount: stats.count });
    }
  }

  console.log(`Seeded ${createdOrUpdated} sample reviews across ${aggregateRows.length} products.`);
  if (missingProducts) console.log(`${missingProducts} product groups were skipped because those products are not in the database.`);
  console.table(aggregateRows);
};

seedReviews()
  .catch((error) => {
    console.error('Review seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
