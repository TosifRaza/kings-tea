const MediaAsset = require('../models/MediaAssetModel');
const cloudinary = require('../config/cloudinary');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const listAssets = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(60, Math.max(1, Number.parseInt(req.query.limit, 10) || 24));
    const filter = {};
    if (req.query.q) filter.$text = { $search: String(req.query.q).slice(0, 100) };
    if (req.query.usage) filter.usage = req.query.usage;
    const [assets, total] = await Promise.all([
      MediaAsset.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      MediaAsset.countDocuments(filter),
    ]);
    return successResponse(res, { assets, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse(res, 'Unable to load media assets', 500);
  }
};

const uploadAsset = async (req, res) => {
  if (!req.file) return errorResponse(res, 'Choose an image file', 400);
  const { altText = '', sourceUrl = '', sourceProvider = 'User upload', licenseReference = '', attribution = '', usage = 'other' } = req.body || {};
  if (!['product', 'category', 'homepage', 'content', 'other'].includes(usage)) return errorResponse(res, 'Invalid media usage', 400);
  const signatures = [
    ['image/jpeg', (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
    ['image/png', (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))],
    ['image/webp', (b) => b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'],
  ];
  if (!signatures.some(([mime, check]) => mime === req.file.mimetype && check(req.file.buffer))) return errorResponse(res, 'Image content does not match its declared file type', 400);
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: `kings-tea/${usage}`, allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], transformation: [{ width: 1800, height: 1800, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }] }, (error, uploaded) => error ? reject(error) : resolve(uploaded));
      stream.end(req.file.buffer);
    });
    const asset = await MediaAsset.create({ url: result.secure_url, publicId: result.public_id, sourceUrl, sourceProvider, licenseReference, attribution, altText: String(altText).slice(0, 300), width: result.width, height: result.height, mimeType: `image/${result.format}`, bytes: result.bytes, format: result.format, usage });
    return successResponse(res, asset, 'Image uploaded to durable media storage', 201);
  } catch {
    return errorResponse(res, 'Image upload failed. Check Cloudinary configuration and retry.', 503);
  }
};

const updateAsset = async (req, res) => {
  const allowed = ['altText', 'sourceUrl', 'sourceProvider', 'licenseReference', 'attribution', 'usage'];
  const update = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  try {
    const asset = await MediaAsset.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    if (!asset) return errorResponse(res, 'Media asset not found', 404);
    return successResponse(res, asset, 'Media metadata updated');
  } catch (error) {
    return errorResponse(res, error.name === 'ValidationError' ? error.message : 'Unable to update media asset', error.name === 'ValidationError' ? 400 : 500);
  }
};

const deleteAsset = async (req, res) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) return errorResponse(res, 'Media asset not found', 404);
    if (asset.productIds.length || asset.categoryIds.length || asset.contentKeys.length) return errorResponse(res, 'Remove this asset from its content before deleting it', 409);
    if (asset.provider === 'cloudinary') await cloudinary.uploader.destroy(asset.publicId);
    await asset.deleteOne();
    return successResponse(res, null, 'Media asset deleted');
  } catch {
    return errorResponse(res, 'Unable to delete media asset', 500);
  }
};

module.exports = { listAssets, uploadAsset, updateAsset, deleteAsset };
