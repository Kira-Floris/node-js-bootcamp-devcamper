const mongoose = require('mongoose');

const connectDB = async () => {
    console.log(process.env.MONGO_URI)
    try{
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/devcamper",
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
