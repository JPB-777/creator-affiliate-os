import { NextRequest } from "next/server";
import { authenticateApiKey } from "@/lib/api/auth";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getEarnings } from "@/server/queries/earnings";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if (!auth) return apiError("Unauthorized", 401);

  const { allowed, remaining } = checkRateLimit(auth.userId);
  if (!allowed) return apiError("Rate limit exceeded", 429);

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const network = request.nextUrl.searchParams.get("network") || undefined;

  const result = await getEarnings(auth.userId, page, 20, { network });

  return apiSuccess(result.data, {
    total: result.total,
    totalPages: result.totalPages,
    page,
    rateLimit: { remaining },
  });
}
