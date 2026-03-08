import { requireUser } from "@/lib/auth-utils";
import { getDashboardStats } from "@/server/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await getDashboardStats(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tracked URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUrls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Affiliate Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalAffiliateLinks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Broken Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {stats.brokenLinks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${parseFloat(stats.totalEarnings).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Distribution */}
      {stats.networkDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Network Distribution</CardTitle>
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
                  className="flex items-center justify-between rounded-md border p-3"
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
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">No URLs tracked yet</p>
            <p className="mt-1 text-muted-foreground">
              Add your first URL to start scanning for affiliate links.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
