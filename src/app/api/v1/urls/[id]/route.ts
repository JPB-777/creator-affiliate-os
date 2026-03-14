import { NextRequest } from "next/server";
import { authenticateApiKey } from "@/lib/api/auth";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getLinksByUrl } from "@/server/queries/links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateApiKey(request);
  if (!auth) return apiError("Unauthorized", 401);

  const { allowed, remaining } = checkRateLimit(auth.userId);
  if (!allowed) return apiError("Rate limit exceeded", 429);

  const { id } = await params;

  const [url] = await db
    .select()
    .from(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, auth.userId)));

  if (!url) return apiError("URL not found", 404);

  const links = await getLinksByUrl(id, auth.userId);

  return apiSuccess(
    { ...url, links },
    { rateLimit: { remaining } }
  );
}
