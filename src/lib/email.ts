import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface BrokenLink {
  url: string;
  network: string | null;
  httpStatus: number | null;
}

export async function sendBrokenLinksAlert(
  userEmail: string,
  brokenLinks: BrokenLink[],
  pageTitle: string,
  pageUrl: string
) {
  if (!resend || brokenLinks.length === 0) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const linksList = brokenLinks
    .map(
      (l) =>
        `- ${l.url}\n  Network: ${l.network || "Unknown"} | HTTP: ${l.httpStatus ?? "N/A"}`
    )
    .join("\n");

  await resend.emails.send({
    from: "AffiliateOS <onboarding@resend.dev>",
    to: userEmail,
    subject: `AffiliateOS: ${brokenLinks.length} broken link${brokenLinks.length > 1 ? "s" : ""} on "${pageTitle}"`,
    text: `${brokenLinks.length} broken affiliate link${brokenLinks.length > 1 ? "s were" : " was"} detected on:\n${pageTitle}\n${pageUrl}\n\nBroken links:\n${linksList}\n\nView details: ${appUrl}/dashboard\n\n— AffiliateOS`,
  });
}
