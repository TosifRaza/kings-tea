require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const MediaAsset = require('../models/MediaAssetModel');
const SiteContent = require('../models/SiteContentModel');

const apply = process.argv.includes('--apply');
if (process.env.NODE_ENV === 'production' && (!apply || process.env.CONFIRM_MEDIA_MIGRATION !== 'true')) {
  console.error('Production safety: back up the database, pass --apply, and set CONFIRM_MEDIA_MIGRATION=true.');
  process.exit(1);
}

const classify = (url) => {
  if (/^https:\/\/res\.cloudinary\.com\//i.test(url)) {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const folderIndex = parts.indexOf('kings-tea', uploadIndex + 1);
    const tail = folderIndex >= 0 ? parts.slice(folderIndex) : parts.slice(uploadIndex + 1).filter((part) => !/^v\d+$/.test(part) && !/^(?:f|q|w|h|c|g|ar|dpr)_[a-z0-9.,_-]+$/i.test(part));
    const publicId = tail.join('/').replace(/\.[a-z0-9]+(?:\?.*)?$/i, '');
    return { provider: 'cloudinary', publicId, sourceProvider: 'Existing Cloudinary upload' };
  }
  const publicId = `static:${url}`;
  return { provider: 'static', publicId, sourceProvider: 'Existing project asset' };
};

async function main() {
  if (!apply) console.log('Dry run only. Pass --apply to create media metadata records.');
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, { dbName: process.env.MONGODB_DATABASE || 'kings-tea' });
  let candidateCount = 0;
  const seen = new Map();
  const products = await Product.find().select('_id name images').lean();
  const categories = await Category.find().select('_id name image').lean();
  const contentDocuments = await SiteContent.find().select('key content').lean();
  for (const product of products) for (const url of product.images || []) {
    if (!url || typeof url !== 'string') continue;
    const current = seen.get(url) || { url, productIds: [], categoryIds: [], altText: `${product.name} tea product image`, usage: 'product' };
    current.productIds.push(product._id);
    seen.set(url, current);
  }
  for (const category of categories) if (category.image && typeof category.image === 'string') {
    const current = seen.get(category.image) || { url: category.image, productIds: [], categoryIds: [], altText: `${category.name} tea category`, usage: 'category' };
    current.categoryIds.push(category._id);
    if (current.usage !== 'product') current.usage = 'category';
    seen.set(category.image, current);
  }
  for (const document of contentDocuments) {
    const urls = new Set();
    const visit = (value) => {
      if (typeof value === 'string' && /^https:\/\/res\.cloudinary\.com\//i.test(value)) urls.add(value);
      else if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') Object.values(value).forEach(visit);
    };
    visit(document.content);
    for (const url of urls) {
      const current = seen.get(url) || { url, productIds: [], categoryIds: [], contentKeys: [], altText: '', usage: 'content' };
      current.contentKeys.push(document.key);
      if (current.usage === 'other') current.usage = 'content';
      seen.set(url, current);
    }
  }
  candidateCount = seen.size;
  console.log(`Found ${products.length} products, ${categories.length} categories, ${candidateCount} unique referenced image URLs.`);
  if (apply) {
    for (const record of seen.values()) {
      const info = classify(record.url);
      const { productIds, categoryIds, contentKeys, ...metadata } = record;
      await MediaAsset.findOneAndUpdate({ publicId: info.publicId }, {
        $setOnInsert: { ...metadata, ...info, mimeType: 'application/octet-stream', bytes: 0, width: 0, height: 0, licenseReference: 'Verify against Frontend/public/images attribution records' },
        $addToSet: { productIds: { $each: productIds }, categoryIds: { $each: categoryIds }, contentKeys: { $each: contentKeys || [] } },
      }, { upsert: true, setDefaultsOnInsert: true });
    }
    console.log(`Created or associated ${candidateCount} media metadata records.`);
  }
}

main().catch((error) => { console.error('Media metadata migration failed:', error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
