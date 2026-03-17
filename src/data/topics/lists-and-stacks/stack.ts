import type { Topic } from '../../../types';

const stack: Topic = {
  id: 'stack',
  title: 'Stack',
  description:
    'A Last-In First-Out (LIFO) data structure. Only the top element is accessible. Push adds to the top, pop removes from the top. Used for function call management, undo systems, expression parsing, and DFS.',
  difficulty: 'beginner',
  category: 'lists-and-stacks',
  tags: ['stack', 'lifo', 'data-structure', 'array-backed'],
  steps: [
    {
      title: 'LIFO — Last In, First Out',
      explanation:
        'A stack is like a stack of plates: you can only add or remove from the top.\n\n  push(val) — place a new item on top\n  pop()     — remove and return the top item\n  peek()    — return the top item without removing it\n  isEmpty() — true if no items exist\n  size()    — number of items\n\nThe constraint is intentional — it models scenarios where the most recent item must be handled first:\n  • Function calls: the last function called must return first\n  • Undo/redo: the last action undone first\n  • Balanced brackets: the last opened bracket closed first\n  • DFS: the last node discovered explored next',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        highlighted: [4],
        pointers: [{ index: 4, label: 'top', color: 'text-green-400' }],
      },
    },
    {
      title: 'Array-Based Implementation',
      explanation:
        'The simplest stack implementation uses a dynamic array. The "top" of the stack is the last element of the array.\n\n  push → append to the end   O(1) amortized\n  pop  → remove from the end  O(1)\n  peek → read last element    O(1)\n\nAll three operations touch only the end of the array — no shifting, no traversal. This is the sweet spot of array performance.',
      code: {
        python: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, val) -> None:
        self._data.append(val)      # O(1) amortized

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._data.pop()     # O(1)

    def peek(self):
        if self.is_empty():
            raise IndexError("peek at empty stack")
        return self._data[-1]       # O(1)

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def size(self) -> int:
        return len(self._data)`,
        java: `import java.util.ArrayDeque;

// Java's built-in stack (preferred over Stack class)
ArrayDeque<Integer> stack = new ArrayDeque<>();
stack.push(10);          // O(1)
stack.push(20);
int top = stack.peek();  // 20, O(1)
int val = stack.pop();   // 20, O(1)

// Manual array-based implementation:
class Stack<T> {
    private Object[] data = new Object[16];
    private int size = 0;

    public void push(T val) {
        if (size == data.length) resize();
        data[size++] = val;         // O(1) amortized
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (size == 0) throw new EmptyStackException();
        T val = (T) data[--size];
        data[size] = null;          // prevent memory leak
        return val;
    }

    public T peek() {
        if (size == 0) throw new EmptyStackException();
        return (T) data[size - 1];
    }
}`,
        javascript: `class Stack {
  #data = [];

  push(val) { this.#data.push(val); }         // O(1)

  pop() {
    if (this.isEmpty()) throw new Error('stack is empty');
    return this.#data.pop();                   // O(1)
  }

  peek() {
    if (this.isEmpty()) throw new Error('stack is empty');
    return this.#data[this.#data.length - 1]; // O(1)
  }

  isEmpty() { return this.#data.length === 0; }
  size()    { return this.#data.length; }
}`,
        typescript: `class Stack<T> {
  #data: T[] = [];

  push(val: T): void { this.#data.push(val); }

  pop(): T {
    if (this.isEmpty()) throw new Error('stack is empty');
    return this.#data.pop()!;
  }

  peek(): T {
    if (this.isEmpty()) throw new Error('stack is empty');
    return this.#data[this.#data.length - 1];
  }

  isEmpty(): boolean { return this.#data.length === 0; }
  size(): number     { return this.#data.length; }
}`,
      },
      complexity: { time: 'O(1) push, pop, peek', space: 'O(n)' },
    },
    {
      title: 'Call Stack — How Your Code Runs',
      explanation:
        'The call stack is the most important real-world stack. Every time your program calls a function, the runtime pushes a stack frame onto the call stack. When the function returns, its frame is popped.\n\nExample — what happens when factorial(3) runs:\n\n  push: factorial(3)       ← current top\n  push: factorial(2)\n  push: factorial(1)       ← returns 1\n  pop:  factorial(1)\n  pop:  factorial(2)       ← returns 2\n  pop:  factorial(3)       ← returns 6\n\nEach frame holds: local variables, parameters, the return address.\n\nStack overflow literally means the call stack ran out of space — too many nested calls before any returned.',
      callout: {
        type: 'insight',
        text: 'Recursion uses the call stack implicitly. Iterative DFS uses an explicit stack. Understanding this equivalence lets you convert any recursive algorithm to iterative.',
      },
    },
    {
      title: 'Application: Balanced Brackets',
      explanation:
        'One of the most common stack interview problems: given a string of brackets, determine if they are balanced.\n\nAlgorithm:\n  For each character:\n    If it\'s an opening bracket → push it\n    If it\'s a closing bracket:\n      If stack is empty → unmatched closing → false\n      If stack top doesn\'t match → mismatch → false\n      Otherwise → pop the matching opener\n  At the end: stack must be empty (no unclosed openers)\n\nWhy a stack works: the most recent opener must always be closed first — exactly LIFO.',
      code: {
        python: `def is_balanced(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in ')]}':
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()

    return len(stack) == 0`,
        java: `public static boolean isBalanced(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if ("([{".indexOf(ch) >= 0) {
            stack.push(ch);
        } else if (")]}".indexOf(ch) >= 0) {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) return false;
        }
    }
    return stack.isEmpty();
}`,
        javascript: `function isBalanced(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else if (')]}'.includes(ch)) {
      if (!stack.length || stack[stack.length - 1] !== pairs[ch])
        return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}`,
        typescript: `function isBalanced(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else if (')]}'.includes(ch)) {
      if (!stack.length || stack[stack.length - 1] !== pairs[ch])
        return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}`,
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        note: 'O(n) space in the worst case — a string of all opening brackets pushes n items before any are popped.',
      },
    },
    {
      title: 'Complexity and When to Use',
      explanation:
        'Stack Complexities:\n\n  Operation   Time     Notes\n  ─────────────────────────────────\n  push        O(1)*    Append to end of array\n  pop         O(1)     Remove from end of array\n  peek        O(1)     Read last element\n  search      O(n)     Must scan — stacks don\'t support random access\n\n  * Amortized O(1) — occasional O(n) resize\n  Space: O(n)\n\nUse a stack when:\n  • You need to reverse a sequence\n  • You\'re implementing DFS or backtracking\n  • You need to match nested structures (brackets, HTML tags)\n  • You\'re evaluating expressions or managing undo history\n\nDo not use a stack when:\n  • You need random access by index → use an array\n  • You need O(1) access to both ends → use a deque',
      complexity: {
        time: 'O(1) push/pop/peek',
        space: 'O(n)',
        note: 'Python: use a list. Java: use ArrayDeque (not the legacy Stack class). JavaScript: use an array.',
      },
      callout: {
        type: 'interview',
        text: 'Stacks appear constantly in interviews: balanced brackets, daily temperatures, next greater element, simplify path, evaluate expressions. Recognizing "this needs LIFO" is the pattern to internalize.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Valid Parentheses',
      url: 'https://leetcode.com/problems/valid-parentheses/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Daily Temperatures',
      url: 'https://leetcode.com/problems/daily-temperatures/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Min Stack',
      url: 'https://leetcode.com/problems/min-stack/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default stack;
