import { requireUser } from "@/lib/auth-utils";
import { getUrlById } from "@/server/queries/urls";
import { getLinksByUrl } from "@/server/queries/links";
import { getScanHistory } from "@/server/queries/scans";
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

  const [urlLinks, scanHistory] = await Promise.all([
    getLinksByUrl(id, user.id),
    getScanHistory(id, user.id),
  ]);

  const affiliateLinks = urlLinks.filter((l) => l.isAffiliate);
  const otherLinks = urlLinks.filter((l) => !l.isAffiliate);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/urls" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to URLs
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{url.title || url.url}</h1>
        <p className="truncate text-sm text-muted-foreground">{url.url}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Affiliate Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateLinks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Broken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {affiliateLinks.filter((l) => l.status === "broken").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urlLinks.length}</div>
          </CardContent>
        </Card>
      </div>

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
  );
}
