const express = require('express');
const {registerUser, deleteAllUsers} = require('../controllers/authController');

const router = express.Router();

router.route('/register')
    .post(registerUser);

router.route('/cleanusers')
    .delete(deleteAllUsers);



module.exports = router;