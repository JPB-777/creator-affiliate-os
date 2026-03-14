"use server";

import { requireUser } from "@/lib/auth-utils";
import { getPeriodComparison, type PeriodType, type ComparisonResult } from "@/server/queries/comparison";

export async function fetchPeriodComparison(period: PeriodType): Promise<ComparisonResult> {
  const user = await requireUser();
  return getPeriodComparison(user.id, period);
}
