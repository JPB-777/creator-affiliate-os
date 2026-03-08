"use client";

import { deleteEarning } from "@/server/actions/earnings";
import { Button } from "@/components/ui/button";

export function DeleteEarningButton({ earningId }: { earningId: string }) {
  return (
    <form action={() => deleteEarning(earningId)}>
      <Button variant="ghost" size="sm" type="submit">
        Delete
      </Button>
    </form>
  );
}
