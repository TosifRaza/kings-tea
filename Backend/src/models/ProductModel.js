// // const mongoose = require('mongoose');

// // const ProductSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, 'Product name is required'],
// //     trim: true,
// //     maxlength: [200, 'Product name cannot exceed 200 characters']
// //   },
// //   slug: {
// //     type: String,
// //     unique: true,
// //     lowercase: true
// //   },
// //   description: {
// //     type: String,
// //     required: [true, 'Description is required'],
// //     trim: true
// //   },
// //   shortDescription: {
// //     type: String,
// //     trim: true,
// //     maxlength: [300, 'Short description cannot exceed 300 characters']
// //   },
// //   price: {
// //     type: Number,
// //     required: [true, 'Price is required'],
// //     min: [0, 'Price cannot be negative']
// //   },
// //   comparePrice: {
// //     type: Number,
// //     min: [0, 'Compare price cannot be negative']
// //   },
// //   images: [{
// //     type: String
// //   }],
// //   category: {
// //     type: String,
// //     required: [true, 'Category is required'],
// //     trim: true
// //   },
// //   origin: {
// //     type: String,
// //     trim: true
// //   },
// //   fermentation: {
// //     type: String,
// //     enum: ['none', 'light', 'medium', 'full', 'post-fermented'],
// //     default: 'none'
// //   },
// //   season: {
// //     type: String,
// //     enum: ['spring', 'summer', 'autumn', 'winter', 'year-round'],
// //     default: 'spring'
// //   },
// //   tastingNotes: [{
// //     type: String
// //   }],
// //   brewingGuide: {
// //     temperature: { type: String, default: '' },
// //     steepTime: { type: String, default: '' },
// //     amount: { type: String, default: '' },
// //     instructions: { type: String, default: '' }
// //   },
// //   weight: {
// //     type: String,
// //     default: '100g'
// //   },
// //   caffeine: {
// //     type: String,
// //     enum: ['none', 'low', 'medium', 'high'],
// //     default: 'medium'
// //   },
// //   inStock: {
// //     type: Boolean,
// //     default: true
// //   },
// //   stockQuantity: {
// //     type: Number,
// //     default: 0,
// //     min: 0
// //   },
// //   featured: {
// //     type: Boolean,
// //     default: false
// //   },
// //   bestSeller: {
// //     type: Boolean,
// //     default: false
// //   },
// //   isNew: {
// //     type: Boolean,
// //     default: false
// //   },
// //   rating: {
// //     type: Number,
// //     default: 0,
// //     min: 0,
// //     max: 5
// //   },
// //   reviewCount: {
// //     type: Number,
// //     default: 0,
// //     min: 0
// //   },
// //   categoryId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Category'
// //   },
// //   collectionId: {
// //     type: String,
// //     default: ''
// //   }
// // }, {
// //   timestamps: true,
// //   suppressReservedKeysWarning: true
// // });

// // ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

// // module.exports = mongoose.model('Product', ProductSchema);
// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Product name is required'],
//       trim: true,
//       maxlength: [200, 'Product name cannot exceed 200 characters'],
//     },
//     description: {
//       type: String,
//       required: [true, 'Product description is required'],
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: [true, 'Product price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//     comparePrice: {
//       type: Number,
//       min: [0, 'Compare price cannot be negative'],
//       default: null,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Category',
//       required: [true, 'Product category is required'],
//     },
//     images: [
//       {
//         type: String,
//       },
//     ],
//     stock: {
//       type: Number,
//       required: [true, 'Stock quantity is required'],
//       min: [0, 'Stock cannot be negative'],
//       default: 0,
//     },
//     weight: {
//       type: String,
//       trim: true,
//     },
//     origin: {
//       type: String,
//       trim: true,
//     },
//     gradientColor: {
//       type: String,
//       default: '#1F4D3A',
//     },
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Auto-generate slug from name before saving
// productSchema.pre('save', function (next) {
//   if (!this.slug && this.name) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');
//   }
//   next();
// });

// const Product = mongoose.model('Product', productSchema);

// export default Product;
const mongoose = require('mongoose');

const brewingGuideSchema = new mongoose.Schema({
  temperature: { type: String },
  steepTime: { type: String },
  amount: { type: String },
  instructions: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
      default: null,
    },
    images: [{
      type: String,
    }],
    category: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    origin: {
      type: String,
      trim: true,
    },
    fermentation: {
      type: String,
      enum: ['none', 'light', 'medium', 'full', 'post-fermented', ''],
      default: 'none',
    },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'year-round', ''],
      default: 'spring',
    },
    tastingNotes: [{
      type: String,
    }],
    brewingGuide: brewingGuideSchema,
    weight: {
      type: String,
      trim: true,
    },
    caffeine: {
      type: String,
      enum: ['low', 'medium', 'high', ''],
      default: 'medium',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    gradientColor: {
      type: String,
      default: '#1F4D3A',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Auto-generate slug from name before saving
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;