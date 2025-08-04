const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to mongodb");
    })
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
