console.log('SERVER FILE LOADED');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/DatabaseConfig');
const { successResponse, errorResponse } = require('./utils/ResponseHandler');

const AuthRoutes = require('./routes/AuthRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const CategoryRoutes = require('./routes/CategoryRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const UserRoutes = require('./routes/UserRoutes');
const CartRoutes = require('./routes/CartRoutes');
const WishlistRoutes = require('./routes/WishlistRoutes');
const ReviewRoutes = require('./routes/ReviewRoutes');
const BlogRoutes = require('./routes/BlogRoutes');
const SubscriptionRoutes = require('./routes/SubscriptionRoutes');
const NewsletterRoutes = require('./routes/NewsletterRoutes');
const ContactRoutes = require('./routes/ContactRoutes');
const StatsRoutes = require('./routes/StatsRoutes');

const User = require('./models/UserModel');
const Product = require('./models/ProductModel');
const Category = require('./models/CategoryModel');

const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/', (req, res) => {
  return successResponse(res, {
    name: "KING'S TEA API",
    version: '1.0.0',
    status: 'running'
  }, "Welcome to KING'S TEA API Server");
});

app.use('/api/auth', AuthRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/wishlist', WishlistRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use('/api/blog', BlogRoutes);
app.use('/api/subscriptions', SubscriptionRoutes);
app.use('/api/newsletter', NewsletterRoutes);
app.use('/api/contact', ContactRoutes);
app.use('/api/stats', StatsRoutes);

app.get('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categories = [
      {
        name: 'Black Tea',
        slug: 'black-tea',
        description: 'Bold and robust, our black tea collection features the finest full-oxidized leaves from legendary tea estates around the world.',
        image: '/images/categories/black-tea.jpg',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Green Tea',
        slug: 'green-tea',
        description: 'Delicate and refreshing, our green tea collection celebrates the art of minimal oxidation, preserving the natural essence of the leaf.',
        image: '/images/categories/green-tea.jpg',
        featured: true,
        sortOrder: 2
      },
      {
        name: 'Oolong Tea',
        slug: 'oolong-tea',
        description: 'Complex and aromatic, our oolong teas are masterfully crafted through a precise semi-oxidization process that yields extraordinary depth.',
        image: '/images/categories/oolong-tea.jpg',
        featured: true,
        sortOrder: 3
      },
      {
        name: 'White Tea',
        slug: 'white-tea',
        description: 'The most delicate of all teas, our white tea collection showcases the purest expression of the tea plant with minimal processing.',
        image: '/images/categories/white-tea.jpg',
        featured: false,
        sortOrder: 4
      },
      {
        name: 'Pu-erh Tea',
        slug: 'pu-erh-tea',
        description: 'Rich and earthy, our pu-erh teas are aged to perfection, developing complex flavors that deepen and evolve over time.',
        image: '/images/categories/puerh-tea.jpg',
        featured: false,
        sortOrder: 5
      },
      {
        name: 'Matcha',
        slug: 'matcha',
        description: 'Vibrant and ceremonial, our matcha collection features stone-ground tencha leaves from Japan\'s most revered tea gardens.',
        image: '/images/categories/matcha.jpg',
        featured: true,
        sortOrder: 6
      }
    ];

    const createdCategories = await Category.insertMany(categories);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const products = [
      {
        name: 'Imperial Dragon Well',
        slug: 'imperial-dragon-well',
        description: 'Sourced from the legendary West Lake region of Hangzhou, our Imperial Dragon Well represents the pinnacle of Chinese green tea craftsmanship. Each leaf is hand-picked during the brief spring harvest and meticulously pan-fired by master tea artisans using traditional techniques passed down through generations. The result is a tea of extraordinary clarity and depth, with a sweet, nutty character that lingers on the palate long after the last sip.',
        shortDescription: 'Hand-picked from West Lake, this legendary Chinese green tea offers sweet chestnut notes with a silky smooth finish.',
        price: 68,
        comparePrice: 85,
        images: ['/images/products/dragon-well-1.jpg', '/images/products/dragon-well-2.jpg'],
        category: 'Green Tea',
        origin: 'Hangzhou, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Sweet chestnut', 'Orchid', 'Toasted rice', 'Fresh greens'],
        brewingGuide: {
          temperature: '75-80°C',
          steepTime: '2-3 minutes',
          amount: '3g per 200ml',
          instructions: 'Use a glass or porcelain vessel. Pour water over leaves and watch them dance.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 50,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.8,
        reviewCount: 24,
        categoryId: categoryMap['Green Tea']
      },
      {
        name: 'Royal Darjeeling First Flush',
        slug: 'royal-darjeeling-first-flush',
        description: 'From the misty heights of Darjeeling\'s most esteemed estates, our Royal First Flush captures the ephemeral magic of spring\'s earliest harvest.',
        shortDescription: 'The Champagne of Teas — spring\'s first harvest from Himalayan estates with exquisite muscatel character.',
        price: 75,
        comparePrice: 92,
        images: ['/images/products/darjeeling-1.jpg', '/images/products/darjeeling-2.jpg'],
        category: 'Black Tea',
        origin: 'Darjeeling, India',
        fermentation: 'light',
        season: 'spring',
        tastingNotes: ['Muscatel grape', 'Spring flowers', 'Citrus zest', 'Honey'],
        brewingGuide: {
          temperature: '85-90°C',
          steepTime: '3-4 minutes',
          amount: '2.5g per 200ml',
          instructions: 'Warm your teapot first. Use freshly drawn water heated to 85°C.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 35,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 31,
        categoryId: categoryMap['Black Tea']
      },
      {
        name: 'Golden Yunnan Tips',
        slug: 'golden-yunnan-tips',
        description: 'A treasure from the ancient tea forests of Yunnan province, our Golden Tips are crafted exclusively from the downy buds of century-old tea trees.',
        shortDescription: 'Exquisite golden buds from ancient Yunnan tea trees, yielding a rich malty cup with natural honey sweetness.',
        price: 82,
        comparePrice: 99,
        images: ['/images/products/yunnan-1.jpg', '/images/products/yunnan-2.jpg'],
        category: 'Black Tea',
        origin: 'Yunnan, China',
        fermentation: 'full',
        season: 'spring',
        tastingNotes: ['Malty cocoa', 'Honey', 'Dried apricot', 'Vanilla'],
        brewingGuide: {
          temperature: '90-95°C',
          steepTime: '3-5 minutes',
          amount: '3g per 200ml',
          instructions: 'This tea rewards a slightly hotter water temperature.'
        },
        weight: '100g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 40,
        featured: false,
        bestSeller: false,
        isNew: true,
        rating: 4.7,
        reviewCount: 18,
        categoryId: categoryMap['Black Tea']
      },
      {
        name: 'Jade Oolong Supreme',
        slug: 'jade-oolong-supreme',
        description: 'From the misty mountains of Nantou County in Taiwan, our Jade Oolong Supreme represents the art of Taiwanese tea-making at its finest.',
        shortDescription: 'A masterfully crafted Taiwanese oolong with intoxicating lilac and orchid notes and a buttery smooth finish.',
        price: 95,
        comparePrice: 115,
        images: ['/images/products/jade-oolong-1.jpg', '/images/products/jade-oolong-2.jpg'],
        category: 'Oolong Tea',
        origin: 'Nantou, Taiwan',
        fermentation: 'light',
        season: 'autumn',
        tastingNotes: ['Lilac', 'Orchid', 'Fresh cream', 'Butter'],
        brewingGuide: {
          temperature: '80-85°C',
          steepTime: '1-2 minutes',
          amount: '5g per 150ml',
          instructions: 'Best prepared Gongfu style with a small teapot or gaiwan.'
        },
        weight: '75g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 25,
        featured: true,
        bestSeller: false,
        isNew: true,
        rating: 4.9,
        reviewCount: 15,
        categoryId: categoryMap['Oolong Tea']
      },
      {
        name: 'Silver Needle Reserve',
        slug: 'silver-needle-reserve',
        description: 'The rarest and most revered of all white teas, our Silver Needle Reserve is crafted entirely from the tender, silvery buds of the Da Bai tea bush in Fujian\'s Fuding county.',
        shortDescription: 'The rarest white tea — pure silver buds from Fujian with ethereal notes of white peach and spring blossoms.',
        price: 110,
        comparePrice: 135,
        images: ['/images/products/silver-needle-1.jpg', '/images/products/silver-needle-2.jpg'],
        category: 'White Tea',
        origin: 'Fujian, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['White peach', 'Honeydew', 'Cucumber', 'Jasmine'],
        brewingGuide: {
          temperature: '70-75°C',
          steepTime: '4-5 minutes',
          amount: '4g per 200ml',
          instructions: 'Treat this delicate tea with gentle warmth — never boiling water.'
        },
        weight: '50g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 20,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 5.0,
        reviewCount: 12,
        categoryId: categoryMap['White Tea']
      },
      {
        name: 'Royal Earl Grey',
        slug: 'royal-earl-grey',
        description: 'Our Royal Earl Grey elevates the beloved classic to new heights of sophistication with a superlative base of Assam and Ceylon teas.',
        shortDescription: 'A refined blend of Assam and Ceylon with Calabrian bergamot — the classic Earl Grey, elevated.',
        price: 55,
        comparePrice: 68,
        images: ['/images/products/earl-grey-1.jpg', '/images/products/earl-grey-2.jpg'],
        category: 'Black Tea',
        origin: 'Assam & Ceylon',
        fermentation: 'full',
        season: 'year-round',
        tastingNotes: ['Bergamot citrus', 'Malty Assam', 'Bright Ceylon', 'Floral'],
        brewingGuide: {
          temperature: '95-100°C',
          steepTime: '3-4 minutes',
          amount: '2.5g per 200ml',
          instructions: 'Use freshly boiled water cooled slightly to 95°C.'
        },
        weight: '100g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 60,
        featured: false,
        bestSeller: true,
        isNew: false,
        rating: 4.6,
        reviewCount: 42,
        categoryId: categoryMap['Black Tea']
      },
      {
        name: 'Jasmine Pearl Imperial',
        slug: 'jasmine-pearl-imperial',
        description: 'Our Jasmine Pearl Imperial is a tea of extraordinary artistry and patience. Each pearl is hand-rolled from the finest spring-picked green tea leaves.',
        shortDescription: 'Hand-rolled jasmine pearls, layered with fresh blossoms through six scentings for perfect floral harmony.',
        price: 78,
        comparePrice: 95,
        images: ['/images/products/jasmine-pearl-1.jpg', '/images/products/jasmine-pearl-2.jpg'],
        category: 'Green Tea',
        origin: 'Fujian, China',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Jasmine blossom', 'Honey', 'Fresh grass', 'Lily'],
        brewingGuide: {
          temperature: '80-85°C',
          steepTime: '2-3 minutes',
          amount: '3-4 pearls per 200ml',
          instructions: 'Place 8-10 pearls in a glass teapot and watch them slowly unfurl.'
        },
        weight: '80g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 30,
        featured: true,
        bestSeller: false,
        isNew: false,
        rating: 4.7,
        reviewCount: 28,
        categoryId: categoryMap['Green Tea']
      },
      {
        name: 'Aged Pu-erh 2005',
        slug: 'aged-puerh-2005',
        description: 'Aged for nearly two decades in the traditional manner, our 2005 Pu-erh is a testament to the transformative power of time.',
        shortDescription: 'Nearly two decades of careful aging yield profound depth — dark chocolate, leather, and ancient forest notes.',
        price: 125,
        comparePrice: 155,
        images: ['/images/products/puerh-1.jpg', '/images/products/puerh-2.jpg'],
        category: 'Pu-erh Tea',
        origin: 'Yunnan, China',
        fermentation: 'post-fermented',
        season: 'spring',
        tastingNotes: ['Dark chocolate', 'Leather', 'Dried plum', 'Forest floor'],
        brewingGuide: {
          temperature: '95-100°C',
          steepTime: '30 seconds - 1 minute',
          amount: '7g per 150ml',
          instructions: 'Rinse the tea first with boiling water and discard.'
        },
        weight: '100g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 15,
        featured: true,
        bestSeller: false,
        isNew: false,
        rating: 4.8,
        reviewCount: 9,
        categoryId: categoryMap['Pu-erh Tea']
      },
      {
        name: 'Kyoto Matcha Ceremonial',
        slug: 'kyoto-matcha-ceremonial',
        description: 'Our Kyoto Matcha Ceremonial is the highest grade of matcha available, crafted from shade-grown tencha leaves harvested in the legendary Uji district of Kyoto.',
        shortDescription: 'Stone-ground shade-grown tencha from Uji — the highest ceremonial grade with intense umami and creamy sweetness.',
        price: 89,
        comparePrice: 110,
        images: ['/images/products/matcha-1.jpg', '/images/products/matcha-2.jpg'],
        category: 'Matcha',
        origin: 'Uji, Kyoto, Japan',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['Umami', 'Sweet cream', 'Seaweed', 'Fresh grass'],
        brewingGuide: {
          temperature: '70-75°C',
          steepTime: 'Whisk for 15-20 seconds',
          amount: '2g per 70ml',
          instructions: 'Sift the matcha into a warm chawan. Whisk vigorously in a W-motion.'
        },
        weight: '30g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 35,
        featured: true,
        bestSeller: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 33,
        categoryId: categoryMap['Matcha']
      },
      {
        name: 'Himalayan White Peony',
        slug: 'himalayan-white-peony',
        description: 'A remarkable white tea from the foothills of the Himalayas, our White Peony is produced in Darjeeling using techniques inspired by Fujian\'s Bai Mu Dan tradition.',
        shortDescription: 'A unique Indian white tea with full-bodied white grape and peony notes from the Himalayan foothills.',
        price: 92,
        comparePrice: 112,
        images: ['/images/products/white-peony-1.jpg', '/images/products/white-peony-2.jpg'],
        category: 'White Tea',
        origin: 'Darjeeling, India',
        fermentation: 'none',
        season: 'spring',
        tastingNotes: ['White grape', 'Peony', 'Mountain air', 'Raw honey'],
        brewingGuide: {
          temperature: '75-80°C',
          steepTime: '3-4 minutes',
          amount: '3g per 200ml',
          instructions: 'Use slightly warmer water than for Silver Needle.'
        },
        weight: '75g',
        caffeine: 'low',
        inStock: true,
        stockQuantity: 22,
        featured: false,
        bestSeller: false,
        isNew: true,
        rating: 4.6,
        reviewCount: 7,
        categoryId: categoryMap['White Tea']
      },
      {
        name: 'Ceylon OP Supreme',
        slug: 'ceylon-op-supreme',
        description: 'From the sun-drenched slopes of Sri Lanka\'s finest tea gardens, our Ceylon Orange Pekoe Supreme is a celebration of what makes Ceylon tea legendary.',
        shortDescription: 'Bright coppery liquor from Sri Lanka\'s finest gardens — crisp citrus character with toasted hazelnut notes.',
        price: 62,
        comparePrice: 75,
        images: ['/images/products/ceylon-1.jpg', '/images/products/ceylon-2.jpg'],
        category: 'Black Tea',
        origin: 'Sri Lanka',
        fermentation: 'full',
        season: 'year-round',
        tastingNotes: ['Citrus', 'Toasted hazelnut', 'Cinnamon spice', 'Caramel'],
        brewingGuide: {
          temperature: '95-100°C',
          steepTime: '3-5 minutes',
          amount: '2.5g per 200ml',
          instructions: 'Use freshly boiled water.'
        },
        weight: '100g',
        caffeine: 'high',
        inStock: true,
        stockQuantity: 55,
        featured: false,
        bestSeller: false,
        isNew: false,
        rating: 4.5,
        reviewCount: 19,
        categoryId: categoryMap['Black Tea']
      },
      {
        name: 'Oriental Beauty Oolong',
        slug: 'oriental-beauty-oolong',
        description: 'Oriental Beauty is one of the world\'s most extraordinary teas — a creation made possible by the tiny green leafhopper insect.',
        shortDescription: 'A legendary bug-bitten oolong from Hsinchu — luscious honey, ripe peach, and muscatel in a syrupy amber cup.',
        price: 105,
        comparePrice: 128,
        images: ['/images/products/oriental-beauty-1.jpg', '/images/products/oriental-beauty-2.jpg'],
        category: 'Oolong Tea',
        origin: 'Hsinchu, Taiwan',
        fermentation: 'medium',
        season: 'summer',
        tastingNotes: ['Honey', 'Ripe peach', 'Muscatel grape', 'Amber sugar'],
        brewingGuide: {
          temperature: '85-90°C',
          steepTime: '1-2 minutes',
          amount: '5g per 150ml',
          instructions: 'Best prepared Gongfu style.'
        },
        weight: '50g',
        caffeine: 'medium',
        inStock: true,
        stockQuantity: 18,
        featured: true,
        bestSeller: false,
        isNew: false,
        rating: 4.8,
        reviewCount: 11,
        categoryId: categoryMap['Oolong Tea']
      }
    ];

    const createdProducts = await Product.insertMany(products);

    // FIX: Pass plain password — let the UserModel pre-save hook hash it
    const adminExists = await User.findOne({ role: 'super_admin' });
    if (!adminExists) {
      await User.create({
        email: 'admin@kingstea.com',
        name: 'Super Admin',
        password: 'admin123',
        role: 'super_admin',
        emailVerified: true
      });
    }

    return successResponse(res, {
      categories: createdCategories.length,
      products: createdProducts.length,
      adminCreated: !adminExists
    }, 'Database seeded successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Seeding failed', 500);
  }
});

app.use((req, res) => {
  return errorResponse(res, 'Route not found', 404);
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  return errorResponse(res, err.message || 'Internal Server Error', err.statusCode || 500);
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`KING'S TEA Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;