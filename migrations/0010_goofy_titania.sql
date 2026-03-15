ALTER TABLE "urls" ADD COLUMN "scanning_locked_at" timestamp;--> statement-breakpoint
CREATE INDEX "earnings_user_id_idx" ON "earnings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "earnings_url_id_idx" ON "earnings" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "lsh_url_id_idx" ON "link_status_history" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "lsh_user_id_idx" ON "link_status_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "links_url_id_idx" ON "links" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "links_user_id_idx" ON "links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "links_affiliate_idx" ON "links" USING btree ("url_id","is_affiliate");--> statement-breakpoint
CREATE INDEX "notif_user_read_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "scans_url_id_idx" ON "scans" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "scans_user_id_idx" ON "scans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "urls_user_id_idx" ON "urls" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_url_unique" UNIQUE("user_id","url");