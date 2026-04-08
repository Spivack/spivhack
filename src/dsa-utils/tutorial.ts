import type { Language, Topic } from '../dsa-types';

export const ALL_LANGUAGES: Language[] = ['python', 'java', 'javascript', 'typescript'];

/** Returns the languages that have at least one code snippet across any step in the topic. */
export function getAvailableLanguages(topic: Topic): Language[] {
  return ALL_LANGUAGES.filter((lang) =>
    topic.steps.some((step) => Boolean(step.code?.[lang]))
  );
}

/** Returns the step index to navigate to, or the current index if already at a boundary. */
export function clampStep(current: number, delta: number, total: number): number {
  return Math.max(0, Math.min(total - 1, current + delta));
}

/** Returns the slide direction for animations: 1 = forward, -1 = backward. */
export function stepDirection(from: number, to: number): 1 | -1 {
  return to > from ? 1 : -1;
}
