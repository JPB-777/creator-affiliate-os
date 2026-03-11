"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUrl, bulkAddUrls } from "@/server/actions/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddUrlForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkResults, setBulkResults] = useState<
    { url: string; status: "added" | "duplicate" | "error"; error?: string }[] | null
  >(null);
  const [progress, setProgress] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setBulkResults(null);
    try {
      if (bulkMode) {
        setProgress("Scanning URLs...");
        const results = await bulkAddUrls(formData);
        setBulkResults(results);
        setProgress("");
      } else {
        await addUrl(formData);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to add URL:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setBulkMode(false); setBulkResults(null); }}
          className={`text-sm px-3 py-1 rounded-md transition-colors ${
            !bulkMode
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Single URL
        </button>
        <button
          type="button"
          onClick={() => { setBulkMode(true); setBulkResults(null); }}
          className={`text-sm px-3 py-1 rounded-md transition-colors ${
            bulkMode
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Bulk Import
        </button>
      </div>

      <form action={handleSubmit} className={bulkMode ? "space-y-3" : "flex gap-3"}>
        {bulkMode ? (
          <Textarea
            name="urls"
            placeholder={"https://yourblog.com/post-1\nhttps://yourblog.com/post-2\nhttps://yourblog.com/post-3"}
            required
            rows={5}
            className="font-mono text-sm"
          />
        ) : (
          <Input
            name="url"
            type="url"
            placeholder="https://yourblog.com/post"
            required
            className="flex-1"
          />
        )}
        <div className={bulkMode ? "flex gap-3" : "contents"}>
          <Select name="platform" defaultValue="blog">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading
              ? progress || "Scanning..."
              : bulkMode
                ? "Import & Scan All"
                : "Add & Scan"}
          </Button>
        </div>
        {bulkMode && (
          <p className="text-xs text-muted-foreground">
            One URL per line. Max 20 URLs per batch. Duplicates will be skipped.
          </p>
        )}
      </form>

      {bulkResults && (
        <div className="rounded-md border p-3 space-y-1 text-sm">
          <p className="font-medium">
            Import complete: {bulkResults.filter((r) => r.status === "added").length} added,{" "}
            {bulkResults.filter((r) => r.status === "duplicate").length} duplicates,{" "}
            {bulkResults.filter((r) => r.status === "error").length} errors
          </p>
          {bulkResults.filter((r) => r.status !== "added").map((r, i) => (
            <p key={i} className={r.status === "error" ? "text-destructive" : "text-muted-foreground"}>
              {r.status === "duplicate" ? "Skipped" : "Error"}: {r.url}
              {r.error && ` — ${r.error}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
