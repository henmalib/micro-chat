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
		response.setCreatedAt(users[0].createdAt);

		reply(null, response);
	};
