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
import { AuthClient } from '@shared/grpc/auth/v1/auth_grpc_pb';
import { RoomsClient } from '@shared/grpc/rooms/v1/rooms_grpc_pb';
import { UserClient } from '@shared/grpc/users/v1/user_grpc_pb';
import { z } from 'zod';
import { promisifyClient } from './util/promisifyClient';

const env = z
	.object({
		GRPC_AUTH_SERVER: z.string(),
		GRPC_ROOM_SERVER: z.string(),
		GRPC_USER_SERVER: z.string(),
	})
	.parse(process.env);

export const clients = {
	rooms: promisifyClient(
		new RoomsClient(env.GRPC_ROOM_SERVER, grpc.credentials.createInsecure()),
	),
	auth: promisifyClient(
		new AuthClient(env.GRPC_AUTH_SERVER, grpc.credentials.createInsecure()),
	),
	users: promisifyClient(
		new UserClient(env.GRPC_USER_SERVER, grpc.credentials.createInsecure()),
	),
};
