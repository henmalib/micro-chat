import { type ZodSchema, z } from 'zod';

export const zObject = <Schema extends Record<string, unknown>>(
	obj: {
		[key in keyof Schema]: ZodSchema;
	},
) => {
	return z.object(obj);
};
