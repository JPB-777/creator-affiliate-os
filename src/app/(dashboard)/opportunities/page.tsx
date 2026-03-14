import { requireUser } from "@/lib/auth-utils";
import { getOpportunities } from "@/server/queries/opportunities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Sparkles, TrendingUp } from "lucide-react";

export default async function OpportunitiesPage() {
  const user = await requireUser();
  const { data: opps, total } = await getOpportunities(user.id);

  const networkCounts = opps.reduce<Record<string, number>>((acc, o) => {
    acc[o.suggestedNetwork] = (acc[o.suggestedNetwork] || 0) + 1;
    return acc;
  }, {});

  const topNetwork = Object.entries(networkCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Opportunities"
          description="Non-affiliate links that could be monetized"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Open Opportunities"
            value={total}
            icon={<Sparkles />}
            color="primary"
          />
          <StatCard
            label="Top Network"
            value={topNetwork ? topNetwork[0] : "-"}
            icon={<TrendingUp />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monetization Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {opps.length > 0 ? (
              <div className="space-y-3">
                {opps.map((opp) => (
                  <OpportunityCard key={opp.id} opp={opp} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Sparkles />}
                title="No opportunities found"
                description="Scan your URLs to detect non-affiliate links that could be monetized."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
