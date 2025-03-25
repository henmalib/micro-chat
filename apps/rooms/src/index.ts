import * as grpc from "@grpc/grpc-js";
import { IRoomsServer, RoomsClient, RoomsService } from 'grpc/proto/rooms_grpc_pb'
import { GetRoomsRequest, GetRoomsResponse, Room } from "grpc/proto/rooms_pb";

function getServer() {
  const server = new grpc.Server();

  server.addService(RoomsService, {
    getRooms: (call, reply) => {
      console.log("Info", call.request.toObject())

      const response = new GetRoomsResponse()
      const room = new Room()

      room.setId("1")
      room.setName("test")

      response.addRooms(room)

      reply(null, response)
    }
  } satisfies IRoomsServer);

  return server;
}
const routeServer = getServer();
routeServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
  }
);

const client = new RoomsClient('localhost:50051', grpc.credentials.createInsecure());

const payload = new GetRoomsRequest()
payload.setUserid(1)

client.getRooms(payload, (err, v) => {
  console.log("Response", err, v?.toObject())
  process.exit(0)
})