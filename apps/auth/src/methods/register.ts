import * as grpc from '@grpc/grpc-js';
import type { DBConnection } from '@shared/database';
import { userSchema } from '@shared/database/db/schema';
import type { IAuthServer } from '@shared/grpc/auth/v1/auth_grpc_pb';
import {
	type RegisterRequest,
	RegisterResponse,
} from '@shared/grpc/auth/v1/auth_pb';
import { zObject } from '@shared/utils/zodHelper';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { createSession } from '../session';
import { generatePeper } from '../utils/generatePepper';

const registerSchema = zObject<RegisterRequest.AsObject>({
	email: z.string().email('Email has wrong format'),
	password: z.string().min(8, 'Password should be at least 8 characters long'),
	username: z.string().min(3, "Nickname can't be shorted than 3 charatres"),
	userAgent: z.string(),
});

export const registerMethod =
	(db: DBConnection): IAuthServer['register'] =>
	async (payload, reply) => {
		// TODO: is parse fails it crashes the whole server
		// TODO: Make some sort of a wrapper with safe reply
		const body = await registerSchema.parseAsync(payload.request.toObject());

		const pepper = generatePeper(8);
		const passwordHash = await bcrypt.hash(body.password + pepper, 12);

		try {
			// Insert will throw an error because email is unique field
			const [user] = await db
				.insert(userSchema)
				.values({
					email: body.email,
					username: body.username,
					pepper,
					passwordHash,
				})
				.returning();

			const session = await createSession(db, user.id, body.userAgent);

			const response = new RegisterResponse();

			response.setToken(session.token);
			response.setUserId(user.id);

			return reply(null, response);
		} catch (e) {
			return reply(
				{
					message: 'User with such email or username already exists',
					code: grpc.status.ALREADY_EXISTS,
				},
				null,
			);
		}
	};
