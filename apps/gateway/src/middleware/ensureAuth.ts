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
