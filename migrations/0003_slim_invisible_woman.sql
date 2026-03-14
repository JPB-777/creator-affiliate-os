CREATE TABLE "link_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url_id" uuid NOT NULL,
	"link_original_url" text NOT NULL,
	"network_name" text,
	"status" "link_status" NOT NULL,
	"http_status_code" integer,
	"checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "link_status_history" ADD CONSTRAINT "link_status_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_status_history" ADD CONSTRAINT "link_status_history_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;