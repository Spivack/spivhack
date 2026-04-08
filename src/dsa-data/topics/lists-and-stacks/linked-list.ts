import type { Topic } from '../../../dsa-types';

const linkedList: Topic = {
  id: 'linked-list',
  title: 'Linked List',
  description:
    'A chain of nodes where each node holds a value and a pointer to the next node. O(1) insert/delete at the head, but O(n) access by index. The fundamental alternative to array-based storage.',
  difficulty: 'beginner',
  category: 'lists-and-stacks',
  tags: ['list', 'linked-list', 'pointers', 'data-structure'],
  steps: [
    {
      title: 'Nodes and Pointers',
      explanation:
        'A linked list is a chain of nodes. Each node contains:\n  • A value (the data)\n  • A next pointer — the memory address of the next node\n\nThe list itself holds a head pointer to the first node. The last node\'s next pointer is null, signaling the end of the chain.\n\nUnlike arrays, nodes are not stored in contiguous memory. Each node can live anywhere in the heap — the chain is formed entirely by pointers.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        pointers: [
          { index: 0, label: 'head', color: 'text-green-400' },
          { index: 4, label: 'next→null', color: 'text-green-800' },
        ],
      },
    },
    {
      title: 'Node Definition',
      explanation:
        'A node is a simple object with two fields: the stored value and a reference to the next node.\n\nThe linked list class holds the head reference and a size counter. Without a size counter, you\'d have to traverse the entire list to count elements — O(n) instead of O(1).',
      code: {
        python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None   # pointer to next node

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0`,
        java: `class Node<T> {
    T val;
    Node<T> next;

    Node(T val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedList<T> {
    Node<T> head = null;
    int size = 0;
}`,
        javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  #head = null;
  #size = 0;
}`,
        typescript: `class Node<T> {
  val: T;
  next: Node<T> | null = null;
  constructor(val: T) { this.val = val; }
}

class LinkedList<T> {
  #head: Node<T> | null = null;
  #size = 0;
}`,
      },
    },
    {
      title: 'Insert at Head — O(1)',
      explanation:
        'The fastest operation: insert a new node at the front of the list.\n\n1. Create a new node\n2. Point its next to the current head\n3. Update head to the new node\n4. Increment size\n\nNo traversal needed — just pointer manipulation. Always O(1) regardless of list length.',
      code: {
        python: `def prepend(self, val) -> None:
    node = Node(val)
    node.next = self.head   # point new node at old head
    self.head = node        # new node becomes head
    self.size += 1`,
        java: `public void prepend(T val) {
    Node<T> node = new Node<>(val);
    node.next = head;   // point new node at old head
    head = node;        // new node becomes head
    size++;
}`,
        javascript: `prepend(val) {
  const node = new Node(val);
  node.next = this.#head;
  this.#head = node;
  this.#size++;
}`,
        typescript: `prepend(val: T): void {
  const node = new Node(val);
  node.next = this.#head;
  this.#head = node;
  this.#size++;
}`,
      },
      visualization: {
        type: 'array',
        array: [5, 10, 20, 30],
        highlighted: [0],
        pointers: [{ index: 0, label: 'new head', color: 'text-green-400' }],
      },
      complexity: { time: 'O(1)', space: 'O(1)' },
    },
    {
      title: 'Insert at Tail — O(n) or O(1)',
      explanation:
        'Without a tail pointer, inserting at the end requires traversing the entire list to find the last node — O(n).\n\nWith a tail pointer (a second class-level reference always pointing to the last node), insertion at the tail is O(1).\n\nThe tail pointer pattern is standard. Always maintain it when you expect frequent appends.',
      code: {
        python: `# Without tail pointer — O(n)
def append_slow(self, val) -> None:
    node = Node(val)
    if not self.head:
        self.head = node
    else:
        curr = self.head
        while curr.next:       # traverse to last node
            curr = curr.next
        curr.next = node
    self.size += 1

# With tail pointer — O(1)
def append(self, val) -> None:
    node = Node(val)
    if not self.head:
        self.head = node
        self.tail = node
    else:
        self.tail.next = node  # link old tail to new node
        self.tail = node       # update tail pointer
    self.size += 1`,
        java: `// With tail pointer — O(1)
public void append(T val) {
    Node<T> node = new Node<>(val);
    if (head == null) {
        head = node;
        tail = node;
    } else {
        tail.next = node;   // link old tail forward
        tail = node;        // advance tail pointer
    }
    size++;
}`,
        javascript: `// With tail pointer — O(1)
append(val) {
  const node = new Node(val);
  if (!this.#head) {
    this.#head = node;
    this.#tail = node;
  } else {
    this.#tail.next = node;
    this.#tail = node;
  }
  this.#size++;
}`,
        typescript: `append(val: T): void {
  const node = new Node(val);
  if (!this.#head) {
    this.#head = node;
    this.#tail = node;
  } else {
    this.#tail!.next = node;
    this.#tail = node;
  }
  this.#size++;
}`,
      },
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        highlighted: [4],
        pointers: [
          { index: 0, label: 'head', color: 'text-green-400' },
          { index: 4, label: 'tail', color: 'text-yellow-400' },
        ],
      },
      complexity: { time: 'O(1) with tail pointer, O(n) without', space: 'O(1)' },
    },
    {
      title: 'Delete at Head — O(1)',
      explanation:
        'Removing the first element is O(1): advance head to head.next.\n\nIf the list becomes empty (head.next was null), also set tail to null.',
      code: {
        python: `def delete_head(self):
    if not self.head:
        raise IndexError("list is empty")
    val = self.head.val
    self.head = self.head.next   # advance head
    if not self.head:
        self.tail = None         # list is now empty
    self.size -= 1
    return val`,
        java: `public T deleteHead() {
    if (head == null) throw new NoSuchElementException();
    T val = head.val;
    head = head.next;       // advance head
    if (head == null) tail = null;
    size--;
    return val;
}`,
        javascript: `deleteHead() {
  if (!this.#head) throw new Error('list is empty');
  const val = this.#head.val;
  this.#head = this.#head.next;
  if (!this.#head) this.#tail = null;
  this.#size--;
  return val;
}`,
        typescript: `deleteHead(): T {
  if (!this.#head) throw new Error('list is empty');
  const val = this.#head.val;
  this.#head = this.#head.next;
  if (!this.#head) this.#tail = null;
  this.#size--;
  return val;
}`,
      },
      visualization: {
        type: 'array',
        array: [20, 30, 40, 50],
        highlighted: [0],
        pointers: [{ index: 0, label: 'new head', color: 'text-green-400' }],
      },
      complexity: { time: 'O(1)', space: 'O(1)' },
      callout: {
        type: 'warning',
        text: 'Deleting the tail of a singly linked list is O(n) — you must traverse to find the second-to-last node to update its next pointer. Doubly linked lists solve this.',
      },
    },
    {
      title: 'Traversal and Search — O(n)',
      explanation:
        'Unlike arrays, there is no index-to-address formula. To reach node i, you must walk the chain from head, following next pointers one step at a time.\n\nSearch works the same way: start at head, compare each node\'s value, stop when found or null is reached.',
      code: {
        python: `def get(self, i: int):
    curr = self.head
    for _ in range(i):       # walk i steps from head
        if curr is None:
            raise IndexError("index out of range")
        curr = curr.next
    return curr.val

def search(self, val) -> int:
    curr = self.head
    idx = 0
    while curr:
        if curr.val == val:
            return idx
        curr = curr.next
        idx += 1
    return -1`,
        java: `public T get(int i) {
    Node<T> curr = head;
    for (int j = 0; j < i; j++) {
        curr = curr.next;
    }
    return curr.val;
}

public int search(T val) {
    Node<T> curr = head;
    int idx = 0;
    while (curr != null) {
        if (curr.val.equals(val)) return idx;
        curr = curr.next;
        idx++;
    }
    return -1;
}`,
        javascript: `get(i) {
  let curr = this.#head;
  for (let j = 0; j < i; j++) curr = curr.next;
  return curr.val;
}

search(val) {
  let curr = this.#head, idx = 0;
  while (curr) {
    if (curr.val === val) return idx;
    curr = curr.next;
    idx++;
  }
  return -1;
}`,
        typescript: `get(i: number): T {
  let curr = this.#head;
  for (let j = 0; j < i; j++) curr = curr!.next;
  return curr!.val;
}

search(val: T): number {
  let curr = this.#head, idx = 0;
  while (curr) {
    if (curr.val === val) return idx;
    curr = curr.next;
    idx++;
  }
  return -1;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      title: 'Array vs Linked List',
      explanation:
        'Choosing between an array list and a linked list comes down to your access pattern:\n\n  Operation          Array List    Linked List\n  ──────────────────────────────────────────────\n  Access by index    O(1)          O(n)\n  Search             O(n)          O(n)\n  Insert at front    O(n)          O(1)\n  Insert at back     O(1)*         O(1)†\n  Insert at middle   O(n)          O(n)‡\n  Delete at front    O(n)          O(1)\n  Delete at back     O(1)          O(n)§\n  Space per element  Low           Higher (+ pointer)\n\n  * Amortized — occasional O(n) resize\n  † With tail pointer\n  ‡ O(n) to find position, then O(1) to rewire\n  § O(n) for singly linked; O(1) for doubly linked',
      callout: {
        type: 'interview',
        text: 'Default to arrays unless you specifically need O(1) insertions at the front. In practice, pointer overhead and cache locality make arrays faster than linked lists for most workloads even when theory suggests otherwise.',
      },
      complexity: {
        time: 'O(1) head operations, O(n) access/search',
        space: 'O(n) — plus pointer overhead per node',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Reverse Linked List',
      url: 'https://leetcode.com/problems/reverse-linked-list/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Merge Two Sorted Lists',
      url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Linked List Cycle',
      url: 'https://leetcode.com/problems/linked-list-cycle/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
  ],
};

export default linkedList;
