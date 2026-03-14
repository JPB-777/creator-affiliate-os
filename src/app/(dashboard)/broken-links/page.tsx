import { requireUser } from "@/lib/auth-utils";
import { getBrokenLinksWithUrls } from "@/server/queries/links";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { BrokenLinksTable } from "@/components/broken-links/broken-links-table";
import { AlertTriangle, CheckCircle, Globe } from "lucide-react";

export default async function BrokenLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; network?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const filters = {
    search: params.search || undefined,
    network: params.network || undefined,
  };

  const { data: brokenLinks, total, totalPages } = await getBrokenLinksWithUrls(
    user.id,
    page,
    20,
    filters
  );

  // Count unique pages affected
  const uniquePages = new Set(brokenLinks.map((l) => l.urlId)).size;

  // Count unique networks
  const networkCounts = brokenLinks.reduce<Record<string, number>>((acc, l) => {
    const net = l.networkName ?? "Unknown";
    acc[net] = (acc[net] || 0) + 1;
    return acc;
  }, {});

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Broken Links"
          description={`${total} broken affiliate link${total !== 1 ? "s" : ""} found across your content`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Broken Links"
            value={total}
            icon={<AlertTriangle />}
            color="destructive"
          />
          <StatCard
            label="Pages Affected"
            value={uniquePages}
            icon={<Globe />}
          />
          <StatCard
            label="Top Network"
            value={
              Object.entries(networkCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A"
            }
            icon={<CheckCircle />}
          />
        </div>

        {brokenLinks.length > 0 ? (
          <Card>
            <CardContent className="p-0 pt-4">
              <BrokenLinksTable links={brokenLinks} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <EmptyState
                icon={<CheckCircle />}
                title="All clear!"
                description="No broken affiliate links detected. Your links are healthy."
              />
            </CardContent>
          </Card>
        )}

        <PaginationControls currentPage={page} totalPages={totalPages} />
      </div>
    </AnimatedLayout>
  );
}
