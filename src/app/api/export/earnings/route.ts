import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { earnings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allEarnings = await db
    .select()
    .from(earnings)
    .where(eq(earnings.userId, session.user.id))
    .orderBy(desc(earnings.period));

  const csvHeader = "Period,Network,Amount,Currency,Notes\n";
  const csvRows = allEarnings
    .map((e) =>
      [
        e.period,
        `"${e.networkName}"`,
        e.amount,
        e.currency,
        `"${(e.notes ?? "").replace(/"/g, '""')}"`,
      ].join(",")
    )
    .join("\n");

  return new Response(csvHeader + csvRows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="earnings-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
