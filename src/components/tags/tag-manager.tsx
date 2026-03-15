"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { renameTag, deleteTag } from "@/server/actions/tags";
import { toast } from "sonner";
import { Edit2, Trash2, Loader2 } from "lucide-react";

interface TagInfo {
  name: string;
  count: number;
}

export function TagManager({ tags }: { tags: TagInfo[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  function handleRename(oldName: string) {
    if (!newName.trim() || newName === oldName) {
      setEditingTag(null);
      return;
    }
    startTransition(async () => {
      try {
        await renameTag(oldName, newName.trim());
        toast.success(`Tag renamed to "${newName.trim()}"`);
        setEditingTag(null);
        setNewName("");
      } catch {
        toast.error("Failed to rename tag");
      }
    });
  }

  function handleDelete(name: string) {
    startTransition(async () => {
      try {
        await deleteTag(name);
        toast.success(`Tag "${name}" deleted`);
      } catch {
        toast.error("Failed to delete tag");
      }
    });
  }

  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No tags yet. Add tags to your URLs to organize them.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          {editingTag === tag.name ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 max-w-48"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(tag.name);
                  if (e.key === "Escape") setEditingTag(null);
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRename(tag.name)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingTag(null)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{tag.name}</Badge>
              <span className="text-xs text-muted-foreground">
                {tag.count} URL{tag.count > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {editingTag !== tag.name && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTag(tag.name);
                  setNewName(tag.name);
                }}
                disabled={isPending}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <ConfirmDialog
                title="Delete Tag"
                description={`Remove the tag "${tag.name}" from all ${tag.count} URLs? The URLs themselves won't be deleted.`}
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => handleDelete(tag.name)}
                trigger={
                  <Button variant="ghost" size="sm" disabled={isPending}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
