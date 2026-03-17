import type { Topic } from '../../../types';

const bigONotation: Topic = {
  id: 'big-o-notation',
  title: 'Big-O Notation',
  description:
    'The language of algorithm efficiency. Big-O describes how an algorithm\'s time or space requirements grow as input size grows — ignoring constants, focusing on the dominant term.',
  difficulty: 'beginner',
  category: 'complexity',
  tags: ['analysis', 'complexity', 'big-o', 'fundamentals'],
  steps: [
    {
      title: 'Why Measure Complexity?',
      explanation:
        'Two algorithms can solve the same problem correctly but perform very differently at scale.\n\nImagine searching for a name in a list of 10 entries vs 10 million entries. An algorithm that checks every entry one-by-one is fine for 10 — but painful for 10 million.\n\nComplexity analysis answers: "How does runtime (or memory) scale as the input grows?" We want this answer independent of hardware, language, or compiler — just the mathematical growth rate.',
      visualization: {
        type: 'array',
        array: [12, 45, 7, 89, 23, 56, 3, 78, 34, 61],
        highlighted: [0],
        pointers: [{ index: 0, label: 'start', color: 'text-green-400' }],
      },
    },
    {
      title: 'Big-O: The Formal Definition',
      explanation:
        'T(n) is in O(f(n)) if there exist positive constants c and n₀ such that:\n\n  T(n) ≤ c · f(n)   for all n > n₀\n\nIn plain English: beyond some input size n₀, f(n) is an upper bound on growth (up to a constant factor).\n\nFour simplification rules:\n1. Constants vanish — O(3n) = O(n)\n2. Sequential operations — O(n) + O(n²) = O(n²)\n3. Repeated actions — a loop of n iterations over O(1) work = O(n)\n4. Lower-order terms drop — O(n² + n) = O(n²)\n\nWe always report the dominant term with no constant coefficient.',
      callout: {
        type: 'insight',
        text: 'Big-O is an upper bound — a worst-case ceiling. We\'re asking: "in the worst possible scenario, how bad can this get?"',
      },
    },
    {
      title: 'Worst, Best, and Average Case',
      explanation:
        'The same algorithm can have different costs depending on the input:\n\n• Best case — the most favorable input (e.g., target is the first element). Usually O(1) for searches. Often not useful.\n\n• Worst case — the most costly input. This is what Big-O typically describes. Gives a hard guarantee: "it will never be worse than this."\n\n• Average case — expected cost over all likely inputs. Requires knowing the input distribution, which is often unknown.\n\nWhy we focus on worst case:\n  → Real-time systems (air traffic control, trading) need guarantees.\n  → It\'s measurable and provable without assumptions about data.\n  → "Probably fast" is not good enough in production.',
      callout: {
        type: 'interview',
        text: 'When an interviewer asks "what\'s the complexity?", they almost always mean worst-case time complexity unless they specify otherwise.',
      },
    },
    {
      title: 'Growth Rates Ranked',
      explanation:
        'From fastest to slowest growth (best to worst for algorithms):\n\n  O(1)        — Constant. Does not depend on input size.\n  O(log n)    — Logarithmic. Halves the problem each step.\n  O(n)        — Linear. One pass through input.\n  O(n log n)  — Linearithmic. Typical of efficient sorts.\n  O(n²)       — Quadratic. Nested loops over input.\n  O(2ⁿ)       — Exponential. Each step doubles work.\n  O(n!)       — Factorial. All permutations (e.g., brute-force TSP).\n\nConcrete example with n = 1,000:\n  O(1)      →         1 operation\n  O(log n)  →        10 operations\n  O(n)      →     1,000 operations\n  O(n log n)→    10,000 operations\n  O(n²)     → 1,000,000 operations\n  O(2ⁿ)     → 10^301 operations (impossible)',
      callout: {
        type: 'tip',
        text: 'O(n log n) is the theoretical lower bound for comparison-based sorting. You cannot do better than this for the general case.',
      },
    },
    {
      title: 'Array Operations',
      explanation:
        'Arrays store elements in contiguous memory. The index directly computes the memory address: address = base + (index × element_size).\n\n  Access by index    O(1)  — address is computed directly, no traversal\n  Search (unsorted)  O(n)  — must check every element in worst case\n  Search (sorted)    O(log n)  — binary search halves the range\n  Insert at end      O(1) amortized  — append (dynamic arrays may resize)\n  Insert at index i  O(n)  — must shift all elements right of i\n  Delete at index i  O(n)  — must shift all elements left of i\n  Delete at end      O(1)  — just decrement size\n\nSpace: O(n) to store n elements.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50, 60, 70],
        highlighted: [2],
        pointers: [{ index: 2, label: 'arr[2] → O(1)', color: 'text-green-400' }],
      },
      callout: {
        type: 'insight',
        text: 'Array access is O(1) because of contiguous memory — the CPU computes the address with one multiply-and-add. No traversal needed.',
      },
    },
    {
      title: 'Linked List Operations',
      explanation:
        'Linked lists store elements in nodes, each pointing to the next. There is no index-to-address formula — you must walk the chain.\n\n  Access by index    O(n)  — must traverse from head node by node\n  Search             O(n)  — linear scan, no random access\n  Insert at head     O(1)  — rewire the head pointer\n  Insert at tail     O(1)  — with a tail pointer; O(n) without\n  Insert at index i  O(n)  — must traverse to position i first\n  Delete at head     O(1)  — rewire head pointer\n  Delete at index i  O(n)  — must traverse to find the node\n\nSpace: O(n) for data + O(n) overhead for pointers.\n\nDoubly linked lists add a prev pointer, enabling O(1) deletion if you already hold the node reference — a key advantage.',
      visualization: {
        type: 'array',
        array: ['A', 'B', 'C', 'D', 'E'],
        highlighted: [0],
        pointers: [
          { index: 0, label: 'head O(1)', color: 'text-green-400' },
          { index: 4, label: 'tail O(1)', color: 'text-yellow-400' },
        ],
      },
      callout: {
        type: 'insight',
        text: 'Linked list vs Array tradeoff: arrays win on access (O(1) vs O(n)); linked lists win on insert/delete at a known position (O(1) vs O(n) shifting).',
      },
    },
    {
      title: 'Hash Table Operations',
      explanation:
        'A hash table maps keys to values using a hash function. The hash function computes a bucket index from the key in O(1).\n\n  Access/Lookup      O(1) average — hash → bucket → value\n  Insert             O(1) average — hash → bucket → store\n  Delete             O(1) average — hash → bucket → remove\n\nWorst case is O(n) when all keys hash to the same bucket (all collisions). Good hash functions and load factor management keep this rare.\n\nSpace: O(n) for n entries, plus overhead for empty buckets (typically 1.3x–2x load factor).\n\nPython dict, Java HashMap, JS Map — all O(1) average for get/set/delete.',
      callout: {
        type: 'interview',
        text: 'When you need O(1) lookup by key, reach for a hash map. This is one of the most important patterns in interview problem solving — trading O(n) space for O(1) time.',
      },
    },
    {
      title: 'Tree Operations (BST)',
      explanation:
        'A Binary Search Tree (BST) keeps elements sorted: left subtree < node < right subtree. Each comparison eliminates half the remaining nodes.\n\n  Search             O(log n) average — O(n) worst (degenerate/skewed tree)\n  Insert             O(log n) average — O(n) worst\n  Delete             O(log n) average — O(n) worst\n  Min / Max          O(log n) — traverse all the way left/right\n  In-order traversal O(n)     — visits every node once\n\nSpace: O(n) for n nodes + O(h) call stack for recursive operations, where h = tree height.\n\nBalanced BSTs (AVL, Red-Black) guarantee O(log n) worst case by keeping h = O(log n). Java TreeMap and Python\'s sortedcontainers use these.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50, 60, 70],
        highlighted: [3],
        pointers: [{ index: 3, label: 'root (mid)', color: 'text-green-400' }],
      },
      callout: {
        type: 'warning',
        text: 'An unbalanced BST degrades to O(n) — equivalent to a linked list. Always clarify "balanced BST" when claiming O(log n) guarantees.',
      },
    },
    {
      title: 'The Complexity Cheat Sheet',
      explanation:
        'Data Structure        Access    Search    Insert    Delete\n─────────────────────────────────────────────────────\nArray                 O(1)      O(n)      O(n)      O(n)\nDynamic Array (end)   O(1)      O(n)      O(1)*     O(1)*\nLinked List           O(n)      O(n)      O(1)**    O(1)**\nHash Table            O(1)*     O(1)*     O(1)*     O(1)*\nBST (balanced)        O(log n)  O(log n)  O(log n)  O(log n)\nHeap                  O(1)†     O(n)      O(log n)  O(log n)\nStack / Queue         O(n)      O(n)      O(1)      O(1)\n\n*  = average case\n** = at head/tail or with node reference\n†  = min/max only\n\nAll of these are O(n) space to store n elements.',
      callout: {
        type: 'interview',
        text: 'Memorize this table. Interview complexity questions almost always reduce to: "what data structure gives me the right operations at the right cost?" Know which structure to reach for and why.',
      },
      complexity: {
        time: 'Varies by structure and operation',
        space: 'O(n) for all listed structures',
        note: 'These are the building blocks — every interview problem is built on top of these.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Two Sum (O(n) with hash map)',
      url: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Contains Duplicate (O(n) with set)',
      url: 'https://leetcode.com/problems/contains-duplicate/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Top K Frequent Elements (O(n log k) with heap)',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default bigONotation;
