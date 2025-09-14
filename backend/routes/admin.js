const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const { Parser } = require('json2csv');

// get users (admin)
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// block/unblock
router.put('/users/:id/block', auth, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ id: user._id, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// delete user
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// get all feedbacks with filters
router.get('/feedback', auth, requireRole('admin'), async (req, res) => {
  try {
    const { course, rating, student } = req.query;
    const q = {};
    if (course) q.course = course;
    if (rating) q.rating = parseInt(rating);
    if (student) q.student = student;
    const items = await Feedback.find(q)
      .populate('student', 'name email')
      .populate('course', 'name code')
      .sort('-createdAt');
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// export feedback csv
router.get('/feedback/export', auth, requireRole('admin'), async (req, res) => {
  try {
    const items = await Feedback.find()
      .populate('student', 'name email')
      .populate('course', 'name code');
    const data = items.map(i => ({
      id: i._id,
      studentName: i.student?.name || '',
      studentEmail: i.student?.email || '',
      courseName: i.course?.name || '',
      courseCode: i.course?.code || '',
      rating: i.rating,
      message: i.message,
      createdAt: i.createdAt
    }));
    if (data.length === 0) {
      return res.status(404).json({ msg: 'No feedback data to export.' });
    }
    const fields = Object.keys(data[0]);
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('feedback_export.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// analytics summary
router.get('/analytics/summary', auth, requireRole('admin'), async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const avg = await Feedback.aggregate([
      { $group: { _id: "$course", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { $project: { courseId: "$_id", courseName: "$course.name", avgRating: 1, count: 1 } }
    ]);
    res.json({ totalFeedback, totalStudents, avgRatingPerCourse: avg });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
