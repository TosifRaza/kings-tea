const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
const { listAssets, uploadAsset, updateAsset, deleteAsset } = require('../controllers/MediaController');

const router = express.Router();
router.use(protect, authorize('super_admin', 'admin'));
router.get('/', listAssets);
router.post('/', multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single('image'), uploadAsset);
router.patch('/:id', [body('altText').optional().isString().isLength({ max: 300 }), body('usage').optional().isIn(['product', 'category', 'homepage', 'content', 'other'])], updateAsset);
router.delete('/:id', deleteAsset);
module.exports = router;
