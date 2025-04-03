import { drizzle } from 'drizzle-orm/node-postgres';

const env = {
	DB_USER: process.env.PG_USER,
	DB_PASSWORD: process.env.PG_PASSWORD,
	DB_HOST: process.env.PG_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.PG_NAME,
};

const db = drizzle(
	`postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
);

export default db;
