const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const Review = require('../models/ReviewModel');
const ContactMessage = require('../models/ContactMessageModel');
const Newsletter = require('../models/NewsletterModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    const totalSubscribers = await Newsletter.countDocuments({ active: true });

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleCounts = {
      super_admin: 0,
      admin: 0,
      manager: 0,
      customer: 0
    };
    usersByRole.forEach(item => {
      roleCounts[item._id] = item.count;
    });

    const unreadMessages = await ContactMessage.countDocuments({ read: false });

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalReviews,
      totalSubscribers,
      totalRevenue,
      unreadMessages,
      ordersByStatus: statusCounts,
      usersByRole: roleCounts,
      recentOrders
    };

    return successResponse(res, stats, 'Dashboard stats fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch dashboard stats', 500);
  }
};

module.exports = {
  getDashboardStats
};
