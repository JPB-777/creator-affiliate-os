"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUrl } from "@/server/actions/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddUrlForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await addUrl(formData);
      router.refresh();
    } catch (error) {
      console.error("Failed to add URL:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex gap-3">
      <Input
        name="url"
        type="url"
        placeholder="https://yourblog.com/post"
        required
        className="flex-1"
      />
      <Select name="platform" defaultValue="blog">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="blog">Blog</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={loading}>
        {loading ? "Scanning..." : "Add & Scan"}
      </Button>
    </form>
  );
}
