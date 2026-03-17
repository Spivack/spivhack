import type { Topic } from '../../../types';

const fibonacci: Topic = {
  id: 'fibonacci-dp',
  title: 'Fibonacci & Memoization',
  description:
    'The gateway to Dynamic Programming. Uses Fibonacci numbers to illustrate the core DP concepts: overlapping subproblems, optimal substructure, memoization (top-down), and tabulation (bottom-up).',
  difficulty: 'beginner',
  category: 'dynamic-programming',
  tags: ['dynamic-programming', 'memoization', 'tabulation', 'recursion', 'beginner-dp'],
  steps: [
    {
      title: 'The Problem',
      explanation:
        'The Fibonacci sequence: each number is the sum of the two preceding ones.\n  F(0) = 0\n  F(1) = 1\n  F(n) = F(n-1) + F(n-2)\n\n  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ...\n\nGoal: Compute F(n) efficiently.\n\nThis seems simple, but the naive recursive solution has a critical flaw that teaches us the core motivation behind Dynamic Programming.',
    },
    {
      title: 'Naive Recursion — Exponential Time',
      explanation:
        'The direct translation of the definition into code is elegant but catastrophically slow.',
      code: {
        python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# fib(5) makes 15 calls
# fib(10) makes 177 calls
# fib(50) makes 2^50 ≈ 1 quadrillion calls!`,
        java: `public static int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// fib(50) would take years to complete`,
        javascript: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(50) would take years to complete`,
        typescript: `function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
      },
      complexity: {
        time: 'O(2ⁿ)',
        space: 'O(n)',
        note: 'Exponential time — completely unusable for n > 40.',
      },
      callout: {
        type: 'warning',
        text: 'fib(n-2) is computed by fib(n-1) AND again by the explicit fib(n-2) call — and this duplication compounds at every level. fib(5) computes fib(2) three times!',
      },
    },
    {
      title: 'Key Insight: Overlapping Subproblems',
      explanation:
        'The recursion tree for fib(5) shows the problem:\n\n                fib(5)\n             ┌────┴────┐\n           fib(4)    fib(3)\n          ┌──┴──┐    ┌──┴──┐\n       fib(3) fib(2) fib(2) fib(1)\n       ┌─┴─┐\n    fib(2) fib(1)\n\nfib(3) is computed twice. fib(2) is computed three times. For fib(50), fib(2) is computed billions of times.\n\nThis is the hallmark of a Dynamic Programming problem:\n• Overlapping subproblems: same sub-calculations are repeated\n• Optimal substructure: the solution is built from solutions to smaller subproblems\n\nThe fix: compute each subproblem once and store the result.',
      callout: {
        type: 'insight',
        text: 'If you can draw a recursion tree and see duplicate subtrees — that is a DP problem. The solution is to cache results (memoization) or build from the bottom up (tabulation).',
      },
    },
    {
      title: 'Top-Down: Memoization',
      explanation:
        'Memoization = recursion + a cache.\n\nBefore making a recursive call, check if we\'ve already computed the answer.\nAfter computing, store the result in the cache.\n\nWith memoization, each unique value of n is computed exactly once.',
      code: {
        python: `def fib(n, memo=None):
    if memo is None: memo = {}
    if n in memo:
        return memo[n]             # return cached result
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

# Cleaner with a decorator:
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
        java: `public static long fib(int n, Map<Integer, Long> memo) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;
    long result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.put(n, result);
    return result;
}
// Call: fib(50, new HashMap<>())`,
        javascript: `function fib(n, memo = new Map()) {
  if (memo.has(n)) return memo.get(n);
  if (n <= 1) return n;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}`,
        typescript: `function fib(n: number, memo = new Map<number, number>()): number {
  if (memo.has(n)) return memo.get(n)!;
  if (n <= 1) return n;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}`,
      },
      highlightLines: {
        python: [2, 3, 6],
        java: [2, 4, 5],
        javascript: [2, 4, 5],
        typescript: [2, 4, 5],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        note: 'Each of the n values is computed exactly once. Call stack depth is still O(n).',
      },
    },
    {
      title: 'Bottom-Up: Tabulation',
      explanation:
        'Tabulation builds the answer iteratively from the base cases upward, eliminating recursion entirely.\n\nInstead of calling fib(n) which calls fib(n-1) which calls..., we:\n1. Start with fib(0) = 0, fib(1) = 1\n2. Compute fib(2) = fib(0) + fib(1)\n3. Compute fib(3) = fib(1) + fib(2)\n...\n\nThis is generally preferred: no stack overflow risk, better cache locality, easier to optimize space.',
      code: {
        python: `def fib(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


# Space-optimized: only need last two values
def fib_optimized(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1`,
        java: `public static long fib(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Space-optimized O(1):
public static long fibOptimized(int n) {
    if (n <= 1) return n;
    long prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        long curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
        javascript: `function fib(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Space-optimized O(1):
function fibOptimized(n) {
  if (n <= 1) return n;
  let [prev2, prev1] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [prev2, prev1] = [prev1, prev1 + prev2];
  }
  return prev1;
}`,
        typescript: `function fib(n: number): number {
  if (n <= 1) return n;
  const dp = new Array<number>(n + 1);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

function fibOptimized(n: number): number {
  if (n <= 1) return n;
  let [prev2, prev1] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [prev2, prev1] = [prev1, prev1 + prev2];
  }
  return prev1;
}`,
      },
      highlightLines: {
        python: [15, 16, 17, 18, 19],
        java: [12, 13, 14, 15, 16, 17, 18, 19],
        javascript: [12, 13, 14, 15, 16, 17],
        typescript: [12, 13, 14, 15, 16, 17],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        note: 'Space-optimized version — we only ever need the last two values.',
      },
    },
    {
      title: 'Summary: DP Patterns',
      explanation:
        'Fibonacci taught us the two DP approaches:\n\n┌─────────────────┬──────────────────────┬────────────────────┐\n│                 │  Memoization         │  Tabulation        │\n│                 │  (Top-Down)          │  (Bottom-Up)       │\n├─────────────────┼──────────────────────┼────────────────────┤\n│ Direction       │  n → base case       │  base case → n     │\n│ Implementation  │  Recursion + cache   │  Iterative + table │\n│ Stack overflow  │  Possible            │  No                │\n│ Subproblems     │  Only needed ones    │  All of them       │\n│ Intuition       │  Easier              │  Requires ordering │\n└─────────────────┴──────────────────────┴────────────────────┘\n\nIn practice, either approach is acceptable. Tabulation is often slightly more efficient.',
      callout: {
        type: 'interview',
        text: '"Climb Stairs" (LeetCode #70) is essentially Fibonacci and is one of the most common DP interview questions. Solve it in O(n) time, O(1) space.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Climbing Stairs',
      url: 'https://leetcode.com/problems/climbing-stairs/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'House Robber',
      url: 'https://leetcode.com/problems/house-robber/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Min Cost Climbing Stairs',
      url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Coin Change',
      url: 'https://leetcode.com/problems/coin-change/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default fibonacci;
