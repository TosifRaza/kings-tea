const mongoose = require('mongoose');

const MediaAssetSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true, unique: true },
  provider: { type: String, enum: ['cloudinary', 'static'], default: 'cloudinary' },
  sourceUrl: { type: String, default: '' },
  sourceProvider: { type: String, default: 'User upload' },
  licenseReference: { type: String, default: '' },
  attribution: { type: String, default: '' },
  altText: { type: String, default: '', maxlength: 300 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  mimeType: { type: String, required: true },
  bytes: { type: Number, default: 0 },
  format: { type: String, default: '' },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  contentKeys: [{ type: String }],
  usage: { type: String, enum: ['product', 'category', 'homepage', 'content', 'other'], default: 'other' },
}, { timestamps: true });

MediaAssetSchema.index({ altText: 'text', publicId: 'text' });
MediaAssetSchema.index({ createdAt: -1 });
module.exports = mongoose.model('MediaAsset', MediaAssetSchema);
