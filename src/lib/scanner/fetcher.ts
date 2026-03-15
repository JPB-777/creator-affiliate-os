import { validateUrl } from "./url-validator";

export async function fetchPage(url: string) {
  const validation = await validateUrl(url);
  if (!validation.valid) {
    throw new Error(`Blocked URL: ${validation.error}`);
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AffiliateOS/1.0 (link-scanner)",
      Accept: "text/html",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  const html = await response.text();
  return {
    html,
    finalUrl: response.url,
    statusCode: response.status,
  };
}
