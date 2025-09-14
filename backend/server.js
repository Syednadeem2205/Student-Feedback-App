// Import necessary packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware ---

// Security headers
app.use(helmet());

// Enable CORS for all routes
app.use(cors());

// Body parser to handle JSON data with a size limit
app.use(express.json({ limit: '5mb' }));

// Rate limiting for authentication routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per IP per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});
app.use('/api/auth', authLimiter);

// Serve static files (e.g., uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// --- Database Connection ---

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit the process if the database connection fails
    process.exit(1);
  }
};

// Connect to the database
connectDB();

// --- Routes ---

// The order of these is not critical, but grouping them is good practice
app.use('/api/courses', require('./routes/courses'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// --- Error Handling ---

// A global error handler to catch unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the full error stack for debugging
  res.status(500).json({ msg: 'Server error' });
});

// --- Server Startup ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
