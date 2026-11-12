import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleGenerate } from "./server/generate.js";

// Runs the same /api/generate handler used on Vercel inside `npm run dev` and `npm run preview`,
// so the Gemini key stays on the server side locally too.
function aiProxy(env) {
  const middleware = (req, res, next) => {
    if (!req || !req.url?.startsWith("/api/generate")) return next();
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      let body;
      try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
      const out = await handleGenerate({ method: req.method, body, env, ip: req.socket?.remoteAddress });
      res.statusCode = out.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(out.json));
    });
  };
  return {
    name: "ai-proxy",
    // Braces matter: returning a function from these hooks makes Vite treat it as a post-middleware hook.
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // "" = also load non-VITE_ vars (server-only keys)
  return {
    plugins: [react(), aiProxy(env)],
    server: { port: 5173 },
  };
});
