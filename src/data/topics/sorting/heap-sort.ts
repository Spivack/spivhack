import type { Topic } from '../../../types';

const heapSort: Topic = {
  id: 'heap-sort',
  title: 'Heap Sort',
  description:
    'Uses a max-heap to repeatedly extract the largest element and place it at the end of the array. Guaranteed O(n log n) in all cases, in-place, and no worst-case pitfalls. The sort of choice when you need guaranteed performance.',
  difficulty: 'intermediate',
  category: 'sorting',
  tags: ['sorting', 'heap', 'in-place', 'O(n log n)', 'not-stable'],
  steps: [
    {
      title: 'The Max-Heap Property',
      explanation:
        'A heap is a complete binary tree stored in an array where every parent is greater than or equal to its children (max-heap).\n\nFor a node at index i:\n  • Left child:  2i + 1\n  • Right child: 2i + 2\n  • Parent:      (i - 1) / 2\n\nThe root (index 0) is always the maximum element.\n\nHeap Sort uses this property twice:\n  1. Build a max-heap from the unsorted array\n  2. Repeatedly swap the root (max) to the end, then restore the heap property',
      visualization: {
        type: 'array',
        array: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1],
        pointers: [{ index: 0, label: 'max (root)', color: 'text-green-400' }],
      },
    },
    {
      title: 'Heapify — Restoring the Heap',
      explanation:
        'Heapify is the core operation: given that a node\'s children are valid heaps, push the node down until the heap property is restored.\n\nAlgorithm for node at index i, with heap size n:\n  1. Find the largest among node i, left child, right child\n  2. If node i is not the largest, swap it with the largest child\n  3. Recurse down the subtree where the swap happened\n\nThis takes O(log n) — the height of the heap.',
      code: {
        python: `def heapify(arr, n, i):
    largest = i           # assume parent is largest
    left  = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)  # fix the subtree`,
        java: `private static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left  = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])   largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        heapify(arr, n, largest);
    }
}`,
        javascript: `function heapify(arr, n, i) {
  let largest = i;
  const left  = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest])   largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
        typescript: `function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left  = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest])   largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      },
      complexity: { time: 'O(log n)', space: 'O(log n) stack' },
    },
    {
      title: 'Building the Heap — O(n)',
      explanation:
        'To build a max-heap from an unsorted array, call heapify on every non-leaf node, starting from the bottom and working up.\n\nLeaves (indices n/2 to n-1) are already valid single-element heaps — skip them.\nStart from the last non-leaf: index n/2 - 1.\n\nThis runs in O(n), not O(n log n) as you might expect. Most heapify calls near the bottom work on small subtrees — the savings add up.',
      code: {
        python: `def build_heap(arr):
    n = len(arr)
    # Start from last non-leaf, work upward
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)`,
        java: `private static void buildHeap(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}`,
        javascript: `function buildHeap(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
}`,
        typescript: `function buildHeap(arr: number[]): void {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)', note: 'O(n) build is a non-obvious but provable result — despite each heapify being O(log n), the total work sums to O(n).' },
    },
    {
      title: 'The Full Sort',
      explanation:
        'With the heap built:\n  1. The max element is at index 0 (the root)\n  2. Swap root with the last element — the max is now in its final sorted position\n  3. Shrink the heap size by 1 (the last element is sorted, exclude it)\n  4. Heapify the root to restore the max-heap property\n  5. Repeat until heap size is 1\n\nEach extraction takes O(log n), and we do n-1 extractions → O(n log n) total.',
      code: {
        python: `def heap_sort(arr):
    n = len(arr)

    # Build max-heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # move max to end
        heapify(arr, i, 0)               # restore heap on reduced array

    return arr`,
        java: `public static int[] heapSort(int[] arr) {
    int n = arr.length;

    // Build max-heap
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Extract elements
    for (int i = n - 1; i > 0; i--) {
        int tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp;
        heapify(arr, i, 0);
    }
    return arr;
}`,
        javascript: `function heapSort(arr) {
  const n = arr.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}`,
        typescript: `function heapSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}`,
      },
      complexity: {
        time: 'O(n log n) — all cases',
        space: 'O(1)',
        note: 'Unlike Quicksort, Heap Sort has no bad inputs. O(n log n) is guaranteed regardless of input order.',
      },
    },
    {
      title: 'Properties and Trade-offs',
      explanation:
        'Heap Sort vs the field:\n\n  vs Quicksort:\n    • Heap Sort: O(n log n) guaranteed, no extra space\n    • Quicksort: O(n log n) average, O(n²) worst — but faster in practice due to better cache behavior\n\n  vs Merge Sort:\n    • Heap Sort: O(1) space, not stable\n    • Merge Sort: O(n) space, stable, better cache behavior\n\n  vs Insertion/Selection Sort:\n    • Heap Sort wins on large inputs decisively\n\nHeap Sort is not stable — a swap during extraction can reorder equal elements.\n\nReal-world usage: Heap Sort underlies std::sort in some C++ implementations (as the fallback in Introsort when Quicksort exceeds its recursion depth limit).',
      callout: {
        type: 'interview',
        text: 'Heap Sort is the answer to "which sort is O(n log n) worst case AND O(1) space?" — it\'s the only common sort that satisfies both. Merge Sort is O(n log n) but needs O(n) space. Quicksort is O(1) space but O(n²) worst case.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Top K Frequent Elements',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default heapSort;
