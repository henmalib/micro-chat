import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { GetRoomsRequest } from "grpc/rooms/v1/rooms_pb";
import { clients } from "./constants";
import v1AuthHandler from "./enpoints/auth/v1/auth";

const app = new Hono();

app.route("/auth/v1", v1AuthHandler);

app.get("/", async (ctx) => {
  const payload = new GetRoomsRequest();
  payload.setUserId(1);

  const response = await clients.rooms.getRooms(payload);

  return ctx.json(response.toObject());
});

serve(app);
