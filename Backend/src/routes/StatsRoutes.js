const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/StatsController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/', protect, authorize('super_admin', 'admin', 'manager'), getDashboardStats);

module.exports = router;
