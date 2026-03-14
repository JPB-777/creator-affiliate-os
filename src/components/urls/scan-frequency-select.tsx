"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateScanFrequency } from "@/server/actions/urls";
import { toast } from "sonner";

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "manual", label: "Manual" },
] as const;

export function ScanFrequencySelect({
  urlId,
  current,
}: {
  urlId: string;
  current: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      try {
        await updateScanFrequency(
          urlId,
          value as "daily" | "weekly" | "biweekly" | "monthly" | "manual"
        );
        toast.success(`Scan frequency updated to ${value}`);
      } catch {
        toast.error("Failed to update frequency");
      }
    });
  }

  return (
    <Select defaultValue={current} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-28 h-7 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {frequencies.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
