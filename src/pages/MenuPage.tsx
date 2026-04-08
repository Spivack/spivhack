import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { PUZZLES } from '../data/puzzles';
import { REFERENCE_SECTIONS } from '../data/reference-topics';
import { useProgressContext } from '../context/ProgressContext';
import { categories } from '../dsa-data/categories';

const DIFFICULTY_COLOR = {
  easy:   'text-[#00FF00]',
  medium: 'text-yellow-500',
  hard:   'text-[#FF0080]',
} as const;

const totalSecurityTopics = REFERENCE_SECTIONS.reduce((n, s) => n + s.topics.length, 0);
const totalDsaTopics = categories.reduce((n, c) => n + c.topics.length, 0);

export default function MenuPage() {
  const { solvedIds } = useProgressContext();

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="font-pixel text-5xl sm:text-6xl mb-2 leading-none">
            <span className="text-white">Spiv</span>
            <span className="text-gradient">Hack</span>
          </div>
          <div className="font-mono text-gray-500 text-base">
            // interactive security lab — puzzles and reference material
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── DSA ── */}
          <div className="panel p-6 flex flex-col gap-4">
            <div>
              <div className="font-mono text-gray-600 text-sm tracking-widest mb-2">[ DSA ]</div>
              <div className="font-pixel text-3xl text-white leading-none mb-2">DSA</div>
              <p className="font-mono text-sm text-gray-400 leading-relaxed">
                {totalDsaTopics} topics across {categories.length} categories — complexity, sorting, graphs, dynamic programming, and more.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/dsa/topic/${cat.topics[0].id}`}
                  className="group flex items-baseline justify-between border border-[#2a2a2a] hover:border-[#00FF00] hover:bg-[#161616] px-3 py-2 transition-colors"
                >
                  <span className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                    {cat.icon} {cat.title}
                  </span>
                  <span className="font-mono text-sm text-gray-600 shrink-0 ml-2">{cat.topics.length}</span>
                </Link>
              ))}
            </div>
            <Link
              to="/dsa"
              className="font-mono text-sm text-[#00FF00] transition-colors"
            >
              &gt; browse all topics →
            </Link>
          </div>

          {/* ── Security ── */}
          <div className="panel p-6 flex flex-col gap-4">
            <div>
              <div className="font-mono text-gray-600 text-sm tracking-widest mb-2">[ REFERENCE ]</div>
              <div className="font-pixel text-3xl text-white leading-none mb-2">Security</div>
              <p className="font-mono text-sm text-gray-400 leading-relaxed">
                {totalSecurityTopics} topics across 8 sections. Security+, CEH, OSCP reference material — crypto, networks, identity, AI security, and more.
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {REFERENCE_SECTIONS.map((section) => (
                <div key={section.id} className="flex items-baseline justify-between">
                  <span className="font-mono text-sm text-gray-400">{section.title}</span>
                  <span className="font-mono text-sm text-gray-600">{section.topics.length} topics</span>
                </div>
              ))}
            </div>
            <Link
              to="/learn"
              className="font-mono text-sm text-[#00FF00] transition-colors"
            >
              &gt; browse all topics →
            </Link>
          </div>

          {/* ── Challenges ── */}
          <div className="panel p-6 flex flex-col gap-4">
            <div>
              <div className="font-mono text-gray-600 text-sm tracking-widest mb-2">[ CHALLENGES ]</div>
              <div className="font-pixel text-3xl text-white leading-none mb-2">Challenges</div>
              <p className="font-mono text-sm text-gray-400 leading-relaxed">
                Interactive OWASP exploits. Each challenge is a real vulnerability class — exploit it, then read why it works and how to prevent it.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              {PUZZLES.map((p) =>
                p.available ? (
                  <Link
                    key={p.id}
                    to={`/puzzle/${p.id}`}
                    className="group flex items-baseline justify-between border border-[#2a2a2a] hover:border-[#00FF00] hover:bg-[#161616] px-3 py-2 transition-colors"
                  >
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className={`font-mono text-sm shrink-0 ${solvedIds.has(p.id) ? 'text-[#00FF00]' : 'text-gray-600'}`}>
                        {solvedIds.has(p.id) ? '✓' : String(p.id).padStart(2, '0')}
                      </span>
                      <span className={`font-pixel text-base leading-none truncate transition-colors ${solvedIds.has(p.id) ? 'text-[#00FF00] group-hover:text-[#00CC00]' : 'text-gray-200 group-hover:text-white'}`}>
                        {p.title}
                      </span>
                    </div>
                    <span className={`font-mono text-sm shrink-0 ml-2 ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                  </Link>
                ) : (
                  <div
                    key={p.id}
                    className="flex items-baseline justify-between border border-[#222] px-3 py-2 opacity-25"
                  >
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-mono text-gray-600 text-sm shrink-0">{String(p.id).padStart(2, '0')}</span>
                      <span className="font-pixel text-base text-gray-500 leading-none truncate">{p.title}</span>
                    </div>
                    <span className={`font-mono text-sm shrink-0 ml-2 ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                  </div>
                )
              )}
            </div>
            <Link
              to="/challenges"
              className="font-mono text-sm text-[#00FF00] transition-colors"
            >
              &gt; browse challenges →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-[#2a2a2a] flex items-center justify-between font-mono text-sm text-gray-700">
          <span>spivhack.com</span>
          <span>evan&#64;spivack.io</span>
        </div>
      </div>
    </div>
  );
}
