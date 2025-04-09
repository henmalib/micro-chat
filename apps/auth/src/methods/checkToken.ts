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
import type { DBConnection } from '@shared/database';
import { sessionSchema } from '@shared/database/db/schema';
import type { IAuthServer } from '@shared/grpc/auth/v1/auth_grpc_pb';
import { CheckTokenResponse } from '@shared/grpc/auth/v1/auth_pb';
import { eq } from 'drizzle-orm';

export const checkTokenMethod =
	(db: DBConnection): IAuthServer['checkToken'] =>
	async (payload, reply) => {
		// TODO: use redis
		const token = payload.request.getToken();

		const session = await db
			.select({
				userId: sessionSchema.userId,
			})
			.from(sessionSchema)
			.where(eq(sessionSchema.token, token))
			.execute();

		if (!session.length)
			reply({
				code: grpc.status.NOT_FOUND,
				message: "Session with such token doesn't exists",
			});

		const response = new CheckTokenResponse();
		response.setUserId(session[0].userId);

		reply(null, response);
	};
