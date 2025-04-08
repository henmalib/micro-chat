export * from './wrapGRPCServerError';
export * from './zodHelper';

export function getRandomInt(min: number, max: number) {
	const mn = Math.ceil(min);
	const mx = Math.floor(max);
	return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}
