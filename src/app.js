require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
// const { checkingOverload } = require("./helpers/check.connect.js");

const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./databases/init.mongodb.js");

// checkingOverload();

//init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to eCommerce Project!",
  });
});

//handling errors

module.exports = app;
