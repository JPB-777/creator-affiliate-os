import { requireUser } from "@/lib/auth-utils";
import { getUserUrls } from "@/server/queries/urls";
import { AddUrlForm } from "@/components/urls/add-url-form";
import { UrlCard } from "@/components/urls/url-card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { UrlFilters } from "@/components/urls/url-filters";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tracked URLs</h1>
        <p className="text-muted-foreground">
          Add pages to scan for affiliate links
        </p>
      </div>

      <AddUrlForm />

      <UrlFilters />

      <div className="space-y-3">
        {userUrls.map((url) => (
          <UrlCard key={url.id} url={url} />
        ))}
        {userUrls.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              No URLs added yet. Add a URL above to start scanning.
            </p>
          </div>
        )}
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </div>
  );
}
