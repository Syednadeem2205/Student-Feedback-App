const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// get my profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// update profile (name, phone, dob, address)
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone, dob, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'Not found' });
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.dob = dob ?? user.dob;
    user.address = address ?? user.address;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// avatar upload
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // Ensure URL uses forward slashes
    const avatarUrl = '/' + req.file.path.replace(/\\/g, '/');
    user.avatarUrl = avatarUrl;
    await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;