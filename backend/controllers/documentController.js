// controllers/documentController.js
import Document from '../models/Document.js';

// @desc    Create a new document
// @route   POST /api/docs
// @access  Private
export const createDocument = async (req, res) => {
  try {
    const { title } = req.body;

    const document = await Document.create({
      title: title || 'Untitled Document',
      owner: req.user._id, // Get owner ID from the middleware
      collaborators: [], // Start with no collaborators
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all documents for a user
// @route   GET /api/docs
// @access  Private
export const getUserDocuments = async (req, res) => {
  try {
    // Find all documents where the user is either the owner or a collaborator
    const documents = await Document.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    }).sort({ updatedAt: -1 }); // Sort by most recently updated

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Add a collaborator to a document
// @route   POST /api/docs/:documentId/collaborators
// @access  Private
export const addCollaborator = async (req, res) => {
    try {
        const { documentId } = req.params; // Get doc ID from the URL
        const collaboratorId = req.user._id; // Get user ID from our 'protect' middleware

        // Find the document to check if it exists and who the owner is
        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // The owner doesn't need to be added to the collaborators list
        if (document.owner.toString() === collaboratorId.toString()) {
            return res.status(200).json({ message: 'User is the owner' });
        }

        // Use findByIdAndUpdate with the $addToSet operator.
        // This is an atomic operation that adds the collaboratorId to the array
        // only if it's not already present. This is the correct, robust way to do this.
        await Document.findByIdAndUpdate(documentId, {
            $addToSet: { collaborators: collaboratorId },
        });

        res.status(200).json({ message: 'Collaborator added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};