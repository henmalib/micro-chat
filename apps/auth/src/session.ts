import type { DBConnection } from '@shared/database';
import { sessionSchema } from '@shared/database/db/schema';
import { getRandomInt } from '@shared/utils';

const generateToken = async (
	userId: number,
	userAgent: string,
): Promise<string> => {
	const int = getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
	const info = `${userId}:${Date.now()}:${int}:${userAgent}`;

	const encoder = new TextEncoder();
	const data = encoder.encode(info);
	const hash = await window.crypto.subtle.digest('SHA-256', data);

	const decoder = new TextDecoder();
	return decoder.decode(hash);
};

export const createSession = async (
	db: DBConnection,
	userId: number,
	userAgent: string,
) => {
	const token = await generateToken(userId, userAgent);

	const [session] = await db
		.insert(sessionSchema)
		.values({
			token,
			userId,
			userAgent,
		})
		.returning();

	return session;
};
