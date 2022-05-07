const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getCourses } = require('../controlers/courses');

router
    .route('/')
    .get(getCourses);



module.exports = router;