const express = require('express');
const { logAttendance, deviceRegisterUser, syncUsers } = require('../controllers/deviceController');
const { deviceAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// All device routes protected by API Key
router.use(deviceAuth);

router.post('/attendance', logAttendance);
router.post('/log', logAttendance); // Alias for compatibility with old bridge
router.post('/register-user', deviceRegisterUser);
router.get('/sync-users', syncUsers);

module.exports = router;
