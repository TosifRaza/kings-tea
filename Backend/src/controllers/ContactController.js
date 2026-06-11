const ContactMessage = require('../models/ContactMessageModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const submitMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    return successResponse(res, contactMessage, 'Message sent successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to send message', 500);
  }
};

const listMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, read } = req.query;
    const filter = {};

    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: messages,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Messages fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch messages', 500);
  }
};

module.exports = {
  submitMessage,
  listMessages
};
