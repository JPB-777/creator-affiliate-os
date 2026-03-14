"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";
import { markDriftAsReviewed } from "@/server/actions/content-drift";
import { DriftDiff } from "./drift-diff";
import Link from "next/link";

interface DriftData {
  id: string;
  linkOriginalUrl: string;
  previousSnippet: string;
  currentSnippet: string;
  isReviewed: boolean;
  detectedAt: Date;
  urlId: string;
  urlTitle: string | null;
  urlUrl: string;
}

export function DriftCard({ drift }: { drift: DriftData }) {
  const [reviewed, setReviewed] = useState(drift.isReviewed);
  const [isPending, startTransition] = useTransition();

  function handleReview() {
    startTransition(async () => {
      await markDriftAsReviewed(drift.id);
      setReviewed(true);
    });
  }

  return (
    <Card className={reviewed ? "opacity-60" : ""}>
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/urls/${drift.urlId}`}
                className="text-sm font-medium hover:underline truncate"
              >
                {drift.urlTitle || drift.urlUrl}
              </Link>
              {!reviewed && (
                <Badge variant="default" className="h-4 px-1 text-[10px]">
                  New
                </Badge>
              )}
            </div>
            <a
              href={drift.linkOriginalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {drift.linkOriginalUrl.slice(0, 60)}...
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {!reviewed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReview}
              disabled={isPending}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Reviewed
            </Button>
          )}
        </div>

        <DriftDiff
          previous={drift.previousSnippet}
          current={drift.currentSnippet}
        />

        <p className="text-[10px] text-muted-foreground">
          Detected {new Date(drift.detectedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
