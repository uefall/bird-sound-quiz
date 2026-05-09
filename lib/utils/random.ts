export const OPTION_IDS = ["A", "B", "C", "D"] as const;

export function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function pickRandom<T>(items: T[]): T {
  return items[randomInt(items.length)];
}

export function shuffle<T>(items: T[]): T[] {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}
