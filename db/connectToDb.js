const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectToDb;
