const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const envData = require('../envData');

// @desc post register user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next)=>{
    const { name, email, password, role } = req.body;

    // create user
    const user = await User.create({ 
        name,
        email,
        password,
        role
    });

    // create token
    sendTokenResponse(user, 200, res);
});

// @desc login user
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next)=>{
    const { email, password } = req.body;

    // validate email and password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email an email and password'), 400);
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credentials'), 401);
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials'), 401);
    }

    // create token
    sendTokenResponse(user, 200, res);
});

// @desc get current logged in user
// @route POST /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req, res, next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({ 
        success: true, 
        data: user
    });
});

// @desc forgot password
// @route POST /api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) =>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }

    // get resetToken
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    res.status(200).json({ 
        success: true, 
        data: user
    });
});


// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) =>{
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+envData.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(envData.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true,token});
};