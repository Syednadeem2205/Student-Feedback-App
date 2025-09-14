const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null, uploadDir),
  filename: (req,file,cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// get my profile
router.get('/me', auth, async (req,res)=> res.json(req.user));

// update profile
router.put('/me', auth, async (req,res)=>{
  const { name, phone, dob, address } = req.body;
  const user = await User.findById(req.user._id);
  if(!user) return res.status(404).json({ msg:'Not found' });
  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.dob = dob ?? user.dob;
  user.address = address ?? user.address;
  await user.save();
  res.json(user);
});

// avatar upload (Cloudinary preferred)
router.post('/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
  if(!req.file) return res.status(400).json({ msg:'No file uploaded' });
  const user = await User.findById(req.user._id);
  if(process.env.CLOUDINARY_CLOUD_NAME){
    // upload to cloudinary
    const r = await cloudinary.uploader.upload(req.file.path, { folder: 'avatars', public_id: `${user._id}_${Date.now()}` });
    user.avatarUrl = r.secure_url;
  } else {
    user.avatarUrl = `/${req.file.path}`;
  }
  await user.save();
  res.json({ avatarUrl: user.avatarUrl });
});

// change password
router.post('/change-password', auth, async (req,res)=>{
  const { currentPassword, newPassword } = req.body;
  if(!currentPassword || !newPassword) return res.status(400).json({ msg:'Missing fields' });
  const { isValidPassword } = require('../utils/validators');
  if(!isValidPassword(newPassword)) return res.status(400).json({ msg:'New password weak' });
  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if(!match) return res.status(400).json({ msg:'Current password incorrect' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.json({ msg:'Password changed' });
});

module.exports = router;
