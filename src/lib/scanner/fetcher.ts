export async function fetchPage(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "CreatorAffiliateOS/1.0 (link-scanner)",
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
