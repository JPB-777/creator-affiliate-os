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
import { Link2, CheckCircle, AlertTriangle } from "lucide-react";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";

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
    <AnimatedLayout>
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Links"
        description="All affiliate links detected across your content"
        action={<ExportLinksButton />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-success">
              {affiliateLinks.filter((l) => l.status === "healthy").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Broken</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-destructive">
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
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Link2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-sm font-medium">No affiliate links detected yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Add URLs to scan for affiliate links.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </div>
    </AnimatedLayout>
  );
}
