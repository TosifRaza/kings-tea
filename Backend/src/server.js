const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/AuthRoutes');
const productRoutes = require('./routes/ProductRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const collectionRoutes = require('./routes/CollectionRoutes');
const testimonialRoutes = require('./routes/TestimonialRoutes');
const blogRoutes = require('./routes/BlogRoutes');
const subscriptionRoutes = require('./routes/SubscriptionRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const cartRoutes = require('./routes/CartRoutes');
const wishlistRoutes = require('./routes/WishlistRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');
const contactRoutes = require('./routes/ContactRoutes');
const newsletterRoutes = require('./routes/NewsletterRoutes');
const userRoutes = require('./routes/UserRoutes');
const statsRoutes = require('./routes/StatsRoutes');

// Import models for seeding
const Category = require('./models/CategoryModel');
const Product = require('./models/ProductModel');

const TEA_CATEGORY_IMAGES = {
  'Black Tea': '/images/tea-products/black-tea.jpg',
  'Green Tea': '/images/tea-products/green-tea.jpg',
  'Oolong Tea': '/images/tea-products/oolong-tea.jpg',
  'White Tea': '/images/tea-products/white-tea.jpg',
  'Pu-erh Tea': '/images/tea-products/pu-erh-tea.png',
  Matcha: '/images/tea-products/matcha.jpg',
};

const TEA_CATEGORY_GALLERIES = {
  'Black Tea': [TEA_CATEGORY_IMAGES['Black Tea'], '/images/tea-products/black-tea-2.jpg', '/images/tea-products/black-tea-3.jpg', '/images/tea-products/black-tea-4.jpg'],
  'Green Tea': [TEA_CATEGORY_IMAGES['Green Tea'], '/images/tea-products/green-tea-2.jpg', '/images/tea-products/green-tea-3.jpg', '/images/tea-products/green-tea-4.jpg'],
  'Oolong Tea': [TEA_CATEGORY_IMAGES['Oolong Tea'], '/images/tea-products/oolong-tea-2.jpg', '/images/tea-products/oolong-tea-3.jpg', '/images/tea-products/oolong-tea-4.jpg'],
  'White Tea': [TEA_CATEGORY_IMAGES['White Tea'], '/images/tea-products/white-tea-2.jpg', '/images/tea-products/white-tea-3.jpg', '/images/tea-products/white-tea-4.jpg'],
  'Pu-erh Tea': [TEA_CATEGORY_IMAGES['Pu-erh Tea'], '/images/tea-products/pu-erh-tea-2.jpg', '/images/tea-products/pu-erh-tea-3.jpg', '/images/tea-products/pu-erh-tea-4.jpg'],
  Matcha: [TEA_CATEGORY_IMAGES.Matcha, '/images/tea-products/matcha-2.jpg', '/images/tea-products/matcha-3.jpg', '/images/tea-products/matcha-4.jpg'],
};

const app = express();

// Create uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
//   credentials: true
// }));
app.use(cors({
  origin: [
    
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    "https://kings-tea-frontend.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Seed route
app.get('/api/seed', async (req, res) => {
  try {
    // This endpoint only adds missing tea catalog records. It must never clear
    // collections because the MongoDB cluster may be shared with other apps.
    // ============ SEED CATEGORIES ============
    const categorySeeds = [
      {
        name: 'Black Tea',
        slug: 'black-tea',
        description: 'Bold, robust, and full-bodied teas with rich flavors. Our black tea collection features the finest leaves from renowned estates across India, Sri Lanka, and China.',
        image: TEA_CATEGORY_IMAGES['Black Tea'],
        featured: true,
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Green Tea',
        slug: 'green-tea',
        description: 'Fresh, delicate, and naturally vibrant. Experience the nuanced flavors of carefully steamed and pan-fired green teas from Japan and China.',
        image: TEA_CATEGORY_IMAGES['Green Tea'],
        featured: true,
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Oolong Tea',
        slug: 'oolong-tea',
        description: 'A perfect balance between black and green, offering complex flavor profiles that evolve with every sip. Crafted through traditional oxidation techniques.',
        image: TEA_CATEGORY_IMAGES['Oolong Tea'],
        featured: true,
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'White Tea',
        slug: 'white-tea',
        description: 'The most delicate and minimally processed of all teas. Silver needle and white peony varieties that offer subtle, ethereal flavors.',
        image: TEA_CATEGORY_IMAGES['White Tea'],
        featured: false,
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Pu-erh Tea',
        slug: 'pu-erh-tea',
        description: 'Aged and fermented teas from Yunnan province, offering deep, earthy flavors that improve with time. A true connoisseur\'s choice.',
        image: TEA_CATEGORY_IMAGES['Pu-erh Tea'],
        featured: false,
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Matcha',
        slug: 'matcha',
        description: 'Stone-ground ceremonial and culinary grade matcha. Vibrant green powder crafted from shade-grown tencha leaves for an immersive tea experience.',
        image: TEA_CATEGORY_IMAGES.Matcha,
        featured: true,
        sortOrder: 6,
        isActive: true
      }
    ];
    const categories = await Promise.all(categorySeeds.map((category) =>
      Category.findOneAndUpdate(
        { slug: category.slug },
        { $setOnInsert: category },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    ));

    // ============ SEED PRODUCTS ============
    const productSeeds = [
      {
        name: 'Royal Darjeeling',
        slug: 'royal-darjeeling',
        description: 'Sourced from the misty heights of Darjeeling\'s first flush, this tea embodies the champagne of teas with its delicate muscatel character and floral undertones. Each leaf is hand-picked at dawn to preserve its exquisite flavor profile.',
        shortDescription: 'First flush Darjeeling with muscatel character',
        price: 2499,
        comparePrice: 2999,
        images: TEA_CATEGORY_GALLERIES['Black Tea'],
        category: 'Black Tea',
        categoryId: categories[0]._id,
        origin: 'Darjeeling, India',
        fermentation: 'full',
        season: 'spring',
        tastingNotes: ['Muscatel', 'Floral', 'Light Astringency'],
        brewingGuide: {
          temperature: '90°C',
          steepTime: '3-4 min',
          amount: '2g per 200ml',
          instructions: 'Use freshly boiled water cooled to 90°C. Steep for 3-4 minutes. Can be re-steeped once.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 50,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.8,
        reviewCount: 124,
        gradientColor: 'from-amber-800 to-amber-600',
        isActive: true
      },
      {
        name: 'Dragon Well Longjing',
        slug: 'dragon-well-longjing',
        description: 'The legendary Dragon Well green tea from Hangzhou, pan-fired by master artisans to create its signature chestnut-like sweetness and flat, smooth leaves. A tea revered for centuries by Chinese emperors and scholars alike.',
        shortDescription: 'Pan-fired Chinese green tea with chestnut notes',
        price: 3299,
        comparePrice: 3999,
        images: TEA_CATEGORY_GALLERIES['Green Tea'],
        category: 'Green Tea',
        categoryId: categories[1]._id,
        origin: 'Hangzhou, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Chestnut', 'Sweet', 'Vegetal'],
        brewingGuide: {
          temperature: '80°C',
          steepTime: '2-3 min',
          amount: '3g per 200ml',
          instructions: 'Use water at 80°C. Steep for 2-3 minutes. Best enjoyed in a glass teapot to watch the leaves dance.'
        },
        weight: '100g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 30,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 89,
        gradientColor: 'from-emerald-700 to-emerald-500',
        isActive: true
      },
      {
        name: 'Iron Goddess Oolong',
        slug: 'iron-goddess-oolong',
        description: 'Ti Kuan Yin, the Iron Goddess of Mercy, is a legendary oolong tea from Fujian province. Its complex layers of orchid, roasted chestnut, and honey create a meditative drinking experience that unfolds with each infusion.',
        shortDescription: 'Traditional Tieguanyin with orchid aroma',
        price: 2899,
        comparePrice: 3499,
        images: TEA_CATEGORY_GALLERIES['Oolong Tea'],
        category: 'Oolong Tea',
        categoryId: categories[2]._id,
        origin: 'Fujian, China',
        fermentation: 'medium',
        season: 'autumn',
        tastingNotes: ['Orchid', 'Honey', 'Roasted Chestnut'],
        brewingGuide: {
          temperature: '95°C',
          steepTime: '3-5 min',
          amount: '5g per 200ml',
          instructions: 'Use boiling water cooled slightly. Steep for 3-5 minutes. Can be re-steeped 5-7 times.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 25,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.7,
        reviewCount: 156,
        gradientColor: 'from-amber-700 to-yellow-600',
        isActive: true
      },
      {
        name: 'Silver Needle',
        slug: 'silver-needle',
        description: 'The rarest white tea, made exclusively from young buds covered in silvery-white down. Its ethereal sweetness and delicate floral notes create a transcendent tea experience reserved for the most discerning palates.',
        shortDescription: 'Premium white tea with silver buds',
        price: 4499,
        comparePrice: 5299,
        images: TEA_CATEGORY_GALLERIES['White Tea'],
        category: 'White Tea',
        categoryId: categories[3]._id,
        origin: 'Fujian, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Honey', 'Melon', 'Floral'],
        brewingGuide: {
          temperature: '75°C',
          steepTime: '4-5 min',
          amount: '3g per 200ml',
          instructions: 'Use water at 75°C. Steep for 4-5 minutes. Handle the delicate buds with care.'
        },
        weight: '75g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 15,
        featured: true,
        bestSeller: false,
        isNew: true,
        rating: 4.9,
        reviewCount: 67,
        gradientColor: 'from-gray-300 to-gray-100',
        isActive: true
      },
      {
        name: 'Aged Pu-erh 2005',
        slug: 'aged-pu-erh-2005',
        description: 'A rare vintage pu-erh aged for nearly two decades, developing extraordinary depth and complexity. The earthy, woody character with hints of dark chocolate and dried fruit makes this a collector\'s treasure.',
        shortDescription: 'Vintage 2005 fermented tea with deep complexity',
        price: 5999,
        comparePrice: 7499,
        images: TEA_CATEGORY_GALLERIES['Pu-erh Tea'],
        category: 'Pu-erh Tea',
        categoryId: categories[4]._id,
        origin: 'Yunnan, China',
        fermentation: 'post-fermented',
        season: 'spring',
        tastingNotes: ['Earthy', 'Woody', 'Dark Chocolate'],
        brewingGuide: {
          temperature: '100°C',
          steepTime: '4-6 min',
          amount: '7g per 200ml',
          instructions: 'Use fully boiling water. Rinse the leaves once before steeping. Can be re-steeped 8-10 times.'
        },
        weight: '200g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 10,
        featured: true,
        bestSeller: false,
        isNew: false,
        rating: 4.8,
        reviewCount: 45,
        gradientColor: 'from-red-900 to-red-700',
        isActive: true
      },
      {
        name: 'Ceremonial Matcha',
        slug: 'ceremonial-matcha',
        description: 'Our highest grade matcha, stone-ground from shade-grown tencha leaves in Uji, Japan. The vibrant emerald powder whisked into a smooth, frothy bowl offers umami richness and a naturally sweet, vegetal finish.',
        shortDescription: 'Premium stone-ground Japanese matcha',
        price: 3799,
        comparePrice: 4499,
        images: TEA_CATEGORY_GALLERIES.Matcha,
        category: 'Matcha',
        categoryId: categories[5]._id,
        origin: 'Uji, Japan',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Umami', 'Sweet', 'Vegetal'],
        brewingGuide: {
          temperature: '70°C',
          steepTime: 'Whisk 15-20 sec',
          amount: '2g per 70ml',
          instructions: 'Sift matcha into a warm bowl. Add water at 70°C. Whisk vigorously in a W-motion until frothy.'
        },
        weight: '30g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 20,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 203,
        gradientColor: 'from-green-600 to-green-400',
        isActive: true
      },
      {
        name: 'Assam Golden Tips',
        slug: 'assam-golden-tips',
        description: 'A premium second-flush Assam tea distinguished by its abundance of golden tips. This full-bodied tea delivers bold malty flavors with a rich, honeyed sweetness that lingers on the palate.',
        shortDescription: 'Second flush Assam with golden tips',
        price: 1999,
        comparePrice: 2499,
        images: TEA_CATEGORY_GALLERIES['Black Tea'],
        category: 'Black Tea',
        categoryId: categories[0]._id,
        origin: 'Assam, India',
        fermentation: 'full',
        season: 'summer',
        tastingNotes: ['Malty', 'Honey', 'Rich'],
        brewingGuide: {
          temperature: '95°C',
          steepTime: '3-4 min',
          amount: '2.5g per 200ml',
          instructions: 'Use freshly boiled water. Steep for 3-4 minutes. Excellent with a splash of milk.'
        },
        weight: '125g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 40,
        featured: false,
        bestSeller: true,
        isNew: false,
        rating: 4.6,
        reviewCount: 178,
        gradientColor: 'from-amber-900 to-amber-700',
        isActive: true
      },
      {
        name: 'Sencha Supreme',
        slug: 'sencha-supreme',
        description: 'Japan\'s most beloved everyday tea elevated to an art form. Our Sencha Supreme offers a perfect balance of sweetness, astringency, and umami that captures the essence of Japanese tea culture in every cup.',
        shortDescription: 'Premium Japanese steamed green tea',
        price: 1899,
        comparePrice: 2299,
        images: TEA_CATEGORY_GALLERIES['Green Tea'],
        category: 'Green Tea',
        categoryId: categories[1]._id,
        origin: 'Shizuoka, Japan',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Grassy', 'Umami', 'Sweet'],
        brewingGuide: {
          temperature: '75°C',
          steepTime: '1-2 min',
          amount: '3g per 200ml',
          instructions: 'Use water at 75°C. Steep briefly for 1-2 minutes. Re-steep multiple times, reducing steep time.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 35,
        featured: false,
        bestSeller: true,
        isNew: false,
        rating: 4.5,
        reviewCount: 245,
        gradientColor: 'from-green-700 to-green-500',
        isActive: true
      },
      {
        name: 'Oriental Beauty',
        slug: 'oriental-beauty',
        description: 'Also known as Dong Fang Mei Ren, this rare oolong is bitten by leafhoppers before harvest, triggering a natural oxidation that creates extraordinary honey and muscatel flavors. A true gift from nature.',
        shortDescription: 'Bug-bitten oolong with natural honey sweetness',
        price: 4299,
        comparePrice: 5199,
        images: TEA_CATEGORY_GALLERIES['Oolong Tea'],
        category: 'Oolong Tea',
        categoryId: categories[2]._id,
        origin: 'Hsinchu, Taiwan',
        fermentation: 'medium',
        season: 'summer',
        tastingNotes: ['Honey', 'Muscatel', 'Peach'],
        brewingGuide: {
          temperature: '90°C',
          steepTime: '2-3 min',
          amount: '4g per 200ml',
          instructions: 'Use water at 90°C. Steep for 2-3 minutes. Can be re-steeped 4-5 times.'
        },
        weight: '75g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 12,
        featured: true,
        bestSeller: false,
        isNew: true,
        rating: 4.8,
        reviewCount: 34,
        gradientColor: 'from-orange-600 to-amber-400',
        isActive: true
      },
      {
        name: 'White Peony',
        slug: 'white-peony',
        description: 'Bai Mudan, or White Peony, is a graceful white tea comprising both buds and young leaves. Its gentle floral aroma and refreshing sweetness make it an ideal introduction to the world of white teas.',
        shortDescription: 'Gentle floral white tea with buds and leaves',
        price: 2299,
        comparePrice: 2799,
        images: TEA_CATEGORY_GALLERIES['White Tea'],
        category: 'White Tea',
        categoryId: categories[3]._id,
        origin: 'Fujian, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Floral', 'Sweet', 'Fresh'],
        brewingGuide: {
          temperature: '80°C',
          steepTime: '3-4 min',
          amount: '3g per 200ml',
          instructions: 'Use water at 80°C. Steep for 3-4 minutes. Can be re-steeped 2-3 times.'
        },
        weight: '100g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 28,
        featured: false,
        bestSeller: false,
        isNew: false,
        rating: 4.4,
        reviewCount: 92,
        gradientColor: 'from-pink-100 to-white',
        isActive: true
      },
      {
        name: 'Raw Pu-erh Cake 2018',
        slug: 'raw-pu-erh-cake-2018',
        description: 'A young sheng pu-erh pressed into a traditional cake, showing vibrant energy and a lingering sweet aftertaste. This tea has excellent aging potential and will develop greater complexity over the decades.',
        shortDescription: 'Young raw pu-erh with aging potential',
        price: 3499,
        comparePrice: 3999,
        images: TEA_CATEGORY_GALLERIES['Pu-erh Tea'],
        category: 'Pu-erh Tea',
        categoryId: categories[4]._id,
        origin: 'Yunnan, China',
        fermentation: 'post-fermented',
        season: 'spring',
        tastingNotes: ['Astringent', 'Sweet Aftertaste', 'Floral'],
        brewingGuide: {
          temperature: '95°C',
          steepTime: '3-5 min',
          amount: '7g per 200ml',
          instructions: 'Use near-boiling water. Rinse the leaves once. Steep for 3-5 minutes, re-steep 6-8 times.'
        },
        weight: '357g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 8,
        featured: false,
        bestSeller: false,
        isNew: false,
        rating: 4.6,
        reviewCount: 28,
        gradientColor: 'from-green-800 to-green-600',
        isActive: true
      },
      {
        name: 'Latte Grade Matcha',
        slug: 'latte-grade-matcha',
        description: 'Specially crafted for culinary use, our latte grade matcha delivers bold, vibrant flavor that shines through milk and sweeteners. Perfect for matcha lattes, smoothies, and creative desserts.',
        shortDescription: 'Culinary matcha perfect for lattes and desserts',
        price: 1499,
        comparePrice: 1899,
        images: TEA_CATEGORY_GALLERIES.Matcha,
        category: 'Matcha',
        categoryId: categories[5]._id,
        origin: 'Kyoto, Japan',
        fermentation: 'none',
        season: 'year-round',
        tastingNotes: ['Bold', 'Vegetal', 'Slightly Astringent'],
        brewingGuide: {
          temperature: '80°C',
          steepTime: 'Whisk 10-15 sec',
          amount: '3g per 150ml milk',
          instructions: 'Sift matcha into a cup. Add a splash of warm water and whisk. Top with steamed milk of your choice.'
        },
        weight: '100g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 45,
        featured: false,
        bestSeller: true,
        isNew: false,
        rating: 4.3,
        reviewCount: 312,
        gradientColor: 'from-green-500 to-green-300',
        isActive: true
      }
    ];
    const products = await Promise.all(productSeeds.map(async (productSeed) => {
      const product = await Product.findOneAndUpdate(
        { slug: productSeed.slug },
        { $setOnInsert: productSeed },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const currentImages = Array.isArray(product.images) ? product.images : [];
      if (currentImages.length < 4) {
        product.images = [...new Set([
          ...currentImages,
          ...productSeed.images.filter((image) => !currentImages.includes(image)),
        ])].slice(0, 4);
        await product.save();
      }

      return product;
    }));

    return res.json({
      success: true,
      message: 'Tea catalog is ready. Existing records were preserved.',
      data: { categories: categories.length, products: products.length }
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'King\'s Tea API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
  dbName: process.env.MONGODB_DATABASE || 'kings-tea'
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🌱 Seed: http://localhost:${PORT}/api/seed`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
