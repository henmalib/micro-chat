import * as grpc from '@grpc/grpc-js';
import type { DBConnection } from '@shared/database';
import { userSchema } from '@shared/database/db/schema';
import type { IAuthServer } from '@shared/grpc/auth/v1/auth_grpc_pb';
import { type AuthRequest, AuthResponse } from '@shared/grpc/auth/v1/auth_pb';
import { zObject } from '@shared/utils/zodHelper';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createSession } from '../session';

const loginSchema = zObject<AuthRequest.AsObject>({
	email: z.string().email(),
	password: z.string(),
	userAgent: z.string().optional(),
});

export const authMethod =
	(db: DBConnection): IAuthServer['auth'] =>
	async (payload, reply) => {
		// TODO: handle error
		const body = await loginSchema.parseAsync(payload.request.toObject());

		const dbUser = await db
			.select({
				id: userSchema.id,
				email: userSchema.email,
				passwordHash: userSchema.passwordHash,
				pepper: userSchema.pepper,
			})
			.from(userSchema)
			.where(eq(userSchema.email, body.email))
			.limit(1)
			.execute();

		if (!dbUser?.length)
			return reply(
				{
					message: 'No user were found with this email',
					code: grpc.status.NOT_FOUND,
				},
				null,
			);

		const user = dbUser[0];

		const isRightPass = await bcrypt.compare(
			body.password + user.pepper,
			user.passwordHash,
		);
		if (!isRightPass) {
			return reply(
				{ message: 'Wrong password', code: grpc.status.INVALID_ARGUMENT },
				null,
			);
		}

		// TODO: May throw an error, we should handle it
		const session = await createSession(db, user.id, body.userAgent);

		const response = new AuthResponse();
		response.setToken(session.token);
		response.setUserId(session.userId);

		reply(null, response);
	};
