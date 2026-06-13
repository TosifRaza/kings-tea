const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/CollectionController');

// Public routes
router.get('/', getCollections);
router.get('/:id', getCollectionById);

// Protected admin routes
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);

module.exports = router;
