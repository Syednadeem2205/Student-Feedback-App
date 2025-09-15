// server.js - Backend for Student Feedback App

// Import packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// --- CORS ---
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://studentfeedbackappv1-34f0891g2-syed-nadeem-ahmeds-projects.vercel.app"
  ],
  credentials: true
}));

// --- Middleware ---
// Security headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: '5mb' }));

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many requests from this IP, try again later.',
});
app.use('/api/auth', authLimiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected successfully!');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit process on failure
  }
};
connectDB();

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admin', require('./routes/admin'));

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
