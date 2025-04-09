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

	const [error, response] = await clients.auth.authSafe(payload);
	if (error)
		return ctx.json(
			getErrorObject(ErrorCodes.WRONG_PASS_EMAIL),
			HttpStatus.BAD_REQUEST,
		);

	return ctx.json({
		userId: response.getUserId(),
		accessToken: response.getToken(),
	});
});

app.post('/register', zValidator('json', registerSchema), async (ctx) => {
	const body = ctx.req.valid('json');
	const userAgent = ctx.req.header('User-Agent');

	const payload = new RegisterRequest();
	payload.setEmail(body.email);
	payload.setPassword(body.password);
	payload.setUsername(body.username);
	if (userAgent) payload.setUserAgent(userAgent);

	const [error, response] = await clients.auth.registerSafe(payload);

	if (error)
		return ctx.json({
			// TODO: map to a propper error
			code: error.code,
			message: error.message,
		});

	return ctx.json(
		{
			userId: response.getUserId(),
			accessToken: response.getToken(),
		},
		HttpStatus.CREATED,
	);
});

export default app;
