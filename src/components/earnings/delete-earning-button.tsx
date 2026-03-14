"use client";

import { deleteEarning } from "@/server/actions/earnings";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteEarningButton({ earningId }: { earningId: string }) {
  async function handleDelete() {
    await deleteEarning(earningId);
    toast.success("Earning deleted");
  }

  return (
    <ConfirmDialog
      title="Delete earning"
      description="This earning entry will be permanently deleted. This action cannot be undone."
      confirmText="Delete"
      variant="destructive"
      onConfirm={handleDelete}
      trigger={
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
    />
  );
}
