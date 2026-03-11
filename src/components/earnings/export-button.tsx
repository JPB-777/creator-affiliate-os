import { Download } from "lucide-react";

export function ExportEarningsButton() {
  return (
    <a
      href="/api/export/earnings"
      download
      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </a>
  );
}
