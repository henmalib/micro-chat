import { zValidator } from '@hono/zod-validator';
import { GetUserRequest } from '@shared/grpc/users/v1/user_pb';
import { Hono } from 'hono';
import z from 'zod';
import { clients } from '../../../constants';
import { clientCache } from '../../../middleware/cache';
import { ensureAuth } from '../../../middleware/ensureAuth';
import { ErrorCodes, getErrorObject } from '../../../util/errorResponse';
import { HttpStatus } from '../../../util/httpCodes';

const app = new Hono();

const schema = z.object({
	id: z.coerce
		.number()
		.int("User ID can't be a float")
		.positive('User ID should be greater than 0')
		.finite("User ID can' be Infinity"),
});

app.get(
	'/:id',
	ensureAuth(),
	clientCache(),
	zValidator('param', schema),
	async (ctx) => {
		const { id } = ctx.req.valid('param');

		const payload = new GetUserRequest();
		payload.setUserId(id);

		const [error, user] = await clients.users.getUserSafe(payload);

		if (error) {
			return ctx.json(
				getErrorObject(ErrorCodes.NOT_FOUND),
				HttpStatus.NOT_FOUND,
			);
		}

		return ctx.json({
			user: user.toObject(),
		});
	},
);

export default app;
