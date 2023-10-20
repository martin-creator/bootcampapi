const express = require('express');
const {registerUser,
    loginUser,
    getMe, 
    forgotPassword,
    resetPassword,
    deleteAllUsers} = require('../controllers/authController');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/me')
    .get(protect, getMe);

router.route('/forgotpassword')
    .post(forgotPassword);

router.route('/resetpassword/:resettoken')
    .put(resetPassword);

router.route('/cleanusers')
    .delete(deleteAllUsers);



module.exports = router;