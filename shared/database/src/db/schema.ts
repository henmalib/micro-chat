import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

export const permissionEnum = pgEnum('permission_enum', ['ADMIN', 'USER']);

export const userSchema = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		username: text('username').notNull().unique(),
		email: text('email').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		pepper: text('pepper').notNull(),
		avatarUrl: text('avatar_url'),
		permission: permissionEnum('permission').default('USER').notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [uniqueIndex('email_index').on(table.email)],
);

export const sessionSchema = pgTable(
	'sessions',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => userSchema.id, { onDelete: 'cascade' }),
		token: text('token').notNull().unique(),
		userAgent: text('ua'),
		lastUsage: timestamp('last_use').defaultNow().notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [uniqueIndex('token_index').on(table.token)],
);
