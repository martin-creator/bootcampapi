const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name, email, password, role
    });

    //sendTokenResponse(user, 200, res);

    res.status(200).json({ success: true, data: user });
}
);

// @desc    Delete All Users
// @route   DELETE /api/v1/auth/deleteAllUsers
// @access  Private

const deleteAllUsers = asyncHandler(async (req, res, next) => {
    await User.deleteMany({});

    res.status(200).json({ success: true, data: {} });
}
);


module.exports = {
    registerUser,
    deleteAllUsers
}