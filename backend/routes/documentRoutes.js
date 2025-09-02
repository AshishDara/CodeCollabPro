// routes/documentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createDocument,
    getUserDocuments,
    addCollaborator,
} from '../controllers/documentController.js';

const router = express.Router();

//routes for the base path '/' (e.g., GET /api/docs and POST /api/docs)
router.route('/').post(protect, createDocument).get(protect, getUserDocuments);

//the route for adding collaborators to a specific document
router.route('/:documentId/collaborators').post(protect, addCollaborator);

export default router;