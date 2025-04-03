import { z } from 'zod';

export const env = z
	.object({
		JWT_SECRET: z.string().min(32, 'JWT_SECRET is too short'),
		REFRESH_SECRET: z.string().min(32, 'REFRESH_SECRET is too short'),
		SERVER_HOST: z.string().default('0.0.0.0:50052'),
	})
	.parse(process.env);
