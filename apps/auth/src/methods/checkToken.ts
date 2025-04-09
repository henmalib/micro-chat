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
			.where(eq(sessionSchema.token, token));

		if (!session.length)
			reply({
				code: grpc.status.NOT_FOUND,
				message: "Session with such token doesn't exists",
			});

		const response = new CheckTokenResponse();
		response.setUserId(session[0].userId);

		reply(null, response);
	};
