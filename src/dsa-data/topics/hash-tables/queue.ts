import type { Topic } from '../../../dsa-types';

const queue: Topic = {
  id: 'queue',
  title: 'Queue',
  description:
    'A First-In First-Out (FIFO) data structure: elements are added at the back and removed from the front. The natural model for task scheduling, BFS, and any situation where order of arrival matters.',
  difficulty: 'beginner',
  category: 'hash-tables',
  tags: ['queue', 'FIFO', 'deque', 'linked-queue', 'data-structure'],
  steps: [
    {
      title: 'The Queue ADT',
      explanation:
        'A queue is a FIFO (First-In, First-Out) structure — the first element enqueued is the first one dequeued.\n\nCore operations:\n  enqueue(val)  — add val to the back\n  dequeue()     — remove and return the front element\n  peek()        — return the front element without removing it\n  isEmpty()     — return true if empty\n  size()        — return number of elements\n\nReal-world queues: checkout lines, print spoolers, OS process scheduling, network packet buffers.\n\nContrast with a stack (LIFO): in a stack you remove the most recently added item; in a queue you remove the oldest.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40],
        pointers: [
          { index: 0, label: 'front (dequeue)', color: 'text-green-400' },
          { index: 3, label: 'back (enqueue)', color: 'text-yellow-400' },
        ],
      },
    },
    {
      title: 'Array-Based Queue (Circular Buffer)',
      explanation:
        'Naively using an array and shifting elements on dequeue is O(n). Instead, use a circular buffer:\n\n  • Maintain a front pointer and a back pointer\n  • Enqueue: place at back, advance back pointer\n  • Dequeue: read from front, advance front pointer\n  • Both pointers wrap around using modulo\n\nThis gives O(1) enqueue and dequeue with no shifting.\n\nResize (double capacity) when the buffer is full — same amortized O(1) as a dynamic array.',
      code: {
        python: `class Queue:
    def __init__(self, capacity=8):
        self._data = [None] * capacity
        self._front = 0
        self._size  = 0

    def enqueue(self, val) -> None:
        if self._size == len(self._data):
            self._resize()
        back = (self._front + self._size) % len(self._data)
        self._data[back] = val
        self._size += 1

    def dequeue(self):
        if self._size == 0:
            raise IndexError("queue is empty")
        val = self._data[self._front]
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return val

    def peek(self):
        if self._size == 0:
            raise IndexError("queue is empty")
        return self._data[self._front]

    def _resize(self):
        old = self._data
        self._data = [None] * (2 * len(old))
        for i in range(self._size):
            self._data[i] = old[(self._front + i) % len(old)]
        self._front = 0`,
        java: `public class Queue<T> {
    private Object[] data;
    private int front = 0, size = 0;

    public Queue(int capacity) { data = new Object[capacity]; }

    public void enqueue(T val) {
        if (size == data.length) resize();
        data[(front + size) % data.length] = val;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (size == 0) throw new NoSuchElementException();
        T val = (T) data[front];
        front = (front + 1) % data.length;
        size--;
        return val;
    }
}`,
        javascript: `class Queue {
  #data;
  #front = 0;
  #size  = 0;

  constructor(capacity = 8) { this.#data = new Array(capacity); }

  enqueue(val) {
    if (this.#size === this.#data.length) this.#resize();
    this.#data[(this.#front + this.#size) % this.#data.length] = val;
    this.#size++;
  }

  dequeue() {
    if (this.#size === 0) throw new Error('queue is empty');
    const val = this.#data[this.#front];
    this.#front = (this.#front + 1) % this.#data.length;
    this.#size--;
    return val;
  }

  #resize() {
    const old = this.#data;
    this.#data = new Array(old.length * 2);
    for (let i = 0; i < this.#size; i++)
      this.#data[i] = old[(this.#front + i) % old.length];
    this.#front = 0;
  }
}`,
        typescript: `class Queue<T> {
  #data: (T | undefined)[];
  #front = 0;
  #size  = 0;

  constructor(capacity = 8) { this.#data = new Array(capacity); }

  enqueue(val: T): void {
    if (this.#size === this.#data.length) this.#resize();
    this.#data[(this.#front + this.#size) % this.#data.length] = val;
    this.#size++;
  }

  dequeue(): T {
    if (this.#size === 0) throw new Error('queue is empty');
    const val = this.#data[this.#front] as T;
    this.#front = (this.#front + 1) % this.#data.length;
    this.#size--;
    return val;
  }

  #resize(): void {
    const old = this.#data;
    this.#data = new Array(old.length * 2);
    for (let i = 0; i < this.#size; i++)
      this.#data[i] = old[(this.#front + i) % old.length];
    this.#front = 0;
  }
}`,
      },
      complexity: { time: 'O(1) amortized enqueue/dequeue', space: 'O(n)' },
    },
    {
      title: 'Linked Queue',
      explanation:
        'The linked queue uses a singly linked list with head (front) and tail (back) pointers.\n\n  Enqueue: append a new node at the tail — O(1)\n  Dequeue: remove the node at the head — O(1)\n\nNo resizing needed — nodes are allocated on demand. Memory per element is higher (pointer overhead), but there\'s no wasted capacity from a preallocated buffer.',
      code: {
        python: `from collections import deque

# Python's deque is a doubly-linked queue — use it directly:
q = deque()
q.append(10)    # enqueue (back)
q.append(20)
val = q.popleft()  # dequeue (front) → 10

# Manual linked implementation:
class Node:
    def __init__(self, val):
        self.val  = val
        self.next = None

class LinkedQueue:
    def __init__(self):
        self.head = self.tail = None
        self.size = 0

    def enqueue(self, val):
        node = Node(val)
        if self.tail: self.tail.next = node
        else:         self.head = node
        self.tail = node
        self.size += 1

    def dequeue(self):
        if not self.head: raise IndexError("empty")
        val = self.head.val
        self.head = self.head.next
        if not self.head: self.tail = None
        self.size -= 1
        return val`,
        java: `// Java's ArrayDeque is the recommended Queue implementation:
Queue<Integer> q = new ArrayDeque<>();
q.offer(10);         // enqueue
q.offer(20);
int val = q.poll();  // dequeue → 10

// LinkedList also implements Queue:
Queue<Integer> lq = new LinkedList<>();`,
        javascript: `// JS arrays with shift() work but are O(n).
// For a real queue, use a linked approach or a library.

class LinkedQueue {
  #head = null;
  #tail = null;
  #size = 0;

  enqueue(val) {
    const node = { val, next: null };
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
  }

  dequeue() {
    if (!this.#head) throw new Error('empty');
    const val = this.#head.val;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return val;
  }
}`,
        typescript: `class LinkedQueue<T> {
  #head: { val: T; next: typeof this.#head } | null = null;
  #tail: typeof this.#head = null;
  #size = 0;

  enqueue(val: T): void {
    const node = { val, next: null } as NonNullable<typeof this.#head>;
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
  }

  dequeue(): T {
    if (!this.#head) throw new Error('empty');
    const val = this.#head.val;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return val;
  }
}`,
      },
      complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
    },
    {
      title: 'Deque and Real-World Uses',
      explanation:
        'A deque (double-ended queue) supports O(1) insert and remove at both ends:\n  • appendleft / popleft (front)\n  • append / pop (back)\n\nA deque can serve as both a stack and a queue.\n\nCommon queue use cases:\n\n  BFS: the queue of nodes to visit next\n  Task scheduling: OS scheduling, printer queues, thread pools\n  Sliding window: a deque tracks max/min in a window efficiently\n  Rate limiting: track requests in a time window\n  Undo/redo with history limit: deque of bounded size',
      callout: {
        type: 'interview',
        text: '"Sliding Window Maximum" (LeetCode hard) is the canonical deque interview problem. A deque tracks candidate maximums — front always holds the max of the current window. Know this pattern cold.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Implement Queue using Stacks',
      url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Design Circular Queue',
      url: 'https://leetcode.com/problems/design-circular-queue/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Sliding Window Maximum',
      url: 'https://leetcode.com/problems/sliding-window-maximum/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default queue;
