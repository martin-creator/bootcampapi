const express = require('express');
const {registerUser,
    loginUser,
    getMe, 
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logoutUser,
    deleteAllUsers} = require('../controllers/authController');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .get(logoutUser);

router.route('/me')
    .get(protect, getMe);

router.route('/forgotpassword')
    .post(forgotPassword);

router.route('/resetpassword/:resettoken')
    .put(resetPassword);

router.route('/updatedetails')
    .put(protect, updateDetails);

router.route('/updatepassword')
    .put(protect, updatePassword);

router.route('/cleanusers')
    .delete(deleteAllUsers);



module.exports = router;