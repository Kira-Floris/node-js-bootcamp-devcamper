const mongoose = require('mongoose');

const env_variables = require('../envData');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(env_variables.db,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
            );
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
    }
    catch(e){
        console.log(`Caught an error ${e}`.red);
    }
};

module.exports = connectDB;
