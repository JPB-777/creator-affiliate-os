CREATE TABLE "content_drifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url_id" uuid NOT NULL,
	"link_original_url" text NOT NULL,
	"previous_snippet" text NOT NULL,
	"current_snippet" text NOT NULL,
	"previous_hash" text NOT NULL,
	"current_hash" text NOT NULL,
	"is_reviewed" boolean DEFAULT false NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url_id" uuid NOT NULL,
	"link_original_url" text NOT NULL,
	"context_hash" text NOT NULL,
	"context_snippet" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_drifts" ADD CONSTRAINT "content_drifts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_drifts" ADD CONSTRAINT "content_drifts_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_snapshots" ADD CONSTRAINT "content_snapshots_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_snapshots" ADD CONSTRAINT "content_snapshots_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;