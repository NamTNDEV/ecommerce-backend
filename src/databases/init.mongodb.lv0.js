const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/ecommerceBE";

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Connecting to MongoDB Successfully!");
  })
  .catch((err) => console.log("Connection Failed!"));

module.exports = mongoose;
