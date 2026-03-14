import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-utils";
import { getNotifications } from "@/server/queries/notifications";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: [] });
  }

  const result = await getNotifications(user.id, 1, 50);
  return NextResponse.json(result);
}
