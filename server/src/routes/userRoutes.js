const express = require('express');
const { getUsers, registerUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes protected by Supabase JWT
router.use(protect);

router.get('/', getUsers);
router.post('/', registerUser);

module.exports = router;
