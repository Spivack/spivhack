import type { Topic } from '../../../dsa-types';

const recursion: Topic = {
  id: 'recursion',
  title: 'Recursion',
  description:
    'A function that calls itself to solve a smaller version of the same problem. Every recursive solution needs a base case (stops the recursion) and a recursive case (reduces the problem). The foundation of tree traversals, divide-and-conquer, and backtracking.',
  difficulty: 'beginner',
  category: 'recursion',
  tags: ['recursion', 'call-stack', 'base-case', 'divide-and-conquer'],
  steps: [
    {
      title: 'The Two Rules of Recursion',
      explanation:
        'Every recursive function must have exactly two parts:\n\n  1. Base case — a condition where the function stops and returns directly (no recursive call). Without this, the function calls itself forever and crashes with a stack overflow.\n\n  2. Recursive case — the function calls itself with a simpler or smaller input, making progress toward the base case.\n\nThe key insight: trust that the recursive call works correctly on the smaller input. You don\'t need to trace through the full execution — just verify the base case is correct and the recursive case reduces toward it.',
      callout: {
        type: 'insight',
        text: 'Think of recursion like mathematical induction: prove it works for the base case, then prove that if it works for n-1, it works for n. That\'s all you need.',
      },
    },
    {
      title: 'Classic Example: Factorial',
      explanation:
        'Factorial: n! = n × (n-1) × (n-2) × ... × 1\n\nBase case: 0! = 1\nRecursive case: n! = n × (n-1)!\n\nTrace of factorial(4):\n  factorial(4)\n    = 4 × factorial(3)\n    = 4 × 3 × factorial(2)\n    = 4 × 3 × 2 × factorial(1)\n    = 4 × 3 × 2 × 1 × factorial(0)\n    = 4 × 3 × 2 × 1 × 1\n    = 24',
      code: {
        python: `def factorial(n: int) -> int:
    if n == 0:           # base case
        return 1
    return n * factorial(n - 1)   # recursive case

# factorial(5) → 120`,
        java: `public static int factorial(int n) {
    if (n == 0) return 1;             // base case
    return n * factorial(n - 1);     // recursive case
}`,
        javascript: `function factorial(n) {
  if (n === 0) return 1;           // base case
  return n * factorial(n - 1);    // recursive case
}`,
        typescript: `function factorial(n: number): number {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
      },
      complexity: { time: 'O(n)', space: 'O(n) call stack' },
    },
    {
      title: 'The Call Stack',
      explanation:
        'When a function calls itself, each call is pushed onto the call stack — a stack of frames, each holding the local variables and return address for that call.\n\nFor factorial(4), the stack grows to depth 5 before any call returns:\n\n  ┌─────────────────┐  ← top of stack\n  │ factorial(0)=1  │\n  ├─────────────────┤\n  │ factorial(1)    │  waiting for result\n  ├─────────────────┤\n  │ factorial(2)    │  waiting for result\n  ├─────────────────┤\n  │ factorial(3)    │  waiting for result\n  ├─────────────────┤\n  │ factorial(4)    │  waiting for result\n  └─────────────────┘\n\nOnce factorial(0) returns, each frame unwinds in reverse, multiplying as it goes.\n\nStack overflow: if recursion goes too deep (or has no base case), the call stack runs out of memory. Python defaults to ~1000 frames; Java and most languages have similar limits.',
      callout: {
        type: 'warning',
        text: 'Deep recursion on large inputs can cause a stack overflow. For n > a few thousand, consider an iterative approach or increase the stack limit. Python\'s recursion limit is 1000 by default.',
      },
    },
    {
      title: 'Writing a Recursive Function',
      explanation:
        'A reliable template for writing any recursive function:\n\n  1. Identify the base case(s) — what\'s the simplest input with a known answer?\n  2. Identify the recursive case — how does the problem split into a smaller version of itself?\n  3. Trust the recursion — assume the recursive call returns the correct answer for the smaller input and build on it.\n\nExample: sum of a list\n  Base case: empty list → 0\n  Recursive case: first element + sum(rest of list)',
      code: {
        python: `def sum_list(arr: list) -> int:
    if not arr:                       # base case: empty list
        return 0
    return arr[0] + sum_list(arr[1:]) # recursive case

# sum_list([1, 2, 3, 4]) → 10

def power(base: int, exp: int) -> int:
    if exp == 0:                      # base case
        return 1
    return base * power(base, exp - 1)

# power(2, 8) → 256`,
        java: `public static int sumList(int[] arr, int i) {
    if (i == arr.length) return 0;        // base case
    return arr[i] + sumList(arr, i + 1); // recursive case
}

public static int power(int base, int exp) {
    if (exp == 0) return 1;
    return base * power(base, exp - 1);
}`,
        javascript: `function sumList(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumList(arr, i + 1);
}

function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}`,
        typescript: `function sumList(arr: number[], i = 0): number {
  if (i === arr.length) return 0;
  return arr[i] + sumList(arr, i + 1);
}

function power(base: number, exp: number): number {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}`,
      },
    },
    {
      title: 'Recursion vs Iteration',
      explanation:
        'Every recursive function can be rewritten iteratively (using explicit loops and sometimes a stack). Which is better?\n\n  Recursion:\n    ✓ Natural fit for recursive data structures (trees, graphs)\n    ✓ Elegant for divide-and-conquer (merge sort, binary search)\n    ✓ Shorter, more readable code in many cases\n    ✗ Call stack overhead (each frame allocates memory)\n    ✗ Stack overflow risk for deep inputs\n\n  Iteration:\n    ✓ No stack overhead\n    ✓ No stack overflow risk\n    ✓ Often faster in practice for simple loops\n    ✗ Can be complex when the recursive structure is natural\n\nRule of thumb: use recursion when the problem structure is recursive (trees, graphs, parsing). Use iteration for simple loops over arrays or when depth could be large.',
      callout: {
        type: 'interview',
        text: 'Interviewers often ask you to write both recursive and iterative solutions. The iterative version of tree traversal (using an explicit stack) is a common follow-up. Understanding both shows depth.',
      },
    },
    {
      title: 'Where Recursion Shines',
      explanation:
        'Recursion is the natural choice for problems with recursive structure:\n\n  Trees: Every tree is either empty, or a root with left and right subtrees — both trees. Nearly all tree algorithms are naturally recursive.\n\n  Divide and Conquer: Split the problem in half, solve each half recursively, combine. Merge Sort, Quick Sort, Binary Search.\n\n  Backtracking: Try a choice, recurse, and undo the choice if it leads to failure. Sudoku, N-Queens, maze solving.\n\n  Parsing: Programming language grammars are recursive (expressions contain sub-expressions). Parsers are naturally recursive.\n\n  Fractals and Mathematical Sequences: Fibonacci, Tower of Hanoi, combinatorics.',
      callout: {
        type: 'tip',
        text: 'If you see a problem involving trees, nested structures, or "generate all combinations/permutations", recursion (often with backtracking) is almost certainly the right tool.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Fibonacci Number',
      url: 'https://leetcode.com/problems/fibonacci-number/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Power of Two',
      url: 'https://leetcode.com/problems/power-of-two/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Reverse String',
      url: 'https://leetcode.com/problems/reverse-string/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Generate Parentheses',
      url: 'https://leetcode.com/problems/generate-parentheses/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default recursion;
