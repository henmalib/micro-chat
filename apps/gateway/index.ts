import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/rooms", async () => {});

serve(app);
