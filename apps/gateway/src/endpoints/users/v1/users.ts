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
