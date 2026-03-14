ALTER TABLE "earnings" ADD COLUMN "url_id" uuid;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "suggested_replacement" text;--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE set null ON UPDATE no action;