import { buttonVariants } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportEarningsButton() {
  return (
    <a
      href="/api/export/earnings"
      download
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </a>
  );
}
