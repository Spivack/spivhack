import type { Topic } from '../../../dsa-types';

const linkedStack: Topic = {
  id: 'linked-stack',
  title: 'Linked Stack',
  description:
    'A stack implemented with a singly linked list instead of an array. Push and pop operate on the head node — both O(1) with no resizing and no wasted capacity. Ideal when the maximum size is unknown.',
  difficulty: 'intermediate',
  category: 'lists-and-stacks',
  tags: ['stack', 'linked-list', 'lifo', 'data-structure'],
  steps: [
    {
      title: 'Why a Linked Stack?',
      explanation:
        'An array-based stack is usually the right choice — it\'s simple and cache-friendly. But it has one limitation: the underlying array has a fixed capacity that must be doubled on resize, copying all elements.\n\nA linked stack never resizes. Each push allocates exactly one new node; each pop frees one node. Memory grows and shrinks exactly with the number of elements.\n\nWhen to prefer a linked stack:\n  • You need a guaranteed O(1) push (not amortized) — e.g., real-time systems\n  • The maximum stack depth is unknown or highly variable\n  • Memory is tightly managed and you cannot afford unused capacity\n\nIn practice, array-based stacks outperform linked stacks for most use cases due to better cache locality.',
      visualization: {
        type: 'array',
        array: [50, 40, 30, 20, 10],
        highlighted: [0],
        pointers: [
          { index: 0, label: 'top (head)', color: 'text-green-400' },
          { index: 4, label: 'bottom', color: 'text-green-800' },
        ],
      },
    },
    {
      title: 'Implementation: Push = Insert at Head',
      explanation:
        'The top of the stack maps directly to the head of the linked list.\n\nPush: create a new node, point its next to the current head, update head.\nPop: save head\'s value, advance head to head.next.\n\nBoth operations touch only the head — O(1) with no array involved.',
      code: {
        python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedStack:
    def __init__(self):
        self._top = None    # the head node
        self._size = 0

    def push(self, val) -> None:
        node = Node(val)
        node.next = self._top   # new node points to old top
        self._top = node        # new node becomes top
        self._size += 1

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        val = self._top.val
        self._top = self._top.next  # advance top
        self._size -= 1
        return val

    def peek(self):
        if self.is_empty():
            raise IndexError("peek at empty stack")
        return self._top.val

    def is_empty(self) -> bool:
        return self._top is None

    def size(self) -> int:
        return self._size`,
        java: `class LinkedStack<T> {
    private Node<T> top = null;
    private int size = 0;

    public void push(T val) {
        Node<T> node = new Node<>(val);
        node.next = top;        // new node points to old top
        top = node;             // new node becomes top
        size++;
    }

    public T pop() {
        if (top == null) throw new EmptyStackException();
        T val = top.val;
        top = top.next;         // advance top
        size--;
        return val;
    }

    public T peek() {
        if (top == null) throw new EmptyStackException();
        return top.val;
    }

    public boolean isEmpty() { return top == null; }
    public int size()        { return size; }
}`,
        javascript: `class Node {
  constructor(val) { this.val = val; this.next = null; }
}

class LinkedStack {
  #top = null;
  #size = 0;

  push(val) {
    const node = new Node(val);
    node.next = this.#top;      // point to old top
    this.#top = node;           // new top
    this.#size++;
  }

  pop() {
    if (!this.#top) throw new Error('stack is empty');
    const val = this.#top.val;
    this.#top = this.#top.next; // advance top
    this.#size--;
    return val;
  }

  peek() {
    if (!this.#top) throw new Error('stack is empty');
    return this.#top.val;
  }

  isEmpty() { return this.#top === null; }
  size()    { return this.#size; }
}`,
        typescript: `class Node<T> {
  val: T; next: Node<T> | null = null;
  constructor(val: T) { this.val = val; }
}

class LinkedStack<T> {
  #top: Node<T> | null = null;
  #size = 0;

  push(val: T): void {
    const node = new Node(val);
    node.next = this.#top;
    this.#top = node;
    this.#size++;
  }

  pop(): T {
    if (!this.#top) throw new Error('stack is empty');
    const val = this.#top.val;
    this.#top = this.#top.next;
    this.#size--;
    return val;
  }

  peek(): T {
    if (!this.#top) throw new Error('stack is empty');
    return this.#top.val;
  }

  isEmpty(): boolean { return this.#top === null; }
  size(): number     { return this.#size; }
}`,
      },
      highlightLines: {
        python: [12, 13, 14, 20, 21],
        java: [6, 7, 8, 13, 14],
        javascript: [11, 12, 13, 18, 19],
        typescript: [11, 12, 13, 19, 20],
      },
      complexity: { time: 'O(1) push, pop, peek — guaranteed, not amortized', space: 'O(n)' },
    },
    {
      title: 'Array Stack vs Linked Stack',
      explanation:
        'Both implement the same Stack ADT. The difference is entirely in the implementation:\n\n  Property            Array Stack       Linked Stack\n  ────────────────────────────────────────────────────\n  push (worst case)   O(n) on resize    O(1) guaranteed\n  push (amortized)    O(1)              O(1)\n  pop                 O(1)              O(1)\n  peek                O(1)              O(1)\n  Memory per item     Low (no overhead) Higher (+pointer)\n  Cache locality      Excellent         Poor (scattered nodes)\n  Wasted capacity     Up to 50%         None\n  Max size limit      May need resize   None (until heap full)\n\nIn benchmarks, array-based stacks are typically 2-5x faster than linked stacks due to cache locality — contiguous memory means fewer cache misses.',
      callout: {
        type: 'tip',
        text: 'Default to an array-based stack. Use a linked stack only when you need a strict O(1) push guarantee or truly unbounded size without any resize events.',
      },
      complexity: {
        time: 'O(1) all operations, no amortization',
        space: 'O(n) — but no slack capacity',
        note: 'The memory overhead of pointers typically makes this slower in practice despite the same asymptotic complexity.',
      },
    },
    {
      title: 'Application: Iterative DFS with a Linked Stack',
      explanation:
        'Depth-First Search can be implemented iteratively using an explicit stack instead of recursion (which uses the call stack implicitly).\n\nFor a graph represented as an adjacency list:\n  1. Push the start node\n  2. While stack is not empty:\n     a. Pop a node\n     b. If not visited, mark it visited and process it\n     c. Push all unvisited neighbors\n\nUsing a linked stack here is reasonable since graph depth is unpredictable and we want to avoid the overhead of array resizing during traversal.',
      code: {
        python: `def dfs_iterative(graph: dict, start) -> list:
    stack = LinkedStack()
    visited = set()
    order = []

    stack.push(start)

    while not stack.is_empty():
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in graph[node]:    # push neighbors
                if neighbor not in visited:
                    stack.push(neighbor)

    return order`,
        java: `public List<Integer> dfsIterative(Map<Integer, List<Integer>> graph, int start) {
    LinkedStack<Integer> stack = new LinkedStack<>();
    Set<Integer> visited = new HashSet<>();
    List<Integer> order = new ArrayList<>();

    stack.push(start);

    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited.contains(node)) {
            visited.add(node);
            order.add(node);
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor))
                    stack.push(neighbor);
            }
        }
    }
    return order;
}`,
        javascript: `function dfsIterative(graph, start) {
  const stack = new LinkedStack();
  const visited = new Set();
  const order = [];

  stack.push(start);

  while (!stack.isEmpty()) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      order.push(node);
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }
  return order;
}`,
        typescript: `function dfsIterative(graph: Record<string, string[]>, start: string): string[] {
  const stack = new LinkedStack<string>();
  const visited = new Set<string>();
  const order: string[] = [];

  stack.push(start);

  while (!stack.isEmpty()) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      order.push(node);
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }
  return order;
}`,
      },
      complexity: {
        time: 'O(V + E) — visits each vertex and edge once',
        space: 'O(V) — stack holds at most V nodes',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Number of Islands (iterative DFS)',
      url: 'https://leetcode.com/problems/number-of-islands/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Implement Stack using Queues',
      url: 'https://leetcode.com/problems/implement-stack-using-queues/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
  ],
};

export default linkedStack;
