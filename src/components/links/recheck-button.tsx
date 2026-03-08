"use client";

import { useState } from "react";
import { recheckLink } from "@/server/actions/links";
import { Button } from "@/components/ui/button";

export function RecheckButton({ linkId }: { linkId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRecheck() {
    setLoading(true);
    try {
      await recheckLink(linkId);
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
      {loading ? "..." : "Recheck"}
    </Button>
  );
}
