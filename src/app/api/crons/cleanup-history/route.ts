import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { linkStatusHistory } from "@/lib/db/schema";
import { lt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await db
    .delete(linkStatusHistory)
    .where(lt(linkStatusHistory.checkedAt, cutoff));

  return NextResponse.json({
    success: true,
    message: `Cleaned up history records older than 90 days`,
    deletedCount: result.rowCount,
  });
}
