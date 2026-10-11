const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const MediaAsset = require('../models/MediaAssetModel');
const SiteContent = require('../models/SiteContentModel');
const products = require('../data/catalogBatch50');

const assetDir = path.resolve(__dirname, '../../../Frontend/public/images/tea-products');
const attribution = {
  'black-tea.jpg': { creator: 'André Helbig', provider: 'Wikimedia Commons', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Assam-Tee_SFTGFOP1.jpg' },
  'black-tea-2.jpg': { creator: '荼兰 DSGC', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/elegant-display-of-black-tea-with-tea-cup-31959376/' },
  'black-tea-3.jpg': { creator: 'Marek Ruczaj', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/close-up-of-loose-black-tea-leaves-on-spoon-35797059/' },
  'black-tea-4.jpg': { creator: 'Merve Şahin', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/close-up-shot-of-black-tea-in-a-cup-10936204/' },
  'green-tea.jpg': { creator: 'Rashid', provider: 'Unsplash', license: 'Unsplash License', url: 'https://unsplash.com/photos/green-leaves-with-water-droplets-New8EgKnSds' },
  'green-tea-2.jpg': { creator: 'ric perin', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/green-tea-with-dry-brew-and-teapot-4390022/' },
  'green-tea-3.jpg': { creator: 'Karen Laårk Boshoff', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/cup-of-green-tea-with-mint-7565502/' },
  'green-tea-4.jpg': { creator: 'Filmy Kashif', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/steaming-green-tea-in-glass-cup-with-bokeh-36028821/' },
  'matcha.jpg': { creator: 'Andrea Lacasse', provider: 'Unsplash', license: 'Unsplash License', url: 'https://unsplash.com/photos/a-bowl-of-green-liquid-next-to-a-whisk-Jge6KRP6t94' },
  'matcha-2.jpg': { creator: 'Cup of Couple', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/matcha-powder-in-a-bowl-8474099/' },
  'matcha-3.jpg': { creator: 'Roselène de Koning', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/matcha-tea-powder-with-bamboo-whisk-on-marble-surface-30221574/' },
  'matcha-4.jpg': { creator: 'Darina Belonogova', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/top-view-photo-of-matcha-powder-on-clear-glass-8004538/' },
  'oolong-tea.jpg': { creator: 'Suguri F', provider: 'Wikimedia Commons', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Oolong_tea_leaf.jpg' },
  'oolong-tea-2.jpg': { creator: 'Jose Stauffenberg', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/top-view-of-oolong-tea-6351839/' },
  'oolong-tea-3.jpg': { creator: 'Jose Stauffenberg', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/oolong-tea-in-a-teapot-6351882/' },
  'oolong-tea-4.jpg': { creator: 'Thanh Truc Ho', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/artistic-flat-lay-of-teapot-and-loose-tea-leaves-33118330/' },
  'pu-erh-tea.png': { creator: 'OGBerserk', provider: 'Wikimedia Commons', license: 'CC0 1.0', url: 'https://commons.wikimedia.org/wiki/File:Pu-Erh_Tea.png' },
  'pu-erh-tea-2.jpg': { creator: 'Andy Lee', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/traditional-chinese-pu-erh-tea-cake-display-32087738/' },
  'pu-erh-tea-3.jpg': { creator: 'Andy Lee', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/authentic-chinese-pu-erh-tea-cake-on-display-32087716/' },
  'pu-erh-tea-4.jpg': { creator: 'Andy Lee', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/elegant-display-of-pu-erh-tea-cake-and-glass-cup-32087719/' },
  'white-tea.jpg': { creator: 'LDFrancis', provider: 'Wikimedia Commons', license: 'Public domain, released by author', url: 'https://commons.wikimedia.org/wiki/File:Bai_Hao_Yinzhen_or_Silver_needle_White_Tea.JPG' },
  'white-tea-2.jpg': { creator: 'Katerina Makhtadui', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/minimalist-tea-setup-with-white-tea-leaves-37935178/' },
  'white-tea-3.jpg': { creator: 'Tima Miroshnichenko', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/tea-in-cha-he-on-tea-ceremony-6545351/' },
  'white-tea-4.jpg': { creator: '征宇 郑', provider: 'Pexels', license: 'Pexels License', url: 'https://www.pexels.com/photo/collection-of-tea-leaves-in-wooden-compartments-28890196/' },
};

const getAssetMetadata = (product, imagePath) => {
  const relative = imagePath.replace(/^\/images\//, '');
  const filename = path.basename(imagePath);
  const isPacket = relative.startsWith('tea-products/kingstea-packets/');
  const actualPath = isPacket ? path.join(assetDir, 'kingstea-packets', filename) : path.join(assetDir, filename);
  const stat = fs.statSync(actualPath);
  const photo = attribution[filename];
  const altText = isPacket
    ? `King's Tea premium packet illustration for ${product.name}, 100g`
    : `${product.category} tea product photography by ${photo?.creator || 'King’s Tea'}`;
  return {
    publicId: `catalog-batch-50/${product.slug}/${filename}`,
    url: imagePath,
    provider: 'static',
    sourceUrl: photo?.url || '',
    sourceProvider: isPacket ? "King's Tea original vector artwork" : (photo?.provider || 'Unknown'),
    licenseReference: photo?.license || 'King’s Tea original vector artwork',
    attribution: photo ? `Photo by ${photo.creator}` : "Original King's Tea vector packet illustration",
    altText,
    width: isPacket ? 900 : 0,
    height: isPacket ? 1100 : 0,
    mimeType: filename.endsWith('.svg') ? 'image/svg+xml' : (filename.endsWith('.png') ? 'image/png' : 'image/jpeg'),
    bytes: stat.size,
    format: path.extname(filename).slice(1),
    usage: 'product',
  };
};

async function seedCatalog({ confirmed = process.env.CONFIRM_CATALOG_BATCH_50 === 'true', connected = false } = {}) {
  if (!confirmed && process.env.NODE_ENV !== 'production') {
    throw new Error('Set CONFIRM_CATALOG_BATCH_50=true to run this additive catalog import.');
  }
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('Set MONGODB_URI or MONGO_URI in Backend/.env.');
  if (products.length !== 50 || new Set(products.map((product) => product.slug)).size !== 50) {
    throw new Error('Catalog fixture must contain exactly 50 unique product slugs.');
  }

  for (const product of products) {
    if (product.images.length !== 5) throw new Error(`${product.slug} must have exactly five gallery images.`);
    for (const image of product.images) {
      const metadata = getAssetMetadata(product, image);
      if (!fs.existsSync(path.join(assetDir, path.basename(image)))) {
        const artwork = path.join(assetDir, 'kingstea-packets', path.basename(image));
        if (!fs.existsSync(artwork)) throw new Error(`Missing local product asset: ${image}`);
      }
      if (!metadata.bytes) throw new Error(`Product image is empty: ${image}`);
    }
  }

  if (!connected) await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DATABASE || 'kings-tea' });
  try {
    const markerKey = 'catalog-batch-50-v1';
    if (await SiteContent.exists({ key: markerKey })) {
      const existing = await Product.find({ slug: { $in: products.map((product) => product.slug) } }).select('_id slug').lean();
      const productBySlug = new Map(existing.map((product) => [product.slug, product]));
      const galleryUpdates = products.filter((product) => productBySlug.has(product.slug)).map((product) => ({
        updateOne: { filter: { slug: product.slug }, update: { $set: { images: product.images, newArrival: true } } },
      }));
      await Product.bulkWrite(galleryUpdates, { ordered: true });
      const assets = [];
      for (const product of products) {
        const savedProduct = productBySlug.get(product.slug);
        if (!savedProduct) continue;
        for (const image of product.images) {
          const metadata = getAssetMetadata(product, image);
          assets.push({ updateOne: { filter: { publicId: metadata.publicId }, update: { $set: { ...metadata, productIds: [savedProduct._id] } }, upsert: true } });
        }
      }
      if (assets.length) await MediaAsset.bulkWrite(assets, { ordered: false });
      console.log('Catalog batch 50 exists; restored photo-first galleries and New Arrival labels.');
      return;
    }

    const categoryNames = [...new Set(products.map((product) => product.category))];
    const categories = await Category.find({ name: { $in: categoryNames }, isActive: { $ne: false } });
    const categoryByName = new Map(categories.map((category) => [category.name, category]));
    const missing = categoryNames.filter((name) => !categoryByName.has(name));
    if (missing.length) throw new Error(`Create or activate these categories in admin first: ${missing.join(', ')}`);

    let inserted = 0;
    let alreadyPresent = 0;
    const newProductIds = new Map();
    for (const item of products) {
      const category = categoryByName.get(item.category);
      const result = await Product.updateOne(
        { slug: item.slug },
        { $setOnInsert: {
          ...item,
          categoryId: category._id,
          stockQuantity: 0,
          inStock: false,
          featured: false,
          bestSeller: false,
          newArrival: true,
          rating: 0,
          reviewCount: 0,
          isActive: true,
        } },
        { upsert: true, runValidators: true },
      );
      if (result.upsertedCount) inserted += 1;
      else alreadyPresent += 1;
      const saved = await Product.findOne({ slug: item.slug }).select('_id');
      newProductIds.set(item.slug, saved._id);
    }

    const operations = [];
    for (const product of products) {
      const productId = newProductIds.get(product.slug);
      for (const image of product.images) {
        const asset = getAssetMetadata(product, image);
        operations.push({
          updateOne: {
            filter: { publicId: asset.publicId },
            update: { $set: { ...asset, productIds: [productId] } },
            upsert: true,
          },
        });
      }
    }
    await MediaAsset.bulkWrite(operations, { ordered: false });
    await SiteContent.updateOne(
      { key: markerKey },
      { $setOnInsert: { key: markerKey, content: { importedProducts: 50, completedAt: new Date().toISOString() }, published: false } },
      { upsert: true },
    );
    console.log(`Catalog import finished: ${inserted} products added, ${alreadyPresent} already existed, 250 image metadata records ensured.`);
    console.log('All new products have zero stock and no customer rating/reviews. Update inventory in admin after confirming the physical products.');
  } finally {
    if (!connected) await mongoose.disconnect();
  }
}

if (require.main === module) {
  seedCatalog().catch((error) => {
    console.error('Catalog import failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = seedCatalog;
