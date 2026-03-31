import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[5];

// The original token — base64 encoded JSON, no signature
const ORIGINAL_PAYLOAD = { userId: 412, role: 'user', username: 'visitor_412', exp: 1700954400 };
const ORIGINAL_TOKEN = btoa(JSON.stringify(ORIGINAL_PAYLOAD));

function tryDecode(token: string): { ok: boolean; parsed?: Record<string, unknown>; error?: string } {
  try {
    const decoded = atob(token.trim());
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    return { ok: true, parsed };
  } catch {
    return { ok: false, error: 'invalid base64 or JSON' };
  }
}

function encode(obj: Record<string, unknown>): string {
  return btoa(JSON.stringify(obj));
}

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      You modified the session token to elevate your role from <span className="text-[#00FF00]">user</span> to <span className="text-[#00FF00]">admin</span>. The server accepted it because the token has no cryptographic signature.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> The token is just base64-encoded JSON — it&apos;s encoding, not encryption, and provides zero integrity protection. Anyone who can read their own token can forge a different one.</p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00] whitespace-pre">{`// vulnerable — unsigned token
const token = Buffer.from(JSON.stringify(payload)).toString('base64');
// attacker decodes, edits role, re-encodes — server can't tell

// safe — JWT with HMAC signature (HS256)
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

// on verify, any tampering invalidates the signature:
jwt.verify(token, process.env.SECRET_KEY);  // throws if modified`}</div>
    <p className="mt-3"><span className="text-[#00FF00]">JWT caveats:</span> JWTs are signed but not encrypted by default — the payload is still readable. Use <span className="text-[#00FF00]">alg: RS256</span> (asymmetric) in production. Watch for the <span className="text-[#00FF00]">alg: none</span> attack — some libraries accept unsigned tokens if the algorithm is set to &quot;none&quot;.</p>
    <p className="mt-2"><span className="text-[#00FF00]">How to fix it:</span> Always sign tokens with a strong secret (HMAC-SHA256 minimum). Validate the signature on every request. Store minimal claims — don&apos;t put role data in the token if you can look it up from the session store server-side.</p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A07:2021 — Identification and Authentication Failures</p>
  </>
);

export default function Puzzle6WeakToken() {
  const [token, setToken] = useState(ORIGINAL_TOKEN);
  const [editingJson, setEditingJson] = useState('');
  const [mode, setMode] = useState<'token' | 'json'>('token');
  const [solved, setSolved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const decoded = tryDecode(token);
  const isAdmin = decoded.ok && decoded.parsed?.role === 'admin';

  const handleDecode = () => {
    if (decoded.ok && decoded.parsed) {
      setEditingJson(JSON.stringify(decoded.parsed, null, 2));
      setMode('json');
    }
  };

  const handleEncode = () => {
    try {
      const parsed = JSON.parse(editingJson) as Record<string, unknown>;
      setToken(encode(parsed));
      setMode('token');
    } catch {
      // bad json, stay in json mode
    }
  };

  const handleSend = () => {
    setSubmitted(true);
    if (isAdmin) setSolved(true);
  };

  return (
    <PuzzleShell
      puzzle={puzzle}
      solved={solved}
      onReset={() => { setSolved(false); setToken(ORIGINAL_TOKEN); setEditingJson(''); setMode('token'); setSubmitted(false); }}
      lesson={LESSON}
    >
      <div className="space-y-6">
        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// context: </span>the app stores your session in a cookie called <span className="text-[#00FF00]">auth_token</span><br />
          <span className="text-[#00FF00]">// objective: </span>gain admin access without knowing the admin credentials<br />
          <span className="text-[#00FF00]">// hint: </span>the token is not encrypted — it is only encoded. what is base64?
        </div>

        {/* Cookie panel */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            YOUR SESSION COOKIE
          </div>
          <div className="p-4 font-mono text-sm space-y-1 text-[#00FF00]">
            <div>Cookie: <span className="text-[#00FF00]">auth_token=</span><span className="text-[#00FF00] break-all">{ORIGINAL_TOKEN}</span></div>
          </div>
        </div>

        {/* Token editor */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest flex items-center justify-between">
            <span>TOKEN EDITOR</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setMode('token'); }}
                className={`px-2 py-0.5 font-mono text-sm border transition-colors ${mode === 'token' ? 'border-[#00FF00] text-[#00FF00]' : 'border-[#2a2a2a] text-[#00FF00] hover:border-[#00FF00]'}`}
              >
                base64
              </button>
              <button
                onClick={() => { setMode('json'); }}
                className={`px-2 py-0.5 font-mono text-sm border transition-colors ${mode === 'json' ? 'border-[#00FF00] text-[#00FF00]' : 'border-[#2a2a2a] text-[#00FF00] hover:border-[#00FF00]'}`}
              >
                json
              </button>
            </div>
          </div>

          <div className="p-4">
            {mode === 'token' ? (
              <div className="space-y-3">
                <textarea
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setSubmitted(false); }}
                  rows={3}
                  className="w-full bg-[#1E1E1E] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-2 font-mono text-sm text-[#00CC00] outline-none resize-none break-all"
                  spellCheck={false}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecode}
                    className="px-3 py-1.5 border border-[#2a2a2a] text-[#00FF00] hover:text-[#00CC00] hover:border-[#00FF00] font-mono text-sm transition-colors"
                  >
                    decode →
                  </button>
                  {decoded.ok ? (
                    <span className="font-mono text-sm text-[#00FF00]">
                      role: <span className={decoded.parsed?.role === 'admin' ? 'text-[#FF0080]' : 'text-[#00FF00]'}>{String(decoded.parsed?.role)}</span>
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-[#FF0080]">{decoded.error}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={editingJson}
                  onChange={(e) => { setEditingJson(e.target.value); }}
                  rows={7}
                  className="w-full bg-[#1E1E1E] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-2 font-mono text-sm text-[#00CC00] outline-none resize-none"
                  spellCheck={false}
                />
                <button
                  onClick={handleEncode}
                  className="px-3 py-1.5 border border-[#2a2a2a] text-[#00FF00] hover:text-[#00CC00] hover:border-[#00FF00] font-mono text-sm transition-colors"
                >
                  ← encode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Send request */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            SEND REQUEST
          </div>
          <div className="p-4 font-mono text-sm space-y-2 text-[#00FF00]">
            <div>GET /admin/dashboard HTTP/1.1</div>
            <div>Host: app.spivhack-internal.com</div>
            <div className="break-all">
              Cookie: auth_token=<span className={isAdmin ? 'text-[#FF0080]' : 'text-[#00FF00]'}>{token}</span>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSend}
                className="px-4 py-1.5 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
              >
                SEND
              </button>
              {submitted && !isAdmin && (
                <span className="text-[#FF0080] text-sm">403 Forbidden — insufficient role</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PuzzleShell>
  );
}
