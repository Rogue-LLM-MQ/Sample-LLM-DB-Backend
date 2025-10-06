const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LLM Blocker API",
      version: "1.0.0",
      description: "API to query LLM signatures",
    },
    security: [], // optional global security
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(swaggerOptions);
