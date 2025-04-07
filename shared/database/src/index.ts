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
