const express = require('express');
const router = express.Router();

// controllers
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controlers/bootcamps');

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
    .post(createBootcamp);

router
    .route('/:id/photo')
    .put(bootcampPhotoUpload);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;