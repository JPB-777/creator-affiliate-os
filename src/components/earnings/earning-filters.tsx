"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EarningFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search earnings..."
        defaultValue={searchParams.get("search") ?? ""}
        className="max-w-xs"
        onChange={(e) => {
          const timeout = setTimeout(() => updateParam("search", e.target.value), 400);
          return () => clearTimeout(timeout);
        }}
      />
      <Select
        defaultValue={searchParams.get("network") ?? "all"}
        onValueChange={(v) => updateParam("network", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Networks</SelectItem>
          <SelectItem value="Amazon">Amazon</SelectItem>
          <SelectItem value="ShareASale">ShareASale</SelectItem>
          <SelectItem value="CJ Affiliate">CJ Affiliate</SelectItem>
          <SelectItem value="Impact">Impact</SelectItem>
          <SelectItem value="Rakuten">Rakuten</SelectItem>
          <SelectItem value="Awin">Awin</SelectItem>
          <SelectItem value="ClickBank">ClickBank</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
