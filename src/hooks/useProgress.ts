import { useState, useCallback } from 'react';

const STORAGE_KEY = 'spivhack_solved_puzzles';

function readSolved(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as number[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function writeSolved(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage unavailable — silent fail
  }
}

export function useProgress() {
  const [solvedIds, setSolvedIds] = useState<Set<number>>(readSolved);

  const markSolved = useCallback((id: number) => {
    setSolvedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      writeSolved(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const empty = new Set<number>();
    writeSolved(empty);
    setSolvedIds(empty);
  }, []);

  return { solvedIds, markSolved, resetAll };
}
