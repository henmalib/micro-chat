import { zValidator } from '@hono/zod-validator';
import { AuthRequest, RegisterRequest } from '@shared/grpc/auth/v1/auth_pb';
import { Hono } from 'hono';
import { z } from 'zod';
import { clients } from '../../../constants';
import { ErrorCodes, getErrorObject } from '../../../util/errorResponse';
import { HttpStatus } from '../../../util/httpCodes';

const app = new Hono();

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	username: z.string().min(3),
});

// TODO: wrap zValidator
app.post('/login', zValidator('json', loginSchema), async (ctx) => {
	const body = ctx.req.valid('json');
	const userAgent = ctx.req.header('User-Agent');

	const payload = new AuthRequest();
	payload.setEmail(body.email);
	payload.setPassword(body.password);
	if (userAgent) payload.setUserAgent(userAgent);

	try {
		const response = await clients.auth.auth(payload);

		return ctx.json({
			userId: response.getUserId(),
			accessToken: response.getToken(),
		});
	} catch {
		return ctx.json(
			getErrorObject(ErrorCodes.WRONG_PASS_EMAIL),
			HttpStatus.BAD_REQUEST,
		);
	}
});

app.post('/register', zValidator('json', registerSchema), async (ctx) => {
	const body = ctx.req.valid('json');
	const userAgent = ctx.req.header('User-Agent');

	const payload = new RegisterRequest();
	payload.setEmail(body.email);
	payload.setPassword(body.password);
	payload.setUsername(body.username);
	if (userAgent) payload.setUserAgent(userAgent);

	try {
		const response = await clients.auth.register(payload);

		return ctx.json(
			{
				userId: response.getUserId(),
				accessToken: response.getToken(),
			},
			HttpStatus.CREATED,
		);
	} catch (e) {
		if (!(e instanceof Error)) throw e;

		return ctx.json({
			// TODO: type Grpc Error
			// TODO: map to a propper error
			// @ts-ignore
			code: e.code,
			message: e.message,
		});
	}
});

export default app;
