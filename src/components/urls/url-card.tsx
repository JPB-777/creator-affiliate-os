"use client";

import Link from "next/link";
import { deleteUrl, rescanUrl } from "@/server/actions/urls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Url } from "@/lib/db/schema";
import { useState } from "react";
import { TagEditor } from "@/components/urls/tag-editor";

export function UrlCard({ url }: { url: Url }) {
  const [loading, setLoading] = useState(false);

  async function handleRescan() {
    setLoading(true);
    try {
      await rescanUrl(url.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/urls/${url.id}`}
            className="font-medium hover:underline"
          >
            {url.title || url.url}
          </Link>
          {url.title && (
            <p className="truncate text-sm text-muted-foreground">{url.url}</p>
          )}
          <div className="mt-1 flex gap-2">
            <Badge variant="secondary">{url.platform}</Badge>
            <Badge variant="outline">{url.totalLinks} affiliate links</Badge>
            {(url.brokenLinks ?? 0) > 0 && (
              <Badge variant="destructive">{url.brokenLinks} broken</Badge>
            )}
            {url.lastScannedAt && (
              <span className="text-xs text-muted-foreground">
                Scanned{" "}
                {new Date(url.lastScannedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="mt-1.5">
            <TagEditor urlId={url.id} initialTags={(url.tags as string[]) ?? []} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRescan}
            disabled={loading}
          >
            {loading ? "Scanning..." : "Rescan"}
          </Button>
          <form action={() => deleteUrl(url.id)}>
            <Button variant="ghost" size="sm" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
