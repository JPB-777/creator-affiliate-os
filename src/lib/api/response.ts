import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({
    data,
    meta: meta ?? {},
  });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json(
    { error: { message } },
    { status }
  );
}
