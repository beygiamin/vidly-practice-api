const winston = require("winston");
require("express-async-errors");

module.exports = function () {
     winston.add(
          new winston.transports.File({
               filename: "logfile.log",
               handleExceptions: true,
               handleRejections: true,
          })
     );
     winston.add(
          new winston.transports.Console({
               handleExceptions: true,
               level: "error",
               format: winston.format.prettyPrint({ colorize: true }),
          })
     );
};
