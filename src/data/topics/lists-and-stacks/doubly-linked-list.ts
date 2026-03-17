import type { Topic } from '../../../types';

const doublyLinkedList: Topic = {
  id: 'doubly-linked-list',
  title: 'Doubly Linked List',
  description:
    'A linked list where each node holds both a next and a prev pointer. Enables O(1) deletion given a node reference and O(1) tail operations without a separate tail pointer. The backing structure of Python\'s deque and many LRU cache implementations.',
  difficulty: 'intermediate',
  category: 'lists-and-stacks',
  tags: ['list', 'linked-list', 'doubly-linked', 'pointers', 'data-structure'],
  steps: [
    {
      title: 'Adding the prev Pointer',
      explanation:
        'A singly linked list can only move forward — each node knows its successor but not its predecessor.\n\nA doubly linked list adds a prev pointer to each node:\n  node.next → the node after this one\n  node.prev → the node before this one\n\nThis two-way linkage unlocks:\n• O(1) deletion given any node reference (no need to find the predecessor)\n• O(1) traversal in either direction\n• O(1) tail deletion without traversal\n\nThe tradeoff: each node uses more memory (one extra pointer), and every insert/delete must update both next and prev.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        pointers: [
          { index: 0, label: 'head', color: 'text-green-400' },
          { index: 4, label: 'tail', color: 'text-yellow-400' },
        ],
      },
    },
    {
      title: 'Node Definition',
      explanation:
        'Each node now has three fields: val, next, and prev.\n\nThe list maintains both a head and tail pointer. Both point to null in an empty list, and to the same node in a single-element list.',
      code: {
        python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0`,
        java: `class Node<T> {
    T val;
    Node<T> next;
    Node<T> prev;

    Node(T val) { this.val = val; }
}

class DoublyLinkedList<T> {
    Node<T> head = null;
    Node<T> tail = null;
    int size = 0;
}`,
        javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  #head = null;
  #tail = null;
  #size = 0;
}`,
        typescript: `class Node<T> {
  val: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;
  constructor(val: T) { this.val = val; }
}

class DoublyLinkedList<T> {
  #head: Node<T> | null = null;
  #tail: Node<T> | null = null;
  #size = 0;
}`,
      },
    },
    {
      title: 'Insert at Head and Tail — O(1)',
      explanation:
        'Both head and tail insertions are O(1) since we hold direct references to both ends.\n\nFor each insert, we must wire up four pointers:\n  new_node.next and new_node.prev\n  the neighbor\'s opposite pointer\n  the list\'s head or tail reference',
      code: {
        python: `def prepend(self, val) -> None:
    node = Node(val)
    if not self.head:
        self.head = self.tail = node
    else:
        node.next = self.head
        self.head.prev = node   # wire backward link
        self.head = node
    self.size += 1

def append(self, val) -> None:
    node = Node(val)
    if not self.tail:
        self.head = self.tail = node
    else:
        node.prev = self.tail
        self.tail.next = node   # wire forward link
        self.tail = node
    self.size += 1`,
        java: `public void prepend(T val) {
    Node<T> node = new Node<>(val);
    if (head == null) { head = tail = node; }
    else {
        node.next = head;
        head.prev = node;
        head = node;
    }
    size++;
}

public void append(T val) {
    Node<T> node = new Node<>(val);
    if (tail == null) { head = tail = node; }
    else {
        node.prev = tail;
        tail.next = node;
        tail = node;
    }
    size++;
}`,
        javascript: `prepend(val) {
  const node = new Node(val);
  if (!this.#head) { this.#head = this.#tail = node; }
  else {
    node.next = this.#head;
    this.#head.prev = node;
    this.#head = node;
  }
  this.#size++;
}

append(val) {
  const node = new Node(val);
  if (!this.#tail) { this.#head = this.#tail = node; }
  else {
    node.prev = this.#tail;
    this.#tail.next = node;
    this.#tail = node;
  }
  this.#size++;
}`,
        typescript: `prepend(val: T): void {
  const node = new Node(val);
  if (!this.#head) { this.#head = this.#tail = node; }
  else {
    node.next = this.#head;
    this.#head.prev = node;
    this.#head = node;
  }
  this.#size++;
}

append(val: T): void {
  const node = new Node(val);
  if (!this.#tail) { this.#head = this.#tail = node; }
  else {
    node.prev = this.#tail;
    this.#tail.next = node;
    this.#tail = node;
  }
  this.#size++;
}`,
      },
      complexity: { time: 'O(1)', space: 'O(1)' },
    },
    {
      title: 'Delete a Node — O(1)',
      explanation:
        'This is the killer feature of doubly linked lists: if you already hold a reference to a node, you can delete it in O(1) — no traversal needed.\n\nIn a singly linked list, you must find the predecessor by traversing from head (O(n)) before you can unlink the node. With prev pointers, the predecessor is node.prev — directly accessible.\n\nSteps:\n1. Set node.prev.next = node.next (skip over node going forward)\n2. Set node.next.prev = node.prev (skip over node going backward)\n3. Handle edge cases: deleting head or tail',
      code: {
        python: `def delete_node(self, node) -> None:
    if node.prev:
        node.prev.next = node.next   # bypass node going forward
    else:
        self.head = node.next        # node was head

    if node.next:
        node.next.prev = node.prev   # bypass node going backward
    else:
        self.tail = node.prev        # node was tail

    self.size -= 1`,
        java: `public void deleteNode(Node<T> node) {
    if (node.prev != null)
        node.prev.next = node.next;
    else
        head = node.next;           // node was head

    if (node.next != null)
        node.next.prev = node.prev;
    else
        tail = node.prev;           // node was tail

    size--;
}`,
        javascript: `deleteNode(node) {
  if (node.prev) node.prev.next = node.next;
  else this.#head = node.next;

  if (node.next) node.next.prev = node.prev;
  else this.#tail = node.prev;

  this.#size--;
}`,
        typescript: `deleteNode(node: Node<T>): void {
  if (node.prev) node.prev.next = node.next;
  else this.#head = node.next;

  if (node.next) node.next.prev = node.prev;
  else this.#tail = node.prev;

  this.#size--;
}`,
      },
      highlightLines: {
        python: [2, 3, 6, 7],
        java: [2, 3, 7, 8],
        javascript: [2, 4],
        typescript: [2, 4],
      },
      complexity: { time: 'O(1)', space: 'O(1)' },
      callout: {
        type: 'insight',
        text: 'O(1) node deletion with a reference is why doubly linked lists back LRU caches: when a cached item is accessed, it can be moved to the front instantly without searching.',
      },
    },
    {
      title: 'Real-World Use: LRU Cache',
      explanation:
        'The LRU (Least Recently Used) cache is the canonical doubly linked list application, and a very common interview problem.\n\nStructure:\n• A doubly linked list ordered by recency (most recent at head)\n• A hash map: key → node reference (for O(1) lookup)\n\nOperations:\n  get(key)   — look up node in map (O(1)), move it to head (O(1) with prev pointer)\n  put(key)   — insert node at head (O(1)); if capacity exceeded, delete tail node (O(1))\n\nWithout a doubly linked list, moving a node to the front would require O(n) traversal to find its predecessor. The prev pointer makes it O(1).',
      callout: {
        type: 'interview',
        text: '"Design an LRU Cache" (LeetCode #146) is one of the most common medium-hard interview questions. The answer is always: doubly linked list + hash map. Knowing why the DLL is needed (O(1) arbitrary deletion) is as important as the implementation.',
      },
      complexity: {
        time: 'O(1) for all LRU cache operations',
        space: 'O(capacity)',
        note: 'The doubly linked list is what enables O(1) deletion from the middle (tail eviction) and O(1) promotion to the head.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'LRU Cache',
      url: 'https://leetcode.com/problems/lru-cache/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Design Browser History',
      url: 'https://leetcode.com/problems/design-browser-history/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default doublyLinkedList;
