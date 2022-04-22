const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) =>{
     try{
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
     } catch(err){
        next(err);
     }
};

// @desc get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) =>{
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp 
        });
    } catch(err) {
        next(err);
    }
};

// @desc create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async (req, res, next) =>{
    try{
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    }
    catch(err){
        next(err);
    }
    
};

// @desc update single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) =>{
    try{
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
    }
    catch(err){
        next(err);
    }
    
};

// @desc delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) =>{
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(err){
        // using 204 doesnt allow u to respond with data
        next(err);
    }
};