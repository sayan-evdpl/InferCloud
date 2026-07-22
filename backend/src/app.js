import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["PUT", "PATCH", "DELETE", "GET", "POST", "QUERY", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.static("../public"));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ limit: "16kb", extended: true }));

app.use(cookieParser());

import healthRoute from "./routes/health.routes.js";
import gpuRoute from "./routes/gpu.routes.js";
import chatRoute from "./routes/chat.routes.js";

app.use("/api/v1", healthRoute);
app.use("/api/v1/gpus", rateLimiter(60, 60000), gpuRoute);
app.use("/api/v1/chat", rateLimiter(60, 60000), chatRoute);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    statusCode,
    message,
    success: false,
    errors: err.errors || []
  });
});

export default app;
