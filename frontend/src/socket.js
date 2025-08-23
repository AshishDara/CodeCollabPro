// src/socket.js
import { io } from 'socket.io-client';

// This function initializes and returns a socket.io client instance
export const initSocket = async () => {
  // Configuration options for the socket connection
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity', // Try to reconnect indefinitely
    timeout: 10000, // Connection timeout in milliseconds
    transports: ['websocket'], // Force WebSocket transport, avoiding HTTP long-polling
  };

  // Connect to the backend server using the URL from our environment variables
  return io(import.meta.env.VITE_BACKEND_URL, options);
};