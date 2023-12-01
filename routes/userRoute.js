// routes.js
const express = require('express');
const router = express.Router();
const { VerifyUser } = require('../middlewares/getCurrentUser');
const {
  register,
  login,
  forgetPassword,
  resetPassword,
} = require('../Controllers/Authentication');
const { getUser, updateUserData } = require('../Controllers/userControllers');
const { updateProfilePhoto } = require('../Controllers/userControllers');

// Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', resetPassword);

router.get('/me', VerifyUser, getUser);
router.put('/editProfile', VerifyUser, updateUserData);
router.put('/addProfileImage', VerifyUser, updateProfilePhoto);

module.exports = router;
