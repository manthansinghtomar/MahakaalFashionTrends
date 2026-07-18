import User from '../models/User.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

/**
 * Utility to generate JWT and assign it to an HTTP-only response cookie
 */
const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days expiration
  });
};

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;

  try {
    // 1. Validation checks
    if (!fullName || !email || !password) {
      res.status(400);
      return next(new Error('Please provide fullName, email, and password'));
    }

    // 2. Check if email already registered as user or administrator
    const userExists = await User.findOne({ email });
    const adminExists = await Admin.findOne({ email });
    
    if (userExists || adminExists) {
      res.status(400);
      return next(new Error('Email is already registered'));
    }

    // 3. Create the user instance (password will be hashed in Mongoose pre-save hook)
    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
    });

    // 4. Generate token and set HTTP-only cookie
    generateTokenAndSetCookie(res, newUser._id, newUser.role);

    // 5. Response payload (omitting password credentials)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        role: newUser.role,
        isVerified: newUser.isVerified,
        isBlocked: newUser.isBlocked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login existing customer
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    // 2. Locate User
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // 3. Verify Password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // 4. Verification and Block Checks
    if (user.isBlocked) {
      res.status(403);
      return next(new Error('Your account is blocked. Please contact support'));
    }

    // 5. Generate token and cookie
    generateTokenAndSetCookie(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login administrator / superadministrator
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    // 2. Locate Admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // 3. Verify Password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // 4. Active Check
    if (!admin.isActive) {
      res.status(403);
      return next(new Error('Your administrator account is inactive'));
    }

    // 5. Generate token and cookie
    generateTokenAndSetCookie(res, admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Administrator logged in successfully',
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get profile of the currently logged-in User/Admin
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, session data missing'));
    }

    // Respond with consistent response format
    const responsePayload = {
      success: true,
      role: req.user.role,
    };

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      responsePayload.admin = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone || '',
        role: req.user.role,
        permissions: req.user.permissions,
        isActive: req.user.isActive,
      };
    } else {
      responsePayload.user = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        profileImage: req.user.profileImage,
        role: req.user.role,
        isVerified: req.user.isVerified,
        isBlocked: req.user.isBlocked,
      };
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear cookies and logout User/Admin
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated user/admin profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, session data missing'));
    }

    const { fullName, phone, email } = req.body;

    // Validation & Sanitization
    if (fullName !== undefined && (typeof fullName !== 'string' || !fullName.trim())) {
      res.status(400);
      return next(new Error('Please provide a valid full name'));
    }

    if (email !== undefined) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (typeof email !== 'string' || !emailRegex.test(email.trim().toLowerCase())) {
        res.status(400);
        return next(new Error('Please enter a valid email address'));
      }
    }

    const sanitizedFullName = fullName ? fullName.trim() : undefined;
    const sanitizedPhone = phone !== undefined ? String(phone).trim() : undefined;
    const sanitizedEmail = email ? email.trim().toLowerCase() : undefined;

    const role = req.user.role;
    const responsePayload = {
      success: true,
      message: 'Profile updated successfully',
    };

    if (role === 'admin' || role === 'superadmin') {
      const admin = await Admin.findById(req.user._id);
      if (!admin) {
        res.status(404);
        return next(new Error('Administrator account not found'));
      }

      if (sanitizedFullName) {
        admin.fullName = sanitizedFullName;
      }
      if (sanitizedPhone !== undefined) {
        admin.phone = sanitizedPhone;
      }

      // Check email uniqueness if email changed
      if (sanitizedEmail && sanitizedEmail !== admin.email) {
        const userExists = await User.findOne({ email: sanitizedEmail });
        const adminExists = await Admin.findOne({ email: sanitizedEmail });
        if (userExists || adminExists) {
          res.status(400);
          return next(new Error('Email is already registered by another account'));
        }
        admin.email = sanitizedEmail;
      }
      
      const updatedAdmin = await admin.save();

      responsePayload.admin = {
        _id: updatedAdmin._id,
        fullName: updatedAdmin.fullName,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
        permissions: updatedAdmin.permissions,
        isActive: updatedAdmin.isActive,
      };
    } else {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404);
        return next(new Error('User account not found'));
      }

      if (sanitizedFullName) {
        user.fullName = sanitizedFullName;
      }
      if (sanitizedPhone !== undefined) {
        user.phone = sanitizedPhone;
      }

      // Check email uniqueness if email changed
      if (sanitizedEmail && sanitizedEmail !== user.email) {
        const userExists = await User.findOne({ email: sanitizedEmail });
        const adminExists = await Admin.findOne({ email: sanitizedEmail });
        if (userExists || adminExists) {
          res.status(400);
          return next(new Error('Email is already registered by another account'));
        }
        user.email = sanitizedEmail;
      }

      const updatedUser = await user.save();

      responsePayload.user = {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        isBlocked: updatedUser.isBlocked,
      };
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change authenticated user/admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, session data missing'));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400);
      return next(new Error('Please provide current password, new password, and confirmation'));
    }

    if (newPassword.length < 6) {
      res.status(400);
      return next(new Error('New password must be at least 6 characters long'));
    }

    if (newPassword !== confirmPassword) {
      res.status(400);
      return next(new Error('New passwords do not match'));
    }

    if (newPassword === currentPassword) {
      res.status(400);
      return next(new Error('New password cannot be the same as the current password'));
    }

    const role = req.user.role;
    let dbUser;

    if (role === 'admin' || role === 'superadmin') {
      dbUser = await Admin.findById(req.user._id).select('+password');
    } else {
      dbUser = await User.findById(req.user._id).select('+password');
    }

    if (!dbUser) {
      res.status(404);
      return next(new Error('Account not found'));
    }

    // Verify current password
    const isMatch = await dbUser.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      return next(new Error('Incorrect current password'));
    }

    // Set new password (will be hashed automatically in pre-save hook)
    dbUser.password = newPassword;
    await dbUser.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

