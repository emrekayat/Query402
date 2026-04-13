import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public.js";
import { protectedRouter } from "./routes/protected.js";
import { paidRouter } from "./routes/demo.js";
import { createX402Middleware } from "./lib/x402.js";
import { logger } from "./lib/logger.js";
import { config } from "./lib/config.js";

export const app = express();

const defaultDevelopmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const allowedOrigins =
  config.corsOrigins.length > 0
    ? config.corsOrigins
    : config.NODE_ENV === "production"
      ? []
      : defaultDevelopmentOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    exposedHeaders: ["payment-required", "payment-response", "x-payment-response"]
  })
);
app.use(express.json());
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "incoming request");
  next();
});

app.use(publicRouter);
app.use(createX402Middleware());
app.use(protectedRouter);
app.use(paidRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({
    error: error.message,
    type: "internal_error"
  });
});
