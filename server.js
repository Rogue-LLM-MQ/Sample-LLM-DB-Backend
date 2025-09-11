require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./swagger/swagger");

const app = express();
const port = 3000;

async function start() {
  try {
    const db = await connectDB();

    // Routes
    const llmsRoutes = require("./routes/LLMs")(db);
    app.use("/llms", llmsRoutes);

    // Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
}

start();
