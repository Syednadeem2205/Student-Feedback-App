const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');

// create feedback (student)
router.post('/', auth, async (req,res)=>{
  const { courseId, rating, message } = req.body;
  if(!courseId || !rating) return res.status(400).json({ msg: 'Missing fields' });
  try {
    const f = await Feedback.create({ student: req.user._id, course: courseId, rating, message });
    res.status(201).json(f);
  } catch(err){ console.error(err); res.status(500).json({ msg:'Server error' }); }
});

// my feedbacks (paginated)
router.get('/mine', auth, async (req,res)=>{
  const page = parseInt(req.query.page)||1;
  const limit = parseInt(req.query.limit)||10;
  const skip = (page-1)*limit;
  const total = await Feedback.countDocuments({ student: req.user._id });
  const items = await Feedback.find({ student: req.user._id }).populate('course').sort({createdAt:-1}).skip(skip).limit(limit);
  res.json({ items, total, page, pages: Math.ceil(total/limit) });
});

// edit (owner)
router.put('/:id', auth, async (req,res)=>{
  const f = await Feedback.findById(req.params.id);
  if(!f) return res.status(404).json({ msg:'Not found' });
  if(!f.student.equals(req.user._id)) return res.status(403).json({ msg:'Not owner' });
  f.rating = req.body.rating ?? f.rating;
  f.message = req.body.message ?? f.message;
  await f.save();
  res.json(f);
});

// delete (owner)
router.delete('/:id', auth, async (req,res)=>{
  const f = await Feedback.findById(req.params.id);
  if(!f) return res.status(404).json({ msg:'Not found' });
  if(!f.student.equals(req.user._id)) return res.status(403).json({ msg:'Not owner' });
  await f.remove();
  res.json({ msg:'Deleted' });
});

module.exports = router;
