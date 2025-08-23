// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for the authorization header and ensure it's a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token's authenticity using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token's payload
      // Attach the user object to the request, excluding the password
      req.user = await User.findById(decoded.userId).select('-password');

      // Proceed to the next middleware or the controller function
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };