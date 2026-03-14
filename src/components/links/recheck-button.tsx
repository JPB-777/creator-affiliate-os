"use client";

import { useState } from "react";
import { recheckLink } from "@/server/actions/links";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RecheckButton({ linkId }: { linkId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRecheck() {
    setLoading(true);
    try {
      await recheckLink(linkId);
      toast.success("Link rechecked");
    } catch {
      toast.error("Recheck failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRecheck}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Recheck"}
    </Button>
  );
}
