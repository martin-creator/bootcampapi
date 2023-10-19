const express = require('express');
const {registerUser,
    loginUser, 
    deleteAllUsers} = require('../controllers/authController');

const router = express.Router();

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/cleanusers')
    .delete(deleteAllUsers);



module.exports = router;