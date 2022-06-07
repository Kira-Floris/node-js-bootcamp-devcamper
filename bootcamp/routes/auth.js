const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controlers/auth');

const {protect} = require('../middlewares/auth');

const router = express.Router();

router
    .post('/register', register);

router
    .post('/login', login);

router
    .get('/me', protect, getMe);

router
    .post('/forgotpassword', forgotPassword);

router
    .put('/resetpassword/:resettoken', resetPassword);

module.exports = router;