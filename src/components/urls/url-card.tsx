"use client";

import Link from "next/link";
import { deleteUrl, rescanUrl } from "@/server/actions/urls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Url } from "@/lib/db/schema";
import { useState } from "react";
import { TagEditor } from "@/components/urls/tag-editor";
import { ScanFrequencySelect } from "@/components/urls/scan-frequency-select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export function UrlCard({ url }: { url: Url }) {
  const [loading, setLoading] = useState(false);

  async function handleRescan() {
    setLoading(true);
    try {
      await rescanUrl(url.id);
      toast.success("Scan complete");
    } catch {
      toast.error("Scan failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    await deleteUrl(url.id);
    toast.success("URL deleted");
  }

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
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
          <div className="mt-1.5 flex items-center gap-3">
            <TagEditor urlId={url.id} initialTags={(url.tags as string[]) ?? []} />
            <ScanFrequencySelect urlId={url.id} current={url.scanFrequency} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRescan}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              "Rescan"
            )}
          </Button>
          <ConfirmDialog
            title="Delete URL"
            description="This URL and all its scan data will be permanently deleted. This action cannot be undone."
            confirmText="Delete"
            variant="destructive"
            onConfirm={handleDelete}
            trigger={
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
