const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

const env_variables = {
    db: process.env.MONGO_URI,
    GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
    GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
    MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD
};

module.exports = env_variables;