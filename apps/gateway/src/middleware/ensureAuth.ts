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

import { CheckTokenRequest } from '@shared/grpc/auth/v1/auth_pb';
import { createMiddleware } from 'hono/factory';
import { clients } from '../constants';
import { ErrorCodes, getErrorObject } from '../util/errorResponse';
import { HttpStatus } from '../util/httpCodes';

interface Env {
	Variables: {
		userId: number;
	};
}

type HonoContext = Parameters<Parameters<typeof createMiddleware<Env>>[0]>[0];
const unauthorized = (context: HonoContext) => {
	return context.json(
		getErrorObject(ErrorCodes.UNAUTHORIZED),
		HttpStatus.UNAUTHORIZED,
	);
};

export const ensureAuth = () => {
	return createMiddleware<Env>(async (context, next) => {
		const authorization = context.req.header('Authorization');
		if (!authorization) return unauthorized(context);

		const [type, token] = authorization.split(' ');
		if (type !== 'Bearer') return unauthorized(context);

		const payload = new CheckTokenRequest();
		payload.setToken(token);

		const [error, response] = await clients.auth.checkTokenSafe(payload);

		if (error) return unauthorized(context);
		context.set('userId', response.getUserId());

		await next();
	});
};
