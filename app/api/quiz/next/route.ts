import { NextResponse } from "next/server";
import {
  getNextQuestionForSession,
  getSession,
} from "../../../../lib/session/store";
import { fail, ok } from "../../../../lib/utils/apiResponse";
import type { NextQuestionResponse } from "../../../../types/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      fail("BAD_REQUEST", "sessionId is required"),
      { status: 400 },
    );
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      fail("SESSION_NOT_FOUND", "Session does not exist"),
      { status: 404 },
    );
  }

  const nextQuestion = getNextQuestionForSession(sessionId);
  if (!nextQuestion) {
    return NextResponse.json(
      fail("QUESTION_NOT_FOUND", "No pending question in this session"),
      { status: 404 },
    );
  }

  const { correctOptionId: _ignoredOption, correctSpeciesId: _ignoredSpecies, ...publicQuestion } =
    nextQuestion;

  return NextResponse.json(ok(publicQuestion as NextQuestionResponse));
}
