import {
	date,
	integer,
	pgTable,
	serial,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

export const userSchema = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		username: text('username').notNull().unique(),
		email: text('email').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		pepper: text('pepper'),
		avatarUrl: text('avatar_url'),

		createdAt: date('created_at').defaultNow().notNull(),
	},
	(table) => [uniqueIndex('email_index').on(table.email)],
);

export const sessionSchema = pgTable(
	'sessions',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => userSchema.id),
		refreshToken: text('refresh_token').notNull().unique(),
	},
	(table) => [uniqueIndex('refresh_index').on(table.refreshToken)],
);
