/**
 * Copyright (C) 2025  henmalib
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
