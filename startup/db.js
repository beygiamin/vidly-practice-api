const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

const dbpassword = config.get("dbPassword");
const uri = `mongodb+srv://dbUserAdmin:${dbpassword}@atlascluster.mnjkxhf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;
const clientOptions = {
     serverApi: { version: "1", strict: true, deprecationErrors: true },
};

module.exports = function () {
     mongoose
          .connect(uri, clientOptions)
          .then(() => winston.info("Connected To Database ..."));
};
