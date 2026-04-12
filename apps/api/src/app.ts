import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public.js";
import { protectedRouter } from "./routes/protected.js";
import { demoRouter } from "./routes/demo.js";
import { createX402Middleware } from "./lib/x402.js";
import { logger } from "./lib/logger.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "incoming request");
  next();
});

app.use(publicRouter);
app.use(createX402Middleware());
app.use(protectedRouter);
app.use(demoRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({
    error: error.message,
    type: "internal_error"
  });
});
