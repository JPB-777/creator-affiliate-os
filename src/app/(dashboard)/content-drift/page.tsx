import { requireUser } from "@/lib/auth-utils";
import { getContentDrifts } from "@/server/queries/content-drift";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriftCard } from "@/components/content-drift/drift-card";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { GitCompareArrows, Eye } from "lucide-react";

export default async function ContentDriftPage() {
  const user = await requireUser();
  const { data: drifts, total } = await getContentDrifts(user.id);

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Content Drift"
          description="Detect changes in content around your affiliate links"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Unreviewed Changes"
            value={total}
            icon={<GitCompareArrows />}
            color="primary"
          />
          <StatCard
            label="Links Monitored"
            value={drifts.length > 0 ? "Active" : "Waiting"}
            icon={<Eye />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detected Changes</CardTitle>
          </CardHeader>
          <CardContent>
            {drifts.length > 0 ? (
              <div className="space-y-4">
                {drifts.map((drift) => (
                  <DriftCard key={drift.id} drift={drift} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<GitCompareArrows />}
                title="No content changes detected"
                description="When the content around your affiliate links changes between scans, it will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
