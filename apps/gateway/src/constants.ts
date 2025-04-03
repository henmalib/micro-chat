import * as grpc from '@grpc/grpc-js';
import { AuthClient } from 'grpc/auth/v1/auth_grpc_pb';
import { RoomsClient } from 'grpc/rooms/v1/rooms_grpc_pb';
import { z } from 'zod';
import { promisifyClient } from './util/promisifyClient';

const env = z
	.object({
		GRPC_AUTH_SERVER: z.string().url(),
		GRPC_ROOM_SERVER: z.string().url(),

		LISTEN_HOST: z.string().url(),
	})
	.parse(process.env);

// TODO: take Url from ENV
export const clients = {
	rooms: promisifyClient(
		new RoomsClient(env.GRPC_ROOM_SERVER, grpc.credentials.createInsecure()),
	),
	auth: promisifyClient(
		// TODO: use zod
		new AuthClient(env.GRPC_AUTH_SERVER, grpc.credentials.createInsecure()),
	),
};
