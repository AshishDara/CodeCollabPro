// routes/documentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createDocument, getUserDocuments,addCollaborator, } from '../controllers/documentController.js';

const router = express.Router();

// Apply the 'protect' middleware to both routes
router.route('/')
  .post(protect, createDocument)
  .get(protect, getUserDocuments);
router.route('/:documentId/collaborators').post(protect, addCollaborator);
export default router;
