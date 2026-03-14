import { requireUser } from "@/lib/auth-utils";
import { getDashboardStats, getTopPerformingUrls } from "@/server/queries/dashboard";
import Link from "next/link";
import { getMonthlyEarnings } from "@/server/queries/earnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { Globe, Link2, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, monthlyEarnings, topUrls] = await Promise.all([
    getDashboardStats(user.id),
    getMonthlyEarnings(user.id),
    getTopPerformingUrls(user.id),
  ]);

  return (
    <AnimatedLayout>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description={`Welcome back, ${user.name}`}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Tracked URLs"
            value={stats.totalUrls}
            icon={<Globe />}
            color="primary"
          />
          <StatCard
            label="Affiliate Links"
            value={stats.totalAffiliateLinks}
            icon={<Link2 />}
          />
          <StatCard
            label="Broken Links"
            value={stats.brokenLinks}
            icon={<AlertTriangle />}
            color="destructive"
          />
          <StatCard
            label="Total Earnings"
            value={`$${parseFloat(stats.totalEarnings).toFixed(2)}`}
            icon={<DollarSign />}
            color="success"
          />
        </div>

        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <EarningsChart data={monthlyEarnings} />
          </CardContent>
        </Card>

        {/* Two-column layout for secondary sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Performing Content */}
          {topUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUrls.map((item) => (
                    <div
                      key={item.urlId}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/urls/${item.urlId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.urlTitle || item.urlUrl}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {item.networkCount} network{item.networkCount > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="font-bold font-mono tabular-nums text-success">
                        ${parseFloat(item.totalEarnings).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Distribution */}
          {stats.networkDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.networkDistribution.map((item) => (
                    <div
                      key={item.network}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.network}</span>
                      <Badge variant="secondary">{item.count} links</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Scans */}
        {stats.recentScans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <Badge
                        variant={
                          scan.status === "completed"
                            ? "default"
                            : scan.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {scan.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {scan.affiliateLinksFound} affiliate,{" "}
                        {scan.brokenLinksFound} broken
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {scan.completedAt
                        ? new Date(scan.completedAt).toLocaleDateString()
                        : "In progress"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {stats.totalUrls === 0 && (
          <Card>
            <CardContent>
              <EmptyState
                icon={<BarChart3 />}
                title="No URLs tracked yet"
                description="Add your first URL to start scanning for affiliate links and tracking your content."
                action={
                  <Link href="/urls">
                    <Button>Add your first URL</Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedLayout>
  );
}
