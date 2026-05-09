import { NextResponse } from "next/server";
import { getMistakes } from "../../../../lib/session/store";
import { fail, ok } from "../../../../lib/utils/apiResponse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      fail("BAD_REQUEST", "sessionId is required"),
      { status: 400 },
    );
  }

  const items = getMistakes(sessionId);
  if (!items) {
    return NextResponse.json(
      fail("SESSION_NOT_FOUND", "Session does not exist"),
      { status: 404 },
    );
  }

  return NextResponse.json(ok({ sessionId, items }));
}
