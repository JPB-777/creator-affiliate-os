ALTER TABLE "urls" ADD COLUMN "tags" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "suggested_replacement" text;
