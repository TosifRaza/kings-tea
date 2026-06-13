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
const Collection = require('./models/CollectionModel');
const Testimonial = require('./models/TestimonialModel');
const BlogPost = require('./models/BlogPostModel');
const Subscription = require('./models/SubscriptionModel');
const User = require('./models/UserModel');

const app = express();

// Create uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
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
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Testimonial.deleteMany({});
    await BlogPost.deleteMany({});
    await Subscription.deleteMany({});
    await User.deleteMany({});

    // ============ SEED ADMIN USER (MUST BE FIRST - needed for subscriptions) ============
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@kingstea.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    // ============ SEED CATEGORIES ============
    const categories = await Category.insertMany([
      {
        name: 'Black Tea',
        slug: 'black-tea',
        description: 'Bold, robust, and full-bodied teas with rich flavors. Our black tea collection features the finest leaves from renowned estates across India, Sri Lanka, and China.',
        image: '',
        featured: true,
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Green Tea',
        slug: 'green-tea',
        description: 'Fresh, delicate, and naturally vibrant. Experience the nuanced flavors of carefully steamed and pan-fired green teas from Japan and China.',
        image: '',
        featured: true,
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Oolong Tea',
        slug: 'oolong-tea',
        description: 'A perfect balance between black and green, offering complex flavor profiles that evolve with every sip. Crafted through traditional oxidation techniques.',
        image: '',
        featured: true,
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'White Tea',
        slug: 'white-tea',
        description: 'The most delicate and minimally processed of all teas. Silver needle and white peony varieties that offer subtle, ethereal flavors.',
        image: '',
        featured: false,
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Pu-erh Tea',
        slug: 'pu-erh-tea',
        description: 'Aged and fermented teas from Yunnan province, offering deep, earthy flavors that improve with time. A true connoisseur\'s choice.',
        image: '',
        featured: false,
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Matcha',
        slug: 'matcha',
        description: 'Stone-ground ceremonial and culinary grade matcha. Vibrant green powder crafted from shade-grown tencha leaves for an immersive tea experience.',
        image: '',
        featured: true,
        sortOrder: 6,
        isActive: true
      }
    ]);

    // ============ SEED PRODUCTS ============
    const products = await Product.insertMany([
      {
        name: 'Royal Darjeeling',
        slug: 'royal-darjeeling',
        description: 'Sourced from the misty heights of Darjeeling\'s first flush, this tea embodies the champagne of teas with its delicate muscatel character and floral undertones. Each leaf is hand-picked at dawn to preserve its exquisite flavor profile.',
        shortDescription: 'First flush Darjeeling with muscatel character',
        price: 2499,
        comparePrice: 2999,
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
        images: [],
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
    ]);

    // ============ SEED COLLECTIONS ============
    const collections = await Collection.insertMany([
      {
        name: 'By Origin',
        slug: 'by-origin',
        description: 'Explore teas from the world\'s most renowned growing regions, from the misty Himalayan slopes of Darjeeling to the ancient tea gardens of Fujian. Each origin imparts unique characteristics shaped by terroir, altitude, and centuries of cultivation expertise.',
        gradientColor: 'from-emerald-800 to-emerald-600',
        image: '',
        itemCount: 8,
        featured: true,
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'By Fermentation',
        slug: 'by-fermentation',
        description: 'Discover teas categorized by their level of oxidation, from the delicate freshness of unfermented green teas to the deep complexity of fully oxidized black teas. Understanding fermentation unlocks a deeper appreciation of tea\'s incredible diversity.',
        gradientColor: 'from-amber-800 to-amber-600',
        image: '',
        itemCount: 6,
        featured: true,
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'By Season',
        slug: 'by-season',
        description: 'Just as wine varies by vintage, tea is profoundly influenced by the season of harvest. Spring teas offer delicate vibrancy, summer brings robust intensity, and autumn yields nuanced complexity that rewards the patient connoisseur.',
        gradientColor: 'from-teal-800 to-teal-600',
        image: '',
        itemCount: 4,
        featured: true,
        sortOrder: 3,
        isActive: true
      }
    ]);

    // ============ SEED TESTIMONIALS ============
    const testimonials = await Testimonial.insertMany([
      {
        name: 'Priya Sharma',
        location: 'Mumbai, India',
        quote: 'The Royal Darjeeling from King\'s Tea is unlike anything I\'ve ever tasted. Each sip transports me to the misty hills of the Himalayas. This is truly the finest tea I\'ve found outside of the estates themselves.',
        rating: 5,
        avatar: '',
        featured: true,
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'James Chen',
        location: 'San Francisco, USA',
        quote: 'As a lifelong tea enthusiast, I was skeptical about ordering online. But the Ceremonial Matcha exceeded all expectations — vibrant color, smooth umami, and impeccable freshness. King\'s Tea has earned a customer for life.',
        rating: 5,
        avatar: '',
        featured: true,
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Amara Okafor',
        location: 'London, UK',
        quote: 'The subscription service is brilliant — every month brings a new discovery. Last month\'s Iron Goddess Oolong was a revelation. The quality and presentation make this a truly royal experience.',
        rating: 5,
        avatar: '',
        featured: true,
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Yuki Tanaka',
        location: 'Tokyo, Japan',
        quote: 'Even in Japan, where matcha is part of daily life, King\'s Tea ceremonial grade stands out. The depth of flavor and the care in sourcing is evident in every bowl. A beautiful tribute to the art of tea.',
        rating: 4,
        avatar: '',
        featured: false,
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Sofia Rossi',
        location: 'Milan, Italy',
        quote: 'I gifted the Silver Needle to my mother and she was moved to tears by its delicacy. King\'s Tea understands that tea is not just a beverage — it\'s an experience, a memory, a moment of peace.',
        rating: 5,
        avatar: '',
        featured: true,
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Raj Patel',
        location: 'Ahmedabad, India',
        quote: 'The Aged Pu-erh is extraordinary — complex, earthy, and endlessly fascinating. Each steeping reveals new layers of flavor. This is tea for those who truly appreciate the craft and patience behind great tea-making.',
        rating: 5,
        avatar: '',
        featured: false,
        sortOrder: 6,
        isActive: true
      }
    ]);

    // ============ SEED BLOG POSTS ============
    const blogPosts = await BlogPost.insertMany([
      {
        title: 'The Art of Gongfu Cha: A Beginner\'s Journey',
        slug: 'art-of-gongfu-cha-beginners-journey',
        excerpt: 'Discover the ancient Chinese tea ceremony that transforms simple tea drinking into a meditative practice. Learn the fundamental techniques, essential tools, and philosophy behind Gongfu Cha that has been perfected over centuries of tradition.',
        content: 'Gongfu Cha, which translates to "tea with skill," is more than just a method of preparing tea — it is a philosophy, a meditation, and an art form that has been practiced for centuries in China. This ancient tradition emphasizes the harmonious relationship between the tea master, the tea, and the guests, creating an experience that engages all the senses. The practice begins with selecting the right teaware, typically a Yixing clay teapot or a gaiwan, and understanding how each piece contributes to the overall experience. The water temperature, the ratio of tea to water, and the timing of each infusion are all critical elements that require careful attention and practice to master.',
        category: 'Tea Culture',
        tags: ['gongfu', 'ceremony', 'beginner'],
        author: 'King\'s Tea',
        date: new Date('2025-01-15'),
        readTime: '8 min read',
        gradientColor: 'from-amber-700 to-amber-500',
        image: '',
        featured: true,
        isActive: true
      },
      {
        title: 'Understanding Tea Terroir: Why Origin Matters',
        slug: 'understanding-tea-terroir-why-origin-matters',
        excerpt: 'Just as wine reflects its terroir, tea is profoundly shaped by the soil, altitude, and climate of its growing region. Explore how Darjeeling\'s misty heights create flavors entirely different from the bold plains of Assam.',
        content: 'The concept of terroir — the unique combination of soil, climate, altitude, and geography that gives a product its distinctive character — is as crucial to tea as it is to wine. The same tea plant (Camellia sinensis) grown in different regions will produce dramatically different flavors, aromas, and characteristics. Darjeeling tea, grown at elevations between 600 and 2,000 meters in the Indian Himalayas, develops its famous muscatel character due to the cool mountain air, frequent mist, and well-drained soil. In contrast, Assam tea, grown near sea level in the humid Brahmaputra valley, produces the bold, malty flavors that make it the backbone of breakfast blends worldwide.',
        category: 'Education',
        tags: ['terroir', 'origin', 'darjeeling', 'assam'],
        author: 'King\'s Tea',
        date: new Date('2025-01-10'),
        readTime: '6 min read',
        gradientColor: 'from-emerald-700 to-emerald-500',
        image: '',
        featured: true,
        isActive: true
      },
      {
        title: 'The Health Benefits of Matcha: Science Meets Tradition',
        slug: 'health-benefits-of-matcha-science-meets-tradition',
        excerpt: 'Modern science is confirming what Zen monks have known for centuries — matcha offers remarkable health benefits. From potent antioxidants to sustained energy, discover why this vibrant green tea powder is a nutritional powerhouse.',
        content: 'Matcha has been a cornerstone of Japanese tea culture for over 800 years, originally used by Zen Buddhist monks to maintain alertness during long meditation sessions. Today, modern scientific research is validating what these monks experienced intuitively. Matcha is uniquely nutritious because, unlike other teas where the leaves are steeped and discarded, with matcha you consume the entire leaf in powdered form. This means you receive the full spectrum of the tea\'s nutritional benefits, including an exceptionally high concentration of catechins — particularly EGCG (epigallocatechin gallate), which is one of the most powerful antioxidants found in nature.',
        category: 'Health & Wellness',
        tags: ['matcha', 'health', 'antioxidants', 'wellness'],
        author: 'King\'s Tea',
        date: new Date('2025-01-05'),
        readTime: '7 min read',
        gradientColor: 'from-green-700 to-green-500',
        image: '',
        featured: true,
        isActive: true
      },
      {
        title: 'Pairing Tea with Food: A Royal Guide',
        slug: 'pairing-tea-with-food-royal-guide',
        excerpt: 'Elevate your dining experience by learning the art of tea and food pairing. From delicate white teas with fresh seafood to robust pu-erh with rich desserts, discover combinations that transform ordinary meals into royal feasts.',
        content: 'The art of pairing tea with food is a nuanced practice that can elevate both the tea and the meal to extraordinary heights. Just as sommeliers pair wines with cuisine, tea pairing considers the weight, flavor intensity, and aromatic qualities of both the tea and the food. Delicate white teas like Silver Needle pair beautifully with light seafood, salads, and mild cheeses, as their subtle sweetness and floral notes complement without overwhelming. Light oolongs such as Tieguanyin find harmony with roasted poultry, grilled vegetables, and lightly spiced dishes, the tea\'s orchid aromatics bridging the gap between savory and sweet.',
        category: 'Lifestyle',
        tags: ['pairing', 'food', 'dining', 'entertaining'],
        author: 'King\'s Tea',
        date: new Date('2024-12-28'),
        readTime: '5 min read',
        gradientColor: 'from-red-800 to-red-600',
        image: '',
        featured: false,
        isActive: true
      }
    ]);

    // ============ SEED SUBSCRIPTION PLANS (AFTER admin is created) ============
    const subscriptionPlans = await Subscription.insertMany([
      {
        name: 'Royal Monthly',
        slug: 'royal-monthly',
        price: 1999,
        comparePrice: 2499,
        period: 'month',
        description: 'Discover a new premium tea every month, hand-selected by our tea masters. Perfect for those beginning their journey into the world of fine teas and wanting to explore different varieties and origins.',
        features: [
          '1 premium tea selection (50g)',
          'Tasting notes card',
          'Brewing guide included',
          'Free shipping',
          '10% off additional purchases'
        ],
        popular: false,
        gradientColor: 'from-amber-700 to-amber-500',
        isActive: true,
        sortOrder: 1,
        userId: admin._id,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Imperial Quarterly',
        slug: 'imperial-quarterly',
        price: 5499,
        comparePrice: 7497,
        period: 'quarter',
        description: 'Our most popular plan delivers three exceptional teas each quarter, including rare and limited-edition selections not available elsewhere. Experience the full spectrum of flavors from the world\'s finest tea gardens.',
        features: [
          '3 premium tea selections (75g each)',
          'Detailed tasting notes & origin story',
          'Brewing accessories included',
          'Free express shipping',
          '15% off additional purchases',
          'Exclusive access to limited editions'
        ],
        popular: true,
        gradientColor: 'from-emerald-700 to-emerald-500',
        isActive: true,
        sortOrder: 2,
        userId: admin._id,
        nextBillingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Sovereign Annual',
        slug: 'sovereign-annual',
        price: 19999,
        comparePrice: 29988,
        period: 'year',
        description: 'The ultimate tea experience for the true connoisseur. Receive twelve carefully curated teas throughout the year, including our rarest and most exclusive offerings. This is the pinnacle of tea subscription luxury.',
        features: [
          '12 premium tea selections (100g each)',
          'Collector\'s tasting journal',
          'Premium brewing accessories',
          'Free express shipping worldwide',
          '20% off additional purchases',
          'Exclusive access to limited editions',
          'Personal tea consultation',
          'Invitation to virtual tea events'
        ],
        popular: false,
        gradientColor: 'from-red-800 to-red-600',
        isActive: true,
        sortOrder: 3,
        userId: admin._id,
        nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ]);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        categories: categories.length,
        products: products.length,
        collections: collections.length,
        testimonials: testimonials.length,
        blogPosts: blogPosts.length,
        subscriptionPlans: subscriptionPlans.length,
        admin: admin.email
      }
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
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
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
