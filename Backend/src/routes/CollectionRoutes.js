const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
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
router.post('/', protect, authorize('super_admin', 'admin', 'manager'), createCollection);
router.put('/:id', protect, authorize('super_admin', 'admin', 'manager'), updateCollection);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteCollection);

module.exports = router;
