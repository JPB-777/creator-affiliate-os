import { requireUser } from "@/lib/auth-utils";
import { getAllUserTags } from "@/server/queries/tags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagManager } from "@/components/tags/tag-manager";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Tag } from "lucide-react";

export default async function TagsPage() {
  const user = await requireUser();
  const tags = await getAllUserTags(user.id);

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tags"
          description="Manage and organize your URL tags"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold font-mono">{tags.length}</div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold font-mono">
                {tags.reduce((sum, t) => sum + t.count, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Tagged URLs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold font-mono">
                {tags.length > 0 ? tags[0].name : "-"}
              </div>
              <p className="text-sm text-muted-foreground">Most Used Tag</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <TagManager tags={tags} />
            ) : (
              <EmptyState
                icon={<Tag />}
                title="No tags yet"
                description="Add tags to your URLs to organize and filter them."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
