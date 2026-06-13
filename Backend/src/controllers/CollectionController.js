const Collection = require('../models/CollectionModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

// @desc    Get all collections
// @route   GET /api/collections
const getCollections = async (req, res) => {
  try {
    const { featured, active } = req.query;
    let filter = {};

    if (featured === 'true') filter.featured = true;
    if (active === 'false') {
      // allow inactive only for admin
    } else {
      filter.isActive = true;
    }

    const collections = await Collection.find(filter).sort({ sortOrder: 1, createdAt: 1 });

    successResponse(res, 'Collections fetched successfully', { collections });
  } catch (error) {
    errorResponse(res, 'Error fetching collections', 500, error.message);
  }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return errorResponse(res, 'Collection not found', 404);
    }

    successResponse(res, 'Collection fetched successfully', { collection });
  } catch (error) {
    errorResponse(res, 'Error fetching collection', 500, error.message);
  }
};

// @desc    Create collection
// @route   POST /api/collections
const createCollection = async (req, res) => {
  try {
    const { name, description, gradientColor, image, featured, sortOrder, isActive } = req.body;

    // Auto-generate slug from name
    let slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const collection = await Collection.create({
      name,
      slug,
      description,
      gradientColor,
      image,
      featured: featured || false,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    successResponse(res, 'Collection created successfully', { collection }, 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Collection with this name or slug already exists', 400);
    }
    errorResponse(res, 'Error creating collection', 500, error.message);
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
const updateCollection = async (req, res) => {
  try {
    const { name, description, gradientColor, image, featured, sortOrder, isActive } = req.body;

    // Auto-generate slug from name if name is being updated
    if (name && !req.body.slug) {
      req.body.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!collection) {
      return errorResponse(res, 'Collection not found', 404);
    }

    successResponse(res, 'Collection updated successfully', { collection });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Collection with this name or slug already exists', 400);
    }
    errorResponse(res, 'Error updating collection', 500, error.message);
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return errorResponse(res, 'Collection not found', 404);
    }

    successResponse(res, 'Collection deleted successfully');
  } catch (error) {
    errorResponse(res, 'Error deleting collection', 500, error.message);
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
