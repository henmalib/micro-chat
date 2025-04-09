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

import {
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
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

export const chatSchema = pgTable('chats', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),

	createdAt: date('created_at').defaultNow().notNull(),
});

export const chatTopicSchema = pgTable(
	'chat_topics',
	{
		id: serial('id').primaryKey(),
		chatId: integer('chat_id')
			.notNull()
			.references(() => chatSchema.id, { onDelete: 'cascade' })
			.notNull(),
		name: text('name').notNull(),
	},
	(table) => [index('chat_idx').on(table.chatId)],
);

export const memberPermissionEnum = pgEnum('member_permission', [
	'CREATOR',
	'ADMIN',
	'MODERATOR',
	'MEMBER',
]);

export const chatMemberSchema = pgTable(
	'chat_members',
	{
		userId: integer('user_id')
			.references(() => userSchema.id, { onDelete: 'cascade' })
			.notNull(),
		chatId: integer('chat_id')
			.references(() => chatSchema.id, { onDelete: 'cascade' })
			.notNull(),
		type: memberPermissionEnum('type').default('MEMBER').notNull(),

		joinedAt: timestamp('joined_at').defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.chatId] })],
);

export const fileSchema = pgTable('files', {
	id: serial('id').primaryKey(),
	url: text('url').notNull(),
	ownerId: integer('owner_id')
		.references(() => userSchema.id, { onDelete: 'cascade' })
		.notNull(),

	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messageSchema = pgTable('messages', {
	id: serial('id').primaryKey(),
	topicId: integer('topicId')
		.references(() => chatTopicSchema.id, { onDelete: 'cascade' })
		.notNull(),
	authorId: integer('author_id').references(() => userSchema.id),
	text: text('text'),
	// TODO: attachments

	editedAt: timestamp('edited_at').defaultNow().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});
