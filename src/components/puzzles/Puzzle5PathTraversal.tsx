import { useState } from 'react';
import PuzzleShell from './PuzzleShell';
import { PUZZLES } from '../../data/puzzles';

const puzzle = PUZZLES[4];

// Normalize a path traversal: strip leading slash, resolve ../ sequences
function normalizePath(input: string): string {
  // Remove leading slash
  const stripped = input.replace(/^\/+/, '');
  // Split, resolve traversals
  const parts = stripped.split(/[\\/]/);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else if (part !== '.' && part !== '') {
      resolved.push(part);
    }
  }
  return '/' + resolved.join('/');
}

const FILE_RESPONSES: Record<string, { status: number; content: string; contentType: string }> = {
  '/var/www/html/report_q4.pdf': {
    status: 200,
    contentType: 'application/pdf',
    content: '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n\n[binary data — Q4 Financial Report 2024]\n[46,821 bytes]',
  },
  '/var/www/html/report_q3.pdf': {
    status: 200,
    contentType: 'application/pdf',
    content: '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n\n[binary data — Q3 Financial Report 2024]\n[41,203 bytes]',
  },
  '/etc/passwd': {
    status: 200,
    contentType: 'text/plain',
    content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:112:117:MySQL Server,,,:/nonexistent:/bin/false
evan:x:1000:1000:Evan Spivack,,,:/home/evan:/bin/bash`,
  },
  '/etc/shadow': {
    status: 403,
    contentType: 'text/plain',
    content: 'Permission denied — shadow file requires root access',
  },
  '/etc/hosts': {
    status: 200,
    contentType: 'text/plain',
    content: `127.0.0.1   localhost
127.0.1.1   spivhack-prod
10.10.14.1  spivhack-gw
10.10.14.5  spivhack-prod
10.10.14.20 internal-db`,
  },
  '/proc/version': {
    status: 200,
    contentType: 'text/plain',
    content: 'Linux version 5.15.0-91-generic (buildd@lcy02-amd64-017) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, GNU ld (GNU Binutils for Ubuntu) 2.38) #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023',
  },
};

function resolveFile(input: string): { status: number; content: string; contentType: string; resolvedPath: string } {
  const webRoot = '/var/www/html';
  const normalizedInput = normalizePath(input);
  // If it already looks like an absolute path after traversal
  const resolvedPath = normalizedInput.startsWith('/var/') || normalizedInput.startsWith('/etc/') || normalizedInput.startsWith('/proc/')
    ? normalizedInput
    : webRoot + '/' + normalizedInput.replace(/^\//, '');

  const response = FILE_RESPONSES[resolvedPath];
  if (response) return { ...response, resolvedPath };

  // Check if it's a traversal that resolves somewhere we don't have
  if (input.includes('..') && !resolvedPath.startsWith('/var/www/html')) {
    return {
      status: 404,
      contentType: 'text/plain',
      content: `File not found: ${resolvedPath}`,
      resolvedPath,
    };
  }

  return {
    status: 404,
    contentType: 'text/plain',
    content: `File not found: ${resolvedPath}`,
    resolvedPath,
  };
}

const LESSON = (
  <>
    <p className="text-gray-300 mb-3">
      You used <span className="text-[#00FF00]">../</span> sequences to escape the web root and read <span className="text-[#00FF00]">/etc/passwd</span> from the server&apos;s filesystem.
    </p>
    <p><span className="text-[#00FF00]">What went wrong:</span> The endpoint passed the filename parameter directly to the file system without validating that the resolved path stays within the intended directory.</p>
    <div className="mt-3 p-3 border border-[#2a2a2a] bg-[#1E1E1E] font-mono text-sm leading-relaxed text-[#00FF00] whitespace-pre">{`// vulnerable
app.get('/download', (req, res) => {
  const file = req.query.file;
  res.sendFile('/var/www/html/' + file);  // ../ escapes the root
});

// safe — resolve and validate the path
const path = require('path');
app.get('/download', (req, res) => {
  const root = '/var/www/html/downloads';
  const requested = path.resolve(root, req.query.file);
  if (!requested.startsWith(root))
    return res.status(403).send('forbidden');
  res.sendFile(requested);
});`}</div>
    <p className="mt-3"><span className="text-[#00FF00]">Real impact:</span> Path traversal can expose server config files, application source code, private keys (<span className="text-[#00FF00]">~/.ssh/id_rsa</span>), environment files with credentials, and any file readable by the web server process.</p>
    <p className="mt-2"><span className="text-[#00FF00]">How to fix it:</span> Resolve the full absolute path with <span className="text-[#00FF00]">path.resolve()</span> and verify it starts with the intended base directory. Alternatively, whitelist allowed filenames and reject anything not on the list.</p>
    <p className="mt-2 text-gray-500">OWASP Top 10 · A01:2021 — Broken Access Control</p>
  </>
);

export default function Puzzle5PathTraversal() {
  const [fileInput, setFileInput] = useState('report_q4.pdf');
  const [requested, setRequested] = useState('report_q4.pdf');
  const [solved, setSolved] = useState(false);

  const result = resolveFile(requested);
  const isTraversal = requested.includes('..');

  const handleSend = () => {
    setRequested(fileInput);
    if (result.resolvedPath === '/etc/passwd' || resolveFile(fileInput).resolvedPath === '/etc/passwd') {
      setSolved(true);
    }
  };

  // also check on render after state updates
  const currentResult = resolveFile(requested);
  const justSolved = currentResult.resolvedPath === '/etc/passwd' && !solved;

  return (
    <PuzzleShell
      puzzle={puzzle}
      solved={solved || justSolved}
      onReset={() => { setSolved(false); setFileInput('report_q4.pdf'); setRequested('report_q4.pdf'); }}
      lesson={LESSON}
    >
      <div className="space-y-6">
        {/* Briefing */}
        <div className="border border-[#2a2a2a] bg-[#161616] px-5 py-4 font-mono text-sm text-[#00FF00] leading-relaxed">
          <span className="text-[#00FF00]">// target: </span>file download endpoint at files.spivhack-app.com<br />
          <span className="text-[#00FF00]">// objective: </span>read <span className="text-[#00FF00]">/etc/passwd</span> from the server<br />
          <span className="text-[#00FF00]">// hint: </span>the server joins the web root path with the filename you provide — what does <span className="text-[#00FF00]">../</span> do to a file path?
        </div>

        {/* Request builder */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm text-gray-600 tracking-widest">
            REQUEST
          </div>
          <div className="p-4 font-mono text-sm space-y-2">
            <div className="flex flex-wrap items-center gap-1 text-[#00FF00]">
              <span className="text-[#00FF00]">GET</span>
              <span>/download?file=</span>
              <input
                type="text"
                value={fileInput}
                onChange={(e) => { setFileInput(e.target.value); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                className="bg-[#1E1E1E] border border-[#00FF00] px-2 py-0.5 text-[#00CC00] outline-none min-w-0 w-64"
              />
              <span>HTTP/1.1</span>
            </div>
            <div className="text-[#00FF00]">Host: files.spivhack-app.com</div>
            {isTraversal && (
              <div className="text-yellow-700 text-sm">
                // resolves to: {resolveFile(fileInput).resolvedPath}
              </div>
            )}
            <button
              onClick={handleSend}
              className="mt-1 px-4 py-1.5 bg-[#003300] hover:bg-[#004400] text-white font-mono text-sm transition-colors"
            >
              SEND
            </button>
          </div>
        </div>

        {/* Response */}
        <div className="border border-[#2a2a2a] bg-[#161616]">
          <div className="px-4 py-2 border-b border-[#2a2a2a] font-mono text-sm flex items-center justify-between">
            <span className="text-gray-600 tracking-widest">RESPONSE</span>
            <div className="flex items-center gap-3">
              <span className="text-[#00FF00]">{currentResult.contentType}</span>
              <span className={currentResult.status === 200 ? 'text-[#00FF00]' : currentResult.status === 403 ? 'text-yellow-600' : 'text-[#FF0080]'}>
                {currentResult.status} {currentResult.status === 200 ? 'OK' : currentResult.status === 403 ? 'Forbidden' : 'Not Found'}
              </span>
            </div>
          </div>
          <pre className={`p-4 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre ${
            currentResult.resolvedPath === '/etc/passwd' ? 'text-[#FF0080]' : 'text-[#00FF00]'
          }`}>
            {currentResult.content}
          </pre>
        </div>
      </div>
    </PuzzleShell>
  );
}
