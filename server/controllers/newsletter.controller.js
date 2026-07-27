import Newsletter from '../models/Newsletter.js';

// Email validation regex pattern
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/**
 * @desc    Public email subscription
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
export const subscribe = async (req, res, next) => {
  try {
    const rawEmail = req.body?.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
    }

    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Check if email is already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      });
    }

    // Save subscriber
    const newSubscriber = await Newsletter.create({
      email,
      subscribedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing!',
      data: newSubscriber,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all subscribers with search, sort, and pagination
 * @route   GET /api/newsletter
 * @access  Private/Admin
 */
export const getAllSubscribers = async (req, res, next) => {
  try {
    const { search = '', sort = 'newest', page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search.trim()) {
      filter.email = { $regex: search.trim().toLowerCase(), $options: 'i' };
    }

    const sortOption = sort === 'oldest' ? { subscribedAt: 1 } : { subscribedAt: -1 };

    const [subscribers, totalSubscribers] = await Promise.all([
      Newsletter.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Newsletter.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalSubscribers / limitNum) || 1;

    return res.status(200).json({
      success: true,
      subscribers,
      totalSubscribers,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete subscriber by ID
 * @route   DELETE /api/newsletter/:id
 * @access  Private/Admin
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
