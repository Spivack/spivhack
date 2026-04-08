import { Link, useLocation } from 'react-router-dom';
import { PUZZLES } from '../data/puzzles';
import { useProgressContext } from '../context/ProgressContext';

export default function Nav() {
  const { pathname } = useLocation();
  const { solvedIds } = useProgressContext();

  return (
    <nav className="w-full border-b border-[#2a2a2a] bg-[#1E1E1E]/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-11 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-pixel text-xl leading-none shrink-0">
          <span className="text-white">Spiv</span>
          <span className="text-gradient">Hack</span>
        </Link>

        {/* Center links */}
        <div className="flex items-center gap-6 font-mono text-sm">
          <Link
            to="/dsa"
            className={`transition-colors ${pathname.startsWith('/dsa') ? 'text-[#00FF00]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            dsa
          </Link>
          <Link
            to="/learn"
            className={`transition-colors ${pathname.startsWith('/learn') ? 'text-[#00FF00]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            security
          </Link>
          <Link
            to="/challenges"
            className={`transition-colors ${pathname.startsWith('/puzzle') || pathname === '/challenges' ? 'text-[#00FF00]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            challenges
          </Link>
        </div>

        {/* Puzzle progress dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          {PUZZLES.map((p) => {
            const isActive = pathname === `/puzzle/${p.id}`;
            const isSolved = solvedIds.has(p.id);
            return (
              <Link
                key={p.id}
                to={p.available ? `/puzzle/${p.id}` : '#'}
                title={`${String(p.id).padStart(2, '0')} — ${p.title}${isSolved ? ' ✓' : ''}`}
                className={`w-2 h-2 border transition-colors ${
                  isActive
                    ? 'bg-[#00FF00] border-[#00FF00] glow-sm'
                    : isSolved
                    ? 'bg-[#004400] border-[#00FF00]'
                    : p.available
                    ? 'bg-transparent border-[#00FF00] hover:border-[#00FF00]'
                    : 'bg-transparent border-[#222] cursor-not-allowed'
                }`}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}
