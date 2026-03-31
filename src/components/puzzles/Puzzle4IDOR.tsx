import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[3];

interface UserRecord {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  api_key?: string;
  notes?: string;
}

const USERS: Record<number, UserRecord> = {
  1: {
    id: 1,
    username: 'admin',
    email: 'admin@spivhack-internal.com',
    role: 'admin',
    api_key: 'sk-prod-8f2a9d1c3e7b4f6a2c8d',
    created_at: '2023-01-01T00:00:00Z',
    notes: 'system administrator account',
  },
  412: {
    id: 412,
    username: 'visitor_412',
    email: 'visitor@app.spivhack.com',
    role: 'user',
    created_at: '2024-11-14T09:31:00Z',
  },
};

function getUser(id: number): { status: number; body: string } {
  const user = USERS[id];
  if (!user) {
    return {
      status: 404,
      body: JSON.stringify({ error: 'user not found', id }, null, 2),
    };
  }
  return {
    status: 200,
    body: JSON.stringify(user, null, 2),
  };
}

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      You accessed another user&apos;s record by changing the user ID in the API request. The server returned admin data without checking who was asking.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> The endpoint trusted the client-supplied ID parameter and performed no authorization check. Any authenticated user could retrieve any other user&apos;s data — including the admin account — just by incrementing an ID.</p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00] whitespace-pre">{`// vulnerable
app.get('/api/users/:id', (req, res) => {
  const user = db.find(req.params.id);   // no auth check
  res.json(user);
});

// safe
app.get('/api/users/:id', requireAuth, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'forbidden' });
  res.json(db.find(req.params.id));
});`}</div>
    <p className="mt-3"><span className="text-[#00FF00]">Real impact:</span> IDOR can expose PII, payment info, private messages, and admin functionality. In 2019, a major US insurance provider exposed 885 million records through an IDOR in their policy lookup endpoint — no authentication required, just iterate the policy number.</p>
    <p className="mt-2"><span className="text-[#00FF00]">How to fix it:</span> Always enforce authorization server-side. Check that the requesting user owns the resource or has explicit permission to access it. Never rely on the client to only request their own data.</p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A01:2021 — Broken Access Control</p>
  </>
);

export default function Puzzle4IDOR() {
  const [inputId, setInputId] = useState('412');
  const [requestedId, setRequestedId] = useState<number>(412);
  const [solved, setSolved] = useState(false);

  const response = getUser(requestedId);

  const handleSend = () => {
    const id = parseInt(inputId, 10);
    if (!Number.isNaN(id)) {
      setRequestedId(id);
      if (id === 1) setSolved(true);
    }
  };

  return (
    <PuzzleShell puzzle={puzzle} solved={solved} onReset={() => { setSolved(false); setInputId('412'); setRequestedId(412); }} lesson={LESSON}>
      <div className="space-y-6">
        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// context: </span>you are logged in as user 412 — a standard account<br />
          <span className="text-[#00FF00]">// objective: </span>access the admin account record<br />
          <span className="text-[#00FF00]">// hint: </span>the API endpoint takes a user ID as a path parameter
        </div>

        {/* HTTP request/response panel */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Request */}
          <div className="border border-[#2a2a2a] bg-[#161616]">
            <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
              REQUEST
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#00FF00]">GET</span>
                <span className="text-[#00FF00]">/api/users/</span>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => { setInputId(e.target.value); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  className="w-16 bg-[#1E1E1E] border border-[#00FF00] px-2 py-0.5 text-[#00CC00] outline-none text-center"
                />
                <span className="text-[#00FF00]">HTTP/1.1</span>
              </div>
              <div className="text-[#00FF00]">Host: api.spivhack-app.com</div>
              <div className="text-[#00FF00]">Cookie: session=eyJ1aWQiOjQxMn0</div>
              <div className="text-[#00FF00]">Authorization: Bearer user_412_token</div>
              <div className="mt-3">
                <button
                  onClick={handleSend}
                  className="px-4 py-1.5 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>

          {/* Response */}
          <div className="border border-[#2a2a2a] bg-[#161616]">
            <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm flex items-center justify-between">
              <span className="text-gray-600 tracking-widest">RESPONSE</span>
              <span className={`font-mono text-sm ${response.status === 200 ? 'text-[#00FF00]' : 'text-[#FF0080]'}`}>
                {response.status} {response.status === 200 ? 'OK' : 'Not Found'}
              </span>
            </div>
            <pre className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
              {response.status === 200
                ? response.body.split('\n').map((line, i) => {
                    const isApiKey = line.includes('api_key');
                    const isAdminRole = line.includes('"admin"');
                    return (
                      <div key={i} className={isApiKey || isAdminRole ? 'text-[#FF0080]' : 'text-[#00FF00]'}>
                        {line}
                      </div>
                    );
                  })
                : <span className="text-[#00FF00]">{response.body}</span>
              }
            </pre>
          </div>
        </div>

        <div className="font-mono text-sm text-[#00FF00] px-1">
          // edit the user ID in the request and click SEND — or press Enter
        </div>
      </div>
    </PuzzleShell>
  );
}
