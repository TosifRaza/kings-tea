const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '', maxlength: 2000 },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR', uppercase: true, match: /^[A-Z]{3}$/ },
  interval: { type: String, enum: ['month', 'quarter', 'year'], required: true },
  benefits: { type: [String], default: [] },
  active: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
