import { createMiddleware } from 'hono/factory';

interface CacheProps {
	maxAge?: number;
	type?: 'private' | 'public';
}

export const clientCache = (props: CacheProps = {}) => {
	props.maxAge ??= 600;
	props.type ??= 'private';

	return createMiddleware(async (context, next) => {
		context.header(
			'Cache-Control',
			`${props.type}, max-age=${props.maxAge}, must-revalidate`,
		);

		await next();
	});
};
