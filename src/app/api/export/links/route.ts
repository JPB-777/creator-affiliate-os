import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allLinks = await db
    .select()
    .from(links)
    .where(and(eq(links.userId, session.user.id), eq(links.isAffiliate, true)));

  const csvHeader = "URL,Anchor Text,Network,Status,HTTP Status,Last Checked\n";
  const csvRows = allLinks
    .map((l) =>
      [
        `"${l.originalUrl}"`,
        `"${(l.anchorText ?? "").replace(/"/g, '""')}"`,
        l.networkName ?? "",
        l.status,
        l.httpStatusCode ?? "",
        l.lastCheckedAt ? new Date(l.lastCheckedAt).toISOString() : "",
      ].join(",")
    )
    .join("\n");

  return new Response(csvHeader + csvRows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="affiliate-links-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
