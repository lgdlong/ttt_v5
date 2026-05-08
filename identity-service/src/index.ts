import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createAuthInstance } from "@/infrastructure/auth/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenvExpand.expand(dotenv.config({ path: path.resolve(__dirname, "../../.env") }));

const { auth } = createAuthInstance();

const app = new Hono();

// Route: /api/v1/auth/sign-up/email
app.post("/api/v1/auth/sign-up/email", async (c) => {
  return await auth.handler(c.req.raw);
});

// Route: /api/v1/auth/sign-in/email
app.post("/api/v1/auth/sign-in/email", async (c) => {
  return await auth.handler(c.req.raw);
});

// Route: /api/v1/auth/get-session
app.get("/api/v1/auth/get-session", async (c) => {
  return await auth.handler(c.req.raw);
});

// Root route
app.get("/", (c) => c.text("Identity Service"));

const port = Number(process.env.IDENTITY_PORT) || 8081;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Identity Service running on http://localhost:${port}`);
});