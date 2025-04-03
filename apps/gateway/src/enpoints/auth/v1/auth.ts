import { zValidator } from '@hono/zod-validator';
import { AuthRequest } from 'grpc/auth/v1/auth_pb';
import { Hono } from 'hono';
import { z } from 'zod';
import { clients } from '../../../constants';
import { ErrorCodes, getErrorObject } from '../../../util/errorResponse';

const app = new Hono();

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

// The're currently the same, but they might change in the future
// Maybe birth date or smth
const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

app.post('/login', zValidator('json', loginSchema), async (ctx) => {
	const body = ctx.req.valid('json');

	const payload = new AuthRequest();
	payload.setEmail(body.email);
	payload.setPassword(body.password);

	try {
		const response = await clients.auth.auth(payload);

		return ctx.json({
			accessToken: response.getToken(),
			refreshToken: response.getRefresh(),
		});
	} catch {
		// TODO: create a constant object with all http codes
		return ctx.json(getErrorObject(ErrorCodes.WRONG_PASS_EMAIL), 400);
	}
});

app.post('/register', zValidator('json', registerSchema), async (ctx) => {
	const body = ctx.req.valid('json');
	console.log(body);
});

export default app;
