import { NextRequest, NextResponse } from "next/server";
import { getUsersForWeeklyReport, getWeeklyReportData } from "@/server/queries/weekly-report";
import { buildWeeklyReportEmail } from "@/lib/email-templates/weekly-report";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getUsersForWeeklyReport();
  let sent = 0;
  let failed = 0;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://affiliateos.vercel.app";

  for (const user of users) {
    try {
      const data = await getWeeklyReportData(user.userId);
      const { subject, html } = buildWeeklyReportEmail({
        userName: user.name,
        ...data,
        recentBroken: data.recentBroken.map((b) => ({
          urlTitle: b.urlTitle,
          urlUrl: b.urlUrl,
          brokenCount: b.brokenCount,
        })),
        appUrl,
      });

      // Send via Resend if configured
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "AffiliateOS <onboarding@resend.dev>",
          to: user.email,
          subject,
          html,
        });
        sent++;
      }
    } catch {
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    usersProcessed: users.length,
    sent,
    failed,
  });
}
