const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

const env_variables = {
    NODE_ENV: process.env.NODE_ENV,
    db: process.env.MONGO_URI,
    GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
    GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
    MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE
};

module.exports = env_variables;