import type { Topic } from '../../../types';

const longestCommonSubsequence: Topic = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  description:
    'Find the longest sequence of characters that appears in the same order in both strings — not necessarily contiguous. The foundation of diff tools, DNA analysis, and spell checkers. The canonical 2D DP problem.',
  difficulty: 'intermediate',
  category: 'dynamic-programming',
  tags: ['dynamic-programming', 'LCS', '2D-dp', 'strings', 'sequences'],
  steps: [
    {
      title: 'Subsequence vs Substring',
      explanation:
        'A subsequence preserves order but allows gaps. A substring must be contiguous.\n\n  String: "ABCDE"\n  Subsequences: "ACE", "BD", "ABCDE", "" — all valid\n  Substrings:   "ABC", "BCD", "CDE" — must be contiguous\n\nLCS of "ABCBDAB" and "BDCAB":\n  One LCS: "BCAB" or "BDAB" — length 4\n\nApplications:\n  • git diff / Unix diff: find common lines between two file versions\n  • DNA sequence alignment: find shared genetic subsequences\n  • Spell checking: measure similarity between words\n  • Edit distance: LCS is the dual of minimum edit distance',
    },
    {
      title: 'The Recurrence',
      explanation:
        'Define dp[i][j] = length of LCS of the first i characters of s1 and first j characters of s2.\n\nAt each position (i, j), look at characters s1[i-1] and s2[j-1]:\n\n  Case 1 — characters match (s1[i-1] == s2[j-1]):\n    This character extends the LCS of the prefixes without it.\n    dp[i][j] = dp[i-1][j-1] + 1\n\n  Case 2 — characters don\'t match:\n    The LCS either excludes s1[i-1] or s2[j-1] — take the better option.\n    dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n\nBase case: dp[i][0] = dp[0][j] = 0 (empty string has no LCS)\n\nAnswer: dp[m][n] where m = len(s1), n = len(s2)',
      visualization: {
        type: 'array',
        array: [0, 0, 1, 1, 1, 2, 3, 4],
        pointers: [
          { index: 0, label: 'base', color: 'text-green-800' },
          { index: 7, label: 'LCS=4', color: 'text-green-400' },
        ],
      },
    },
    {
      title: 'Implementation',
      explanation:
        'Build the 2D table row by row. Each cell depends only on the cell above, left, and diagonally above-left.',
      code: {
        python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    # dp[i][j] = LCS length of s1[:i] and s2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i-1][j-1] + 1   # characters match
            else:
                dp[i][j] = max(dp[i-1][j],     # skip s1[i-1]
                               dp[i][j-1])      # skip s2[j-1]

    return dp[m][n]

print(lcs("ABCBDAB", "BDCAB"))  # → 4`,
        java: `public static int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
        javascript: `function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
        typescript: `function lcs(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
      },
      complexity: {
        time: 'O(mn)',
        space: 'O(mn), reducible to O(n) using two rows',
        note: 'Space optimization: since each row depends only on the previous row, you can keep just two 1D arrays.',
      },
    },
    {
      title: 'Reconstructing the Actual Subsequence',
      explanation:
        'dp[m][n] gives the length — to recover the actual subsequence, traceback through the table:\n\n  Start at dp[m][n]\n  At each cell (i, j):\n    • If s1[i-1] == s2[j-1]: this char is in the LCS, move diagonally (i-1, j-1)\n    • Else if dp[i-1][j] > dp[i][j-1]: move up (i-1, j)\n    • Else: move left (i, j-1)\n  Stop when i=0 or j=0',
      code: {
        python: `def lcs_string(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else:                   dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # Traceback
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            result.append(s1[i-1])
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))

print(lcs_string("ABCBDAB", "BDCAB"))  # → "BCAB" or "BDAB"`,
        javascript: `function lcsString(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m+1 }, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = s1[i-1] === s2[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);

  let result = '', i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i-1] === s2[j-1]) { result = s1[i-1] + result; i--; j--; }
    else if (dp[i-1][j] > dp[i][j-1]) i--;
    else j--;
  }
  return result;
}`,
        java: `// Traceback same logic — collect matching chars into a StringBuilder, then reverse`,
        typescript: `// Same as JS — TypeScript version is identical`,
      },
      callout: {
        type: 'interview',
        text: 'LCS is asked directly ("Longest Common Subsequence", LeetCode 1143) and also appears as the basis for related problems: Longest Palindromic Subsequence (LCS of s and reverse(s)), Minimum Deletions to Make Two Strings Equal, and Shortest Common Supersequence.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Longest Common Subsequence',
      url: 'https://leetcode.com/problems/longest-common-subsequence/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Longest Palindromic Subsequence',
      url: 'https://leetcode.com/problems/longest-palindromic-subsequence/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Edit Distance',
      url: 'https://leetcode.com/problems/edit-distance/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Shortest Common Supersequence',
      url: 'https://leetcode.com/problems/shortest-common-supersequence/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default longestCommonSubsequence;
