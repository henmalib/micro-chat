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

// Mostly copied from:
// https://github.com/timostamm/protobuf-ts/discussions/345#discussioncomment-3106495

import type {
	CallOptions,
	Client,
	ClientUnaryCall,
	Metadata,
	ServiceError,
} from '@grpc/grpc-js';

type OriginalCall<T, U> = (
	request: T,
	metadata: Metadata,
	options: Partial<CallOptions>,
	callback: (err: ServiceError | null, res?: U) => void,
) => ClientUnaryCall;

type PromisifiedCall<T, U> = (
	request: T,
	metadata?: Metadata,
	options?: Partial<CallOptions>,
) => Promise<U>;

interface GRPCError {
	code: number;
	message: string;
}

type SafeCallResult<U> = [GRPCError, null | undefined] | [null | undefined, U];
type SafePromisifiedCall<T, U> = (
	request: T,
	metadata?: Metadata,
	options?: Partial<CallOptions>,
) => Promise<SafeCallResult<U>>;

export type PromisifiedClient<C> = { $: C } & {
	[prop in Exclude<keyof C, keyof Client>]: C[prop] extends OriginalCall<
		infer T,
		infer U
	>
		? PromisifiedCall<T, U>
		: never;
};

export type SafeClient<C> = {
	[prop in Exclude<
		keyof PromisifiedClient<C>,
		symbol
	> as `${prop}Safe`]: PromisifiedClient<C>[prop] extends PromisifiedCall<
		infer T,
		infer U
	>
		? SafePromisifiedCall<T, U>
		: never;
};

export type BetterClient<C> = SafeClient<C> & PromisifiedClient<C>;

export function promisifyClient<C extends Client>(client: C) {
	return new Proxy(client, {
		get: (target, descriptor) => {
			const ds = descriptor.toString();

			const isSafe = ds.endsWith('Safe');

			const key = (
				isSafe ? ds.slice(0, -4) : descriptor
			) as keyof PromisifiedClient<C>;

			if (key === '$') return target;

			const func = target[key];
			if (typeof func === 'function')
				return (...args: unknown[]) => {
					const promise = new Promise((resolve, reject) =>
						func.call(
							target,
							...[
								...args,
								(err: unknown, res: unknown) =>
									err ? reject(err) : resolve(res),
							],
						),
					);

					if (!isSafe) return promise;

					return new Promise((resolve) => {
						promise
							.then((r) => resolve([null, r]))
							.catch((e) => resolve([e, null]));
					});
				};
		},
	}) as unknown as BetterClient<C>;
}
