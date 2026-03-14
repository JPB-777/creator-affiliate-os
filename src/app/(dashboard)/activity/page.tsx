import { requireUser } from "@/lib/auth-utils";
import { getActivityLog } from "@/server/queries/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Activity } from "lucide-react";

export default async function ActivityPage() {
  const user = await requireUser();
  const { data: entries } = await getActivityLog(user.id);

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Activity"
          description="Your recent actions and events"
        />

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <ActivityTimeline entries={entries} />
            ) : (
              <EmptyState
                icon={<Activity />}
                title="No activity yet"
                description="Your actions will appear here as you use AffiliateOS."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
