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
import { userSchema } from '@shared/database/db/schema';
import type { IUserServer } from '@shared/grpc/users/v1/user_grpc_pb';
import { GetUserResponse } from '@shared/grpc/users/v1/user_pb';
import { eq } from 'drizzle-orm';

export const getUserMethod =
	(db: DBConnection): IUserServer['getUser'] =>
	async (payload, reply) => {
		const userId = payload.request.getUserId();

		const users = await db
			.select({
				avatarUrl: userSchema.avatarUrl,
				createdAt: userSchema.createdAt,
				username: userSchema.username,
			})
			.from(userSchema)
			.where(eq(userSchema.id, userId));

		if (!users?.length)
			return reply({
				code: grpc.status.NOT_FOUND,
				message: "User with such ID doesn't exists",
			});

		const response = new GetUserResponse();

		if (users[0].avatarUrl) response.setAvatarUrl(users[0].avatarUrl);
		response.setUsername(users[0].username);
		response.setId(userId);
		response.setCreatedAt(users[0].createdAt.getTime());

		reply(null, response);
	};
