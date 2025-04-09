import * as grpc from '@grpc/grpc-js';
import { initDBConnection } from '@shared/database';
import {
	AuthService,
	type IAuthServer,
} from '@shared/grpc/auth/v1/auth_grpc_pb';
import { wrapGRPCServerError } from '@shared/utils';
import { env } from './env';
import { authMethod } from './methods/auth';
import { checkTokenMethod } from './methods/checkToken';
import { registerMethod } from './methods/register';

const db = initDBConnection();

function getServer() {
	const server = new grpc.Server();

	server.addService(AuthService, {
		auth: wrapGRPCServerError(authMethod(db)),
		checkToken: wrapGRPCServerError(checkTokenMethod(db)),
		register: wrapGRPCServerError(registerMethod(db)),
	} satisfies IAuthServer);

	return server;
}

const routeServer = getServer();

routeServer.bindAsync(
	env.SERVER_HOST,
	grpc.ServerCredentials.createInsecure(),
	() => {},
);
