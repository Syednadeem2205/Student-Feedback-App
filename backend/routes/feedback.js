const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');
const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');

// create feedback
router.post('/',
  auth,
  body('courseId').notEmpty(),
  body('rating').isInt({ min:1, max:5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { courseId, rating, message } = req.body;
    try {
      // ensure course exists
      const courseExists = await Course.findById(courseId);
      if(!courseExists) return res.status(400).json({ msg: 'Invalid course' });
      const f = await Feedback.create({ student: req.user._id, course: courseId, rating, message });
      res.status(201).json(f);
    } catch(err){ console.error(err); res.status(500).json({ msg:'Server error' }); }
  }
);

// mine (paginated)
router.get('/mine', auth, async (req,res)=>{
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page-1)*limit;
  const total = await Feedback.countDocuments({ student: req.user._id });
  const items = await Feedback.find({ student: req.user._id }).populate('course','name code').sort({createdAt:-1}).skip(skip).limit(limit);
  res.json({ items, total, page, pages: Math.ceil(total/limit) });
});

// edit
router.put('/:id', auth,
  body('rating').optional().isInt({ min:1, max:5 }),
  async (req,res)=>{
    const f = await Feedback.findById(req.params.id);
    if(!f) return res.status(404).json({ msg:'Not found' });
    if(!f.student.equals(req.user._id)) return res.status(403).json({ msg:'Not owner' });
    if(req.body.rating) f.rating = req.body.rating;
    if(req.body.message !== undefined) f.message = req.body.message;
    await f.save();
    res.json(f);
  });

// delete
router.delete('/:id', auth, async (req,res)=>{
  const f = await Feedback.findById(req.params.id);
  if(!f) return res.status(404).json({ msg:'Not found' });
  if(!f.student.equals(req.user._id)) return res.status(403).json({ msg:'Not owner' });
  await f.remove();
  res.json({ msg:'Deleted' });
});

module.exports = router;
