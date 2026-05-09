interface ScoreInput {
  isCorrect: boolean;
  previousStreak: number;
  responseTimeMs: number;
  timeLimitSec: number;
}

export function calculateScoreDelta(input: ScoreInput): number {
  if (!input.isCorrect) {
    return 0;
  }

  const baseScore = 100;
  const speedRatio = Math.max(
    0,
    Math.min(1, 1 - input.responseTimeMs / (input.timeLimitSec * 1000)),
  );
  const speedBonus = Math.round(speedRatio * 40);
  const nextStreak = input.previousStreak + 1;
  const streakBonus = Math.min(60, Math.max(0, (nextStreak - 1) * 8));
  return baseScore + speedBonus + streakBonus;
}

export function buildAnswerExplanation(isCorrect: boolean): string {
  if (isCorrect) {
    return "回答正确，已累计连击与速度加分。";
  }
  return "回答错误，可在结算后进入错题回顾模式强化训练。";
}
