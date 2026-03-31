import { type ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav';
import type { PuzzleMeta } from '../../data/puzzles';
import { useProgressContext } from '../../context/ProgressContext';

const DIFFICULTY_COLOR = {
  easy:   'text-[#00FF00] border-[#2a2a2a]',
  medium: 'text-yellow-500 border-yellow-900',
  hard:   'text-[#FF0080] border-[#FF008040]',
} as const;

interface Props {
  puzzle: PuzzleMeta;
  solved: boolean;
  onReset: () => void;
  lesson: ReactNode;
  children: ReactNode;
}

export default function PuzzleShell({ puzzle, solved, onReset, lesson, children }: Props) {
  const { markSolved } = useProgressContext();

  useEffect(() => {
    if (solved) markSolved(puzzle.id);
  }, [solved, puzzle.id, markSolved]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="font-mono text-gray-600 text-sm tracking-widest mb-1">
              PUZZLE {String(puzzle.id).padStart(2, '0')} — {puzzle.category.toUpperCase()}
            </div>
            <h1 className="font-pixel text-4xl text-white leading-none">{puzzle.title}</h1>
            <p className="font-mono text-sm text-gray-400 mt-2 max-w-lg leading-relaxed">{puzzle.subtitle}</p>
          </div>
          <span className={`font-mono text-sm border px-2 py-1 mt-1 shrink-0 ${DIFFICULTY_COLOR[puzzle.difficulty]}`}>
            {puzzle.difficulty}
          </span>
        </div>

        {/* Challenge or solved state */}
        {solved ? (
          <div className="panel">
            <div className="px-5 py-3 border-b border-[#00FF00] flex items-center justify-between">
              <span className="font-mono text-[#00FF00] text-base tracking-wider">✓ ACCESS GRANTED</span>
              <button
                onClick={onReset}
                className="font-mono text-sm text-[#005500] hover:text-[#00FF00] transition-colors"
              >
                reset
              </button>
            </div>
            <div className="p-6 space-y-4 font-mono text-sm text-gray-300 leading-relaxed">
              {lesson}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Link
                to="/"
                className="px-4 py-2 border border-[#2a2a2a] text-[#00FF00] hover:text-[#00CC00] hover:border-[#00FF00] font-mono text-sm transition-colors"
              >
                ← menu
              </Link>
              {puzzle.id < 6 && (
                <Link
                  to={`/puzzle/${puzzle.id + 1}`}
                  className="px-4 py-2 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
                >
                  next puzzle →
                </Link>
              )}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
