// config/db.js
import mongoose from 'mongoose';

// Defines an async function to connect to our database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with a failure code if the connection fails
    process.exit(1);
  }
};

export default connectDB;