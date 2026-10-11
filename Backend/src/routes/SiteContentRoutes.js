const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
const { publicHomepage, adminHomepage, updateHomepage, publicContent, listAdminContent, adminContent, saveContent } = require('../controllers/SiteContentController');

const router = express.Router();
router.get('/homepage', publicHomepage);
router.get('/public/:key', publicContent);
router.get('/admin', protect, authorize('super_admin', 'admin'), listAdminContent);
router.get('/admin/homepage', protect, authorize('super_admin', 'admin'), adminHomepage);
router.put('/admin/homepage', protect, authorize('super_admin', 'admin'), [body('content').isObject(), body('published').optional().isBoolean()], updateHomepage);
router.get('/admin/:key', protect, authorize('super_admin', 'admin'), adminContent);
router.put('/admin/:key', protect, authorize('super_admin', 'admin'), [body('content').isObject(), body('published').optional().isBoolean()], saveContent);
module.exports = router;
