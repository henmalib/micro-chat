CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"email" text,
	"password_hash" text,
	"avatar_url" text,
	"pepper" text
);
