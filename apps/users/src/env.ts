import { z } from 'zod';

export const env = z
	.object({
		SERVER_HOST: z.string().default('0.0.0.0:50053'),
	})
	.parse(process.env);
