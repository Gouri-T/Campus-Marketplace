import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import crypto from "crypto";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const DEBUG_LOGS = String(process.env.DEBUG_LOGS || "true") === "true";

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

const allowedOrigins = Object.freeze([
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : []),
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();

  req.requestId = String(requestId);

  res.setHeader("X-Request-Id", req.requestId);

  const start = Date.now();

  if (DEBUG_LOGS) {
    console.log(
      JSON.stringify({
        type: "REQUEST_START",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        origin: req.headers.origin || null,
        ip: req.ip,
      })
    );
  }

  res.on("finish", () => {
    if (!DEBUG_LOGS) return;

    console.log(
      JSON.stringify({
        type: "REQUEST_END",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      })
    );
  });

  next();
});

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "college-marketplace-backend",
    message: "Backend is running",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    status: "healthy",
  });
});

app.get("/api/meta/ngo", (_req, res) => {
  res.json({
    ngo: {
      name: process.env.NGO_NAME || "Campus Partner NGO",
      email: process.env.NGO_EMAIL || "",
      phone: process.env.NGO_PHONE || "",
      upi: process.env.NGO_UPI || "",
      note:
        process.env.NGO_NOTE ||
        "Products marked donated are handed over by marketplace admin.",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(
    JSON.stringify({
      type: "REQUEST_ERROR",
      requestId: req.requestId || null,
      method: req.method,
      path: req.originalUrl,
      message: err.message || "Internal Server Error",
      stack: DEBUG_LOGS ? err.stack : undefined,
    })
  );

  res.status(500).json({
    message: err.message || "Internal Server Error",
    requestId: req.requestId || null,
  });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      JSON.stringify({
        type: "DB_CONNECTED",
        host: mongoose.connection.host,
        database: mongoose.connection.name,
      })
    );

    app.listen(PORT, HOST, () => {
      console.log(
        JSON.stringify({
          type: "SERVER_STARTED",
          message: "Campus Marketplace backend is running",
          host: HOST,
          port: PORT,
          environment: process.env.NODE_ENV || "development",
        })
      );
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "SERVER_START_FAILED",
        message: error.message,
        stack: error.stack,
      })
    );

    process.exit(1);
  }
};

start();