const mongoose = require('mongoose');
const User = require('./user');

const connectDb = () => {
    return mongoose.connect(process.env.MONGO_URI);
}
const models = {User};

module.exports = {connectDb}, models;