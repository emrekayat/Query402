import { Router } from "express";
import { z } from "zod";
import { runPaidRequest } from "../lib/demo-client.js";

const paidRunSchema = z.object({
  mode: z.enum(["search", "news", "scrape"]),
  provider: z.string().min(1),
  query: z.string().optional(),
  url: z.string().url().optional()
});

export const paidRouter = Router();

paidRouter.post("/api/paid/run", async (req, res, next) => {
  try {
    const parsed = paidRunSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const output = await runPaidRequest(parsed.data);
    if (!output.ok) {
      return res.status(502).json({
        error: "Payment execution failed",
        status: output.status,
        payload: output.payload
      });
    }

    return res.status(200).json(output.payload);
  } catch (error) {
    return next(error);
  }
});
