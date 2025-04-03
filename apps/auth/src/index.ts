import * as grpc from '@grpc/grpc-js';
import db from '@shared/database';
import { userSchema } from '@shared/database/db/schema';
import {
	AuthService,
	type IAuthServer,
} from '@shared/grpc/auth/v1/auth_grpc_pb';
import { AuthResponse, RegisterResponse } from '@shared/grpc/auth/v1/auth_pb';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from './env';

const registerSchema = z.object({
	email: z.string().email('Email has wrong format'),
	password: z.string().min(8, 'Password should be at least 8 characters long'),
	nickname: z.string().min(3, "Nickname can't be shorted than 3 charatres"),
});

function getRandomInt(min: number, max: number) {
	const mn = Math.ceil(min);
	const mx = Math.floor(max);
	return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

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

const generateTokens = (userId: number, hash: string) => {
	const token = jwt.sign(
		{
			userId: userId,
		},
		env.JWT_SECRET,
		{ expiresIn: '10m' },
	);

	// TODO: save refresh token in db
	// TODO: reset old refresh token, create a new one with same exp date
	const refresh = jwt.sign(
		{
			userId: userId,
		},
		env.REFRESH_SECRET + hash,
		{ expiresIn: '30d' },
	);

	return {
		token,
		refresh,
	};
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

			const { refresh, token } = generateTokens(user.id, user.passwordHash);

			const response = new AuthResponse();
			response.setRefresh(refresh);
			response.setToken(token);

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

				const response = new RegisterResponse();
				const { refresh, token } = generateTokens(user.id, passwordHash);

				response.setToken(token);
				response.setRefresh(refresh);
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

// TODO: handle from ENV
routeServer.bindAsync(
	env.SERVER_HOST,
	grpc.ServerCredentials.createInsecure(),
	() => {},
);
