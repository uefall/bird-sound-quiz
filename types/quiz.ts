export type QuizMode = "audio_to_name" | "audio_to_image";

export type SessionEndReason = "completed" | "failed" | "quit";

export interface Species {
  speciesId: string;
  scientificName: string;
  commonNameZh: string;
  imageUrl: string;
  taxonomy: {
    order: string;
    family: string;
  };
}

export interface Recording {
  recordingId: string;
  speciesId: string;
  audioUrl: string;
  durationSec: number;
  quality: "A" | "B" | "C";
  license: string;
  source: "xeno-canto";
  sourceId: string;
}

export interface NameOption {
  optionId: "A" | "B" | "C" | "D";
  speciesId: string;
  scientificName: string;
}

export interface ImageOption {
  optionId: "A" | "B" | "C" | "D";
  speciesId: string;
  imageUrl: string;
}

export interface BaseQuestion {
  questionId: string;
  sessionId: string;
  index: number;
  mode: QuizMode;
  prompt: string;
  timeLimitSec: number;
  audio: {
    url: string;
    durationSec: number;
    license: string;
    source: "xeno-canto";
    sourceId: string;
  };
  correctOptionId: "A" | "B" | "C" | "D";
  correctSpeciesId: string;
}

export interface AudioToNameQuestion extends BaseQuestion {
  mode: "audio_to_name";
  options: NameOption[];
}

export interface AudioToImageQuestion extends BaseQuestion {
  mode: "audio_to_image";
  options: ImageOption[];
}

export type QuizQuestion = AudioToNameQuestion | AudioToImageQuestion;

export interface SessionConfig {
  mode: QuizMode;
  level: number;
  region: string;
  questionCount: number;
  lives: number;
}

export interface SessionState extends SessionConfig {
  sessionId: string;
  score: number;
  streak: number;
  bestStreak: number;
  livesLeft: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  startedAt: string;
  endedAt: string | null;
  status: "active" | "ended";
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  responseTimeMs: number;
  answeredAt: string;
}

export interface SessionBundle {
  state: SessionState;
  questions: QuizQuestion[];
  answers: AnswerRecord[];
}
