"use client";

import { useState, useTransition } from "react";
import { suggestReplacement } from "@/server/actions/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function ReplaceLinkForm({
  linkId,
  currentReplacement,
}: {
  linkId: string;
  currentReplacement: string | null;
}) {
  const [url, setUrl] = useState(currentReplacement ?? "");
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(!!currentReplacement);

  function handleSave() {
    if (!url.trim()) return;
    startTransition(async () => {
      await suggestReplacement(linkId, url.trim());
      toast.success("Replacement saved");
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!showForm) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
        Replace
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="New URL..."
        className="h-7 w-48 text-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2"
        onClick={handleSave}
        disabled={isPending || !url.trim()}
      >
        {isPending ? "..." : "Save"}
      </Button>
      {currentReplacement && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </div>
  );
}
