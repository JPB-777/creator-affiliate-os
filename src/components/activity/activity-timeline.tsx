"use client";

import { Badge } from "@/components/ui/badge";
import {
  Globe,
  DollarSign,
  ScanLine,
  Link2,
  Trash2,
  RefreshCw,
  Wrench,
} from "lucide-react";
import type { ActivityLogEntry } from "@/lib/db/schema";

const actionIcons: Record<string, React.ReactNode> = {
  url_added: <Globe className="h-3.5 w-3.5" />,
  url_deleted: <Trash2 className="h-3.5 w-3.5" />,
  url_rescanned: <RefreshCw className="h-3.5 w-3.5" />,
  earning_added: <DollarSign className="h-3.5 w-3.5" />,
  earning_deleted: <Trash2 className="h-3.5 w-3.5" />,
  scan_completed: <ScanLine className="h-3.5 w-3.5" />,
  scan_failed: <ScanLine className="h-3.5 w-3.5" />,
  link_rechecked: <Link2 className="h-3.5 w-3.5" />,
  link_replacement_suggested: <Wrench className="h-3.5 w-3.5" />,
};

const actionColors: Record<string, string> = {
  url_added: "bg-primary/10 text-primary",
  url_deleted: "bg-destructive/10 text-destructive",
  url_rescanned: "bg-primary/10 text-primary",
  earning_added: "bg-success/10 text-success",
  earning_deleted: "bg-destructive/10 text-destructive",
  scan_completed: "bg-success/10 text-success",
  scan_failed: "bg-destructive/10 text-destructive",
  link_rechecked: "bg-primary/10 text-primary",
  link_replacement_suggested: "bg-warning/10 text-warning",
};

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupByDate(entries: ActivityLogEntry[]): Map<string, ActivityLogEntry[]> {
  const groups = new Map<string, ActivityLogEntry[]>();
  for (const entry of entries) {
    const dateKey = new Date(entry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const group = groups.get(dateKey) ?? [];
    group.push(entry);
    groups.set(dateKey, group);
  }
  return groups;
}

function timeOnly(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityTimeline({ entries }: { entries: ActivityLogEntry[] }) {
  const grouped = groupByDate(entries);

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {date}
          </h3>
          <div className="space-y-1">
            {items.map((item) => {
              const meta = item.metadata as Record<string, string> | null;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      actionColors[item.action] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {actionIcons[item.action] ?? <ScanLine className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {formatAction(item.action)}
                      </p>
                      {item.entityType && (
                        <Badge variant="outline" className="text-[10px] h-4">
                          {item.entityType}
                        </Badge>
                      )}
                    </div>
                    {meta?.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {meta.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-1">
                    {timeOnly(item.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
