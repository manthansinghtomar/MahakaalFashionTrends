import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Offer from '../models/Offer.js';
import Contact from '../models/Contact.js';

/**
 * Calculates percentage growth of creations this month compared to last month.
 */
const getMonthlyGrowth = async (Model, filter = {}) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [currentMonthCreations, previousMonthCreations] = await Promise.all([
    Model.countDocuments({ ...filter, createdAt: { $gte: startOfCurrentMonth } }),
    Model.countDocuments({ ...filter, createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } }),
  ]);

  if (previousMonthCreations === 0) {
    return currentMonthCreations > 0 ? '+100%' : '+0%';
  }
  const percent = ((currentMonthCreations - previousMonthCreations) / previousMonthCreations) * 100;
  return percent >= 0 ? `+${Math.round(percent)}%` : `${Math.round(percent)}%`;
};

/**
 * Standard aggregation pipeline to group document creations by month over the past 12 months.
 */
const getMonthlyPipeline = () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  return [
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ];
};

/**
 * @desc    Get dashboard summary statistics and latest items (Admin only)
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin/Superadmin)
 */
export const getDashboardOverview = async (req, res, next) => {
  try {
    const now = new Date();

    // Run count queries, growth queries, and latest fetches in parallel
    const [
      // Counts
      totalProducts,
      activeProducts,
      inactiveProducts,
      productGrowth,

      totalCategories,
      activeCategories,
      inactiveCategories,
      categoryGrowth,

      totalOffers,
      activeOffers,
      inactiveOffers,
      runningOffers,
      upcomingOffers,
      expiredOffers,
      offerGrowth,

      totalMessages,
      unreadMessages,
      readMessages,
      archivedMessages,
      messageGrowth,

      // Latest items
      latestProducts,
      latestContacts,
      latestOffers,
    ] = await Promise.all([
      // Product statistics
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Product.countDocuments({ isActive: true, isDeleted: { $ne: true } }),
      Product.countDocuments({ isActive: false, isDeleted: { $ne: true } }),
      getMonthlyGrowth(Product, { isDeleted: { $ne: true } }),

      // Category statistics
      Category.countDocuments(),
      Category.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: false }),
      getMonthlyGrowth(Category),

      // Offer statistics
      Offer.countDocuments(),
      Offer.countDocuments({ isActive: true, status: 'active' }),
      Offer.countDocuments({ $or: [{ isActive: false }, { status: 'inactive' }] }),
      Offer.countDocuments({ isActive: true, status: 'active', startDate: { $lte: now }, endDate: { $gte: now } }),
      Offer.countDocuments({ isActive: true, status: 'active', startDate: { $gt: now } }),
      Offer.countDocuments({ isActive: true, status: 'active', endDate: { $lt: now } }),
      getMonthlyGrowth(Offer),

      // Contact statistics
      Contact.countDocuments({ isDeleted: false }),
      Contact.countDocuments({ status: 'unread', isDeleted: false }),
      Contact.countDocuments({ status: 'read', isDeleted: false }),
      Contact.countDocuments({ status: 'archived', isDeleted: false }),
      getMonthlyGrowth(Contact, { isDeleted: false }),

      // Latest lists
      Product.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name sku price category stock isActive createdAt')
        .populate('category', 'name slug')
        .lean(),
      Contact.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject status createdAt')
        .lean(),
      Offer.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title discountPercentage startDate endDate status isActive createdAt')
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: {
          totalProducts,
          activeProducts,
          inactiveProducts,
          productGrowth,
          latest: latestProducts,
        },
        categories: {
          totalCategories,
          activeCategories,
          inactiveCategories,
          categoryGrowth,
        },
        offers: {
          totalOffers,
          activeOffers,
          inactiveOffers,
          runningOffers,
          upcomingOffers,
          expiredOffers,
          offerGrowth,
          latest: latestOffers,
        },
        messages: {
          totalMessages,
          unreadMessages,
          readMessages,
          archivedMessages,
          messageGrowth,
          latest: latestContacts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly metrics and overall totals (Admin only)
 * @route   GET /api/admin/analytics
 * @access  Private (Admin/Superadmin)
 */
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      // Overall totals
      totalProducts,
      totalCategories,
      totalOffers,
      totalMessages,

      // Monthly arrays
      productsMonthly,
      categoriesMonthly,
      offersMonthly,
      messagesMonthly,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Offer.countDocuments(),
      Contact.countDocuments({ isDeleted: false }),

      Product.aggregate(getMonthlyPipeline()),
      Category.aggregate(getMonthlyPipeline()),
      Offer.aggregate(getMonthlyPipeline()),
      Contact.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        ...getMonthlyPipeline(),
      ]),
    ]);

    res.status(200).json({
      success: true,
      totals: {
        totalProducts,
        totalCategories,
        totalOffers,
        totalMessages,
      },
      monthlyAnalytics: {
        products: productsMonthly,
        categories: categoriesMonthly,
        offers: offersMonthly,
        messages: messagesMonthly,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent activity stream across all modules (Admin only)
 * @route   GET /api/admin/activity
 * @access  Private (Admin/Superadmin)
 */
export const getRecentActivity = async (req, res, next) => {
  try {
    const [products, categories, offers, messages] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).limit(5).select('name createdAt').lean(),
      Category.find().sort({ createdAt: -1 }).limit(5).select('name createdAt').lean(),
      Offer.find().sort({ createdAt: -1 }).limit(5).select('title createdAt').lean(),
      Contact.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select('name subject createdAt').lean(),
    ]);

    // Format lists to timeline objects
    const activities = [
      ...products.map((p) => ({
        type: 'product',
        title: 'Product Created',
        description: `Product "${p.name}" was added to catalog.`,
        createdAt: p.createdAt,
        module: 'Products',
      })),
      ...categories.map((c) => ({
        type: 'category',
        title: 'Category Created',
        description: `Category "${c.name}" was created.`,
        createdAt: c.createdAt,
        module: 'Categories',
      })),
      ...offers.map((o) => ({
        type: 'offer',
        title: 'Offer Created',
        description: `Promotional banner campaign "${o.title}" was launched.`,
        createdAt: o.createdAt,
        module: 'Offers',
      })),
      ...messages.map((m) => ({
        type: 'contact',
        title: 'Contact Inquiry Received',
        description: `Customer message received from "${m.name}" regarding "${m.subject}".`,
        createdAt: m.createdAt,
        module: 'Contacts',
      })),
    ];

    // Sort timeline newest first
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      activities: activities.slice(0, 15),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick global search across catalog and contact inquiries (Admin only)
 * @route   GET /api/admin/search
 * @access  Private (Admin/Superadmin)
 */
export const getQuickSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400);
      return next(new Error('Please provide a search query parameter "q"'));
    }

    const searchRegex = new RegExp(q, 'i');

    const [
      productsItems,
      productsCount,
      categoriesItems,
      categoriesCount,
      offersItems,
      offersCount,
      messagesItems,
      messagesCount,
    ] = await Promise.all([
      // Products
      Product.find({ $or: [{ name: searchRegex }, { brand: searchRegex }, { sku: searchRegex }] })
        .limit(5)
        .select('name sku price brand')
        .lean(),
      Product.countDocuments({ $or: [{ name: searchRegex }, { brand: searchRegex }, { sku: searchRegex }] }),

      // Categories
      Category.find({ name: searchRegex }).limit(5).select('name slug').lean(),
      Category.countDocuments({ name: searchRegex }),

      // Offers
      Offer.find({ title: searchRegex }).limit(5).select('title discountPercentage').lean(),
      Offer.countDocuments({ title: searchRegex }),

      // Contact messages
      Contact.find({ isDeleted: false, $or: [{ name: searchRegex }, { email: searchRegex }, { subject: searchRegex }] })
        .limit(5)
        .select('name email subject')
        .lean(),
      Contact.countDocuments({
        isDeleted: false,
        $or: [{ name: searchRegex }, { email: searchRegex }, { subject: searchRegex }],
      }),
    ]);

    res.status(200).json({
      success: true,
      results: {
        products: {
          count: productsCount,
          items: productsItems,
        },
        categories: {
          count: categoriesCount,
          items: categoriesItems,
        },
        offers: {
          count: offersCount,
          items: offersItems,
        },
        contacts: {
          count: messagesCount,
          items: messagesItems,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Node server state and DB performance stats (Admin only)
 * @route   GET /api/admin/system
 * @access  Private (Admin/Superadmin)
 */
export const getSystemHealth = async (req, res, next) => {
  try {
    const readyStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const readyState = mongoose.connection.readyState;
    const dbStatus = readyStateMap[readyState] || 'unknown';

    let mongoVersion = 'unknown';
    if (readyState === 1) {
      try {
        const adminDb = mongoose.connection.db.admin();
        const serverInfo = await adminDb.serverInfo();
        mongoVersion = serverInfo.version;
      } catch (err) {
        console.error('Failed to retrieve MongoDB version:', err);
      }
    }

    res.status(200).json({
      success: true,
      health: {
        serverStatus: 'running',
        databaseStatus: dbStatus,
        nodeVersion: process.version,
        mongodbVersion: mongoVersion,
        memoryUsage: process.memoryUsage(),
        processUptime: process.uptime(),
        apiVersion: '1.0.0',
        currentTime: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
    });
  } catch (error) {
    next(error);
  }
};
