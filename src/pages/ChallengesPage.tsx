import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { PUZZLES } from '../data/puzzles';
import { useProgressContext } from '../context/ProgressContext';

const DIFFICULTY_COLOR = {
  easy:   'text-[#00FF00]',
  medium: 'text-yellow-500',
  hard:   'text-[#FF0080]',
} as const;

const totalAvailable = PUZZLES.filter((p) => p.available).length;

export default function ChallengesPage() {
  const { solvedIds } = useProgressContext();
  const solvedCount = PUZZLES.filter((p) => solvedIds.has(p.id)).length;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-gray-600 text-sm tracking-widest mb-1">[ CHALLENGES ]</div>
          <h1 className="font-pixel text-4xl text-white leading-none mb-2">Challenges</h1>
          <p className="font-mono text-sm text-gray-400">
            {totalAvailable} interactive OWASP exploits. Exploit the vulnerability, then read why it works and how to prevent it.
            {solvedCount > 0 && (
              <span className="text-[#00FF00] ml-2">{solvedCount}/{totalAvailable} solved</span>
            )}
          </p>
        </div>

        {/* Challenge list */}
        <div className="panel">
          {PUZZLES.map((p) =>
            p.available ? (
              <Link
                key={p.id}
                to={`/puzzle/${p.id}`}
                className="group flex items-center justify-between border-b border-[#232323] last:border-b-0 hover:bg-white/[0.02] px-4 py-4 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`font-mono text-sm w-6 shrink-0 ${solvedIds.has(p.id) ? 'text-[#00FF00]' : 'text-gray-600'}`}>
                    {solvedIds.has(p.id) ? '✓' : String(p.id).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className={`font-pixel text-xl leading-none mb-1 transition-colors ${solvedIds.has(p.id) ? 'text-[#00FF00]' : 'text-gray-100 group-hover:text-white'}`}>
                      {p.title}
                    </div>
                    <div className="font-mono text-sm text-gray-500 truncate">{p.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="font-mono text-sm text-gray-600 hidden sm:block">{p.category}</span>
                  <span className={`font-mono text-sm ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                </div>
              </Link>
            ) : (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-[#232323] last:border-b-0 px-4 py-4 opacity-25"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-sm text-gray-600 w-6 shrink-0">{String(p.id).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <div className="font-pixel text-xl text-gray-500 leading-none mb-1">{p.title}</div>
                    <div className="font-mono text-sm text-gray-600 truncate">{p.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="font-mono text-sm text-gray-600 hidden sm:block">{p.category}</span>
                  <span className={`font-mono text-sm ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-[#2a2a2a] font-mono text-sm text-gray-700 text-center">
          challenges added incrementally — contribute at github.com/Spivack/spivhack
        </div>
      </div>
    </div>
  );
}
