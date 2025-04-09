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

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import v1AuthHandler from './endpoints/auth/v1/auth';
import v1UsersHandler from './endpoints/users/v1/users';

const app = new Hono();

// TODO: generate OpenAPI?

app.route('/auth/v1', v1AuthHandler);
app.route('/users/v1', v1UsersHandler);

serve({
	fetch: app.fetch,
	port: 3000,
});
