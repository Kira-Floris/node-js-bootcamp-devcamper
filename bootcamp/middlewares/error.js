const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // log to console for dev
    console.log(err.stack.red);

    console.log(err);
    
    // mongoose bad ObjectId
    if (err.name==='CastError'){
        const message = `Resource with id ${err.value} not found`;
        error = new ErrorResponse(message, 404);
    }

    // mongoose duplicate key
    // cant use name like in casterror, where we get mongooseerror, which is used by many other errors
    // we use error code instead
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${err.keyValue.name}`;
        error = new ErrorResponse(message, 400);
    }

    // mongoose validation error message
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;