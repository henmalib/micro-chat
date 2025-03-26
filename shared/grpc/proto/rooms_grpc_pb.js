// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var rooms_pb = require('./rooms_pb.js');

function serialize_rooms_rpc_GetRoomsRequest(arg) {
  if (!(arg instanceof rooms_pb.GetRoomsRequest)) {
    throw new Error('Expected argument of type rooms.rpc.GetRoomsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rooms_rpc_GetRoomsRequest(buffer_arg) {
  return rooms_pb.GetRoomsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rooms_rpc_GetRoomsResponse(arg) {
  if (!(arg instanceof rooms_pb.GetRoomsResponse)) {
    throw new Error('Expected argument of type rooms.rpc.GetRoomsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rooms_rpc_GetRoomsResponse(buffer_arg) {
  return rooms_pb.GetRoomsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var RoomsService = exports.RoomsService = {
  getRooms: {
    path: '/rooms.rpc.Rooms/GetRooms',
    requestStream: false,
    responseStream: false,
    requestType: rooms_pb.GetRoomsRequest,
    responseType: rooms_pb.GetRoomsResponse,
    requestSerialize: serialize_rooms_rpc_GetRoomsRequest,
    requestDeserialize: deserialize_rooms_rpc_GetRoomsRequest,
    responseSerialize: serialize_rooms_rpc_GetRoomsResponse,
    responseDeserialize: deserialize_rooms_rpc_GetRoomsResponse,
  },
};

exports.RoomsClient = grpc.makeGenericClientConstructor(RoomsService);
