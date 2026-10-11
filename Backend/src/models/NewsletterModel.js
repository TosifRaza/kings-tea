const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  marketingConsentAt: { type: Date, required: true, default: Date.now },
  unsubscribeTokenHash: { type: String, select: false, default: null },
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
