import type { Topic } from '../../../dsa-types';

const pVsNp: Topic = {
  id: 'p-vs-np',
  title: 'P vs NP',
  description:
    'The most famous unsolved problem in computer science. P is the class of problems solvable quickly. NP is the class of problems whose solutions can be verified quickly. The question: are they the same class? A $1,000,000 prize awaits the answer.',
  difficulty: 'advanced',
  category: 'complexity',
  tags: ['complexity', 'P', 'NP', 'NP-complete', 'computability', 'theory'],
  steps: [
    {
      title: 'Decision Problems',
      explanation:
        'Complexity theory focuses on decision problems — problems with a yes/no answer.\n\nExamples:\n  • "Does this array contain a duplicate?" → yes/no\n  • "Is there a path of length ≤ k between nodes A and B?" → yes/no\n  • "Can these items fit in this knapsack under weight limit W?" → yes/no\n\nOptimization problems ("find the shortest path") can usually be rephrased as decision problems ("is there a path of length ≤ k?").\n\nWe measure complexity in terms of input size n. An algorithm is efficient if it runs in polynomial time — O(n^k) for some constant k.',
    },
    {
      title: 'Class P — Solvable Quickly',
      explanation:
        'P (Polynomial time) is the class of decision problems solvable by a deterministic algorithm in O(n^k) time for some constant k.\n\nProblems in P:\n  • Sorting: O(n log n)\n  • Shortest path (Dijkstra\'s): O(E log V)\n  • Linear search: O(n)\n  • Binary search: O(log n)\n  • Matrix multiplication: O(n³) naively, O(n^2.37) best known\n  • Primality testing: O((log n)^6) — proven in 2002\n\nThe key intuition: polynomial time is "tractable." As input doubles, the runtime grows by at most a constant factor (per doubling step). Exponential algorithms become useless on large inputs.',
      callout: {
        type: 'insight',
        text: 'The choice of polynomial as the threshold is somewhat arbitrary, but it\'s remarkably robust: polynomial algorithms tend to be practical, and the class P is closed under composition — using one P algorithm as a subroutine of another stays in P.',
      },
    },
    {
      title: 'Class NP — Verifiable Quickly',
      explanation:
        'NP (Nondeterministic Polynomial time) is the class of decision problems where a proposed "yes" solution can be verified in polynomial time.\n\nNP does NOT mean "not polynomial" — that\'s a common misconception.\n\nExamples:\n  • Sudoku: hard to solve, but easy to verify a completed grid\n  • Boolean satisfiability (SAT): hard to find an assignment that satisfies a formula, easy to check one\n  • Traveling Salesman (decision): hard to find a route of length ≤ k, easy to verify a given route\n  • Graph coloring: hard to find a valid 3-coloring, easy to verify one\n\nEvery P problem is also NP: if you can solve it quickly, you can certainly verify a solution quickly (just re-solve it).\n\n  P ⊆ NP\n\nThe question is whether P = NP — whether every problem whose solution is easy to verify is also easy to solve.',
    },
    {
      title: 'NP-Complete — The Hardest Problems in NP',
      explanation:
        'A problem X is NP-complete if:\n  1. X is in NP (solutions verifiable in polynomial time)\n  2. Every problem in NP can be reduced to X in polynomial time\n\nIf you could solve any NP-complete problem in polynomial time, you could solve ALL of NP in polynomial time — meaning P = NP.\n\nThe first NP-complete problem was SAT (Cook-Levin theorem, 1971). Since then, thousands of practical problems have been proven NP-complete by reduction:\n\n  • 3-SAT: can a boolean formula with 3-variable clauses be satisfied?\n  • Traveling Salesman Problem (TSP)\n  • Graph 3-Coloring\n  • Subset Sum / Knapsack\n  • Clique / Independent Set\n  • Hamiltonian Cycle\n\nThese problems appear in logistics, scheduling, chip design, biology, and cryptography. We don\'t know efficient exact algorithms for any of them.',
      callout: {
        type: 'insight',
        text: 'Reductions are the key tool. To prove problem B is NP-complete, show that any instance of a known NP-complete problem A can be transformed into an instance of B in polynomial time. If you could solve B quickly, you could solve A quickly — so B is at least as hard as A.',
      },
    },
    {
      title: 'Why It Matters',
      explanation:
        'If P = NP:\n  • Every problem whose solution is checkable could be solved efficiently\n  • Cryptography as we know it would collapse — RSA, elliptic curve, and most encryption rely on problems believed to be outside P\n  • Drug discovery, protein folding, logistics optimization would become tractable\n  • AI and theorem proving would be revolutionized\n\nIf P ≠ NP (what most researchers believe):\n  • NP-complete problems have no efficient exact algorithm\n  • We must rely on approximation algorithms, heuristics, or special-case solvers\n  • Modern cryptography is secure\n\nIn practice, knowing a problem is NP-complete is useful:\n  • Stop searching for an efficient exact algorithm — focus on approximations\n  • Use branch-and-bound, local search, or problem-specific heuristics\n  • Consider whether your real inputs have special structure that makes them tractable\n\nThe Clay Mathematics Institute offers $1,000,000 for a proof either way. The problem has been open since 1971.',
      callout: {
        type: 'interview',
        text: '"Is this problem NP-complete?" is a legitimate interview question at research-oriented companies. The practical takeaway: when you recognize a problem as NP-complete (TSP, graph coloring, subset sum), you know not to waste time finding an optimal polynomial algorithm — reach for greedy approximations or dynamic programming on small inputs instead.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Partition Equal Subset Sum',
      url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Maximum Product Subarray',
      url: 'https://leetcode.com/problems/maximum-product-subarray/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default pVsNp;
