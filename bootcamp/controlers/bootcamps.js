const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) =>{
    let query;

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    const bootcamps = await query;

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) =>{
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp 
    });
});

// @desc create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) =>{
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
});

// @desc update single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) =>{
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });
    
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) =>{
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) =>{
    const { zipcode, distance } = req.params;

    // get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calculate radius using radians
    // divide distance by radius of earth
    // radius of earth == 3963 miles == 6378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});