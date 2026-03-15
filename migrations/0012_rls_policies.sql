-- Enable Row Level Security on all user-facing tables
-- Defense-in-depth: even if app code misses a userId filter, RLS blocks cross-user access
-- The database owner role (used by Neon/Drizzle) bypasses RLS by default

ALTER TABLE "urls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "scans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "earnings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "link_status_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "activity_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "opportunities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "content_drifts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "content_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;
