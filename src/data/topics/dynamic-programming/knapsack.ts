import type { Topic } from '../../../types';

const knapsack: Topic = {
  id: 'knapsack',
  title: '0/1 Knapsack',
  description:
    'Given items with weights and values, fill a knapsack of limited capacity to maximize total value — each item either included or excluded. The canonical DP problem whose pattern appears in disguise across dozens of interview problems.',
  difficulty: 'intermediate',
  category: 'dynamic-programming',
  tags: ['dynamic-programming', 'knapsack', 'subset-selection', '2D-dp', 'optimization'],
  steps: [
    {
      title: 'The Problem',
      explanation:
        'You have n items, each with a weight w[i] and value v[i]. Your knapsack holds at most W total weight. Maximize the total value of items you take.\n\nThe "0/1" means each item is either taken (1) or left (0) — no fractions, no duplicates.\n\nExample:\n  Items: [(weight=2, value=6), (weight=2, value=10), (weight=3, value=12)]\n  Capacity W = 5\n\n  Option A: items 0+1 → weight=4, value=16\n  Option B: items 0+2 → weight=5, value=18\n  Option C: items 1+2 → weight=5, value=22  ← optimal\n\nWhy not greedy? Greedy (by value/weight ratio) fails — taking the highest-ratio item may block a better combination.',
      callout: {
        type: 'insight',
        text: 'Greedy works for the fractional knapsack (you can take part of an item). For 0/1 knapsack, greedy can fail. This is why 0/1 knapsack is NP-hard in general but solvable in O(nW) pseudo-polynomial time with DP.',
      },
    },
    {
      title: 'The Recurrence',
      explanation:
        'Define dp[i][w] = maximum value using the first i items with capacity w.\n\nFor each item i and capacity w:\n  Option 1 — skip item i:\n    dp[i][w] = dp[i-1][w]\n\n  Option 2 — take item i (only if w[i] ≤ w):\n    dp[i][w] = dp[i-1][w - weight[i]] + value[i]\n\n  Take the max of both options:\n    dp[i][w] = max(dp[i-1][w],  dp[i-1][w - weight[i]] + value[i])\n\nBase case: dp[0][w] = 0 for all w (no items → zero value)\n\nAnswer: dp[n][W]',
      visualization: {
        type: 'array',
        array: [0, 0, 6, 10, 16, 22],
        pointers: [
          { index: 0, label: 'W=0', color: 'text-green-800' },
          { index: 5, label: 'W=5 → 22', color: 'text-green-400' },
        ],
      },
    },
    {
      title: 'Bottom-Up Implementation',
      explanation:
        'Build the dp table row by row. Row i depends only on row i-1, so we can optimize to a 1D array by iterating capacity in reverse (prevents using the same item twice).',
      code: {
        python: `def knapsack(weights, values, W):
    n = len(weights)
    # dp[w] = max value achievable with capacity w
    dp = [0] * (W + 1)

    for i in range(n):
        # Iterate capacity in reverse to avoid using item i twice
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w],                          # skip item i
                        dp[w - weights[i]] + values[i]) # take item i

    return dp[W]

weights = [2, 2, 3]
values  = [6, 10, 12]
print(knapsack(weights, values, 5))  # → 22`,
        java: `public static int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[] dp = new int[W + 1];

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w],
                             dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}`,
        javascript: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = new Array(W + 1).fill(0);

  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}`,
        typescript: `function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp = new Array(W + 1).fill(0);

  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}`,
      },
      complexity: {
        time: 'O(nW)',
        space: 'O(W)',
        note: 'Called "pseudo-polynomial" — polynomial in W, but W can be exponentially large relative to the input size in bits. Still very practical for interview constraints.',
      },
    },
    {
      title: 'The Knapsack Pattern in the Wild',
      explanation:
        'Recognizing the knapsack pattern unlocks a huge class of problems:\n\n  Partition Equal Subset Sum\n    Can you split an array into two equal-sum subsets?\n    → Knapsack with W = sum/2, values = weights = array elements\n\n  Target Sum\n    How many ways to assign +/- to reach a target?\n    → Knapsack counting variant\n\n  Last Stone Weight II\n    Minimize the difference between two groups.\n    → Knapsack with W = sum/2\n\n  Ones and Zeroes\n    Max strings fitting within m zeros and n ones budgets.\n    → 2D knapsack (two capacity dimensions)\n\nWhenever you see "pick a subset" + "some constraint" + "optimize or count" — think knapsack.',
      callout: {
        type: 'interview',
        text: '"Partition Equal Subset Sum" is the most common knapsack problem in interviews. The transformation: target = sum/2, treat each number as an item with weight = value = the number, ask "can dp[target] be true?"',
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
      title: 'Target Sum',
      url: 'https://leetcode.com/problems/target-sum/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Ones and Zeroes',
      url: 'https://leetcode.com/problems/ones-and-zeroes/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Last Stone Weight II',
      url: 'https://leetcode.com/problems/last-stone-weight-ii/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default knapsack;
