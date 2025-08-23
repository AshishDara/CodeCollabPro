// routes/aiRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { explainCode } from '../controllers/aiController.js';

// Initialize the Express Router
const router = express.Router();

// Define the POST route for explaining code
// It's protected, so only logged-in users can use it.
router.post('/explain', protect, explainCode);

export default router;