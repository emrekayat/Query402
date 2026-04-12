import { Router } from "express";
import { z } from "zod";
import { runDemoPaidRequest } from "../lib/demo-client.js";

const demoRunSchema = z.object({
  mode: z.enum(["search", "news", "scrape"]),
  provider: z.string().min(1),
  query: z.string().optional(),
  url: z.string().url().optional()
});

export const demoRouter = Router();

demoRouter.post("/api/demo/run", async (req, res, next) => {
  try {
    const parsed = demoRunSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const output = await runDemoPaidRequest(parsed.data);
    return res.status(output.ok ? 200 : 502).json(output);
  } catch (error) {
    return next(error);
  }
});
