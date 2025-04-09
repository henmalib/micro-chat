import * as grpc from '@grpc/grpc-js';
import type { handleUnaryCall } from '@grpc/grpc-js';

// This function is too generic to be properly typed

// biome-ignore lint/suspicious/noExplicitAny: using unknown here wouldn't allow this function to be used anywhere without typing
export const wrapGRPCServerError = <T extends handleUnaryCall<any, any>>(
	next: T,
): T => {
	// @ts-ignore
	return async (p, reply) => {
		try {
			await next(p, reply);
		} catch (e) {
			console.error('Uncaught error:', e);

			const message =
				e &&
				typeof e === 'object' &&
				'message' in e &&
				typeof e.message === 'string'
					? e.message
					: 'Unknown Error';

			return reply(
				{
					code: grpc.status.UNKNOWN,
					message,
				},
				null,
			);
		}
	};
};
