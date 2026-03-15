// Upstash Redis rate limiter for API v1
// 100 requests per hour per API key hash

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_REQUESTS = 100;

function createApiLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1h"),
    prefix: "rl:api:v1",
  });
}

const limiter = createApiLimiter();

export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  if (!limiter) {
    // Graceful fallback: allow request when Upstash is not configured
    return { allowed: true, remaining: MAX_REQUESTS, resetAt: Date.now() + 3600000 };
  }

  const result = await limiter.limit(identifier);
  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}
