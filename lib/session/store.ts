import { buildQuestions } from "../quiz/generator";
import { speciesPool } from "../quiz/mockData";
import { buildAnswerExplanation, calculateScoreDelta } from "../quiz/scorer";
import type {
  AnswerRecord,
  QuizQuestion,
  SessionBundle,
  SessionConfig,
  SessionEndReason,
  SessionState,
} from "../../types/quiz";

const SESSION_MAP_KEY = "__BIRD_QUIZ_SESSIONS__";

type GlobalWithSessions = typeof globalThis & {
  [SESSION_MAP_KEY]?: Map<string, SessionBundle>;
};

function getSessionMap(): Map<string, SessionBundle> {
  const globalWithSessions = globalThis as GlobalWithSessions;
  if (!globalWithSessions[SESSION_MAP_KEY]) {
    globalWithSessions[SESSION_MAP_KEY] = new Map<string, SessionBundle>();
  }
  return globalWithSessions[SESSION_MAP_KEY];
}

function createSessionId(): string {
  return `sess_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeConfig(input: Partial<SessionConfig>): SessionConfig {
  return {
    mode: input.mode === "audio_to_image" ? "audio_to_image" : "audio_to_name",
    level: Math.max(1, Math.min(3, input.level ?? 1)),
    region: input.region?.trim() || "CN",
    questionCount: Math.max(5, Math.min(20, input.questionCount ?? 10)),
    lives: Math.max(1, Math.min(5, input.lives ?? 3)),
  };
}

export function createSession(config: SessionConfig): SessionBundle {
  const sessionId = createSessionId();
  const state: SessionState = {
    sessionId,
    ...config,
    score: 0,
    streak: 0,
    bestStreak: 0,
    livesLeft: config.lives,
    answeredCount: 0,
    correctCount: 0,
    wrongCount: 0,
    startedAt: new Date().toISOString(),
    endedAt: null,
    status: "active",
  };

  const bundle: SessionBundle = {
    state,
    questions: buildQuestions(sessionId, config),
    answers: [],
  };

  getSessionMap().set(sessionId, bundle);
  return bundle;
}

export function getSession(sessionId: string): SessionBundle | null {
  return getSessionMap().get(sessionId) ?? null;
}

function findQuestion(session: SessionBundle, questionId: string): QuizQuestion | null {
  return session.questions.find((question) => question.questionId === questionId) ?? null;
}

export function getNextQuestionForSession(sessionId: string): QuizQuestion | null {
  const session = getSession(sessionId);
  if (!session || session.state.status === "ended") {
    return null;
  }

  const answeredIds = new Set(session.answers.map((answer) => answer.questionId));
  return session.questions.find((question) => !answeredIds.has(question.questionId)) ?? null;
}

export function submitAnswer(input: {
  sessionId: string;
  questionId: string;
  selectedOptionId: "A" | "B" | "C" | "D";
  responseTimeMs: number;
}) {
  const session = getSession(input.sessionId);
  if (!session) {
    return { error: "SESSION_NOT_FOUND" as const };
  }
  if (session.state.status === "ended") {
    return { error: "SESSION_ENDED" as const };
  }

  const question = findQuestion(session, input.questionId);
  if (!question) {
    return { error: "QUESTION_NOT_FOUND" as const };
  }

  if (session.answers.some((answer) => answer.questionId === input.questionId)) {
    return { error: "INVALID_ANSWER" as const, message: "Question already answered" };
  }

  const isCorrect = question.correctOptionId === input.selectedOptionId;
  const scoreDelta = calculateScoreDelta({
    isCorrect,
    previousStreak: session.state.streak,
    responseTimeMs: input.responseTimeMs,
    timeLimitSec: question.timeLimitSec,
  });

  session.state.answeredCount += 1;
  if (isCorrect) {
    session.state.correctCount += 1;
    session.state.streak += 1;
    session.state.bestStreak = Math.max(session.state.bestStreak, session.state.streak);
    session.state.score += scoreDelta;
  } else {
    session.state.wrongCount += 1;
    session.state.streak = 0;
    session.state.livesLeft -= 1;
  }

  const answerRecord: AnswerRecord = {
    questionId: input.questionId,
    selectedOptionId: input.selectedOptionId,
    isCorrect,
    responseTimeMs: Math.max(0, input.responseTimeMs),
    answeredAt: new Date().toISOString(),
  };
  session.answers.push(answerRecord);

  if (
    session.state.answeredCount >= session.state.questionCount ||
    session.state.livesLeft <= 0
  ) {
    session.state.status = "ended";
    session.state.endedAt = new Date().toISOString();
  }

  const correctSpecies = speciesPool.find(
    (species) => species.speciesId === question.correctSpeciesId,
  );
  if (!correctSpecies) {
    return { error: "QUESTION_NOT_FOUND" as const };
  }

  return {
    isCorrect,
    scoreDelta,
    question,
    correctSpecies,
    session,
    explanation: buildAnswerExplanation(isCorrect),
  };
}

export function endSession(sessionId: string, _reason: SessionEndReason) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }

  if (session.state.status !== "ended") {
    session.state.status = "ended";
    session.state.endedAt = new Date().toISOString();
  } else if (!session.state.endedAt) {
    session.state.endedAt = new Date().toISOString();
  }

  const mistakes = session.answers
    .filter((answer) => !answer.isCorrect)
    .map((answer) => {
      const question = session.questions.find(
        (item) => item.questionId === answer.questionId,
      );
      if (!question) {
        return null;
      }
      const species = speciesPool.find(
        (item) => item.speciesId === question.correctSpeciesId,
      );
      if (!species) {
        return null;
      }
      return {
        questionId: question.questionId,
        yourOptionId: answer.selectedOptionId,
        correctOptionId: question.correctOptionId,
        speciesId: species.speciesId,
        scientificName: species.scientificName,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const avgResponseTimeMs =
    session.answers.length === 0
      ? 0
      : Math.round(
          session.answers.reduce((sum, item) => sum + item.responseTimeMs, 0) /
            session.answers.length,
        );
  const accuracy =
    session.state.answeredCount === 0
      ? 0
      : Number((session.state.correctCount / session.state.answeredCount).toFixed(2));

  return {
    sessionId: session.state.sessionId,
    result: session.state.livesLeft > 0 ? ("pass" as const) : ("fail" as const),
    finalScore: session.state.score,
    accuracy,
    correctCount: session.state.correctCount,
    wrongCount: session.state.wrongCount,
    avgResponseTimeMs,
    bestStreak: session.state.bestStreak,
    mistakes,
    endedAt: session.state.endedAt ?? new Date().toISOString(),
  };
}

export function getMistakes(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }

  return session.answers
    .filter((answer) => !answer.isCorrect)
    .map((answer) => {
      const question = session.questions.find(
        (item) => item.questionId === answer.questionId,
      );
      if (!question) {
        return null;
      }
      const species = speciesPool.find(
        (item) => item.speciesId === question.correctSpeciesId,
      );
      if (!species) {
        return null;
      }
      return {
        questionId: question.questionId,
        audioUrl: question.audio.url,
        correctSpecies: {
          speciesId: species.speciesId,
          scientificName: species.scientificName,
          commonNameZh: species.commonNameZh,
        },
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
