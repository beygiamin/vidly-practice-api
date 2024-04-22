const config = require("config");
const dbpassword = config.get("db.password");

module.exports = function () {
     if (!config.get("jwtPrivateKey")) {
          throw new Error("FATAL ERROR : JWT KEY IS NOT DEFINED");
     }

     if (!dbpassword) throw new Error("Database Password not setted");
};
