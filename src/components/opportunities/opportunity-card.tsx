"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X, Sparkles } from "lucide-react";
import { dismissOpportunity } from "@/server/actions/opportunities";
import Link from "next/link";

interface OpportunityData {
  id: string;
  linkOriginalUrl: string;
  anchorText: string | null;
  suggestedNetwork: string;
  reason: string;
  urlId: string;
  urlTitle: string | null;
  urlUrl: string;
}

export function OpportunityCard({ opp }: { opp: OpportunityData }) {
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (dismissed) return null;

  function handleDismiss() {
    startTransition(async () => {
      await dismissOpportunity(opp.id);
      setDismissed(true);
    });
  }

  return (
    <Card className="transition-opacity" style={{ opacity: isPending ? 0.5 : 1 }}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {opp.suggestedNetwork}
              </Badge>
              <Link
                href={`/urls/${opp.urlId}`}
                className="text-xs text-muted-foreground hover:underline truncate"
              >
                {opp.urlTitle || opp.urlUrl}
              </Link>
            </div>
            <p className="text-sm font-medium truncate">{opp.anchorText || opp.linkOriginalUrl}</p>
            <p className="text-xs text-muted-foreground">{opp.reason}</p>
            <a
              href={opp.linkOriginalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {new URL(opp.linkOriginalUrl).hostname}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleDismiss}
            disabled={isPending}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
