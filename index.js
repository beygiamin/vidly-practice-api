const logger = require("./middleware/logger");
const debug = require("debug")("app:debug");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const genres = require("./routes/genres");
const movies = require("./routes/movies");

const home = require("./routes/home");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/movies", movies);

app.use("/", home);

mongoose
     .connect("mongodb://localhost:27017/vidly")
     .then(() => debug("Connected to MongoDB...."))
     .catch(err => debug("Connection Failed : ", err));

console.log(`Application Name : ${config.get("name")} `);
// console.log(`Mail Name : ${config.get("mail.name")} `);
// console.log(`Password : ${config.get("mail.password")}`);

if (app.get("env") == "development") {
     app.use(morgan("tiny"));
     debug("Morgan Is Running");
}
app.use(logger);

app.use(express.static("public"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
     console.log(`I am Listening On Port ${port}`);
});
