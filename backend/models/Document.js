// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled Document',
    },
    content: {
      type: String,
      default: '// Start coding here!',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Stores a reference to a User's ID
      required: true,
      ref: 'User', // Specifies that this ID refers to the 'User' model
    },
    collaborators: [ // An array to store collaborators
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
