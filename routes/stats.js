const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');

router.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    res.json({ users: userCount, projects: projectCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;