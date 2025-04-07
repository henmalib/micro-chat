ALTER TABLE "sessions" RENAME COLUMN "refresh_token" TO "token";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_refresh_token_unique";--> statement-breakpoint
DROP INDEX "refresh_index";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ua" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "last_use" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "token_index" ON "sessions" USING btree ("token");--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");