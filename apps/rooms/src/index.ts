import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { RoomService } from "../../../shared/grpc/proto/rooms_pb";

const PROTO_PATH = path.join(__dirname, "node_modules/grpc/rpc/rooms.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

function getServer() {
  const server = new grpc.Server();

  server.addService(RoomService, {});

  return server;
}
var routeServer = getServer();
routeServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    routeServer.start();
  }
);
