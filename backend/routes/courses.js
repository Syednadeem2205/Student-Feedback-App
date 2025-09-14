const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, requireRole } = require('../middleware/auth');

// public: list courses
router.get('/', async (req,res)=>{
  const courses = await Course.find().sort('name');
  res.json(courses);
});

// admin: add course
router.post('/', auth, requireRole('admin'), async (req,res)=>{
  const { code, name, description } = req.body;
  if(!code || !name) return res.status(400).json({ msg: 'Missing fields' });
  try{
    let c = await Course.findOne({ code });
    if(c) return res.status(400).json({ msg: 'Course code exists' });
    c = new Course({ code, name, description });
    await c.save();
    res.status(201).json(c);
  }catch(err){ console.error(err); res.status(500).json({ msg:'Server error' }); }
});

// admin edit
router.put('/:id', auth, requireRole('admin'), async (req,res)=>{
  const c = await Course.findByIdAndUpdate(req.params.id, req.body, { new:true });
  if(!c) return res.status(404).json({ msg:'Not found' });
  res.json(c);
});

// admin delete
router.delete('/:id', auth, requireRole('admin'), async (req,res)=>{
  const c = await Course.findByIdAndDelete(req.params.id);
  if(!c) return res.status(404).json({ msg:'Not found' });
  res.json({ msg:'Deleted' });
});

module.exports = router;
