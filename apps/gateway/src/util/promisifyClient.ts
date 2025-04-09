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

type SafePromisifiedCall<T, U> = (
	request: T,
	metadata?: Metadata,
	options?: Partial<CallOptions>,
) => Promise<[GRPCError, U]>;

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
