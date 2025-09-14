const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const { Parser } = require('json2csv');

// list users (paginated)
router.get('/users', auth, requireRole('admin'), async (req,res)=>{
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page-1)*limit;
  const q = {};
  if(req.query.search) q.$or = [{ name: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }];
  const total = await User.countDocuments(q);
  const items = await User.find(q).select('-password').sort('-createdAt').skip(skip).limit(limit);
  res.json({ items, total, page, pages: Math.ceil(total/limit) });
});

// block/unblock
router.put('/users/:id/block', auth, requireRole('admin'), async (req,res)=>{
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).json({ msg:'Not found' });
  user.isBlocked = !!req.body.block; // explicit block/unblock
  await user.save();
  res.json({ id:user._id, isBlocked:user.isBlocked });
});

// delete user
router.delete('/users/:id', auth, requireRole('admin'), async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg:'Deleted' });
});

// feedback with filters and pagination
router.get('/feedback', auth, requireRole('admin'), async (req,res)=>{
  const { course, rating, student, page = 1, limit = 50 } = req.query;
  const q = {};
  if(course) q.course = course;
  if(rating) q.rating = parseInt(rating);
  if(student) {
    // find student by email or name
    const s = await User.findOne({ $or: [{ email: student }, { name: new RegExp(student, 'i') }] });
    if(s) q.student = s._id;
    else q.student = null; // no results
  }
  const skip = (Math.max(1, parseInt(page))-1)*Math.min(100, parseInt(limit));
  const total = await Feedback.countDocuments(q);
  const items = await Feedback.find(q).populate('student','name email').populate('course','name code').sort('-createdAt').skip(skip).limit(Math.min(100, parseInt(limit)));
  res.json({ items, total, page: parseInt(page), pages: Math.ceil(total/limit) });
});

// export CSV (filtered)
router.get('/feedback/export', auth, requireRole('admin'), async (req,res)=>{
  const { course, rating, student } = req.query;
  const q = {};
  if(course) q.course = course;
  if(rating) q.rating = parseInt(rating);
  if(student) {
    const s = await User.findOne({ $or: [{ email: student }, { name: new RegExp(student, 'i') }] });
    if(s) q.student = s._id;
    else q.student = null;
  }
  const items = await Feedback.find(q).populate('student','name email').populate('course','name code').sort('-createdAt');
  const data = items.map(i=>({
    id: i._id.toString(),
    studentName: i.student?.name || '',
    studentEmail: i.student?.email || '',
    courseCode: i.course?.code || '',
    courseName: i.course?.name || '',
    rating: i.rating,
    message: i.message || '',
    createdAt: i.createdAt.toISOString()
  }));
  const parser = new Parser({ fields: Object.keys(data[0] || {}) });
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(`feedback_export_${Date.now()}.csv`);
  res.send(csv);
});

// analytics
router.get('/analytics/summary', auth, requireRole('admin'), async (req,res)=>{
  const totalFeedback = await Feedback.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const avg = await Feedback.aggregate([
    { $group: { _id: "$course", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
    { $project: { courseId:"$_id", courseName:"$course.name", avgRating:1, count:1 } }
  ]);
  const distribution = await Feedback.aggregate([
    { $group: { _id: "$rating", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ totalFeedback, totalStudents, avgRatingPerCourse: avg, ratingDistribution: distribution });
});

// Admin: courses CRUD
router.post('/courses', auth, requireRole('admin'), async (req,res)=>{
  const { code, name, description } = req.body;
  if(!code || !name) return res.status(400).json({ msg:'Missing fields' });
  const exists = await Course.findOne({ code });
  if(exists) return res.status(400).json({ msg:'Course code exists' });
  const c = new Course({ code, name, description });
  await c.save();
  res.status(201).json(c);
});
router.put('/courses/:id', auth, requireRole('admin'), async (req,res)=>{
  const c = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!c) return res.status(404).json({ msg:'Not found' });
  res.json(c);
});
router.delete('/courses/:id', auth, requireRole('admin'), async (req,res)=>{
  await Course.findByIdAndDelete(req.params.id);
  res.json({ msg:'Deleted' });
});

module.exports = router;
