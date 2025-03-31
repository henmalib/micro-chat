import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { RoomsClient } from "grpc/dist/rooms/v1/rooms_grpc_pb";
import * as grpc from "@grpc/grpc-js"
import { GetRoomsRequest, GetRoomsResponse } from "grpc/dist/rooms/v1/rooms_pb";
import { promisifyClient } from "./client";

const clients = {
    rooms: promisifyClient(new RoomsClient("127.0.0.1:50051", grpc.credentials.createInsecure()))
}

const app = new Hono();

app.get("/", async (ctx) => {
    const payload = new GetRoomsRequest()
    payload.setUserid(1)

    const response = await clients.rooms.getRooms(payload);

    return ctx.json(response.toObject())
});

serve(app);
