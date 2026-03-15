import dns from "dns/promises";

const BLOCKED_PROTOCOLS = new Set(["file:", "ftp:", "gopher:", "data:", "javascript:"]);

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

function isPrivateIp(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip));
}

export async function validateUrl(rawUrl: string): Promise<{ valid: boolean; error?: string }> {
  if (rawUrl.length > 2048) {
    return { valid: false, error: "URL too long (max 2048 characters)" };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { valid: false, error: "Invalid URL" };
  }

  if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
    return { valid: false, error: `Blocked protocol: ${parsed.protocol}` };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, error: "Only HTTP and HTTPS are allowed" };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || hostname === "localhost") {
    return { valid: false, error: "Blocked hostname" };
  }

  // IP literal check (e.g. http://192.168.1.1/)
  if (isPrivateIp(hostname)) {
    return { valid: false, error: "Private IP addresses are not allowed" };
  }

  // DNS resolution to catch rebinding attacks
  try {
    const ipv4 = await dns.resolve4(hostname).catch(() => [] as string[]);
    const ipv6 = await dns.resolve6(hostname).catch(() => [] as string[]);
    const allAddrs = [...ipv4, ...ipv6];

    if (allAddrs.length === 0) {
      return { valid: false, error: "DNS resolution failed" };
    }

    for (const addr of allAddrs) {
      if (isPrivateIp(addr)) {
        return { valid: false, error: "URL resolves to a private IP address" };
      }
    }
  } catch {
    return { valid: false, error: "DNS resolution failed" };
  }

  return { valid: true };
}
