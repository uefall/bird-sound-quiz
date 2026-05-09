import { NextResponse } from "next/server";
import { createSession, normalizeConfig } from "../../../../lib/session/store";
import { fail, ok } from "../../../../lib/utils/apiResponse";
import type { StartSessionRequest } from "../../../../types/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StartSessionRequest;
    const config = normalizeConfig({
      mode: body.mode,
      level: body.level,
      region: body.region,
      questionCount: body.questionCount,
      lives: body.lives,
    });

    const bundle = createSession(config);
    return NextResponse.json(ok(bundle.state));
  } catch (_error) {
    return NextResponse.json(
      fail("BAD_REQUEST", "Invalid request body for session start"),
      { status: 400 },
    );
  }
}
