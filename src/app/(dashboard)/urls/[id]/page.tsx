import { requireUser } from "@/lib/auth-utils";
import { getUrlById } from "@/server/queries/urls";
import { getLinksByUrl } from "@/server/queries/links";
import { getScanHistory } from "@/server/queries/scans";
import { getEarningsByUrl, getUrlEarningsTotal } from "@/server/queries/earnings";
import { getUrlHealthTimeline } from "@/server/queries/link-history";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Link2, AlertTriangle, ExternalLink, DollarSign, Activity } from "lucide-react";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { LinkHistoryChart } from "@/components/links/link-history-chart";

function statusColor(status: string) {
  switch (status) {
    case "healthy":
      return "default";
    case "broken":
      return "destructive";
    case "redirect":
      return "secondary";
    case "timeout":
      return "secondary";
    default:
      return "outline";
  }
}

export default async function UrlDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const url = await getUrlById(id, user.id);
  if (!url) notFound();

  const [urlLinks, scanHistory, urlEarnings, urlEarningsTotal, healthTimeline] = await Promise.all([
    getLinksByUrl(id, user.id),
    getScanHistory(id, user.id),
    getEarningsByUrl(id, user.id),
    getUrlEarningsTotal(id, user.id),
    getUrlHealthTimeline(id, user.id),
  ]);

  const affiliateLinks = urlLinks.filter((l) => l.isAffiliate);
  const otherLinks = urlLinks.filter((l) => !l.isAffiliate);

  return (
    <AnimatedLayout>
    <div className="space-y-6">
      <div>
        <Link href="/urls" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to URLs
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{url.title || url.url}</h1>
        <p className="truncate text-sm text-muted-foreground">{url.url}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Affiliate Links
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">{affiliateLinks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Broken
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-destructive">
              {affiliateLinks.filter((l) => l.status === "broken").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Links
            </CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">{urlLinks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-success">
              ${parseFloat(urlEarningsTotal).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Health History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Link Health History (30 days)</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <LinkHistoryChart data={healthTimeline} />
        </CardContent>
      </Card>

      {/* Affiliate Links Table */}
      {affiliateLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HTTP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliateLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-medium">
                        {link.anchorText || "(no text)"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {link.originalUrl}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {link.networkName ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColor(link.status)}>
                        {link.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {link.httpStatusCode ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* URL Earnings */}
      {urlEarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Earnings from this URL</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urlEarnings.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.period}</TableCell>
                    <TableCell>{e.networkName}</TableCell>
                    <TableCell className="font-mono tabular-nums">
                      ${parseFloat(e.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.notes ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Other Links */}
      {otherLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Other Links ({otherLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {otherLinks.map((link) => (
                <div key={link.id} className="truncate text-sm text-muted-foreground">
                  {link.anchorText ? `${link.anchorText} — ` : ""}
                  {link.originalUrl}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between rounded border p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
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
                    <span>
                      {scan.totalLinksFound} links, {scan.affiliateLinksFound}{" "}
                      affiliate, {scan.brokenLinksFound} broken
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {scan.completedAt
                      ? new Date(scan.completedAt).toLocaleString()
                      : "Running..."}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </AnimatedLayout>
  );
}
