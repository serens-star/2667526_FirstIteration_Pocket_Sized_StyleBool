// Vercel serverless function: POST /api/generate
import { handleGenerate } from "../server/generate.js";

export default async function handler(req, res) {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  const out = await handleGenerate({ method: req.method, body: req.body, env: process.env, ip });
  res.status(out.status).json(out.json);
}
