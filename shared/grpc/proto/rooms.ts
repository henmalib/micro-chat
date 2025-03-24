import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RoomsClient as _rooms_rpc_RoomsClient, RoomsDefinition as _rooms_rpc_RoomsDefinition } from './rooms/rpc/Rooms';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  rooms: {
    rpc: {
      GetRoomsRequest: MessageTypeDefinition
      GetRoomsResponse: MessageTypeDefinition
      Room: MessageTypeDefinition
      Rooms: SubtypeConstructor<typeof grpc.Client, _rooms_rpc_RoomsClient> & { service: _rooms_rpc_RoomsDefinition }
    }
  }
}

