const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerDefinition = {
     openapi: "3.0.0",
     info: {
          title: "vidly",
          version: "1.0.0",
          description: "simple api practicing",
     },
};

const options = {
     swaggerDefinition,
     apis: ["./routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = function (app) {
     app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
