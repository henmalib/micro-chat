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

import { z } from 'zod';

export const env = z
	.object({
		JWT_SECRET: z.string().min(32, 'JWT_SECRET is too short'),
		REFRESH_SECRET: z.string().min(32, 'REFRESH_SECRET is too short'),
		SERVER_HOST: z.string().default('0.0.0.0:50052'),
	})
	.parse(process.env);
