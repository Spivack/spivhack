import { useParams, Link } from 'react-router-dom';
import Puzzle1StackTrace from '../components/puzzles/Puzzle1StackTrace';
import Puzzle2SQLi from '../components/puzzles/Puzzle2SQLi';
import Puzzle3XSS from '../components/puzzles/Puzzle3XSS';
import Puzzle4IDOR from '../components/puzzles/Puzzle4IDOR';
import Puzzle5PathTraversal from '../components/puzzles/Puzzle5PathTraversal';
import Puzzle6WeakToken from '../components/puzzles/Puzzle6WeakToken';

const PUZZLE_COMPONENTS: Record<number, React.ComponentType> = {
  1: Puzzle1StackTrace,
  2: Puzzle2SQLi,
  3: Puzzle3XSS,
  4: Puzzle4IDOR,
  5: Puzzle5PathTraversal,
  6: Puzzle6WeakToken,
};

export default function PuzzlePage() {
  const { id } = useParams<{ id: string }>();
  const puzzleId = parseInt(id ?? '', 10);
  const Component = PUZZLE_COMPONENTS[puzzleId];

  if (!Component) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center font-mono text-[#005500]">
        <div className="text-6xl mb-4 font-pixel text-[#003300]">404</div>
        <div className="mb-6">puzzle {id} not found</div>
        <Link to="/" className="text-[#00FF00] hover:text-[#00FF00] transition-colors text-sm">← back to menu</Link>
      </div>
    );
  }

  return <Component />;
}
