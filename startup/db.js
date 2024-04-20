const mongoose = require("mongoose");
const winston = require("winston");
const uri =
     "mongodb+srv://dbUserAdmin:sQ_5T%40c_T8nSSd8@atlascluster.mnjkxhf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
const clientOptions = {
     serverApi: { version: "1", strict: true, deprecationErrors: true },
};

module.exports = function () {
     mongoose
          .connect(uri, clientOptions)
          .then(() => winston.info("Connected To Database ..."));
};
