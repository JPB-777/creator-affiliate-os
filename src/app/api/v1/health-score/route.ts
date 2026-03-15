import { NextRequest } from "next/server";
import { authenticateApiKey } from "@/lib/api/auth";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getHealthScore } from "@/server/queries/health-score";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if (!auth) return apiError("Unauthorized", 401);

  const { allowed, remaining } = await checkRateLimit(auth.userId);
  if (!allowed) return apiError("Rate limit exceeded", 429);

  const score = await getHealthScore(auth.userId);

  return apiSuccess(score, { rateLimit: { remaining } });
}
