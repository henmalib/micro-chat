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

import { drizzle } from 'drizzle-orm/node-postgres';

const env = {
	DB_USER: process.env.PG_USER,
	DB_PASSWORD: process.env.PG_PASSWORD,
	DB_HOST: process.env.PG_HOST,
	DB_PORT: process.env.PG_PORT,
	DB_NAME: process.env.PG_DB,
};

export const initDBConnection = () => {
	const connection = drizzle(
		`postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
	);

	return connection;
};

export type DBConnection = ReturnType<typeof initDBConnection>;
