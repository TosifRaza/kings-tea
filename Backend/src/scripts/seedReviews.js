const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const { curatedReviewSeedData, buildDemoReviews } = require('../data/reviewSeedData');

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
  const isLocalDemoSeed = isLocalDatabase
    && process.env.NODE_ENV === 'development'
    && process.env.ENABLE_DEMO_REVIEW_SEED === 'true';
  const isConfirmedProductionDemoSeed = !isLocalDatabase
    && process.env.NODE_ENV === 'production'
    && process.env.ALLOW_PRODUCTION_DEMO_REVIEW_SEED === 'true'
    && process.argv.includes('--confirm-production-demo-seed');
  if (!isLocalDemoSeed && !isConfirmedProductionDemoSeed) {
    throw new Error('Use the local development opt-in, or explicitly confirm a production demo seed with ALLOW_PRODUCTION_DEMO_REVIEW_SEED=true and --confirm-production-demo-seed.');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DATABASE || 'kings-tea',
  });

  let createdOrUpdated = 0;
  let skippedProductsWithRealReviews = 0;
  let productsToSeed = 0;
  let reviewsToSeed = 0;
  const isDryRun = process.argv.includes('--dry-run');
  const curatedBySlug = new Map(curatedReviewSeedData.map((entry) => [entry.productSlug, entry.reviews]));
  const products = await Product.find({ isActive: { $ne: false } }).select('_id slug name category').sort({ slug: 1 });

  for (const product of products) {
    const realReviewCount = await Review.countDocuments({ productId: product._id, approved: true, isSeeded: { $ne: true } });
    if (realReviewCount > 0) {
      skippedProductsWithRealReviews += 1;
      continue;
    }

    productsToSeed += 1;
    const sampleReviews = curatedBySlug.get(product.slug) || buildDemoReviews(product);
    reviewsToSeed += sampleReviews.length;
    if (isDryRun) continue;

    for (const sample of sampleReviews) {
      const userId = getSeedUserId(product.slug, sample.reviewerName);
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
  }

  if (isDryRun) {
    console.log(`Dry run: ${reviewsToSeed} demo reviews would be added across ${productsToSeed} products; ${skippedProductsWithRealReviews} products with approved customer reviews would be skipped.`);
  } else {
    console.log(`Seeded or refreshed ${createdOrUpdated} demo reviews across ${productsToSeed} products.`);
    if (skippedProductsWithRealReviews) console.log(`Skipped ${skippedProductsWithRealReviews} products that already have approved customer reviews.`);
  }
};

seedReviews()
  .catch((error) => {
    console.error('Review seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
