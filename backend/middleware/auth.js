const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { auth, requireRole } = require("../middleware/auth");

// @route   GET /api/courses
// @desc    Get all courses (Public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/courses
// @desc    Add a new course (Admin only)
// @access  Private (Admin only)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) {
    return res.status(400).json({ msg: "Missing required fields: code and name" });
  }

  try {
    let course = await Course.findOne({ code });
    if (course) {
      return res.status(400).json({ msg: "A course with this code already exists" });
    }

    course = new Course({ code, name, description });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course (Admin only)
// @access  Private (Admin only)
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course (Admin only)
// @access  Private (Admin only)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json({ msg: "Course deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
