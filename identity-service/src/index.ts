import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createAuthInstance } from "@/infrastructure/auth/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const result = config({
  path: path.resolve(__dirname, "../.env"),
  override: false,
});
dotenvExpand.expand(result);

const app = new Hono();

app.on(["POST", "GET"], "/api/v1/auth/**", (c) => {
  const { auth } = createAuthInstance();
  return auth.handler(c.req.raw);
});

app.get("/", (c) => c.text("Identity Service"));

const port = Number(process.env.IDENTITY_PORT) || 8081;

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Identity Service running on http://localhost:${info.port}`);
});
