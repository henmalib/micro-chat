import { AuthClient } from 'grpc/auth/v1/auth_grpc_pb';
import { promisifyClient } from './util/promisifyClient';
import * as grpc from '@grpc/grpc-js';

// TODO: take Url from ENV
export const clients = {
	// rooms: promisifyClient(
	//   new RoomsClient("127.0.0.1:50051", grpc.credentials.createInsecure())
	// ),
	auth: promisifyClient(
		// TODO: use zod
		new AuthClient(
			process.env.GRPC_AUTH_SERVER,
			grpc.credentials.createInsecure(),
		),
	),
};
