import { NextResponse } from "next/server";
import { submitAnswer } from "../../../../lib/session/store";
import { fail, ok } from "../../../../lib/utils/apiResponse";
import type { AnswerQuestionRequest, AnswerQuestionResponse } from "../../../../types/api";

export async function POST(request: Request) {
  let body: AnswerQuestionRequest;
  try {
    body = (await request.json()) as AnswerQuestionRequest;
  } catch (_error) {
    return NextResponse.json(fail("BAD_REQUEST", "Invalid JSON body"), {
      status: 400,
    });
  }

  if (!body.sessionId || !body.questionId || !body.selectedOptionId) {
    return NextResponse.json(
      fail("BAD_REQUEST", "sessionId, questionId and selectedOptionId are required"),
      { status: 400 },
    );
  }

  const result = submitAnswer({
    sessionId: body.sessionId,
    questionId: body.questionId,
    selectedOptionId: body.selectedOptionId,
    responseTimeMs: body.responseTimeMs ?? 0,
  });

  if ("error" in result) {
    const statusByCode = {
      SESSION_NOT_FOUND: 404,
      QUESTION_NOT_FOUND: 404,
      SESSION_ENDED: 409,
      INVALID_ANSWER: 400,
    } as const;

    return NextResponse.json(
      fail(result.error, result.message ?? "Failed to submit answer"),
      { status: statusByCode[result.error] },
    );
  }

  const response: AnswerQuestionResponse = {
    questionId: result.question.questionId,
    isCorrect: result.isCorrect,
    correctOptionId: result.question.correctOptionId,
    correctSpecies: {
      speciesId: result.correctSpecies.speciesId,
      scientificName: result.correctSpecies.scientificName,
      commonNameZh: result.correctSpecies.commonNameZh,
    },
    scoreDelta: result.scoreDelta,
    streak: result.session.state.streak,
    livesLeft: result.session.state.livesLeft,
    sessionProgress: {
      answered: result.session.state.answeredCount,
      remaining: result.session.state.questionCount - result.session.state.answeredCount,
      totalScore: result.session.state.score,
    },
    explanation: result.explanation,
  };

  return NextResponse.json(ok(response));
}
