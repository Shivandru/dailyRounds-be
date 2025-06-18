const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
const connection = mongoose.connect(mongoURI);

module.exports = connection;
