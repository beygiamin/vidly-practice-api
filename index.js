const debug = require("debug")("app:debug");
const morgan = require("morgan");
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));

if (app.get("env") == "development") {
     app.use(morgan("tiny"));
     debug("Morgan Is Running");
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
     winston.info(`I am Listening On Port ${port}`);
});
