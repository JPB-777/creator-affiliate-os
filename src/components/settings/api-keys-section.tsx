"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Copy, Trash2, Plus, Loader2 } from "lucide-react";
import { createApiKey, revokeApiKey } from "@/server/actions/api-keys";
import { toast } from "sonner";

interface ApiKeyData {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export function ApiKeysSection({ keys }: { keys: ApiKeyData[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createApiKey(name.trim());
      setNewKey(result.key);
      setName("");
      setShowCreate(false);
      toast.success("API key created");
    });
  }

  function handleRevoke(id: string) {
    startTransition(async () => {
      await revokeApiKey(id);
      toast.success("API key revoked");
    });
  }

  function copyKey() {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      toast.success("Copied to clipboard");
    }
  }

  return (
    <div className="space-y-4">
      {newKey && (
        <div className="rounded-lg border border-warning/50 bg-warning/10 p-4 space-y-2">
          <p className="text-sm font-medium">Your new API key (shown once):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-2 py-1 text-xs font-mono break-all">
              {newKey}
            </code>
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={copyKey}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setNewKey(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {keys.length > 0 ? (
        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{k.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <code>{k.keyPrefix}...</code>
                    {k.lastUsedAt && (
                      <span>
                        Last used {new Date(k.lastUsedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleRevoke(k.id)}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No API keys yet.</p>
      )}

      {showCreate ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Key name (e.g. My App)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreate} disabled={isPending || !name.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
          <Button variant="ghost" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1 h-4 w-4" />
          New API Key
        </Button>
      )}
    </div>
  );
}
