import { requireUser } from "@/lib/auth-utils";
import { getAllUserLinks } from "@/server/queries/links";
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
import { RecheckButton } from "@/components/links/recheck-button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { LinkFilters } from "@/components/links/link-filters";
import { ExportLinksButton } from "@/components/links/export-button";
import { ReplaceLinkForm } from "@/components/links/replace-link-form";

function statusColor(status: string) {
  switch (status) {
    case "healthy":
      return "default" as const;
    case "broken":
      return "destructive" as const;
    case "redirect":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; network?: string; status?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const filters = {
    search: params.search || undefined,
    network: params.network || undefined,
    status: params.status || undefined,
  };
  const { data: affiliateLinks, total, totalPages } = await getAllUserLinks(user.id, page, 20, filters);
  const brokenLinks = affiliateLinks.filter((l) => l.status === "broken");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Affiliate Links</h1>
          <ExportLinksButton />
        </div>
        <p className="text-muted-foreground">
          All affiliate links detected across your content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {affiliateLinks.filter((l) => l.status === "healthy").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Broken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {brokenLinks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <LinkFilters />

      {brokenLinks.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4">
          <p className="font-medium text-destructive">
            {brokenLinks.length} broken affiliate link{brokenLinks.length > 1 ? "s" : ""} detected
          </p>
          <p className="text-sm text-muted-foreground">
            These links may be losing you commissions. Check and update them.
          </p>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link Text</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliateLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="max-w-[150px] truncate font-medium">
                    {link.anchorText || "(no text)"}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
                    {link.originalUrl}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{link.networkName ?? "Unknown"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor(link.status)}>{link.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {link.httpStatusCode ?? "-"}
                  </TableCell>
                  <TableCell className="space-x-1">
                    <RecheckButton linkId={link.id} />
                    {link.status === "broken" && (
                      <ReplaceLinkForm
                        linkId={link.id}
                        currentReplacement={link.suggestedReplacement}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {affiliateLinks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No affiliate links detected yet. Add URLs to scan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </div>
  );
}
