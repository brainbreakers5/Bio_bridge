const express = require('express');
const { getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// JWT protected
router.get('/', protect, getAttendance);

module.exports = router;
