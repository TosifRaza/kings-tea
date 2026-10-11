const SiteContent = require('../models/SiteContentModel');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const MediaAsset = require('../models/MediaAssetModel');

const syncContentMedia = async (key, content) => {
  const urls = new Set();
  const visit = (value) => {
    if (typeof value === 'string' && /^https:\/\/res\.cloudinary\.com\//i.test(value)) urls.add(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  visit(content);
  await MediaAsset.updateMany({ contentKeys: key }, { $pull: { contentKeys: key } });
  if (urls.size) await MediaAsset.updateMany({ url: { $in: [...urls] } }, { $addToSet: { contentKeys: key } });
};

const publicHomepage = async (_req, res) => {
  try {
    const document = await SiteContent.findOne({ key: 'homepage', published: true }).select('content updatedAt');
    return successResponse(res, document?.content || null, 'Published homepage content fetched');
  } catch {
    return errorResponse(res, 'Unable to load homepage content', 500);
  }
};

const siteContentKeys = new Set(['faq', 'policies', 'navigation', 'footer', 'brand-story', 'brewing-guides', 'store-settings']);
const contentKeyPattern = /^[a-z][a-z0-9_-]{1,49}$/;
const adminContent = async (req, res) => {
  const key = String(req.params.key || '');
  if (!siteContentKeys.has(key)) return errorResponse(res, 'Unsupported content key', 404);
  try {
    const record = await SiteContent.findOne({ key }).select('key content published updatedAt').lean();
    return successResponse(res, record || { key, content: {}, published: false }, 'Content fetched');
  } catch { return errorResponse(res, 'Unable to load content', 500); }
};
const publicContent = async (req, res) => {
  try {
    const key = String(req.params.key || '');
    if (!contentKeyPattern.test(key)) return errorResponse(res, 'Invalid content key', 400);
    const record = await SiteContent.findOne({ key, published: true }).select('content updatedAt').lean();
    return successResponse(res, record?.content ?? null, 'Published content fetched');
  } catch {
    return errorResponse(res, 'Unable to load published content', 500);
  }
};

const listAdminContent = async (_req, res) => {
  try {
    const documents = await SiteContent.find({ key: { $ne: 'homepage' } }).select('key content published updatedAt').sort({ key: 1 }).lean();
    return successResponse(res, documents);
  } catch {
    return errorResponse(res, 'Unable to load content records', 500);
  }
};

const saveContent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 'Invalid content payload', 400);
  const { key } = req.params;
  if (!siteContentKeys.has(key)) return errorResponse(res, 'Unsupported content key', 404);
  const { content, published = false } = req.body || {};
  if (!content || typeof content !== 'object' || Array.isArray(content) || JSON.stringify(content).length > 100_000) {
    return errorResponse(res, 'Content must be an object under 100 KB', 400);
  }
  try {
    const record = await SiteContent.findOneAndUpdate(
      { key },
      { $set: { content, published: published === true, updatedBy: req.user.userId } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).select('key content published updatedAt');
    await syncContentMedia(key, content);
    return successResponse(res, record, record.published ? 'Content published' : 'Draft saved');
  } catch {
    return errorResponse(res, 'Unable to save content', 500);
  }
};

const adminHomepage = async (_req, res) => {
  try {
    const document = await SiteContent.findOne({ key: 'homepage' }).select('content published updatedAt');
    return successResponse(res, document || { content: { announcement: { enabled: false, text: '', href: '' }, sections: [] }, published: false }, 'Homepage configuration fetched');
  } catch {
    return errorResponse(res, 'Unable to load homepage configuration', 500);
  }
};

const updateHomepage = async (req, res) => {
  const { content, published } = req.body || {};
  if (!content || typeof content !== 'object' || Array.isArray(content) || !Array.isArray(content.sections) || content.sections.length > 30) {
    return errorResponse(res, 'Homepage content must include a sections array (maximum 30 sections)', 400);
  }
  const keys = new Set();
  for (const section of content.sections) {
    if (!section || typeof section.key !== 'string' || !/^[a-z0-9_-]{1,50}$/i.test(section.key) || keys.has(section.key)) {
      return errorResponse(res, 'Each homepage section needs a unique, valid key', 400);
    }
    keys.add(section.key);
    if (typeof section.enabled !== 'boolean' || !Number.isFinite(Number(section.sortOrder))) {
      return errorResponse(res, 'Each homepage section needs enabled and numeric sortOrder values', 400);
    }
  }
  const encoded = JSON.stringify(content);
  if (encoded.length > 100_000) return errorResponse(res, 'Homepage content is too large', 413);
  try {
    const document = await SiteContent.findOneAndUpdate(
      { key: 'homepage' },
      { $set: { content, published: published === true, updatedBy: req.user.userId } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).select('content published updatedAt');
    await syncContentMedia('homepage', content);
    return successResponse(res, document, published ? 'Homepage content published' : 'Homepage draft saved');
  } catch {
    return errorResponse(res, 'Unable to save homepage content', 500);
  }
};

module.exports = { publicHomepage, adminHomepage, updateHomepage, publicContent, listAdminContent, adminContent, saveContent };
