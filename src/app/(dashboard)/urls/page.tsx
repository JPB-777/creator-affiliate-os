import { requireUser } from "@/lib/auth-utils";
import { getUserUrls } from "@/server/queries/urls";
import { AddUrlForm } from "@/components/urls/add-url-form";
import { UrlCard } from "@/components/urls/url-card";

export default async function UrlsPage() {
  const user = await requireUser();
  const userUrls = await getUserUrls(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tracked URLs</h1>
        <p className="text-muted-foreground">
          Add pages to scan for affiliate links
        </p>
      </div>

      <AddUrlForm />

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
    </div>
  );
}
