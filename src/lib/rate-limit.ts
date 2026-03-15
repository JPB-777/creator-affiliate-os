import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function createLimiter(
  prefix: string,
  tokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1]
): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
  });
}

// Auth: 5 attempts per minute per IP
const authLimiter = createLimiter("rl:auth", 5, "1m");

// Scans: 50 per day per userId
const scanLimiter = createLimiter("rl:scan", 50, "1d");

// API: 100 per hour per API key hash (replaces in-memory)
const apiLimiter = createLimiter("rl:api", 100, "1h");

export async function checkAuthRateLimit(ip: string): Promise<{ success: boolean }> {
  if (!authLimiter) return { success: true };
  return authLimiter.limit(ip);
}

export async function checkScanRateLimit(userId: string): Promise<{ success: boolean }> {
  if (!scanLimiter) return { success: true };
  return scanLimiter.limit(userId);
}

export async function checkApiRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining?: number;
}> {
  if (!apiLimiter) return { success: true, remaining: 100 };
  const result = await apiLimiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
