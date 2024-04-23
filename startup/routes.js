const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const customers = require("../routes/customers");
const home = require("../routes/home");
const errorHandler = require("../middleware/error");
const express = require("express");
const helmet = require("helmet");

module.exports = function (app) {
     app.use(express.json());

     app.use("/", home);
     app.use("/api/genres", genres);
     app.use("/api/movies", movies);
     app.use("/api/customers", customers);
     app.use("/api/rentals", rentals);
     app.use("/api/users", users);
     app.use("/api/auth", auth);
     app.use(errorHandler);
     app.use(helmet());
};
