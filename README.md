# SpivHack

A browser-based cybersecurity learning platform. Six interactive puzzles covering real-world web vulnerabilities, a full reference library of 63 security topics, and a puzzle solutions guide.

Live at **spivhack.com**

## What It Is

SpivHack is a self-contained hacking practice environment. Each puzzle simulates a real vulnerability class — SQL injection, XSS, path traversal, IDOR, token forgery, and security misconfiguration. The Learn section covers 63 topics across 8 categories with expandable write-ups on mechanisms, examples, impact, and defenses.


## Puzzles

| # | Title | Vulnerability | Difficulty |
|---|---|---|---|
| 1 | Stack Trace | A05 — Security Misconfiguration | Easy |
| 2 | Drop Table | A03 — SQL Injection | Easy |
| 3 | Reflected | A03 — XSS | Easy |
| 4 | IDOR | A01 — Broken Access Control | Medium |
| 5 | Path Walker | A01 — Path Traversal | Medium |
| 6 | Weak Token | A07 — Auth Failures | Hard |

Full solutions in [docs/puzzle-solutions.md](docs/puzzle-solutions.md).

## Learn Topics

63 topics across 8 sections, each with expandable content covering mechanism, example, impact, and defense:

- **Foundations** — CIA Triad, Threat Modeling, Attack Surface, Defense in Depth, Least Privilege, Zero Trust, Security Controls
- **Cryptography** — Symmetric/Asymmetric, AES, RSA/ECC, Hash Functions, Salting, PKI, TLS, Diffie-Hellman, Crypto Attacks
- **Web Security** — HTTP Fundamentals, SOP, CORS, OWASP Top 10, Session Management, CSRF, CSP, Security Headers, SSRF, XXE, Deserialization
- **Network Attacks** — ARP Spoofing, DNS Poisoning, MITM, SSL Stripping, Port Scanning, Segmentation, Wireshark, Wireless Attacks
- **System Security** — Linux Permissions, Linux/Windows PrivEsc, Buffer Overflow, Format Strings, Memory Safety, Reverse Shells, Post-Exploitation
- **Identity & Access** — Auth Factors, OAuth/OIDC, SAML, Active Directory, Kerberoasting, Pass-the-Hash, Credential Attacks
- **AI Security** — Prompt Injection, Indirect Injection, Jailbreaking, Model Inversion, Adversarial Inputs, RAG Attacks
- **Frameworks** — MITRE ATT&CK, Cyber Kill Chain, NIST CSF, Incident Response, Security+, OSCP, Bug Bounty

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v4** (arbitrary value syntax)
- **HashRouter** — fully static, no server required
- Progress tracked in `localStorage` via `ProgressContext`
- Deployed to GitHub Pages via GitHub Actions

## Local Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

The `dist/` folder is a fully static site — drop it anywhere or serve with any static host.


## Project Structure

```
src/
  components/
    Nav.tsx                  # top navigation, progress dots
    puzzles/
      PuzzleShell.tsx        # shared puzzle wrapper (lesson panel on solve)
      Puzzle1StackTrace.tsx
      Puzzle2SQLi.tsx
      Puzzle3XSS.tsx
      Puzzle4IDOR.tsx
      Puzzle5PathTraversal.tsx
      Puzzle6WeakToken.tsx
  context/
    ProgressContext.tsx      # localStorage-backed solved state
  data/
    puzzles.ts               # puzzle metadata
    reference-topics.ts      # all 63 learn topics with body content
  pages/
    MenuPage.tsx             # home / puzzle list
    PuzzlePage.tsx           # routes puzzle ID to component
    LearnPage.tsx            # reference library with search + filter
docs/
  puzzle-solutions.md        # full spoiler walkthroughs
  architecture.html          # system diagram
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys to the `gh-pages` branch. The custom domain `spivhack.com` is configured via `public/CNAME`.