import { NextResponse } from "next/server";
import { endSession } from "../../../../lib/session/store";
import { fail, ok } from "../../../../lib/utils/apiResponse";
import type { EndSessionRequest } from "../../../../types/api";

export async function POST(request: Request) {
  let body: EndSessionRequest;
  try {
    body = (await request.json()) as EndSessionRequest;
  } catch (_error) {
    return NextResponse.json(fail("BAD_REQUEST", "Invalid JSON body"), {
      status: 400,
    });
  }

  if (!body.sessionId) {
    return NextResponse.json(fail("BAD_REQUEST", "sessionId is required"), {
      status: 400,
    });
  }

  if (!body.reason) {
    return NextResponse.json(fail("BAD_REQUEST", "reason is required"), {
      status: 400,
    });
  }

  const result = endSession(body.sessionId, body.reason);
  if (!result) {
    return NextResponse.json(
      fail("SESSION_NOT_FOUND", "Session does not exist"),
      { status: 404 },
    );
  }

  return NextResponse.json(ok(result));
}
