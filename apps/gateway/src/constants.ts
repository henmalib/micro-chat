import * as grpc from '@grpc/grpc-js';
import { AuthClient } from '@shared/grpc/auth/v1/auth_grpc_pb';
import { RoomsClient } from '@shared/grpc/rooms/v1/rooms_grpc_pb';
import { z } from 'zod';
import { promisifyClient } from './util/promisifyClient';

const env = z
	.object({
		GRPC_AUTH_SERVER: z.string(),
		GRPC_ROOM_SERVER: z.string(),
	})
	.parse(process.env);

export const clients = {
	rooms: promisifyClient(
		new RoomsClient(env.GRPC_ROOM_SERVER, grpc.credentials.createInsecure()),
	),
	auth: promisifyClient(
		new AuthClient(env.GRPC_AUTH_SERVER, grpc.credentials.createInsecure()),
	),
};
