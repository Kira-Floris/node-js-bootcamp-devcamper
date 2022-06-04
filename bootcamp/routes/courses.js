const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controlers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults');
router
    .route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }),getCourses)
    .post(createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;