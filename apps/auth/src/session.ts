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
