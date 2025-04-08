import * as grpc from '@grpc/grpc-js';
import { initDBConnection } from '@shared/database';
import {
	type IUserServer,
	UserService,
} from '@shared/grpc/users/v1/user_grpc_pb';
import { wrapGRPCServerError } from '@shared/utils';
import { env } from './env';
import { getUserMethod } from './methods/getUser';

const db = initDBConnection();

function getServer() {
	const server = new grpc.Server();

	server.addService(UserService, {
		getUser: wrapGRPCServerError(getUserMethod(db)),
	} satisfies IUserServer);

	return server;
}

const routeServer = getServer();

routeServer.bindAsync(
	env.SERVER_HOST,
	grpc.ServerCredentials.createInsecure(),
	() => {},
);
