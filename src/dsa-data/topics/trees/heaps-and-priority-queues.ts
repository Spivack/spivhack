import type { Topic } from '../../../dsa-types';

const heapsAndPriorityQueues: Topic = {
  id: 'heaps-and-priority-queues',
  title: 'Heaps & Priority Queues',
  description:
    'A priority queue always gives you the smallest (or largest) element in O(log n). The heap is the standard implementation — a complete binary tree stored in an array where every parent is smaller (or larger) than its children.',
  difficulty: 'intermediate',
  category: 'trees',
  tags: ['heap', 'priority-queue', 'min-heap', 'max-heap', 'O(log n)'],
  steps: [
    {
      title: 'The Priority Queue ADT',
      explanation:
        'A priority queue is an abstract data type that supports:\n  insert(val)       — add a value O(log n)\n  extractMin()      — remove and return the minimum value O(log n)\n  peekMin()         — return the minimum without removing O(1)\n\nUnlike a regular queue (FIFO), a priority queue ignores insertion order — the element with the highest priority (lowest value in a min-heap) always comes out first.\n\nUse cases:\n  • Dijkstra\'s shortest path\n  • Prim\'s MST\n  • A* search\n  • Job scheduling (run highest-priority task first)\n  • Top-K problems (keep the K largest seen so far)',
    },
    {
      title: 'The Min-Heap Structure',
      explanation:
        'A min-heap is a complete binary tree where every node\'s value is ≤ its children\'s values.\n\nThe root is always the minimum element.\n\nStored as an array (no pointers needed):\n  For node at index i:\n    Left child:  2i + 1\n    Right child: 2i + 2\n    Parent:      (i - 1) / 2\n\nArray [1, 3, 5, 7, 9, 8, 6] represents:\n        1\n      /   \\\n     3     5\n    / \\   / \\\n   7   9 8   6',
      visualization: {
        type: 'array',
        array: [1, 3, 5, 7, 9, 8, 6],
        pointers: [{ index: 0, label: 'min (root)', color: 'text-green-400' }],
      },
    },
    {
      title: 'Insert — Sift Up',
      explanation:
        'To insert a new value:\n  1. Append the new value to the end of the array (maintains completeness)\n  2. Sift up: compare with parent; if smaller, swap and continue upward\n  3. Stop when the new value is ≥ its parent (or it reaches the root)\n\nThis restores the heap property in O(log n) — the height of the heap.',
      code: {
        python: `import heapq

# Python's heapq is a min-heap:
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
print(heapq.heappop(h))   # → 1 (minimum)

# Manual implementation:
class MinHeap:
    def __init__(self):
        self._data = []

    def insert(self, val):
        self._data.append(val)
        self._sift_up(len(self._data) - 1)

    def _sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self._data[i] < self._data[parent]:
                self._data[i], self._data[parent] = self._data[parent], self._data[i]
                i = parent
            else:
                break`,
        java: `// Java's PriorityQueue is a min-heap:
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.offer(1);
pq.offer(3);
System.out.println(pq.poll()); // → 1

// Max-heap with reversal:
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());`,
        javascript: `class MinHeap {
  #data = [];

  insert(val) {
    this.#data.push(val);
    this.#siftUp(this.#data.length - 1);
  }

  #siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.#data[i] < this.#data[parent]) {
        [this.#data[i], this.#data[parent]] = [this.#data[parent], this.#data[i]];
        i = parent;
      } else break;
    }
  }
}`,
        typescript: `class MinHeap {
  #data: number[] = [];

  insert(val: number): void {
    this.#data.push(val);
    this.#siftUp(this.#data.length - 1);
  }

  #siftUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.#data[i] < this.#data[parent]) {
        [this.#data[i], this.#data[parent]] = [this.#data[parent], this.#data[i]];
        i = parent;
      } else break;
    }
  }
}`,
      },
      complexity: { time: 'O(log n)', space: 'O(1)' },
    },
    {
      title: 'Extract Min — Sift Down',
      explanation:
        'To remove and return the minimum (root):\n  1. Swap the root with the last element\n  2. Remove the last element (it\'s now the old minimum, at the end)\n  3. Sift down the new root: compare with its smaller child; if larger, swap and continue downward\n  4. Stop when the node is ≤ both children (or it\'s a leaf)\n\nThe root is always the minimum — this is O(1) to peek, O(log n) to extract.',
      code: {
        python: `def extract_min(self):
    if not self._data:
        raise IndexError("heap is empty")
    # Swap root with last, remove last
    self._data[0], self._data[-1] = self._data[-1], self._data[0]
    min_val = self._data.pop()
    self._sift_down(0)
    return min_val

def _sift_down(self, i):
    n = len(self._data)
    while True:
        smallest = i
        left  = 2 * i + 1
        right = 2 * i + 2
        if left  < n and self._data[left]  < self._data[smallest]: smallest = left
        if right < n and self._data[right] < self._data[smallest]: smallest = right
        if smallest == i: break
        self._data[i], self._data[smallest] = self._data[smallest], self._data[i]
        i = smallest`,
        java: `public int extractMin() {
    if (data.isEmpty()) throw new NoSuchElementException();
    int min = data.get(0);
    int last = data.remove(data.size() - 1);
    if (!data.isEmpty()) {
        data.set(0, last);
        siftDown(0);
    }
    return min;
}

private void siftDown(int i) {
    int n = data.size();
    while (true) {
        int smallest = i, l = 2*i+1, r = 2*i+2;
        if (l < n && data.get(l) < data.get(smallest)) smallest = l;
        if (r < n && data.get(r) < data.get(smallest)) smallest = r;
        if (smallest == i) break;
        Collections.swap(data, i, smallest);
        i = smallest;
    }
}`,
        javascript: `extractMin() {
  if (!this.#data.length) throw new Error('heap is empty');
  const min = this.#data[0];
  const last = this.#data.pop();
  if (this.#data.length) {
    this.#data[0] = last;
    this.#siftDown(0);
  }
  return min;
}

#siftDown(i) {
  const n = this.#data.length;
  while (true) {
    let smallest = i;
    const l = 2*i+1, r = 2*i+2;
    if (l < n && this.#data[l] < this.#data[smallest]) smallest = l;
    if (r < n && this.#data[r] < this.#data[smallest]) smallest = r;
    if (smallest === i) break;
    [this.#data[i], this.#data[smallest]] = [this.#data[smallest], this.#data[i]];
    i = smallest;
  }
}`,
        typescript: `extractMin(): number {
  if (!this.#data.length) throw new Error('heap is empty');
  const min = this.#data[0];
  const last = this.#data.pop()!;
  if (this.#data.length) {
    this.#data[0] = last;
    this.#siftDown(0);
  }
  return min;
}`,
      },
      complexity: { time: 'O(log n)', space: 'O(1)' },
    },
    {
      title: 'Common Patterns',
      explanation:
        'Heaps appear constantly in algorithm problems:\n\n  Top-K elements: maintain a min-heap of size K while scanning — the heap always holds the K largest seen. O(n log k).\n\n  Merge K sorted lists: push the first element from each list into a min-heap. Extract min, push the next element from that list. Repeat. O(n log k).\n\n  Kth largest in a stream: min-heap of size K. If incoming element > heap minimum, replace it.\n\n  Median of a data stream: one max-heap (lower half) + one min-heap (upper half). Keep sizes equal.',
      callout: {
        type: 'interview',
        text: '"Find the K largest elements" and "Merge K sorted lists" are among the most common heap interview questions. Anytime you see "K largest", "K smallest", or "always need the minimum", reach for a heap.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Kth Largest Element in a Stream',
      url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Top K Frequent Elements',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Merge K Sorted Lists',
      url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
    {
      title: 'Find Median from Data Stream',
      url: 'https://leetcode.com/problems/find-median-from-data-stream/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default heapsAndPriorityQueues;
