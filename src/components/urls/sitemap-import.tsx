"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchSitemapUrls, importSitemapUrls } from "@/server/actions/sitemap";
import { toast } from "sonner";
import { Loader2, Map, Download, CheckCircle2 } from "lucide-react";

type Step = "input" | "preview" | "importing" | "done";

interface SitemapEntry {
  url: string;
  lastmod?: string;
}

export function SitemapImport() {
  const [step, setStep] = useState<Step>("input");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [platform, setPlatform] = useState("blog");
  const [entries, setEntries] = useState<SitemapEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ url: string; status: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleFetch() {
    if (!sitemapUrl.trim()) {
      toast.error("Enter a sitemap URL");
      return;
    }
    startTransition(async () => {
      try {
        const data = await fetchSitemapUrls(sitemapUrl);
        if (data.length === 0) {
          toast.error("No URLs found in sitemap");
          return;
        }
        setEntries(data);
        setSelected(new Set(data.map((e) => e.url)));
        setStep("preview");
        toast.success(`Found ${data.length} URLs`);
      } catch {
        toast.error("Failed to fetch sitemap");
      }
    });
  }

  function toggleUrl(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === entries.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(entries.map((e) => e.url)));
    }
  }

  function handleImport() {
    const urls = Array.from(selected);
    if (urls.length === 0) {
      toast.error("Select at least one URL");
      return;
    }
    setStep("importing");
    startTransition(async () => {
      try {
        const res = await importSitemapUrls(urls, platform);
        setResults(res);
        setStep("done");
        const added = res.filter((r) => r.status === "added").length;
        const dupes = res.filter((r) => r.status === "duplicate").length;
        toast.success(`Imported ${added} URLs (${dupes} duplicates skipped)`);
      } catch {
        toast.error("Import failed");
        setStep("preview");
      }
    });
  }

  function reset() {
    setStep("input");
    setSitemapUrl("");
    setEntries([]);
    setSelected(new Set());
    setResults([]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Import from Sitemap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sitemap URL</Label>
              <Input
                placeholder="https://myblog.com/sitemap.xml"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v ?? "blog")} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleFetch} disabled={isPending || !sitemapUrl.trim()}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Fetch Sitemap
            </Button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selected.size} of {entries.length} URLs selected (max 200)
              </p>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selected.size === entries.length ? "Deselect all" : "Select all"}
              </Button>
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded border p-2">
              {entries.map((entry) => (
                <label
                  key={entry.url}
                  className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted cursor-pointer"
                >
                  <Checkbox
                    checked={selected.has(entry.url)}
                    onCheckedChange={() => toggleUrl(entry.url)}
                  />
                  <span className="truncate flex-1">{entry.url}</span>
                  {entry.lastmod && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {entry.lastmod.slice(0, 10)}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reset} disabled={isPending}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={isPending || selected.size === 0}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Import {selected.size} URLs
              </Button>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Importing and scanning URLs... This may take a while.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Import complete!</span>
            </div>
            <div className="text-sm space-y-1">
              <p>Added: {results.filter((r) => r.status === "added").length}</p>
              <p>Duplicates skipped: {results.filter((r) => r.status === "duplicate").length}</p>
              <p>Errors: {results.filter((r) => r.status === "error").length}</p>
            </div>
            <Button variant="outline" onClick={reset}>
              Import another sitemap
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
