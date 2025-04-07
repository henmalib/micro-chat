import { randomBytes } from 'node:crypto';
import type { DBConnection } from '@shared/database';
import { sessionSchema } from '@shared/database/db/schema';

export const createSession = async (
	db: DBConnection,
	userId: number,
	userAgent?: string,
) => {
	const token = randomBytes(64).toString('hex');

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
