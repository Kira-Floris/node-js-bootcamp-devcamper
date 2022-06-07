const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controlers/courses');

const {protect, authorize} = require('../middlewares/auth');

const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults');
router
    .route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }),getCourses)
    .post(protect, authorize('publisher','admin'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher','admin'), updateCourse)
    .delete(protect, authorize('publisher','admin'), deleteCourse);

module.exports = router;