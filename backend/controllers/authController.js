// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate a JWT
const generateToken = (userId) => {
  // Sign the token with the user's ID and our secret key
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Set the token to expire in 30 days
  });
};

// --- User Registration ---
// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation - not empty etc...
    if ([name, email, password].some(
        (field) => ( field?.trim() === "" )
    )) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists, send a 400 Bad Request error
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user in the database
    const user = await User.create({ name, email, password });

    // Check if user creation was successful
    if (user) {
      const token = generateToken(user._id);
      // Send a 201 Created response with the user's info and token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// --- User Login ---
// @desc    Authenticate a user & get a token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation - not empty etc...
    if ([email, password].some(
        (field) => ( field?.trim() === "" )
    )) {
        throw new ApiError(400, "All fields are required")
    }

    // Find the user in the database by their email
    const user = await User.findOne({ email });

    // Check if the user exists and if the password matches
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      // Send a 200 OK response with the user's info and token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      // If credentials are wrong, send a 401 Unauthorized error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};