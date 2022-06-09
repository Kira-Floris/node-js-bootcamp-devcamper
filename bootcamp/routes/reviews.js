const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getReviews, getReview, createReview } = require('../controlers/reviews');

const {protect, authorize} = require('../middlewares/auth');

const Review = require('../models/Review');
const advancedResults = require('../middlewares/advancedResults');
router
    .route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }),getReviews)
    .post(protect, authorize('user', 'admin'), createReview);

router
    .route('/:id')
    .get(getReview)
//     .put(protect, authorize('publisher','admin'), updateCourse)
//     .delete(protect, authorize('publisher','admin'), deleteCourse);

module.exports = router;