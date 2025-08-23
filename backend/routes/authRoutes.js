// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

// Initialize the Express Router
const router = express.Router();

// Define the POST route for user registration
router.post('/register', registerUser);

// Define the POST route for user login
router.post('/login', loginUser);

export default router;