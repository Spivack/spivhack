# SpivHack

A browser-based cybersecurity learning platform with three sections: interactive exploit challenges covering real-world web vulnerabilities, a security reference library, and a full data structures & algorithms tutorial.

Live at **spivhack.com**

## What It Is

SpivHack is a self-contained hacking practice environment. Each challenge simulates a real vulnerability class — SQL injection, XSS, path traversal, IDOR, token forgery, and security misconfiguration. The Security section covers 63 topics across 8 categories with expandable write-ups on mechanisms, examples, impact, and defenses. The DSA section covers 37 topics across 10 categories with step-by-step tutorials, code in multiple languages, and visualizations.

## Challenges

| # | Title | Vulnerability | Difficulty |
|---|---|---|---|
| 1 | Stack Trace | A05 — Security Misconfiguration | Easy |
| 2 | Drop Table | A03 — SQL Injection | Easy |
| 3 | Reflected | A03 — XSS | Easy |
| 4 | IDOR | A01 — Broken Access Control | Medium |
| 5 | Path Walker | A01 — Path Traversal | Medium |
| 6 | Weak Token | A07 — Auth Failures | Hard |

Full solutions in [docs/puzzle-solutions.md](docs/puzzle-solutions.md).

## Security Topics

63 topics across 8 sections, each with expandable content covering mechanism, example, impact, and defense:

- **Foundations** — CIA Triad, Threat Modeling, Attack Surface, Defense in Depth, Least Privilege, Zero Trust, Security Controls
- **Cryptography** — Symmetric/Asymmetric, AES, RSA/ECC, Hash Functions, Salting, PKI, TLS, Diffie-Hellman, Crypto Attacks
- **Web Security** — HTTP Fundamentals, SOP, CORS, OWASP Top 10, Session Management, CSRF, CSP, Security Headers, SSRF, XXE, Deserialization
- **Network Attacks** — ARP Spoofing, DNS Poisoning, MITM, SSL Stripping, Port Scanning, Segmentation, Wireshark, Wireless Attacks
- **System Security** — Linux Permissions, Linux/Windows PrivEsc, Buffer Overflow, Format Strings, Memory Safety, Reverse Shells, Post-Exploitation
- **Identity & Access** — Auth Factors, OAuth/OIDC, SAML, Active Directory, Kerberoasting, Pass-the-Hash, Credential Attacks
- **AI Security** — Prompt Injection, Indirect Injection, Jailbreaking, Model Inversion, Adversarial Inputs, RAG Attacks
- **Frameworks** — MITRE ATT&CK, Cyber Kill Chain, NIST CSF, Incident Response, Security+, OSCP, Bug Bounty

## DSA

37 topics across 10 categories, each with step-by-step explanations, code in Python/Java/JS/TS, and interactive visualizations:

- **Complexity** — Big-O Notation, P vs NP
- **Lists & Stacks** — List ADT, Array List, Linked List, Doubly Linked List, Stack, Linked Stack, Monotonic Stack
- **Recursion** — Recursion, Backtracking
- **Sorting** — Bubble, Insertion, Selection, Shell, Merge, Quick, Heap, Radix
- **Searching** — Linear Search, Binary Search
- **Hash Tables & Queues** — Hash Table, Queue
- **Trees** — Binary Trees, Heaps & Priority Queues, General Trees, Union-Find
- **Dynamic Programming** — Fibonacci, Knapsack, Longest Common Subsequence, Coin Change
- **Graphs** — BFS, DFS, Topological Sort, Dijkstra's, Minimum Spanning Tree
- **Patterns** — Two Pointers, Sliding Window, Merge Intervals

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v4** (arbitrary value syntax)
- **HashRouter** — fully static, no server required
- **framer-motion** — step transitions and visualizations
- **prism-react-renderer** — syntax-highlighted code blocks
- Progress tracked in `localStorage` via `ProgressContext`
- Deployed to GitHub Pages via GitHub Actions

## Local Development

```bash
npm install
npm run dev        # dev server at localhost:5173
npm test           # vitest unit tests
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

The `dist/` folder is a fully static site — drop it anywhere or serve with any static host.

## Project Structure

```
src/
  components/
    Nav.tsx                    # top navigation bar
    dsa-tutorial/
      TutorialViewer.tsx       # step-by-step tutorial UI
      CodeBlock.tsx            # syntax-highlighted code
      Visualization.tsx        # sorting, array, graph, tree visuals
      LanguageSwitcher.tsx
      StepCallout.tsx
      ComplexityBadge.tsx
    puzzles/
      PuzzleShell.tsx          # shared challenge wrapper
      Puzzle1StackTrace.tsx
      Puzzle2SQLi.tsx
      Puzzle3XSS.tsx
      Puzzle4IDOR.tsx
      Puzzle5PathTraversal.tsx
      Puzzle6WeakToken.tsx
  context/
    ProgressContext.tsx        # localStorage-backed solved state
  data/
    puzzles.ts                 # challenge metadata
    reference-topics.ts        # 63 security topics with body content
  dsa-data/
    categories.ts              # DSA category + topic index
    topics/                    # individual topic files (10 categories)
  dsa-types/
    index.ts                   # shared types for DSA (Topic, Step, etc.)
  dsa-utils/
    tutorial.ts                # language availability, step helpers
  pages/
    MenuPage.tsx               # home — DSA / Security / Challenges panels
    ChallengesPage.tsx         # challenge list
    PuzzlePage.tsx             # routes challenge ID to component
    LearnPage.tsx              # security reference with search + filter
    DsaHomePage.tsx            # DSA topic browser
    DsaTopicPage.tsx           # individual DSA topic with tutorial viewer
docs/
  puzzle-solutions.md          # full spoiler walkthroughs
  architecture.html            # system diagram
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys to the `gh-pages` branch. The custom domain `spivhack.com` is configured via `public/CNAME`.
