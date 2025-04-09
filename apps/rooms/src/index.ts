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
import { type IRoomsServer, RoomsService } from 'grpc/rooms/v1/rooms_grpc_pb';
import { GetRoomsResponse, Room } from 'grpc/rooms/v1/rooms_pb';

function getServer() {
	const server = new grpc.Server();

	server.addService(RoomsService, {
		getRooms: (call, reply) => {
			console.log('Info', call.request.toObject());

			const response = new GetRoomsResponse();
			const room = new Room();

			room.setId('1');
			room.setName('test');

			response.addRooms(room);

			reply(null, response);
		},
	} satisfies IRoomsServer);

	return server;
}
const routeServer = getServer();

routeServer.bindAsync(
	'0.0.0.0:50051',
	grpc.ServerCredentials.createInsecure(),
	() => {},
);
