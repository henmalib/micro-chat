import * as grpc from '@grpc/grpc-js';
import { initDBConnection } from '@shared/database';
import { userSchema } from '@shared/database/db/schema';
import {
	AuthService,
	type IAuthServer,
} from '@shared/grpc/auth/v1/auth_grpc_pb';
import { AuthResponse, RegisterResponse } from '@shared/grpc/auth/v1/auth_pb';
import { getRandomInt } from '@shared/utils';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { env } from './env';
import { createSession } from './session';

const db = initDBConnection();

const registerSchema = z.object({
	email: z.string().email('Email has wrong format'),
	password: z.string().min(8, 'Password should be at least 8 characters long'),
	nickname: z.string().min(3, "Nickname can't be shorted than 3 charatres"),
	userAgent: z.string(),
});

const characters = ['qwertyuiopasdfghjklzxcvbnm'];
characters.push(characters[0].toUpperCase());
characters.push(',./p[;\'"1234567890');
const ch = characters.join('');
const generatePeper = (length = 8) => {
	let result = '';

	for (let i = 0; i < length; i++) {
		result += ch[getRandomInt(0, ch.length - 1)];
	}

	return result;
};

function getServer() {
	const server = new grpc.Server();

	server.addService(AuthService, {
		auth: async (payload, reply) => {
			const body = payload.request;

			const dbUser = await db
				.select({
					id: userSchema.id,
					email: userSchema.email,
					passwordHash: userSchema.passwordHash,
					pepper: userSchema.pepper,
				})
				.from(userSchema)
				.where(eq(userSchema.email, body.getEmail()))
				.limit(1)
				.execute();

			if (!dbUser?.length)
				return reply(new Error('No user were found with this email'), null);

			const user = dbUser[0];

			const isRightPass = await bcrypt.compare(
				body.getPassword() + user.pepper,
				user.passwordHash,
			);
			if (!isRightPass) {
				return reply(new Error('Wrong password'), null);
			}

			// TODO: May throw an error, we should handle it
			const session = await createSession(db, user.id, body.getUserAgent());

			const response = new AuthResponse();
			response.setToken(session.token);
			response.setUserId(session.userId);

			reply(null, response);
		},
		checkToken: () => {},
		refreshToken: () => {},
		register: async (payload, reply) => {
			const body = await registerSchema.parseAsync(payload.request.toObject());

			const pepper = generatePeper(8);
			const passwordHash = await bcrypt.hash(body.password + pepper, 12);

			try {
				// Insert will throw an error because email is unique field
				const [user] = await db
					.insert(userSchema)
					.values({
						email: body.email,
						username: body.nickname,
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
				return reply(new Error('User with such email already exists'), null);
			}
		},
	} satisfies IAuthServer);

	return server;
}

const routeServer = getServer();

routeServer.bindAsync(
	env.SERVER_HOST,
	grpc.ServerCredentials.createInsecure(),
	() => {},
);
