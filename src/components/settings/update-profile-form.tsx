"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function UpdateProfileForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await authClient.updateUser({ name });
      setMessage("Profile updated!");
      router.refresh();
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      {message && (
        <p className={`text-sm ${message.includes("Failed") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading || name === currentName}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
