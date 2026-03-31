import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[2];

const XSS_PATTERNS = [
  /<script[\s>]/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /onclick\s*=/i,
  /onmouseover\s*=/i,
  /javascript\s*:/i,
  /<img[^>]+src\s*=\s*['"]?\s*x\b/i,
  /<svg[\s>]/i,
  /<iframe[\s>]/i,
];

function detectXSS(input: string): boolean {
  return XSS_PATTERNS.some((p) => p.test(input));
}

const VULNERABLE_CODE = `// search results page — server renders the query directly
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(\`
    <h2>Results for: \${query}</h2>
    <div class="results">...</div>
  \`);
});`;

const SAFE_CODE = `// safe — encode output before inserting into HTML
const encoded = query
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
res.send(\`<h2>Results for: \${encoded}</h2>\`);

// or use a template engine with auto-escaping (Handlebars, Jinja2, etc.)`;

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      You injected a script payload into a search field that reflects input directly into the HTML response.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> The server took <span className="text-[#00FF00]">req.query.q</span> and concatenated it into the HTML response with no encoding. Any HTML or JavaScript in the input is sent back to the browser and executed as part of the page.</p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00] whitespace-pre">{SAFE_CODE}</div>
    <p className="mt-3"><span className="text-[#00FF00]">Reflected vs. Stored:</span> Reflected XSS (this puzzle) requires the victim to click a crafted link. Stored XSS is worse — the payload is saved in a database and served to every user who views that page.</p>
    <p className="mt-2"><span className="text-[#00FF00]">Real impact:</span> XSS allows an attacker to steal session cookies (<span className="text-[#00FF00]">document.cookie</span>), redirect users, keylog form inputs, or deface the page.</p>
    <p className="mt-2"><span className="text-[#00FF00]">Content Security Policy</span> (CSP) is a second line of defense — it restricts which scripts can execute, blocking inline payloads even if injection is possible.</p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A03:2021 — Injection (XSS)</p>
  </>
);

export default function Puzzle3XSS() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [solved, setSolved] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (detectXSS(query)) {
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
        setSolved(true);
      }, 1800);
    }
  };

  const isXSS = detectXSS(query);

  return (
    <PuzzleShell puzzle={puzzle} solved={solved} onReset={() => { setSolved(false); setQuery(''); setSearched(false); }} lesson={LESSON}>
      {/* Simulated alert popup */}
      {alertVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="border-2 border-[#00FF00] bg-[#161616] px-10 py-7 font-mono text-center shadow-lg shadow-green-900/40">
            <div className="text-[#00FF00] text-base mb-1">JavaScript Alert</div>
            <div className="text-white text-2xl mb-3">XSS</div>
            <div className="text-[#00FF00] text-sm">payload executed in browser context</div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// target: </span>search endpoint at search.spivhack-app.com<br />
          <span className="text-[#00FF00]">// objective: </span>inject a payload that executes JavaScript in the victim&apos;s browser<br />
          <span className="text-[#00FF00]">// hint: </span>the search term appears verbatim in the HTML response — what if it contained a tag?
        </div>

        {/* Fake browser */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          {/* Browser chrome */}
          <div className="px-3 py-2 border-b border-[#2a2a2a] flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#001a00]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#001a00]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#001a00]" />
            </div>
            <div className="flex-1 bg-[#1E1E1E] border border-[#2a2a2a] px-3 py-1 font-mono text-sm text-[#00FF00]">
              https://search.spivhack-app.com/search?q=
              <span className={isXSS ? 'text-[#FF0080]' : 'text-[#00FF00]'}>{query || '...'}</span>
            </div>
          </div>

          {/* Page content */}
          <div className="p-5">
            <form onSubmit={handleSearch} className="flex gap-2 mb-5">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
                className="flex-1 bg-[#1E1E1E] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-2 font-mono text-base text-[#00CC00] outline-none placeholder-green-900"
                placeholder="search..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#001a00] hover:bg-[#003300] text-[#00CC00] font-mono text-sm transition-colors"
              >
                SEARCH
              </button>
            </form>

            {searched && (
              <div className="font-mono text-sm border-t border-[#2a2a2a] pt-4">
                <div className="text-[#00FF00] mb-2">results for:</div>
                {/* This is the vulnerable reflection */}
                <div
                  className={`text-base mb-3 ${isXSS ? 'text-[#FF0080]' : 'text-[#00FF00]'}`}
                  dangerouslySetInnerHTML={{ __html: query }}
                />
                <div className="text-[#00FF00]">0 results found.</div>
              </div>
            )}
          </div>
        </div>

        {/* Vulnerable source */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            VULNERABLE SOURCE — server.js
          </div>
          <pre className="p-4 font-mono text-sm text-[#00FF00] leading-relaxed overflow-x-auto whitespace-pre">
            {VULNERABLE_CODE}
          </pre>
          <div className="px-4 pb-3 font-mono text-sm text-[#FF0080]">
            // line 3: req.query.q inserted into HTML with no encoding
          </div>
        </div>
      </div>
    </PuzzleShell>
  );
}
