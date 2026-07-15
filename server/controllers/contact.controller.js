import Contact from '../models/Contact.js';

/**
 * @desc    Submit a contact inquiry (Public)
 * @route   POST /api/contact
 * @access  Public
 */
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Validation checks
    if (!name || !email || !subject || !message) {
      res.status(400);
      return next(new Error('Please provide name, email, subject, and message'));
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      res.status(400);
      return next(new Error('Input fields cannot be empty spaces'));
    }

    // 2. Spam Prevention: block duplicate submissions from same email + subject + message within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingSpam = await Contact.findOne({
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      createdAt: { $gte: fiveMinutesAgo },
    });

    if (existingSpam) {
      res.status(400);
      return next(
        new Error('You have already submitted a message with the same subject and content recently. Please wait a few minutes.')
      );
    }

    // 3. Save Inquiry
    const newInquiry = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: phone ? phone.trim() : '',
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiry: newInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries with filters, pagination, and dashboard metadata (Admin only)
 * @route   GET /api/contact
 * @access  Private (Admin/Superadmin)
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sort, includeDeleted } = req.query;

    const query = {};

    // 1. Soft-delete filter
    if (includeDeleted === 'true') {
      // Include deleted inquiries
    } else {
      query.isDeleted = false;
    }

    // 2. Status filter
    if (status) {
      query.status = status;
    }

    // 3. Search parameters
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
      ];
    }

    // 4. Sorting query
    let sortQuery = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    // 5. Pagination calculation
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // 6. DB Execution
    const totalMessages = await Contact.countDocuments(query);
    const messages = await Contact.find(query)
      .populate('repliedBy', 'fullName email')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalMessages / limitNum);

    // 7. Retrieve Dashboard Metadata (counts for non-deleted inquiries)
    const unreadCount = await Contact.countDocuments({ status: 'unread', isDeleted: false });
    const readCount = await Contact.countDocuments({ status: 'read', isDeleted: false });
    const archivedCount = await Contact.countDocuments({ status: 'archived', isDeleted: false });

    res.status(200).json({
      success: true,
      totalMessages,
      currentPage: pageNum,
      totalPages,
      unreadCount,
      readCount,
      archivedCount,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single inquiry detail (Admin only)
 * @route   GET /api/contact/:id
 * @access  Private (Admin/Superadmin)
 */
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { includeDeleted } = req.query;

    const query = { _id: id };
    if (includeDeleted !== 'true') {
      query.isDeleted = false;
    }

    const message = await Contact.findOne(query).populate('repliedBy', 'fullName email');
    if (!message) {
      res.status(404);
      return next(new Error('Inquiry message not found'));
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark inquiry as read (Admin only)
 * @route   PATCH /api/contact/:id/read
 * @access  Private (Admin/Superadmin)
 */
export const markContactAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOne({ _id: id, isDeleted: false });
    if (!message) {
      res.status(404);
      return next(new Error('Inquiry message not found'));
    }

    message.status = 'read';
    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry marked as read successfully',
      inquiry: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Archive contact inquiry (Admin only)
 * @route   PATCH /api/contact/:id/archive
 * @access  Private (Admin/Superadmin)
 */
export const archiveContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOne({ _id: id, isDeleted: false });
    if (!message) {
      res.status(404);
      return next(new Error('Inquiry message not found'));
    }

    message.status = 'archived';
    message.isArchived = true;
    message.isRead = true; // Automatically mark read when archived
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry archived successfully',
      inquiry: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete contact inquiry (Admin only)
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin/Superadmin)
 */
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOne({ _id: id, isDeleted: false });
    if (!message) {
      res.status(404);
      return next(new Error('Inquiry message not found'));
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry soft-deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
