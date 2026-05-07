import { config } from "dotenv";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "@/infrastructure/auth/auth.js";
import path from "path";

config({
  path: path.resolve(__dirname, "../../.env"),
  override: false,
});

const app = new Hono();

app.on(["POST", "GET"], "/api/v1/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => c.text("Identity Service"));

const port = Number(process.env.IDENTITY_PORT) || 8081;

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Identity Service running on http://localhost:${info.port}`);
});
