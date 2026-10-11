const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, immutable: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  published: { type: Boolean, default: false },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true, minimize: false });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
