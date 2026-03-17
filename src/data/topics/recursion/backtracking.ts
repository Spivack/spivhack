import type { Topic } from '../../../types';

const backtracking: Topic = {
  id: 'backtracking',
  title: 'Backtracking',
  description:
    'Build solutions incrementally, abandoning a path the moment it\'s proven invalid. Backtracking is exhaustive search made practical — it explores only paths that could still lead to a solution, pruning the rest. Powers constraint solvers, combinatorics, and puzzles.',
  difficulty: 'advanced',
  category: 'recursion',
  tags: ['backtracking', 'recursion', 'pruning', 'combinatorics', 'exhaustive-search'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'Backtracking is a systematic way to search through all possible configurations of a problem.\n\nThe pattern:\n  1. Make a choice (extend the current partial solution)\n  2. Check if the choice is still valid\n     • If invalid: undo the choice and try the next option (backtrack)\n     • If valid and complete: record the solution\n     • If valid but incomplete: recurse deeper\n\nThe key word is prune: as soon as you know a partial solution cannot lead to a valid complete solution, stop exploring that branch entirely. This turns exponential brute force into something practical for many real inputs.\n\nBacktracking is depth-first search on an implicit decision tree.',
    },
    {
      title: 'The Template',
      explanation:
        'Every backtracking problem follows the same skeleton. Recognize it, fill in the three pieces, and the solution writes itself.',
      code: {
        python: `def backtrack(state, choices):
    # Base case: state is a complete solution
    if is_complete(state):
        record(state)
        return

    for choice in choices:
        # Pruning: skip invalid choices early
        if not is_valid(state, choice):
            continue

        # Make the choice
        apply(state, choice)

        # Recurse with updated state
        backtrack(state, next_choices(state, choice))

        # Undo the choice (backtrack)
        undo(state, choice)`,
        java: `void backtrack(List<Integer> state, int[] choices) {
    if (isComplete(state)) {
        record(new ArrayList<>(state));  // copy — state will be modified
        return;
    }
    for (int choice : choices) {
        if (!isValid(state, choice)) continue;
        state.add(choice);
        backtrack(state, nextChoices(state, choice));
        state.remove(state.size() - 1);  // undo
    }
}`,
        javascript: `function backtrack(state, choices) {
  if (isComplete(state)) {
    result.push([...state]);  // snapshot — state will be modified
    return;
  }
  for (const choice of choices) {
    if (!isValid(state, choice)) continue;
    state.push(choice);
    backtrack(state, nextChoices(state, choice));
    state.pop();              // undo
  }
}`,
        typescript: `function backtrack(state: number[], choices: number[]): void {
  if (isComplete(state)) {
    result.push([...state]);
    return;
  }
  for (const choice of choices) {
    if (!isValid(state, choice)) continue;
    state.push(choice);
    backtrack(state, nextChoices(state, choice));
    state.pop();
  }
}`,
      },
    },
    {
      title: 'Example: Generate All Subsets',
      explanation:
        'Generate all 2ⁿ subsets of an array.\n\nAt each index, make a binary choice: include this element or skip it. No pruning needed — every path is valid.',
      code: {
        python: `def subsets(nums):
    result = []

    def backtrack(start, current):
        result.append(list(current))  # every partial state is a valid subset

        for i in range(start, len(nums)):
            current.append(nums[i])          # include nums[i]
            backtrack(i + 1, current)        # recurse on remaining
            current.pop()                    # undo

    backtrack(0, [])
    return result

# subsets([1,2,3]) →
# [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]`,
        java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}
private void backtrack(int[] nums, int start,
                       List<Integer> curr, List<List<Integer>> result) {
    result.add(new ArrayList<>(curr));
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(nums, i + 1, curr, result);
        curr.remove(curr.size() - 1);
    }
}`,
        javascript: `function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
        typescript: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  function backtrack(start: number, current: number[]): void {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
      },
      complexity: {
        time: 'O(n × 2ⁿ)',
        space: 'O(n) recursion depth',
        note: '2ⁿ subsets, each taking O(n) to copy.',
      },
    },
    {
      title: 'Example: N-Queens',
      explanation:
        'Place N queens on an N×N board so no two queens attack each other (same row, column, or diagonal).\n\nThis is where pruning shines. Place queens one row at a time. Before placing in column c, check if any existing queen attacks that position — if so, skip the entire subtree rooted at that choice.\n\nFor N=8, brute force checks 8^8 = 16 million placements. With pruning, backtracking checks ~2000.',
      code: {
        python: `def solve_n_queens(n):
    result  = []
    queens  = []   # queens[row] = col of queen in that row

    def attacks(row, col):
        for r, c in enumerate(queens):
            if c == col:              return True  # same column
            if abs(r - row) == abs(c - col): return True  # diagonal
        return False

    def backtrack(row):
        if row == n:
            result.append(list(queens))
            return
        for col in range(n):
            if not attacks(row, col):
                queens.append(col)         # place queen
                backtrack(row + 1)         # next row
                queens.pop()              # remove queen

    backtrack(0)
    return result

# len(solve_n_queens(8)) → 92 solutions`,
        java: `public List<List<Integer>> solveNQueens(int n) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(n, new ArrayList<>(), result);
    return result;
}
private void backtrack(int n, List<Integer> queens,
                       List<List<Integer>> result) {
    if (queens.size() == n) { result.add(new ArrayList<>(queens)); return; }
    int row = queens.size();
    for (int col = 0; col < n; col++) {
        if (!attacks(queens, row, col)) {
            queens.add(col);
            backtrack(n, queens, result);
            queens.remove(queens.size() - 1);
        }
    }
}`,
        javascript: `function solveNQueens(n) {
  const result = [];
  function attacks(queens, row, col) {
    for (let r = 0; r < queens.length; r++) {
      const c = queens[r];
      if (c === col || Math.abs(r - row) === Math.abs(c - col)) return true;
    }
    return false;
  }
  function backtrack(queens) {
    if (queens.length === n) { result.push([...queens]); return; }
    const row = queens.length;
    for (let col = 0; col < n; col++) {
      if (!attacks(queens, row, col)) {
        queens.push(col);
        backtrack(queens);
        queens.pop();
      }
    }
  }
  backtrack([]);
  return result;
}`,
        typescript: `function solveNQueens(n: number): number[][] {
  const result: number[][] = [];
  function attacks(queens: number[], row: number, col: number): boolean {
    for (let r = 0; r < queens.length; r++) {
      const c = queens[r];
      if (c === col || Math.abs(r - row) === Math.abs(c - col)) return true;
    }
    return false;
  }
  function backtrack(queens: number[]): void {
    if (queens.length === n) { result.push([...queens]); return; }
    const row = queens.length;
    for (let col = 0; col < n; col++) {
      if (!attacks(queens, row, col)) {
        queens.push(col);
        backtrack(queens);
        queens.pop();
      }
    }
  }
  backtrack([]);
  return result;
}`,
      },
      callout: {
        type: 'insight',
        text: 'Pruning is what separates backtracking from brute force. The earlier you can detect a dead end and prune, the faster the algorithm. Good constraint propagation (like in Sudoku solvers) can reduce the search space by orders of magnitude.',
      },
    },
    {
      title: 'When to Use Backtracking',
      explanation:
        'Backtracking is the right tool when:\n  • You need to find all valid configurations (permutations, subsets, combinations)\n  • The problem involves placing items with constraints (N-Queens, Sudoku, graph coloring)\n  • You\'re searching for any one valid solution\n  • The search space is exponential but heavily prunable in practice\n\nBacktracking does NOT replace dynamic programming:\n  • DP: overlapping subproblems, optimal substructure, count/optimize\n  • Backtracking: enumerate all solutions, constraints, no obvious subproblem structure\n\nWhen you see: "find all combinations", "generate all permutations", "solve this constraint puzzle" — think backtracking.',
      callout: {
        type: 'interview',
        text: 'Backtracking is one of the highest-yield interview topics. Subsets, permutations, combinations, N-Queens, Sudoku, and word search are all backtracking. Master the template — start → choose → explore → unchoose — and most of these problems become mechanical.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Subsets',
      url: 'https://leetcode.com/problems/subsets/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Permutations',
      url: 'https://leetcode.com/problems/permutations/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'N-Queens',
      url: 'https://leetcode.com/problems/n-queens/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
    {
      title: 'Sudoku Solver',
      url: 'https://leetcode.com/problems/sudoku-solver/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default backtracking;
