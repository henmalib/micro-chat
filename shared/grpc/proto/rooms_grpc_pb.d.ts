// GENERATED CODE -- DO NOT EDIT!

// package: rooms.rpc
// file: rooms.proto

import * as rooms_pb from "./rooms_pb";
import * as grpc from "@grpc/grpc-js";

interface IRoomsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getRooms: grpc.MethodDefinition<rooms_pb.GetRoomsRequest, rooms_pb.GetRoomsResponse>;
}

export const RoomsService: IRoomsService;

export interface IRoomsServer extends grpc.UntypedServiceImplementation {
  getRooms: grpc.handleUnaryCall<rooms_pb.GetRoomsRequest, rooms_pb.GetRoomsResponse>;
}

export class RoomsClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getRooms(argument: rooms_pb.GetRoomsRequest, callback: grpc.requestCallback<rooms_pb.GetRoomsResponse>): grpc.ClientUnaryCall;
  getRooms(argument: rooms_pb.GetRoomsRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<rooms_pb.GetRoomsResponse>): grpc.ClientUnaryCall;
  getRooms(argument: rooms_pb.GetRoomsRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<rooms_pb.GetRoomsResponse>): grpc.ClientUnaryCall;
}
