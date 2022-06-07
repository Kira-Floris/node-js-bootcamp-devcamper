const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const envData = require('../envData');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) =>{
    

    res.status(200).json(res.advancedResults);
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
    req.body.user = req.user.id;

    // check for published bootcamps
    const publishedBootcamp = await Bootcamp.findOne({user:req.user.id});

    // if the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

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
    let bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    // make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User with id ${req.params.id} is not authorized to update`, 401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) =>{
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User with id ${req.params.id} is not authorized to delete`, 401));
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access public
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
    });
});

// @desc upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) =>{
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // check bootcamp ownership
    if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User with id ${req.params.id} is not authorized to delete`, 401));
    }
    
    if(!req.files){
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        );
    }

    const file = req.files.photo;

    // make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        );
    }

    // check file size
    if(file.size > envData.MAX_FILE_UPLOAD){
        return next(
            new ErrorResponse(`Please enter an image less than ${envData.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // create custom filename
    file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

    file.mv(`${envData.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            );  
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
});