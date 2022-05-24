const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controlers/courses');

router
    .route('/')
    .get(getCourses)
    .post(createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;