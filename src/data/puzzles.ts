export interface PuzzleMeta {
  id: number;
  title: string;
  subtitle: string;
  category: string;   // OWASP category or custom
  difficulty: 'easy' | 'medium' | 'hard';
  available: boolean;
}

export const PUZZLES: PuzzleMeta[] = [
  {
    id: 1,
    title: 'Stack Trace',
    subtitle: 'The server is in debug mode. Send it something unexpected and read what comes back.',
    category: 'A05 — Security Misconfiguration',
    difficulty: 'easy',
    available: true,
  },
  {
    id: 2,
    title: 'Drop Table',
    subtitle: 'A login form with no parameterized queries. Find the injection.',
    category: 'A03 — Injection',
    difficulty: 'easy',
    available: true,
  },
  {
    id: 3,
    title: 'Reflected',
    subtitle: 'The search field echoes input directly into the DOM.',
    category: 'A03 — Injection (XSS)',
    difficulty: 'easy',
    available: true,
  },
  {
    id: 4,
    title: 'IDOR',
    subtitle: 'You are user 412. What happens when you request user 1?',
    category: 'A01 — Broken Access Control',
    difficulty: 'medium',
    available: true,
  },
  {
    id: 5,
    title: 'Path Walker',
    subtitle: 'The file download endpoint trusts the filename parameter.',
    category: 'A01 — Broken Access Control',
    difficulty: 'medium',
    available: true,
  },
  {
    id: 6,
    title: 'Weak Token',
    subtitle: 'The session token is base64. Not encrypted. Not signed.',
    category: 'A07 — Auth Failures',
    difficulty: 'hard',
    available: true,
  },
];
