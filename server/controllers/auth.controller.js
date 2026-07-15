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
