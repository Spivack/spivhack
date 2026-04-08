import { describe, it, expect } from 'vitest';
import { getAvailableLanguages, clampStep, stepDirection } from '../tutorial';
import type { Topic } from '../../dsa-types';

// ─── getAvailableLanguages ────────────────────────────────────────────────────

describe('getAvailableLanguages', () => {
  const base: Topic = {
    id: 'test', title: 'Test', description: '', difficulty: 'beginner',
    category: 'test', tags: [],
    steps: [],
  };

  it('returns only languages that appear in at least one step', () => {
    const topic: Topic = {
      ...base,
      steps: [
        { title: 'A', explanation: 'x', code: { python: 'print(1)' } },
        { title: 'B', explanation: 'y', code: { python: 'print(2)', java: 'System.out.println(2);' } },
        { title: 'C', explanation: 'z' },
      ],
    };
    expect(getAvailableLanguages(topic)).toEqual(['python', 'java']);
  });

  it('returns empty array when no steps have code', () => {
    const topic: Topic = {
      ...base,
      steps: [{ title: 'A', explanation: 'x' }],
    };
    expect(getAvailableLanguages(topic)).toEqual([]);
  });

  it('returns all four languages when all are present', () => {
    const topic: Topic = {
      ...base,
      steps: [{
        title: 'A', explanation: 'x',
        code: { python: 'p', java: 'j', javascript: 'js', typescript: 'ts' },
      }],
    };
    expect(getAvailableLanguages(topic)).toEqual(['python', 'java', 'javascript', 'typescript']);
  });

  it('returns languages in canonical order regardless of step order', () => {
    const topic: Topic = {
      ...base,
      steps: [
        { title: 'A', explanation: 'x', code: { typescript: 'ts' } },
        { title: 'B', explanation: 'y', code: { python: 'p' } },
      ],
    };
    // typescript comes after python in canonical order
    expect(getAvailableLanguages(topic)).toEqual(['python', 'typescript']);
  });
});

// ─── clampStep ────────────────────────────────────────────────────────────────

describe('clampStep', () => {
  it('advances forward', () => {
    expect(clampStep(2, 1, 5)).toBe(3);
  });

  it('goes backward', () => {
    expect(clampStep(3, -1, 5)).toBe(2);
  });

  it('clamps at last index when stepping past the end', () => {
    expect(clampStep(4, 1, 5)).toBe(4);
  });

  it('clamps at 0 when stepping before the start', () => {
    expect(clampStep(0, -1, 5)).toBe(0);
  });

  it('handles single-step topic', () => {
    expect(clampStep(0, 1, 1)).toBe(0);
    expect(clampStep(0, -1, 1)).toBe(0);
  });
});

// ─── stepDirection ───────────────────────────────────────────────────────────

describe('stepDirection', () => {
  it('returns 1 when moving forward', () => {
    expect(stepDirection(0, 3)).toBe(1);
  });

  it('returns -1 when moving backward', () => {
    expect(stepDirection(3, 0)).toBe(-1);
  });

  it('returns -1 when jumping back multiple steps', () => {
    expect(stepDirection(5, 1)).toBe(-1);
  });

  it('returns 1 when jumping forward multiple steps', () => {
    expect(stepDirection(1, 5)).toBe(1);
  });
});
