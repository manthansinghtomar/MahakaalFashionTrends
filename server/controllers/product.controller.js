import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Generate a unique slug for a product based on its name.
 */
const generateUniqueSlug = async (name, currentProductId = null) => {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (currentProductId) {
      query._id = { $ne: currentProductId };
    }
    const exists = await Product.findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

/**
 * @desc    Create a product (Admin only)
 * @route   POST /api/products
 * @access  Private (Admin/Superadmin)
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      description,
      brand,
      category,
      price,
      originalPrice,
      images,
      sizes,
      colors,
      material,
      fit,
      fabric,
      careInstructions,
      tags,
      stock,
      featured,
      newArrival,
      bestSeller,
    } = req.body;

    // 1. Validations
    if (!name || !sku || !category || price === undefined || !images) {
      res.status(400);
      return next(new Error('Please provide name, sku, category, price, and images'));
    }

    if (price < 0) {
      res.status(400);
      return next(new Error('Price cannot be negative'));
    }

    if (originalPrice !== undefined && originalPrice < 0) {
      res.status(400);
      return next(new Error('Original price cannot be negative'));
    }

    if (stock !== undefined && stock < 0) {
      res.status(400);
      return next(new Error('Stock cannot be negative'));
    }

    if (!Array.isArray(images) || images.length === 0) {
      res.status(400);
      return next(new Error('Product must have at least one image'));
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      return next(new Error('Invalid category ID'));
    }

    // Check unique SKU
    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      res.status(400);
      return next(new Error(`A product with SKU ${sku.toUpperCase()} already exists`));
    }

    // 2. Slug Generation
    const slug = await generateUniqueSlug(name);

    // 3. Create Product
    const newProduct = await Product.create({
      name,
      slug,
      sku: sku.toUpperCase(),
      description,
      brand,
      category,
      price,
      originalPrice,
      images,
      sizes,
      colors,
      material,
      fit,
      fabric,
      careInstructions,
      tags,
      stock,
      featured,
      newArrival,
      bestSeller,
    });

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private (Admin/Superadmin)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    // Validate price and stock ranges
    if (updateData.price !== undefined && updateData.price < 0) {
      res.status(400);
      return next(new Error('Price cannot be negative'));
    }

    if (updateData.originalPrice !== undefined && updateData.originalPrice < 0) {
      res.status(400);
      return next(new Error('Original price cannot be negative'));
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      res.status(400);
      return next(new Error('Stock cannot be negative'));
    }

    if (updateData.images !== undefined && (!Array.isArray(updateData.images) || updateData.images.length === 0)) {
      res.status(400);
      return next(new Error('Product must have at least one image'));
    }

    // Validate SKU uniqueness if updated
    if (updateData.sku) {
      const formattedSku = updateData.sku.toUpperCase();
      const skuExists = await Product.findOne({ sku: formattedSku, _id: { $ne: id } });
      if (skuExists) {
        res.status(400);
        return next(new Error(`A product with SKU ${formattedSku} already exists`));
      }
      updateData.sku = formattedSku;
    }

    // Validate category if updated
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        res.status(400);
        return next(new Error('Invalid category ID'));
      }
    }

    // Slug generation only on name change (slug is kept stable otherwise)
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = await generateUniqueSlug(updateData.name, id);
    }

    // Image diffing: delete removed images from Cloudinary
    if (updateData.images) {
      const existingPublicIds = product.images.map((img) => img.public_id);
      const newPublicIds = new Set(updateData.images.map((img) => img.public_id));

      const removedPublicIds = existingPublicIds.filter((pid) => !newPublicIds.has(pid));

      if (removedPublicIds.length > 0) {
        const destroyPromises = removedPublicIds.map((pid) =>
          cloudinary.uploader.destroy(pid)
        );
        await Promise.allSettled(destroyPromises);
      }
    }

    // Apply updates and calculate discount percentage via pre-save (re-save)
    Object.assign(product, updateData);
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft Delete Product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private (Admin/Superadmin)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    product.isActive = false;
    product.status = 'inactive';
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore Soft Deleted Product (Admin only)
 * @route   PATCH /api/products/:id/restore
 * @access  Private (Admin/Superadmin)
 */
export const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    product.isActive = true;
    product.status = 'active';
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product restored successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products with filters, sorting, and pagination
 * @route   GET /api/products
 * @access  Public / Private
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      sizes,
      colors,
      featured,
      newArrival,
      bestSeller,
      sort,
      page = 1,
      limit = 10,
      includeInactive,
    } = req.query;

    const query = {};

    // 1. Soft-delete handling: default to active products only
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    if (isAdmin && includeInactive === 'true') {
      // Allow admin to see inactive products
    } else {
      query.isActive = true;
    }

    // 2. Search (partial and case-insensitive across name, brand, description)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ];
    }

    // 3. Category Filter (supports Category ID or lookup by slug)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // Return empty results if category slug does not exist
          return res.status(200).json({
            success: true,
            totalProducts: 0,
            currentPage: Number(page),
            totalPages: 0,
            products: [],
          });
        }
      }
    }

    // 4. Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // 5. Brand filter (supports comma-separated string)
    if (brand) {
      const brandList = brand.split(',').map((b) => b.trim());
      query.brand = { $in: brandList };
    }

    // 6. Sizes filter (supports comma-separated string)
    if (sizes) {
      const sizesList = sizes.split(',').map((s) => s.trim());
      query.sizes = { $in: sizesList };
    }

    // 7. Colors filter (supports comma-separated string)
    if (colors) {
      const colorsList = colors.split(',').map((c) => c.trim());
      query.colors = { $in: colorsList };
    }

    // 8. Boolean attributes filters
    if (featured === 'true') query.featured = true;
    if (newArrival === 'true') query.newArrival = true;
    if (bestSeller === 'true') query.bestSeller = true;

    // 9. Sorting
    let sortQuery = { createdAt: -1 }; // default newest first
    if (sort) {
      if (sort === 'oldest') sortQuery = { createdAt: 1 };
      else if (sort === 'price-low-high') sortQuery = { price: 1 };
      else if (sort === 'price-high-low') sortQuery = { price: -1 };
      else if (sort === 'rating') sortQuery = { rating: -1 };
    }

    // 10. Pagination parameters
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // 11. Database Execution
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: pageNum,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by slug (Public)
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true }).populate('category', 'name slug');
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    // Query reviews linked to this product and populate reviewer user details
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent approved product reviews (Public)
 * @route   GET /api/products/reviews/recent
 * @access  Public
 */
export const getRecentReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const reviews = await Review.find()
      .populate('user', 'fullName profileImage')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

