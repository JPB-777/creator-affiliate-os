"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { toggleWeeklyReport } from "@/server/actions/settings";

export function WeeklyReportToggle({ enabled }: { enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    setIsEnabled(checked);
    startTransition(async () => {
      try {
        await toggleWeeklyReport(checked);
        toast.success(checked ? "Weekly report enabled" : "Weekly report disabled");
      } catch {
        setIsEnabled(!checked);
        toast.error("Failed to update preference");
      }
    });
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Weekly Email Report</Label>
        <p className="text-sm text-muted-foreground">
          Receive a summary of your links, scans, and earnings every Monday.
        </p>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
    </div>
  );
}
