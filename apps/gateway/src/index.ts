import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import v1AuthHandler from './enpoints/auth/v1/auth';

const app = new Hono();

// TODO: cors
// TODO: use RS256 jwt, check tokens here
// TODO: generate OpenAPI?

app.route('/auth/v1', v1AuthHandler);

serve(app);
