import { describe, it, expect } from 'vitest';
import { categories, topicMap } from '../categories';
import type { Topic, Step, Difficulty } from '../../types';

const VALID_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const VALID_VIZ_TYPES = ['sorting', 'array', 'graph', 'tree'];
const VALID_CALLOUT_TYPES = ['tip', 'warning', 'insight', 'interview'];
const VALID_LANGUAGES = ['python', 'java', 'javascript', 'typescript'];

const allTopics: Topic[] = categories.flatMap((c) => c.topics);

// ─── Category structure ───────────────────────────────────────────────────────

describe('categories', () => {
  it('has at least one category', () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  it('every category has required fields', () => {
    for (const cat of categories) {
      expect(cat.id, `category missing id`).toBeTruthy();
      expect(cat.title, `category ${cat.id} missing title`).toBeTruthy();
      expect(cat.icon, `category ${cat.id} missing icon`).toBeTruthy();
      expect(cat.topics, `category ${cat.id} missing topics array`).toBeInstanceOf(Array);
      expect(cat.topics.length, `category ${cat.id} has no topics`).toBeGreaterThan(0);
    }
  });
});

// ─── topicMap consistency ─────────────────────────────────────────────────────

describe('topicMap', () => {
  it('contains exactly the same number of entries as total topics in categories', () => {
    expect(topicMap.size).toBe(allTopics.length);
  });

  it('every topic ID in categories is present in topicMap', () => {
    for (const topic of allTopics) {
      expect(topicMap.has(topic.id), `topic "${topic.id}" not found in topicMap`).toBe(true);
    }
  });

  it('topicMap lookup returns the correct topic', () => {
    for (const topic of allTopics) {
      expect(topicMap.get(topic.id)).toBe(topic);
    }
  });

  it('has no duplicate topic IDs', () => {
    const ids = allTopics.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ─── Topic schema ─────────────────────────────────────────────────────────────

describe('topic schema', () => {
  it.each(allTopics)('$title — required fields are present and non-empty', (topic) => {
    expect(typeof topic.id).toBe('string');
    expect(topic.id.trim().length).toBeGreaterThan(0);

    expect(typeof topic.title).toBe('string');
    expect(topic.title.trim().length).toBeGreaterThan(0);

    expect(typeof topic.description).toBe('string');
    expect(topic.description.trim().length).toBeGreaterThan(0);

    expect(VALID_DIFFICULTIES).toContain(topic.difficulty);

    expect(typeof topic.category).toBe('string');
    expect(topic.category.trim().length).toBeGreaterThan(0);

    expect(Array.isArray(topic.tags)).toBe(true);
  });

  it.each(allTopics)('$title — category field matches parent category id', (topic) => {
    const parent = categories.find((c) => c.topics.includes(topic));
    expect(parent, `topic "${topic.id}" not found in any category`).toBeDefined();
    expect(topic.category).toBe(parent?.id);
  });

  it.each(allTopics)('$title — has at least one step', (topic) => {
    expect(topic.steps.length).toBeGreaterThan(0);
  });
});

// ─── Step schema ──────────────────────────────────────────────────────────────

function validateStep(step: Step, topicId: string, index: number): void {
  const label = `topic "${topicId}", step ${index}`;

  expect(typeof step.title, `${label}: title must be a string`).toBe('string');
  expect(step.title.trim().length, `${label}: title must not be empty`).toBeGreaterThan(0);

  expect(typeof step.explanation, `${label}: explanation must be a string`).toBe('string');
  expect(step.explanation.trim().length, `${label}: explanation must not be empty`).toBeGreaterThan(0);

  if (step.code !== undefined) {
    for (const lang of VALID_LANGUAGES) {
      const snippet = step.code[lang as keyof typeof step.code];
      if (snippet !== undefined) {
        expect(typeof snippet, `${label}: code.${lang} must be a string`).toBe('string');
        expect(snippet.trim().length, `${label}: code.${lang} must not be empty`).toBeGreaterThan(0);
      }
    }
  }

  if (step.visualization !== undefined) {
    expect(
      VALID_VIZ_TYPES,
      `${label}: visualization.type "${step.visualization.type}" is not valid`
    ).toContain(step.visualization.type);
  }

  if (step.callout !== undefined) {
    expect(
      VALID_CALLOUT_TYPES,
      `${label}: callout.type "${step.callout.type}" is not valid`
    ).toContain(step.callout.type);
    expect(step.callout.text.trim().length, `${label}: callout.text must not be empty`).toBeGreaterThan(0);
  }

  if (step.complexity !== undefined) {
    expect(typeof step.complexity.time, `${label}: complexity.time must be a string`).toBe('string');
    expect(typeof step.complexity.space, `${label}: complexity.space must be a string`).toBe('string');
    expect(step.complexity.time.trim().length, `${label}: complexity.time must not be empty`).toBeGreaterThan(0);
    expect(step.complexity.space.trim().length, `${label}: complexity.space must not be empty`).toBeGreaterThan(0);
  }
}

describe('step schema', () => {
  it.each(allTopics)('$title — all steps pass schema validation', (topic) => {
    topic.steps.forEach((step, i) => validateStep(step, topic.id, i));
  });
});

// ─── Practice problems ────────────────────────────────────────────────────────

describe('practice problems', () => {
  const topicsWithProblems = allTopics.filter((t) => t.practiceProblems?.length);

  it.each(topicsWithProblems)('$title — practice problem URLs are non-empty strings', (topic) => {
    for (const p of topic.practiceProblems ?? []) {
      expect(typeof p.url).toBe('string');
      expect(p.url.trim().length).toBeGreaterThan(0);
      expect(typeof p.title).toBe('string');
      expect(p.title.trim().length).toBeGreaterThan(0);
    }
  });
});
