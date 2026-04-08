import type { Topic } from '../../../dsa-types';

const coinChange: Topic = {
  id: 'coin-change',
  title: 'Coin Change',
  description:
    'Given coin denominations and a target amount, find the minimum number of coins needed to make that amount. A textbook example of unbounded knapsack — coins can be reused. One of the most frequently asked DP problems in technical interviews.',
  difficulty: 'intermediate',
  category: 'dynamic-programming',
  tags: ['dynamic-programming', 'coin-change', 'unbounded-knapsack', 'bottom-up', 'BFS'],
  steps: [
    {
      title: 'The Problem',
      explanation:
        'Given coins = [1, 5, 6, 9] and amount = 11:\n\n  Greedy fails: 9 + 1 + 1 = 3 coins\n  Optimal:      6 + 5   = 2 coins\n\nGreedy (always pick the largest coin that fits) does not work here — it commits to a choice that blocks the optimal solution.\n\nThis is the classic "unbounded knapsack" variant: each coin denomination can be used any number of times. The goal is to minimize coin count.',
      callout: {
        type: 'insight',
        text: 'Greedy works for some coin systems (e.g., US currency: 25, 10, 5, 1 cents) but not all. DP is needed for arbitrary denominations. Recognizing when greedy fails and DP is required is itself a key interview skill.',
      },
    },
    {
      title: 'The Recurrence',
      explanation:
        'Define dp[a] = minimum coins needed to make amount a.\n\nBase case: dp[0] = 0 (zero coins needed for amount 0)\nInitialize: dp[a] = ∞ for a > 0 (not yet reachable)\n\nFor each amount a from 1 to target:\n  For each coin c in coins:\n    If c ≤ a and dp[a - c] + 1 < dp[a]:\n      dp[a] = dp[a - c] + 1\n\nTranslation: "the minimum coins for amount a is 1 (this coin) plus the minimum coins for the remaining amount a - c." Try every coin and keep the minimum.\n\nAnswer: dp[target], or -1 if it remains ∞ (unreachable).',
      visualization: {
        type: 'array',
        array: [0, 1, 2, 3, 4, 1, 1, 2, 3, 1, 2, 2],
        pointers: [
          { index: 0, label: 'amount=0', color: 'text-green-800' },
          { index: 5, label: 'coin=5→1', color: 'text-yellow-400' },
          { index: 11, label: 'answer=2', color: 'text-green-400' },
        ],
      },
    },
    {
      title: 'Bottom-Up Implementation',
      explanation:
        'Build the dp array from amount 0 up to the target. Each entry is computed from previously-solved subproblems.',
      code: {
        python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0   # base case

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 5, 6, 9], 11))  # → 2  (6 + 5)
print(coin_change([2], 3))            # → -1 (impossible)`,
        java: `public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // sentinel for "infinity"
    dp[0] = 0;

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a)
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      },
      complexity: {
        time: 'O(amount × n) where n = number of coin denominations',
        space: 'O(amount)',
      },
    },
    {
      title: 'Variant: Count the Ways (Coin Change II)',
      explanation:
        'A closely related problem: how many distinct combinations of coins sum to the target?\n\nChange: instead of minimizing, count. Use dp[a] += dp[a - coin].\n\nCritical difference in loop order:\n  • Minimize (fewest coins): inner loop over coins, outer over amounts — order doesn\'t matter\n  • Count combinations: outer loop over coins, inner over amounts — this ensures each coin is considered once per combination, avoiding duplicate counting',
      code: {
        python: `def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1   # one way to make amount 0: use no coins

    for coin in coins:            # outer: coins
        for a in range(coin, amount + 1):   # inner: amounts
            dp[a] += dp[a - coin]

    return dp[amount]

print(coin_change_ways([1, 2, 5], 5))  # → 4
# (5), (2+2+1), (2+1+1+1), (1+1+1+1+1)`,
        java: `public static int coinChangeWays(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins)
        for (int a = coin; a <= amount; a++)
            dp[a] += dp[a - coin];
    return dp[amount];
}`,
        javascript: `function coinChangeWays(coins, amount) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins)
    for (let a = coin; a <= amount; a++)
      dp[a] += dp[a - coin];
  return dp[amount];
}`,
        typescript: `function coinChangeWays(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins)
    for (let a = coin; a <= amount; a++)
      dp[a] += dp[a - coin];
  return dp[amount];
}`,
      },
      callout: {
        type: 'interview',
        text: 'The loop order swap (coins outer, amounts inner) is one of the most subtle but testable DP details. Combinations outer = each coin used freely, amounts outer = permutations counted. Interviewers love asking why the order matters.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Coin Change',
      url: 'https://leetcode.com/problems/coin-change/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Coin Change II',
      url: 'https://leetcode.com/problems/coin-change-ii/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Perfect Squares',
      url: 'https://leetcode.com/problems/perfect-squares/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Minimum Cost For Tickets',
      url: 'https://leetcode.com/problems/minimum-cost-for-tickets/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default coinChange;
