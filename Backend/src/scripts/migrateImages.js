require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});


console.log("MONGODB_URI:", process.env.MONGODB_URI);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({ 'images.0': { $exists: true } });
  console.log(`Found ${products.length} products with images`);

  for (const product of products) {
    const newImages = [];

    for (const imgPath of product.images) {
      // Skip if already a Cloudinary URL
      if (imgPath.startsWith('http')) {
        newImages.push(imgPath);
        continue;
      }

      // Try to find the local file
      const localPath = path.join(__dirname, '..', imgPath);
      if (!fs.existsSync(localPath)) {
        console.log(`  ⚠️ File not found: ${localPath} — skipping`);
        newImages.push(imgPath); // keep old path as fallback
        continue;
      }

      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'kings-tea/products',
        });
        console.log(`  ✅ Uploaded: ${result.secure_url}`);
        newImages.push(result.secure_url);
      } catch (err) {
        console.error(`  ❌ Failed: ${imgPath}`, err.message);
        newImages.push(imgPath);
      }
    }

    product.images = newImages;
    await product.save();
    console.log(`Updated product: ${product.name}`);
  }

  console.log('Migration complete');
  process.exit(0);
};

run().catch(console.error);