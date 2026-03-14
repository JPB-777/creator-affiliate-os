import { requireUser } from "@/lib/auth-utils";
import { getUserUrls } from "@/server/queries/urls";
import { AddUrlForm } from "@/components/urls/add-url-form";
import { UrlCard } from "@/components/urls/url-card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { UrlFilters } from "@/components/urls/url-filters";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Globe } from "lucide-react";
import { SitemapImport } from "@/components/urls/sitemap-import";

export default async function UrlsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; platform?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const filters = {
    search: params.search || undefined,
    platform: params.platform || undefined,
  };
  const { data: userUrls, totalPages } = await getUserUrls(user.id, page, 20, filters);

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tracked URLs"
          description="Add pages to scan for affiliate links"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <AddUrlForm />
          <SitemapImport />
        </div>

        <UrlFilters />

        <div className="space-y-3">
          {userUrls.map((url) => (
            <UrlCard key={url.id} url={url} />
          ))}
          {userUrls.length === 0 && (
            <EmptyState
              icon={<Globe />}
              title="No URLs added yet"
              description="Add a URL above to start scanning for affiliate links."
            />
          )}
        </div>

        <PaginationControls currentPage={page} totalPages={totalPages} />
      </div>
    </AnimatedLayout>
  );
}
