"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { batchRecheckLinks, batchDismissLinks } from "@/server/actions/broken-links";
import { recheckLink } from "@/server/actions/links";
import { suggestReplacement } from "@/server/actions/links";
import { Loader2, RefreshCw, X, ExternalLink, Check } from "lucide-react";
import Link from "next/link";

interface BrokenLink {
  id: string;
  urlId: string;
  originalUrl: string;
  resolvedUrl: string | null;
  anchorText: string | null;
  status: string;
  httpStatusCode: number | null;
  networkName: string | null;
  suggestedReplacement: string | null;
  lastCheckedAt: Date | null;
  urlTitle: string | null;
  urlUrl: string;
}

export function BrokenLinksTable({ links }: { links: BrokenLink[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [replaceUrl, setReplaceUrl] = useState<Record<string, string>>({});
  const router = useRouter();

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === links.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(links.map((l) => l.id)));
    }
  };

  const handleRecheck = async (id: string) => {
    setLoading(id);
    try {
      await recheckLink(id);
      toast.success("Link rechecked");
      router.refresh();
    } catch {
      toast.error("Failed to recheck");
    } finally {
      setLoading(null);
    }
  };

  const handleBatchRecheck = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBatchLoading(true);
    try {
      const result = await batchRecheckLinks(ids);
      toast.success(`Rechecked ${result.rechecked}: ${result.fixed} fixed, ${result.stillBroken} still broken`);
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("Batch recheck failed");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleBatchDismiss = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBatchLoading(true);
    try {
      await batchDismissLinks(ids);
      toast.success(`${ids.length} links dismissed`);
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("Batch dismiss failed");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleReplace = async (linkId: string) => {
    const url = replaceUrl[linkId];
    if (!url) return;
    try {
      await suggestReplacement(linkId, url);
      toast.success("Replacement saved");
      setReplaceUrl((prev) => ({ ...prev, [linkId]: "" }));
      router.refresh();
    } catch {
      toast.error("Failed to save replacement");
    }
  };

  return (
    <div className="space-y-4">
      {/* Batch actions bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-10 flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBatchRecheck}
            disabled={batchLoading}
          >
            {batchLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
            Re-check All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBatchDismiss}
            disabled={batchLoading}
          >
            <X className="mr-2 h-3 w-3" />
            Dismiss All
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={selected.size === links.length && links.length > 0}
                onChange={toggleAll}
                className="h-4 w-4 rounded border"
              />
            </TableHead>
            <TableHead>Page</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>HTTP</TableHead>
            <TableHead>Last Checked</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.has(link.id)}
                  onChange={() => toggleSelect(link.id)}
                  className="h-4 w-4 rounded border"
                />
              </TableCell>
              <TableCell className="max-w-[180px]">
                <Link
                  href={`/urls/${link.urlId}`}
                  className="text-sm font-medium hover:underline text-primary truncate block"
                >
                  {link.urlTitle || link.urlUrl.replace(/^https?:\/\//, "").slice(0, 30)}
                </Link>
              </TableCell>
              <TableCell className="max-w-[220px]">
                <div className="truncate text-sm">{link.anchorText || "(no text)"}</div>
                <div className="truncate text-xs text-muted-foreground">{link.originalUrl}</div>
                {link.suggestedReplacement && (
                  <div className="flex items-center gap-1 mt-1">
                    <Check className="h-3 w-3 text-success" />
                    <span className="truncate text-xs text-success">{link.suggestedReplacement}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{link.networkName ?? "Unknown"}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm text-destructive">
                {link.httpStatusCode ?? "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {link.lastCheckedAt ? new Date(link.lastCheckedAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRecheck(link.id)}
                    disabled={loading === link.id}
                    className="h-7 w-7 p-0"
                    title="Re-check"
                  >
                    {loading === link.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    title="Open link"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {!link.suggestedReplacement && (
                  <div className="mt-1 flex items-center gap-1">
                    <Input
                      placeholder="Replace URL"
                      value={replaceUrl[link.id] || ""}
                      onChange={(e) =>
                        setReplaceUrl((prev) => ({ ...prev, [link.id]: e.target.value }))
                      }
                      className="h-7 text-xs w-36"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      onClick={() => handleReplace(link.id)}
                      disabled={!replaceUrl[link.id]}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
