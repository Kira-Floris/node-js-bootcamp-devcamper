const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

// connection to mongoDB
const connectDB = require('./config/db');
connectDB();

// error files
const errorHandler = require('./middlewares/error');

// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// middleware files
const logger = require('./middlewares/logger');

// load env vars
dotenv.config({path:'./config/config.env'});

const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// app.use(logger); // custom middleware example

// dev loggin middleware
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// file upload middleware
app.use(fileupload());

// sanitize data
app.use(mongoSanitize());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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