const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const MediaAsset = require('../models/MediaAssetModel');
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/ProductController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

const router = express.Router();

// Multer configuration for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

const fileFilter = (req, file, cb) => {
  const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.webp', '.gif']);
  const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  const extname = allowedExtensions.has(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.has(file.mimetype.toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 4, fields: 50, parts: 60 },
});

const uploadProductImages = [upload.array('images', 4), async (req, res, next) => {
  if (!req.files?.length) return next();
  const uploadedPublicIds = [];
  try {
    const signatures = [
      { mime: 'image/jpeg', check: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
      { mime: 'image/png', check: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
      { mime: 'image/webp', check: (buffer) => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' },
      { mime: 'image/gif', check: (buffer) => ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)) },
    ];
    for (const file of req.files) {
      if (!signatures.some(({ mime, check }) => mime === file.mimetype && check(file.buffer))) {
        return res.status(400).json({ success: false, message: 'Image content does not match its declared file type.' });
      }
    }
    await Promise.all(req.files.map((file) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: 'kings-tea/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }, { quality: 'auto' }],
      }, (error, result) => {
        if (error) return reject(error);
        file.path = result.secure_url;
        file.filename = result.public_id;
        file.cloudinary = result;
        uploadedPublicIds.push(result.public_id);
        resolve();
      });
      stream.end(file.buffer);
    })));
    await MediaAsset.insertMany(req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      sourceProvider: 'User upload',
      altText: path.parse(file.originalname).name.replace(/[-_]+/g, ' ').slice(0, 300),
      width: file.cloudinary.width,
      height: file.cloudinary.height,
      mimeType: file.mimetype,
      bytes: file.cloudinary.bytes,
      format: file.cloudinary.format,
      usage: 'product',
    })));
    next();
  } catch (error) {
    await Promise.all(uploadedPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId).catch(() => null)));
    next(error);
  }
}];

// ============================================================
// PUBLIC routes
// ============================================================
// ⚠️ /slug/:slug MUST come before /:id — otherwise Express
// treats "silver-needle" as an :id parameter
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// ============================================================
// PROTECTED admin routes
// ============================================================
router.post(
  '/',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  uploadProductImages,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
  ],
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  uploadProductImages,
  updateProduct
);

router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteProduct);

module.exports = router;
