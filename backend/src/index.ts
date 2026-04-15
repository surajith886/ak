import { onRequest } from 'firebase-functions/v2/https';
import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the database when the function starts
connectDB();

// Export the express app as a Firebase Function
export const api = onRequest(app);
