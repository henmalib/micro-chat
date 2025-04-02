import { RoomsClient } from "grpc/rooms/v1/rooms_grpc_pb";
import { AuthClient } from "grpc/auth/v1/auth_grpc_pb";
import { promisifyClient } from "./util/promisifyClient";
import * as grpc from "@grpc/grpc-js";

// TODO: take Url from ENV
export const clients = {
  rooms: promisifyClient(
    new RoomsClient("127.0.0.1:50051", grpc.credentials.createInsecure())
  ),
  auth: promisifyClient(
    new AuthClient("127.0.0.1:50052", grpc.credentials.createInsecure())
  ),
};
