import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[1];

function buildQuery(username: string, password: string): string {
  return `SELECT * FROM users\nWHERE username = '${username}'\n  AND password = '${password}'\nLIMIT 1;`;
}

function isBypassed(username: string): boolean {
  const u = username.toLowerCase();
  // comment bypass: close the string, then comment out the rest
  if (/'.*(--)/.test(u)) return true;
  if (/'.*#/.test(u)) return true;
  // tautology: ' OR 1=1, ' OR '1'='1, ' OR true, etc.
  if (/'.*\bor\b.*\b1\s*=\s*1/.test(u)) return true;
  if (/'.*\bor\b.*'[^']*'\s*=\s*'[^']*'/.test(u)) return true;
  if (/'.*\bor\b.*\btrue\b/.test(u)) return true;
  return false;
}

function colorizeQuery(username: string, password: string): { pre: string; injected: string; post: string } | null {
  if (!username.includes("'")) return null;
  const closeIdx = username.indexOf("'");
  return {
    pre: `SELECT * FROM users\nWHERE username = '${username.slice(0, closeIdx)}`,
    injected: username.slice(closeIdx),
    post: `'\n  AND password = '${password}'\nLIMIT 1;`,
  };
}

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      You exploited a SQL injection vulnerability by breaking out of the string literal and modifying the query logic.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> The application concatenated user input directly into the SQL string. A single quote in the input closes the string literal, and anything after it is interpreted as SQL syntax.</p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00]">
      {`-- vulnerable\n"SELECT * FROM users WHERE username = '" + input + "'"\n\n-- safe (parameterized query)\ncursor.execute("SELECT * FROM users WHERE username = %s", (input,))`}
    </div>
    <p className="mt-3"><span className="text-[#00FF00]">How to fix it:</span> Parameterized queries (prepared statements) pass user input as a data binding, not as part of the SQL string. The driver handles escaping. ORMs like SQLAlchemy do this by default.</p>
    <p className="mt-2"><span className="text-[#00FF00]">Real impact:</span> SQL injection can dump entire databases, bypass authentication, and in some configurations execute OS commands via <span className="text-[#00FF00]">xp_cmdshell</span> (MSSQL) or <span className="text-[#00FF00]">INTO OUTFILE</span> (MySQL).</p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A03:2021 — Injection</p>
  </>
);

export default function Puzzle2SQLi() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [solved, setSolved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (isBypassed(username)) setSolved(true);
  };

  const colorized = colorizeQuery(username, password);
  const query = buildQuery(username, password);
  const bypassed = isBypassed(username);

  return (
    <PuzzleShell puzzle={puzzle} solved={solved} onReset={() => { setSolved(false); setUsername(''); setPassword(''); setAttempted(false); }} lesson={LESSON}>
      <div className="space-y-6">
        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// target: </span>internal admin panel — login form with no input sanitization<br />
          <span className="text-[#00FF00]">// objective: </span>bypass authentication without valid credentials<br />
          <span className="text-[#00FF00]">// hint: </span>what happens when a single quote appears inside a SQL string?
        </div>

        {/* Login form */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            LOGIN — admin.spivhack-internal.com
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            <div>
              <label className="block font-mono text-sm text-[#00FF00] mb-1">username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setAttempted(false); }}
                className="w-full bg-[#1E1E1E] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-2 font-mono text-base text-[#00CC00] outline-none placeholder-green-900"
                placeholder="enter username"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block font-mono text-sm text-[#00FF00] mb-1">password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAttempted(false); }}
                className="w-full bg-[#1E1E1E] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-2 font-mono text-base text-[#00CC00] outline-none placeholder-green-900"
                placeholder="enter password"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
            >
              LOGIN
            </button>
            {attempted && !bypassed && (
              <div className="font-mono text-sm text-[#FF0080]">&gt; invalid credentials</div>
            )}
          </form>
        </div>

        {/* Live query */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            CONSTRUCTED QUERY
          </div>
          <pre className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
            {colorized ? (
              <>
                <span className="text-[#00FF00]">{colorized.pre}</span>
                <span className="text-[#FF0080]">{colorized.injected}</span>
                <span className={bypassed ? 'text-[#00FF00] line-through' : 'text-[#00FF00]'}>{colorized.post}</span>
              </>
            ) : (
              <span className="text-[#00FF00]">{query}</span>
            )}
          </pre>
          {bypassed && (
            <div className="px-4 pb-3 font-mono text-sm text-[#00FF00]">
              ✓ query logic bypassed — WHERE clause always evaluates true
            </div>
          )}
        </div>
      </div>
    </PuzzleShell>
  );
}
