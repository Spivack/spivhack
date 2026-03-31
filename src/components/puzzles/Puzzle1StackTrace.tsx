import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[0];

const LEAKED_PASSWORD = 'r00t_acc3ss_2024';

const STACK_TRACE = `HTTP/1.1 500 Internal Server Error
Content-Type: text/html; charset=utf-8

SqliteError: near "'": syntax error
    at Database.prepare (/app/node_modules/better-sqlite3/lib/database.js:102:21)
    at Object.search (/app/src/routes/reports.js:34:28)
    at Layer.handle (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:144:13)
    at Route.dispatch (/app/node_modules/express/lib/router/route.js:114:3)
    at router (/app/node_modules/express/lib/router/index.js:284:7)
    at app (/app/node_modules/express/lib/application.js:615:22)
    at Server.emit (node:events:514:28)

---- process.env ----
  NODE_ENV         = development
  PORT             = 3000
  DB_PATH          = /app/data/spivhack.db
  DB_PASSWORD      = r00t_acc3ss_2024
  SECRET_KEY       = not-a-real-secret-ignore-me
  ADMIN_EMAIL      = admin@spivhack-internal.com
  LOG_LEVEL        = debug
---------------------`;

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      The server returned a full stack trace — including <span className="text-[#00FF00]">process.env</span> — because it was running in development mode. You used the leaked <span className="text-[#00FF00]">DB_PASSWORD</span> to authenticate as admin.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> <span className="text-gray-300">With <span className="text-[#00FF00]">NODE_ENV=development</span>, Express and most frameworks dump unhandled exceptions to the HTTP response. This hands attackers internal file paths, dependency versions, and in this case, environment variables including credentials.</span></p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00] whitespace-pre">{`// vulnerable — development error handler leaks everything
app.use((err, req, res, next) => {
  res.status(500).send(err.stack);  // full trace to client
});

// safe — generic message in production, full log server-side
app.use((err, req, res, next) => {
  console.error(err);               // log internally
  if (process.env.NODE_ENV === 'production')
    return res.status(500).json({ error: 'Internal server error' });
  res.status(500).json({ error: err.message, stack: err.stack });
});`}</div>
    <p className="mt-3"><span className="text-[#00FF00]">Why env vars are dangerous here:</span> <span className="text-gray-300">Credentials in environment variables are common practice — but if the process dumps <span className="text-[#00FF00]">process.env</span> on error, every secret is exposed at once. Use a secrets manager (AWS Secrets Manager, Vault) and never log or return the full env object.</span></p>
    <p className="mt-2"><span className="text-[#00FF00]">How to fix it:</span> <span className="text-gray-300">Set <span className="text-[#00FF00]">NODE_ENV=production</span> in prod. Return only a generic error message to the client. Rotate any credential that appeared in an error log. Add alerting for 500 spikes — they often indicate active probing.</span></p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A05:2021 — Security Misconfiguration</p>
  </>
);

function triggersError(input: string): boolean {
  return /['"%;\\]/.test(input) || input.trim() === '';
}

export default function Puzzle1StackTrace() {
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [password, setPassword] = useState('');
  const [authAttempted, setAuthAttempted] = useState(false);
  const [solved, setSolved] = useState(false);

  const errorTriggered = sent && triggersError(query);
  const status = !sent ? null : errorTriggered ? 500 : 200;

  const handleSearch = () => {
    setSent(true);
    if (triggersError(query)) {
      setShowTrace(true);
    }
  };

  const handleAuth = () => {
    setAuthAttempted(true);
    if (password === LEAKED_PASSWORD) setSolved(true);
  };

  const handleReset = () => {
    setSolved(false);
    setQuery('');
    setSent(false);
    setShowTrace(false);
    setPassword('');
    setAuthAttempted(false);
  };

  return (
    <PuzzleShell puzzle={puzzle} solved={solved} onReset={handleReset} lesson={LESSON}>
      <div className="space-y-5">

        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// target: </span>report search endpoint at api.spivhack-internal.com<br />
          <span className="text-[#00FF00]">// objective: </span>authenticate as admin<br />
          <span className="text-[#00FF00]">// hint: </span>the server is running in development mode — what happens when you send it something it can&apos;t handle?
        </div>

        {/* Request */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            REQUEST
          </div>
          <div className="p-4 font-mono text-sm space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[#00FF00]">
              <span>GET</span>
              <span>/api/reports/search?q=</span>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSent(false); setShowTrace(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="bg-[#1E1E1E] border border-[#00FF00] px-2 py-0.5 text-[#00CC00] outline-none w-48"
                placeholder="search term..."
                spellCheck={false}
                autoComplete="off"
              />
              <span>HTTP/1.1</span>
            </div>
            <div className="text-gray-600">Host: api.spivhack-internal.com</div>
            <button
              onClick={handleSearch}
              className="px-4 py-1.5 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
            >
              SEND
            </button>
          </div>
        </div>

        {/* Response */}
        {sent && (
          <div className={status === 500 ? 'panel-danger' : 'border border-[#2a2a2a] bg-[#161616]'}>
            <div className={`px-4 py-2 font-mono text-sm flex items-center justify-between ${status === 500 ? 'border-b border-[#4B0082]' : 'border-b border-[#2a2a2a]'}`}>
              <span className="text-gray-600 tracking-widest">RESPONSE</span>
              <span className={status === 200 ? 'text-[#00FF00]' : 'text-[#FF0080]'}>
                {status} {status === 200 ? 'OK' : 'Internal Server Error'}
              </span>
            </div>
            {status === 200 ? (
              <div className="p-4 font-mono text-sm text-[#00FF00]">
                {`{ "results": [], "query": "${query}", "count": 0 }`}
              </div>
            ) : (
              <pre className="p-4 font-mono text-sm text-[#FF0080] leading-relaxed overflow-x-auto whitespace-pre">
                {STACK_TRACE}
              </pre>
            )}
          </div>
        )}

        {/* Admin login — appears after trace */}
        {showTrace && (
          <div className="border border-[#2a2a2a] bg-[#161616]">
            <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
              ADMIN LOGIN
            </div>
            <div className="p-4 font-mono text-sm space-y-3">
              <div className="text-gray-600">POST /api/admin/login</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 w-20 shrink-0">username</span>
                  <span className="text-[#00FF00]">admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 w-20 shrink-0">password</span>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthAttempted(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAuth(); }}
                    className="bg-[#1E1E1E] border border-[#00FF00] px-2 py-0.5 text-[#00CC00] outline-none w-56"
                    placeholder="enter password..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={handleAuth}
                  className="px-4 py-1.5 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
                >
                  AUTHENTICATE
                </button>
                {authAttempted && !solved && (
                  <span className="text-[#FF0080] text-sm">401 Unauthorized</span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </PuzzleShell>
  );
}
