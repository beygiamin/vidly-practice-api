const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

let dbpassword = config.get("db.password");
if (typeof dbpassword == "string") {
     dbpassword = dbpassword.replace("@", "%40");
}

let uri = config.get("db.address");
if (typeof uri === "string") {
     uri = uri.replace("dbpassword", dbpassword);
}
const clientOptions = {
     serverApi: { version: "1", strict: true, deprecationErrors: true },
};

module.exports = function () {
     mongoose
          .connect(uri, clientOptions)
          .then(() => winston.info("Connected To Database ..."));
};
