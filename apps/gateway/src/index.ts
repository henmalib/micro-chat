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
