import Category from '../models/Category.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Generate a unique slug for a category based on its name.
 */
const generateUniqueSlug = async (name, currentCategoryId = null) => {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (currentCategoryId) {
      query._id = { $ne: currentCategoryId };
    }
    const exists = await Category.findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

/**
 * @desc    Create a category (Admin only)
 * @route   POST /api/categories
 * @access  Private (Admin/Superadmin)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, image, description, displayOrder, parent } = req.body;

    // 1. Validation
    if (!name || !image) {
      res.status(400);
      return next(new Error('Please provide name and image details'));
    }

    if (!image.public_id || !image.url) {
      res.status(400);
      return next(new Error('Image object must contain public_id and url'));
    }

    // Check duplicate name
    const nameExists = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (nameExists) {
      res.status(400);
      return next(new Error('Category name already exists'));
    }

    // Check parent exists if provided
    if (parent) {
      const parentExists = await Category.findById(parent);
      if (!parentExists) {
        res.status(400);
        return next(new Error('Parent category not found'));
      }
    }

    // 2. Slug Generation
    const slug = await generateUniqueSlug(name);

    // 3. Create Category
    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      image,
      description,
      displayOrder,
      parent: parent || null,
    });

    res.status(201).json({
      success: true,
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a category (Admin only)
 * @route   PUT /api/categories/:id
 * @access  Private (Admin/Superadmin)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    // Check name duplication if name is changing
    if (updateData.name && updateData.name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const nameExists = await Category.findOne({
        name: { $regex: new RegExp(`^${updateData.name.trim()}$`, 'i') },
        _id: { $ne: id },
      });
      if (nameExists) {
        res.status(400);
        return next(new Error('Category name already exists'));
      }
      updateData.name = updateData.name.trim();
      // Slug is kept stable unless name changes
      updateData.slug = await generateUniqueSlug(updateData.name, id);
    }

    // Check parent if provided
    if (updateData.parent) {
      if (updateData.parent === id) {
        res.status(400);
        return next(new Error('A category cannot be its own parent'));
      }
      const parentExists = await Category.findById(updateData.parent);
      if (!parentExists) {
        res.status(400);
        return next(new Error('Parent category not found'));
      }
    }

    // Image diffing: delete old image from Cloudinary if image changes
    if (updateData.image && updateData.image.public_id !== category.image.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (err) {
        console.error(`Failed to delete old category image ${category.image.public_id} from Cloudinary:`, err);
      }
    }

    // Apply updates
    Object.assign(category, updateData);
    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft Delete Category (Admin only)
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin/Superadmin)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    // 1. Dependency check: check if any active products are assigned to this category
    const activeProductsExist = await Product.findOne({ category: id, isActive: true });
    if (activeProductsExist) {
      res.status(400);
      return next(new Error('This category cannot be deleted because it is assigned to existing products.'));
    }

    // 2. Perform soft-delete
    category.isActive = false;
    category.status = 'inactive';
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category soft-deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore Soft Deleted Category (Admin only)
 * @route   PATCH /api/categories/:id/restore
 * @access  Private (Admin/Superadmin)
 */
export const restoreCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    category.isActive = true;
    category.status = 'active';
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category restored successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all categories with pagination and sorting
 * @route   GET /api/categories
 * @access  Public / Private
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, includeInactive } = req.query;

    const query = {};

    // 1. Admin optional protect check: default view only shows active categories
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    if (isAdmin && includeInactive === 'true') {
      // Allow admin to view inactive categories
    } else {
      query.isActive = true;
    }

    // 2. Pagination calculation
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // 3. Database Execution: Sort categories by displayOrder (ascending) then name (ascending)
    const totalCategories = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalCategories / limitNum);

    res.status(200).json({
      success: true,
      totalCategories,
      currentPage: pageNum,
      totalPages,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by slug (Public)
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true }).populate('parent', 'name slug');
    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};
