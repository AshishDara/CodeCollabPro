// server.js
// Load environment variables IMMEDIATELY, before any other imports or code.
import dotenv from 'dotenv';
dotenv.config();

// Now, import everything else
import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; // Node's built-in HTTP module
import { Server } from 'socket.io'; // The Socket.IO Server class
import connectDB from './config/db.js';
import Document from './models/Document.js';
//routes imports
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Connect to Database
connectDB();

// Initializations
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Enable CORS for API routes
app.use(express.json()); // Enable JSON body parsing

// API Test Route
app.get('/api', (req, res) => {
  res.send('CodeCollabPro API is running...');
});

// routes use
app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);
app.use('/api/ai', aiRoutes);

// Socket.IO connection logic
// This should be outside, in the global scope of the file
const userSocketMap = {}; // Maps socketId -> username
const documentStates = new Map();

function getClientsInRoom(documentId) {
    const socketIds = io.sockets.adapter.rooms.get(documentId) || new Set();
    return Array.from(socketIds).map(socketId => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-document', async ({ documentId, username }) => {
        // --- 1. Load Document State ---
        let currentCode = '';
        // Check if the document is already active in memory
        if (documentStates.has(documentId)) {
            currentCode = documentStates.get(documentId);
        } else {
            // If not, fetch it from the permanent database
            const document = await Document.findById(documentId);
            if (document) {
                currentCode = document.content;
                // Store it in memory for future edits this session
                documentStates.set(documentId, currentCode);
            }
        }

        // --- 2. Handle User Joining ---
        userSocketMap[socket.id] = username;
        socket.join(documentId);
        
        console.log(`User ${username} (${socket.id}) joined room ${documentId}`);

        // --- 3. Broadcast updated client list to EVERYONE in the room ---
        const clients = getClientsInRoom(documentId);
        io.to(documentId).emit('update-client-list', clients);

        // --- 4. Send the latest code state ONLY to the new user ---
        socket.emit('receive-changes', currentCode);
    });

    socket.on('send-changes', ({ documentId, content }) => {
        documentStates.set(documentId, content);
        socket.to(documentId).emit('receive-changes', content);
    });

    socket.on('disconnecting', async () => {
        const rooms = Array.from(socket.rooms);
        for (const documentId of rooms) {
            if (documentId !== socket.id) {
                const clients = getClientsInRoom(documentId).filter(
                    (client) => client.socketId !== socket.id
                );
                
                // If this was the last user, save the document
                if (clients.length === 0) {
                    if (documentStates.has(documentId)) {
                        try {
                            const finalContent = documentStates.get(documentId);
                            await Document.findByIdAndUpdate(documentId, { content: finalContent });
                            documentStates.delete(documentId); // Clean up memory
                        } catch (err) {
                            console.error('Failed to save document:', err);
                        }
                    }
                } else {
                    // Otherwise, just broadcast the updated user list
                    io.to(documentId).emit('update-client-list', clients);
                }
            }
        }
        delete userSocketMap[socket.id];
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Server Activation
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server is flying on port ${PORT}`)
);