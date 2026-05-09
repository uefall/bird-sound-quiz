import type {
  QuizMode,
  QuizQuestion,
  SessionEndReason,
  SessionState,
  Species,
} from "./quiz";

export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiFailure {
  ok: false;
  error: {
    code:
      | "BAD_REQUEST"
      | "SESSION_NOT_FOUND"
      | "QUESTION_NOT_FOUND"
      | "INVALID_ANSWER"
      | "SESSION_ENDED";
    message: string;
    details?: Record<string, unknown>;
  };
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface StartSessionRequest {
  mode: QuizMode;
  level?: number;
  region?: string;
  questionCount?: number;
  lives?: number;
}

export interface StartSessionResponse extends SessionState {}

export interface NextQuestionResponse
  extends Omit<QuizQuestion, "correctOptionId" | "correctSpeciesId"> {}

export interface AnswerQuestionRequest {
  sessionId: string;
  questionId: string;
  selectedOptionId: "A" | "B" | "C" | "D";
  responseTimeMs: number;
}

export interface AnswerQuestionResponse {
  questionId: string;
  isCorrect: boolean;
  correctOptionId: "A" | "B" | "C" | "D";
  correctSpecies: Pick<Species, "speciesId" | "scientificName" | "commonNameZh">;
  scoreDelta: number;
  streak: number;
  livesLeft: number;
  sessionProgress: {
    answered: number;
    remaining: number;
    totalScore: number;
  };
  explanation: string;
}

export interface EndSessionRequest {
  sessionId: string;
  reason: SessionEndReason;
}

export interface EndSessionResponse {
  sessionId: string;
  result: "pass" | "fail";
  finalScore: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  avgResponseTimeMs: number;
  bestStreak: number;
  mistakes: Array<{
    questionId: string;
    yourOptionId: "A" | "B" | "C" | "D";
    correctOptionId: "A" | "B" | "C" | "D";
    speciesId: string;
    scientificName: string;
  }>;
  endedAt: string;
}
