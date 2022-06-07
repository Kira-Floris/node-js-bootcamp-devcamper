const express = require('express');
const router = express.Router();

// controllers
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controlers/bootcamps');

const {protect, authorize} = require('../middlewares/auth');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResults');

// include other resource routers
const courseRouter = require('./courses');

// reroute into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'),getBootcamps)
    .post(protect, authorize('publisher','admin'), createBootcamp);

router
    .route('/:id/photo')
    .put(protect,authorize('publisher','admin'), bootcampPhotoUpload);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher','admin'), updateBootcamp)
    .delete(protect, authorize('publisher','admin'), deleteBootcamp);

module.exports = router;