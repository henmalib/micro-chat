import { Hono } from "hono";
import { clients } from "../../../constants";
import { AuthRequest } from "grpc/auth/v1/auth_pb";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

app.post("/login", zValidator("json", loginSchema), async (ctx) => {
  const body = ctx.req.valid("json");

  const payload = new AuthRequest();
  payload.setEmail(body.email);
  payload.setPassword(body.password);

  const response = await clients.auth.auth(payload);

  return ctx.json({
    accessToken: response.getToken(),
    refreshToken: response.getRefresh(),
  });
});

export default app;
