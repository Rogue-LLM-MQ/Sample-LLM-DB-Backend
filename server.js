require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./swagger/swagger");

const app = express();
const port = 3000;

app.use(cors({
  origin: "*"
}));

/* Safer but worse for development
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("chrome-extension://")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
*/

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
