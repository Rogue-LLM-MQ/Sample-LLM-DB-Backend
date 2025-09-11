const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LLM Blocker API",
      version: "1.0.0",
      description: "API to query LLM signatures",
    },
  },
  apis: ["./routes/*.js"], // looks at JSDoc in routes
};

module.exports = swaggerJsdoc(swaggerOptions);
