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
