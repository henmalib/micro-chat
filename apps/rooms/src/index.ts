import * as grpc from "@grpc/grpc-js";
import {
  RoomsService,
  type IRoomsServer,
} from "grpc/dist/rooms/v1/rooms_grpc_pb";
import { GetRoomsResponse, Room } from "grpc/dist/rooms/v1/rooms_pb";

function getServer() {
  const server = new grpc.Server();

  server.addService(RoomsService, {
    getRooms: (call, reply) => {
      console.log("Info", call.request.toObject());

      const response = new GetRoomsResponse();
      const room = new Room();

      room.setId("1");
      room.setName("test");

      response.addRooms(room);

      reply(null, response);
    },
  } satisfies IRoomsServer);

  return server;
}
const routeServer = getServer();

routeServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {}
);
