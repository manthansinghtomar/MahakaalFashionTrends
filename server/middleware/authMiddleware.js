import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

/**
 * Protect middleware: Verifies JWT token from cookies or authorization headers
 * and sets req.user to the authenticated User or Admin instance.
 */
export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Bearer token header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    // Decode and verify the JWT payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Differentiate user vs administrator based on the encoded role
    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        res.status(401);
        return next(new Error('Not authorized, administrator account not found'));
      }
      
      if (!admin.isActive) {
        res.status(403);
        return next(new Error('Your administrator account is inactive'));
      }
      
      req.user = admin;
    } else {
      // Default is 'user' role
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user account not found'));
      }
      
      if (user.isBlocked) {
        res.status(403);
        return next(new Error('Your account is blocked. Please contact support'));
      }
      
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized, token verification failed'));
  }
};

/**
 * Middleware to restrict endpoint access to specific roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource`)
      );
    }
    next();
  };
};
