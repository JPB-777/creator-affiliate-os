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

export function UrlFilters() {
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
        placeholder="Search URLs..."
        defaultValue={searchParams.get("search") ?? ""}
        className="max-w-xs"
        onChange={(e) => {
          const timeout = setTimeout(() => updateParam("search", e.target.value), 400);
          return () => clearTimeout(timeout);
        }}
      />
      <Select
        defaultValue={searchParams.get("platform") ?? "all"}
        onValueChange={(v) => updateParam("platform", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="blog">Blog</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="newsletter">Newsletter</SelectItem>
          <SelectItem value="social">Social</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
