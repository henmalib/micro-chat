// Original file: /home/hen/Documents/Projects/micro-chat/shared/grpc/rpc/rooms.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetRoomsRequest as _rooms_rpc_GetRoomsRequest, GetRoomsRequest__Output as _rooms_rpc_GetRoomsRequest__Output } from '../../rooms/rpc/GetRoomsRequest';
import type { GetRoomsResponse as _rooms_rpc_GetRoomsResponse, GetRoomsResponse__Output as _rooms_rpc_GetRoomsResponse__Output } from '../../rooms/rpc/GetRoomsResponse';

export interface RoomsClient extends grpc.Client {
  GetRooms(argument: _rooms_rpc_GetRoomsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  GetRooms(argument: _rooms_rpc_GetRoomsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  GetRooms(argument: _rooms_rpc_GetRoomsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  GetRooms(argument: _rooms_rpc_GetRoomsRequest, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  getRooms(argument: _rooms_rpc_GetRoomsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  getRooms(argument: _rooms_rpc_GetRoomsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  getRooms(argument: _rooms_rpc_GetRoomsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  getRooms(argument: _rooms_rpc_GetRoomsRequest, callback: grpc.requestCallback<_rooms_rpc_GetRoomsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface RoomsHandlers extends grpc.UntypedServiceImplementation {
  GetRooms: grpc.handleUnaryCall<_rooms_rpc_GetRoomsRequest__Output, _rooms_rpc_GetRoomsResponse>;
  
}

export interface RoomsDefinition extends grpc.ServiceDefinition {
  GetRooms: MethodDefinition<_rooms_rpc_GetRoomsRequest, _rooms_rpc_GetRoomsResponse, _rooms_rpc_GetRoomsRequest__Output, _rooms_rpc_GetRoomsResponse__Output>
}
