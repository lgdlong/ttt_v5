import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/infrastructure/auth/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenvExpand.expand(dotenv.config({ path: path.resolve(__dirname, "../../.env") }));

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://the1struleoffightclub.top"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

// Delegate all better-auth routes to the auth.handler
app.on(["POST", "GET", "OPTIONS"], "/api/v1/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Root route (Health Check)
app.get("/", (c) => c.json({
  service: "identity-service",
  status: "online",
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));

const port = Number(process.env.IDENTITY_PORT) || 8081;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Identity Service running on http://localhost:${port}`);
});