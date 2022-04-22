const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

// connection to mongoDB
const connectDB = require('./config/db');
connectDB();

// error files
const errorHandler = require('./middlewares/error');

// route files
const bootcamps = require('./routes/bootcamps');

// middleware files
const logger = require('./middlewares/logger');

// load env vars
dotenv.config({path:'./config/config.env'});

const app = express();

// body parser
app.use(express.json());

// app.use(logger); // custom middleware example

// dev loggin middleware
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

// middlewares
// must always be after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // close server and exit process
    server.close(() => process.exit(1));
});