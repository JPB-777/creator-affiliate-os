export interface LinkCheckResult {
  url: string;
  status: "healthy" | "broken" | "redirect" | "timeout";
  httpStatusCode: number | null;
  resolvedUrl: string | null;
}

export async function checkLink(url: string): Promise<LinkCheckResult> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "CreatorAffiliateOS/1.0 (link-checker)",
      },
    });

    const isRedirect = response.redirected;
    const isHealthy = response.status >= 200 && response.status < 400;

    return {
      url,
      status: isHealthy ? (isRedirect ? "redirect" : "healthy") : "broken",
      httpStatusCode: response.status,
      resolvedUrl: isRedirect ? response.url : null,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { url, status: "timeout", httpStatusCode: null, resolvedUrl: null };
    }
    return { url, status: "broken", httpStatusCode: null, resolvedUrl: null };
  }
}

export async function checkLinks(
  urlList: string[],
  concurrency = 5
): Promise<LinkCheckResult[]> {
  const results: LinkCheckResult[] = [];
  for (let i = 0; i < urlList.length; i += concurrency) {
    const batch = urlList.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(checkLink));
    results.push(...batchResults);
  }
  return results;
}
