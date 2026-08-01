import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Computes dynamic status of an offer based on current date.
 */
const computeOfferStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'expired';
  return 'active';
};

/**
 * @desc    Create a new offer (Admin only)
 * @route   POST /api/offers
 * @access  Private (Admin/Superadmin)
 */
export const createOffer = async (req, res, next) => {
  try {
    const { title, description, product, bannerImage, discountPercentage, startDate, endDate } = req.body;

    // 1. Validation
    if (!title || !description || !bannerImage || discountPercentage === undefined || !startDate || !endDate) {
      res.status(400);
      return next(new Error('Please provide title, description, bannerImage, discountPercentage, startDate, and endDate'));
    }

    if (!product) {
      res.status(400);
      return next(new Error('Please select a product.'));
    }

    const existingProduct = await Product.findOne({ _id: product, isDeleted: false });
    if (!existingProduct) {
      res.status(400);
      return next(new Error('Ye product Products me nahi hai. Pehle isko Products me add karo, phir Offer create karo.'));
    }

    if (!bannerImage.public_id || !bannerImage.url) {
      res.status(400);
      return next(new Error('bannerImage must contain public_id and url'));
    }

    const discountNum = Number(discountPercentage);
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      res.status(400);
      return next(new Error('Discount percentage must be between 1 and 100'));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      res.status(400);
      return next(new Error('End date must be on or after start date'));
    }

    // Create Offer
    const newOffer = await Offer.create({
      title,
      description,
      product,
      bannerImage,
      discountPercentage: discountNum,
      startDate: start,
      endDate: end,
    });

    res.status(201).json({
      success: true,
      offer: newOffer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an offer (Admin only)
 * @route   PUT /api/offers/:id
 * @access  Private (Admin/Superadmin)
 */
export const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const offer = await Offer.findById(id);
    if (!offer) {
      res.status(404);
      return next(new Error('Offer not found'));
    }

    // Validate product if updated
    if (updateData.product !== undefined) {
      if (!updateData.product) {
        res.status(400);
        return next(new Error('Please select a product.'));
      }
      const existingProduct = await Product.findOne({ _id: updateData.product, isDeleted: false });
      if (!existingProduct) {
        res.status(400);
        return next(new Error('Ye product Products me nahi hai. Pehle isko Products me add karo, phir Offer create karo.'));
      }
    }

    // Validate range if updated
    if (updateData.discountPercentage !== undefined) {
      const discountNum = Number(updateData.discountPercentage);
      if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
        res.status(400);
        return next(new Error('Discount percentage must be between 1 and 100'));
      }
      updateData.discountPercentage = discountNum;
    }

    // Validate dates if updated
    const start = updateData.startDate ? new Date(updateData.startDate) : offer.startDate;
    const end = updateData.endDate ? new Date(updateData.endDate) : offer.endDate;

    if (start > end) {
      res.status(400);
      return next(new Error('End date must be on or after start date'));
    }

    // Banner image cleanup on change
    if (updateData.bannerImage && updateData.bannerImage.public_id !== offer.bannerImage.public_id) {
      try {
        await cloudinary.uploader.destroy(offer.bannerImage.public_id);
      } catch (err) {
        console.error(`Failed to delete old banner image ${offer.bannerImage.public_id} from Cloudinary:`, err);
      }
    }

    // Apply updates
    delete updateData.status; // Prevent manual status override from body
    Object.assign(offer, updateData);
    const updatedOffer = await offer.save();

    res.status(200).json({
      success: true,
      offer: updatedOffer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft Delete Offer (Admin only)
 * @route   DELETE /api/offers/:id
 * @access  Private (Admin/Superadmin)
 */
export const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) {
      res.status(404);
      return next(new Error('Offer not found'));
    }

    offer.isActive = false;
    offer.isDeleted = true;
    offer.deletedAt = new Date();
    await offer.save();

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
      offer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanent Delete Offer (Admin only)
 * @route   DELETE /api/offers/:id/permanent
 * @access  Private (Admin/Superadmin)
 */
export const permanentDeleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) {
      res.status(404);
      return next(new Error('Offer not found'));
    }

    // Banner image cleanup on delete
    if (offer.bannerImage && offer.bannerImage.public_id && !offer.bannerImage.public_id.startsWith('local_')) {
      try {
        await cloudinary.uploader.destroy(offer.bannerImage.public_id);
      } catch (err) {
        console.error(`Failed to delete offer banner image ${offer.bannerImage.public_id} from Cloudinary:`, err);
      }
    }

    // Permanently remove offer from database
    await Offer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Offer permanently deleted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore Soft Deleted Offer (Admin only)
 * @route   PATCH /api/offers/:id/restore
 * @access  Private (Admin/Superadmin)
 */
export const restoreOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) {
      res.status(404);
      return next(new Error('Offer not found'));
    }

    offer.isActive = true;
    offer.isDeleted = false;
    offer.deletedAt = null;
    await offer.save();

    res.status(200).json({
      success: true,
      message: 'Offer restored successfully',
      offer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get soft-deleted offers list (Admin only)
 * @route   GET /api/offers/deleted/list
 * @access  Private (Admin/Superadmin)
 */
export const getDeletedOffers = async (req, res, next) => {
  try {
    const rawOffers = await Offer.find({ isDeleted: true })
      .populate('product', 'name slug price originalPrice images discountPercentage category')
      .sort({ deletedAt: -1, updatedAt: -1 });

    const offers = rawOffers.map((off) => {
      const obj = off.toObject();
      obj.status = computeOfferStatus(obj.startDate, obj.endDate);
      return obj;
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all offers with sorting and pagination
 * @route   GET /api/offers
 * @access  Public / Private
 */
export const getAllOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, includeInactive } = req.query;

    const query = { isDeleted: { $ne: true } };

    // 1. Admin optional protect check
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    if (isAdmin && includeInactive === 'true') {
      // Admin sees all non-deleted active documents
      delete query.isActive;
    } else {
      query.isActive = true;
      const currentDate = new Date();
      query.startDate = { $lte: currentDate };
      query.endDate = { $gte: currentDate };
    }

    // 2. Pagination calculation
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // 3. Sorting query
    let sortQuery = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'oldest') sortQuery = { createdAt: 1 };
      else if (sort === 'discount-high-low') sortQuery = { discountPercentage: -1 };
      else if (sort === 'discount-low-high') sortQuery = { discountPercentage: 1 };
    }

    // 4. Database execution
    const totalOffers = await Offer.countDocuments(query);
    const rawOffers = await Offer.find(query)
      .populate('product', 'name slug price originalPrice images discountPercentage category')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    // Dynamic status computation for every offer object returned
    const offers = rawOffers.map((off) => {
      const obj = off.toObject();
      obj.status = computeOfferStatus(obj.startDate, obj.endDate);
      return obj;
    });

    const totalPages = Math.ceil(totalOffers / limitNum);

    res.status(200).json({
      success: true,
      totalOffers,
      currentPage: pageNum,
      totalPages,
      offers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single offer by ID
 * @route   GET /api/offers/:id
 * @access  Public
 */
export const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id).populate('product', 'name slug price originalPrice images discountPercentage category');
    if (!offer) {
      res.status(404);
      return next(new Error('Offer not found'));
    }

    const computedStatus = computeOfferStatus(offer.startDate, offer.endDate);

    // Verify access if public user
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    if (!isAdmin) {
      const currentDate = new Date();
      const isValidDate = offer.startDate <= currentDate && offer.endDate >= currentDate;
      if (!offer.isActive || computedStatus !== 'active' || !isValidDate) {
        res.status(404);
        return next(new Error('Offer not found or has expired'));
      }
    }

    const offerObj = offer.toObject();
    offerObj.status = computedStatus;

    res.status(200).json({
      success: true,
      offer: offerObj,
    });
  } catch (error) {
    next(error);
  }
};
