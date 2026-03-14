import { NextRequest, NextResponse } from "next/server";
import { getUrlsDueForScan } from "@/server/queries/urls";
import { triggerScan } from "@/server/actions/scans";

export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlsToScan = await getUrlsDueForScan(10);
  const results: { url: string; status: "success" | "error"; error?: string }[] = [];

  for (const urlRecord of urlsToScan) {
    try {
      await triggerScan(urlRecord.id, urlRecord.userId);
      results.push({ url: urlRecord.url, status: "success" });
    } catch (error) {
      results.push({
        url: urlRecord.url,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    scanned: results.length,
    success: results.filter((r) => r.status === "success").length,
    errors: results.filter((r) => r.status === "error").length,
    results,
  });
}
