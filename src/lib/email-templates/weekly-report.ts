interface WeeklyReportData {
  userName: string;
  totalUrls: number;
  brokenLinks: number;
  scansThisWeek: number;
  earningsThisWeek: string;
  recentBroken: { urlTitle: string | null; urlUrl: string; brokenCount: number | null }[];
  appUrl: string;
}

export function buildWeeklyReportEmail(data: WeeklyReportData): { subject: string; html: string } {
  const brokenSection =
    data.recentBroken.length > 0
      ? `
        <h3 style="margin: 24px 0 12px; font-size: 16px; color: #333;">Broken Links Found</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${data.recentBroken
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;">
                ${item.urlTitle || item.urlUrl}
              </td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; color: #dc2626; text-align: right;">
                ${item.brokenCount ?? 0} broken
              </td>
            </tr>`
            )
            .join("")}
        </table>`
      : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
    <h1 style="font-size: 24px; margin: 0 0 8px; color: #111;">Weekly Report</h1>
    <p style="color: #6b7280; margin: 0 0 24px; font-size: 14px;">Hi ${data.userName}, here's your AffiliateOS summary.</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
      <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #1d4ed8;">${data.totalUrls}</div>
        <div style="font-size: 12px; color: #6b7280;">Tracked URLs</div>
      </div>
      <div style="background: ${data.brokenLinks > 0 ? "#fef2f2" : "#f0fdf4"}; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: ${data.brokenLinks > 0 ? "#dc2626" : "#16a34a"};">${data.brokenLinks}</div>
        <div style="font-size: 12px; color: #6b7280;">Broken Links</div>
      </div>
      <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #1d4ed8;">${data.scansThisWeek}</div>
        <div style="font-size: 12px; color: #6b7280;">Scans This Week</div>
      </div>
      <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #16a34a;">$${parseFloat(data.earningsThisWeek).toFixed(2)}</div>
        <div style="font-size: 12px; color: #6b7280;">Earnings This Week</div>
      </div>
    </div>

    ${brokenSection}

    <div style="margin-top: 24px; text-align: center;">
      <a href="${data.appUrl}/dashboard" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View Dashboard</a>
    </div>

    <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
      You're receiving this because weekly reports are enabled.
      <a href="${data.appUrl}/settings" style="color: #6366f1;">Manage preferences</a>
    </p>
  </div>
</body>
</html>`;

  return {
    subject: `AffiliateOS Weekly: ${data.brokenLinks > 0 ? `${data.brokenLinks} broken links` : "All links healthy"}`,
    html,
  };
}
